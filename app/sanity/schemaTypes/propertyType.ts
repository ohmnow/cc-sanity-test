import {HomeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const propertyType = defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'details', title: 'Details'},
    {name: 'features', title: 'Features'},
    {name: 'media', title: 'Media'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Property Title',
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
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Available', value: 'available'},
          {title: 'Under Contract', value: 'under-contract'},
          {title: 'Sold', value: 'sold'},
          {title: 'Coming Soon', value: 'coming-soon'},
        ],
        layout: 'radio',
      },
      initialValue: 'available',
      group: 'details',
    }),
    defineField({
      name: 'propertyType',
      title: 'Property Type',
      type: 'string',
      options: {
        list: [
          {title: 'Single Family', value: 'single-family'},
          {title: 'Condo', value: 'condo'},
          {title: 'Townhouse', value: 'townhouse'},
          {title: 'Multi-Unit', value: 'multi-unit'},
          {title: 'Land', value: 'land'},
        ],
      },
      group: 'details',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (rule) => rule.positive(),
      group: 'details',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      group: 'details',
      fields: [
        defineField({name: 'street', type: 'string', title: 'Street Address'}),
        defineField({name: 'city', type: 'string', title: 'City'}),
        defineField({name: 'neighborhood', type: 'string', title: 'Neighborhood'}),
        defineField({name: 'state', type: 'string', title: 'State', initialValue: 'CA'}),
        defineField({name: 'zip', type: 'string', title: 'ZIP Code'}),
      ],
    }),
    defineField({
      name: 'bedrooms',
      title: 'Bedrooms',
      type: 'number',
      validation: (rule) => rule.min(0).integer(),
      group: 'features',
    }),
    defineField({
      name: 'bathrooms',
      title: 'Bathrooms',
      type: 'number',
      validation: (rule) => rule.min(0),
      group: 'features',
    }),
    defineField({
      name: 'squareFeet',
      title: 'Square Feet',
      type: 'number',
      validation: (rule) => rule.positive().integer(),
      group: 'features',
    }),
    defineField({
      name: 'yearBuilt',
      title: 'Year Built',
      type: 'number',
      validation: (rule) => rule.min(1800).max(new Date().getFullYear() + 1).integer(),
      group: 'features',
    }),
    defineField({
      name: 'features',
      title: 'Property Features',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      group: 'features',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      group: 'details',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {hotspot: true},
      group: 'media',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (rule) => rule.required().warning('Alt text is important for SEO'),
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
            defineField({name: 'caption', type: 'string', title: 'Caption'}),
          ],
        }),
      ],
      group: 'media',
    }),
    defineField({
      name: 'agent',
      title: 'Listing Agent',
      type: 'reference',
      to: [{type: 'teamMember'}],
      group: 'details',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      neighborhood: 'address.neighborhood',
      price: 'price',
      media: 'mainImage',
    },
    prepare({title, neighborhood, price, media}) {
      const formattedPrice = price
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(price)
        : ''
      return {
        title,
        subtitle: [neighborhood, formattedPrice].filter(Boolean).join(' • '),
        media,
      }
    },
  },
})
