import {
  defineLocations,
  type PresentationPluginOptions,
} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    // Homepage singleton
    homepage: defineLocations({
      select: {},
      resolve: () => ({
        locations: [{title: 'Homepage', href: `/`}],
      }),
    }),
    // Properties
    property: defineLocations({
      select: {
        title: 'title',
        slug: 'slug.current',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled Property',
            href: `/properties/${doc?.slug}`,
          },
          {title: 'All Properties', href: `/properties`},
        ],
      }),
    }),
    // Projects
    project: defineLocations({
      select: {
        title: 'title',
        slug: 'slug.current',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled Project',
            href: `/projects/${doc?.slug}`,
          },
          {title: 'All Projects', href: `/projects`},
        ],
      }),
    }),
    // Services
    service: defineLocations({
      select: {
        title: 'title',
        slug: 'slug.current',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled Service',
            href: `/services/${doc?.slug}`,
          },
          {title: 'All Services', href: `/services`},
        ],
      }),
    }),
    // Pages
    page: defineLocations({
      select: {
        title: 'title',
        slug: 'slug.current',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled Page',
            href: `/${doc?.slug}`,
          },
        ],
      }),
    }),
  },
}
