import {Form, Link, useLoaderData, useSearchParams} from 'react-router'
import {
  UserCheck,
  Filter,
  Mail,
  Phone,
  Calendar,
  ArrowUpRight,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from 'lucide-react'
import {getViewClient} from '~/sanity/client.server'

import type {Route} from './+types/investors'

const INVESTORS_QUERY = `*[_type == "investor"] | order(_createdAt desc) {
  _id,
  name,
  email,
  phone,
  status,
  accreditedStatus,
  clerkId,
  "loiCount": count(*[_type == "letterOfIntent" && investor._ref == ^._id]),
  "totalInvested": math::sum(*[_type == "letterOfIntent" && investor._ref == ^._id && status == "approved"].investmentAmount),
  _createdAt
}`

interface Investor {
  _id: string
  name: string
  email: string
  phone?: string
  status: string
  accreditedStatus: string
  clerkId?: string
  loiCount: number
  totalInvested: number
  _createdAt: string
}

export async function loader({request}: Route.LoaderArgs) {
  const url = new URL(request.url)
  const statusFilter = url.searchParams.get('status')
  const accreditedFilter = url.searchParams.get('accredited')

  let investors = await getViewClient().fetch<Investor[]>(INVESTORS_QUERY)

  // Apply filters
  if (statusFilter) {
    investors = investors.filter((inv) => inv.status === statusFilter)
  }
  if (accreditedFilter) {
    investors = investors.filter((inv) => inv.accreditedStatus === accreditedFilter)
  }

  return {investors}
}

export async function action({request}: Route.ActionArgs) {
  const formData = await request.formData()
  const intent = formData.get('intent')
  const investorId = formData.get('investorId') as string

  if (!investorId) {
    return {error: 'Investor ID required'}
  }

  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) {
    return {error: 'Write token not configured'}
  }

  const writeClient = getViewClient().withConfig({token})

  switch (intent) {
    case 'updateStatus': {
      const newStatus = formData.get('status') as string
      await writeClient.patch(investorId).set({status: newStatus}).commit()
      return {success: true}
    }
    case 'updateAccreditation': {
      const newStatus = formData.get('accreditedStatus') as string
      await writeClient
        .patch(investorId)
        .set({accreditedStatus: newStatus})
        .commit()
      return {success: true}
    }
    case 'approveInvestor': {
      await writeClient
        .patch(investorId)
        .set({status: 'active', accreditedStatus: 'verified'})
        .commit()
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
    case 'pending':
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
          <Clock size={12} />
          Pending
        </span>
      )
    case 'active':
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
          <CheckCircle size={12} />
          Active
        </span>
      )
    case 'suspended':
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
          <XCircle size={12} />
          Suspended
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

function getAccreditationBadge(status: string) {
  switch (status) {
    case 'pending':
      return (
        <span className="px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded text-xs font-medium">
          Pending Verification
        </span>
      )
    case 'verified':
      return (
        <span className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-medium flex items-center gap-1">
          <Shield size={12} />
          Verified
        </span>
      )
    case 'expired':
      return (
        <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-medium">
          Expired
        </span>
      )
    case 'not_accredited':
      return (
        <span className="px-2 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded text-xs font-medium">
          Not Accredited
        </span>
      )
    default:
      return (
        <span className="px-2 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded text-xs font-medium">
          {status}
        </span>
      )
  }
}

export default function AdminInvestors() {
  const {investors} = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()

  const statusFilter = searchParams.get('status') || ''
  const accreditedFilter = searchParams.get('accredited') || ''

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-[#1a1a1a] mb-2">
            Investors
          </h1>
          <p className="text-gray-600">
            Manage investor accounts and verify accreditation.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <UserCheck size={18} />
          {investors.length} investors
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <span className="text-sm text-gray-600">Filter by:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/investors"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                !statusFilter && !accreditedFilter
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            <Link
              to="/admin/investors?status=pending"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              Pending Approval
            </Link>
            <Link
              to="/admin/investors?status=active"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'active'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              Active
            </Link>
            <Link
              to="/admin/investors?accredited=pending"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                accreditedFilter === 'pending'
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              Needs Verification
            </Link>
          </div>
        </div>
      </div>

      {/* Investors Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {investors.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Investor
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Accreditation
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Activity
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {investors.map((investor) => (
                <tr
                  key={investor._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-[#1a1a1a]">
                        {investor.name}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <a
                          href={`mailto:${investor.email}`}
                          className="text-sm text-gray-500 hover:text-[#c9a961] flex items-center gap-1"
                        >
                          <Mail size={12} />
                          {investor.email}
                        </a>
                        {investor.phone && (
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone size={12} />
                            {investor.phone}
                          </span>
                        )}
                      </div>
                      {investor.clerkId && (
                        <p className="text-xs text-gray-400 mt-1">
                          Clerk ID: {investor.clerkId.slice(0, 12)}...
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(investor.status)}</td>
                  <td className="px-6 py-4">
                    {getAccreditationBadge(investor.accreditedStatus)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText size={14} className="text-gray-400" />
                        <span className="text-gray-600">
                          {investor.loiCount} LOI{investor.loiCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {investor.totalInvested > 0 && (
                        <p className="text-sm font-semibold text-green-600">
                          {formatCurrency(investor.totalInvested)} invested
                        </p>
                      )}
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        Joined{' '}
                        {new Date(investor._createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Quick Approve */}
                      {investor.status === 'pending' && (
                        <Form method="post" className="inline">
                          <input
                            type="hidden"
                            name="investorId"
                            value={investor._id}
                          />
                          <input
                            type="hidden"
                            name="intent"
                            value="approveInvestor"
                          />
                          <button
                            type="submit"
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <CheckCircle size={14} />
                            Approve
                          </button>
                        </Form>
                      )}

                      {/* Status Update Dropdown */}
                      <Form method="post" className="inline">
                        <input
                          type="hidden"
                          name="investorId"
                          value={investor._id}
                        />
                        <input type="hidden" name="intent" value="updateStatus" />
                        <select
                          name="status"
                          defaultValue={investor.status}
                          onChange={(e) => e.target.form?.requestSubmit()}
                          className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:border-[#c9a961] focus:ring-1 focus:ring-[#c9a961] outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </Form>

                      {/* Accreditation Update */}
                      <Form method="post" className="inline">
                        <input
                          type="hidden"
                          name="investorId"
                          value={investor._id}
                        />
                        <input
                          type="hidden"
                          name="intent"
                          value="updateAccreditation"
                        />
                        <select
                          name="accreditedStatus"
                          defaultValue={investor.accreditedStatus}
                          onChange={(e) => e.target.form?.requestSubmit()}
                          className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:border-[#c9a961] focus:ring-1 focus:ring-[#c9a961] outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="expired">Expired</option>
                          <option value="not_accredited">Not Accredited</option>
                        </select>
                      </Form>

                      {/* View in Studio */}
                      <a
                        href={`/studio/structure/investor;${investor._id}`}
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
            <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-lg text-[#1a1a1a] mb-2">
              No investors found
            </h3>
            <p className="text-gray-500">
              {statusFilter || accreditedFilter
                ? 'Try adjusting your filters.'
                : 'Investors will appear here when they register.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
