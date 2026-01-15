import {ArrowRight, Bath, BedDouble, MapPin, Maximize} from 'lucide-react'
import {Link} from 'react-router'

const defaultProperties = [
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
    mainImage: undefined,
    status: 'for-sale',
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
    mainImage: undefined,
    status: 'for-sale',
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
    mainImage: undefined,
    status: 'coming-soon',
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
    mainImage: undefined,
    status: 'for-sale',
  },
]

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

interface PropertiesSectionProps {
  headline?: string
  subheadline?: string
  properties?: Array<{
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
  }>
}

export function PropertiesSection({
  headline = 'Exceptional Properties',
  subheadline,
  properties = defaultProperties,
}: PropertiesSectionProps) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Featured Listings
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a]">
              {headline}
            </h2>
            {subheadline && (
              <p className="text-gray-600 text-lg mt-4 max-w-xl">{subheadline}</p>
            )}
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-[#1a1a1a] font-semibold hover:text-[#c9a961] transition-colors"
          >
            View All Properties
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <Link
              key={property._id}
              to={`/properties/${property.slug}`}
              className="property-card group block bg-white rounded-xl overflow-hidden border border-gray-100 card-hover"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
                  alt={property.title}
                  className="property-image w-full h-full object-cover"
                />
                {/* Status Badge */}
                <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded text-xs font-semibold ${
                    property.status === 'coming-soon'
                      ? 'bg-[#1a1a1a] text-white'
                      : 'bg-[#c9a961] text-[#1a1a1a]'
                  }`}
                >
                  {formatStatus(property.status)}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-[#c9a961] font-display text-xl font-semibold mb-1">
                  {formatPrice(property.price)}
                </p>
                <h3 className="font-semibold text-[#1a1a1a] mb-2 group-hover:text-[#c9a961] transition-colors">
                  {property.title}
                </h3>
                <p className="text-gray-500 text-sm flex items-center gap-1 mb-4">
                  <MapPin size={14} />
                  {property.address.neighborhood}, {property.address.city}
                </p>

                {/* Features */}
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <span className="flex items-center gap-1">
                    <BedDouble size={16} />
                    {property.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath size={16} />
                    {property.bathrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize size={16} />
                    {property.squareFeet.toLocaleString()} sqft
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
