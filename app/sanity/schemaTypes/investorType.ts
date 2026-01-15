import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const investorType = defineType({
  name: 'investor',
  title: 'Investor',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
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
      name: 'company',
      title: 'Company/Entity Name',
      type: 'string',
    }),
    defineField({
      name: 'accreditedStatus',
      title: 'Accredited Investor Status',
      type: 'string',
      options: {
        list: [
          {title: 'Verified Accredited', value: 'verified'},
          {title: 'Self-Certified', value: 'self-certified'},
          {title: 'Pending Verification', value: 'pending'},
          {title: 'Not Accredited', value: 'not-accredited'},
        ],
      },
    }),
    defineField({
      name: 'investmentCapacity',
      title: 'Investment Capacity',
      type: 'string',
      options: {
        list: [
          {title: '$100K - $500K', value: '100k-500k'},
          {title: '$500K - $1M', value: '500k-1m'},
          {title: '$1M - $3M', value: '1m-3m'},
          {title: '$3M - $5M', value: '3m-5m'},
          {title: '$5M+', value: '5m-plus'},
        ],
      },
    }),
    defineField({
      name: 'investmentInterests',
      title: 'Investment Interests',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Fix & Flip', value: 'fix-flip'},
          {title: 'Buy & Hold', value: 'buy-hold'},
          {title: 'Development Projects', value: 'development'},
          {title: 'Syndication/Partnerships', value: 'syndication'},
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Pending Approval', value: 'pending'},
          {title: 'Inactive', value: 'inactive'},
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'magicLinkToken',
      title: 'Magic Link Token',
      type: 'string',
      description: 'Auto-generated token for passwordless authentication',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'magicLinkExpiry',
      title: 'Magic Link Expiry',
      type: 'datetime',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'lastLogin',
      title: 'Last Login',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'lead',
      title: 'Original Lead',
      type: 'reference',
      to: [{type: 'lead'}],
      description: 'Link to the original lead submission',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      email: 'email',
      status: 'status',
      company: 'company',
    },
    prepare({title, email, status, company}) {
      return {
        title,
        subtitle: [company, status, email].filter(Boolean).join(' • '),
      }
    },
  },
})
