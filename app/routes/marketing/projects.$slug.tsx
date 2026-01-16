import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Maximize,
  TrendingUp,
} from 'lucide-react'
import {useCallback, useRef, useState} from 'react'
import {Link, useLoaderData} from 'react-router'

import {urlFor} from '~/sanity/image'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {PROJECT_QUERY} from '~/sanity/queries'
import type {Route} from './+types/projects.$slug'

interface SanityProject {
  _id: string
  title: string
  slug: string
  projectType?: string
  location?: string
  squareFeet?: number
  completedDate?: string
  description?: string
  fullDescription?: Array<{
    _type: 'block'
    children: Array<{text: string}>
  }>
  beforeImage?: {
    asset: {_ref: string}
    alt?: string
  }
  afterImage?: {
    asset: {_ref: string}
    alt?: string
  }
  gallery?: Array<{
    _key: string
    asset: {_ref: string}
    alt?: string
    caption?: string
    category?: 'Before' | 'During' | 'After'
  }>
  stats?: Array<{
    _key: string
    label: string
    value: string
  }>
  roi?: string
  timeline?: string
  budget?: string
  featured?: boolean
}

export async function loader({request, params}: Route.LoaderArgs) {
  const {options} = await loadQueryOptions(request.headers)
  const {data: project} = await loadQuery<SanityProject | null>(
    PROJECT_QUERY,
    {slug: params.slug},
    options
  )

  if (!project) {
    throw new Response('Project not found', {status: 404})
  }

  return {project}
}

export const meta: Route.MetaFunction = ({data}) => {
  if (!data?.project) {
    return [{title: 'Project Not Found | Golden Gate Home Advisors'}]
  }

  const {project} = data
  const description =
    project.description ||
    `${project.title} - A ${project.projectType || 'renovation'} project in ${project.location || 'San Francisco Bay Area'}`

  return [
    {title: `${project.title} | Projects | Golden Gate Home Advisors`},
    {name: 'description', content: description},
    {property: 'og:title', content: `${project.title} | Golden Gate Home Advisors`},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
  ]
}

const projectTypeLabels: Record<string, string> = {
  'complete-renovation': 'Complete Renovation',
  'kitchen-bath': 'Kitchen & Bath Remodel',
  addition: 'Addition & Renovation',
  luxury: 'Luxury Renovation',
  investment: 'Investment Property',
  'new-development': 'New Development',
}

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

// Default placeholder images
const defaultBeforeImage =
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=2000&q=80'
const defaultAfterImage =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80'

