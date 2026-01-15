import {ChevronLeft, ChevronRight, Quote} from 'lucide-react'
import {useState} from 'react'

const defaultTestimonials = [
  {
    _id: '1',
    quote:
      "Golden Gate Home Advisors made selling our family home an incredibly smooth experience. Their market knowledge and negotiation skills got us 15% over asking price. I couldn't recommend them more highly.",
    clientName: 'Sarah & Michael Chen',
    clientTitle: 'Home Sellers, Pacific Heights',
  },
  {
    _id: '2',
    quote:
      "As first-time buyers in a competitive market, we felt completely supported throughout the entire process. They found us our dream home and guided us through every step with patience and expertise.",
    clientName: 'David Park',
    clientTitle: 'First-Time Buyer, Russian Hill',
  },
  {
    _id: '3',
    quote:
      "I've worked with the Golden Gate team on multiple investment properties. Their renovation expertise and deal analysis have been invaluable to building my portfolio. They truly understand investor needs.",
    clientName: 'Jennifer Williams',
    clientTitle: 'Real Estate Investor, Marina District',
  },
  {
    _id: '4',
    quote:
      "The before and after transformation of our investment property was remarkable. The team's vision and execution exceeded our expectations, and we achieved a 40% ROI on the renovation.",
    clientName: 'Robert & Lisa Thompson',
    clientTitle: 'Property Developers, Noe Valley',
  },
]

interface TestimonialsSectionProps {
  headline?: string
  subheadline?: string
  testimonials?: Array<{
    _id: string
    quote: string
    clientName: string
    clientTitle: string
    rating?: number
    clientImage?: {asset: {_ref: string}}
  }>
}

export function TestimonialsSection({
  headline = 'What Our Clients Say',
  subheadline,
  testimonials = defaultTestimonials,
}: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    )
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-24 bg-[#1a1a1a]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Client Stories
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white">
            What Our Clients
            <br />
            <span className="text-[#c9a961]">Say About Us</span>
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-[#2a2a2a] rounded-2xl p-8 lg:p-12">
            {/* Quote Icon */}
            <Quote className="absolute top-8 right-8 w-16 h-16 text-[#c9a961]/20" />

            {/* Content */}
            <div className="relative z-10">
              <blockquote className="font-display text-xl sm:text-2xl lg:text-3xl text-white leading-relaxed mb-8">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </blockquote>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c9a961] to-[#8b7355] border-2 border-[#c9a961] flex items-center justify-center">
                    <span className="text-white text-xl font-display">
                      {currentTestimonial.clientName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">
                      {currentTestimonial.clientName}
                    </p>
                    <p className="text-[#c9a961]">{currentTestimonial.clientTitle}</p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevTestimonial}
                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-[#c9a961] w-8'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
