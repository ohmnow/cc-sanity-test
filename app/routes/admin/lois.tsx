import {Form, Link, useLoaderData, useSearchParams, useNavigation} from 'react-router'
import {
  FileText,
  Filter,
  Calendar,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  Building,
  User,
  Loader2,
  PenLine,
} from 'lucide-react'
import {sendLoiStatusUpdateEmail} from '~/lib/email.server'
import {getViewClient} from '~/sanity/client.server'

import type {Route} from './+types/lois'

const LOIS_QUERY = `*[_type == "letterOfIntent"] | order(submittedAt desc) {
  _id,
  status,
  investmentAmount,
  submittedAt,
  reviewedAt,
  investorNotes,
  countersignedBy,
  countersignedAt,
  "investor": investor->{
    _id,
    name,
    email,
    accreditedStatus
  },
  "prospectus": prospectus->{
    _id,
    title,
    slug,
    targetReturn,
    minimumInvestment
  }
}`

interface LOI {
  _id: string
  status: string
  investmentAmount: number
  submittedAt: string
  reviewedAt?: string
  investorNotes?: string
  countersignedBy?: string
  countersignedAt?: string
  investor: {
    _id: string
    name: string
    email: string
    accreditedStatus: string
  }
  prospectus: {
    _id: string
    title: string
    slug: string
    targetReturn: string
    minimumInvestment: number
  }
}

export async function loader({request}: Route.LoaderArgs) {
  const url = new URL(request.url)
  const statusFilter = url.searchParams.get('status')

  let lois = await getViewClient().fetch<LOI[]>(LOIS_QUERY)

  // Apply filters
  if (statusFilter) {
    lois = lois.filter((loi) => loi.status === statusFilter)
  }

  // Calculate summary stats
  const stats = {
    total: lois.length,
    totalAmount: lois.reduce((sum, loi) => sum + loi.investmentAmount, 0),
    pending: lois.filter((loi) => loi.status === 'submitted').length,
    approved: lois.filter((loi) => loi.status === 'approved').length,
    approvedAmount: lois
      .filter((loi) => loi.status === 'approved')
      .reduce((sum, loi) => sum + loi.investmentAmount, 0),
  }

  return {lois, stats}
}

// Helper function to send status update email
async function sendStatusEmail(loiId: string, status: 'approved' | 'rejected' | 'countersigned') {
  const client = getViewClient()
  const loi = await client.fetch<{
    investor: {name: string; email: string} | null
    prospectus: {title: string} | null
  }>(`*[_type == "letterOfIntent" && _id == $loiId][0]{
    "investor": investor->{name, email},
    "prospectus": prospectus->{title}
  }`, {loiId})

  if (loi?.investor?.email && loi?.prospectus?.title) {
    sendLoiStatusUpdateEmail({
      investorName: loi.investor.name,
      investorEmail: loi.investor.email,
      prospectusTitle: loi.prospectus.title,
      status,
    }).catch((err) => console.error('[Email] Failed to send LOI status update:', err))
  }
}

export async function action({request}: Route.ActionArgs) {
  const formData = await request.formData()
  const intent = formData.get('intent')
  const loiId = formData.get('loiId') as string

  if (!loiId) {
    return {error: 'LOI ID required'}
  }

  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) {
    return {error: 'Write token not configured'}
  }

  const writeClient = getViewClient().withConfig({token})

  switch (intent) {
    case 'approve': {
      await writeClient
        .patch(loiId)
        .set({
          status: 'approved',
          reviewedAt: new Date().toISOString(),
          countersignedBy: 'Admin',
          countersignedAt: new Date().toISOString(),
        })
        .commit()
      // Send approval email to investor (non-blocking)
      sendStatusEmail(loiId, 'approved')
      return {success: true, message: 'LOI approved'}
    }
    case 'reject': {
      await writeClient
        .patch(loiId)
        .set({
          status: 'rejected',
          reviewedAt: new Date().toISOString(),
        })
        .commit()
      // Send rejection email to investor (non-blocking)
      sendStatusEmail(loiId, 'rejected')
      return {success: true, message: 'LOI rejected'}
    }
    case 'review': {
      await writeClient.patch(loiId).set({status: 'review'}).commit()
      return {success: true, message: 'LOI marked as in review'}
    }
    case 'updateStatus': {
      const newStatus = formData.get('status') as string
      const update: Record<string, unknown> = {status: newStatus}
      if (newStatus === 'approved' || newStatus === 'rejected') {
        update.reviewedAt = new Date().toISOString()
      }
      if (newStatus === 'approved') {
        update.countersignedBy = 'Admin'
        update.countersignedAt = new Date().toISOString()
      }
      await writeClient.patch(loiId).set(update).commit()
      // Send email for status changes to approved/rejected (non-blocking)
      if (newStatus === 'approved' || newStatus === 'rejected') {
        sendStatusEmail(loiId, newStatus)
      }
      return {success: true}
    }
    default:
      return {error: 'Unknown action'}
  }
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
        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
          <Clock size={12} />
          Pending Review
        </span>
      )
    case 'review':
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
          <Eye size={12} />
          In Review
        </span>
      )
    case 'approved':
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
          <CheckCircle size={12} />
          Approved
        </span>
      )
    case 'countersigned':
      return (
        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1">
          <FileText size={12} />
          Countersigned
        </span>
      )
    case 'rejected':
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
          <XCircle size={12} />
          Rejected
        </span>
      )
    default:
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
          {status}
        </span>
      )
  }
}

