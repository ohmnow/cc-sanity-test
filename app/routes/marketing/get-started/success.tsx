import {ArrowRight, CheckCircle, Clock, Phone, Mail} from 'lucide-react'
import {Link} from 'react-router'

export default function GetStartedSuccess() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-white mb-6">
              Thank You!
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto">
              Your request has been received. A member of our team will reach out
              to you within 24 hours to discuss your real estate goals.
            </p>
          </div>
        </div>
      </section>

      {/* What's Next Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl text-[#1a1a1a] text-center mb-12">
              What Happens Next?
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Review',
                  description: 'Our team will review your submission and match you with the specialist best suited to your needs.',
                  time: 'Within a few hours',
                },
                {
                  step: '2',
                  title: 'Contact',
                  description: 'Your dedicated advisor will reach out via phone or email to introduce themselves and schedule a consultation.',
                  time: 'Within 24 hours',
                },
                {
                  step: '3',
                  title: 'Consultation',
                  description: "During your initial consultation, we'll discuss your goals in detail and create a personalized strategy.",
                  time: 'At your convenience',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#c9a961] rounded-full flex items-center justify-center">
                      <span className="font-display text-xl text-[#1a1a1a] font-bold">
                        {item.step}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-[#1a1a1a] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {item.description}
                    </p>
                    <p className="text-sm text-[#c9a961] flex items-center gap-1">
                      <Clock size={14} />
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-16 p-8 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="font-display text-xl text-[#1a1a1a] mb-4 text-center">
                Need Immediate Assistance?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Feel free to contact us directly if you have urgent questions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href="tel:+14155550123"
                  className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#c9a961] transition-colors"
                >
                  <Phone size={18} />
                  (415) 555-0123
                </a>
                <a
                  href="mailto:hello@goldengateadvisors.com"
                  className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#c9a961] transition-colors"
                >
                  <Mail size={18} />
                  hello@goldengateadvisors.com
                </a>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                While you wait, feel free to explore:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 text-[#c9a961] font-semibold hover:underline"
                >
                  Browse Properties
                  <ArrowRight size={16} />
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-[#c9a961] font-semibold hover:underline"
                >
                  View Our Projects
                  <ArrowRight size={16} />
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/testimonials"
                  className="inline-flex items-center gap-2 text-[#c9a961] font-semibold hover:underline"
                >
                  Read Testimonials
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Return Home CTA */}
      <section className="py-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Link
            to="/"
            className="btn-gold px-10 py-4 rounded inline-flex items-center gap-2 text-base font-semibold"
          >
            Return to Home
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
