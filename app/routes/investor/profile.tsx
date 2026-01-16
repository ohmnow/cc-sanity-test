import {getAuth} from '@clerk/react-router/server'
import {useUser} from '@clerk/react-router'
import {Form, useActionData, useLoaderData, useNavigation} from 'react-router'
import {
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import {loadQuery} from '~/sanity/loader.server'
import {INVESTOR_BY_CLERK_ID_QUERY} from '~/sanity/queries'
import {getViewClient} from '~/sanity/client.server'

import type {Route} from './+types/profile'

interface Investor {
  _id: string
  name: string
  email: string
  phone?: string
  company?: string
  accreditedStatus?: string
  investmentCapacity?: string
  investmentInterests?: string[]
  status?: string
}

export async function loader(args: Route.LoaderArgs) {
  const {userId} = await getAuth(args)

  if (!userId) {
    throw new Response('Unauthorized', {status: 401})
  }

  // Fetch investor record from Sanity
  const {data: investor} = await loadQuery<Investor | null>(
    INVESTOR_BY_CLERK_ID_QUERY,
    {clerkId: userId}
  )

  return {investor, clerkId: userId}
}

export async function action(args: Route.ActionArgs) {
  const {userId} = await getAuth(args)

  if (!userId) {
    return {error: 'Unauthorized'}
  }

  const formData = await args.request.formData()
  const phone = formData.get('phone')?.toString() || ''
  const company = formData.get('company')?.toString() || ''
  const investmentCapacity = formData.get('investmentCapacity')?.toString() || ''
  const investmentInterests = formData.getAll('investmentInterests') as string[]

  // Find the investor by Clerk ID
  const investor = await getViewClient().fetch<{_id: string} | null>(
    `*[_type == "investor" && clerkId == $clerkId][0]{_id}`,
    {clerkId: userId}
  )

  if (!investor) {
    return {error: 'Investor record not found'}
  }

  // Update the investor record
  try {
    await getViewClient()
      .patch(investor._id)
      .set({
        phone: phone || undefined,
        company: company || undefined,
        investmentCapacity: investmentCapacity || undefined,
        investmentInterests: investmentInterests.length > 0 ? investmentInterests : undefined,
      })
      .commit({token: process.env.SANITY_WRITE_TOKEN?.trim()})

    return {success: true, message: 'Profile updated successfully'}
  } catch (error) {
    console.error('Error updating profile:', error)
    return {error: 'Failed to update profile. Please try again.'}
  }
}

function getAccreditedStatusBadge(status?: string) {
  switch (status) {
    case 'verified':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <CheckCircle size={14} />
          Verified Accredited
        </span>
      )
    case 'self-certified':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          <Shield size={14} />
          Self-Certified
        </span>
      )
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
          <Clock size={14} />
          Pending Verification
        </span>
      )
    case 'not-accredited':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          <AlertCircle size={14} />
          Not Accredited
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
          <AlertCircle size={14} />
          Not Set
        </span>
      )
  }
}

const investmentCapacityOptions = [
  {value: '100k-500k', label: '$100K - $500K'},
  {value: '500k-1m', label: '$500K - $1M'},
  {value: '1m-3m', label: '$1M - $3M'},
  {value: '3m-5m', label: '$3M - $5M'},
  {value: '5m-plus', label: '$5M+'},
]

const investmentInterestOptions = [
  {value: 'fix-flip', label: 'Fix & Flip'},
  {value: 'buy-hold', label: 'Buy & Hold'},
  {value: 'development', label: 'Development Projects'},
  {value: 'syndication', label: 'Syndication/Partnerships'},
]

