# Deployment Progress & Issues Report

**Date:** January 15, 2026
**Session Duration:** ~1.5 hours
**Status:** Production partially working, Local broken

---

## Executive Summary

We spent significant time debugging and fixing a 500 error on the Vercel production deployment. The fixes required substantial refactoring of how Sanity clients and environment variables are initialized. While the main marketing pages now work in production, **the changes broke local development** and **several production features are not working** (Sanity Studio, Admin portal, possibly Clerk auth).

---

## What Was Working Before This Session

- Local development worked correctly
- All Sanity client initialization happened at module load time
- Environment variables were read directly from `import.meta.env` or `process.env`

---

## The Production Problem

When deployed to Vercel, the site crashed with two errors:

### Error 1: React Router Middleware Context
```
Error: Invalid `context` value provided to `handleRequest`. When middleware is enabled
you must return an instance of `RouterContextProvider` from your `getLoadContext` function.
```

**Root Cause:** The `react-router.config.ts` had `v8_middleware: true` enabled, but `@vercel/react-router` preset doesn't fully support this yet. See [GitHub issue #13327](https://github.com/vercel/vercel/issues/13327).

### Error 2: Invalid Authorization Header
```
TypeError [ERR_INVALID_CHAR]: Invalid character in header content ["authorization"]
```

**Root Cause:** The `SANITY_READ_TOKEN` environment variable from Vercel contained invalid characters (likely trailing whitespace/newlines) that broke HTTP headers.

---

## Changes Made to Fix Production

### 1. Disabled v8_middleware (`react-router.config.ts`)

```typescript
// BEFORE
export default {
  presets: [vercelPreset()],
  future: {
    v8_middleware: true,
  },
} satisfies Config

// AFTER
export default {
  presets: [vercelPreset()],
  // v8_middleware disabled - requires RouterContextProvider from getLoadContext
  // which @vercel/react-router preset doesn't fully support yet
} satisfies Config
```

### 2. Changed Clerk Import Path (`app/root.tsx`)

```typescript
// BEFORE
import {clerkMiddleware, rootAuthLoader} from '@clerk/react-router/server'
export const middleware: Route.MiddlewareFunction[] = [clerkMiddleware()]

// AFTER
import {rootAuthLoader} from '@clerk/react-router/ssr.server'
// Removed middleware export entirely
```

**Note:** This import path is deprecated. Clerk warns:
> `@clerk/react-router/ssr.server` has been deprecated. Import from `@clerk/react-router/server` instead.

### 3. Lazy Initialization Pattern for Sanity Clients

Changed ALL Sanity client creation from module-level to lazy initialization:

#### `app/sanity/projectDetails.ts`
```typescript
// BEFORE - executed at module load
export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
export const dataset = import.meta.env.VITE_SANITY_DATASET

// AFTER - lazy evaluation
let _initialized = false
function ensureInitialized() {
  if (_initialized) return
  // Read env vars here...
  _initialized = true
}
export const projectDetails = () => {
  ensureInitialized()
  return { projectId, dataset, apiVersion }
}
```

#### `app/sanity/client.ts`
```typescript
// BEFORE
export const client = createClient({...})

// AFTER
let _client: SanityClient | null = null
export function getClient(): SanityClient {
  if (!_client) {
    _client = createClient({...})
  }
  return _client
}
// Proxy for backwards compatibility
export const client = new Proxy({} as SanityClient, {
  get(_, prop) { return (getClient() as any)[prop] }
})
```

#### `app/sanity/client.server.ts`
Same pattern - lazy `getViewClient()` function.

#### `app/sanity/loader.server.ts`
```typescript
let initialized = false
function ensureInitialized() {
  if (!initialized) {
    queryStore.setServerClient(clientWithToken)
    initialized = true
  }
}
export const loadQuery = (...args) => {
  ensureInitialized()
  return queryStore.loadQuery(...args)
}
```

### 4. Token Sanitization

Added sanitization to handle Vercel env var issues:

```typescript
function sanitizeToken(rawToken: string | undefined): string | undefined {
  if (!rawToken) return undefined
  const cleaned = rawToken.replace(/[\s\r\n\t]/g, '')
  if (cleaned.length > 0 && /^[\x20-\x7E]+$/.test(cleaned)) {
    return cleaned
  }
  console.warn('[Sanity] Token contains invalid characters for HTTP headers')
  return undefined
}
```

### 5. Updated All Component Imports

Changed from direct imports to function calls:

```typescript
// BEFORE
import {projectId, dataset} from '~/sanity/projectDetails'
urlBuilder({projectId, dataset})

// AFTER
import {projectDetails} from '~/sanity/projectDetails'
urlBuilder(projectDetails())
```

