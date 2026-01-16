# Feature Roadmap - Golden Gate Home Advisors

**Last Updated:** January 15, 2026
**Current Status:** Sprint 7 complete - Security & Polish

---

## Current State Summary

### ✅ Fully Implemented (Production Ready)
| Feature | Score | Notes |
|---------|-------|-------|
| Marketing Website | 9/10 | All pages, responsive, SEO-ready |
| Lead Capture System | 10/10 | Multi-type forms, admin management, email notifications |
| Content Management | 10/10 | Sanity Studio with Visual Editing |
| Admin Dashboard | 9/10 | Leads, investors, LOIs management with email notifications |
| Email System | 10/10 | Resend.io - LOI submission, status updates, lead notifications |
| Security | 9/10 | Clerk webhook Svix verified, rate limiting, Sentry error tracking |
| Investor Portal | 8/10 | Profile editing, LOI submission, opportunity browsing |

### 🟡 Partially Implemented
| Feature | Score | Gap |
|---------|-------|-----|
| PDF Generation | 7/10 | Works but needs design polish |

### ❌ Not Implemented
- Payment processing (Stripe)
- E-signatures (DocuSign)
- Map integration (Google Maps)
- MLS/IDX integration
- Advanced property search/filters

---

## Priority Tiers

### 🔴 P0 - Critical (Security/Compliance)
~~Must fix before accepting real investors.~~ **✅ COMPLETED in Sprint 7**

| Task | Complexity | Status |
|------|------------|--------|
| ~~Implement Clerk webhook Svix verification~~ | Low | ✅ Done |
| ~~Add rate limiting to lead forms~~ | Low | ✅ Done |
| ~~Add error tracking (Sentry)~~ | Low | ✅ Done |

### 🟠 P1 - High Priority (Core Functionality)
Features needed for real business operations.

| Task | Complexity | Business Value |
|------|------------|----------------|
| **Property search filters** | Medium | Users can't find properties by criteria |
| **Google Maps integration** | Medium | Properties need location context |
| **Mortgage calculator** | Low | Standard buyer tool |
| **Email sequence automation** | Medium | Nurture leads automatically |
| ~~**Investor profile completion**~~ | Low | ✅ Done in Sprint 7 |
| **LOI countersigning workflow** | Medium | Admin can approve but can't sign |

### 🟡 P2 - Medium Priority (Enhanced Experience)
Improve user experience and conversions.

| Task | Complexity | Benefit |
|------|------------|---------|
| Property comparison tool | Medium | Help buyers decide |
| Saved properties / favorites | Low | Engagement feature |
| Virtual tour embeds | Low | Better property showcase |
| Blog / content marketing | Low | SEO, thought leadership |
| Testimonial request automation | Low | Grow social proof |
| Advanced admin analytics | Medium | Business insights |

### 🟢 P3 - Future (Full Platform)
Features for scaling to full real estate platform.

| Task | Complexity | Notes |
|------|------------|-------|
| MLS/IDX integration | High | Real-time listings data |
| Stripe payment processing | High | Actually collect investments |
| DocuSign integration | Medium | Legal e-signatures |
| Investor K-1 documents | Medium | Tax compliance |
| Multi-user admin with roles | Medium | Team scaling |
| CRM system | High | Replace basic lead management |
| Accreditation verification service | High | SEC compliance |

---

## Recommended Sprint Plan

### Sprint 7: Security & Polish ✅ COMPLETED
**Goal:** Production-ready for real traffic

- [x] Fix Clerk webhook Svix verification - Proper signature validation with `svix` library
- [x] Add rate limiting to form submissions - In-memory rate limiter for leads (5/min) and LOIs (3/5min)
- [x] Review and fix any hardcoded values - Funding progress now calculates from approved LOIs
- [x] Test all email notifications end-to-end - Added admin LOI status update emails to investors
- [x] Add error tracking (Sentry) - Client & server initialization with session replay
- [x] Complete investor profile page - Edit phone, company, investment capacity, interests

**Learnings:**
- React Router 7 strictly enforces server/client code splitting - use `entry.server.tsx` for server-only init
- Dynamic imports required for Sentry in error boundaries
- GROQ `math::sum()` and `count()` work great for aggregating LOI data

### Sprint 8: Property Discovery (2-3 days)
**Goal:** Users can actually find properties they want

- [ ] Property search with filters (price, beds, baths, type)
- [ ] Google Maps integration on property pages
- [ ] Map view of all properties
- [ ] Mortgage calculator widget
- [ ] Property inquiry form (contact agent about specific property)

### Sprint 9: Lead Nurturing (2-3 days)
**Goal:** Convert more leads to clients

- [ ] Email sequence automation (welcome series)
- [ ] Lead scoring based on activity
- [ ] Automated follow-up reminders for admin
- [ ] Blog section for content marketing
- [ ] Newsletter signup and management

### Sprint 10: Investor Experience (3-4 days)
**Goal:** Complete investor journey

- [ ] Full investor profile with accreditation upload
- [ ] LOI countersigning workflow for admin
- [ ] Investment tracking dashboard for investors
- [ ] Document library (legal docs, past K-1s, etc.)
- [ ] Investor communications/updates section

### Future Sprints
- Payment processing integration
- E-signature integration
- MLS/IDX integration
- Advanced analytics
- Mobile app (React Native)

---

## Technical Debt to Address

| Item | Priority | Notes |
|------|----------|-------|
| ~~Remove hardcoded 70% funding progress~~ | ~~P0~~ | ✅ Fixed - calculates from LOI data |
| Admin password defaults to 'admin123' | P1 | Security anti-pattern |
| Resend silently fails if not configured | P2 | Should show config warning |
| Some TypeScript `any` types | P2 | Improve type safety |
| Missing loading states on some pages | P2 | UX improvement |
| Inconsistent error handling | P2 | Standardize error UI - Sentry now captures errors |

---

## Content Needed from Client

To make this a real business site, need:

1. **Real property listings** - Photos, descriptions, prices, addresses
2. **Team member bios** - Photos, credentials, contact info
3. **Project portfolio** - Before/after photos, descriptions
4. **Client testimonials** - Real quotes with permission
5. **Service descriptions** - Detailed service offerings
6. **Investment prospectuses** - Real investment opportunities (if applicable)
7. **Legal documents** - Terms of service, privacy policy, disclaimers
8. **Brand assets** - Final logo, brand colors, fonts

---

## Decision Points

Before continuing development, decisions needed:

1. **Payment Processing**
   - Will this site actually collect investment money?
   - If yes: Need Stripe, banking integration, SEC compliance review
   - If no: Can simplify to lead generation only

2. **Investor Portal Scope**
   - Full investment platform with K-1s, distributions?
   - Or just lead qualification for off-platform investment?

3. **MLS Integration**
   - Use real MLS data or manual property entry?
   - Budget for IDX provider ($50-500/month)?

4. **Domain & Branding**
   - Final domain name?
   - SSL certificate setup?
   - Email domain for transactional emails?

---

## Quick Wins (< 1 hour each)

Easy improvements that add value:

- [ ] Add loading spinners to all forms
- [ ] Add "Back to top" button on long pages
- [ ] Add breadcrumb navigation
- [ ] Add 404 page with helpful links
- [ ] Add print styles for property pages
- [ ] Add social sharing buttons to properties
- [ ] Add schema.org structured data for SEO
- [ ] Add Google Analytics / Plausible
