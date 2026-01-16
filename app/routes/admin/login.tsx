import {Form, redirect, useActionData} from 'react-router'
import {Lock, AlertCircle} from 'lucide-react'
import {
  verifyAdminPassword,
  createAdminSession,
  isAdminAuthenticated,
} from '~/lib/admin.server'

import type {Route} from './+types/login'

export async function loader({request}: Route.LoaderArgs) {
  // If already authenticated, redirect to admin dashboard
  if (await isAdminAuthenticated(request)) {
    throw redirect('/admin')
  }
  return null
}

export async function action({request}: Route.ActionArgs) {
  const formData = await request.formData()
  const password = formData.get('password') as string

  if (!password) {
    return {error: 'Password is required'}
  }

  if (!verifyAdminPassword(password)) {
    return {error: 'Invalid password'}
  }

  // Create session and redirect
  const sessionCookie = await createAdminSession()
  throw redirect('/admin', {
    headers: {
      'Set-Cookie': sessionCookie,
    },
  })
}

export default function AdminLogin() {
  const actionData = useActionData<typeof action>()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#c9a961]" />
            </div>
            <h1 className="font-display text-2xl text-[#1a1a1a] mb-2">
              Admin Access
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your admin password to continue
            </p>
          </div>

          {/* Error Message */}
          {actionData?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{actionData.error}</p>
            </div>
          )}

          {/* Login Form */}
          <Form method="post">
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                autoFocus
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-none transition-all"
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-gold py-3 rounded-lg font-semibold"
            >
              Sign In
            </button>
          </Form>

          {/* Back Link */}
          <p className="text-center mt-6 text-sm text-gray-500">
            <a href="/" className="text-[#c9a961] hover:underline">
              ← Back to website
            </a>
          </p>
        </div>

        <p className="text-center mt-4 text-xs text-gray-400">
          Golden Gate Home Advisors Admin Portal
        </p>
      </div>
    </div>
  )
}
