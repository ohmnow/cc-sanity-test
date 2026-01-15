import {defineArrayMember, defineField, defineType} from 'sanity'

// Hero Block - Page header with headline, text, and optional image
export const heroBlockType = defineType({
  name: 'heroBlock',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'alignment',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
        ],
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'object',
      fields: [
        defineField({name: 'text', type: 'string', title: 'Button Text'}),
        defineField({name: 'url', type: 'string', title: 'Button URL'}),
      ],
    }),
  ],
  preview: {
    select: {headline: 'headline'},
    prepare({headline}) {
      return {
        title: headline || 'Hero Section',
        subtitle: 'Hero Block',
      }
    },
  },
})

// Text Block - Rich text content section
export const textBlockType = defineType({
  name: 'textBlock',
  title: 'Text Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Section Headline',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Full Width', value: 'full'},
          {title: 'Narrow', value: 'narrow'},
          {title: 'Two Columns', value: 'two-column'},
        ],
      },
      initialValue: 'narrow',
    }),
  ],
  preview: {
    select: {headline: 'headline'},
    prepare({headline}) {
      return {
        title: headline || 'Text Section',
        subtitle: 'Text Block',
      }
    },
  },
})

// Image Block - Single image or gallery
export const imageBlockType = defineType({
  name: 'imageBlock',
  title: 'Image Section',
  type: 'object',
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Single Image', value: 'single'},
          {title: 'Gallery Grid', value: 'gallery'},
          {title: 'Side by Side', value: 'side-by-side'},
        ],
      },
      initialValue: 'single',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'caption', type: 'string', title: 'Caption'}),
            defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {layout: 'layout', images: 'images'},
    prepare({layout, images}) {
      const imageCount = images?.length || 0
      return {
        title: `Image Section (${imageCount} image${imageCount !== 1 ? 's' : ''})`,
        subtitle: `Layout: ${layout || 'single'}`,
      }
    },
  },
})

// CTA Block - Call to action section
export const ctaBlockType = defineType({
  name: 'ctaBlock',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Supporting Text',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          {title: 'Dark Background', value: 'dark'},
          {title: 'Light Background', value: 'light'},
          {title: 'Brand Color', value: 'brand'},
        ],
      },
      initialValue: 'dark',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'text', type: 'string', title: 'Button Text'}),
            defineField({name: 'url', type: 'string', title: 'Button URL'}),
            defineField({
              name: 'style',
              type: 'string',
              title: 'Button Style',
              options: {
                list: [
                  {title: 'Primary (Gold)', value: 'primary'},
                  {title: 'Secondary (Outline)', value: 'secondary'},
                ],
              },
              initialValue: 'primary',
            }),
          ],
          preview: {
            select: {text: 'text'},
            prepare({text}) {
              return {title: text || 'Button'}
            },
          },
        }),
      ],
      validation: (rule) => rule.max(2),
    }),
  ],
  preview: {
    select: {headline: 'headline'},
    prepare({headline}) {
      return {
        title: headline || 'Call to Action',
        subtitle: 'CTA Block',
      }
    },
  },
})

// Team Block - Team member grid
export const teamBlockType = defineType({
  name: 'teamBlock',
  title: 'Team Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Section Headline',
      type: 'string',
    }),
    defineField({
      name: 'subheadline',
      title: 'Section Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'teamMember'}]})],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Grid (3 columns)', value: 'grid-3'},
          {title: 'Grid (4 columns)', value: 'grid-4'},
          {title: 'Featured + Grid', value: 'featured'},
        ],
      },
      initialValue: 'grid-3',
    }),
  ],
  preview: {
    select: {headline: 'headline', teamMembers: 'teamMembers'},
    prepare({headline, teamMembers}) {
      const count = teamMembers?.length || 0
      return {
        title: headline || 'Team Section',
        subtitle: `${count} team member${count !== 1 ? 's' : ''}`,
      }
    },
  },
})

// Contact Form Block
export const contactFormBlockType = defineType({
  name: 'contactFormBlock',
  title: 'Contact Form',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Section Headline',
      type: 'string',
    }),
    defineField({
      name: 'subheadline',
      title: 'Section Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'formType',
      title: 'Form Type',
      type: 'string',
      options: {
        list: [
          {title: 'General Contact', value: 'contact'},
          {title: 'Get Started', value: 'get-started'},
          {title: 'Newsletter Signup', value: 'newsletter'},
        ],
      },
      initialValue: 'contact',
    }),
    defineField({
      name: 'showContactInfo',
      title: 'Show Contact Information',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {headline: 'headline', formType: 'formType'},
    prepare({headline, formType}) {
      return {
        title: headline || 'Contact Form',
        subtitle: `Form type: ${formType || 'contact'}`,
      }
    },
  },
})

// FAQ Block
export const faqBlockType = defineType({
  name: 'faqBlock',
  title: 'FAQ Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Section Headline',
      type: 'string',
    }),
    defineField({
      name: 'subheadline',
      title: 'Section Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              type: 'string',
              title: 'Question',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              type: 'array',
              title: 'Answer',
              of: [defineArrayMember({type: 'block'})],
            }),
          ],
          preview: {
            select: {question: 'question'},
            prepare({question}) {
              return {title: question || 'FAQ Item'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {headline: 'headline', faqs: 'faqs'},
    prepare({headline, faqs}) {
      const count = faqs?.length || 0
      return {
        title: headline || 'FAQ Section',
        subtitle: `${count} question${count !== 1 ? 's' : ''}`,
      }
    },
  },
})

// Services Grid Block
export const servicesGridBlockType = defineType({
  name: 'servicesGridBlock',
  title: 'Services Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Section Headline',
      type: 'string',
    }),
    defineField({
      name: 'subheadline',
      title: 'Section Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
    }),
  ],
  preview: {
    select: {headline: 'headline', services: 'services'},
    prepare({headline, services}) {
      const count = services?.length || 0
      return {
        title: headline || 'Services Grid',
        subtitle: `${count} service${count !== 1 ? 's' : ''}`,
      }
    },
  },
})

// Testimonials Block
export const testimonialsBlockType = defineType({
  name: 'testimonialsBlock',
  title: 'Testimonials Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Section Headline',
      type: 'string',
    }),
    defineField({
      name: 'subheadline',
      title: 'Section Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'testimonial'}]})],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Carousel', value: 'carousel'},
          {title: 'Grid', value: 'grid'},
          {title: 'Featured Single', value: 'featured'},
        ],
      },
      initialValue: 'carousel',
    }),
  ],
  preview: {
    select: {headline: 'headline', testimonials: 'testimonials'},
    prepare({headline, testimonials}) {
      const count = testimonials?.length || 0
      return {
        title: headline || 'Testimonials Section',
        subtitle: `${count} testimonial${count !== 1 ? 's' : ''}`,
      }
    },
  },
})

// Export all block types as an array for easy import
export const pageBlockTypes = [
  heroBlockType,
  textBlockType,
  imageBlockType,
  ctaBlockType,
  teamBlockType,
  contactFormBlockType,
  faqBlockType,
  servicesGridBlockType,
  testimonialsBlockType,
]
