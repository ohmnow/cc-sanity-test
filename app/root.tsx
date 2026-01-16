import {ClerkProvider} from '@clerk/react-router'
// Using SSR approach (not middleware) for compatibility with Vercel
import {rootAuthLoader} from '@clerk/react-router/ssr.server'
import {useEffect} from 'react'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router'

import {themePreferenceCookie} from '~/cookies'
import {getBodyClassNames} from '~/lib/getBodyClassNames'
import {projectDetails} from '~/sanity/projectDetails'
import {themePreference} from '~/types/themePreference'
import '~/styles/app.css'

import type {Route} from './+types/root'

// Check if Clerk is configured
const isClerkConfigured = Boolean(process.env.CLERK_SECRET_KEY)

export const links: Route.LinksFunction = () => {
  return [
    {rel: 'preconnect', href: 'https://cdn.sanity.io'},
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
      crossOrigin: 'anonymous',
    },
    {
      href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;700&family=Inter:wght@400;500;600;700;800&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:wght@400;500;600;700&display=swap',
      rel: 'stylesheet',
    },
  ]
}

export const loader = async (args: Route.LoaderArgs) => {
  // If Clerk is configured, use rootAuthLoader
  if (isClerkConfigured) {
    return rootAuthLoader(args, async ({request}) => {
      return getLoaderData(request)
    })
  }

  // Otherwise, just return the basic loader data without auth
  return getLoaderData(args.request)
}

async function getLoaderData(request: Request) {
  // Dark/light mode
  const cookieHeader = request.headers.get('Cookie')
  const cookieValue = (await themePreferenceCookie.parse(cookieHeader)) || {}
  const theme = themePreference.parse(cookieValue.themePreference) || 'light'
  const bodyClassNames = getBodyClassNames(theme)
  const {projectId, dataset, apiVersion} = projectDetails()

  return {
    theme,
    bodyClassNames,
    clerkConfigured: isClerkConfigured,
    ENV: {
      VITE_SANITY_PROJECT_ID: projectId,
      VITE_SANITY_DATASET: dataset,
      VITE_SANITY_API_VERSION: apiVersion,
      SENTRY_DSN: process.env.SENTRY_DSN?.trim(),
    },
  }
}

export function Layout({children}: {children: React.ReactNode}) {
  // useLoaderData can return undefined in error boundaries
  const loaderData = useLoaderData<typeof loader>()
  const bodyClassNames = loaderData?.bodyClassNames ?? 'bg-white'
  const ENV = loaderData?.ENV ?? {}

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://fav.farm/🤘" />
        <Meta />
        <Links />
      </head>
      <body className={bodyClassNames}>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
      </body>
    </html>
  )
}

export default function App({loaderData}: Route.ComponentProps) {
  // Only wrap with ClerkProvider if Clerk is configured
  if (loaderData?.clerkConfigured) {
    return (
      <ClerkProvider loaderData={loaderData}>
        <Outlet context={loaderData} />
      </ClerkProvider>
    )
  }

  // Without Clerk, just render the outlet
  return <Outlet context={loaderData} />
}

export function ErrorBoundary({error}: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined
  let statusCode: number | undefined

  if (isRouteErrorResponse(error)) {
    statusCode = error.status
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (error && error instanceof Error) {
    if (import.meta.env.DEV) {
      details = error.message
      stack = error.stack
    }
  }

  // Report errors to Sentry (client-side only, dynamically imported)
  useEffect(() => {
    if (typeof window !== 'undefined' && error && !isRouteErrorResponse(error)) {
      import('~/lib/sentry.client').then(({initSentry, captureException}) => {
        initSentry()
        captureException(error, {boundary: 'root', url: window.location.href})
      }).catch(() => {
        // Sentry import failed, silently continue
      })
    }
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="font-display text-6xl text-[#1a1a1a] mb-4">{message}</h1>
        <p className="text-gray-600 mb-6 max-w-md">{details}</p>
        {statusCode !== 404 && (
          <p className="text-sm text-gray-500 mb-4">
            This error has been logged and we&apos;re looking into it.
          </p>
        )}
        <a
          href="/"
          className="inline-block px-6 py-3 bg-[#c9a961] text-white rounded-lg font-semibold hover:bg-[#b8994f] transition-colors"
        >
          Back to Home
        </a>
        {stack && import.meta.env.DEV && (
          <pre className="mt-8 w-full p-4 overflow-x-auto text-left bg-gray-900 text-gray-100 rounded-lg text-sm">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  )
}
