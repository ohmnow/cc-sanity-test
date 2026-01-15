import {CommentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'clientTitle',
      title: 'Client Title/Role',
      type: 'string',
      description: 'e.g., Homeowner, Investor, First-time Buyer',
    }),
    defineField({
      name: 'clientImage',
      title: 'Client Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }),
      ],
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (rule) => rule.min(1).max(5).integer(),
      initialValue: 5,
    }),
    defineField({
      name: 'serviceType',
      title: 'Service Type',
      type: 'string',
      options: {
        list: [
          {title: 'Buying', value: 'buying'},
          {title: 'Selling', value: 'selling'},
          {title: 'Investment', value: 'investment'},
          {title: 'Renovation', value: 'renovation'},
        ],
      },
    }),
    defineField({
      name: 'project',
      title: 'Related Project',
      type: 'reference',
      to: [{type: 'project'}],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on homepage carousel',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  preview: {
    select: {
      title: 'clientName',
      subtitle: 'quote',
      media: 'clientImage',
    },
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: subtitle?.slice(0, 60) + (subtitle?.length > 60 ? '...' : ''),
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
