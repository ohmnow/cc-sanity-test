import * as queryStore from '@sanity/react-loader'

import {getClient} from '~/sanity/client'
import {STUDIO_BASEPATH} from './constants'

// Helper to sanitize token - remove any characters that might cause HTTP header issues
function sanitizeToken(rawToken: string | undefined): string | undefined {
  if (!rawToken) return undefined
  // Remove all whitespace including newlines, carriage returns, etc.
  const cleaned = rawToken.replace(/[\s\r\n\t]/g, '')
  // Only return if we have a non-empty string with valid HTTP header characters
  if (cleaned.length > 0 && /^[\x20-\x7E]+$/.test(cleaned)) {
    return cleaned
  }
  console.warn('[Sanity] Token contains invalid characters for HTTP headers')
  return undefined
}

// Lazy initialization - setup happens on first loadQuery call
let initialized = false
function ensureInitialized() {
  if (!initialized) {
    const token = sanitizeToken(process.env.SANITY_READ_TOKEN)
    const clientWithToken = getClient().withConfig({
      // Token required for when perspective: 'previewDrafts'
      // Only include token if it's a valid non-empty string
      ...(token ? {token} : {}),
      // Minimum required stega config
      stega: {studioUrl: STUDIO_BASEPATH},
    })
    queryStore.setServerClient(clientWithToken)
    initialized = true
  }
}

// Wrap loadQuery to ensure initialization
export const loadQuery: typeof queryStore.loadQuery = (...args) => {
  ensureInitialized()
  return queryStore.loadQuery(...args)
}
