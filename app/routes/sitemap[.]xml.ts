import {getViewClient} from '~/sanity/client.server'

const SITEMAP_QUERY = `{
  "properties": *[_type == "property" && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt
  },
  "projects": *[_type == "project" && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt
  },
  "services": *[_type == "service" && defined(slug)]{
    slug,
    _updatedAt
  }
}`

interface SitemapData {
  properties: Array<{slug: string; _updatedAt: string}>
  projects: Array<{slug: string; _updatedAt: string}>
  services: Array<{slug: string; _updatedAt: string}>
}

export async function loader() {
  const baseUrl = 'https://goldengateadvisors.com'

  // Static pages
  const staticPages = [
    {url: '/', priority: '1.0', changefreq: 'weekly'},
    {url: '/about', priority: '0.8', changefreq: 'monthly'},
    {url: '/services', priority: '0.8', changefreq: 'monthly'},
    {url: '/properties', priority: '0.9', changefreq: 'daily'},
    {url: '/projects', priority: '0.7', changefreq: 'weekly'},
    {url: '/testimonials', priority: '0.6', changefreq: 'monthly'},
    {url: '/contact', priority: '0.7', changefreq: 'monthly'},
    {url: '/get-started', priority: '0.8', changefreq: 'monthly'},
    {url: '/get-started/buyer', priority: '0.7', changefreq: 'monthly'},
    {url: '/get-started/seller', priority: '0.7', changefreq: 'monthly'},
    {url: '/get-started/investor', priority: '0.7', changefreq: 'monthly'},
  ]

  // Fetch dynamic content from Sanity
  let dynamicData: SitemapData = {properties: [], projects: [], services: []}
  try {
    dynamicData = await getViewClient().fetch<SitemapData>(SITEMAP_QUERY)
  } catch (error) {
    console.error('Error fetching sitemap data:', error)
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
  ${dynamicData.properties
    .map(
      (property) => `
  <url>
    <loc>${baseUrl}/properties/${property.slug}</loc>
    <lastmod>${property._updatedAt.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
  ${dynamicData.projects
    .map(
      (project) => `
  <url>
    <loc>${baseUrl}/projects/${project.slug}</loc>
    <lastmod>${project._updatedAt.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('')}
  ${dynamicData.services
    .map(
      (service) => `
  <url>
    <loc>${baseUrl}/services/${service.slug}</loc>
    <lastmod>${service._updatedAt.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
</urlset>`

  return new Response(sitemap.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
