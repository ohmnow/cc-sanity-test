import * as Sentry from '@sentry/react'

let initialized = false

/**
 * Initialize Sentry for client-side error tracking
 * Only initializes once, even if called multiple times
 */
export function initSentry() {
  if (initialized || typeof window === 'undefined') return

  // Client-side DSN should be exposed via window.ENV
  const dsn =
    (window as unknown as {ENV?: {SENTRY_DSN?: string}}).ENV?.SENTRY_DSN ||
    import.meta.env.VITE_SENTRY_DSN

  if (!dsn) {
    console.log('[Sentry] Client DSN not configured - client error tracking disabled')
    return
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE || 'development',
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

    // Only send errors in production
    enabled: import.meta.env.PROD,

    // Integrations
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // Only capture replays for errors
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Session replay sample rates
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: import.meta.env.PROD ? 1.0 : 0,

    // Filter out expected errors
    ignoreErrors: [
      // Network errors
      'Failed to fetch',
      'NetworkError',
      'Load failed',
      // Expected navigation errors
      'AbortError',
      // React hydration mismatches (usually harmless)
      'Hydration failed',
      'Text content does not match',
    ],
  })

  initialized = true
  console.log('[Sentry] Client-side error tracking initialized')
}

/**
 * Capture an exception with Sentry
 */
export function captureException(error: unknown, context?: Record<string, unknown>) {
  Sentry.captureException(error, {
    extra: context,
  })
}

/**
 * Set user context for Sentry
 */
export function setUser(user: {id?: string; email?: string; username?: string} | null) {
  Sentry.setUser(user)
}

export {Sentry}
