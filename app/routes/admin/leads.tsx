import {Form, Link, useLoaderData, useSearchParams} from 'react-router'
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  ArrowUpRight,
  UserPlus,
} from 'lucide-react'
import {getViewClient} from '~/sanity/client.server'

import type {Route} from './+types/leads'

const LEADS_QUERY = `*[_type == "lead"] | order(_createdAt desc) {
  _id,
  name,
  email,
  phone,
  type,
  status,
  message,
  source,
  _createdAt
}`

interface Lead {
  _id: string
  name: string
  email: string
  phone?: string
  type: string
  status: string
  message?: string
  source?: string
  _createdAt: string
}

export async function loader({request}: Route.LoaderArgs) {
  const url = new URL(request.url)
  const statusFilter = url.searchParams.get('status')
  const typeFilter = url.searchParams.get('type')

  let leads = await getViewClient().fetch<Lead[]>(LEADS_QUERY)

  // Apply filters
  if (statusFilter) {
    leads = leads.filter((lead) => lead.status === statusFilter)
  }
  if (typeFilter) {
    leads = leads.filter((lead) => lead.type === typeFilter)
  }

  return {leads}
}

export async function action({request}: Route.ActionArgs) {
  const formData = await request.formData()
  const intent = formData.get('intent')
  const leadId = formData.get('leadId') as string

  if (!leadId) {
    return {error: 'Lead ID required'}
  }

  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) {
    return {error: 'Write token not configured'}
  }

  const writeClient = getViewClient().withConfig({token})

  switch (intent) {
    case 'updateStatus': {
      const newStatus = formData.get('status') as string
      await writeClient.patch(leadId).set({status: newStatus}).commit()
      return {success: true}
    }
    case 'convertToInvestor': {
      // Get lead data
      const lead = await getViewClient().fetch<Lead>(
        `*[_type == "lead" && _id == $id][0]`,
        {id: leadId}
      )
      if (!lead) {
        return {error: 'Lead not found'}
      }

      // Create investor from lead
      await writeClient.create({
        _type: 'investor',
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: 'pending',
        accreditedStatus: 'pending',
        createdAt: new Date().toISOString(),
      })

      // Update lead status
      await writeClient.patch(leadId).set({status: 'converted'}).commit()

      return {success: true, message: 'Lead converted to investor'}
    }
    default:
      return {error: 'Unknown action'}
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'new':
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
          New
        </span>
      )
    case 'contacted':
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          Contacted
        </span>
      )
    case 'qualified':
      return (
        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
          Qualified
        </span>
      )
    case 'converted':
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          Converted
        </span>
      )
    case 'closed':
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
          Closed
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

function getTypeBadge(type: string) {
  const colors: Record<string, string> = {
    buyer: 'bg-blue-50 text-blue-700 border-blue-200',
    seller: 'bg-green-50 text-green-700 border-green-200',
    investor: 'bg-purple-50 text-purple-700 border-purple-200',
  }
  return (
    <span
      className={`px-2 py-1 rounded border text-xs font-medium capitalize ${colors[type] || 'bg-gray-50 text-gray-700 border-gray-200'}`}
    >
      {type}
    </span>
  )
}

export default function AdminLeads() {
  const {leads} = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()

  const statusFilter = searchParams.get('status') || ''
  const typeFilter = searchParams.get('type') || ''

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-[#1a1a1a] mb-2">Leads</h1>
          <p className="text-gray-600">
            Manage and convert leads into investors.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users size={18} />
          {leads.length} total leads
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
              to="/admin/leads"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                !statusFilter && !typeFilter
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            <Link
              to="/admin/leads?status=new"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'new'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              New
            </Link>
            <Link
              to="/admin/leads?status=contacted"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'contacted'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Contacted
            </Link>
            <Link
              to="/admin/leads?status=qualified"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'qualified'
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              Qualified
            </Link>
            <Link
              to="/admin/leads?type=investor"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === 'investor'
                  ? 'bg-[#c9a961] text-white'
                  : 'bg-[#c9a961]/10 text-[#c9a961] hover:bg-[#c9a961]/20'
              }`}
            >
              Investors Only
            </Link>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {leads.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Lead
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Type
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-[#1a1a1a]">{lead.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-sm text-gray-500 hover:text-[#c9a961] flex items-center gap-1"
                        >
                          <Mail size={12} />
                          {lead.email}
                        </a>
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-sm text-gray-500 hover:text-[#c9a961] flex items-center gap-1"
                          >
                            <Phone size={12} />
                            {lead.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getTypeBadge(lead.type)}</td>
                  <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar size={14} />
                      {new Date(lead._createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Status Update Dropdown */}
                      <Form method="post" className="inline">
                        <input type="hidden" name="leadId" value={lead._id} />
                        <input type="hidden" name="intent" value="updateStatus" />
                        <select
                          name="status"
                          defaultValue={lead.status}
                          onChange={(e) => e.target.form?.requestSubmit()}
                          className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:border-[#c9a961] focus:ring-1 focus:ring-[#c9a961] outline-none"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </Form>

                      {/* Convert to Investor (for investor leads) */}
                      {lead.type === 'investor' && lead.status !== 'converted' && (
                        <Form method="post" className="inline">
                          <input type="hidden" name="leadId" value={lead._id} />
                          <input
                            type="hidden"
                            name="intent"
                            value="convertToInvestor"
                          />
                          <button
                            type="submit"
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#c9a961] hover:bg-[#b8994f] text-white text-sm font-medium rounded-lg transition-colors"
                            title="Convert to Investor"
                          >
                            <UserPlus size={14} />
                            Convert
                          </button>
                        </Form>
                      )}

                      {/* View in Studio */}
                      <a
                        href={`/studio/structure/lead;${lead._id}`}
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
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-lg text-[#1a1a1a] mb-2">
              No leads found
            </h3>
            <p className="text-gray-500">
              {statusFilter || typeFilter
                ? 'Try adjusting your filters.'
                : 'Leads will appear here when visitors submit the contact form.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
