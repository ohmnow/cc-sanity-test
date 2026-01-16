import {ArrowRight, Loader2, Mail, MapPin, Phone, Clock} from 'lucide-react'
import {Form, useActionData, useNavigation} from 'react-router'
import type {MetaFunction} from 'react-router'
import {useState} from 'react'

import {BreadcrumbsLight} from '~/components/Breadcrumbs'

import type {Route} from './+types/contact'

export const meta: MetaFunction = () => {
  return [
    {title: 'Contact Us | Golden Gate Home Advisors'},
    {
      name: 'description',
      content:
        'Get in touch with Golden Gate Home Advisors. Schedule a consultation to discuss your real estate goals in San Francisco and the Bay Area.',
    },
    {property: 'og:title', content: 'Contact Us | Golden Gate Home Advisors'},
    {
      property: 'og:description',
      content: 'Schedule a consultation to discuss your Bay Area real estate goals.',
    },
    {property: 'og:type', content: 'website'},
  ]
}

export async function action({request}: Route.ActionArgs) {
  const formData = await request.formData()

  // Forward to our lead API endpoint
  const response = await fetch(new URL('/resource/lead', request.url).toString(), {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()
  return result
}

export default function Contact() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  const [submitted, setSubmitted] = useState(false)

  // Show success state after submission
  if (actionData?.success && !submitted) {
    setSubmitted(true)
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-40 pb-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8">
          <BreadcrumbsLight
            items={[{label: 'Contact'}]}
            className="mb-6"
          />
          <div className="max-w-3xl">
            <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Contact Us
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
              Let&apos;s Start a
              <br />
              <span className="text-[#c9a961]">Conversation</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl">
              Have questions about buying, selling, or investing? Our team is here
              to help. Reach out and let&apos;s discuss how we can assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-2xl text-[#1a1a1a] mb-8">
                Get In Touch
              </h2>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c9a961]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#c9a961]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">Office Location</h3>
                    <p className="text-gray-600">
                      2100 Van Ness Avenue, Suite 400<br />
                      San Francisco, CA 94109
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c9a961]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#c9a961]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">Phone</h3>
                    <p className="text-gray-600">
                      <a href="tel:+14155550123" className="hover:text-[#c9a961]">
                        (415) 555-0123
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c9a961]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#c9a961]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">Email</h3>
                    <p className="text-gray-600">
                      <a href="mailto:hello@goldengateadvisors.com" className="hover:text-[#c9a961]">
                        hello@goldengateadvisors.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c9a961]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#c9a961]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">Office Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: By Appointment
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80"
                  alt="San Francisco"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                <h2 className="font-display text-2xl text-[#1a1a1a] mb-2">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-display text-xl text-[#1a1a1a] mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600">
                      Thank you for reaching out. We&apos;ll be in touch soon.
                    </p>
                  </div>
                ) : (
                  <Form method="post" className="space-y-6">
                    <input type="hidden" name="leadType" value="contact" />

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-none transition-colors"
                          placeholder="Your name"
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

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-none transition-colors resize-none"
                        placeholder="How can we help you?"
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
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
