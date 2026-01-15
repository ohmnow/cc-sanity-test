import {ArrowRight, Building2, Home, TrendingUp} from 'lucide-react'
import {Form, useActionData, useNavigation, useParams, redirect} from 'react-router'

import type {Route} from './+types/$type'

interface FormField {
  name: string
  label: string
  type: 'select' | 'text'
  required?: boolean
  placeholder?: string
  options?: Array<{value: string; label: string}>
}

interface LeadTypeConfig {
  icon: typeof Home
  title: string
  description: string
  fields: FormField[]
}

const leadTypeConfig: Record<string, LeadTypeConfig> = {
  buyer: {
    icon: Home,
    title: "Let's Find Your Dream Home",
    description: 'Tell us about your ideal property and timeline, and our buyer specialists will create a personalized search strategy.',
    fields: [
      {name: 'budget', label: 'Budget Range', type: 'select', required: true, options: [
        {value: '', label: 'Select budget range'},
        {value: 'under-1m', label: 'Under $1M'},
        {value: '1m-2m', label: '$1M - $2M'},
        {value: '2m-3m', label: '$2M - $3M'},
        {value: '3m-5m', label: '$3M - $5M'},
        {value: '5m-plus', label: '$5M+'},
      ]},
      {name: 'neighborhoods', label: 'Preferred Neighborhoods', type: 'text', placeholder: 'e.g., Pacific Heights, Noe Valley, Marina'},
      {name: 'bedrooms', label: 'Minimum Bedrooms', type: 'select', options: [
        {value: '', label: 'Any'},
        {value: '1', label: '1+'},
        {value: '2', label: '2+'},
        {value: '3', label: '3+'},
        {value: '4', label: '4+'},
        {value: '5', label: '5+'},
      ]},
      {name: 'timeline', label: 'Purchase Timeline', type: 'select', required: true, options: [
        {value: '', label: 'Select timeline'},
        {value: 'asap', label: 'As soon as possible'},
        {value: '1-3-months', label: '1-3 months'},
        {value: '3-6-months', label: '3-6 months'},
        {value: '6-12-months', label: '6-12 months'},
        {value: 'just-exploring', label: 'Just exploring'},
      ]},
    ],
  },
  seller: {
    icon: Building2,
    title: "Let's Maximize Your Sale",
    description: "Share details about your property and we'll provide a complimentary market analysis and selling strategy.",
    fields: [
      {name: 'propertyAddress', label: 'Property Address', type: 'text', required: true, placeholder: '123 Main St, San Francisco, CA'},
      {name: 'propertyType', label: 'Property Type', type: 'select', required: true, options: [
        {value: '', label: 'Select property type'},
        {value: 'single-family', label: 'Single Family Home'},
        {value: 'condo', label: 'Condo/Apartment'},
        {value: 'townhouse', label: 'Townhouse'},
        {value: 'multi-family', label: 'Multi-Family (2-4 units)'},
        {value: 'land', label: 'Land/Lot'},
      ]},
      {name: 'bedrooms', label: 'Bedrooms', type: 'select', options: [
        {value: '', label: 'Select'},
        {value: '1', label: '1'},
        {value: '2', label: '2'},
        {value: '3', label: '3'},
        {value: '4', label: '4'},
        {value: '5+', label: '5+'},
      ]},
      {name: 'timeline', label: 'Selling Timeline', type: 'select', required: true, options: [
        {value: '', label: 'Select timeline'},
        {value: 'asap', label: 'As soon as possible'},
        {value: '1-3-months', label: '1-3 months'},
        {value: '3-6-months', label: '3-6 months'},
        {value: '6-12-months', label: '6-12 months'},
        {value: 'just-curious', label: 'Just curious about value'},
      ]},
    ],
  },
  investor: {
    icon: TrendingUp,
    title: "Let's Build Your Portfolio",
    description: 'Tell us about your investment goals and experience, and our team will identify opportunities aligned with your strategy.',
    fields: [
      {name: 'investmentType', label: 'Investment Interest', type: 'select', required: true, options: [
        {value: '', label: 'Select investment type'},
        {value: 'rental', label: 'Rental Properties'},
        {value: 'flip', label: 'Fix & Flip'},
        {value: 'development', label: 'Development Projects'},
        {value: 'commercial', label: 'Commercial Real Estate'},
        {value: 'syndication', label: 'Syndication/Partnerships'},
      ]},
      {name: 'investmentBudget', label: 'Investment Budget', type: 'select', required: true, options: [
        {value: '', label: 'Select budget range'},
        {value: 'under-500k', label: 'Under $500K'},
        {value: '500k-1m', label: '$500K - $1M'},
        {value: '1m-2m', label: '$1M - $2M'},
        {value: '2m-5m', label: '$2M - $5M'},
        {value: '5m-plus', label: '$5M+'},
      ]},
      {name: 'experience', label: 'Investment Experience', type: 'select', options: [
        {value: '', label: 'Select experience level'},
        {value: 'first-time', label: 'First-time investor'},
        {value: '1-3-properties', label: '1-3 properties'},
        {value: '4-10-properties', label: '4-10 properties'},
        {value: '10-plus', label: '10+ properties'},
      ]},
      {name: 'accreditedStatus', label: 'Accredited Investor Status', type: 'select', options: [
        {value: '', label: 'Select status'},
        {value: 'yes', label: 'Yes, I am accredited'},
        {value: 'no', label: 'No'},
        {value: 'unsure', label: 'Not sure'},
      ]},
    ],
  },
}

export async function action({request, params}: Route.ActionArgs) {
  const formData = await request.formData()
  formData.set('leadType', params.type || 'contact')

  const response = await fetch(new URL('/resource/lead', request.url).toString(), {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()

  if (result.success) {
    return redirect('/get-started/success')
  }

  return result
}

export default function GetStartedType() {
  const {type} = useParams()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  const config = leadTypeConfig[type as keyof typeof leadTypeConfig]

  if (!config) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-[#1a1a1a] mb-4">Invalid Option</h1>
          <a href="/get-started" className="text-[#c9a961] hover:underline">
            Return to Get Started
          </a>
        </div>
      </div>
    )
  }

  const Icon = config.icon

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-[#c9a961] rounded-xl flex items-center justify-center mx-auto mb-6">
              <Icon className="w-10 h-10 text-[#1a1a1a]" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-white mb-6">
              {config.title}
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto">
              {config.description}
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
              <h2 className="font-display text-2xl text-[#1a1a1a] mb-2">
                Your Information
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and a specialist will contact you within 24 hours.
              </p>

              <Form method="post" className="space-y-6">
                {/* Contact Info */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-none transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-none transition-colors"
                    placeholder="(415) 555-0123"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-display text-lg text-[#1a1a1a] mb-4">
                    Tell Us More
                  </h3>
                </div>

                {/* Dynamic Fields */}
                {config.fields.map((field) => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      {field.label} {field.required && '*'}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-none transition-colors bg-white"
                      >
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-none transition-colors"
                      />
                    )}
                  </div>
                ))}

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-none transition-colors resize-none"
                    placeholder="Anything else you'd like us to know?"
                  />
                </div>

                {actionData?.error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {actionData.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gold px-8 py-4 rounded-lg inline-flex items-center justify-center gap-2 text-base font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  <ArrowRight size={18} />
                </button>

                <p className="text-center text-sm text-gray-500">
                  By submitting, you agree to receive communications from Golden Gate Home Advisors.
                </p>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