export default function ProjectDetail() {
  const {project} = useLoaderData<typeof loader>()
  const [activeGalleryFilter, setActiveGalleryFilter] = useState<
    'All' | 'Before' | 'During' | 'After'
  >('All')

  // Get images
  const beforeImage = project.beforeImage?.asset
    ? urlFor(project.beforeImage).width(1600).url()
    : defaultBeforeImage

  const afterImage = project.afterImage?.asset
    ? urlFor(project.afterImage).width(1600).url()
    : defaultAfterImage

  // Filter gallery
  const galleryImages = project.gallery || []
  const filteredGallery =
    activeGalleryFilter === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeGalleryFilter)

  // Format completed date
  const completedDateFormatted = project.completedDate
    ? new Date(project.completedDate).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null

  // Get project type label
  const projectTypeLabel =
    project.projectType && projectTypeLabels[project.projectType]
      ? projectTypeLabels[project.projectType]
      : project.projectType || 'Renovation'

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#c9a961]/20 text-[#c9a961] px-3 py-1 rounded text-sm font-medium">
              {projectTypeLabel}
            </span>
            {project.featured && (
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm font-medium">
                Featured
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-white/70">
            {project.location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {project.location}
              </span>
            )}
            {project.squareFeet && (
              <span className="flex items-center gap-2">
                <Maximize className="w-5 h-5" />
                {project.squareFeet.toLocaleString()} sq ft
              </span>
            )}
            {completedDateFormatted && (
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Completed {completedDateFormatted}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Before/After Slider */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <BeforeAfterSlider
              beforeImage={beforeImage}
              afterImage={afterImage}
              title={project.title}
            />
            <p className="text-center text-gray-500 text-sm mt-4">
              Drag the slider to compare before and after
            </p>
          </div>
        </div>
      </section>

      {/* Project Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {project.roi && (
                <div className="bg-white p-6 rounded-xl text-center shadow-sm">
                  <TrendingUp className="w-8 h-8 text-[#c9a961] mx-auto mb-3" />
                  <p className="font-display text-3xl text-[#1a1a1a] mb-1">
                    {project.roi}
                  </p>
                  <p className="text-gray-500 text-sm">Return on Investment</p>
                </div>
              )}
              {project.timeline && (
                <div className="bg-white p-6 rounded-xl text-center shadow-sm">
                  <Clock className="w-8 h-8 text-[#c9a961] mx-auto mb-3" />
                  <p className="font-display text-3xl text-[#1a1a1a] mb-1">
                    {project.timeline}
                  </p>
                  <p className="text-gray-500 text-sm">Project Timeline</p>
                </div>
              )}
              {project.budget && (
                <div className="bg-white p-6 rounded-xl text-center shadow-sm">
                  <DollarSign className="w-8 h-8 text-[#c9a961] mx-auto mb-3" />
                  <p className="font-display text-3xl text-[#1a1a1a] mb-1">
                    {project.budget}
                  </p>
                  <p className="text-gray-500 text-sm">Project Budget</p>
                </div>
              )}
              {project.squareFeet && (
                <div className="bg-white p-6 rounded-xl text-center shadow-sm">
                  <Maximize className="w-8 h-8 text-[#c9a961] mx-auto mb-3" />
                  <p className="font-display text-3xl text-[#1a1a1a] mb-1">
                    {project.squareFeet.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">Square Feet</p>
                </div>
              )}
            </div>

            {/* Custom Stats */}
            {project.stats && project.stats.length > 0 && (
              <div className="mt-8 grid grid-cols-3 gap-6">
                {project.stats.map((stat) => (
                  <div
                    key={stat._key || stat.label}
                    className="bg-white p-6 rounded-xl text-center shadow-sm"
                  >
                    <p className="font-display text-2xl text-[#c9a961] mb-1">
                      {stat.value}
                    </p>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project Description */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl text-[#1a1a1a] mb-6">
              Project Overview
            </h2>

            {project.description && (
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {project.description}
              </p>
            )}

            {project.fullDescription && project.fullDescription.length > 0 && (
              <div className="prose prose-lg max-w-none">
                {project.fullDescription.map((block, index) => (
                  <p key={index} className="text-gray-600 leading-relaxed">
                    {block.children?.map((child) => child.text).join('')}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
                Project Gallery
              </p>
              <h2 className="font-display text-3xl text-[#1a1a1a]">
                The Transformation Journey
              </h2>
            </div>

            {/* Gallery Filter */}
            <div className="flex justify-center gap-4 mb-10">
              {(['All', 'Before', 'During', 'After'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveGalleryFilter(filter)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    activeGalleryFilter === filter
                      ? 'bg-[#1a1a1a] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((image) => (
                <div
                  key={image._key}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden group"
                >
                  <img
                    src={urlFor(image).width(800).height(600).url()}
                    alt={image.alt || project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {image.category && (
                    <div className="absolute top-4 left-4 bg-[#1a1a1a]/80 backdrop-blur-sm text-white px-3 py-1 rounded text-sm font-medium">
                      {image.category}
                    </div>
                  )}
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white text-sm">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Start Your Transformation
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-6">
            Ready to Create Your Own
            <br />
            <span className="text-[#c9a961]">Success Story?</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-10">
            Whether you're looking to renovate for personal enjoyment or maximize
            investment returns, our team is here to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/get-started/investors"
              className="inline-flex items-center gap-2 bg-[#c9a961] hover:bg-[#b8994f] text-[#1a1a1a] px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Start Your Project
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              View More Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
