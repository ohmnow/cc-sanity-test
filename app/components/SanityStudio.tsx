import {lazy, Suspense} from 'react'

// Lazy import the studio to avoid loading sanity.config.ts on server
const StudioLazy = lazy(async () => {
  const {Studio} = await import('sanity')
  const {default: config} = await import('../../sanity.config')
  return {
    default: () => (
      <Studio
        config={config}
        // To enable guests view-only access to your Studio,
        // uncomment this line!
        // unstable_noAuthBoundary
      />
    ),
  }
})

export function SanityStudio() {
  return (
    <Suspense fallback={<div>Loading Studio...</div>}>
      <StudioLazy />
    </Suspense>
  )
}
