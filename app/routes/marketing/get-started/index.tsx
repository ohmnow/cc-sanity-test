import {ArrowRight, Building2, Home, TrendingUp} from 'lucide-react'
import {Link} from 'react-router'

const userTypes = [
  {
    id: 'buyer',
    title: 'I Want to Buy',
    description:
      'Find your dream home in the San Francisco Bay Area with expert guidance.',
    icon: Home,
    features: [
      'Access to exclusive listings',
      'Personalized property matching',
      'Expert negotiation support',
      'End-to-end transaction management',
    ],
  },
  {
    id: 'seller',
    title: 'I Want to Sell',
    description:
      'Get top dollar for your property with our strategic marketing approach.',
    icon: Building2,
    features: [
      'Professional home staging',
      'Premium marketing exposure',
      'Strategic pricing analysis',
      'Skilled negotiation team',
    ],
  },
  {
    id: 'investor',
    title: "I'm an Investor",
    description:
      'Maximize your returns with our investment expertise and development projects.',
    icon: TrendingUp,
    features: [
      'Exclusive investment opportunities',
      'Detailed ROI analysis',
      'Development project access',
      'Portfolio management support',
    ],
  },
]

export default function GetStarted() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Get Started
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a] mb-6">
            How Can We Help You?
          </h1>
          <p className="text-gray-600 text-lg">
            Select the option that best describes your real estate goals, and
            we&apos;ll tailor our approach to your specific needs.
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {userTypes.map((type) => (
            <Link
              key={type.id}
              to={`/get-started/${type.id}`}
              className="group bg-white rounded-xl p-8 border border-gray-200 hover:border-[#c9a961] hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#c9a961] transition-colors">
                <type.icon className="w-8 h-8 text-white group-hover:text-[#1a1a1a]" />
              </div>

              {/* Content */}
              <h2 className="font-display text-2xl text-[#1a1a1a] mb-3 group-hover:text-[#c9a961] transition-colors">
                {type.title}
              </h2>
              <p className="text-gray-600 mb-6">{type.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {type.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-gray-500 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-[#c9a961] rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex items-center gap-2 text-[#1a1a1a] font-semibold group-hover:text-[#c9a961] transition-colors">
                Continue
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
