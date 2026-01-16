# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Golden Gate Home Advisors - a real estate platform built with React Router 7 + Sanity CMS featuring:
- Marketing website for buyers, sellers, and investors
- Lead capture and management system
- Investor portal with Clerk authentication
- Admin dashboard for team operations
- Sanity Studio embedded at `/studio` with Visual Editing

**Production URL:** https://sanity-zeta-fawn.vercel.app

## Commands

```bash
npm run dev          # Start development server (http://localhost:5173 or next available)
npm run build        # Build for production
npm run start        # Run production server
npm run typecheck    # Generate types and run TypeScript check
npm run lint         # Run ESLint with auto-fix

# Deploy schema changes to Sanity
npx sanity schema deploy
```

## Architecture

### Routing Structure (`app/routes.ts`)
- **Marketing routes** use layout wrapper (`routes/website/layout.tsx`)
- **Investor portal** at `/investor/*` - Clerk-protected
- **Admin portal** at `/admin/*` - Password-protected
- **Studio** mounted at `/studio/*`
- **Resource routes** under `/resource/` - APIs, PDFs, webhooks

### Key Route Groups
| Path | Purpose |
|------|---------|
| `/`, `/about`, `/services`, `/properties`, `/projects`, `/testimonials`, `/contact` | Marketing pages |
| `/get-started/*` | Lead capture forms (buyer, seller, investor) |
| `/investor/*` | Investor portal (dashboard, opportunities, LOIs) |
| `/admin/*` | Admin portal (leads, investors, LOI management) |
| `/resource/*` | API endpoints (lead submission, PDFs, preview) |
| `/studio/*` | Sanity Studio |

### Sanity Integration (`app/sanity/`)
- `projectDetails.ts` - Env vars for server/client
- `client.ts` - Browser client (uses `getClient()` function)
- `client.server.ts` - Server client (uses `getViewClient()` function)
- `loader.server.ts` - Server-side data loading
- `queries.ts` - GROQ queries
- `schemaTypes/` - Schema definitions

### Schema Types
**Real Estate:**
- `property` - Residential listings with agent, features, gallery
- `project` - Before/after renovation showcases
- `service` - Service offerings (buying, selling, investing)
- `testimonial` - Client reviews
- `teamMember` - Team with licensing info

**Investor Portal:**
- `prospectus` - Investment opportunities with financials
- `letterOfIntent` - LOI submissions with status tracking
- `investor` - Investor profiles linked to Clerk

**Operations:**
- `lead` - Form submissions from buyers/sellers/investors
- `siteSettings` - Global site configuration
- `homepage` - Dynamic homepage sections
- `page` - Generic CMS pages

### Integrations
- **Clerk** - Investor authentication (`VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`)
- **Resend** - Transactional emails (`RESEND_API_KEY`)
- **React PDF** - PDF generation for prospectuses and LOIs

---

## Vercel Deployment Patterns (CRITICAL)

These patterns are **required** for Vercel serverless deployment. Violations will cause 500 errors in production.

### 1. Use Lazy Initialization - NEVER Module-Level Setup

```typescript
// ❌ BAD - Throws at module load time, crashes serverless functions
if (!process.env.MY_SECRET) {
  throw new Error('Missing MY_SECRET')
}
const config = { secret: process.env.MY_SECRET }

// ✅ GOOD - Lazy initialization, throws at runtime when actually needed
let _config: Config | null = null
function getConfig(): Config {
  if (!_config) {
    const secret = process.env.MY_SECRET
    if (!secret) throw new Error('Missing MY_SECRET')
    _config = { secret }
  }
  return _config
}
```

### 2. Use Function Calls - NEVER Export Proxy Objects

```typescript
// ❌ BAD - Proxy objects don't work reliably in Vercel serverless
export const client = new Proxy({}, {
  get: (_, prop) => getClient()[prop]
})

// Usage breaks in production:
import { client } from './client'
await client.fetch(query)  // 500 error in Vercel

// ✅ GOOD - Export functions, call them directly
export function getClient() {
  return createClient({ projectId, dataset })
}

// Usage works everywhere:
import { getClient } from './client'
await getClient().fetch(query)
```

