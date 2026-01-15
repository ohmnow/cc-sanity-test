import {ArrowRight, CheckCircle} from 'lucide-react'
import {Link} from 'react-router'

export default function GetStartedSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Content */}
          <h1 className="font-display text-3xl sm:text-4xl text-[#1a1a1a] mb-4">
            Thank You!
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Your request has been submitted successfully. A member of our team
            will contact you within 24 hours to discuss your real estate goals.
          </p>

          {/* What's Next */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 text-left mb-8">
            <h2 className="font-display text-xl text-[#1a1a1a] mb-4">
              What Happens Next?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#c9a961] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#1a1a1a] text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-[#1a1a1a]">
                    We&apos;ll Review Your Request
                  </p>
                  <p className="text-gray-500 text-sm">
                    Our team will carefully review your information and prepare
                    for your consultation.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#c9a961] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#1a1a1a] text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-[#1a1a1a]">
                    Personal Consultation
                  </p>
                  <p className="text-gray-500 text-sm">
                    We&apos;ll schedule a call or meeting to discuss your goals
                    in detail.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#c9a961] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#1a1a1a] text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-[#1a1a1a]">
                    Customized Strategy
                  </p>
                  <p className="text-gray-500 text-sm">
                    We&apos;ll create a personalized plan tailored to your
                    specific needs.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="btn-gold px-8 py-3 rounded inline-flex items-center gap-2 font-semibold"
            >
              Back to Home
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/properties"
              className="btn-outline px-8 py-3 rounded inline-flex items-center gap-2 font-medium"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
