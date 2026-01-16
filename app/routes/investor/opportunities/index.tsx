import {Link, useLoaderData} from 'react-router'
import {Building, MapPin, TrendingUp, Clock, Lock, ArrowRight} from 'lucide-react'
import {loadQuery} from '~/sanity/loader.server'
import {PROSPECTUSES_QUERY} from '~/sanity/queries'
import {urlFor} from '~/sanity/image'

import type {Route} from './+types/index'

interface Prospectus {
  _id: string
  title: string
  slug: string
  status: string
  projectType: string
  summary: string
  propertyAddress: string
  coverImage?: {asset: {_ref: string}}
  totalRaise: number
  minimumInvestment: number
  targetReturn: string
  projectedTimeline: string
  accessLevel: string
  closeDate: string
}

export async function loader({request}: Route.LoaderArgs) {
  const {data: opportunities} = await loadQuery<Prospectus[]>(
    PROSPECTUSES_QUERY,
    {},
    {request}
  )
  return {opportunities: opportunities || []}
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
    case 'open':
      return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Open</span>
    case 'subscribed':
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Fully Subscribed</span>
    case 'in-progress':
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">In Progress</span>
    case 'closed':
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Closed</span>
    default:
      return null
  }
}

function getAccessBadge(accessLevel: string) {
  switch (accessLevel) {
    case 'accredited':
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-[#c9a961]/10 text-[#c9a961] rounded-full text-xs font-medium">
          <Lock size={10} />
          Accredited Only
        </span>
      )
    case 'invited':
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
          <Lock size={10} />
          Invite Only
        </span>
      )
    default:
      return null
  }
}

function getProjectTypeLabel(type: string) {
  const types: Record<string, string> = {
    'fix-flip': 'Fix & Flip',
    'development': 'Development',
    'buy-hold': 'Buy & Hold',
    'syndication': 'Syndication',
  }
  return types[type] || type
}

export default function OpportunitiesListing() {
  const {opportunities} = useLoaderData<typeof loader>()

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl text-[#1a1a1a] mb-2">
            Investment Opportunities
          </h1>
          <p className="text-gray-600">
            Browse current and upcoming investment opportunities in the Bay Area.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-8">
          <div className="flex flex-wrap gap-4">
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-[#c9a961]">
              <option value="">All Property Types</option>
              <option value="fix-flip">Fix & Flip</option>
              <option value="development">Development</option>
              <option value="buy-hold">Buy & Hold</option>
              <option value="syndication">Syndication</option>
            </select>
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-[#c9a961]">
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="subscribed">Fully Subscribed</option>
            </select>
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-[#c9a961]">
              <option value="">Min Investment</option>
              <option value="25000">$25,000+</option>
              <option value="50000">$50,000+</option>
              <option value="100000">$100,000+</option>
            </select>
          </div>
        </div>

        {/* Opportunities Grid */}
        {opportunities.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <Link
                key={opportunity._id}
                to={`/investor/opportunities/${opportunity.slug}`}
                className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {opportunity.coverImage?.asset ? (
                    <img
                      src={urlFor(opportunity.coverImage).width(800).height(400).url()}
                      alt={opportunity.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {getStatusBadge(opportunity.status)}
                    {getAccessBadge(opportunity.accessLevel)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-lg text-[#1a1a1a] mb-2 group-hover:text-[#c9a961] transition-colors">
                    {opportunity.title}
                  </h3>

                  {opportunity.propertyAddress && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                      <MapPin size={14} />
                      {opportunity.propertyAddress}
                    </div>
                  )}

                  {opportunity.summary && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {opportunity.summary}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Min. Investment</p>
                      <p className="font-semibold text-[#1a1a1a]">
                        {opportunity.minimumInvestment ? formatCurrency(opportunity.minimumInvestment) : 'TBD'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Target Return</p>
                      <p className="font-semibold text-green-600">
                        {opportunity.targetReturn || 'TBD'}
                      </p>
                    </div>
                  </div>

                  {opportunity.closeDate && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>
                        Closes {new Date(opportunity.closeDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                      </span>
                    </div>
                  )}

                  {opportunity.projectType && (
                    <div className="mt-3">
                      <span className="text-xs text-gray-400">
                        {getProjectTypeLabel(opportunity.projectType)}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 border border-gray-100 shadow-sm text-center">
            <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-xl text-[#1a1a1a] mb-2">
              No Opportunities Available
            </h3>
            <p className="text-gray-600 mb-6">
              Check back soon for new investment opportunities.
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-[#1a1a1a] rounded-xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-2xl text-white mb-4">
                Looking for Something Specific?
              </h2>
              <p className="text-white/70 mb-6">
                Our team is constantly sourcing new investment opportunities. Let us know your
                investment criteria and we'll notify you when matching opportunities become available.
              </p>
              <Link
                to="/investor/profile"
                className="inline-flex items-center gap-2 text-[#c9a961] hover:underline"
              >
                Update your investment preferences
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <TrendingUp className="w-8 h-8 text-[#c9a961] mb-2" />
                <p className="text-white font-semibold">15-25%</p>
                <p className="text-white/60 text-sm">Average Target Returns</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <Building className="w-8 h-8 text-[#c9a961] mb-2" />
                <p className="text-white font-semibold">$50K+</p>
                <p className="text-white/60 text-sm">Minimum Investment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
