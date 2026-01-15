import {useLoaderData} from 'react-router'

import {BeforeAfterSection} from '~/components/marketing/BeforeAfterSection'
import {CTASection} from '~/components/marketing/CTASection'
import {HeroSection} from '~/components/marketing/HeroSection'
import {PropertiesSection} from '~/components/marketing/PropertiesSection'
import {ServicesSection} from '~/components/marketing/ServicesSection'
import {StatsSection} from '~/components/marketing/StatsSection'
import {TestimonialsSection} from '~/components/marketing/TestimonialsSection'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {HOMEPAGE_QUERY} from '~/sanity/queries'
import type {Route} from './+types/index'

export async function loader({request}: Route.LoaderArgs) {
  const {options} = await loadQueryOptions(request.headers)
  const {data: homepage} = await loadQuery<HomepageData>(
    HOMEPAGE_QUERY,
    {},
    options
  )

  return {homepage}
}

// Types for the homepage data
interface HomepageData {
  announcementBar?: {
    enabled: boolean
    text: string
    linkText: string
    linkUrl: string
  }
  heroHeadline: string
  heroSubheadline: string
  heroImage?: {asset: {_ref: string}}
  heroPrimaryCta?: {text: string; url: string}
  heroSecondaryCta?: {text: string; url: string}
  servicesHeadline: string
  servicesSubheadline: string
  featuredServices?: Array<{
    _id: string
    title: string
    slug: string
    shortDescription: string
    icon: string
    category: string
    features?: Array<{title: string; description: string}>
  }>
  statsHeadline: string
  stats?: Array<{value: string; label: string}>
  featuredProjectHeadline: string
  featuredProjectSubheadline: string
  featuredProject?: {
    _id: string
    title: string
    slug: string
    beforeImage?: {asset: {_ref: string}}
    afterImage?: {asset: {_ref: string}}
    description: string
    location: string
    projectType: string
  }
  testimonialsHeadline: string
  testimonialsSubheadline: string
  featuredTestimonials?: Array<{
    _id: string
    clientName: string
    clientTitle: string
    quote: string
    rating: number
    clientImage?: {asset: {_ref: string}}
  }>
  propertiesHeadline: string
  propertiesSubheadline: string
  featuredProperties?: Array<{
    _id: string
    title: string
    slug: string
    price: number
    address: {
      street: string
      city: string
      neighborhood: string
      state: string
      zip: string
    }
    bedrooms: number
    bathrooms: number
    squareFeet: number
    mainImage?: {asset: {_ref: string}}
    status: string
  }>
  ctaHeadline: string
  ctaSubheadline: string
  ctaButton?: {text: string; url: string}
}

export default function MarketingHome() {
  const {homepage} = useLoaderData<typeof loader>()

  return (
    <>
      <HeroSection
        headline={homepage?.heroHeadline}
        subheadline={homepage?.heroSubheadline}
        primaryCta={homepage?.heroPrimaryCta}
        secondaryCta={homepage?.heroSecondaryCta}
      />
      <ServicesSection
        headline={homepage?.servicesHeadline}
        subheadline={homepage?.servicesSubheadline}
        services={homepage?.featuredServices}
      />
      <StatsSection
        headline={homepage?.statsHeadline}
        stats={homepage?.stats}
      />
      <BeforeAfterSection
        headline={homepage?.featuredProjectHeadline}
        subheadline={homepage?.featuredProjectSubheadline}
        project={homepage?.featuredProject}
      />
      <TestimonialsSection
        headline={homepage?.testimonialsHeadline}
        subheadline={homepage?.testimonialsSubheadline}
        testimonials={homepage?.featuredTestimonials}
      />
      <PropertiesSection
        headline={homepage?.propertiesHeadline}
        subheadline={homepage?.propertiesSubheadline}
        properties={homepage?.featuredProperties}
      />
      <CTASection
        headline={homepage?.ctaHeadline}
        subheadline={homepage?.ctaSubheadline}
        cta={homepage?.ctaButton}
      />
    </>
  )
}
