import {createClient, type SanityClient} from '@sanity/client'

import {projectDetails} from '~/sanity/projectDetails'

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

// Lazy client initialization - created on first access, not at module load
let _viewClient: SanityClient | null = null

export function getViewClient(): SanityClient {
  if (!_viewClient) {
    const {projectId, dataset, apiVersion} = projectDetails()
    const token = sanitizeToken(process.env.SANITY_READ_TOKEN)
    _viewClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      // Only include token if it's a valid non-empty string
      ...(token ? {token} : {}),
    })
  }
  return _viewClient
}

// For backwards compatibility - getter that lazily creates the client
export const viewClient = new Proxy({} as SanityClient, {
  get(_, prop) {
    return (getViewClient() as any)[prop]
  },
})
