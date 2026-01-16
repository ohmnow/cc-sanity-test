import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from '@react-router/dev/routes'

export default [
  // SEO routes
  route('sitemap.xml', './routes/sitemap[.]xml.ts'),
  route('robots.txt', './routes/robots[.]txt.ts'),
  // Marketing website layout
  layout('./routes/marketing/layout.tsx', [
    index('./routes/marketing/index.tsx'),
    route('about', './routes/marketing/about.tsx'),
    route('services', './routes/marketing/services.tsx'),
    route('services/:service', './routes/marketing/services.$service.tsx'),
    route('properties', './routes/marketing/properties.tsx'),
    route('properties/:id', './routes/marketing/properties.$id.tsx'),
    route('projects', './routes/marketing/projects.tsx'),
    route('projects/:slug', './routes/marketing/projects.$slug.tsx'),
    route('testimonials', './routes/marketing/testimonials.tsx'),
    route('contact', './routes/marketing/contact.tsx'),
    route('get-started', './routes/marketing/get-started/index.tsx'),
    route('get-started/:type', './routes/marketing/get-started/$type.tsx'),
    route('get-started/success', './routes/marketing/get-started/success.tsx'),
  ]),
  // Investor Portal (Clerk protected)
  layout('./routes/investor/layout.tsx', [
    route('investor/dashboard', './routes/investor/dashboard.tsx'),
    route('investor/profile', './routes/investor/profile.tsx'),
    route('investor/lois', './routes/investor/lois.tsx'),
    route('investor/opportunities', './routes/investor/opportunities/index.tsx'),
    route('investor/opportunities/:slug', './routes/investor/opportunities/$slug.tsx'),
    route('investor/opportunities/:slug/loi', './routes/investor/opportunities/$slug.loi.tsx'),
  ]),
  // Investor Auth (public routes)
  route('investor/auth/sign-in/*', './routes/investor/auth/sign-in.tsx'),
  route('investor/auth/sign-up/*', './routes/investor/auth/sign-up.tsx'),
  // Admin Portal (password protected)
  route('admin/login', './routes/admin/login.tsx'),
  route('admin/logout', './routes/admin/logout.ts'),
  layout('./routes/admin/layout.tsx', [
    route('admin', './routes/admin/index.tsx'),
    route('admin/leads', './routes/admin/leads.tsx'),
    route('admin/investors', './routes/admin/investors.tsx'),
    route('admin/lois', './routes/admin/lois.tsx'),
    route('admin/lois/:id/countersign', './routes/admin/lois.$id.countersign.tsx'),
    route('admin/accreditation', './routes/admin/accreditation.tsx'),
  ]),
  // Sanity Studio
  route('studio/*', 'routes/studio.tsx'),
  // Resource routes
  ...prefix('resource', [
    route('og', './routes/resource/og.ts'),
    route('preview', './routes/resource/preview.ts'),
    route('toggle-theme', './routes/resource/toggle-theme.ts'),
    route('lead', './routes/resource/lead.ts'),
    route('clerk-webhook', './routes/resource/clerk-webhook.ts'),
    route('submit-loi', './routes/resource/submit-loi.ts'),
    route('countersign-loi', './routes/resource/countersign-loi.ts'),
    route('upload-accreditation', './routes/resource/upload-accreditation.ts'),
    route('pdf/prospectus/:id', './routes/resource/pdf/prospectus.$id.ts'),
    route('pdf/loi/:id', './routes/resource/pdf/loi.$id.ts'),
  ]),
] satisfies RouteConfig
