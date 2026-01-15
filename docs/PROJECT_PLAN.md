# Golden Gate Home Advisors - Project Plan

## Overview

Building a luxury real estate website inspired by Luxury Presence design patterns for Golden Gate Home Advisors. The site will serve both public marketing and a private investor portal with prospectus management and LOI workflows.

---

## 1. Design System (Extracted from Luxury Presence)

### Color Palette
```css
/* Primary Colors */
--color-primary-dark: #1a1a1a;      /* Rich black for headers/hero backgrounds */
--color-primary-light: #ffffff;      /* Clean white backgrounds */
--color-accent-gold: #c9a961;        /* Luxury gold for CTAs and accents */
--color-accent-warm: #d4a84b;        /* Warm gold variant */

/* Neutral Palette */
--color-gray-900: #111111;           /* Darkest - hero overlays */
--color-gray-800: #1f1f1f;           /* Dark sections */
--color-gray-700: #2a2a2a;           /* Card backgrounds (dark mode) */
--color-gray-600: #4a4a4a;           /* Secondary text (dark) */
--color-gray-400: #9a9a9a;           /* Muted text */
--color-gray-200: #e5e5e5;           /* Borders, dividers */
--color-gray-100: #f5f5f5;           /* Light section backgrounds */

/* Semantic Colors */
--color-success: #22c55e;
--color-error: #ef4444;
--color-warning: #f59e0b;
```

### Typography
```css
/* Font Families */
--font-display: 'Playfair Display', Georgia, serif;  /* Headlines */
--font-body: 'Inter', -apple-system, sans-serif;     /* Body text */
--font-mono: 'SF Mono', monospace;                   /* Code/numbers */

/* Font Sizes (Desktop) */
--text-hero: clamp(3rem, 8vw, 6rem);    /* Hero headlines */
--text-h1: clamp(2.5rem, 5vw, 4rem);    /* Page titles */
--text-h2: clamp(2rem, 4vw, 3rem);      /* Section headers */
--text-h3: clamp(1.5rem, 3vw, 2rem);    /* Card titles */
--text-h4: 1.25rem;                      /* Subsections */
--text-body: 1rem;                       /* Body text */
--text-small: 0.875rem;                  /* Captions */
--text-xs: 0.75rem;                      /* Labels */

/* Letter Spacing */
--tracking-tight: -0.02em;
--tracking-normal: 0;
--tracking-wide: 0.05em;
--tracking-wider: 0.1em;
--tracking-widest: 0.2em;   /* Luxury spaced headings */
```

### Component Patterns

#### 0. Before/After Image Slider
- Interactive drag-to-reveal comparison
- Vertical divider handle with drag icon
- Touch and mouse support
- Before image on left, after on right
- Optional labels ("Before" / "After")
- Smooth animation on drag
- Works in responsive layouts
- Perfect for renovation showcases

```tsx
// Component structure
<BeforeAfterSlider
  beforeImage="/images/kitchen-before.jpg"
  afterImage="/images/kitchen-after.jpg"
  beforeLabel="Before"
  afterLabel="After"
  initialPosition={50} // percentage
/>
```

#### 1. Announcement Bar (Top Banner)
- Fixed position at top
- Background: accent gold or dark
- Dismissable with close button
- Contains CTA link

#### 2. Navigation
- Transparent on hero, solid on scroll
- Logo centered or left-aligned
- Dropdown menus with icons
- Mobile hamburger menu
- "Get Started" CTA button

#### 3. Hero Sections
- Full viewport height or 80vh
- Background: dark overlay on image/video
- Large serif headline with letter-spacing
- Supporting paragraph in sans-serif
- Dual CTA buttons (primary gold, secondary outline)
- Optional: scrolling logo bar

#### 4. Feature Cards
- Hover lift effect with shadow
- Image or icon at top
- Title + description
- Link with arrow icon
- Grid layout (2-4 columns)

#### 5. Testimonial Carousel
- Quote in large serif font
- Author photo + name + title
- Navigation dots or arrows
- Auto-play with pause on hover

#### 6. Stats Section
- Large numbers with animation on scroll
- Supporting label below
- 4-column grid
- Dark background variant

#### 7. CTA Sections
- Full-width dark background
- Centered text with button
- Optional background pattern

#### 8. Footer
- Multi-column link layout
- Newsletter signup
- Social media icons
- Legal links at bottom
- Copyright notice

