import {ArrowRight, Bath, BedDouble, MapPin, Maximize} from 'lucide-react'
import {Link, useLoaderData} from 'react-router'

import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {PROPERTIES_QUERY} from '~/sanity/queries'
import type {Route} from './+types/properties'

interface SanityProperty {
  _id: string
  title: string
  slug: string
  price: number
  address: {
    street: string
    city: string
    neighborhood: string
    state: string
    zip: string
  }
  bedrooms: number
  bathrooms: number
  squareFeet: number
  mainImage?: {asset: {_ref: string}}
  status: string
  propertyType?: string
  features?: string[]
  yearBuilt?: number
}

export async function loader({request}: Route.LoaderArgs) {
  const {options} = await loadQueryOptions(request.headers)
  const {data: properties} = await loadQuery<SanityProperty[]>(
    PROPERTIES_QUERY,
    {},
    options
  )
  return {properties: properties || []}
}

// Format price as currency
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

// Format status for display
function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'for-sale': 'For Sale',
    'coming-soon': 'Coming Soon',
    'sold': 'Sold',
    'pending': 'Pending',
  }
  return statusMap[status] || status
}

const defaultProperties: SanityProperty[] = [
  {
    _id: '1',
    title: 'Modern Marina Townhouse',
    slug: 'modern-marina-townhouse',
    address: {
      street: '123 Marina Blvd',
      city: 'San Francisco',
      neighborhood: 'Marina District',
      state: 'CA',
      zip: '94123',
    },
    price: 2850000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2800,
    status: 'for-sale',
    propertyType: 'Single Family',
  },
  {
    _id: '2',
    title: 'Pacific Heights Victorian',
    slug: 'pacific-heights-victorian',
    address: {
      street: '456 Broadway',
      city: 'San Francisco',
      neighborhood: 'Pacific Heights',
      state: 'CA',
      zip: '94115',
    },
    price: 4200000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 3500,
    status: 'for-sale',
    propertyType: 'Single Family',
  },
  {
    _id: '3',
    title: 'Contemporary Noe Valley Home',
    slug: 'contemporary-noe-valley-home',
    address: {
      street: '789 24th St',
      city: 'San Francisco',
      neighborhood: 'Noe Valley',
      state: 'CA',
      zip: '94114',
    },
    price: 3100000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 2200,
    status: 'coming-soon',
    propertyType: 'Townhouse',
  },
  {
    _id: '4',
    title: 'Russian Hill Penthouse',
    slug: 'russian-hill-penthouse',
    address: {
      street: '1010 Lombard St',
      city: 'San Francisco',
      neighborhood: 'Russian Hill',
      state: 'CA',
      zip: '94109',
    },
    price: 5500000,
    bedrooms: 4,
    bathrooms: 4,
    squareFeet: 3200,
    status: 'for-sale',
    propertyType: 'Condo',
  },
]

export default function Properties() {
  const {properties: sanityProperties} = useLoaderData<typeof loader>()
  const properties = sanityProperties.length > 0 ? sanityProperties : defaultProperties

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Our Listings
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
              Exceptional Properties
              <br />
              <span className="text-[#c9a961]">In Prime Locations</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl">
              Discover our curated selection of luxury homes, investment properties,
              and development opportunities across the San Francisco Bay Area.
            </p>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link
                key={property._id}
                to={`/properties/${property.slug}`}
                className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Status Badge */}
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 rounded text-xs font-semibold ${
                      property.status === 'coming-soon'
                        ? 'bg-[#1a1a1a] text-white'
                        : property.status === 'sold'
                          ? 'bg-gray-600 text-white'
                          : 'bg-[#c9a961] text-[#1a1a1a]'
                    }`}
                  >
                    {formatStatus(property.status)}
                  </div>
                  {property.propertyType && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded text-xs font-medium bg-white/90 text-[#1a1a1a]">
                      {property.propertyType}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-[#c9a961] font-display text-2xl font-semibold mb-2">
                    {formatPrice(property.price)}
                  </p>
                  <h3 className="font-semibold text-lg text-[#1a1a1a] mb-2 group-hover:text-[#c9a961] transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mb-4">
                    <MapPin size={14} />
                    {property.address.neighborhood}, {property.address.city}
                  </p>

                  {/* Features */}
                  <div className="flex items-center gap-6 text-gray-400 text-sm pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1.5">
                      <BedDouble size={18} />
                      {property.bedrooms} Beds
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath size={18} />
                      {property.bathrooms} Baths
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize size={18} />
                      {property.squareFeet.toLocaleString()} sqft
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Can&apos;t Find What You&apos;re Looking For?
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            Let Us Find Your
            <br />
            <span className="text-[#c9a961]">Perfect Property</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Our team has access to off-market listings and exclusive opportunities
            not shown on this site. Tell us what you&apos;re looking for.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/get-started"
              className="btn-gold px-10 py-4 rounded inline-flex items-center gap-2 text-base font-semibold"
            >
              Start Your Search
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="btn-outline px-10 py-4 rounded inline-flex items-center gap-2 text-base font-medium"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
