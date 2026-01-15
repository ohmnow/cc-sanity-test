import {DocumentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        defineArrayMember({type: 'heroBlock'}),
        defineArrayMember({type: 'textBlock'}),
        defineArrayMember({type: 'imageBlock'}),
        defineArrayMember({type: 'ctaBlock'}),
        defineArrayMember({type: 'teamBlock'}),
        defineArrayMember({type: 'contactFormBlock'}),
        defineArrayMember({type: 'faqBlock'}),
        defineArrayMember({type: 'servicesGridBlock'}),
        defineArrayMember({type: 'testimonialsBlock'}),
      ],
      group: 'content',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Override the page title for search engines',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Description for search engine results (recommended: 150-160 characters)',
          validation: (rule) => rule.max(160),
        }),
        defineField({
          name: 'ogImage',
          title: 'Social Share Image',
          type: 'image',
          description: 'Image displayed when sharing on social media',
        }),
        defineField({
          name: 'noIndex',
          title: 'Hide from Search Engines',
          type: 'boolean',
          description: 'Prevent this page from appearing in search results',
          initialValue: false,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      sections: 'sections',
    },
    prepare({title, slug, sections}) {
      const sectionCount = sections?.length || 0
      return {
        title: title || 'Untitled Page',
        subtitle: `/${slug || ''} • ${sectionCount} section${sectionCount !== 1 ? 's' : ''}`,
      }
    },
  },
})