---

## 2. Site Architecture

### Main Navigation
```
Home | About | Services | Properties | Testimonials | Contact | [Get Started] (CTA)
```

### Public Website Routes
```
/                           # Landing page
/about                      # About Golden Gate Home Advisors
/services                   # Services overview
/services/buyers            # Buyer services
/services/sellers           # Seller services
/services/investors         # Investor services overview
/projects                   # Project portfolio / case studies
/projects/:slug             # Individual project with before/after
/properties                 # Property listings
/testimonials               # Testimonials page
/contact                    # Contact form

# Lead Capture Flow (from "Get Started" button)
/get-started                # Type selection page (Buyer/Seller/Investor)
/get-started/buyer          # Buyer-specific intake form
/get-started/seller         # Seller-specific intake form
/get-started/investor       # Investor-specific intake form
/get-started/success        # Thank you / confirmation page
```

### Investor Portal Routes
```
/investor                   # Investor portal landing (requires auth)
/investor/login             # Magic link login
/investor/verify            # Magic link verification
/investor/dashboard         # Investor dashboard
/investor/prospectus/:id    # View prospectus detail
/investor/prospectus/:id/interest   # Express interest form
/investor/loi/:id           # Letter of Intent form/view
/investor/portfolio         # Investment portfolio overview
/investor/profile           # Investor profile settings
```

### Admin Routes (Sanity Studio + Custom)
```
/studio                     # Sanity Studio (existing)
/admin                      # Admin dashboard (optional custom)
```

---

## 3. Sanity Schema Design

### Content Types

#### Site Content
```typescript
// siteSettings - Singleton
{
  name: 'siteSettings',
  type: 'document',
  fields: [
    { name: 'siteTitle', type: 'string' },
    { name: 'siteLogo', type: 'image' },
    { name: 'announcementBar', type: 'object', fields: [...] },
    { name: 'socialLinks', type: 'array', of: [...] },
    { name: 'footerContent', type: 'object', fields: [...] },
  ]
}

// page - For marketing pages
{
  name: 'page',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'seo', type: 'seo' },
    { name: 'sections', type: 'array', of: [pageSection types...] },
  ]
}

// teamMember
{
  name: 'teamMember',
  type: 'document',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'role', type: 'string' },
    { name: 'photo', type: 'image' },
    { name: 'bio', type: 'text' },
    { name: 'email', type: 'string' },
    { name: 'phone', type: 'string' },
  ]
}

// testimonial
{
  name: 'testimonial',
  type: 'document',
  fields: [
    { name: 'quote', type: 'text' },
    { name: 'author', type: 'string' },
    { name: 'role', type: 'string' },
    { name: 'company', type: 'string' },
    { name: 'photo', type: 'image' },
  ]
}

// project - Renovation/development portfolio
{
  name: 'project',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'projectType', type: 'string', options: ['renovation', 'new-build', 'flip', 'development'] },
    { name: 'location', type: 'string' },
    { name: 'completionDate', type: 'date' },
    { name: 'summary', type: 'text' },
    { name: 'description', type: 'array', of: [{ type: 'block' }] },
    { name: 'featuredImage', type: 'image' },
    { name: 'gallery', type: 'array', of: [{ type: 'image' }] },
    // Before/After comparisons - key feature!
    { name: 'beforeAfterComparisons', type: 'array', of: [{
      type: 'object',
      name: 'comparison',
      fields: [
        { name: 'title', type: 'string' }, // e.g., "Kitchen", "Living Room"
        { name: 'beforeImage', type: 'image' },
        { name: 'afterImage', type: 'image' },
        { name: 'description', type: 'text' },
      ]
    }]},
    { name: 'stats', type: 'array', of: [{
      type: 'object',
      fields: [
        { name: 'label', type: 'string' }, // e.g., "ROI", "Days to Complete"
        { name: 'value', type: 'string' }, // e.g., "45%", "90 days"
      ]
    }]},
    { name: 'investmentAmount', type: 'number' },
    { name: 'returnOnInvestment', type: 'string' },
  ]
}
```

