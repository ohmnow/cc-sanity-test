import {ChevronLeft, ChevronRight, Quote} from 'lucide-react'
import {useState} from 'react'

const testimonials = [
  {
    id: 1,
    quote:
      "Golden Gate Home Advisors made selling our family home an incredibly smooth experience. Their market knowledge and negotiation skills got us 15% over asking price. I couldn't recommend them more highly.",
    author: 'Sarah & Michael Chen',
    role: 'Home Sellers',
    location: 'Pacific Heights',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 2,
    quote:
      "As first-time buyers in a competitive market, we felt completely supported throughout the entire process. They found us our dream home and guided us through every step with patience and expertise.",
    author: 'David Park',
    role: 'First-Time Buyer',
    location: 'Russian Hill',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 3,
    quote:
      "I've worked with the Golden Gate team on multiple investment properties. Their renovation expertise and deal analysis have been invaluable to building my portfolio. They truly understand investor needs.",
    author: 'Jennifer Williams',
    role: 'Real Estate Investor',
    location: 'Marina District',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 4,
    quote:
      "The before and after transformation of our investment property was remarkable. The team's vision and execution exceeded our expectations, and we achieved a 40% ROI on the renovation.",
    author: 'Robert & Lisa Thompson',
    role: 'Property Developers',
    location: 'Noe Valley',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
]

export function TestimonialsSection() {
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
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.author}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#c9a961]"
                  />
                  <div>
                    <p className="text-white font-semibold text-lg">
                      {currentTestimonial.author}
                    </p>
                    <p className="text-[#c9a961]">{currentTestimonial.role}</p>
                    <p className="text-gray-400 text-sm">
                      {currentTestimonial.location}
                    </p>
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
