import {DocumentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const prospectusType = defineType({
  name: 'prospectus',
  title: 'Prospectus',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'details', title: 'Details'},
    {name: 'financials', title: 'Financials'},
    {name: 'documents', title: 'Documents'},
    {name: 'access', title: 'Access Control'},
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
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Open for Investment', value: 'open'},
          {title: 'Fully Subscribed', value: 'subscribed'},
          {title: 'In Progress', value: 'in-progress'},
          {title: 'Completed', value: 'completed'},
          {title: 'Closed', value: 'closed'},
        ],
      },
      initialValue: 'draft',
      group: 'details',
    }),
    defineField({
      name: 'projectType',
      title: 'Investment Type',
      type: 'string',
      options: {
        list: [
          {title: 'Fix & Flip', value: 'fix-flip'},
          {title: 'Development', value: 'development'},
          {title: 'Buy & Hold', value: 'buy-hold'},
          {title: 'Syndication', value: 'syndication'},
        ],
      },
      group: 'details',
    }),
    defineField({
      name: 'summary',
      title: 'Executive Summary',
      type: 'text',
      rows: 4,
      group: 'details',
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      group: 'details',
    }),
    defineField({
      name: 'propertyAddress',
      title: 'Property Address',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      group: 'details',
    }),
    defineField({
      name: 'gallery',
      title: 'Property Gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'caption', type: 'string', title: 'Caption'})],
        }),
      ],
      group: 'details',
    }),
    defineField({
      name: 'totalRaise',
      title: 'Total Raise Amount',
      type: 'number',
      description: 'Total investment being raised',
      group: 'financials',
    }),
    defineField({
      name: 'minimumInvestment',
      title: 'Minimum Investment',
      type: 'number',
      group: 'financials',
    }),
    defineField({
      name: 'targetReturn',
      title: 'Target Return',
      type: 'string',
      description: 'e.g., 18-22% IRR',
      group: 'financials',
    }),
    defineField({
      name: 'projectedTimeline',
      title: 'Projected Timeline',
      type: 'string',
      description: 'e.g., 12-18 months',
      group: 'financials',
    }),
    defineField({
      name: 'distributionSchedule',
      title: 'Distribution Schedule',
      type: 'string',
      description: 'e.g., Quarterly, At Exit',
      group: 'financials',
    }),
    defineField({
      name: 'financialHighlights',
      title: 'Financial Highlights',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', type: 'string', title: 'Label'}),
            defineField({name: 'value', type: 'string', title: 'Value'}),
          ],
        }),
      ],
      group: 'financials',
    }),
    defineField({
      name: 'documents',
      title: 'Investment Documents',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', title: 'Document Title'}),
            defineField({name: 'file', type: 'file', title: 'File'}),
            defineField({
              name: 'documentType',
              type: 'string',
              title: 'Document Type',
              options: {
                list: [
                  'Prospectus',
                  'Subscription Agreement',
                  'Operating Agreement',
                  'PPM',
                  'Financial Projections',
                  'Property Report',
                  'Other',
                ],
              },
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'documentType'},
          },
        }),
      ],
      group: 'documents',
    }),
    defineField({
      name: 'accessLevel',
      title: 'Access Level',
      type: 'string',
      options: {
        list: [
          {title: 'Public Summary', value: 'public'},
          {title: 'Registered Investors', value: 'registered'},
          {title: 'Accredited Only', value: 'accredited'},
          {title: 'Invited Only', value: 'invited'},
        ],
      },
      initialValue: 'accredited',
      group: 'access',
    }),
    defineField({
      name: 'invitedInvestors',
      title: 'Invited Investors',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'investor'}]})],
      description: 'Specific investors who can access this prospectus',
      group: 'access',
      hidden: ({parent}) => parent?.accessLevel !== 'invited',
    }),
    defineField({
      name: 'closeDate',
      title: 'Investment Close Date',
      type: 'datetime',
      group: 'details',
    }),
    defineField({
      name: 'relatedProject',
      title: 'Related Project',
      type: 'reference',
      to: [{type: 'project'}],
      description: 'Link to completed project showcase',
      group: 'details',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      totalRaise: 'totalRaise',
      media: 'coverImage',
    },
    prepare({title, status, totalRaise, media}) {
      const formattedRaise = totalRaise
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(totalRaise)
        : ''
      return {
        title,
        subtitle: [status, formattedRaise].filter(Boolean).join(' • '),
        media,
      }
    },
  },
})
