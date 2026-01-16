import {ArrowRight, Building2, Home, TrendingUp, type LucideIcon} from 'lucide-react'
import {Link, useLoaderData} from 'react-router'
import type {MetaFunction} from 'react-router'

import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {SERVICES_QUERY} from '~/sanity/queries'
import type {Route} from './+types/services'

interface SanityService {
  _id: string
  title: string
  slug: string
  shortDescription: string
  icon?: string
  category?: string
  features?: Array<{title: string; description?: string}>
  ctaText?: string
  ctaLink?: string
}

export async function loader({request}: Route.LoaderArgs) {
  const {options} = await loadQueryOptions(request.headers)
  const {data: services} = await loadQuery<SanityService[]>(
    SERVICES_QUERY,
    {},
    options
  )
  return {services: services || []}
}

export const meta: MetaFunction = () => {
  return [
    {title: 'Our Services | Golden Gate Home Advisors'},
    {
      name: 'description',
      content:
        'Comprehensive real estate services for Bay Area buyers, sellers, and investors. Expert guidance, market analysis, and investment advisory.',
    },
    {property: 'og:title', content: 'Our Services | Golden Gate Home Advisors'},
    {
      property: 'og:description',
      content: 'Expert real estate services for buyers, sellers, and investors in the Bay Area.',
    },
    {property: 'og:type', content: 'website'},
  ]
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Home,
  Building2,
  TrendingUp,
}

const defaultServices = [
  {
    _id: '1',
    title: 'Buyer Representation',
    slug: 'buyers',
    shortDescription: 'Find your dream home with expert guidance through the competitive Bay Area market.',
    icon: 'Home',
    features: [
      {title: 'Market Analysis', description: 'Deep market insights'},
      {title: 'Property Search', description: 'Access to off-market listings'},
      {title: 'Negotiation Support', description: 'Expert deal making'},
    ],
  },
  {
    _id: '2',
    title: 'Seller Representation',
    slug: 'sellers',
    shortDescription: 'Maximize your property value with strategic marketing and expert pricing.',
    icon: 'Building2',
    features: [
      {title: 'Home Staging', description: 'Professional presentation'},
      {title: 'Marketing Strategy', description: 'Multi-channel exposure'},
      {title: 'Pricing Optimization', description: 'Data-driven pricing'},
    ],
  },
  {
    _id: '3',
    title: 'Investment Advisory',
    slug: 'investors',
    shortDescription: 'Build wealth through strategic real estate investments and development projects.',
    icon: 'TrendingUp',
    features: [
      {title: 'Deal Analysis', description: 'ROI projections'},
      {title: 'Renovation Projects', description: 'Value-add opportunities'},
      {title: 'Portfolio Management', description: 'Long-term strategy'},
    ],
  },
]

export default function Services() {
  const {services: sanityServices} = useLoaderData<typeof loader>()
  const services = sanityServices.length > 0 ? sanityServices : defaultServices

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Our Services
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
              Expert Guidance for
              <br />
              <span className="text-[#c9a961]">Every Real Estate Need</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl">
              Whether you&apos;re buying your dream home, selling a property, or building
              an investment portfolio, our team provides personalized service and
              unmatched market expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon || 'Home'] || Home
              return (
                <div
                  key={service._id}
                  className="bg-gray-50 rounded-xl p-8 border border-gray-100 hover:shadow-xl transition-shadow group"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#c9a961] transition-colors">
                    <IconComponent className="w-8 h-8 text-[#c9a961] group-hover:text-[#1a1a1a] transition-colors" />
                  </div>

                  {/* Content */}
                  <h2 className="font-display text-2xl text-[#1a1a1a] mb-4">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature) => (
                        <li
                          key={feature.title}
                          className="flex items-start gap-3"
                        >
                          <div className="w-2 h-2 bg-[#c9a961] rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-[#1a1a1a]">
                              {feature.title}
                            </p>
                            {feature.description && (
                              <p className="text-sm text-gray-500">
                                {feature.description}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Link */}
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-[#1a1a1a] font-semibold group-hover:text-[#c9a961] transition-colors"
                  >
                    Learn More
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
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
            <h2 className="font-display text-3xl sm:text-4xl text-[#1a1a1a] mb-6">
              How We Work With You
            </h2>
            <p className="text-gray-600 text-lg">
              A streamlined approach designed to deliver exceptional results at every step.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {step: '01', title: 'Discovery', description: 'We listen to understand your goals, timeline, and unique requirements.'},
              {step: '02', title: 'Strategy', description: 'Our team develops a customized plan tailored to your specific situation.'},
              {step: '03', title: 'Execution', description: 'We implement the strategy with precision, keeping you informed throughout.'},
              {step: '04', title: 'Success', description: 'We guide you through closing and ensure a smooth transition to your next chapter.'},
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-[#c9a961] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-xl text-[#1a1a1a] font-bold">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display text-xl text-[#1a1a1a] mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Get Started
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            Ready to Work
            <br />
            <span className="text-[#c9a961]">With Our Team?</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Schedule a free consultation to discuss your real estate goals and discover
            how we can help you achieve them.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/get-started"
              className="btn-gold px-10 py-4 rounded inline-flex items-center gap-2 text-base font-semibold"
            >
              Schedule Consultation
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="btn-outline px-10 py-4 rounded inline-flex items-center gap-2 text-base font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
