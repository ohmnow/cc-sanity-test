/**
 * Simple in-memory rate limiter for form submissions
 *
 * Note: This is a basic implementation that resets on serverless cold starts.
 * For production with high traffic, consider using:
 * - Vercel KV (Redis)
 * - Upstash Rate Limit (@upstash/ratelimit)
 * - Cloudflare Workers KV
 */

interface RateLimitRecord {
  count: number
  resetAt: number
}

// In-memory store - will reset on cold starts but provides basic protection
const rateLimitStore = new Map<string, RateLimitRecord>()

// Clean up old entries periodically
let lastCleanup = Date.now()
const CLEANUP_INTERVAL = 60 * 1000 // 1 minute

function cleanupOldEntries() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return

  lastCleanup = now
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}

export interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  limit: number
  /** Time window in seconds */
  windowSeconds: number
  /** Identifier for the rate limit (e.g., 'lead-form', 'loi-submit') */
  identifier: string
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: Date
}

/**
 * Check if a request is rate limited
 * @param ip - Client IP address
 * @param options - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
  ip: string,
  options: RateLimitOptions
): RateLimitResult {
  cleanupOldEntries()

  const {limit, windowSeconds, identifier} = options
  const key = `${identifier}:${ip}`
  const now = Date.now()
  const windowMs = windowSeconds * 1000

  const existing = rateLimitStore.get(key)

  // If no record or window has expired, create new record
  if (!existing || now > existing.resetAt) {
    const resetAt = now + windowMs
    rateLimitStore.set(key, {count: 1, resetAt})
    return {
      success: true,
      remaining: limit - 1,
      resetAt: new Date(resetAt),
    }
  }

  // Check if limit exceeded
  if (existing.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: new Date(existing.resetAt),
    }
  }

  // Increment counter
  existing.count++
  rateLimitStore.set(key, existing)

  return {
    success: true,
    remaining: limit - existing.count,
    resetAt: new Date(existing.resetAt),
  }
}

/**
 * Get client IP from request
 */
export function getClientIp(request: Request): string {
  // Try various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  // Vercel-specific header
  const vercelForwardedFor = request.headers.get('x-vercel-forwarded-for')
  if (vercelForwardedFor) {
    return vercelForwardedFor.split(',')[0].trim()
  }

  return 'unknown'
}

/**
 * Create a rate-limited response with appropriate headers
 */
export function rateLimitedResponse(resetAt: Date): Response {
  const retryAfter = Math.ceil((resetAt.getTime() - Date.now()) / 1000)

  return new Response(
    JSON.stringify({
      error: 'Too many requests. Please try again later.',
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
        'X-RateLimit-Reset': resetAt.toISOString(),
      },
    }
  )
}
