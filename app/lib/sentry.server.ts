import * as Sentry from '@sentry/node'

let initialized = false

/**
 * Initialize Sentry for server-side error tracking
 * Only initializes once, even if called multiple times
 */
export function initSentry() {
  if (initialized) return

  const dsn = process.env.SENTRY_DSN?.trim()

  if (!dsn) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Sentry] SENTRY_DSN not set - server error tracking disabled')
    }
    return
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Only send errors in production by default
    enabled: process.env.NODE_ENV === 'production',

    // Filter out expected errors
    ignoreErrors: [
      // Expected HTTP errors
      'Response',
      // Rate limiting
      'Too many requests',
    ],

    beforeSend(event) {
      // Don't send events for expected status codes
      if (event.extra?.statusCode) {
        const statusCode = event.extra.statusCode as number
        if (statusCode >= 400 && statusCode < 500) {
          return null // Don't send 4xx errors
        }
      }
      return event
    },
  })

  initialized = true
  console.log('[Sentry] Server-side error tracking initialized')
}

/**
 * Capture an exception with Sentry
 */
export function captureException(error: unknown, context?: Record<string, unknown>) {
  const dsn = process.env.SENTRY_DSN?.trim()
  if (!dsn) return

  Sentry.captureException(error, {
    extra: context,
  })
}

/**
 * Capture a message with Sentry
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  const dsn = process.env.SENTRY_DSN?.trim()
  if (!dsn) return

  Sentry.captureMessage(message, level)
}

/**
 * Set user context for Sentry
 */
export function setUser(user: {id?: string; email?: string; username?: string} | null) {
  Sentry.setUser(user)
}

export {Sentry}
