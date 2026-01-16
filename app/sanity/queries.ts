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

// Prospectus queries (Investor Portal)
export const PROSPECTUSES_QUERY = groq`*[_type == "prospectus" && status in ["open", "subscribed"]] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  status,
  projectType,
  summary,
  propertyAddress,
  coverImage,
  totalRaise,
  minimumInvestment,
  targetReturn,
  projectedTimeline,
  accessLevel,
  closeDate
}`

export const PROSPECTUS_QUERY = groq`*[_type == "prospectus" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  status,
  projectType,
  summary,
  description,
  propertyAddress,
  coverImage,
  gallery,
  totalRaise,
  minimumInvestment,
  targetReturn,
  projectedTimeline,
  distributionSchedule,
  financialHighlights,
  documents,
  accessLevel,
  closeDate,
  "invitedInvestorIds": invitedInvestors[]._ref,
  "relatedProject": relatedProject->{
    _id,
    title,
    "slug": slug.current,
    beforeImage,
    afterImage
  }
}`

// Letter of Intent queries
export const INVESTOR_LOIS_QUERY = groq`*[_type == "letterOfIntent" && investor._ref == $investorId] | order(submittedAt desc) {
  _id,
  investmentAmount,
  status,
  submittedAt,
  reviewedAt,
  "prospectus": prospectus->{
    _id,
    title,
    "slug": slug.current,
    coverImage,
    targetReturn
  }
}`

export const LOI_QUERY = groq`*[_type == "letterOfIntent" && _id == $loiId][0]{
  _id,
  investmentAmount,
  status,
  submittedAt,
  reviewedAt,
  investorNotes,
  investorSignature,
  companySignature,
  "investor": investor->{
    _id,
    name,
    email
  },
  "prospectus": prospectus->{
    _id,
    title,
    "slug": slug.current,
    coverImage,
    totalRaise,
    minimumInvestment,
    targetReturn
  }
}`

// Get investor by Clerk ID
export const INVESTOR_BY_CLERK_ID_QUERY = groq`*[_type == "investor" && clerkId == $clerkId][0]{
  _id,
  name,
  email,
  phone,
  company,
  accreditedStatus,
  investmentCapacity,
  investmentInterests,
  status
}`
