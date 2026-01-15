import {ClipboardIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const letterOfIntentType = defineType({
  name: 'letterOfIntent',
  title: 'Letter of Intent',
  type: 'document',
  icon: ClipboardIcon,
  fields: [
    defineField({
      name: 'investor',
      title: 'Investor',
      type: 'reference',
      to: [{type: 'investor'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'prospectus',
      title: 'Prospectus',
      type: 'reference',
      to: [{type: 'prospectus'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'investmentAmount',
      title: 'Investment Amount',
      type: 'number',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Submitted', value: 'submitted'},
          {title: 'Under Review', value: 'review'},
          {title: 'Approved', value: 'approved'},
          {title: 'Rejected', value: 'rejected'},
          {title: 'Withdrawn', value: 'withdrawn'},
          {title: 'Converted', value: 'converted'},
        ],
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted Date',
      type: 'datetime',
    }),
    defineField({
      name: 'reviewedAt',
      title: 'Reviewed Date',
      type: 'datetime',
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Reviewed By',
      type: 'reference',
      to: [{type: 'teamMember'}],
    }),
    defineField({
      name: 'investorSignature',
      title: 'Investor Signature',
      type: 'object',
      fields: [
        defineField({name: 'signed', type: 'boolean', title: 'Signed'}),
        defineField({name: 'signedAt', type: 'datetime', title: 'Signed At'}),
        defineField({name: 'ipAddress', type: 'string', title: 'IP Address'}),
      ],
    }),
    defineField({
      name: 'companySignature',
      title: 'Company Signature',
      type: 'object',
      fields: [
        defineField({name: 'signed', type: 'boolean', title: 'Signed'}),
        defineField({name: 'signedAt', type: 'datetime', title: 'Signed At'}),
        defineField({name: 'signedBy', type: 'reference', to: [{type: 'teamMember'}], title: 'Signed By'}),
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'investorNotes',
      title: 'Investor Notes',
      type: 'text',
      rows: 3,
      description: 'Notes from the investor',
    }),
    defineField({
      name: 'attachments',
      title: 'Attachments',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', title: 'Title'}),
            defineField({name: 'file', type: 'file', title: 'File'}),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      investorName: 'investor.name',
      prospectusTitle: 'prospectus.title',
      amount: 'investmentAmount',
      status: 'status',
    },
    prepare({investorName, prospectusTitle, amount, status}) {
      const formattedAmount = amount
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(amount)
        : ''
      return {
        title: `${investorName || 'Unknown Investor'} - ${formattedAmount}`,
        subtitle: `${prospectusTitle || 'No Project'} • ${status || 'draft'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'submittedDesc',
      by: [{field: 'submittedAt', direction: 'desc'}],
    },
    {
      title: 'By Status',
      name: 'statusAsc',
      by: [{field: 'status', direction: 'asc'}],
    },
  ],
})
