import {HomeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const homepageType = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero Section'},
    {name: 'services', title: 'Services'},
    {name: 'stats', title: 'Statistics'},
    {name: 'featured', title: 'Featured Content'},
    {name: 'cta', title: 'Call to Action'},
  ],
  fields: [
    // Announcement Bar
    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar',
      type: 'object',
      fields: [
        defineField({name: 'enabled', type: 'boolean', title: 'Show Announcement Bar', initialValue: true}),
        defineField({name: 'text', type: 'string', title: 'Announcement Text'}),
        defineField({name: 'linkText', type: 'string', title: 'Link Text'}),
        defineField({name: 'linkUrl', type: 'string', title: 'Link URL'}),
      ],
    }),

    // Hero Section
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {hotspot: true},
      group: 'hero',
    }),
    defineField({
      name: 'heroPrimaryCta',
      title: 'Primary CTA',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({name: 'text', type: 'string', title: 'Button Text'}),
        defineField({name: 'url', type: 'string', title: 'Button URL'}),
      ],
    }),
    defineField({
      name: 'heroSecondaryCta',
      title: 'Secondary CTA',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({name: 'text', type: 'string', title: 'Button Text'}),
        defineField({name: 'url', type: 'string', title: 'Button URL'}),
      ],
    }),

    // Services Section
    defineField({
      name: 'servicesHeadline',
      title: 'Services Section Headline',
      type: 'string',
      group: 'services',
    }),
    defineField({
      name: 'servicesSubheadline',
      title: 'Services Section Subheadline',
      type: 'text',
      rows: 2,
      group: 'services',
    }),
    defineField({
      name: 'featuredServices',
      title: 'Featured Services',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
      group: 'services',
      validation: (rule) => rule.max(4),
    }),

    // Stats Section
    defineField({
      name: 'statsHeadline',
      title: 'Stats Section Headline',
      type: 'string',
      group: 'stats',
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'value', type: 'string', title: 'Value', description: 'e.g., $50M+, 150+, 98%'}),
            defineField({name: 'label', type: 'string', title: 'Label', description: 'e.g., Transaction Volume'}),
          ],
          preview: {
            select: {value: 'value', label: 'label'},
            prepare({value, label}) {
              return {title: value, subtitle: label}
            },
          },
        }),
      ],
      group: 'stats',
      validation: (rule) => rule.max(6),
    }),

    // Featured Project (Before/After Showcase)
    defineField({
      name: 'featuredProjectHeadline',
      title: 'Featured Project Headline',
      type: 'string',
      group: 'featured',
    }),
    defineField({
      name: 'featuredProjectSubheadline',
      title: 'Featured Project Subheadline',
      type: 'text',
      rows: 2,
      group: 'featured',
    }),
    defineField({
      name: 'featuredProject',
      title: 'Featured Project',
      type: 'reference',
      to: [{type: 'project'}],
      group: 'featured',
    }),

    // Testimonials Section
    defineField({
      name: 'testimonialsHeadline',
      title: 'Testimonials Headline',
      type: 'string',
      group: 'featured',
    }),
    defineField({
      name: 'testimonialsSubheadline',
      title: 'Testimonials Subheadline',
      type: 'text',
      rows: 2,
      group: 'featured',
    }),
    defineField({
      name: 'featuredTestimonials',
      title: 'Featured Testimonials',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'testimonial'}]})],
      group: 'featured',
      validation: (rule) => rule.max(6),
    }),

    // Properties Section
    defineField({
      name: 'propertiesHeadline',
      title: 'Properties Section Headline',
      type: 'string',
      group: 'featured',
    }),
    defineField({
      name: 'propertiesSubheadline',
      title: 'Properties Section Subheadline',
      type: 'text',
      rows: 2,
      group: 'featured',
    }),
    defineField({
      name: 'featuredProperties',
      title: 'Featured Properties',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'property'}]})],
      group: 'featured',
      validation: (rule) => rule.max(4),
    }),

    // Final CTA Section
    defineField({
      name: 'ctaHeadline',
      title: 'CTA Section Headline',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubheadline',
      title: 'CTA Section Subheadline',
      type: 'text',
      rows: 2,
      group: 'cta',
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      group: 'cta',
      fields: [
        defineField({name: 'text', type: 'string', title: 'Button Text'}),
        defineField({name: 'url', type: 'string', title: 'Button URL'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage',
        subtitle: 'Main landing page content',
      }
    },
  },
})
