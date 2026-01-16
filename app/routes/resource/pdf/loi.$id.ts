import {renderToBuffer} from '@react-pdf/renderer'
import {getAuth} from '@clerk/react-router/server'
import {LOIDocument, type LOIData} from '~/lib/pdf/loi-template'
import {viewClient} from '~/sanity/client.server'

import type {Route} from './+types/loi.$id'

const LOI_PDF_QUERY = `*[_type == "letterOfIntent" && _id == $id][0]{
  _id,
  status,
  investmentAmount,
  submittedAt,
  reviewedAt,
  investorNotes,
  "investor": investor->{
    _id,
    name,
    email,
    phone,
    accreditedStatus,
    clerkId
  },
  "prospectus": prospectus->{
    _id,
    title,
    targetReturn,
    minimumInvestment,
    propertyType,
    location
  },
  countersignedBy,
  countersignedAt
}`

interface SanityLOI {
  _id: string
  status: 'submitted' | 'review' | 'approved' | 'rejected'
  investmentAmount: number
  submittedAt: string
  reviewedAt?: string
  investorNotes?: string
  investor: {
    _id: string
    name: string
    email: string
    phone?: string
    accreditedStatus?: string
    clerkId?: string
  }
  prospectus: {
    _id: string
    title: string
    targetReturn?: string
    minimumInvestment?: number
    propertyType?: string
    location?: string
  }
  countersignedBy?: string
  countersignedAt?: string
}

export async function loader(args: Route.LoaderArgs) {
  const {params} = args
  const {id} = params
  const {userId} = await getAuth(args)

  if (!id) {
    throw new Response('LOI ID required', {status: 400})
  }

  // Fetch LOI data from Sanity
  const loi = await viewClient.fetch<SanityLOI | null>(LOI_PDF_QUERY, {id})

  if (!loi) {
    throw new Response('Letter of Intent not found', {status: 404})
  }

  // Security check: Only allow the investor who submitted the LOI to download it
  // (or admin users - we can add that later)
  if (userId && loi.investor?.clerkId !== userId) {
    throw new Response('Unauthorized to access this LOI', {status: 403})
  }

  // Prepare data for PDF template
  const pdfData: LOIData = {
    loiId: loi._id,
    status: loi.status,
    submittedAt: loi.submittedAt,
    reviewedAt: loi.reviewedAt,
    investmentAmount: loi.investmentAmount,
    investorNotes: loi.investorNotes,
    investor: {
      name: loi.investor?.name || 'Unknown Investor',
      email: loi.investor?.email || '',
      phone: loi.investor?.phone,
      accreditedStatus: loi.investor?.accreditedStatus,
    },
    prospectus: {
      title: loi.prospectus?.title || 'Unknown Opportunity',
      targetReturn: loi.prospectus?.targetReturn,
      minimumInvestment: loi.prospectus?.minimumInvestment,
      propertyType: loi.prospectus?.propertyType,
      location: loi.prospectus?.location,
    },
    countersignedBy: loi.countersignedBy,
    countersignedAt: loi.countersignedAt,
  }

  // Generate PDF buffer
  const pdfBuffer = await renderToBuffer(LOIDocument({data: pdfData}))

  // Create filename
  const prospectusSlug = loi.prospectus?.title
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') || 'investment'
  const filename = `loi-${prospectusSlug}-${loi._id.slice(-8)}.pdf`

  return new Response(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-cache',
    },
  })
}
