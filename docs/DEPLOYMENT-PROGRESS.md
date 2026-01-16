# Deployment Progress & Issues Report

**Date:** January 15-16, 2026
**Status:** ✅ All Features Working (Local & Production)

---

## Final Status

| Feature | Local | Production |
|---------|-------|------------|
| Marketing pages | ✅ Working | ✅ Working |
| Sanity Studio | ✅ Working | ✅ Working |
| Visual Editing (Presentation) | ✅ Working | ✅ Working |
| Admin Portal | ✅ Working | ✅ Working |
| Investor Portal | ✅ Working | ✅ Working |

**Production URL:** https://sanity-zeta-fawn.vercel.app

---

## Session 2 Fixes (January 16, 2026)

### Fix 1: Local Development - Missing Server-Side Env Vars

**Problem:** Local dev was broken because `.env` only had `VITE_*` prefixed vars, but the server-side code was looking for non-prefixed vars (`SANITY_PROJECT_ID`, etc.).

**Solution:** Added server-side env vars to `.env`:
```bash
SANITY_PROJECT_ID=f8f2uv9e
SANITY_DATASET=sanity-test
SANITY_API_VERSION=2026-01-15
```

### Fix 2: Sessions Module Lazy Initialization

**Problem:** `app/sessions.ts` threw an error at module load time if `SANITY_SESSION_SECRET` wasn't set, causing the preview route to return 500.

**Solution:** Converted to lazy initialization pattern:
```typescript
// Before - throws at import time
if (!process.env.SANITY_SESSION_SECRET) {
  throw new Error('Missing SANITY_SESSION_SECRET')
}
const {getSession} = createCookieSessionStorage({...})

// After - throws at runtime when needed
function getSessionStorage() {
  if (!_sessionStorage) {
    const secret = process.env.SANITY_SESSION_SECRET
    if (!secret) throw new Error('Missing SANITY_SESSION_SECRET')
    _sessionStorage = createCookieSessionStorage({...})
  }
  return _sessionStorage
}
export const getSession = (...args) => getSessionStorage().getSession(...args)
```

### Fix 3: SanityLiveMode Client Creation

**Problem:** `SanityLiveMode.tsx` created a Sanity client at module level, which could fail during lazy initialization.

**Solution:** Moved client creation inside the component with `useMemo`:
```typescript
// Before - module level
const liveClient = client.withConfig({stega: {...}})

// After - inside component
const liveClient = useMemo(
  () => getClient().withConfig({stega: {...}}),
  []
)
```

### Fix 4: Preview Route Using getClient()

**Problem:** `preview.ts` imported `client` (Proxy) instead of using `getClient()` function.

**Solution:** Changed to explicit function call:
```typescript
import {getClient} from '~/sanity/client'
const client = getClient()
const clientWithToken = client.withConfig({token: ...})
```

### Fix 5: Admin Password Sanitization

**Problem:** Vercel env vars can have trailing whitespace/newlines that cause password comparison to fail.

**Solution:** Added `.trim()` to sanitize the env var:
```typescript
const rawPassword = process.env.ADMIN_PASSWORD
const adminPassword = rawPassword?.trim() || 'admin123'
```

### Fix 6: Replace viewClient Proxy with Direct Function Calls

**Problem:** The `viewClient` Proxy pattern was causing 500 errors on the Admin dashboard in production. The Proxy intercepts property access but doesn't work reliably in Vercel's serverless environment.

**Solution:** Replaced all `viewClient` imports with `getViewClient()` function calls:
```typescript
// Before - using Proxy
import {viewClient} from '~/sanity/client.server'
const data = await viewClient.fetch(query)

// After - direct function call
import {getViewClient} from '~/sanity/client.server'
const data = await getViewClient().fetch(query)
```

**Files updated:**
- `app/routes/admin/index.tsx`
- `app/routes/admin/leads.tsx`
- `app/routes/admin/investors.tsx`
- `app/routes/admin/lois.tsx`
- `app/routes/sitemap[.]xml.ts`
- `app/routes/resource/og.ts`
- `app/routes/resource/pdf/loi.$id.ts`
- `app/routes/resource/pdf/prospectus.$id.ts`

---

## Session 1 Fixes (January 15, 2026)

### Original Production Issues

1. **React Router Middleware Error:** Disabled `v8_middleware` flag
2. **Invalid Authorization Header:** Added token sanitization
3. **Module-level initialization failures:** Converted to lazy initialization

### The Production Problem

When deployed to Vercel, the site crashed with two errors:

#### Error 1: React Router Middleware Context
```
Error: Invalid `context` value provided to `handleRequest`. When middleware is enabled
you must return an instance of `RouterContextProvider` from your `getLoadContext` function.
```

**Root Cause:** The `react-router.config.ts` had `v8_middleware: true` enabled, but `@vercel/react-router` preset doesn't fully support this yet. See [GitHub issue #13327](https://github.com/vercel/vercel/issues/13327).

#### Error 2: Invalid Authorization Header
```
TypeError [ERR_INVALID_CHAR]: Invalid character in header content ["authorization"]
```

**Root Cause:** The `SANITY_READ_TOKEN` environment variable from Vercel contained invalid characters (likely trailing whitespace/newlines) that broke HTTP headers.

### Key Architecture Changes

1. **Disabled v8_middleware** in `react-router.config.ts`
2. **Changed Clerk import** to deprecated `ssr.server` path (temporary workaround)
3. **Lazy initialization pattern** for all Sanity clients
4. **Token sanitization** for API tokens
5. **Function calls instead of direct exports** for project details
6. **Dynamic imports** for SanityStudio component

---

## Environment Variables Required

### For Local Development (`.env`)
```bash
# Client-side (exposed to browser)
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=your-dataset
VITE_SANITY_API_VERSION=2026-01-15

# Server-side (same values, for SSR)
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=your-dataset
SANITY_API_VERSION=2026-01-15

# API Tokens
SANITY_READ_TOKEN=your-viewer-token
SANITY_WRITE_TOKEN=your-editor-token
SANITY_SESSION_SECRET=random-string

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Admin
ADMIN_PASSWORD=admin123
SITE_URL=http://localhost:5175
```

### For Vercel Production

Ensure all the above variables are set in Vercel dashboard. The non-VITE prefixed server-side vars are required for SSR.

**Important:** When setting env vars in Vercel, ensure there are no trailing spaces or newlines - these can cause authentication failures.

---

## Key Lessons Learned

1. **Avoid module-level initialization** in serverless environments - use lazy initialization patterns
2. **Avoid Proxy objects** for Sanity clients in production - use direct function calls
3. **Always sanitize env vars** from Vercel (trim whitespace)
4. **Duplicate env vars** with both `VITE_` and non-prefixed versions for SSR compatibility
5. **Test production builds locally** before deploying when making infrastructure changes

---

## Related Resources

- [GitHub: Vercel React Router middleware issue #13327](https://github.com/vercel/vercel/issues/13327)
- [Clerk React Router Docs](https://clerk.com/docs/quickstarts/react-router)
- [Sanity Environment Variables](https://www.sanity.io/docs/environment-variables)
