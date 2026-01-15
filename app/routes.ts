import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from '@react-router/dev/routes'

export default [
  // Marketing website layout
  layout('./routes/marketing/layout.tsx', [
    index('./routes/marketing/index.tsx'),
    route('about', './routes/marketing/about.tsx'),
    route('services', './routes/marketing/services.tsx'),
    route('services/:service', './routes/marketing/services.$service.tsx'),
    route('properties', './routes/marketing/properties.tsx'),
    route('properties/:id', './routes/marketing/properties.$id.tsx'),
    route('projects', './routes/marketing/projects.tsx'),
    route('testimonials', './routes/marketing/testimonials.tsx'),
    route('contact', './routes/marketing/contact.tsx'),
    route('get-started', './routes/marketing/get-started/index.tsx'),
    route('get-started/:type', './routes/marketing/get-started/$type.tsx'),
    route('get-started/success', './routes/marketing/get-started/success.tsx'),
  ]),
  // Sanity Studio
  route('studio/*', 'routes/studio.tsx'),
  // Resource routes
  ...prefix('resource', [
    route('og', './routes/resource/og.ts'),
    route('preview', './routes/resource/preview.ts'),
    route('toggle-theme', './routes/resource/toggle-theme.ts'),
    route('lead', './routes/resource/lead.ts'),
  ]),
] satisfies RouteConfig
