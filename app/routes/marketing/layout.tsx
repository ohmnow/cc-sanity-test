import {VisualEditing} from '@sanity/visual-editing/react-router'
import {lazy, Suspense} from 'react'
import {Outlet} from 'react-router'

import {AnnouncementBar} from '~/components/marketing/AnnouncementBar'
import {MarketingFooter} from '~/components/marketing/MarketingFooter'
import {Navigation} from '~/components/marketing/Navigation'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'

import type {Route} from './+types/layout'

const SanityLiveMode = lazy(() =>
  import('~/components/SanityLiveMode').then((module) => ({
    default: module.SanityLiveMode,
  })),
)
const ExitPreview = lazy(() =>
  import('~/components/ExitPreview').then((module) => ({
    default: module.ExitPreview,
  })),
)

export const loader = async ({request}: Route.LoaderArgs) => {
  const {preview} = await loadQueryOptions(request.headers)
  return {preview}
}

// JSON-LD Structured Data for SEO
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Golden Gate Home Advisors',
  url: 'https://goldengateadvisors.com',
  logo: 'https://goldengateadvisors.com/logo.png',
  description:
    "San Francisco Bay Area's premier real estate advisory for discerning buyers, strategic sellers, and sophisticated investors.",
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Market Street, Suite 456',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    postalCode: '94102',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 37.7749,
    longitude: -122.4194,
  },
  telephone: '+1-415-555-1234',
  email: 'hello@goldengateadvisors.com',
  areaServed: {
    '@type': 'City',
    name: 'San Francisco Bay Area',
  },
  priceRange: '$$$',
  openingHours: 'Mo-Fr 09:00-18:00',
  sameAs: [
    'https://www.facebook.com/goldengateadvisors',
    'https://www.instagram.com/goldengateadvisors',
    'https://www.linkedin.com/company/goldengateadvisors',
  ],
}

export default function MarketingLayout({loaderData}: Route.ComponentProps) {
  const {preview} = loaderData

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(organizationSchema)}}
      />
      {/* Fixed header container - floats over content */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <AnnouncementBar />
        <Navigation />
      </header>
      <main>
        <Outlet />
      </main>
      <MarketingFooter />
      {preview ? (
        <Suspense>
          <SanityLiveMode />
          <ExitPreview />
          <VisualEditing />
        </Suspense>
      ) : null}
    </div>
  )
}
