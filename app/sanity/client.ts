import {createClient, type SanityClient} from '@sanity/client'

import {projectDetails} from '~/sanity/projectDetails'

// Lazy client initialization - created on first access, not at module load
let _client: SanityClient | null = null

export function getClient(): SanityClient {
  if (!_client) {
    const {projectId, dataset, apiVersion} = projectDetails()
    _client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  }
  return _client
}

// For backwards compatibility - getter that lazily creates the client
export const client = new Proxy({} as SanityClient, {
  get(_, prop) {
    return (getClient() as any)[prop]
  },
})
