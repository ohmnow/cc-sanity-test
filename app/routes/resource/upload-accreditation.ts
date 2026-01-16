import type {Route} from './+types/upload-accreditation'
import {createClient, type SanityClient} from '@sanity/client'
import {projectDetails} from '~/sanity/projectDetails'
import {nanoid} from 'nanoid'

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

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']

export async function action({request}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json({error: 'Method not allowed'}, {status: 405})
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string | null
    const documentType = formData.get('documentType') as string | null
    const investorId = formData.get('investorId') as string | null

    // Validate required fields
    if (!file || !title || !investorId) {
      return Response.json({error: 'Missing required fields'}, {status: 400})
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return Response.json({error: 'File size must be less than 10MB'}, {status: 400})
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({
        error: 'Invalid file type. Allowed: PDF, JPG, PNG',
      }, {status: 400})
    }

    // Verify the investor exists
    const investor = await getReadClient().fetch<{_id: string} | null>(
      `*[_type == "investor" && _id == $investorId][0]{_id}`,
      {investorId}
    )

    if (!investor) {
      return Response.json({error: 'Investor not found'}, {status: 404})
    }

    // Upload file to Sanity
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `accreditation-${investorId}-${Date.now()}-${file.name}`

    const asset = await getWriteClient().assets.upload('file', buffer, {
      filename,
      contentType: file.type,
    })

    // Create the document entry
    const documentEntry = {
      _key: nanoid(),
      _type: 'accreditationDocument',
      title,
      documentType: documentType || 'other',
      file: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      },
      uploadedAt: new Date().toISOString(),
      status: 'pending',
    }

    // Append to investor's accreditation documents
    await getWriteClient()
      .patch(investorId)
      .setIfMissing({accreditationDocuments: []})
      .append('accreditationDocuments', [documentEntry])
      .commit()

    return Response.json({
      success: true,
      message: 'Document uploaded successfully',
      documentKey: documentEntry._key,
    })
  } catch (error) {
    console.error('Error uploading accreditation document:', error)
    return Response.json({error: 'Failed to upload document'}, {status: 500})
  }
}

export function loader() {
  return Response.json({error: 'Method not allowed'}, {status: 405})
}
