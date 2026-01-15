import {ArrowRight, Building2, Home, TrendingUp, type LucideIcon} from 'lucide-react'
import {Link} from 'react-router'

const defaultServices = [
  {
    icon: 'Home',
    title: 'Buyers',
    shortDescription:
      'Find your dream home with expert guidance. We help you navigate the market, negotiate the best deals, and ensure a smooth closing process.',
    ctaLink: '/services/buyers',
    features: [{title: 'Market Analysis'}, {title: 'Property Tours'}, {title: 'Negotiation Support'}],
  },
  {
    icon: 'Building2',
    title: 'Sellers',
    shortDescription:
      'Maximize your property value with our proven marketing strategies. From staging to closing, we handle every detail to get you top dollar.',
    ctaLink: '/services/sellers',
    features: [{title: 'Home Staging'}, {title: 'Professional Photography'}, {title: 'Strategic Pricing'}],
  },
  {
    icon: 'TrendingUp',
    title: 'Investors',
    shortDescription:
      'Build wealth through strategic real estate investments. Access exclusive opportunities and expert analysis for renovation and development projects.',
    ctaLink: '/services/investors',
    features: [{title: 'Deal Analysis'}, {title: 'Renovation Projects'}, {title: 'Portfolio Management'}],
  },
]

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Home,
  Building2,
  TrendingUp,
}

interface ServicesSectionProps {
  headline?: string
  subheadline?: string
  services?: Array<{
    _id?: string
    title: string
    shortDescription: string
    icon?: string
    ctaLink?: string
    features?: Array<{title: string; description?: string}>
  }>
}

export function ServicesSection({
  headline = 'How We Can Help You',
  subheadline = "Whether you're buying your first home, selling a property, or looking to invest, we provide personalized solutions for every real estate need.",
  services = defaultServices,
}: ServicesSectionProps) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Our Services
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a] mb-6">
            {headline}
          </h2>
          <p className="text-gray-600 text-lg">
            {subheadline}
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon || 'Home'] || Home
            return (
              <div
                key={service._id || service.title}
                className="card-hover bg-gray-50 rounded-lg p-8 border border-gray-100 group"
                style={{animationDelay: `${index * 100}ms`}}
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#c9a961] transition-colors">
                  <IconComponent className="w-7 h-7 text-[#c9a961] group-hover:text-[#1a1a1a] transition-colors" />
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl text-[#1a1a1a] mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 mb-8">
                    {service.features.slice(0, 3).map((feature) => (
                      <li
                        key={feature.title}
                        className="flex items-center gap-2 text-sm text-gray-500"
                      >
                        <div className="w-1.5 h-1.5 bg-[#c9a961] rounded-full" />
                        {feature.title}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Link */}
                <Link
                  to={service.ctaLink || '/services'}
                  className="inline-flex items-center gap-2 text-[#1a1a1a] font-semibold group-hover:text-[#c9a961] transition-colors"
                >
                  Learn More
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
