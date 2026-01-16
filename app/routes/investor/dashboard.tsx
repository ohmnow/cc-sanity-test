import {useUser} from '@clerk/react-router'
import {Link, useLoaderData} from 'react-router'
import {
  ArrowRight,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  Building,
  AlertCircle,
} from 'lucide-react'
import {getAuth} from '@clerk/react-router/server'
import {loadQuery} from '~/sanity/loader.server'
import {
  PROSPECTUSES_QUERY,
  INVESTOR_BY_CLERK_ID_QUERY,
  INVESTOR_LOIS_QUERY,
} from '~/sanity/queries'
import {urlFor} from '~/sanity/image'

import type {Route} from './+types/dashboard'

interface Prospectus {
  _id: string
  title: string
  slug: string
  status: string
  coverImage?: {asset: {_ref: string}}
  targetReturn: string
  minimumInvestment: number
}

interface LOI {
  _id: string
  investmentAmount: number
  status: string
  submittedAt: string
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
  email: string
  accreditedStatus: string
  status: string
}

export async function loader(args: Route.LoaderArgs) {
  const {request} = args
  // Get the current user's Clerk ID
  const {userId} = await getAuth(args)

  // Fetch available opportunities
  const {data: opportunities} = await loadQuery<Prospectus[]>(
    PROSPECTUSES_QUERY,
    {},
    {request}
  )

  let investor: Investor | null = null
  let lois: LOI[] = []

  // If user is logged in, fetch their investor profile and LOIs
  if (userId) {
    const {data: investorData} = await loadQuery<Investor | null>(
      INVESTOR_BY_CLERK_ID_QUERY,
      {clerkId: userId},
      {request}
    )
    investor = investorData

    if (investor) {
      const {data: loisData} = await loadQuery<LOI[]>(
        INVESTOR_LOIS_QUERY,
        {investorId: investor._id},
        {request}
      )
      lois = loisData || []
    }
  }

  return {
    opportunities: opportunities?.slice(0, 3) || [],
    investor,
    lois: lois || [],
    stats: {
      activeOpportunities: opportunities?.length || 0,
      submittedLOIs: lois?.filter((l) => l.status === 'submitted').length || 0,
      approvedLOIs: lois?.filter((l) => l.status === 'approved').length || 0,
      totalInvested: lois
        ?.filter((l) => l.status === 'approved')
        .reduce((sum, l) => sum + l.investmentAmount, 0) || 0,
    },
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
        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
          Under Review
        </span>
      )
    case 'review':
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          In Review
        </span>
      )
    case 'approved':
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          Approved
        </span>
      )
    case 'rejected':
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
          Declined
        </span>
      )
    default:
      return null
  }
}

export default function InvestorDashboard() {
  const {user} = useUser()
  const {opportunities, investor, lois, stats} = useLoaderData<typeof loader>()

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-display text-3xl text-[#1a1a1a] mb-2">
            Welcome back, {user?.firstName || investor?.name?.split(' ')[0] || 'Investor'}
          </h1>
          <p className="text-gray-600">
            Here's an overview of your investment activity and available opportunities.
          </p>
        </div>

        {/* Profile Incomplete Warning */}
        {!investor && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Complete Your Profile</p>
              <p className="text-sm text-yellow-700 mt-1">
                Your investor profile is not yet set up. Complete your profile to submit
                Letters of Intent.
              </p>
              <Link
                to="/investor/profile"
                className="text-sm text-yellow-800 font-medium hover:underline mt-2 inline-block"
              >
                Complete Profile →
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Active Opportunities',
              value: String(stats.activeOpportunities),
              icon: FileText,
              color: 'bg-blue-500',
            },
            {
              label: 'Submitted LOIs',
              value: String(stats.submittedLOIs),
              icon: Clock,
              color: 'bg-yellow-500',
            },
            {
              label: 'Approved Investments',
              value: String(stats.approvedLOIs),
              icon: CheckCircle,
              color: 'bg-green-500',
            },
            {
              label: 'Total Invested',
              value: formatCurrency(stats.totalInvested),
              icon: TrendingUp,
              color: 'bg-[#c9a961]',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1a1a1a]">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Available Opportunities */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-[#1a1a1a]">
                Latest Opportunities
              </h2>
              <Link
                to="/investor/opportunities"
                className="text-[#c9a961] hover:underline text-sm flex items-center gap-1"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {opportunities.length > 0 ? (
                opportunities.map((opp) => (
                  <Link
                    key={opp._id}
                    to={`/investor/opportunities/${opp.slug}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors -mx-3"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {opp.coverImage?.asset ? (
                        <img
                          src={urlFor(opp.coverImage).width(128).height(128).url()}
                          alt={opp.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1a1a1a] truncate">{opp.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-green-600 font-medium">
                          {opp.targetReturn || 'TBD'} return
                        </span>
                        <span className="text-sm text-gray-500">
                          Min: {opp.minimumInvestment ? formatCurrency(opp.minimumInvestment) : 'TBD'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No opportunities available yet. Check back soon!
                </p>
              )}
            </div>
          </div>

          {/* My LOIs / Recent Activity */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-[#1a1a1a]">My Letters of Intent</h2>
              {lois.length > 0 && (
                <Link
                  to="/investor/lois"
                  className="text-[#c9a961] hover:underline text-sm flex items-center gap-1"
                >
                  View all
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
            <div className="space-y-4">
              {lois.length > 0 ? (
                lois.slice(0, 3).map((loi) => (
                  <div
                    key={loi._id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 -mx-3"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {loi.prospectus?.coverImage?.asset ? (
                        <img
                          src={urlFor(loi.prospectus.coverImage).width(96).height(96).url()}
                          alt={loi.prospectus.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1a1a1a] truncate">
                        {loi.prospectus?.title || 'Unknown Opportunity'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-[#1a1a1a]">
                          {formatCurrency(loi.investmentAmount)}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500">
                          {new Date(loi.submittedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(loi.status)}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No Letters of Intent yet</p>
                  <p className="text-sm text-gray-400">
                    Browse opportunities to submit your first LOI
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-[#1a1a1a] rounded-xl p-8 text-center">
          <h2 className="font-display text-2xl text-white mb-2">Ready to Invest?</h2>
          <p className="text-white/70 mb-6">
            Browse our current investment opportunities and submit a Letter of Intent.
          </p>
          <Link
            to="/investor/opportunities"
            className="btn-gold px-8 py-3 rounded-lg inline-flex items-center gap-2 font-semibold"
          >
            View Opportunities
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
