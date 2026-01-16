import {Link, useLoaderData} from 'react-router'
import {getAuth} from '@clerk/react-router/server'
import {ArrowLeft, Building, FileText, ExternalLink, Download} from 'lucide-react'
import {loadQuery} from '~/sanity/loader.server'
import {INVESTOR_BY_CLERK_ID_QUERY, INVESTOR_LOIS_QUERY} from '~/sanity/queries'
import {urlFor} from '~/sanity/image'

import type {Route} from './+types/lois'

interface LOI {
  _id: string
  investmentAmount: number
  status: string
  submittedAt: string
  reviewedAt?: string
  investorNotes?: string
  prospectus: {
    _id: string
    title: string
    slug: string
    coverImage?: {asset: {_ref: string}}
    targetReturn: string
  }
}

interface Investor {
  _id: string
  name: string
}

export async function loader(args: Route.LoaderArgs) {
  const {request} = args
  const {userId} = await getAuth(args)

  if (!userId) {
    throw new Response('Unauthorized', {status: 401})
  }

  const {data: investor} = await loadQuery<Investor | null>(
    INVESTOR_BY_CLERK_ID_QUERY,
    {clerkId: userId},
    {request}
  )

  if (!investor) {
    return {lois: [], investor: null}
  }

  const {data: lois} = await loadQuery<LOI[]>(
    INVESTOR_LOIS_QUERY,
    {investorId: investor._id},
    {request}
  )

  return {lois: lois || [], investor}
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'submitted':
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
          Under Review
        </span>
      )
    case 'review':
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          In Review
        </span>
      )
    case 'approved':
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Approved
        </span>
      )
    case 'rejected':
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
          Declined
        </span>
      )
    default:
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          {status}
        </span>
      )
  }
}

function getStatusDescription(status: string) {
  switch (status) {
    case 'submitted':
      return 'Your Letter of Intent has been received and is awaiting review by our team.'
    case 'review':
      return 'Our investment team is currently reviewing your submission.'
    case 'approved':
      return 'Congratulations! Your LOI has been approved. Our team will contact you with next steps.'
    case 'rejected':
      return 'Unfortunately, your LOI was not approved at this time. Please contact us for more information.'
    default:
      return ''
  }
}

export default function MyLOIs() {
  const {lois, investor} = useLoaderData<typeof loader>()

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Back Link */}
        <Link
          to="/investor/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1a1a1a] mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl text-[#1a1a1a] mb-2">
            My Letters of Intent
          </h1>
          <p className="text-gray-600">
            Track the status of your investment submissions.
          </p>
        </div>

        {/* LOI List */}
        {lois.length > 0 ? (
          <div className="space-y-6">
            {lois.map((loi) => (
              <div
                key={loi._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Prospectus Image */}
                    <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {loi.prospectus?.coverImage?.asset ? (
                        <img
                          src={urlFor(loi.prospectus.coverImage).width(400).height(200).url()}
                          alt={loi.prospectus.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building className="w-10 h-10 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* LOI Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <h2 className="font-display text-xl text-[#1a1a1a] mb-1">
                            {loi.prospectus?.title || 'Unknown Opportunity'}
                          </h2>
                          <p className="text-sm text-gray-500">
                            Submitted on{' '}
                            {new Date(loi.submittedAt).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        {getStatusBadge(loi.status)}
                      </div>

                      {/* Investment Details */}
                      <div className="grid sm:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Investment Amount</p>
                          <p className="font-semibold text-[#1a1a1a] text-lg">
                            {formatCurrency(loi.investmentAmount)}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Target Return</p>
                          <p className="font-semibold text-green-600 text-lg">
                            {loi.prospectus?.targetReturn || 'TBD'}
                          </p>
                        </div>
                        {loi.reviewedAt && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Reviewed On</p>
                            <p className="font-semibold text-[#1a1a1a]">
                              {new Date(loi.reviewedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Status Description */}
                      <p className="text-sm text-gray-600 mb-4">
                        {getStatusDescription(loi.status)}
                      </p>

                      {/* Notes */}
                      {loi.investorNotes && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-xs font-medium text-gray-500 mb-1">Your Notes</p>
                          <p className="text-sm text-gray-700">{loi.investorNotes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        <Link
                          to={`/investor/opportunities/${loi.prospectus?.slug}`}
                          className="inline-flex items-center gap-2 text-[#c9a961] hover:underline text-sm font-medium"
                        >
                          View Opportunity
                          <ExternalLink size={14} />
                        </Link>
                        <a
                          href={`/resource/pdf/loi/${loi._id}`}
                          download
                          className="inline-flex items-center gap-2 text-[#1a1a1a] hover:underline text-sm font-medium"
                        >
                          Download PDF
                          <Download size={14} />
                        </a>
                        {loi.status === 'approved' && (
                          <a
                            href="mailto:investors@goldengateadvisors.com?subject=LOI Follow-up"
                            className="inline-flex items-center gap-2 text-[#1a1a1a] hover:underline text-sm font-medium"
                          >
                            Contact Team
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 border border-gray-100 shadow-sm text-center">
            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="font-display text-xl text-[#1a1a1a] mb-2">
              No Letters of Intent
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't submitted any Letters of Intent yet. Browse our available
              opportunities to get started.
            </p>
            <Link
              to="/investor/opportunities"
              className="btn-gold px-6 py-3 rounded-lg font-semibold inline-block"
            >
              View Opportunities
            </Link>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-[#1a1a1a] rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg text-white mb-1">
                Questions About Your LOI?
              </h3>
              <p className="text-white/70 text-sm">
                Our investor relations team is here to help with any questions.
              </p>
            </div>
            <a
              href="mailto:investors@goldengateadvisors.com"
              className="btn-gold px-6 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
