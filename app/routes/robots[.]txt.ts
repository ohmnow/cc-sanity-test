export async function loader() {
  const baseUrl = 'https://goldengateadvisors.com'

  const robotsTxt = `# Golden Gate Home Advisors Robots.txt
User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /studio/
Disallow: /investor/
Disallow: /resource/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for polite bots
Crawl-delay: 1
`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
