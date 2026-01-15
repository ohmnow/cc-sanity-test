import {homepageType} from '~/sanity/schemaTypes/homepageType'
import {investorType} from '~/sanity/schemaTypes/investorType'
import {leadType} from '~/sanity/schemaTypes/leadType'
import {letterOfIntentType} from '~/sanity/schemaTypes/letterOfIntentType'
import {pageBlockTypes} from '~/sanity/schemaTypes/pageBlockTypes'
import {pageType} from '~/sanity/schemaTypes/pageType'
import {projectType} from '~/sanity/schemaTypes/projectType'
import {propertyType} from '~/sanity/schemaTypes/propertyType'
import {prospectusType} from '~/sanity/schemaTypes/prospectusType'
import {serviceType} from '~/sanity/schemaTypes/serviceType'
import {siteSettingsType} from '~/sanity/schemaTypes/siteSettingsType'
import {teamMemberType} from '~/sanity/schemaTypes/teamMemberType'
import {testimonialType} from '~/sanity/schemaTypes/testimonialType'

export default [
  // Golden Gate Home Advisors types
  propertyType,
  projectType,
  testimonialType,
  teamMemberType,
  serviceType,
  siteSettingsType,
  leadType,
  // CMS Page types
  homepageType,
  pageType,
  ...pageBlockTypes,
  // Investor portal types
  investorType,
  prospectusType,
  letterOfIntentType,
]
