import {Outlet} from 'react-router'

import {AnnouncementBar} from '~/components/marketing/AnnouncementBar'
import {MarketingFooter} from '~/components/marketing/MarketingFooter'
import {Navigation} from '~/components/marketing/Navigation'

export default function MarketingLayout() {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed header container - floats over content */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <AnnouncementBar />
        <Navigation />
      </header>
      <main>
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  )
}
