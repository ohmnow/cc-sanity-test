import groq from 'groq'

// Homepage singleton query
export const HOMEPAGE_QUERY = groq`*[_id == "homepage"][0]{
  announcementBar,
  heroHeadline,
  heroSubheadline,
  heroImage,
  heroPrimaryCta,
  heroSecondaryCta,
  servicesHeadline,
  servicesSubheadline,
  "featuredServices": featuredServices[]->{
    _id,
    title,
    slug,
    shortDescription,
    icon
  },
  statsHeadline,
  stats,
  featuredProjectHeadline,
  featuredProjectSubheadline,
  "featuredProject": featuredProject->{
    _id,
    title,
    slug,
    beforeImage,
    afterImage,
    shortDescription
  },
  testimonialsHeadline,
  testimonialsSubheadline,
  "featuredTestimonials": featuredTestimonials[]->{
    _id,
    clientName,
    clientTitle,
    quote,
    rating,
    clientImage
  },
  propertiesHeadline,
  propertiesSubheadline,
  "featuredProperties": featuredProperties[]->{
    _id,
    title,
    slug,
    price,
    address,
    bedrooms,
    bathrooms,
    squareFeet,
    featuredImage,
    status
  },
  ctaHeadline,
  ctaSubheadline,
  ctaButton
}`

// Site settings query
export const SITE_SETTINGS_QUERY = groq`*[_id == "siteSettings"][0]{
  siteName,
  siteDescription,
  logo,
  contactEmail,
  contactPhone,
  address,
  socialLinks
}`

// Properties queries
export const PROPERTIES_QUERY = groq`*[_type == "property"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  price,
  address,
  bedrooms,
  bathrooms,
  squareFeet,
  featuredImage,
  status,
  propertyType
}`

export const PROPERTY_QUERY = groq`*[_type == "property" && slug.current == $slug][0]{
  ...,
  "slug": slug.current
}`

// Projects queries
export const PROJECTS_QUERY = groq`*[_type == "project"] | order(completionDate desc) {
  _id,
  title,
  "slug": slug.current,
  beforeImage,
  afterImage,
  shortDescription,
  projectType,
  completionDate
}`

export const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0]{
  ...,
  "slug": slug.current
}`

// Services queries
export const SERVICES_QUERY = groq`*[_type == "service"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  icon
}`

export const SERVICE_QUERY = groq`*[_type == "service" && slug.current == $slug][0]{
  ...,
  "slug": slug.current
}`

// Testimonials query
export const TESTIMONIALS_QUERY = groq`*[_type == "testimonial"] | order(date desc) {
  _id,
  clientName,
  clientTitle,
  quote,
  rating,
  clientImage,
  featured
}`

// Team members query
export const TEAM_MEMBERS_QUERY = groq`*[_type == "teamMember"] | order(order asc) {
  _id,
  name,
  role,
  bio,
  photo,
  email,
  phone
}`

// Page query (for dynamic pages)
export const PAGE_QUERY = groq`*[_type == "page" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  sections,
  seo
}`
