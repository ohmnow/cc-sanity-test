import {ChevronRight, Home} from 'lucide-react'
import {Link} from 'react-router'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Breadcrumbs component with Schema.org structured data
 * Includes JSON-LD for SEO benefits
 */
export function Breadcrumbs({items, className = ''}: BreadcrumbsProps) {
  // Add home to the beginning
  const allItems: BreadcrumbItem[] = [{label: 'Home', href: '/'}, ...items]

  // Generate Schema.org BreadcrumbList JSON-LD
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && {item: `https://goldengateadvisors.com${item.href}`}),
    })),
  }

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(schemaData)}}
      />

      {/* Visual Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-sm ${className}`}
      >
        <ol className="flex items-center flex-wrap">
          {allItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  size={14}
                  className="mx-2 text-gray-400 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {item.href && index < allItems.length - 1 ? (
                <Link
                  to={item.href}
                  className="text-gray-500 hover:text-[#c9a961] transition-colors flex items-center gap-1"
                >
                  {index === 0 && <Home size={14} className="flex-shrink-0" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className="text-[#1a1a1a] font-medium flex items-center gap-1"
                  aria-current={index === allItems.length - 1 ? 'page' : undefined}
                >
                  {index === 0 && <Home size={14} className="flex-shrink-0" />}
                  <span className="truncate max-w-[200px]">{item.label}</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

/**
 * Light variant for dark backgrounds (e.g., hero sections)
 */
export function BreadcrumbsLight({items, className = ''}: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = [{label: 'Home', href: '/'}, ...items]

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && {item: `https://goldengateadvisors.com${item.href}`}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(schemaData)}}
      />

      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-sm ${className}`}
      >
        <ol className="flex items-center flex-wrap">
          {allItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  size={14}
                  className="mx-2 text-white/40 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {item.href && index < allItems.length - 1 ? (
                <Link
                  to={item.href}
                  className="text-white/60 hover:text-[#c9a961] transition-colors flex items-center gap-1"
                >
                  {index === 0 && <Home size={14} className="flex-shrink-0" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className="text-white font-medium flex items-center gap-1"
                  aria-current={index === allItems.length - 1 ? 'page' : undefined}
                >
                  {index === 0 && <Home size={14} className="flex-shrink-0" />}
                  <span className="truncate max-w-[200px]">{item.label}</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
