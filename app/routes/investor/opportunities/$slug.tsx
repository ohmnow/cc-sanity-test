import {Link, useLoaderData} from 'react-router'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building,
  TrendingUp,
  Clock,
  FileText,
  Download,
  Share2,
  CheckCircle,
  AlertCircle,
  Lock,
} from 'lucide-react'
import {loadQuery} from '~/sanity/loader.server'
import {PROSPECTUS_QUERY} from '~/sanity/queries'
import {urlFor} from '~/sanity/image'

import type {Route} from './+types/$slug'

interface Document {
  _key: string
  title: string
  file?: {asset: {_ref: string; url?: string}}
  accessLevel: string
}

interface FinancialHighlight {
  _key: string
  label: string
  value: string
}

interface Prospectus {
  _id: string
  title: string
  slug: string
  status: string
  projectType: string
  summary: string
  description?: string
  propertyAddress: string
  coverImage?: {asset: {_ref: string}}
  gallery?: Array<{_key: string; asset: {_ref: string}}>
  totalRaise: number
  minimumInvestment: number
  targetReturn: string
  projectedTimeline: string
  distributionSchedule?: string
  financialHighlights?: FinancialHighlight[]
  documents?: Document[]
  accessLevel: string
  closeDate: string
  invitedInvestorIds?: string[]
  relatedProject?: {
    _id: string
    title: string
    slug: string
    beforeImage?: {asset: {_ref: string}}
    afterImage?: {asset: {_ref: string}}
  }
}

export async function loader({params, request}: Route.LoaderArgs) {
  const {data: prospectus} = await loadQuery<Prospectus | null>(
    PROSPECTUS_QUERY,
    {slug: params.slug},
    {request}
  )

  if (!prospectus) {
    throw new Response('Not Found', {status: 404})
  }

  return {prospectus}
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
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Open for Investment
        </span>
      )
    case 'subscribed':
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          Fully Subscribed
        </span>
      )
    case 'in-progress':
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
          In Progress
        </span>
      )
    case 'closed':
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          Closed
        </span>
      )
    default:
      return null
  }
}

function getProjectTypeLabel(type: string) {
  const types: Record<string, string> = {
    'fix-flip': 'Fix & Flip',
    development: 'Development',
    'buy-hold': 'Buy & Hold',
    syndication: 'Syndication',
  }
  return types[type] || type
}