**Files affected:**
- `app/components/RecordCover.tsx`
- `app/components/SanityImage.tsx`
- `app/components/SanityStudio.tsx`
- `app/lib/og.server.tsx`

### 6. Dynamic Import for SanityStudio

```typescript
// BEFORE
import {Studio} from 'sanity'
import config from '../../sanity.config'

// AFTER
const StudioLazy = lazy(async () => {
  const {Studio} = await import('sanity')
  const {default: config} = await import('../../sanity.config')
  return { default: () => <Studio config={config} /> }
})
```

---

## Current State

### Production (https://sanity-zeta-fawn.vercel.app)

| Feature | Status | Notes |
|---------|--------|-------|
| Marketing pages | ✅ Working | Homepage, About, Services, etc. |
| Sanity Studio | ❌ Broken | Likely env var or auth issue |
| Admin Portal | ❌ Broken | Login with admin123 not working |
| Investor Portal | ✅ Working | Per user report |
| Clerk Auth | ⚠️ Unknown | May have issues |

### Local Development

| Feature | Status | Notes |
|---------|--------|-------|
| All features | ❌ Broken | Changes broke local dev |

---

## Environment Variables Investigation Needed

### `.env.production.local` - May be missing variables

Check that ALL of these are set in Vercel:
```
VITE_SANITY_PROJECT_ID=
VITE_SANITY_DATASET=
VITE_SANITY_API_VERSION=
SANITY_PROJECT_ID=
SANITY_DATASET=
SANITY_API_VERSION=
SANITY_READ_TOKEN=
SANITY_WRITE_TOKEN=
CLERK_SECRET_KEY=
VITE_CLERK_PUBLISHABLE_KEY=
ADMIN_PASSWORD=
SITE_URL=
RESEND_API_KEY=
```

### Vercel Environment Variables (confirmed set)

```bash
$ vercel env ls
VITE_SANITY_API_VERSION    Production
VITE_SANITY_DATASET        Production
VITE_SANITY_PROJECT_ID     Production
SANITY_API_VERSION         Production
SANITY_DATASET             Production
SANITY_PROJECT_ID          Production
CLERK_SECRET_KEY           Production
VITE_CLERK_PUBLISHABLE_KEY Production
SANITY_WRITE_TOKEN         Production
SANITY_READ_TOKEN          Production
ADMIN_PASSWORD             Production
SITE_URL                   Production
SANITY_SESSION_SECRET      Production
```

---

## Tasks for Next Session

### Priority 1: Fix Local Development
1. Test `npm run dev` and capture error messages
2. The lazy initialization pattern may have issues with Vite's HMR
3. May need conditional logic for dev vs prod environments
4. Check if `projectDetails()` is being called before env vars are ready

### Priority 2: Fix Sanity Studio in Production
1. Check browser console for errors at `/studio`
2. Verify `sanity.config.ts` is loading correctly
3. Check if CORS origins are configured for production domain
4. May need to add `https://sanity-zeta-fawn.vercel.app` to Sanity CORS

### Priority 3: Fix Admin Portal
1. Test `/admin/login` with password `admin123`
2. Check if `ADMIN_PASSWORD` env var is accessible at runtime
3. The admin auth uses a session cookie - may have issues

### Priority 4: Verify Clerk Authentication
1. Test investor sign-in flow
2. Check if the SSR import deprecation is causing issues
3. May need to migrate back to middleware approach properly

---

## Key Files Modified

| File | Change Type | Risk Level |
|------|-------------|------------|
| `react-router.config.ts` | Removed middleware flag | Low |
| `app/root.tsx` | Changed Clerk import, removed middleware | Medium |
| `app/sanity/projectDetails.ts` | Complete rewrite to lazy init | High |
| `app/sanity/client.ts` | Lazy init + Proxy | High |
| `app/sanity/client.server.ts` | Lazy init + sanitization | High |
| `app/sanity/loader.server.ts` | Lazy init + sanitization | High |
| `app/components/SanityStudio.tsx` | Dynamic import | Medium |

---

## Potential Rollback Strategy

If fixes prove too complex, consider:
1. Revert the lazy initialization changes
2. Use Vercel's build-time env var injection instead
3. Create separate client files for server vs client bundles

---

## Related Resources

- [GitHub: Vercel React Router middleware issue #13327](https://github.com/vercel/vercel/issues/13327)
- [Clerk React Router Docs](https://clerk.com/docs/quickstarts/react-router)
- [Sanity Environment Variables](https://www.sanity.io/docs/environment-variables)
- Sprint Plan: `/Users/chris/.claude/plans/proud-dazzling-hickey.md`
