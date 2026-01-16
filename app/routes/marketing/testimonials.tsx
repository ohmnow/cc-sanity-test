import {Quote, Star, ArrowRight} from 'lucide-react'
import {Link, useLoaderData} from 'react-router'
import type {MetaFunction} from 'react-router'

import {BreadcrumbsLight} from '~/components/Breadcrumbs'

import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {TESTIMONIALS_QUERY} from '~/sanity/queries'
import type {Route} from './+types/testimonials'

interface SanityTestimonial {
  _id: string
  clientName: string
  clientTitle: string
  quote: string
  rating: number
  clientImage?: {asset: {_ref: string}}
  serviceType?: string
  featured?: boolean
}

export async function loader({request}: Route.LoaderArgs) {
  const {options} = await loadQueryOptions(request.headers)
  const {data: testimonials} = await loadQuery<SanityTestimonial[]>(
    TESTIMONIALS_QUERY,
    {},
    options
  )
  return {testimonials: testimonials || []}
}

export const meta: MetaFunction = () => {
  return [
    {title: 'Client Testimonials | Golden Gate Home Advisors'},
    {
      name: 'description',
      content:
        'Read what our clients say about working with Golden Gate Home Advisors. Real stories from Bay Area buyers, sellers, and investors.',
    },
    {property: 'og:title', content: 'Client Testimonials | Golden Gate Home Advisors'},
    {
      property: 'og:description',
      content: 'Real stories from satisfied Bay Area real estate clients.',
    },
    {property: 'og:type', content: 'website'},
  ]
}

const defaultTestimonials: SanityTestimonial[] = [
  {
    _id: '1',
    clientName: 'Sarah & Michael Chen',
    clientTitle: 'Home Sellers, Pacific Heights',
    quote: "Golden Gate Home Advisors made selling our family home an incredibly smooth experience. Their market knowledge and negotiation skills got us 15% over asking price. I couldn't recommend them more highly.",
    rating: 5,
    serviceType: 'selling',
  },
  {
    _id: '2',
    clientName: 'David Park',
    clientTitle: 'First-Time Buyer, Russian Hill',
    quote: "As first-time buyers in a competitive market, we felt completely supported throughout the entire process. They found us our dream home and guided us through every step with patience and expertise.",
    rating: 5,
    serviceType: 'buying',
  },
  {
    _id: '3',
    clientName: 'Jennifer Williams',
    clientTitle: 'Real Estate Investor, Marina District',
    quote: "I've worked with the Golden Gate team on multiple investment properties. Their renovation expertise and deal analysis have been invaluable to building my portfolio. They truly understand investor needs.",
    rating: 5,
    serviceType: 'investment',
  },
  {
    _id: '4',
    clientName: 'Robert & Lisa Thompson',
    clientTitle: 'Property Developers, Noe Valley',
    quote: "The before and after transformation of our investment property was remarkable. The team's vision and execution exceeded our expectations, and we achieved a 40% ROI on the renovation.",
    rating: 5,
    serviceType: 'investment',
  },
]

export default function Testimonials() {
  const {testimonials: sanityTestimonials} = useLoaderData<typeof loader>()
  const testimonials = sanityTestimonials.length > 0 ? sanityTestimonials : defaultTestimonials

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-40 pb-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8">
          <BreadcrumbsLight
            items={[{label: 'Testimonials'}]}
            className="mb-6"
          />
          <div className="max-w-3xl">
            <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Client Stories
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
              What Our Clients
              <br />
              <span className="text-[#c9a961]">Say About Us</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl">
              Real stories from real clients. Discover why families and investors
              trust Golden Gate Home Advisors for their most important real estate decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-display text-4xl text-[#c9a961] font-semibold">4.9</p>
              <p className="text-gray-600 text-sm">Average Rating</p>
            </div>
            <div>
              <p className="font-display text-4xl text-[#c9a961] font-semibold">150+</p>
              <p className="text-gray-600 text-sm">5-Star Reviews</p>
            </div>
            <div>
              <p className="font-display text-4xl text-[#c9a961] font-semibold">98%</p>
              <p className="text-gray-600 text-sm">Client Satisfaction</p>
            </div>
            <div>
              <p className="font-display text-4xl text-[#c9a961] font-semibold">85%</p>
              <p className="text-gray-600 text-sm">Referral Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="bg-gray-50 rounded-xl p-8 border border-gray-100 relative"
              >
                {/* Quote Icon */}
                <Quote className="absolute top-6 right-6 w-12 h-12 text-[#c9a961]/20" />

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="fill-[#c9a961] text-[#c9a961]"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 text-lg leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a961] to-[#8b7355] flex items-center justify-center">
                    <span className="text-white font-display text-sm">
                      {testimonial.clientName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">
                      {testimonial.clientName}
                    </p>
                    <p className="text-gray-500 text-sm">{testimonial.clientTitle}</p>
                  </div>
                </div>

                {/* Service Type Badge */}
                {testimonial.serviceType && (
                  <div className="absolute bottom-6 right-6">
                    <span className="text-xs font-medium text-[#c9a961] bg-[#c9a961]/10 px-3 py-1 rounded-full capitalize">
                      {testimonial.serviceType}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Join Our Success Stories
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            Ready to Write Your
            <br />
            <span className="text-[#c9a961]">Success Story?</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Whether you&apos;re buying, selling, or investing, we&apos;re here to help you
            achieve exceptional results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/get-started"
              className="btn-gold px-10 py-4 rounded inline-flex items-center gap-2 text-base font-semibold"
            >
              Get Started Today
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="btn-outline px-10 py-4 rounded inline-flex items-center gap-2 text-base font-medium"
            >
              Schedule a Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