#### Investor Portal Content
```typescript
// investor - Investor profiles
{
  name: 'investor',
  type: 'document',
  fields: [
    { name: 'email', type: 'string', validation: required, unique },
    { name: 'name', type: 'string' },
    { name: 'company', type: 'string' },
    { name: 'phone', type: 'string' },
    { name: 'accreditedStatus', type: 'string', options: ['accredited', 'qualified', 'pending'] },
    { name: 'investmentPreferences', type: 'object', fields: [...] },
    { name: 'notes', type: 'text' }, // Admin notes
    { name: 'createdAt', type: 'datetime' },
    { name: 'lastLogin', type: 'datetime' },
  ]
}

// prospectus - Investment opportunities
{
  name: 'prospectus',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'status', type: 'string', options: ['draft', 'active', 'closed', 'archived'] },
    { name: 'propertyAddress', type: 'string' },
    { name: 'propertyType', type: 'string', options: [...] },
    { name: 'investmentAmount', type: 'number' },
    { name: 'targetReturn', type: 'string' },
    { name: 'holdPeriod', type: 'string' },
    { name: 'minimumInvestment', type: 'number' },
    { name: 'summary', type: 'text' },
    { name: 'content', type: 'array', of: [{ type: 'block' }] }, // Rich text
    { name: 'images', type: 'array', of: [{ type: 'image' }] },
    { name: 'documents', type: 'array', of: [{ type: 'file' }] }, // PDFs
    { name: 'financials', type: 'object', fields: [...] },
    { name: 'timeline', type: 'array', of: [{ type: 'milestone' }] },
    { name: 'sentTo', type: 'array', of: [{ type: 'reference', to: [{ type: 'investor' }] }] },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'closingDate', type: 'datetime' },
  ]
}

// investorInterest - Expression of interest
{
  name: 'investorInterest',
  type: 'document',
  fields: [
    { name: 'investor', type: 'reference', to: [{ type: 'investor' }] },
    { name: 'prospectus', type: 'reference', to: [{ type: 'prospectus' }] },
    { name: 'status', type: 'string', options: ['interested', 'reviewing', 'committed', 'passed'] },
    { name: 'intendedAmount', type: 'number' },
    { name: 'questions', type: 'text' },
    { name: 'createdAt', type: 'datetime' },
    { name: 'updatedAt', type: 'datetime' },
  ]
}

// letterOfIntent - LOI documents
{
  name: 'letterOfIntent',
  type: 'document',
  fields: [
    { name: 'investor', type: 'reference', to: [{ type: 'investor' }] },
    { name: 'prospectus', type: 'reference', to: [{ type: 'prospectus' }] },
    { name: 'interest', type: 'reference', to: [{ type: 'investorInterest' }] },
    { name: 'status', type: 'string', options: ['draft', 'sent', 'signed', 'countersigned', 'executed', 'expired'] },
    { name: 'investmentAmount', type: 'number' },
    { name: 'terms', type: 'array', of: [{ type: 'block' }] },
    { name: 'investorSignature', type: 'object', fields: [...] },
    { name: 'adminSignature', type: 'object', fields: [...] },
    { name: 'signedDocument', type: 'file' },
    { name: 'createdAt', type: 'datetime' },
    { name: 'expiresAt', type: 'datetime' },
  ]
}

// magicLink - For authentication
{
  name: 'magicLink',
  type: 'document',
  fields: [
    { name: 'email', type: 'string' },
    { name: 'token', type: 'string' },
    { name: 'expiresAt', type: 'datetime' },
    { name: 'used', type: 'boolean' },
    { name: 'createdAt', type: 'datetime' },
  ]
}
```

---

## 4. Feature Implementation Plan

### Phase 1: Foundation & Landing Page
**Duration: Sprint 1**

1. **Design System Setup**
   - Create Tailwind config with Luxury Presence tokens
   - Build base component library
   - Set up dark/light theme support

2. **Landing Page**
   - Announcement bar component
   - Navigation with dropdowns
   - Hero section with video/image background
   - Feature cards section
   - Stats section
   - Testimonials carousel
   - CTA sections
   - Footer

3. **Sanity Schema (Marketing)**
   - Site settings
   - Page builder components
   - Team members
   - Testimonials

### Phase 2: Marketing Pages
**Duration: Sprint 2**

1. **About Page**
2. **Services Pages** (Buyers, Sellers, Investors)
3. **Contact Page**
4. **SEO & Meta tags**

### Phase 3: Investor Portal - Authentication
**Duration: Sprint 3**

