import {CaseIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: CaseIcon,
  groups: [
    {name: 'details', title: 'Details'},
    {name: 'media', title: 'Before/After Media'},
    {name: 'stats', title: 'Stats & Results'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'details',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
      group: 'details',
    }),
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          {title: 'Complete Renovation', value: 'complete-renovation'},
          {title: 'Kitchen & Bath Remodel', value: 'kitchen-bath'},
          {title: 'Addition & Renovation', value: 'addition'},
          {title: 'Luxury Renovation', value: 'luxury'},
          {title: 'Investment Property', value: 'investment'},
          {title: 'New Development', value: 'new-development'},
        ],
      },
      group: 'details',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g., Pacific Heights, San Francisco',
      group: 'details',
    }),
    defineField({
      name: 'squareFeet',
      title: 'Square Feet',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'completedDate',
      title: 'Completion Date',
      type: 'date',
      group: 'details',
    }),
    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'text',
      rows: 4,
      group: 'details',
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      group: 'details',
    }),
    defineField({
      name: 'beforeImage',
      title: 'Before Image',
      type: 'image',
      options: {hotspot: true},
      group: 'media',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }),
      ],
    }),
    defineField({
      name: 'afterImage',
      title: 'After Image',
      type: 'image',
      options: {hotspot: true},
      group: 'media',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Project Gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
            defineField({name: 'caption', type: 'string', title: 'Caption'}),
            defineField({
              name: 'category',
              type: 'string',
              title: 'Category',
              options: {
                list: ['Before', 'During', 'After'],
              },
            }),
          ],
        }),
      ],
      group: 'media',
    }),
    defineField({
      name: 'stats',
      title: 'Project Stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', type: 'string', title: 'Label'}),
            defineField({name: 'value', type: 'string', title: 'Value'}),
          ],
          preview: {
            select: {title: 'label', subtitle: 'value'},
          },
        }),
      ],
      group: 'stats',
    }),
    defineField({
      name: 'roi',
      title: 'Return on Investment',
      type: 'string',
      description: 'e.g., 42%',
      group: 'stats',
    }),
    defineField({
      name: 'timeline',
      title: 'Project Timeline',
      type: 'string',
      description: 'e.g., 8 months',
      group: 'stats',
    }),
    defineField({
      name: 'budget',
      title: 'Budget',
      type: 'string',
      description: 'e.g., $850K',
      group: 'stats',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      description: 'Show on homepage',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      location: 'location',
      type: 'projectType',
      media: 'afterImage',
    },
    prepare({title, location, type, media}) {
      return {
        title,
        subtitle: [type, location].filter(Boolean).join(' • '),
        media,
      }
    },
  },
})
