import {Link, useLoaderData} from 'react-router'
import {
  Users,
  UserCheck,
  FileText,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import {getViewClient} from '~/sanity/client.server'

import type {Route} from './+types/index'

const ADMIN_STATS_QUERY = `{
  "leads": count(*[_type == "lead"]),
  "newLeads": count(*[_type == "lead" && status == "new"]),
  "investors": count(*[_type == "investor"]),
  "pendingInvestors": count(*[_type == "investor" && status == "pending"]),
  "lois": count(*[_type == "letterOfIntent"]),
  "pendingLois": count(*[_type == "letterOfIntent" && status == "submitted"]),
  "approvedLois": count(*[_type == "letterOfIntent" && status == "approved"]),
  "recentLeads": *[_type == "lead"] | order(_createdAt desc)[0...5] {
    _id,
    name,
    email,
    type,
    status,
    _createdAt
  },
  "recentLois": *[_type == "letterOfIntent"] | order(submittedAt desc)[0...5] {
    _id,
    status,
    investmentAmount,
    submittedAt,
    "investorName": investor->name,
    "prospectusTitle": prospectus->title
  }
}`

interface Stats {
  leads: number
  newLeads: number
  investors: number
  pendingInvestors: number
  lois: number
  pendingLois: number
  approvedLois: number
  recentLeads: Array<{
    _id: string
    name: string
    email: string
    type: string
    status: string
    _createdAt: string
  }>
  recentLois: Array<{
    _id: string
    status: string
    investmentAmount: number
    submittedAt: string
    investorName: string
    prospectusTitle: string
  }>
}

export async function loader({}: Route.LoaderArgs) {
  const stats = await getViewClient().fetch<Stats>(ADMIN_STATS_QUERY)
  return {stats}
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
    case 'new':
    case 'submitted':
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
          Pending
        </span>
      )
    case 'contacted':
    case 'review':
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          In Progress
        </span>
      )
    case 'converted':
    case 'approved':
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          Completed
        </span>
      )
    case 'rejected':
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
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

export default function AdminDashboard() {
  const {stats} = useLoaderData<typeof loader>()

  const statCards = [
    {
      label: 'Total Leads',
      value: stats.leads,
      subtitle: `${stats.newLeads} new`,
      icon: Users,
      color: 'bg-blue-500',
      href: '/admin/leads',
    },
    {
      label: 'Investors',
      value: stats.investors,
      subtitle: `${stats.pendingInvestors} pending approval`,
      icon: UserCheck,
      color: 'bg-green-500',
      href: '/admin/investors',
    },
    {
      label: 'Letters of Intent',
      value: stats.lois,
      subtitle: `${stats.pendingLois} awaiting review`,
      icon: FileText,
      color: 'bg-purple-500',
      href: '/admin/lois',
    },
    {
      label: 'Approved LOIs',
      value: stats.approvedLois,
      subtitle: 'Ready for funding',
      icon: TrendingUp,
      color: 'bg-[#c9a961]',
      href: '/admin/lois?status=approved',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-[#1a1a1a] mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Overview of leads, investors, and investment activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.href}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#c9a961] transition-colors" />
            </div>
            <p className="text-3xl font-bold text-[#1a1a1a] mb-1">
              {stat.value}
            </p>
            <p className="text-gray-600 font-medium">{stat.label}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.subtitle}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-display text-xl text-[#1a1a1a]">Recent Leads</h2>
            <Link
              to="/admin/leads"
              className="text-sm text-[#c9a961] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentLeads.length > 0 ? (
              stats.recentLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#1a1a1a]">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(lead.status)}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(lead._createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p>No leads yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent LOIs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-display text-xl text-[#1a1a1a]">
              Recent Letters of Intent
            </h2>
            <Link
              to="/admin/lois"
              className="text-sm text-[#c9a961] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentLois.length > 0 ? (
              stats.recentLois.map((loi) => (
                <div
                  key={loi._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#1a1a1a]">
                        {loi.investorName || 'Unknown Investor'}
                      </p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">
                        {loi.prospectusTitle || 'Unknown Opportunity'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#1a1a1a]">
                        {formatCurrency(loi.investmentAmount)}
                      </p>
                      {getStatusBadge(loi.status)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p>No LOIs yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-[#1a1a1a] rounded-xl p-6">
        <h3 className="font-display text-lg text-white mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            to="/admin/leads?status=new"
            className="flex items-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-white font-medium">Review New Leads</p>
              <p className="text-white/60 text-sm">{stats.newLeads} pending</p>
            </div>
          </Link>
          <Link
            to="/admin/investors?status=pending"
            className="flex items-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <AlertCircle className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white font-medium">Approve Investors</p>
              <p className="text-white/60 text-sm">
                {stats.pendingInvestors} awaiting
              </p>
            </div>
          </Link>
          <Link
            to="/admin/lois?status=submitted"
            className="flex items-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-white font-medium">Process LOIs</p>
              <p className="text-white/60 text-sm">{stats.pendingLois} to review</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
