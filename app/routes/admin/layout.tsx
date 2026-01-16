import {Form, Link, Outlet, redirect, useLocation} from 'react-router'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  LogOut,
  Settings,
  Home,
} from 'lucide-react'
import {isAdminAuthenticated} from '~/lib/admin.server'

import type {Route} from './+types/layout'

export async function loader({request}: Route.LoaderArgs) {
  // Protect all admin routes
  if (!(await isAdminAuthenticated(request))) {
    throw redirect('/admin/login')
  }
  return null
}


const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/leads',
    label: 'Leads',
    icon: Users,
  },
  {
    href: '/admin/investors',
    label: 'Investors',
    icon: UserCheck,
  },
  {
    href: '/admin/lois',
    label: 'Letters of Intent',
    icon: FileText,
  },
]

export default function AdminLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a1a] text-white flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c9a961] rounded-lg flex items-center justify-center font-display text-[#1a1a1a] text-lg font-bold">
              G
            </div>
            <div>
              <p className="font-display text-lg leading-tight">Golden Gate</p>
              <p className="text-xs text-white/60">Admin Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/admin' &&
                  location.pathname.startsWith(item.href))
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#c9a961] text-[#1a1a1a]'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer Links */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            to="/studio"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Settings size={20} />
            Sanity Studio
          </Link>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Home size={20} />
            View Website
          </Link>
          <Form method="post" action="/admin/logout">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </Form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