1. **Magic Link System**
   - Email service integration (Resend/SendGrid)
   - Token generation and validation
   - Session management
   - Investor onboarding flow

2. **Investor Schema**
   - Investor profiles
   - Access control

### Phase 4: Prospectus Management
**Duration: Sprint 4**

1. **Admin Side (Sanity Studio)**
   - Prospectus document type
   - Rich content editing
   - Document uploads
   - Investor list management
   - Send prospectus workflow

2. **Investor Side**
   - Prospectus list view
   - Prospectus detail page
   - Express interest form

### Phase 5: LOI Workflow
**Duration: Sprint 5**

1. **LOI Creation**
   - Template system
   - Pre-fill from interest

2. **E-Signature Integration**
   - DocuSign or custom signature
   - Status tracking

3. **Document Management**
   - PDF generation
   - Secure storage

### Phase 6: Polish & AI Features (Future)
**Duration: Sprint 6+**

1. **AI Prospectus Generation**
2. **Analytics Dashboard**
3. **Email Notifications**
4. **Mobile Optimization**

---

## 5. Parallel Development Strategy

### Sub-Agent Assignment

```
┌─────────────────────────────────────────────────────────────────┐
│                     PROJECT MANAGER AGENT                        │
│  - Coordinates all sub-agents                                    │
│  - Manages GitHub branches and PRs                               │
│  - Reviews and merges code                                       │
│  - Tracks progress against milestones                            │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ DESIGN AGENT  │    │ FRONTEND      │    │ BACKEND       │
│               │    │ AGENT         │    │ AGENT         │
│ Branch:       │    │ Branch:       │    │ Branch:       │
│ design/system │    │ feat/landing  │    │ feat/auth     │
│               │    │ feat/pages    │    │ feat/api      │
│ Tasks:        │    │               │    │               │
│ - Tailwind    │    │ Tasks:        │    │ Tasks:        │
│   config      │    │ - Components  │    │ - Magic links │
│ - Components  │    │ - Pages       │    │ - Sessions    │
│ - Animations  │    │ - Routing     │    │ - Sanity      │
│               │    │               │    │   mutations   │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                    ┌───────────────┐
                    │ SANITY AGENT  │
                    │               │
                    │ Branch:       │
                    │ feat/schema   │
                    │               │
                    │ Tasks:        │
                    │ - Schema      │
                    │   design      │
                    │ - Studio      │
                    │   customization│
                    │ - Content     │
                    │   modeling    │
                    └───────────────┘
```

### GitHub CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, 'feat/**', 'design/**']
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run typecheck

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
```

### Branch Strategy

```
main
├── design/system           # Design tokens, base components
├── feat/landing-page       # Landing page implementation
├── feat/navigation         # Header, footer, menus
├── feat/about-page         # About page
├── feat/services-pages     # Service pages
├── feat/contact-page       # Contact form
├── feat/sanity-schema      # All Sanity schema work
├── feat/investor-auth      # Magic link authentication
├── feat/investor-dashboard # Investor portal UI
├── feat/prospectus         # Prospectus viewing
├── feat/loi-workflow       # LOI management
└── feat/email-service      # Email notifications
```

---

## 6. Technology Stack

### Frontend
- **Framework**: React Router 7 (existing)
- **Styling**: Tailwind CSS 4 (existing)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **State**: React Query for server state

### Backend
- **CMS**: Sanity (existing)
- **Auth**: Custom magic link with sessions
- **Email**: Resend or SendGrid
- **File Storage**: Sanity assets / Cloudflare R2

### Infrastructure
- **Hosting**: Vercel (existing setup)
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics

---

## 7. Immediate Next Steps

1. **Create design system branch** with Tailwind config
2. **Build core UI components** (Button, Card, Section, etc.)
3. **Implement landing page** using frontend-design skill
4. **Set up Sanity schemas** for marketing content
5. **Create investor auth system** in parallel

---

## 8. Design References

Screenshots captured:
- `/docs/screenshots/luxury-presence-homepage.png`
- `/docs/screenshots/luxury-presence-portfolio.png`
- `/docs/screenshots/breitenbach-advisory.png`

Key design elements to replicate:
- Announcement bar with dismissable CTA
- Dark hero sections with serif headlines
- Gold accent color for CTAs
- Testimonial carousels
- Stats with large numbers
- Clean footer with newsletter signup
- Hover effects on cards
- Smooth scroll animations
