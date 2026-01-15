import {
  Building2,
  ClipboardList,
  Cog,
  FileText,
  HandCoins,
  Home,
  LayoutTemplate,
  MessageSquareQuote,
  Users,
  Wrench,
} from 'lucide-react'
import type {
  DefaultDocumentNodeResolver,
  StructureResolver,
} from 'sanity/structure'

import OGPreview from '~/sanity/components/OGPreview'
import {resolveOGUrl} from '~/sanity/structure/resolveOGUrl'

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      // Homepage (Singleton)
      S.listItem()
        .icon(Home)
        .id('homepage')
        .schemaType('homepage')
        .title('Homepage')
        .child(
          S.editor()
            .id('homepage')
            .schemaType('homepage')
            .documentId('homepage')
        ),

      // Content Pages
      S.documentTypeListItem('page').title('Pages').icon(LayoutTemplate),
      S.divider(),

      // Site Settings (Singleton)
      S.listItem()
        .icon(Cog)
        .id('siteSettings')
        .schemaType('siteSettings')
        .title('Site Settings')
        .child(
          S.editor()
            .id('siteSettings')
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.divider(),

      // Golden Gate Home Advisors Content
      S.documentTypeListItem('property').title('Properties').icon(Building2),
      S.documentTypeListItem('project').title('Projects').icon(Wrench),
      S.documentTypeListItem('testimonial')
        .title('Testimonials')
        .icon(MessageSquareQuote),
      S.documentTypeListItem('teamMember').title('Team Members').icon(Users),
      S.documentTypeListItem('service').title('Services').icon(HandCoins),
      S.divider(),

      // Leads & CRM
      S.documentTypeListItem('lead').title('Leads').icon(ClipboardList),
      S.divider(),

      // Investor Portal
      S.listItem()
        .title('Investor Portal')
        .icon(FileText)
        .child(
          S.list()
            .title('Investor Portal')
            .items([
              S.documentTypeListItem('investor').title('Investors').icon(Users),
              S.documentTypeListItem('prospectus')
                .title('Prospectuses')
                .icon(FileText),
              S.documentTypeListItem('letterOfIntent')
                .title('Letters of Intent')
                .icon(ClipboardList),
            ])
        ),
    ])

export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  {schemaType, documentId},
) => {
  const OGPreviewView = S.view
    .component(OGPreview)
    .options({
      url: resolveOGUrl(documentId),
    })
    .title('OG Preview')

  switch (schemaType) {
    case `page`:
    case `property`:
    case `project`:
      return S.document().views([S.view.form(), OGPreviewView])
    default:
      return S.document().views([S.view.form()])
  }
}
