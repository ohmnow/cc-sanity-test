import {ArrowRight, Building2, Home, TrendingUp} from 'lucide-react'
import {Link} from 'react-router'

const leadTypes = [
  {
    type: 'buyer',
    icon: Home,
    title: 'I Want to Buy',
    description: 'Find your dream home with expert guidance through the competitive Bay Area market.',
    features: ['Personalized property search', 'Market analysis & insights', 'Negotiation support'],
  },
  {
    type: 'seller',
    icon: Building2,
    title: 'I Want to Sell',
    description: 'Maximize your property value with strategic marketing and expert pricing.',
    features: ['Free home valuation', 'Professional staging', 'Maximum exposure marketing'],
  },
  {
    type: 'investor',
    icon: TrendingUp,
    title: 'I Want to Invest',
    description: 'Build wealth through strategic real estate investments and development opportunities.',
    features: ['Deal analysis & ROI projections', 'Off-market opportunities', 'Renovation expertise'],
  },
]

export default function GetStarted() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-40 pb-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Get Started
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
              How Can We
              <br />
              <span className="text-[#c9a961]">Help You Today?</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto">
              Select the option that best describes your real estate goals,
              and we&apos;ll connect you with the right expert.
            </p>
          </div>
        </div>
      </section>

      {/* Options Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {leadTypes.map((item) => (
              <Link
                key={item.type}
                to={`/get-started/${item.type}`}
                className="group block bg-white rounded-xl p-8 border-2 border-gray-100 hover:border-[#c9a961] transition-all hover:shadow-xl"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#c9a961] transition-colors">
                  <item.icon className="w-8 h-8 text-[#c9a961] group-hover:text-[#1a1a1a] transition-colors" />
                </div>

                {/* Content */}
                <h2 className="font-display text-2xl text-[#1a1a1a] mb-3">
                  {item.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {item.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-[#c9a961] rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <span className="inline-flex items-center gap-2 text-[#1a1a1a] font-semibold group-hover:text-[#c9a961] transition-colors">
                  Get Started
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-gray-600 mb-4">
              Not sure which option is right for you?
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-[#c9a961] font-semibold hover:underline"
            >
              Contact us for personalized guidance
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
