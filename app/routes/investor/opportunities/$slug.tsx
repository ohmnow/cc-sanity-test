import {Link, useParams} from 'react-router'
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
} from 'lucide-react'

// Placeholder data - will be replaced with Sanity query
const opportunity = {
  id: '1',
  slug: 'bayview-heights-development',
  title: 'Bayview Heights Development',
  location: 'San Francisco, CA',
  address: '1234 Bayview Heights Blvd, San Francisco, CA 94124',
  propertyType: 'Multi-Family Residential',
  minimumInvestment: 50000,
  maximumInvestment: 500000,
  targetReturn: '15-18%',
  holdPeriod: '24-36 months',
  status: 'open',
  accessLevel: 'public',
  closingDate: '2026-03-15',
  totalRaise: 2500000,
  currentRaised: 1750000,
  description: `
    Premium multi-family development in the heart of Bayview Heights. This project offers investors
    an opportunity to participate in a 24-unit residential complex with a projected 15-18% annual return.

    The development will feature modern amenities, sustainable building practices, and is strategically
    located near public transportation and local businesses.
  `,
  highlights: [
    'Prime location in growing San Francisco neighborhood',
    '24 units across 4 floors with parking',
    'LEED-certified sustainable building design',
    'Strong rental demand in the area',
    'Experienced development team with 15+ years track record',
    'Tax-advantaged investment structure',
  ],
  financials: {
    purchasePrice: 1800000,
    renovationBudget: 450000,
    totalProjectCost: 2500000,
    projectedSalePrice: 3200000,
    projectedProfit: 700000,
    projectedROI: '28%',
  },
  timeline: [
    {date: '2026-01-15', event: 'Offering Opens', completed: true},
    {date: '2026-03-15', event: 'Offering Closes', completed: false},
    {date: '2026-04-01', event: 'Property Acquisition', completed: false},
    {date: '2026-04-15', event: 'Construction Begins', completed: false},
    {date: '2027-06-01', event: 'Construction Complete', completed: false},
    {date: '2027-09-01', event: 'Full Occupancy Target', completed: false},
    {date: '2028-12-01', event: 'Projected Exit', completed: false},
  ],
  documents: [
    {name: 'Investment Summary', type: 'PDF', size: '2.4 MB'},
    {name: 'Financial Projections', type: 'XLSX', size: '156 KB'},
    {name: 'Property Inspection Report', type: 'PDF', size: '5.1 MB'},
    {name: 'Market Analysis', type: 'PDF', size: '1.8 MB'},
  ],
  images: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
  ],
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function OpportunityDetail() {
  const {slug} = useParams()
  const fundingProgress = (opportunity.currentRaised / opportunity.totalRaise) * 100

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
            <div className="rounded-xl overflow-hidden">
              <img
                src={opportunity.images[0]}
                alt={opportunity.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {opportunity.images.slice(1).map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${opportunity.title} ${index + 2}`}
                    className="w-full h-24 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Investment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Open for Investment
                </span>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share2 size={18} className="text-gray-500" />
                </button>
              </div>

              <h1 className="font-display text-2xl text-[#1a1a1a] mb-2">
                {opportunity.title}
              </h1>

              <div className="flex items-center gap-2 text-gray-500 mb-6">
                <MapPin size={16} />
                {opportunity.location}
              </div>

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
                  {formatCurrency(opportunity.currentRaised)} of {formatCurrency(opportunity.totalRaise)} raised
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Min. Investment</p>
                  <p className="font-semibold text-[#1a1a1a]">
                    {formatCurrency(opportunity.minimumInvestment)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Target Return</p>
                  <p className="font-semibold text-green-600">{opportunity.targetReturn}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Hold Period</p>
                  <p className="font-semibold text-[#1a1a1a]">{opportunity.holdPeriod}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Closing Date</p>
                  <p className="font-semibold text-[#1a1a1a]">
                    {new Date(opportunity.closingDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <Link
                to={`/investor/opportunities/${slug}/loi`}
                className="btn-gold w-full py-3 rounded-lg font-semibold text-center block"
              >
                Submit Letter of Intent
              </Link>

              <p className="text-xs text-gray-500 text-center mt-3">
                By submitting an LOI, you express interest in this investment opportunity.
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
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 whitespace-pre-line">
                  {opportunity.description}
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-[#c9a961]" />
                  <div>
                    <p className="text-sm text-gray-500">Property Type</p>
                    <p className="font-medium text-[#1a1a1a]">{opportunity.propertyType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#c9a961]" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-[#1a1a1a]">{opportunity.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-[#c9a961]" />
                  <div>
                    <p className="text-sm text-gray-500">Projected ROI</p>
                    <p className="font-medium text-green-600">{opportunity.financials.projectedROI}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-display text-xl text-[#1a1a1a] mb-4">
                Investment Highlights
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {opportunity.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-display text-xl text-[#1a1a1a] mb-4">
                Financial Summary
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Purchase Price</span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {formatCurrency(opportunity.financials.purchasePrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Renovation Budget</span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {formatCurrency(opportunity.financials.renovationBudget)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Project Cost</span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {formatCurrency(opportunity.financials.totalProjectCost)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Projected Sale Price</span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {formatCurrency(opportunity.financials.projectedSalePrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 bg-green-50 rounded-lg px-4 -mx-4">
                  <span className="font-medium text-green-700">Projected Profit</span>
                  <span className="font-bold text-green-700">
                    {formatCurrency(opportunity.financials.projectedProfit)}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  <strong>Disclaimer:</strong> These projections are estimates based on current market
                  conditions and are not guaranteed. Past performance does not indicate future results.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-display text-xl text-[#1a1a1a] mb-4">
                Project Timeline
              </h2>
              <div className="relative">
                {opportunity.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 pb-6 last:pb-0">
                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className={index !== opportunity.timeline.length - 1 ? 'border-l border-gray-200 pl-4 -ml-[22px] pb-6' : 'pl-4 -ml-[22px]'}>
                      <p className="font-medium text-[#1a1a1a]">{item.event}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Documents */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-display text-lg text-[#1a1a1a] mb-4">
                Documents
              </h3>
              <div className="space-y-3">
                {opportunity.documents.map((doc, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#c9a961] hover:bg-[#c9a961]/5 transition-colors text-left"
                  >
                    <FileText className="w-5 h-5 text-[#c9a961]" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1a1a1a] truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type} · {doc.size}</p>
                    </div>
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Key Dates */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-display text-lg text-[#1a1a1a] mb-4">
                Key Dates
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#c9a961]" />
                  <div>
                    <p className="text-sm text-gray-500">Offering Closes</p>
                    <p className="font-medium text-[#1a1a1a]">
                      {new Date(opportunity.closingDate).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#c9a961]" />
                  <div>
                    <p className="text-sm text-gray-500">Hold Period</p>
                    <p className="font-medium text-[#1a1a1a]">{opportunity.holdPeriod}</p>
                  </div>
                </div>
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
