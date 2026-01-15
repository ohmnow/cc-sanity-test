import {ArrowRight, Bath, BedDouble, MapPin, Maximize} from 'lucide-react'
import {Link} from 'react-router'

const properties = [
  {
    id: 1,
    title: 'Modern Marina Townhouse',
    location: 'Marina District, San Francisco',
    price: '$2,850,000',
    beds: 4,
    baths: 3,
    sqft: '2,800',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    status: 'For Sale',
  },
  {
    id: 2,
    title: 'Pacific Heights Victorian',
    location: 'Pacific Heights, San Francisco',
    price: '$4,200,000',
    beds: 5,
    baths: 4,
    sqft: '3,500',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    status: 'For Sale',
  },
  {
    id: 3,
    title: 'Contemporary Noe Valley Home',
    location: 'Noe Valley, San Francisco',
    price: '$3,100,000',
    beds: 3,
    baths: 2,
    sqft: '2,200',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    status: 'Coming Soon',
  },
  {
    id: 4,
    title: 'Russian Hill Penthouse',
    location: 'Russian Hill, San Francisco',
    price: '$5,500,000',
    beds: 4,
    baths: 4,
    sqft: '3,200',
    image:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80',
    status: 'For Sale',
  },
]

export function PropertiesSection() {
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
              Exceptional Properties
            </h2>
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
              key={property.id}
              to={`/properties/${property.id}`}
              className="property-card group block bg-white rounded-xl overflow-hidden border border-gray-100 card-hover"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="property-image w-full h-full object-cover"
                />
                {/* Status Badge */}
                <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded text-xs font-semibold ${
                    property.status === 'Coming Soon'
                      ? 'bg-[#1a1a1a] text-white'
                      : 'bg-[#c9a961] text-[#1a1a1a]'
                  }`}
                >
                  {property.status}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-[#c9a961] font-display text-xl font-semibold mb-1">
                  {property.price}
                </p>
                <h3 className="font-semibold text-[#1a1a1a] mb-2 group-hover:text-[#c9a961] transition-colors">
                  {property.title}
                </h3>
                <p className="text-gray-500 text-sm flex items-center gap-1 mb-4">
                  <MapPin size={14} />
                  {property.location}
                </p>

                {/* Features */}
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <span className="flex items-center gap-1">
                    <BedDouble size={16} />
                    {property.beds}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath size={16} />
                    {property.baths}
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize size={16} />
                    {property.sqft} sqft
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
