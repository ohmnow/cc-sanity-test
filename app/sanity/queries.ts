import groq from 'groq'

// Homepage singleton query - fetches all homepage data with expanded references
export const HOMEPAGE_QUERY = groq`*[_type == "homepage"][0]{
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
    "slug": slug.current,
    shortDescription,
    icon,
    category,
    ctaText,
    ctaLink,
    features
  },
  statsHeadline,
  stats,
  featuredProjectHeadline,
  featuredProjectSubheadline,
  "featuredProject": featuredProject->{
    _id,
    title,
    "slug": slug.current,
    beforeImage,
    afterImage,
    description,
    location,
    projectType
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
    "slug": slug.current,
    price,
    address,
    bedrooms,
    bathrooms,
    squareFeet,
    mainImage,
    status
  },
  ctaHeadline,
  ctaSubheadline,
  ctaButton
}`

// Site settings singleton query
export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
  siteName,
  tagline,
  logo,
  announcementBar,
  contact,
  social,
  footerText,
  footerLinks,
  stats
}`

// Properties queries
export const PROPERTIES_QUERY = groq`*[_type == "property"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  price,
  address,
  bedrooms,
  bathrooms,
  squareFeet,
  mainImage,
  status,
  propertyType,
  features,
  yearBuilt
}`

export const PROPERTY_QUERY = groq`*[_type == "property" && slug.current == $slug][0]{
  ...,
  "slug": slug.current,
  "agent": agent->{
    _id,
    name,
    role,
    image,
    email,
    phone
  }
}`

// Projects queries
export const PROJECTS_QUERY = groq`*[_type == "project"] | order(completedDate desc) {
  _id,
  title,
  "slug": slug.current,
  beforeImage,
  afterImage,
  description,
  projectType,
  location,
  completedDate,
  stats,
  roi,
  featured
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
  icon,
  category,
  features,
  ctaText,
  ctaLink
}`

export const SERVICE_QUERY = groq`*[_type == "service" && slug.current == $slug][0]{
  ...,
  "slug": slug.current
}`

// Testimonials query
export const TESTIMONIALS_QUERY = groq`*[_type == "testimonial"] | order(order asc) {
  _id,
  clientName,
  clientTitle,
  quote,
  rating,
  clientImage,
  serviceType,
  featured
}`

// Team members query
export const TEAM_MEMBERS_QUERY = groq`*[_type == "teamMember"] | order(order asc) {
  _id,
  name,
  "slug": slug.current,
  role,
  shortBio,
  image,
  email,
  phone,
  licenseNumber,
  specialties,
  social
}`

// Page query (for dynamic pages)
export const PAGE_QUERY = groq`*[_type == "page" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  sections,
  seo
}`
