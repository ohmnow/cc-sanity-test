import {SignedIn, SignedOut, RedirectToSignIn, UserButton} from '@clerk/react-router'
import {Link, Outlet, useOutletContext} from 'react-router'
import {LayoutDashboard, FileText, User, AlertTriangle} from 'lucide-react'

interface OutletContext {
  clerkConfigured?: boolean
}

export default function InvestorLayout() {
  const context = useOutletContext<OutletContext>()
  const isClerkConfigured = context?.clerkConfigured

  // If Clerk is not configured, show a message
  if (!isClerkConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="font-display text-2xl text-[#1a1a1a] mb-2">
            Authentication Not Configured
          </h1>
          <p className="text-gray-600 mb-6">
            The investor portal requires Clerk authentication to be configured.
            Please add your Clerk API keys to the environment variables.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm">
            <p className="font-medium text-gray-700 mb-2">Required variables:</p>
            <code className="text-xs text-gray-600">
              VITE_CLERK_PUBLISHABLE_KEY=pk_...<br />
              CLERK_SECRET_KEY=sk_...
            </code>
          </div>
          <Link
            to="/"
            className="mt-6 inline-block text-[#c9a961] hover:underline"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  // Clerk is configured, render with auth protection
  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-[#1a1a1a] border-b border-gray-800">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#c9a961] rounded-lg flex items-center justify-center">
                    <span className="font-display text-[#1a1a1a] text-xl font-bold">G</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="font-display text-white text-lg">Investor Portal</span>
                  </div>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-6">
                  <Link
                    to="/investor/dashboard"
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard size={18} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                  <Link
                    to="/investor/opportunities"
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <FileText size={18} />
                    <span className="hidden sm:inline">Opportunities</span>
                  </Link>
                  <Link
                    to="/investor/profile"
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <User size={18} />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>
                  <div className="ml-4 pl-4 border-l border-gray-700">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: 'w-8 h-8',
                        },
                      }}
                    />
                  </div>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main>
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
            <div className="container mx-auto px-4 lg:px-8">
              <p className="text-center text-gray-500 text-sm">
                © 2026 Golden Gate Home Advisors. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
