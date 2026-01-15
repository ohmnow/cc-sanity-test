import {ArrowRight} from 'lucide-react'
import {Link} from 'react-router'

interface CTASectionProps {
  headline?: string
  subheadline?: string
  cta?: {text: string; url: string}
}

export function CTASection({
  headline,
  subheadline = "Whether you're buying, selling, or investing, our team is here to guide you every step of the way.",
  cta = {text: 'Get Started Today', url: '/get-started'},
}: CTASectionProps) {
  return (
    <section className="py-24 bg-[#1a1a1a] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Decorative Gold Lines */}
      <div className="absolute top-0 left-0 w-64 h-64 border-l-2 border-t-2 border-[#c9a961]/20" />
      <div className="absolute bottom-0 right-0 w-64 h-64 border-r-2 border-b-2 border-[#c9a961]/20" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-6">
            Start Your Journey
          </p>

          {/* Headline */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white mb-6 leading-tight">
            {headline || (
              <>
                Ready to Transform Your
                <br />
                <span className="text-[#c9a961]">Real Estate Dreams?</span>
              </>
            )}
          </h2>

          {/* Description */}
          <p className="text-white/70 text-lg sm:text-xl mb-10 max-w-xl mx-auto">
            {subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={cta.url}
              className="btn-gold px-10 py-4 rounded inline-flex items-center gap-2 text-base font-semibold"
            >
              {cta.text}
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="btn-outline px-10 py-4 rounded inline-flex items-center gap-2 text-base font-medium"
            >
              Schedule a Consultation
            </Link>
          </div>

          {/* Trust Note */}
          <p className="text-gray-500 text-sm mt-10">
            Free consultation • No obligations • Expert advice
          </p>
        </div>
      </div>
    </section>
  )
}
