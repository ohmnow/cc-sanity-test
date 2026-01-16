import {
  ArrowRight,
  CheckCircle,
  Home,
  Building2,
  TrendingUp,
  Search,
  FileText,
  Handshake,
  Camera,
  DollarSign,
  BarChart3,
  Users,
  Shield,
  Clock,
  Target,
} from 'lucide-react'
import {Link, useLoaderData} from 'react-router'

import type {Route} from './+types/services.$service'

// Service data configuration
const servicesData: Record<
  string,
  {
    title: string
    subtitle: string
    description: string
    heroImage: string
    icon: typeof Home
    features: Array<{
      icon: typeof Home
      title: string
      description: string
    }>
    process: Array<{
      step: number
      title: string
      description: string
    }>
    benefits: string[]
    ctaTitle: string
    ctaDescription: string
  }
> = {
  buyers: {
    title: 'Buyer Representation',
    subtitle: 'Find Your Dream Home',
    description:
      'Expert guidance through every step of your home purchase in the competitive Bay Area market. From property discovery to closing, we protect your interests and help you make informed decisions.',
    heroImage: '/images/buyers-hero.jpg',
    icon: Home,
    features: [
      {
        icon: Search,
        title: 'Property Search & Discovery',
        description:
          'Access to off-market listings, new developments, and exclusive opportunities before they hit the public market.',
      },
      {
        icon: BarChart3,
        title: 'Market Analysis',
        description:
          'Deep market insights and comparable sales data to ensure you pay the right price for your home.',
      },
      {
        icon: FileText,
        title: 'Due Diligence',
        description:
          'Comprehensive property inspections, title review, and disclosure analysis to protect your investment.',
      },
      {
        icon: Handshake,
        title: 'Negotiation Support',
        description:
          'Expert negotiation strategies to secure the best terms and price in competitive situations.',
      },
    ],
    process: [
      {
        step: 1,
        title: 'Initial Consultation',
        description:
          'We discuss your needs, preferences, budget, and timeline to create a personalized search strategy.',
      },
      {
        step: 2,
        title: 'Property Search',
        description:
          'We identify properties matching your criteria, including off-market opportunities and coming-soon listings.',
      },
      {
        step: 3,
        title: 'Property Tours',
        description:
          'We schedule and accompany you on property tours, providing expert insights on each home.',
      },
      {
        step: 4,
        title: 'Offer & Negotiation',
        description:
          'We craft competitive offers and negotiate on your behalf to secure the best possible terms.',
      },
      {
        step: 5,
        title: 'Due Diligence',
        description:
          'We coordinate inspections, review disclosures, and ensure all contingencies are addressed.',
      },
      {
        step: 6,
        title: 'Closing',
        description:
          'We guide you through the closing process and ensure a smooth transition to homeownership.',
      },
    ],
    benefits: [
      'Access to exclusive off-market properties',
      'Expert local market knowledge',
      'Strong negotiation skills',
      'Full-service transaction management',
      'Network of trusted vendors and professionals',
      'Post-purchase support and resources',
    ],
    ctaTitle: 'Ready to Find Your Dream Home?',
    ctaDescription:
      "Schedule a consultation and let's start your home search journey together.",
  },
  sellers: {
    title: 'Seller Representation',
    subtitle: 'Maximize Your Sale',
    description:
      "Strategic marketing, expert pricing, and professional presentation to achieve the highest possible sale price for your property. We handle every detail so you don't have to.",
    heroImage: '/images/sellers-hero.jpg',
    icon: Building2,
    features: [
      {
        icon: DollarSign,
        title: 'Strategic Pricing',
        description:
          'Data-driven pricing strategy based on comprehensive market analysis and comparable sales.',
      },
      {
        icon: Camera,
        title: 'Professional Marketing',
        description:
          'High-quality photography, virtual tours, and targeted marketing campaigns to attract qualified buyers.',
      },
      {
        icon: Home,
        title: 'Home Staging',
        description:
          'Professional staging consultation and services to showcase your home in its best light.',
      },
      {
        icon: Users,
        title: 'Buyer Qualification',
        description:
          'Thorough vetting of potential buyers to ensure serious, qualified offers.',
      },
    ],
    process: [
      {
        step: 1,
        title: 'Home Evaluation',
        description:
          'We conduct a thorough evaluation of your property and provide a detailed market analysis.',
      },
      {
        step: 2,
        title: 'Preparation',
        description:
          'We recommend improvements and coordinate staging to maximize your home\'s appeal.',
      },
      {
        step: 3,
        title: 'Marketing Launch',
        description:
          'We launch a comprehensive marketing campaign across multiple channels.',
      },
      {
        step: 4,
        title: 'Showings & Open Houses',
        description:
          'We manage all showings and host strategic open houses to generate interest.',
      },
      {
        step: 5,
        title: 'Offer Review',
        description:
          'We review and present all offers, helping you understand the terms and negotiate the best deal.',
      },
      {
        step: 6,
        title: 'Close & Celebrate',
        description:
          'We manage the closing process and ensure a smooth transaction.',
      },
    ],
    benefits: [
      'Maximum exposure to qualified buyers',
      'Professional photography and marketing',
      'Expert negotiation for top dollar',
      'Streamlined showing management',
      'Full-service transaction coordination',
      'Post-sale support and resources',
    ],
    ctaTitle: 'Ready to Sell Your Home?',
    ctaDescription:
      'Get a complimentary home valuation and marketing consultation.',
  },
  investors: {
    title: 'Investment Advisory',
    subtitle: 'Build Your Portfolio',
    description:
      'Partner with us on strategic real estate investments. From fix-and-flip opportunities to development projects, we deliver institutional-grade analysis and hands-on project management.',
    heroImage: '/images/investors-hero.jpg',
    icon: TrendingUp,
    features: [
      {
        icon: Target,
        title: 'Deal Sourcing',
        description:
          'Access to off-market investment opportunities and distressed properties with high return potential.',
      },
      {
        icon: BarChart3,
        title: 'Investment Analysis',
        description:
          'Comprehensive financial modeling, ROI projections, and risk assessment for every opportunity.',
      },
      {
        icon: Shield,
        title: 'Project Management',
        description:
          'Full-service renovation management from planning through completion.',
      },
      {
        icon: Clock,
        title: 'Capital Partnership',
        description:
          'Flexible investment structures and partnership opportunities for qualified investors.',
      },
    ],
    process: [
      {
        step: 1,
        title: 'Strategy Session',
        description:
          'We discuss your investment goals, risk tolerance, and capital availability.',
      },
      {
        step: 2,
        title: 'Deal Sourcing',
        description:
          'We identify and present investment opportunities matching your criteria.',
      },
      {
        step: 3,
        title: 'Due Diligence',
        description:
          'We conduct thorough analysis including financials, inspections, and market research.',
      },
      {
        step: 4,
        title: 'Acquisition',
        description:
          'We handle negotiations and acquisition, structuring the deal for optimal returns.',
      },
      {
        step: 5,
        title: 'Value Creation',
        description:
          'We manage renovations and improvements to maximize property value.',
      },
      {
        step: 6,
        title: 'Exit Strategy',
        description:
          'We execute the optimal exit strategy, whether sale, refinance, or hold.',
      },
    ],
    benefits: [
      'Access to exclusive investment opportunities',
      'Institutional-grade financial analysis',
      'Experienced renovation management',
      'Strong contractor and vendor relationships',
      'Flexible partnership structures',
      'Proven track record of returns',
    ],
    ctaTitle: 'Ready to Invest?',
    ctaDescription:
      'Schedule a consultation to discuss investment opportunities.',
  },
}

