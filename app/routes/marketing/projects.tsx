import {ArrowRight, Calendar, MapPin, Maximize} from 'lucide-react'
import {useCallback, useRef, useState} from 'react'
import {Link, useLoaderData} from 'react-router'

import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {PROJECTS_QUERY} from '~/sanity/queries'
import type {Route} from './+types/projects'

interface SanityProject {
  _id: string
  title: string
  slug: string
  beforeImage?: {asset: {_ref: string}}
  afterImage?: {asset: {_ref: string}}
  description: string
  projectType: string
  location: string
  completedDate?: string
  stats?: Array<{label: string; value: string}>
  roi?: number
  featured?: boolean
}

export async function loader({request}: Route.LoaderArgs) {
  const {options} = await loadQueryOptions(request.headers)
  const {data: projects} = await loadQuery<SanityProject[]>(
    PROJECTS_QUERY,
    {},
    options
  )
  return {projects: projects || []}
}

interface Project {
  id: number
  title: string
  location: string
  type: string
  sqft: string
  completedDate: string
  description: string
  beforeImage: string
  afterImage: string
  stats: {
    label: string
    value: string
  }[]
}

const defaultProjects: Project[] = [
  {
    id: 1,
    title: 'Pacific Heights Victorian',
    location: 'Pacific Heights, San Francisco',
    type: 'Complete Renovation',
    sqft: '3,500',
    completedDate: 'December 2024',
    description:
      'A stunning transformation of a classic Victorian home, preserving its historic charm while adding modern luxury amenities throughout.',
    beforeImage:
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=2000&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
    stats: [
      {label: 'ROI', value: '42%'},
      {label: 'Timeline', value: '8 months'},
      {label: 'Budget', value: '$850K'},
    ],
  },
  {
    id: 2,
    title: 'Marina District Modern',
    location: 'Marina District, San Francisco',
    type: 'Kitchen & Bath Remodel',
    sqft: '2,200',
    completedDate: 'October 2024',
    description:
      'A complete kitchen and bathroom overhaul that transformed this 1960s home into a contemporary masterpiece with open-concept living.',
    beforeImage:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=2000&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80',
    stats: [
      {label: 'ROI', value: '38%'},
      {label: 'Timeline', value: '4 months'},
      {label: 'Budget', value: '$320K'},
    ],
  },
  {
    id: 3,
    title: 'Noe Valley Family Home',
    location: 'Noe Valley, San Francisco',
    type: 'Addition & Renovation',
    sqft: '2,800',
    completedDate: 'August 2024',
    description:
      'Added 800 sq ft to this family home including a primary suite addition and complete interior renovation with smart home integration.',
    beforeImage:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=2000&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80',
    stats: [
      {label: 'ROI', value: '35%'},
      {label: 'Timeline', value: '10 months'},
      {label: 'Budget', value: '$620K'},
    ],
  },
  {
    id: 4,
    title: 'Russian Hill Penthouse',
    location: 'Russian Hill, San Francisco',
    type: 'Luxury Renovation',
    sqft: '3,200',
    completedDate: 'June 2024',
    description:
      'High-end penthouse transformation featuring custom millwork, imported Italian marble, and panoramic city view optimization.',
    beforeImage:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2000&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2000&q=80',
    stats: [
      {label: 'ROI', value: '45%'},
      {label: 'Timeline', value: '6 months'},
      {label: 'Budget', value: '$1.2M'},
    ],
  },
]

function BeforeAfterSlider({
  beforeImage,
  afterImage,
  title,
}: {
  beforeImage: string
  afterImage: string
  title: string
}) {
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
    <div
      ref={containerRef}
      className="relative aspect-[16/10] rounded-xl overflow-hidden cursor-ew-resize select-none shadow-lg"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt={`${title} - After`}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{width: `${sliderPosition}%`}}
      >
        <img
          src={beforeImage}
          alt={`${title} - Before`}
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
        <div className="absolute top-4 left-4 bg-[#1a1a1a]/80 backdrop-blur-sm text-white px-3 py-1.5 rounded text-sm font-medium">
          Before
        </div>
      </div>

      {/* After Label */}
      <div className="absolute top-4 right-4 bg-[#c9a961]/90 backdrop-blur-sm text-[#1a1a1a] px-3 py-1.5 rounded text-sm font-medium">
        After
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
        style={{left: `${sliderPosition}%`, transform: 'translateX(-50%)'}}
      >
        {/* Handle Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex items-center gap-0.5 text-[#1a1a1a]">
            <svg
              className="w-2.5 h-2.5 rotate-180"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
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
  )
}

export default function Projects() {
  const {projects: sanityProjects} = useLoaderData<typeof loader>()

  // Transform Sanity data to component format, falling back to defaults
  const projects = sanityProjects.length > 0
    ? sanityProjects.map((p) => ({
        id: p._id,
        title: p.title,
        slug: p.slug,
        location: p.location,
        type: p.projectType,
        sqft: '0',  // Not in current schema
        completedDate: p.completedDate
          ? new Date(p.completedDate).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })
          : 'Recent',
        description: p.description,
        beforeImage:
          'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=2000&q=80',
        afterImage:
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
        stats: p.stats || [
          {label: 'ROI', value: p.roi ? `${p.roi}%` : '35%'},
          {label: 'Timeline', value: '6 months'},
          {label: 'Quality', value: 'Premium'},
        ],
      }))
    : defaultProjects

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Our Portfolio
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
              Transformations That
              <br />
              <span className="text-[#c9a961]">Speak For Themselves</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl">
              Explore our portfolio of stunning home renovations and
              developments. Each project showcases our commitment to quality,
              design excellence, and maximizing property value.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-24">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Before/After Slider */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <BeforeAfterSlider
                    beforeImage={project.beforeImage}
                    afterImage={project.afterImage}
                    title={project.title}
                  />
                  <p className="text-center text-gray-500 text-sm mt-3">
                    Drag the slider to compare before and after
                  </p>
                </div>

                {/* Project Info */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="inline-block bg-[#c9a961]/10 text-[#c9a961] px-3 py-1 rounded text-sm font-medium mb-4">
                    {project.type}
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl text-[#1a1a1a] mb-4">
                    {project.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-6">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize size={16} />
                      {project.sqft} sq ft
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      {project.completedDate}
                    </span>
                  </div>

                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 p-6 bg-gray-50 rounded-xl mb-8">
                    {project.stats.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <p className="font-display text-2xl text-[#c9a961] font-semibold">
                          {stat.value}
                        </p>
                        <p className="text-gray-500 text-sm">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/projects/${project.id}`}
                    className="inline-flex items-center gap-2 text-[#1a1a1a] font-semibold hover:text-[#c9a961] transition-colors"
                  >
                    View Full Project Details
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Start Your Project
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            Ready to Transform
            <br />
            <span className="text-[#c9a961]">Your Property?</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Whether you&apos;re looking to renovate for personal enjoyment or
            maximize investment returns, our team is here to bring your vision
            to life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/get-started"
              className="btn-gold px-10 py-4 rounded inline-flex items-center gap-2 text-base font-semibold"
            >
              Get a Free Consultation
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="btn-outline px-10 py-4 rounded inline-flex items-center gap-2 text-base font-medium"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
