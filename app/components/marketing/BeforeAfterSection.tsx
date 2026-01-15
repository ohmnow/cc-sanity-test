import {ArrowRight} from 'lucide-react'
import {useCallback, useRef, useState} from 'react'
import {Link} from 'react-router'

interface BeforeAfterSectionProps {
  headline?: string
  subheadline?: string
  project?: {
    _id: string
    title: string
    slug: string
    beforeImage?: {asset: {_ref: string}}
    afterImage?: {asset: {_ref: string}}
    description: string
    location: string
    projectType: string
  }
}

const defaultProject = {
  _id: 'default',
  title: 'Pacific Heights Victorian',
  slug: 'pacific-heights-victorian',
  beforeImage: undefined,
  afterImage: undefined,
  description: 'Complete home renovation',
  location: 'San Francisco, CA',
  projectType: 'Full Renovation',
}

export function BeforeAfterSection({
  headline,
  subheadline = 'From outdated to outstanding. Drag the slider to see how we transform properties into stunning homes.',
  project = defaultProject,
}: BeforeAfterSectionProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const handleMouseDown = () => {
    isDragging.current = true
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Our Transformations
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a] mb-6">
            {headline || (
              <>
                See The Difference
                <br />
                <span className="text-[#c9a961]">We Make</span>
              </>
            )}
          </h2>
          <p className="text-gray-600 text-lg">
            {subheadline}
          </p>
        </div>

        {/* Before/After Slider */}
        <div className="max-w-5xl mx-auto">
          <div
            ref={containerRef}
            className="relative aspect-[16/10] rounded-xl overflow-hidden cursor-ew-resize select-none shadow-2xl"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* After Image (Background) */}
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
              alt="After renovation"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{width: `${sliderPosition}%`}}
            >
              <img
                src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=2000&q=80"
                alt="Before renovation"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  width: containerRef.current
                    ? `${containerRef.current.offsetWidth}px`
                    : '100%',
                  maxWidth: 'none',
                }}
                draggable={false}
              />

              {/* Before Label */}
              <div className="absolute top-6 left-6 bg-[#1a1a1a]/80 backdrop-blur-sm text-white px-4 py-2 rounded text-sm font-medium">
                Before
              </div>
            </div>

            {/* After Label */}
            <div className="absolute top-6 right-6 bg-[#c9a961]/90 backdrop-blur-sm text-[#1a1a1a] px-4 py-2 rounded text-sm font-medium">
              After
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
              style={{left: `${sliderPosition}%`, transform: 'translateX(-50%)'}}
            >
              {/* Handle Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="flex items-center gap-0.5 text-[#1a1a1a]">
                  <svg
                    className="w-3 h-3 rotate-180"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl text-[#1a1a1a] mb-1">
                {project.title}
              </h3>
              <p className="text-gray-500">
                {project.projectType} • {project.location}
              </p>
            </div>
            <Link
              to="/projects"
              className="btn-gold px-6 py-3 rounded inline-flex items-center gap-2 font-semibold"
            >
              View All Projects
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
