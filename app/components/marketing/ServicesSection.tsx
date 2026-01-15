import {ArrowRight, Building2, Home, TrendingUp} from 'lucide-react'
import {Link} from 'react-router'

const services = [
  {
    icon: Home,
    title: 'Buyers',
    description:
      'Find your dream home with expert guidance. We help you navigate the market, negotiate the best deals, and ensure a smooth closing process.',
    href: '/services/buyers',
    features: ['Market Analysis', 'Property Tours', 'Negotiation Support'],
  },
  {
    icon: Building2,
    title: 'Sellers',
    description:
      'Maximize your property value with our proven marketing strategies. From staging to closing, we handle every detail to get you top dollar.',
    href: '/services/sellers',
    features: ['Home Staging', 'Professional Photography', 'Strategic Pricing'],
  },
  {
    icon: TrendingUp,
    title: 'Investors',
    description:
      'Build wealth through strategic real estate investments. Access exclusive opportunities and expert analysis for renovation and development projects.',
    href: '/services/investors',
    features: ['Deal Analysis', 'Renovation Projects', 'Portfolio Management'],
  },
]

export function ServicesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Our Services
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a] mb-6">
            How We Can Help You
          </h2>
          <p className="text-gray-600 text-lg">
            Whether you&apos;re buying your first home, selling a property, or
            looking to invest, we provide personalized solutions for every real
            estate need.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="card-hover bg-gray-50 rounded-lg p-8 border border-gray-100 group"
              style={{animationDelay: `${index * 100}ms`}}
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#c9a961] transition-colors">
                <service.icon className="w-7 h-7 text-[#c9a961] group-hover:text-[#1a1a1a] transition-colors" />
              </div>

              {/* Content */}
              <h3 className="font-display text-2xl text-[#1a1a1a] mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-8">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-500"
                  >
                    <div className="w-1.5 h-1.5 bg-[#c9a961] rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Link */}
              <Link
                to={service.href}
                className="inline-flex items-center gap-2 text-[#1a1a1a] font-semibold group-hover:text-[#c9a961] transition-colors"
              >
                Learn More
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