export default function AdminLOIs() {
  const {lois, stats} = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const navigation = useNavigation()

  const statusFilter = searchParams.get('status') || ''

  // Check if a specific LOI action is being submitted
  const isSubmittingLoi = (loiId: string, intent: string) => {
    if (navigation.state !== 'submitting') return false
    const formData = navigation.formData
    return formData?.get('loiId') === loiId && formData?.get('intent') === intent
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-[#1a1a1a] mb-2">
            Letters of Intent
          </h1>
          <p className="text-gray-600">
            Review and process investor LOI submissions.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#1a1a1a]">
            {formatCurrency(stats.totalAmount)}
          </p>
          <p className="text-sm text-gray-500">Total Investment Interest</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-2xl font-bold text-[#1a1a1a]">{stats.total}</p>
          <p className="text-sm text-gray-500">Total LOIs</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-4">
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          <p className="text-sm text-yellow-600">Pending Review</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-4">
          <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
          <p className="text-sm text-green-600">Approved</p>
        </div>
        <div className="bg-[#c9a961]/10 rounded-xl border border-[#c9a961]/20 p-4">
          <p className="text-2xl font-bold text-[#c9a961]">
            {formatCurrency(stats.approvedAmount)}
          </p>
          <p className="text-sm text-[#c9a961]/80">Approved Amount</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <span className="text-sm text-gray-600">Filter by status:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/lois"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                !statusFilter
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            <Link
              to="/admin/lois?status=submitted"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'submitted'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              Pending
            </Link>
            <Link
              to="/admin/lois?status=review"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'review'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              In Review
            </Link>
            <Link
              to="/admin/lois?status=approved"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              Approved
            </Link>
            <Link
              to="/admin/lois?status=rejected"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Rejected
            </Link>
          </div>
        </div>
      </div>

      {/* LOIs Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {lois.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Investor
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Opportunity
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Amount
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Submitted
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lois.map((loi) => (
                <tr key={loi._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1a1a1a]">
                          {loi.investor?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {loi.investor?.email}
                        </p>
                        {loi.investor?.accreditedStatus === 'verified' && (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle size={10} />
                            Accredited
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building size={16} className="text-gray-400" />
                      <div>
                        <p className="font-medium text-[#1a1a1a] truncate max-w-[200px]">
                          {loi.prospectus?.title || 'Unknown'}
                        </p>
                        {loi.prospectus?.targetReturn && (
                          <p className="text-sm text-green-600">
                            {loi.prospectus.targetReturn} target
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-lg font-bold text-[#1a1a1a]">
                      {formatCurrency(loi.investmentAmount)}
                    </p>
                    {loi.prospectus?.minimumInvestment && (
                      <p className="text-xs text-gray-500">
                        Min: {formatCurrency(loi.prospectus.minimumInvestment)}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      {getStatusBadge(loi.status)}
                      {loi.countersignedAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          Signed by {loi.countersignedBy}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar size={14} />
                      {new Date(loi.submittedAt).toLocaleDateString()}
                    </div>
                    {loi.reviewedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Reviewed:{' '}
                        {new Date(loi.reviewedAt).toLocaleDateString()}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Quick Actions for Pending LOIs */}
                      {loi.status === 'submitted' && (
                        <>
                          <Form method="post" className="inline">
                            <input type="hidden" name="loiId" value={loi._id} />
                            <input type="hidden" name="intent" value="approve" />
                            <button
                              type="submit"
                              disabled={isSubmittingLoi(loi._id, 'approve')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isSubmittingLoi(loi._id, 'approve') ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <CheckCircle size={14} />
                              )}
                              {isSubmittingLoi(loi._id, 'approve') ? 'Approving...' : 'Approve'}
                            </button>
                          </Form>
                          <Form method="post" className="inline">
                            <input type="hidden" name="loiId" value={loi._id} />
                            <input type="hidden" name="intent" value="reject" />
                            <button
                              type="submit"
                              disabled={isSubmittingLoi(loi._id, 'reject')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isSubmittingLoi(loi._id, 'reject') ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <XCircle size={14} />
                              )}
                              {isSubmittingLoi(loi._id, 'reject') ? 'Rejecting...' : 'Reject'}
                            </button>
                          </Form>
                        </>
                      )}

                      {/* Status Dropdown for other states */}
                      {loi.status !== 'submitted' && (
                        <Form method="post" className="inline">
                          <input type="hidden" name="loiId" value={loi._id} />
                          <input
                            type="hidden"
                            name="intent"
                            value="updateStatus"
                          />
                          <select
                            name="status"
                            defaultValue={loi.status}
                            onChange={(e) => e.target.form?.requestSubmit()}
                            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:border-[#c9a961] focus:ring-1 focus:ring-[#c9a961] outline-none"
                          >
                            <option value="submitted">Pending</option>
                            <option value="review">In Review</option>
                            <option value="approved">Approved</option>
                            <option value="countersigned">Countersigned</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </Form>
                      )}

                      {/* Countersign Button for Approved LOIs */}
                      {loi.status === 'approved' && (
                        <Link
                          to={`/admin/lois/${loi._id}/countersign`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#c9a961] hover:bg-[#b8994d] text-white text-sm font-medium rounded-lg transition-colors"
                          title="Countersign LOI"
                        >
                          <PenLine size={14} />
                          Countersign
                        </Link>
                      )}

                      {/* Download PDF */}
                      <a
                        href={`/resource/pdf/loi/${loi._id}`}
                        download
                        className="p-1.5 text-gray-400 hover:text-[#c9a961] transition-colors"
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </a>

                      {/* View in Studio */}
                      <a
                        href={`/studio/structure/letterOfIntent;${loi._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-400 hover:text-[#1a1a1a] transition-colors"
                        title="View in Studio"
                      >
                        <ArrowUpRight size={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-lg text-[#1a1a1a] mb-2">
              No Letters of Intent found
            </h3>
            <p className="text-gray-500">
              {statusFilter
                ? 'Try adjusting your filters.'
                : 'LOIs will appear here when investors submit them.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