export default function OpportunityDetail() {
  const {prospectus} = useLoaderData<typeof loader>()

  // Calculate a mock funding progress (in a real app, this would come from LOI totals)
  const fundingProgress = 70 // Placeholder

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Back Link */}
        <Link
          to="/investor/opportunities"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1a1a1a] mb-6"
        >
          <ArrowLeft size={18} />
          Back to Opportunities
        </Link>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden bg-gray-100">
              {prospectus.coverImage?.asset ? (
                <img
                  src={urlFor(prospectus.coverImage).width(1200).height(600).url()}
                  alt={prospectus.title}
                  className="w-full h-[400px] object-cover"
                />
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center">
                  <Building className="w-16 h-16 text-gray-300" />
                </div>
              )}
            </div>
            {prospectus.gallery && prospectus.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {prospectus.gallery.slice(0, 3).map((image) => (
                  <div key={image._key} className="rounded-lg overflow-hidden">
                    <img
                      src={urlFor(image).width(400).height(200).url()}
                      alt={`${prospectus.title} gallery`}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Investment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                {getStatusBadge(prospectus.status)}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share2 size={18} className="text-gray-500" />
                </button>
              </div>

              <h1 className="font-display text-2xl text-[#1a1a1a] mb-2">
                {prospectus.title}
              </h1>

              {prospectus.propertyAddress && (
                <div className="flex items-center gap-2 text-gray-500 mb-6">
                  <MapPin size={16} />
                  {prospectus.propertyAddress}
                </div>
              )}

              {/* Funding Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Funding Progress</span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {Math.round(fundingProgress)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c9a961] rounded-full"
                    style={{width: `${fundingProgress}%`}}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Target: {formatCurrency(prospectus.totalRaise)}
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Min. Investment</p>
                  <p className="font-semibold text-[#1a1a1a]">
                    {prospectus.minimumInvestment
                      ? formatCurrency(prospectus.minimumInvestment)
                      : 'TBD'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Target Return</p>
                  <p className="font-semibold text-green-600">
                    {prospectus.targetReturn || 'TBD'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Timeline</p>
                  <p className="font-semibold text-[#1a1a1a]">
                    {prospectus.projectedTimeline || 'TBD'}
                  </p>
                </div>
                {prospectus.closeDate && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Closing Date</p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {new Date(prospectus.closeDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* CTA */}
              {prospectus.status === 'open' ? (
                <Link
                  to={`/investor/opportunities/${prospectus.slug}/loi`}
                  className="btn-gold w-full py-3 rounded-lg font-semibold text-center block"
                >
                  Submit Letter of Intent
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full py-3 rounded-lg font-semibold text-center bg-gray-100 text-gray-500 cursor-not-allowed"
                >
                  {prospectus.status === 'subscribed'
                    ? 'Fully Subscribed'
                    : 'Not Open for Investment'}
                </button>
              )}

              <p className="text-xs text-gray-500 text-center mt-3">
                By submitting an LOI, you express interest in this investment
                opportunity.
              </p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-display text-xl text-[#1a1a1a] mb-4">
                Investment Overview
              </h2>
              {prospectus.summary && (
                <p className="text-gray-600 mb-4">{prospectus.summary}</p>
              )}
              {prospectus.description && (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 whitespace-pre-line">
                    {prospectus.description}
                  </p>
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                {prospectus.projectType && (
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-[#c9a961]" />
                    <div>
                      <p className="text-sm text-gray-500">Project Type</p>
                      <p className="font-medium text-[#1a1a1a]">
                        {getProjectTypeLabel(prospectus.projectType)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-[#c9a961]" />
                  <div>
                    <p className="text-sm text-gray-500">Total Raise</p>
                    <p className="font-medium text-[#1a1a1a]">
                      {formatCurrency(prospectus.totalRaise)}
                    </p>
                  </div>
                </div>
                {prospectus.distributionSchedule && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#c9a961]" />
                    <div>
                      <p className="text-sm text-gray-500">Distributions</p>
                      <p className="font-medium text-[#1a1a1a]">
                        {prospectus.distributionSchedule}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Highlights */}
            {prospectus.financialHighlights &&
              prospectus.financialHighlights.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-display text-xl text-[#1a1a1a] mb-4">
                    Financial Highlights
                  </h2>
                  <div className="space-y-3">
                    {prospectus.financialHighlights.map((highlight) => (
                      <div
                        key={highlight._key}
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-gray-600">{highlight.label}</span>
                        <span className="font-semibold text-[#1a1a1a]">
                          {highlight.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-700">
                      <strong>Disclaimer:</strong> These projections are estimates
                      based on current market conditions and are not guaranteed.
                      Past performance does not indicate future results.
                    </p>
                  </div>
                </div>
              )}

            {/* Related Project */}
            {prospectus.relatedProject && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-display text-xl text-[#1a1a1a] mb-4">
                  Related Project
                </h2>
                <Link
                  to={`/projects/${prospectus.relatedProject.slug}`}
                  className="block group"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    {prospectus.relatedProject.beforeImage && (
                      <div className="rounded-lg overflow-hidden">
                        <p className="text-xs text-gray-500 mb-1">Before</p>
                        <img
                          src={urlFor(prospectus.relatedProject.beforeImage)
                            .width(400)
                            .height(300)
                            .url()}
                          alt="Before"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    {prospectus.relatedProject.afterImage && (
                      <div className="rounded-lg overflow-hidden">
                        <p className="text-xs text-gray-500 mb-1">After</p>
                        <img
                          src={urlFor(prospectus.relatedProject.afterImage)
                            .width(400)
                            .height(300)
                            .url()}
                          alt="After"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  <p className="mt-3 font-medium text-[#1a1a1a] group-hover:text-[#c9a961] transition-colors">
                    {prospectus.relatedProject.title} →
                  </p>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Download Prospectus PDF */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-display text-lg text-[#1a1a1a] mb-4">
                Investment Summary
              </h3>
              <a
                href={`/resource/pdf/prospectus/${prospectus._id}`}
                download
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-[#c9a961] hover:bg-[#b8994f] text-white font-semibold transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Prospectus PDF
              </a>
              <p className="text-xs text-gray-500 text-center mt-2">
                Full investment details in PDF format
              </p>
            </div>

            {/* Documents */}
            {prospectus.documents && prospectus.documents.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-display text-lg text-[#1a1a1a] mb-4">
                  Documents
                </h3>
                <div className="space-y-3">
                  {prospectus.documents.map((doc) => (
                    <button
                      key={doc._key}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#c9a961] hover:bg-[#c9a961]/5 transition-colors text-left"
                      onClick={() => {
                        // In production, check access level and redirect to document
                        if (doc.file?.asset?.url) {
                          window.open(doc.file.asset.url, '_blank')
                        }
                      }}
                    >
                      <FileText className="w-5 h-5 text-[#c9a961]" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#1a1a1a] truncate">
                          {doc.title}
                        </p>
                        {doc.accessLevel === 'accredited' && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Lock size={10} />
                            Accredited Only
                          </p>
                        )}
                      </div>
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key Dates */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-display text-lg text-[#1a1a1a] mb-4">
                Key Information
              </h3>
              <div className="space-y-4">
                {prospectus.closeDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#c9a961]" />
                    <div>
                      <p className="text-sm text-gray-500">Offering Closes</p>
                      <p className="font-medium text-[#1a1a1a]">
                        {new Date(prospectus.closeDate).toLocaleDateString(
                          'en-US',
                          {month: 'long', day: 'numeric', year: 'numeric'}
                        )}
                      </p>
                    </div>
                  </div>
                )}
                {prospectus.projectedTimeline && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#c9a961]" />
                    <div>
                      <p className="text-sm text-gray-500">Hold Period</p>
                      <p className="font-medium text-[#1a1a1a]">
                        {prospectus.projectedTimeline}
                      </p>
                    </div>
                  </div>
                )}
                {prospectus.accessLevel && (
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-[#c9a961]" />
                    <div>
                      <p className="text-sm text-gray-500">Access Level</p>
                      <p className="font-medium text-[#1a1a1a] capitalize">
                        {prospectus.accessLevel === 'accredited'
                          ? 'Accredited Investors Only'
                          : prospectus.accessLevel}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-[#1a1a1a] rounded-xl p-6 text-center">
              <h3 className="font-display text-lg text-white mb-2">
                Have Questions?
              </h3>
              <p className="text-white/70 text-sm mb-4">
                Our investor relations team is here to help.
              </p>
              <a
                href="mailto:investors@goldengateadvisors.com"
                className="btn-gold px-6 py-2 rounded-lg text-sm font-semibold inline-block"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
