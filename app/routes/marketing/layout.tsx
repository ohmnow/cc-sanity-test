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

export default function MarketingLayout({loaderData}: Route.ComponentProps) {
  const {preview} = loaderData

  return (
    <div className="min-h-screen bg-white">
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
