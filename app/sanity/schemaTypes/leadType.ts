import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const leadType = defineType({
  name: 'lead',
  title: 'Lead',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'leadType',
      title: 'Lead Type',
      type: 'string',
      options: {
        list: [
          {title: 'Buyer', value: 'buyer'},
          {title: 'Seller', value: 'seller'},
          {title: 'Investor', value: 'investor'},
          {title: 'Newsletter', value: 'newsletter'},
          {title: 'Contact Form', value: 'contact'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Contacted', value: 'contacted'},
          {title: 'Qualified', value: 'qualified'},
          {title: 'Converted', value: 'converted'},
          {title: 'Lost', value: 'lost'},
        ],
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'formData',
      title: 'Form Data',
      type: 'object',
      description: 'Additional data submitted with the form',
      fields: [
        defineField({name: 'budget', type: 'string', title: 'Budget'}),
        defineField({name: 'neighborhoods', type: 'string', title: 'Preferred Neighborhoods'}),
        defineField({name: 'bedrooms', type: 'string', title: 'Bedrooms'}),
        defineField({name: 'timeline', type: 'string', title: 'Timeline'}),
        defineField({name: 'propertyAddress', type: 'string', title: 'Property Address'}),
        defineField({name: 'propertyType', type: 'string', title: 'Property Type'}),
        defineField({name: 'investmentType', type: 'string', title: 'Investment Type'}),
        defineField({name: 'investmentBudget', type: 'string', title: 'Investment Budget'}),
        defineField({name: 'experience', type: 'string', title: 'Experience Level'}),
        defineField({name: 'accreditedStatus', type: 'string', title: 'Accredited Status'}),
        defineField({name: 'company', type: 'string', title: 'Company/Entity'}),
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'assignedTo',
      title: 'Assigned To',
      type: 'reference',
      to: [{type: 'teamMember'}],
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      leadType: 'leadType',
      status: 'status',
      email: 'email',
    },
    prepare({title, leadType, status, email}) {
      return {
        title,
        subtitle: `${leadType || 'Lead'} • ${status || 'new'} • ${email}`,
      }
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'submittedDesc',
      by: [{field: 'submittedAt', direction: 'desc'}],
    },
  ],
})
