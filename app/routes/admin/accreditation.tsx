import {Form, Link, useLoaderData, useSearchParams, useNavigation} from 'react-router'
import {
  FileText,
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  User,
  Loader2,
  Shield,
} from 'lucide-react'
import {getViewClient} from '~/sanity/client.server'

import type {Route} from './+types/accreditation'

const ACCREDITATION_DOCS_QUERY = `*[_type == "investor" && defined(accreditationDocuments) && count(accreditationDocuments) > 0]{
  _id,
  name,
  email,
  accreditedStatus,
  "documents": accreditationDocuments[]{
    _key,
    title,
    documentType,
    uploadedAt,
    status,
    reviewerNotes,
    "fileUrl": file.asset->url
  }
} | order(name asc)`

interface Document {
  _key: string
  title: string
  documentType?: string
  uploadedAt?: string
  status?: string
  reviewerNotes?: string
  fileUrl?: string
}

interface InvestorWithDocs {
  _id: string
  name: string
  email: string
  accreditedStatus?: string
  documents: Document[]
}

export async function loader({request}: Route.LoaderArgs) {
  const url = new URL(request.url)
  const statusFilter = url.searchParams.get('status')

  const investors = await getViewClient().fetch<InvestorWithDocs[]>(ACCREDITATION_DOCS_QUERY)

  // Flatten documents with investor info for filtering
  let allDocuments: Array<Document & {investorId: string; investorName: string; investorEmail: string}> = []
  for (const investor of investors) {
    for (const doc of investor.documents) {
      allDocuments.push({
        ...doc,
        investorId: investor._id,
        investorName: investor.name,
        investorEmail: investor.email,
      })
    }
  }

  // Apply status filter
  if (statusFilter) {
    allDocuments = allDocuments.filter((doc) => doc.status === statusFilter)
  }

  // Sort by uploadedAt descending
  allDocuments.sort((a, b) => {
    if (!a.uploadedAt) return 1
    if (!b.uploadedAt) return -1
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  })

  // Calculate stats
  const stats = {
    total: allDocuments.length,
    pending: allDocuments.filter((d) => d.status === 'pending').length,
    underReview: allDocuments.filter((d) => d.status === 'under_review').length,
    approved: allDocuments.filter((d) => d.status === 'approved').length,
    rejected: allDocuments.filter((d) => d.status === 'rejected').length,
  }

  return {documents: allDocuments, stats}
}

export async function action({request}: Route.ActionArgs) {
  const formData = await request.formData()
  const intent = formData.get('intent')
  const investorId = formData.get('investorId') as string
  const documentKey = formData.get('documentKey') as string
  const reviewerNotes = formData.get('reviewerNotes') as string

  if (!investorId || !documentKey) {
    return {error: 'Missing required fields'}
  }

  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) {
    return {error: 'Write token not configured'}
  }

  const writeClient = getViewClient().withConfig({token})

  let newStatus = ''
  switch (intent) {
    case 'approve':
      newStatus = 'approved'
      break
    case 'reject':
      newStatus = 'rejected'
      break
    case 'review':
      newStatus = 'under_review'
      break
    default:
      return {error: 'Unknown action'}
  }

  try {
    // Update the specific document in the array
    await writeClient
      .patch(investorId)
      .set({
        [`accreditationDocuments[_key=="${documentKey}"].status`]: newStatus,
        [`accreditationDocuments[_key=="${documentKey}"].reviewedAt`]: new Date().toISOString(),
        ...(reviewerNotes && {
          [`accreditationDocuments[_key=="${documentKey}"].reviewerNotes`]: reviewerNotes,
        }),
      })
      .commit()

    // If approving, also update the investor's accredited status
    if (newStatus === 'approved') {
      await writeClient
        .patch(investorId)
        .set({accreditedStatus: 'verified'})
        .commit()
    }

    return {success: true, message: `Document ${newStatus}`}
  } catch (error) {
    console.error('Error updating document:', error)
    return {error: 'Failed to update document'}
  }
}

export function meta() {
  return [{title: 'Accreditation Review | Admin'}]
}

const documentTypeLabels: Record<string, string> = {
  cpa_letter: 'CPA Letter',
  tax_return: 'Tax Return',
  bank_statement: 'Bank Statement',
  brokerage_statement: 'Brokerage Statement',
  third_party: 'Third-Party Verification',
  other: 'Other',
}

function getStatusBadge(status?: string) {
  switch (status) {
    case 'pending':
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
          <Clock size={12} />
          Pending
        </span>
      )
    case 'under_review':
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
          <Eye size={12} />
          Under Review
        </span>
      )
    case 'approved':
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
          <CheckCircle size={12} />
          Approved
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
          {status || 'Unknown'}
        </span>
      )
  }
}