### 3. Sanitize Environment Variables

Vercel environment variables can have trailing whitespace/newlines that break HTTP headers and comparisons.

```typescript
// ❌ BAD - Raw env var may have whitespace
const token = process.env.API_TOKEN
const password = process.env.ADMIN_PASSWORD

// ✅ GOOD - Always trim env vars
const token = process.env.API_TOKEN?.trim()
const password = process.env.ADMIN_PASSWORD?.trim()
```

### 4. Move Client Creation Inside Components

```typescript
// ❌ BAD - Module-level client in React components
const liveClient = client.withConfig({ stega: { enabled: true } })

export function MyComponent() {
  useLiveMode({ client: liveClient })
}

// ✅ GOOD - Create inside component with useMemo
export function MyComponent() {
  const liveClient = useMemo(
    () => getClient().withConfig({ stega: { enabled: true } }),
    []
  )
  useLiveMode({ client: liveClient })
}
```

### 5. Duplicate Environment Variables for SSR

Vite only exposes `VITE_*` vars to client-side code, but server-side rendering needs non-prefixed versions.

```bash
# .env - Need BOTH for React Router SSR on Vercel
VITE_SANITY_PROJECT_ID=your-project-id   # Client-side
SANITY_PROJECT_ID=your-project-id         # Server-side SSR

VITE_SANITY_DATASET=production
SANITY_DATASET=production
```

---

## Environment Variables

### Required for Local Development (`.env`)
```bash
# Sanity - Client-side (VITE_ prefix)
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=your-dataset
VITE_SANITY_API_VERSION=2026-01-15

# Sanity - Server-side (same values, for SSR)
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=your-dataset
SANITY_API_VERSION=2026-01-15

# Sanity API Tokens
SANITY_READ_TOKEN=sk...   # Viewer permissions
SANITY_WRITE_TOKEN=sk...  # Editor permissions
SANITY_SESSION_SECRET=random-string-for-cookies

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Email (Resend)
RESEND_API_KEY=re_...

# Admin Portal
ADMIN_PASSWORD=your-secure-password

# Site
SITE_URL=http://localhost:5173
```

### Vercel Environment Variables
Set all the above in Vercel dashboard. **Important:** Ensure no trailing whitespace when pasting.

---

## Key Patterns

### Visual Editing
Uses `@sanity/visual-editing` and Presentation tool. The `SanityLiveMode` component enables click-to-edit in preview mode.

### Type Safety
Zod validators in route loaders parse Sanity responses for runtime type checking.

### Path Alias
`~/*` maps to `./app/*`

### Authentication
- **Investor Portal:** Clerk authentication (optional - site works without)
- **Admin Portal:** Session cookie with password from env var

### Email Notifications
Resend.io sends emails for:
- New lead submissions (to admin)
- LOI submissions (to investor and admin)
- LOI status changes (to investor)

### PDF Generation
`@react-pdf/renderer` generates downloadable PDFs for prospectuses and LOIs.

---

## Troubleshooting

### 500 Errors in Production
1. Check for module-level initialization (convert to lazy init)
2. Check for Proxy object exports (convert to functions)
3. Check env vars in Vercel dashboard (no whitespace)
4. Check Vercel function logs for specific error

### Visual Editing Not Working
1. Ensure `SANITY_READ_TOKEN` is set
2. Ensure `SANITY_SESSION_SECRET` is set
3. Check browser console for connection errors

### Admin Login Failing
1. Check `ADMIN_PASSWORD` in Vercel (trim whitespace)
2. Verify cookie is being set (check Application tab)

---

## Documentation

- `docs/DEPLOYMENT-PROGRESS.md` - Detailed fixes for Vercel deployment
- `docs/FEATURE-ROADMAP.md` - Planned features and priorities
