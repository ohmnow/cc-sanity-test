import {ClerkProvider} from '@clerk/react-router'
import {clerkMiddleware, rootAuthLoader} from '@clerk/react-router/server'
import {
  data,
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

// Clerk middleware for auth (only if configured)
export const middleware: Route.MiddlewareFunction[] = isClerkConfigured
  ? [clerkMiddleware()]
  : []

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

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
