import {renderToBuffer} from '@react-pdf/renderer'
import {ProspectusDocument, type ProspectusData} from '~/lib/pdf/prospectus-template'
import {getViewClient} from '~/sanity/client.server'

const PROSPECTUS_PDF_QUERY = `*[_type == "prospectus" && _id == $id][0]{
  _id,
  title,
  "propertyType": propertyType,
  "location": location,
  targetReturn,
  minimumInvestment,
  projectTimeline,
  totalRaise,
  "description": coalesce(pt::text(overview), ""),
  "highlights": highlights[],
  status
}`

interface SanityProspectus {
  _id: string
  title: string
  propertyType?: string
  location?: string
  targetReturn?: string
  minimumInvestment?: number
  projectTimeline?: string
  totalRaise?: number
  description?: string
  highlights?: string[]
  status?: string
}

export async function loader({params}: {params: {id: string}}) {
  const {id} = params

  if (!id) {
    throw new Response('Prospectus ID required', {status: 400})
  }

  // Fetch prospectus data from Sanity
  const prospectus = await getViewClient().fetch<SanityProspectus | null>(
    PROSPECTUS_PDF_QUERY,
    {id}
  )

  if (!prospectus) {
    throw new Response('Prospectus not found', {status: 404})
  }

  // Prepare data for PDF template
  const pdfData: ProspectusData = {
    title: prospectus.title,
    propertyType: prospectus.propertyType,
    location: prospectus.location,
    targetReturn: prospectus.targetReturn,
    minimumInvestment: prospectus.minimumInvestment,
    projectTimeline: prospectus.projectTimeline,
    totalRaise: prospectus.totalRaise,
    description: prospectus.description,
    highlights: prospectus.highlights,
    isDraft: prospectus.status === 'draft',
  }

  // Generate PDF buffer
  const pdfBuffer = await renderToBuffer(ProspectusDocument({data: pdfData}))

  // Create filename
  const filename = `${prospectus.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-prospectus.pdf`

  return new Response(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-cache',
    },
  })
}
