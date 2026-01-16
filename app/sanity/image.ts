import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/asset-utils'
import type {ImageUrlBuilder} from '@sanity/image-url/lib/types/builder'
import {projectDetails} from '~/sanity/projectDetails'

// Lazy builder initialization
let _builder: ImageUrlBuilder | null = null
function getBuilder(): ImageUrlBuilder {
  if (!_builder) {
    const {projectId, dataset} = projectDetails()
    _builder = imageUrlBuilder({projectId, dataset})
  }
  return _builder
}

export function urlFor(source: SanityImageSource) {
  return getBuilder().image(source)
}