export default function InvestorProfile() {
  const {user, isLoaded} = useUser()
  const {investor} = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  if (!isLoaded) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="h-20 w-20 bg-gray-200 rounded-full" />
              <div className="h-6 w-64 bg-gray-200 rounded" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl text-[#1a1a1a] mb-2">
            Investor Profile
          </h1>
          <p className="text-gray-600">
            Manage your account information and investment preferences.
          </p>
        </div>

        {/* Success/Error Messages */}
        {actionData?.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700">{actionData.message}</p>
          </div>
        )}
        {actionData?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{actionData.error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="text-center">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || 'Profile'}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#c9a961] flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                <h2 className="font-display text-xl text-[#1a1a1a]">
                  {investor?.name || user?.fullName || 'Investor'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {investor?.email || user?.primaryEmailAddress?.emailAddress}
                </p>
                <div className="mt-4">
                  {getAccreditedStatusBadge(investor?.accreditedStatus)}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar size={16} />
                  <span className="text-sm">
                    Member since{' '}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </div>
                {investor?.investmentCapacity && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <TrendingUp size={16} />
                    <span className="text-sm">
                      Capacity:{' '}
                      {
                        investmentCapacityOptions.find(
                          (o) => o.value === investor.investmentCapacity
                        )?.label
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Accreditation Notice */}
            {investor?.accreditedStatus !== 'verified' && (
              <div className="mt-4 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <h3 className="font-medium text-yellow-800 mb-2">
                  Accreditation Required
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Some investment opportunities are only available to verified
                  accredited investors.
                </p>
                <a
                  href="mailto:investors@goldengateadvisors.com"
                  className="text-sm font-medium text-yellow-800 hover:text-yellow-900"
                >
                  Contact us to verify your status &rarr;
                </a>
              </div>
            )}
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <Form method="post">
              {/* Contact Information */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
                <h3 className="font-display text-lg text-[#1a1a1a] mb-4">
                  Contact Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-gray-600">
                      <User size={16} className="text-gray-400" />
                      {investor?.name || user?.fullName || 'Not provided'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Managed through your Clerk account
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-gray-600">
                      <Mail size={16} className="text-gray-400" />
                      {investor?.email ||
                        user?.primaryEmailAddress?.emailAddress ||
                        'Not provided'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Managed through your Clerk account
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        defaultValue={investor?.phone || ''}
                        placeholder="(555) 123-4567"
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a961] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Company / Entity Name
                    </label>
                    <div className="relative">
                      <Building
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        id="company"
                        name="company"
                        defaultValue={investor?.company || ''}
                        placeholder="Your company name"
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a961] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Investment Preferences */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
                <h3 className="font-display text-lg text-[#1a1a1a] mb-4">
                  Investment Preferences
                </h3>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="investmentCapacity"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Investment Capacity
                    </label>
                    <select
                      id="investmentCapacity"
                      name="investmentCapacity"
                      defaultValue={investor?.investmentCapacity || ''}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a961] focus:border-transparent"
                    >
                      <option value="">Select your investment range</option>
                      {investmentCapacityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      This helps us match you with appropriate opportunities
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Interests
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {investmentInterestOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#c9a961] cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            name="investmentInterests"
                            value={option.value}
                            defaultChecked={investor?.investmentInterests?.includes(
                              option.value
                            )}
                            className="w-4 h-4 text-[#c9a961] border-gray-300 rounded focus:ring-[#c9a961]"
                          />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Select all that apply. We&apos;ll notify you about matching
                      opportunities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-[#c9a961] text-white rounded-lg font-semibold hover:bg-[#b8994f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </Form>

            {/* Account Settings */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-display text-lg text-[#1a1a1a] mb-4">
                Account Settings
              </h3>
              <div className="space-y-3">
                <a
                  href="/investor/auth/sign-in#user-profile"
                  className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-[#c9a961] hover:bg-[#c9a961]/5 transition-colors"
                >
                  <p className="font-medium text-[#1a1a1a]">Update Profile</p>
                  <p className="text-sm text-gray-500">
                    Update your name, email, or profile picture
                  </p>
                </a>
                <a
                  href="/investor/auth/sign-in#security"
                  className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-[#c9a961] hover:bg-[#c9a961]/5 transition-colors"
                >
                  <p className="font-medium text-[#1a1a1a]">Security Settings</p>
                  <p className="text-sm text-gray-500">
                    Manage passwords and two-factor authentication
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
