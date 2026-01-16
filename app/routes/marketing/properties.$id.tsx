import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Calendar,
  Car,
  CheckCircle,
  Home,
  Mail,
  MapPin,
  Maximize,
  Phone,
} from 'lucide-react'
import {Link, useLoaderData} from 'react-router'
import {urlFor} from '~/sanity/image'

import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {PROPERTY_QUERY} from '~/sanity/queries'
import type {Route} from './+types/properties.$id'

interface SanityProperty {
  _id: string
  title: string
  slug: string
  price: number
  description?: string
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
  lotSize?: number
  yearBuilt?: number
  parkingSpaces?: number
  mainImage?: {asset: {_ref: string}}
  gallery?: Array<{asset: {_ref: string}}>
  status: string
  propertyType?: string
  features?: string[]
  agent?: {
    _id: string
    name: string
    role: string
    image?: {asset: {_ref: string}}
    email?: string
    phone?: string
  }
}

export async function loader({params, request}: Route.LoaderArgs) {
  const {options} = await loadQueryOptions(request.headers)
  const slug = params.id

  const {data: property} = await loadQuery<SanityProperty | null>(
    PROPERTY_QUERY,
    {slug},
    options
  )

  if (!property) {
    throw new Response('Property not found', {status: 404})
  }

  return {property}
}

export const meta: Route.MetaFunction = ({data}) => {
  if (!data?.property) {
    return [{title: 'Property Not Found | Golden Gate Home Advisors'}]
  }

  const {property} = data
  const location = property.address
    ? `${property.address.neighborhood}, ${property.address.city}`
    : 'Bay Area'

  // Schema.org RealEstateListing structured data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description || `${property.bedrooms} bed, ${property.bathrooms} bath property in ${location}`,
    url: `https://goldengateadvisors.com/properties/${property.slug}`,
    datePosted: new Date().toISOString().split('T')[0],
    ...(property.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.address.street,
        addressLocality: property.address.city,
        addressRegion: property.address.state,
        postalCode: property.address.zip,
        addressCountry: 'US',
      },
    }),
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'USD',
      availability: property.status === 'for-sale' || property.status === 'available'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
    },
    ...(property.squareFeet && {
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.squareFeet,
        unitCode: 'FTK',
      },
    }),
    numberOfRooms: property.bedrooms + property.bathrooms,
    numberOfBedrooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    ...(property.yearBuilt && {yearBuilt: property.yearBuilt}),
    ...(property.propertyType && {propertyType: property.propertyType}),
  }

  return [
    {title: `${property.title} | Golden Gate Home Advisors`},
    {
      name: 'description',
      content: `${property.title} - ${property.bedrooms} bed, ${property.bathrooms} bath property in ${location}. Listed at ${formatPrice(property.price)}.`,
    },
    {property: 'og:title', content: `${property.title} | Golden Gate Home Advisors`},
    {
      property: 'og:description',
      content: `${property.bedrooms} bed, ${property.bathrooms} bath property in ${location}. Listed at ${formatPrice(property.price)}.`,
    },
    {property: 'og:type', content: 'website'},
    {
      'script:ld+json': schemaData,
    },
  ]
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'available':
      return 'bg-green-500'
    case 'pending':
      return 'bg-yellow-500'
    case 'sold':
      return 'bg-red-500'
    case 'coming_soon':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