export async function loader({params}: Route.LoaderArgs) {
  const {service} = params
  const serviceData = servicesData[service || '']

  if (!serviceData) {
    throw new Response('Service not found', {status: 404})
  }

  return {service: service || '', serviceData}
}

export const meta: Route.MetaFunction = ({data}) => {
  if (!data) {
    return [{title: 'Service Not Found | Golden Gate Home Advisors'}]
  }

  return [
    {title: `${data.serviceData.title} | Golden Gate Home Advisors`},
    {name: 'description', content: data.serviceData.description},
    {property: 'og:title', content: `${data.serviceData.title} | Golden Gate Home Advisors`},
    {property: 'og:description', content: data.serviceData.description},
    {property: 'og:type', content: 'website'},
  ]
}

export default function ServiceDetail() {
  const {service, serviceData} = useLoaderData<typeof loader>()
  const Icon = serviceData.icon

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#c9a961] rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-[#1a1a1a]" />
              </div>
              <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase">
                {serviceData.subtitle}
              </p>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
              {serviceData.title}
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl">
              {serviceData.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={`/get-started/${service}`}
                className="inline-flex items-center gap-2 bg-[#c9a961] hover:bg-[#b8994f] text-[#1a1a1a] px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
              What We Offer
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1a1a1a]">
              Comprehensive Services
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {serviceData.features.map((feature, index) => {
              const FeatureIcon = feature.icon
              return (
                <div
                  key={index}
                  className="p-8 bg-gray-50 rounded-2xl hover:bg-[#1a1a1a] hover:text-white group transition-colors duration-300"
                >
                  <div className="w-14 h-14 bg-[#c9a961] rounded-xl flex items-center justify-center mb-6">
                    <FeatureIcon className="w-7 h-7 text-[#1a1a1a]" />
                  </div>
                  <h3 className="font-display text-xl mb-3">{feature.title}</h3>
                  <p className="text-gray-600 group-hover:text-white/70">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Our Process
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1a1a1a]">
              How We Work
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            {serviceData.process.map((step, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#c9a961] rounded-full flex items-center justify-center font-display text-xl text-[#1a1a1a]">
                    {step.step}
                  </div>
                  {index < serviceData.process.length - 1 && (
                    <div className="w-0.5 h-16 bg-[#c9a961]/30 mx-auto mt-2" />
                  )}
                </div>
                <div className="pt-2">
                  <h3 className="font-display text-xl text-[#1a1a1a] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
                Why Choose Us
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-[#1a1a1a] mb-8">
                The Golden Gate Advantage
              </h2>
              <ul className="space-y-4">
                {serviceData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#c9a961] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#1a1a1a] rounded-2xl p-10">
              <h3 className="font-display text-2xl text-white mb-4">
                {serviceData.ctaTitle}
              </h3>
              <p className="text-white/70 mb-8">{serviceData.ctaDescription}</p>
              <Link
                to={`/get-started/${service}`}
                className="inline-flex items-center gap-2 bg-[#c9a961] hover:bg-[#b8994f] text-[#1a1a1a] px-6 py-3 rounded-lg font-semibold transition-colors w-full justify-center"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Take the Next Step
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Schedule a free consultation to discuss your real estate goals. Our
            team is here to help you every step of the way.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to={`/get-started/${service}`}
              className="inline-flex items-center gap-2 bg-[#c9a961] hover:bg-[#b8994f] text-[#1a1a1a] px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Schedule Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
