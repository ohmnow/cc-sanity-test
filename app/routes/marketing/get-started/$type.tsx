import {ArrowLeft, ArrowRight, Building2, Home, TrendingUp} from 'lucide-react'
import {useState} from 'react'
import {Link, useParams} from 'react-router'

const typeConfig = {
  buyer: {
    title: 'Find Your Dream Home',
    description:
      'Tell us about your ideal property and we\'ll help you find it.',
    icon: Home,
    fields: [
      {name: 'name', label: 'Full Name', type: 'text', required: true},
      {name: 'email', label: 'Email Address', type: 'email', required: true},
      {name: 'phone', label: 'Phone Number', type: 'tel', required: true},
      {
        name: 'budget',
        label: 'Budget Range',
        type: 'select',
        required: true,
        options: [
          'Under $1M',
          '$1M - $2M',
          '$2M - $3M',
          '$3M - $5M',
          '$5M+',
        ],
      },
      {
        name: 'neighborhoods',
        label: 'Preferred Neighborhoods',
        type: 'text',
        placeholder: 'e.g., Pacific Heights, Marina District',
      },
      {
        name: 'bedrooms',
        label: 'Minimum Bedrooms',
        type: 'select',
        options: ['1', '2', '3', '4', '5+'],
      },
      {
        name: 'timeline',
        label: 'Purchase Timeline',
        type: 'select',
        options: [
          'Immediately',
          'Within 3 months',
          'Within 6 months',
          'Within a year',
          'Just exploring',
        ],
      },
      {
        name: 'notes',
        label: 'Additional Requirements',
        type: 'textarea',
        placeholder: 'Tell us about any specific features or requirements...',
      },
    ],
  },
  seller: {
    title: 'Sell Your Property',
    description:
      'Share details about your property and let us create a winning strategy.',
    icon: Building2,
    fields: [
      {name: 'name', label: 'Full Name', type: 'text', required: true},
      {name: 'email', label: 'Email Address', type: 'email', required: true},
      {name: 'phone', label: 'Phone Number', type: 'tel', required: true},
      {
        name: 'address',
        label: 'Property Address',
        type: 'text',
        required: true,
      },
      {
        name: 'propertyType',
        label: 'Property Type',
        type: 'select',
        required: true,
        options: ['Single Family', 'Condo', 'Townhouse', 'Multi-Unit', 'Land'],
      },
      {
        name: 'bedrooms',
        label: 'Bedrooms',
        type: 'select',
        options: ['1', '2', '3', '4', '5+'],
      },
      {
        name: 'bathrooms',
        label: 'Bathrooms',
        type: 'select',
        options: ['1', '1.5', '2', '2.5', '3', '3.5', '4+'],
      },
      {
        name: 'timeline',
        label: 'Selling Timeline',
        type: 'select',
        options: [
          'ASAP',
          'Within 3 months',
          'Within 6 months',
          'Flexible',
          'Just exploring',
        ],
      },
      {
        name: 'notes',
        label: 'Additional Information',
        type: 'textarea',
        placeholder:
          'Any renovations, unique features, or concerns about selling?',
      },
    ],
  },
  investor: {
    title: 'Investment Opportunities',
    description:
      'Tell us about your investment goals and access exclusive opportunities.',
    icon: TrendingUp,
    fields: [
      {name: 'name', label: 'Full Name', type: 'text', required: true},
      {name: 'email', label: 'Email Address', type: 'email', required: true},
      {name: 'phone', label: 'Phone Number', type: 'tel', required: true},
      {
        name: 'company',
        label: 'Company/Entity Name',
        type: 'text',
        placeholder: 'Optional',
      },
      {
        name: 'investmentType',
        label: 'Investment Interest',
        type: 'select',
        required: true,
        options: [
          'Fix & Flip',
          'Buy & Hold',
          'Development Projects',
          'Syndication/Partnerships',
          'Multiple Types',
        ],
      },
      {
        name: 'budget',
        label: 'Investment Budget',
        type: 'select',
        required: true,
        options: [
          '$100K - $500K',
          '$500K - $1M',
          '$1M - $3M',
          '$3M - $5M',
          '$5M+',
        ],
      },
      {
        name: 'experience',
        label: 'Investment Experience',
        type: 'select',
        options: [
          'New to real estate investing',
          '1-3 properties',
          '4-10 properties',
          '10+ properties',
        ],
      },
      {
        name: 'accredited',
        label: 'Accredited Investor Status',
        type: 'select',
        options: ['Yes', 'No', 'Not Sure'],
      },
      {
        name: 'notes',
        label: 'Investment Goals',
        type: 'textarea',
        placeholder:
          'What are your investment goals and preferred strategies?',
      },
    ],
  },
}

export default function GetStartedForm() {
  const {type} = useParams()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const config = typeConfig[type as keyof typeof typeConfig]

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="font-display text-4xl text-[#1a1a1a] mb-4">
            Invalid Selection
          </h1>
          <Link to="/get-started" className="text-[#c9a961] hover:underline">
            Go back
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to success page
    window.location.href = '/get-started/success'
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({...prev, [e.target.name]: e.target.value}))
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Link */}
          <Link
            to="/get-started"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1a1a1a] mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to options
          </Link>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
              <config.icon className="w-8 h-8 text-[#c9a961]" />
            </div>
            <div>
              <h1 className="font-display text-3xl text-[#1a1a1a]">
                {config.title}
              </h1>
              <p className="text-gray-600">{config.description}</p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm"
          >
            <div className="space-y-6">
              {config.fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      id={field.name}
                      name={field.name}
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a961] focus:border-transparent transition-colors"
                    >
                      <option value="">Select...</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a961] focus:border-transparent transition-colors resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a961] focus:border-transparent transition-colors"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 btn-gold px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  Submit Request
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              We&apos;ll respond within 24 hours
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