function formatStatus(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Default property for fallback
const defaultProperty: SanityProperty = {
  _id: 'default',
  title: 'Modern Craftsman with Bay Views',
  slug: 'modern-craftsman-bay-views',
  price: 3450000,
  description:
    'This stunning modern craftsman home offers breathtaking panoramic views of the San Francisco Bay. Recently renovated with high-end finishes throughout, the property features an open floor plan, chef\'s kitchen with premium appliances, and a spa-like primary suite. The landscaped backyard includes a covered patio perfect for entertaining.',
  address: {
    street: '123 Hillside Avenue',
    city: 'San Francisco',
    neighborhood: 'Pacific Heights',
    state: 'CA',
    zip: '94115',
  },
  bedrooms: 4,
  bathrooms: 3.5,
  squareFeet: 3200,
  lotSize: 5500,
  yearBuilt: 2018,
  parkingSpaces: 2,
  status: 'available',
  propertyType: 'Single Family',
  features: [
    'Bay Views',
    'Chef\'s Kitchen',
    'Home Office',
    'Wine Cellar',
    'Smart Home Technology',
    'Heated Floors',
    'Solar Panels',
    'Electric Car Charger',
  ],
}

export default function PropertyDetail() {
  const {property: sanityProperty} = useLoaderData<typeof loader>()
  const property = sanityProperty || defaultProperty

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-8 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`${getStatusColor(property.status)} text-white text-xs font-semibold px-3 py-1 rounded-full`}
                >
                  {formatStatus(property.status)}
                </span>
                {property.propertyType && (
                  <span className="text-white/60 text-sm">
                    {property.propertyType}
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-2">
                {property.title}
              </h1>
              {property.address && (
                <p className="text-white/70 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {property.address.street}, {property.address.neighborhood},{' '}
                  {property.address.city}, {property.address.state}{' '}
                  {property.address.zip}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[#c9a961] font-display text-3xl sm:text-4xl">
                {formatPrice(property.price)}
              </p>
              <p className="text-white/60 text-sm">
                ${Math.round(property.price / property.squareFeet).toLocaleString()}/sqft
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-8 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="aspect-[4/3] bg-gray-800 rounded-xl overflow-hidden">
              {property.mainImage ? (
                <img
                  src={urlFor(property.mainImage).width(800).height(600).url()}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <Home className="w-16 h-16" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(property.gallery || []).slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] bg-gray-800 rounded-xl overflow-hidden"
                >
                  <img
                    src={urlFor(image).width(400).height(300).url()}
                    alt={`${property.title} - Image ${index + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
              {(!property.gallery || property.gallery.length === 0) &&
                [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] bg-gray-800 rounded-xl flex items-center justify-center text-gray-600"
                  >
                    <Home className="w-8 h-8" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <BedDouble className="w-6 h-6 mx-auto mb-2 text-[#c9a961]" />
                  <p className="font-display text-2xl text-[#1a1a1a]">
                    {property.bedrooms}
                  </p>
                  <p className="text-gray-500 text-sm">Bedrooms</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Bath className="w-6 h-6 mx-auto mb-2 text-[#c9a961]" />
                  <p className="font-display text-2xl text-[#1a1a1a]">
                    {property.bathrooms}
                  </p>
                  <p className="text-gray-500 text-sm">Bathrooms</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Maximize className="w-6 h-6 mx-auto mb-2 text-[#c9a961]" />
                  <p className="font-display text-2xl text-[#1a1a1a]">
                    {property.squareFeet.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">Sq Ft</p>
                </div>
                {property.yearBuilt && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-[#c9a961]" />
                    <p className="font-display text-2xl text-[#1a1a1a]">
                      {property.yearBuilt}
                    </p>
                    <p className="text-gray-500 text-sm">Year Built</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-12">
                <h2 className="font-display text-2xl text-[#1a1a1a] mb-4">
                  About This Property
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {property.description ||
                    'Contact us for more details about this beautiful property.'}
                </p>
              </div>

              {/* Property Details Grid */}
              <div className="mb-12">
                <h2 className="font-display text-2xl text-[#1a1a1a] mb-6">
                  Property Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Property Type</span>
                    <span className="font-medium text-[#1a1a1a]">
                      {property.propertyType || 'Residential'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Year Built</span>
                    <span className="font-medium text-[#1a1a1a]">
                      {property.yearBuilt || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Lot Size</span>
                    <span className="font-medium text-[#1a1a1a]">
                      {property.lotSize
                        ? `${property.lotSize.toLocaleString()} sqft`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Parking</span>
                    <span className="font-medium text-[#1a1a1a]">
                      {property.parkingSpaces
                        ? `${property.parkingSpaces} spaces`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Neighborhood</span>
                    <span className="font-medium text-[#1a1a1a]">
                      {property.address?.neighborhood || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Status</span>
                    <span className="font-medium text-[#1a1a1a]">
                      {formatStatus(property.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl text-[#1a1a1a] mb-6">
                    Features & Amenities
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#c9a961]" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                {/* Contact Card */}
                <div className="bg-[#1a1a1a] rounded-2xl p-8 mb-6">
                  <h3 className="font-display text-xl text-white mb-6">
                    Interested in this property?
                  </h3>
                  <p className="text-white/70 mb-6">
                    Schedule a private showing or request more information about
                    this listing.
                  </p>
                  <Link
                    to="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#c9a961] hover:bg-[#b8994f] text-[#1a1a1a] px-6 py-3 rounded-lg font-semibold transition-colors mb-4"
                  >
                    Schedule a Showing
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/get-started/buyer"
                    className="w-full inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Request More Info
                  </Link>
                </div>

                {/* Agent Card */}
                {property.agent && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-display text-lg text-[#1a1a1a] mb-4">
                      Listing Agent
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                        {property.agent.image ? (
                          <img
                            src={urlFor(property.agent.image)
                              .width(64)
                              .height(64)
                              .url()}
                            alt={property.agent.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Home className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a1a1a]">
                          {property.agent.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {property.agent.role}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {property.agent.phone && (
                        <a
                          href={`tel:${property.agent.phone}`}
                          className="flex items-center gap-2 text-gray-600 hover:text-[#c9a961] transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          {property.agent.phone}
                        </a>
                      )}
                      {property.agent.email && (
                        <a
                          href={`mailto:${property.agent.email}`}
                          className="flex items-center gap-2 text-gray-600 hover:text-[#c9a961] transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          {property.agent.email}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Default Agent Card if no agent */}
                {!property.agent && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-display text-lg text-[#1a1a1a] mb-4">
                      Contact Our Team
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Have questions about this property? Our team is ready to
                      help.
                    </p>
                    <div className="space-y-2">
                      <a
                        href="tel:+14155551234"
                        className="flex items-center gap-2 text-gray-600 hover:text-[#c9a961] transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        (415) 555-1234
                      </a>
                      <a
                        href="mailto:hello@goldengateadvisors.com"
                        className="flex items-center gap-2 text-gray-600 hover:text-[#c9a961] transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        hello@goldengateadvisors.com
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-[#1a1a1a] mb-4">
            Looking for Something Different?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8">
            Browse our full collection of properties or let us help you find
            exactly what you&apos;re looking for.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#333] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Properties
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/get-started/buyer"
              className="inline-flex items-center gap-2 border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Work With a Buyer&apos;s Agent
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
