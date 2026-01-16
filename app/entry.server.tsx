import type {EntryContext} from 'react-router'
import {ServerRouter} from 'react-router'
import {isbot} from 'isbot'
import {renderToReadableStream} from 'react-dom/server'

// Initialize Sentry on server startup
import {initSentry} from '~/lib/sentry.server'
initSentry()

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  entryContext: EntryContext
) {
  let status = responseStatusCode
  const headers = new Headers(responseHeaders)
  headers.set('Content-Type', 'text/html')

  const body = await renderToReadableStream(
    <ServerRouter context={entryContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        // Log streaming errors
        console.error('Streaming error:', error)
        status = 500
      },
    }
  )

  // For bots, wait for the full render
  if (isbot(request.headers.get('user-agent') || '')) {
    await body.allReady
  }

  return new Response(body, {
    headers,
    status,
  })
}
