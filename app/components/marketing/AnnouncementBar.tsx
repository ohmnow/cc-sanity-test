import {X} from 'lucide-react'
import {useState} from 'react'
import {Link} from 'react-router'

interface AnnouncementBarProps {
  message?: string
  linkText?: string
  linkHref?: string
  onDismiss?: () => void
}

export function AnnouncementBar({
  message = 'Now accepting investor applications for Q1 2026 opportunities',
  linkText = 'Learn More',
  linkHref = '/get-started/investor',
  onDismiss,
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  return (
    <div className="bg-white border-b border-gray-200 relative">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center text-sm">
        <p className="text-gray-700 font-medium">
          {message}
          <Link
            to={linkHref}
            className="ml-2 text-[#1a1a1a] underline underline-offset-2 hover:text-[#c9a961] font-semibold transition-colors"
          >
            {linkText}
          </Link>
        </p>
        <button
          onClick={handleDismiss}
          className="absolute right-4 p-1 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-gray-700"
          aria-label="Dismiss announcement"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
