import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'General'},
    {name: 'announcement', title: 'Announcement Bar'},
    {name: 'contact', title: 'Contact Info'},
    {name: 'social', title: 'Social Media'},
    {name: 'footer', title: 'Footer'},
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'Golden Gate Home Advisors',
      group: 'general',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'general',
    }),
    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar',
      type: 'object',
      group: 'announcement',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Show Announcement Bar',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'message',
          title: 'Message',
          type: 'string',
        }),
        defineField({
          name: 'linkText',
          title: 'Link Text',
          type: 'string',
        }),
        defineField({
          name: 'linkUrl',
          title: 'Link URL',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({name: 'phone', type: 'string', title: 'Phone'}),
        defineField({name: 'email', type: 'string', title: 'Email'}),
        defineField({
          name: 'address',
          type: 'object',
          title: 'Address',
          fields: [
            defineField({name: 'street', type: 'string', title: 'Street'}),
            defineField({name: 'city', type: 'string', title: 'City'}),
            defineField({name: 'state', type: 'string', title: 'State'}),
            defineField({name: 'zip', type: 'string', title: 'ZIP'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social Media Links',
      type: 'object',
      group: 'social',
      fields: [
        defineField({name: 'facebook', type: 'url', title: 'Facebook'}),
        defineField({name: 'instagram', type: 'url', title: 'Instagram'}),
        defineField({name: 'twitter', type: 'url', title: 'Twitter/X'}),
        defineField({name: 'linkedin', type: 'url', title: 'LinkedIn'}),
        defineField({name: 'youtube', type: 'url', title: 'YouTube'}),
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'text',
      rows: 3,
      group: 'footer',
    }),
    defineField({
      name: 'footerLinks',
      title: 'Footer Quick Links',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', title: 'Link Title'}),
            defineField({name: 'url', type: 'string', title: 'URL'}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'url'},
          },
        }),
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Company Stats',
      type: 'array',
      description: 'Stats displayed on the homepage',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'value', type: 'string', title: 'Value', description: 'e.g., $50M+'}),
            defineField({name: 'label', type: 'string', title: 'Label', description: 'e.g., Transaction Volume'}),
          ],
          preview: {
            select: {title: 'value', subtitle: 'label'},
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
