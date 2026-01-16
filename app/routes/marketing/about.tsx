import {ArrowRight, Award, Heart, Target, Users} from 'lucide-react'
import {Link, useLoaderData} from 'react-router'
import type {MetaFunction} from 'react-router'

import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {TEAM_MEMBERS_QUERY, SITE_SETTINGS_QUERY} from '~/sanity/queries'
import type {Route} from './+types/about'

interface SanityTeamMember {
  _id: string
  name: string
  slug: string
  role: string
  shortBio: string
  image?: {asset: {_ref: string}}
  email?: string
  phone?: string
  licenseNumber?: string
  specialties?: string[]
  social?: {
    linkedin?: string
    instagram?: string
  }
}

interface SanitySiteSettings {
  siteName?: string
  tagline?: string
  stats?: Array<{value: string; label: string}>
}

export async function loader({request}: Route.LoaderArgs) {
  const {options} = await loadQueryOptions(request.headers)
  const [{data: teamMembers}, {data: siteSettings}] = await Promise.all([
    loadQuery<SanityTeamMember[]>(TEAM_MEMBERS_QUERY, {}, options),
    loadQuery<SanitySiteSettings>(SITE_SETTINGS_QUERY, {}, options),
  ])
  return {
    teamMembers: teamMembers || [],
    siteSettings,
  }
}

export const meta: MetaFunction = () => {
  return [
    {title: 'About Us | Golden Gate Home Advisors'},
    {
      name: 'description',
      content:
        'Meet the Golden Gate Home Advisors team. Over 15 years of experience helping Bay Area clients achieve their real estate goals with integrity and expertise.',
    },
    {property: 'og:title', content: 'About Us | Golden Gate Home Advisors'},
    {
      property: 'og:description',
      content: 'Meet our team of experienced Bay Area real estate professionals.',
    },
    {property: 'og:type', content: 'website'},
  ]
}

const defaultTeamMembers: SanityTeamMember[] = [
  {
    _id: '1',
    name: 'Marcus Chen',
    slug: 'marcus-chen',
    role: 'Founder & Principal Broker',
    shortBio: 'With over 20 years in Bay Area real estate, Marcus founded Golden Gate Home Advisors with a vision to provide exceptional, personalized service.',
    specialties: ['Luxury Homes', 'Investment Properties'],
  },
  {
    _id: '2',
    name: 'Sarah Okonkwo',
    slug: 'sarah-okonkwo',
    role: 'Senior Buyer Specialist',
    shortBio: 'Sarah specializes in helping first-time buyers and relocating families find their perfect Bay Area home.',
    specialties: ['First-Time Buyers', 'Relocation'],
  },
  {
    _id: '3',
    name: 'David Nakamura',
    slug: 'david-nakamura',
    role: 'Listing & Marketing Director',
    shortBio: 'David combines his background in marketing with real estate expertise to achieve record-breaking sales prices.',
    specialties: ['Luxury Listings', 'Marketing Strategy'],
  },
  {
    _id: '4',
    name: 'Elena Rodriguez',
    slug: 'elena-rodriguez',
    role: 'Investment Analyst',
    shortBio: 'Elena provides detailed financial analysis and market research for investors seeking to build wealth through real estate.',
    specialties: ['Investment Analysis', 'Market Research'],
  },
]

export default function About() {
  const {teamMembers: sanityTeamMembers, siteSettings} = useLoaderData<typeof loader>()
  const teamMembers = sanityTeamMembers.length > 0 ? sanityTeamMembers : defaultTeamMembers

  const stats = siteSettings?.stats || [
    {value: '$127M+', label: 'Transaction Volume'},
    {value: '215+', label: 'Properties Transformed'},
    {value: '98%', label: 'Client Satisfaction'},
    {value: '16', label: 'Years of Excellence'},
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
              About Us
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
              Your Trusted Partners in
              <br />
              <span className="text-[#c9a961]">Bay Area Real Estate</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl">
              For over 16 years, Golden Gate Home Advisors has helped families,
              investors, and developers achieve their real estate dreams across
              San Francisco and the Bay Area.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl text-[#c9a961] font-semibold">
                  {stat.value}
                </p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
                Our Story
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-[#1a1a1a] mb-6">
                Built on Relationships,
                <br />
                Driven by Results
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Golden Gate Home Advisors was founded in 2008 with a simple mission:
                  to provide exceptional real estate service that puts clients first.
                  What started as a small team has grown into one of the Bay Area&apos;s
                  most trusted real estate advisories.
                </p>
                <p>
                  Our approach combines deep local market knowledge, innovative marketing
                  strategies, and a genuine commitment to understanding each client&apos;s
                  unique needs. We don&apos;t just close transactions—we build lasting
                  relationships.
                </p>
                <p>
                  Today, we specialize in luxury residential sales, investment properties,
                  and renovation projects. Our team of experts brings diverse backgrounds
                  and specialized expertise to serve buyers, sellers, and investors across
                  San Francisco&apos;s most desirable neighborhoods.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
                alt="Golden Gate Home Advisors team"
                className="rounded-xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#c9a961] text-[#1a1a1a] p-6 rounded-xl">
                <p className="font-display text-3xl font-bold">16+</p>
                <p className="text-sm">Years Serving<br />the Bay Area</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Our Values
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1a1a1a]">
              What Drives Us Every Day
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: 'Client First',
                description: 'Your goals are our priority. We listen, understand, and deliver personalized solutions.',
              },
              {
                icon: Award,
                title: 'Excellence',
                description: 'We maintain the highest standards in everything we do, from service to results.',
              },
              {
                icon: Users,
                title: 'Integrity',
                description: 'Honest advice and transparent communication build the foundation of trust.',
              },
              {
                icon: Target,
                title: 'Results',
                description: 'We&apos;re relentlessly focused on achieving the best possible outcomes.',
              },
            ].map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-[#c9a961]" />
                </div>
                <h3 className="font-display text-xl text-[#1a1a1a] mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Our Team
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1a1a1a] mb-4">
              Meet the Experts
            </h2>
            <p className="text-gray-600">
              A dedicated team of real estate professionals committed to your success.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member._id}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group"
              >
                {/* Image */}
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-display text-white/50">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl text-[#1a1a1a] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#c9a961] text-sm font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {member.shortBio}
                  </p>

                  {/* Specialties */}
                  {member.specialties && member.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.slice(0, 2).map((specialty) => (
                        <span
                          key={specialty}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Work With Us
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Let&apos;s discuss your real estate goals and discover how our team
            can help you achieve them.
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
