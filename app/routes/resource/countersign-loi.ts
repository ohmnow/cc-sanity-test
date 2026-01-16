import type {Route} from './+types/countersign-loi'
import {createClient, type SanityClient} from '@sanity/client'
import {sendLoiStatusUpdateEmail} from '~/lib/email.server'
import {projectDetails} from '~/sanity/projectDetails'

// Lazy client initialization
let _writeClient: SanityClient | null = null
let _readClient: SanityClient | null = null

function getWriteClient(): SanityClient {
  if (!_writeClient) {
    const {projectId, dataset, apiVersion} = projectDetails()
    _writeClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: process.env.SANITY_WRITE_TOKEN?.trim(),
    })
  }
  return _writeClient
}

function getReadClient(): SanityClient {
  if (!_readClient) {
    const {projectId, dataset, apiVersion} = projectDetails()
    _readClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  }
  return _readClient
}

interface CountersignSubmission {
  loiId: string
  signerName: string
  signerEmail: string
  signerTitle: string
  signatureImage: string
}

// Helper to upload base64 image to Sanity
async function uploadSignatureImage(
  client: SanityClient,
  base64Data: string,
  filename: string
): Promise<{_type: 'image'; asset: {_type: 'reference'; _ref: string}} | null> {
  try {
    // Extract base64 data (remove data URL prefix if present)
    const base64Match = base64Data.match(/^data:image\/\w+;base64,(.+)$/)
    if (!base64Match) {
      console.error('Invalid base64 image format')
      return null
    }

    const buffer = Buffer.from(base64Match[1], 'base64')

    // Upload to Sanity
    const asset = await client.assets.upload('image', buffer, {
      filename,
      contentType: 'image/png',
    })

    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.error('Failed to upload signature image:', error)
    return null
  }
}

export async function action({request}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json({error: 'Method not allowed'}, {status: 405})
  }

  try {
    const data: CountersignSubmission = await request.json()

    // Validate required fields
    if (!data.loiId || !data.signerName || !data.signerEmail || !data.signerTitle || !data.signatureImage) {
      return Response.json({error: 'Missing required fields'}, {status: 400})
    }

    // Verify the LOI exists and is in approved status
    const loi = await getReadClient().fetch<{
      _id: string
      status: string
      investor: {name: string; email: string} | null
      prospectus: {title: string} | null
    }>(`*[_type == "letterOfIntent" && _id == $loiId][0]{
      _id,
      status,
      "investor": investor->{name, email},
      "prospectus": prospectus->{title}
    }`, {loiId: data.loiId})

    if (!loi) {
      return Response.json({error: 'LOI not found'}, {status: 404})
    }

    if (loi.status !== 'approved') {
      return Response.json({error: 'LOI must be approved before countersigning'}, {status: 400})
    }

    // Get client IP for signature record
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      'unknown'

    // Upload signature image to Sanity
    const signatureImageAsset = await uploadSignatureImage(
      getWriteClient(),
      data.signatureImage,
      `company-signature-${data.loiId}-${Date.now()}.png`
    )

    // Update the LOI with company signature
    await getWriteClient()
      .patch(data.loiId)
      .set({
        status: 'countersigned',
        companySignature: {
          signed: true,
          signedAt: new Date().toISOString(),
          signerName: data.signerName,
          signerEmail: data.signerEmail,
          signerTitle: data.signerTitle,
          ipAddress,
          ...(signatureImageAsset && {signatureImage: signatureImageAsset}),
        },
      })
      .commit()

    // Send email notification to investor (non-blocking)
    if (loi.investor?.email && loi.prospectus?.title) {
      sendLoiStatusUpdateEmail({
        investorName: loi.investor.name,
        investorEmail: loi.investor.email,
        prospectusTitle: loi.prospectus.title,
        status: 'countersigned',
      }).catch((err) => console.error('[Email] Failed to send countersigned email:', err))
    }

    return Response.json({
      success: true,
      message: 'LOI countersigned successfully',
    })
  } catch (error) {
    console.error('Error countersigning LOI:', error)
    return Response.json({error: 'Failed to countersign LOI'}, {status: 500})
  }
}

export function loader() {
  return Response.json({error: 'Method not allowed'}, {status: 405})
}
