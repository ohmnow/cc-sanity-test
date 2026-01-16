import type {Route} from './+types/submit-loi'
import {createClient, type SanityClient} from '@sanity/client'
import {sendLoiSubmittedEmails} from '~/lib/email.server'
import {projectDetails} from '~/sanity/projectDetails'
import {INVESTOR_BY_CLERK_ID_QUERY, PROSPECTUS_QUERY} from '~/sanity/queries'

// Lazy client initialization - created on first use
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
      token: process.env.SANITY_WRITE_TOKEN,
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

interface LOISubmission {
  clerkId: string
  prospectusSlug: string
  investmentAmount: number
  fundingSource: string
  investorType: string
  signature: string
  investorNotes?: string
}

export async function action({request}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json({error: 'Method not allowed'}, {status: 405})
  }

  try {
    const data: LOISubmission = await request.json()

    // Validate required fields
    if (!data.clerkId || !data.prospectusSlug || !data.investmentAmount || !data.signature) {
      return Response.json({error: 'Missing required fields'}, {status: 400})
    }

    // Get the investor by Clerk ID
    const investor = await getReadClient().fetch(INVESTOR_BY_CLERK_ID_QUERY, {
      clerkId: data.clerkId,
    })

    if (!investor) {
      return Response.json({error: 'Investor not found'}, {status: 404})
    }

    // Get the prospectus
    const prospectus = await getReadClient().fetch(PROSPECTUS_QUERY, {
      slug: data.prospectusSlug,
    })

    if (!prospectus) {
      return Response.json({error: 'Prospectus not found'}, {status: 404})
    }

    // Validate investment amount against minimum
    if (prospectus.minimumInvestment && data.investmentAmount < prospectus.minimumInvestment) {
      return Response.json({
        error: `Investment amount must be at least ${prospectus.minimumInvestment}`,
      }, {status: 400})
    }

    // Check if prospectus is open for investment
    if (prospectus.status !== 'open') {
      return Response.json({error: 'This opportunity is not open for investment'}, {status: 400})
    }

    // Check if investor already has an LOI for this prospectus
    const existingLOI = await getReadClient().fetch(
      `*[_type == "letterOfIntent" && investor._ref == $investorId && prospectus._ref == $prospectusId && status in ["submitted", "review", "approved"]][0]._id`,
      {investorId: investor._id, prospectusId: prospectus._id}
    )

    if (existingLOI) {
      return Response.json({
        error: 'You have already submitted a Letter of Intent for this opportunity',
      }, {status: 400})
    }

    // Get client IP for signature record
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      'unknown'

    // Create the LOI document
    const loi = {
      _type: 'letterOfIntent',
      investor: {
        _type: 'reference',
        _ref: investor._id,
      },
      prospectus: {
        _type: 'reference',
        _ref: prospectus._id,
      },
      investmentAmount: data.investmentAmount,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      investorNotes: data.investorNotes || '',
      investorSignature: {
        signed: true,
        signedAt: new Date().toISOString(),
        ipAddress,
      },
    }

    const result = await getWriteClient().create(loi)

    // Send email notifications (non-blocking)
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(data.investmentAmount)

    sendLoiSubmittedEmails({
      investorName: investor.name,
      investorEmail: investor.email,
      prospectusTitle: prospectus.title,
      investmentAmount: formattedAmount,
      loiId: result._id,
    }).catch((err) => console.error('[Email] Failed to send LOI emails:', err))

    return Response.json({
      success: true,
      loiId: result._id,
      message: 'Letter of Intent submitted successfully',
    })
  } catch (error) {
    console.error('Error submitting LOI:', error)
    return Response.json({error: 'Failed to submit Letter of Intent'}, {status: 500})
  }
}

export function loader() {
  return Response.json({error: 'Method not allowed'}, {status: 405})
}
