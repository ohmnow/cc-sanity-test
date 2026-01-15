# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Router 7 + Sanity Studio template with Visual Editing (Presentation tool) for live preview. The Sanity Studio is embedded at `/studio` within the React Router app.

## Commands

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run start        # Run production server
npm run typecheck    # Generate types and run TypeScript check
npm run lint         # Run ESLint with auto-fix

# Seed fake content (WARNING: deletes existing content)
npx sanity@latest exec ./scripts/createData.ts --with-user-token

# Deploy schema changes
npx sanity schema deploy
```

## Architecture

### Routing Structure (`app/routes.ts`)
- Website routes use a layout wrapper (`routes/website/layout.tsx`)
- Studio is mounted at `/studio/*` (`routes/studio.tsx`)
- Resource routes under `/resource/` handle preview, OG images, theme toggle

### Sanity Integration (`app/sanity/`)
- `projectDetails.ts` - Handles env vars for both server/client (reads from `process.env` or `window.ENV`)
- `client.ts` / `client.server.ts` - Sanity client configuration
- `loader.server.ts` - Server-side data loading with `@sanity/react-loader`
- `queries.ts` - GROQ queries for content
- `schemaTypes/` - Sanity schema definitions (artist, genre, home, record, track)
- `structure/` - Studio desk structure and preview configuration
- `presentation/resolve.ts` - Visual editing location resolution

### Schema Types
- `home` - Singleton for homepage content
- `record` - Main content type with likes/dislikes, tracks, artist reference
- `artist` - Referenced by records
- `genre` - Referenced by records (array)
- `track` - Inline object within records

### Key Patterns
- **Visual Editing**: Uses `@sanity/visual-editing` and Presentation tool for live preview
- **Type Safety**: Zod validators in route loaders parse Sanity responses
- **Path Alias**: `~/*` maps to `./app/*`
- **Environment Variables**:
  - `VITE_SANITY_*` - Public, available client-side
  - `SANITY_READ_TOKEN` - Viewer permissions for preview
  - `SANITY_WRITE_TOKEN` - Editor permissions for mutations

## Environment Setup

Copy `.env.template` to `.env` and configure:
1. `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` from sanity.io/manage
2. Add localhost:5173 to CORS origins with credentials in Sanity project settings
3. Generate API tokens with appropriate permissions
