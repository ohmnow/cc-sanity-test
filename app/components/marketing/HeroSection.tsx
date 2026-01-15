import {ArrowRight, Play} from 'lucide-react'
import {Link} from 'react-router'

interface HeroSectionProps {
  headline?: string
  subheadline?: string
  primaryCta?: {text: string; url: string}
  secondaryCta?: {text: string; url: string}
}

export function HeroSection({
  headline = 'Transform Your Real Estate Vision Into Reality',
  subheadline = "Whether you're buying, selling, or investing, our team of experts guides you through every step with personalized service and unmatched market expertise.",
  primaryCta = {text: 'Get Started', url: '/get-started'},
  secondaryCta = {text: 'View Our Projects', url: '/projects'},
}: HeroSectionProps) {
  // Split headline for styling if it contains specific text
  const renderHeadline = () => {
    if (headline.includes('Real Estate Vision')) {
      const parts = headline.split('Real Estate Vision')
      return (
        <>
          {parts[0]}
          <br />
          <span className="text-[#c9a961]">Real Estate Vision</span>
          <br />
          {parts[1]}
        </>
      )
    }
    return headline
  }

  return (
    <section className="relative min-h-screen flex items-center bg-[#1a1a1a]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury home exterior"
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-6 animate-fade-in-up opacity-0">
            San Francisco Bay Area Real Estate
          </p>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight mb-6 animate-fade-in-up opacity-0 delay-100">
            {renderHeadline()}
          </h1>

          {/* Subheadline */}
          <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl animate-fade-in-up opacity-0 delay-200">
            {subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0 delay-300">
            <Link
              to={primaryCta.url}
              className="btn-gold px-8 py-4 rounded inline-flex items-center justify-center gap-2 text-base font-semibold"
            >
              {primaryCta.text}
              <ArrowRight size={18} />
            </Link>
            <Link
              to={secondaryCta.url}
              className="btn-outline px-8 py-4 rounded inline-flex items-center justify-center gap-2 text-base font-medium"
            >
              <Play size={18} />
              {secondaryCta.text}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-10 border-t border-white/10 animate-fade-in-up opacity-0 delay-500">
            <p className="text-white/50 text-sm mb-4">Trusted by homeowners across the Bay Area</p>
            <div className="flex items-center gap-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-[#1a1a1a]"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-[#c9a961]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/70 text-sm">
                  <span className="text-white font-semibold">4.9/5</span> from
                  150+ reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}