export default function AdminAccreditation() {
  const {documents, stats} = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const navigation = useNavigation()

  const statusFilter = searchParams.get('status') || ''

  const isSubmitting = (investorId: string, documentKey: string, intent: string) => {
    if (navigation.state !== 'submitting') return false
    const formData = navigation.formData
    return (
      formData?.get('investorId') === investorId &&
      formData?.get('documentKey') === documentKey &&
      formData?.get('intent') === intent
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-[#1a1a1a] mb-2">
            Accreditation Review
          </h1>
          <p className="text-gray-600">
            Review and verify investor accreditation documents.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[#c9a961]">
          <Shield size={24} />
          <span className="text-lg font-semibold">{stats.pending} Pending</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-2xl font-bold text-[#1a1a1a]">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Documents</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-4">
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          <p className="text-sm text-yellow-600">Pending</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
          <p className="text-2xl font-bold text-blue-700">{stats.underReview}</p>
          <p className="text-sm text-blue-600">Under Review</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-4">
          <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
          <p className="text-sm text-green-600">Approved</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-100 p-4">
          <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
          <p className="text-sm text-red-600">Rejected</p>
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
              to="/admin/accreditation"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                !statusFilter
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            <Link
              to="/admin/accreditation?status=pending"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              Pending
            </Link>
            <Link
              to="/admin/accreditation?status=under_review"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'under_review'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Under Review
            </Link>
            <Link
              to="/admin/accreditation?status=approved"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              Approved
            </Link>
            <Link
              to="/admin/accreditation?status=rejected"
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

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {documents.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Investor
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Document
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Type
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Uploaded
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.map((doc) => (
                <tr key={`${doc.investorId}-${doc._key}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1a1a1a]">
                          {doc.investorName}
                        </p>
                        <p className="text-sm text-gray-500">{doc.investorEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      <div>
                        <p className="font-medium text-[#1a1a1a] truncate max-w-[200px]">
                          {doc.title}
                        </p>
                        {doc.reviewerNotes && (
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">
                            Note: {doc.reviewerNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {documentTypeLabels[doc.documentType || 'other'] || doc.documentType}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(doc.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar size={14} />
                      {doc.uploadedAt
                        ? new Date(doc.uploadedAt).toLocaleDateString()
                        : 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* View Document */}
                      {doc.fileUrl && (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-[#c9a961] transition-colors"
                          title="View Document"
                        >
                          <Download size={16} />
                        </a>
                      )}

                      {/* Quick Actions for Pending/Under Review */}
                      {(doc.status === 'pending' || doc.status === 'under_review') && (
                        <>
                          <Form method="post" className="inline">
                            <input type="hidden" name="investorId" value={doc.investorId} />
                            <input type="hidden" name="documentKey" value={doc._key} />
                            <input type="hidden" name="intent" value="approve" />
                            <button
                              type="submit"
                              disabled={isSubmitting(doc.investorId, doc._key, 'approve')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isSubmitting(doc.investorId, doc._key, 'approve') ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <CheckCircle size={14} />
                              )}
                              Approve
                            </button>
                          </Form>
                          <Form method="post" className="inline">
                            <input type="hidden" name="investorId" value={doc.investorId} />
                            <input type="hidden" name="documentKey" value={doc._key} />
                            <input type="hidden" name="intent" value="reject" />
                            <button
                              type="submit"
                              disabled={isSubmitting(doc.investorId, doc._key, 'reject')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isSubmitting(doc.investorId, doc._key, 'reject') ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <XCircle size={14} />
                              )}
                              Reject
                            </button>
                          </Form>
                        </>
                      )}

                      {/* Mark for Review (for pending only) */}
                      {doc.status === 'pending' && (
                        <Form method="post" className="inline">
                          <input type="hidden" name="investorId" value={doc.investorId} />
                          <input type="hidden" name="documentKey" value={doc._key} />
                          <input type="hidden" name="intent" value="review" />
                          <button
                            type="submit"
                            disabled={isSubmitting(doc.investorId, doc._key, 'review')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isSubmitting(doc.investorId, doc._key, 'review') ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Eye size={14} />
                            )}
                            Review
                          </button>
                        </Form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-lg text-[#1a1a1a] mb-2">
              No accreditation documents
            </h3>
            <p className="text-gray-500">
              {statusFilter
                ? 'No documents match your filter.'
                : 'Documents will appear here when investors upload them.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
