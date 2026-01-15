import {useUser} from '@clerk/react-router'
import {User, Mail, Phone, Building, Shield, Calendar} from 'lucide-react'

export default function InvestorProfile() {
  const {user, isLoaded} = useUser()

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
                  {user?.fullName || 'Investor'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  <Shield size={14} />
                  Verified Investor
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-gray-600 mb-3">
                  <Calendar size={16} />
                  <span className="text-sm">
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {month: 'long', year: 'numeric'}) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-display text-lg text-[#1a1a1a] mb-4">
                Contact Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Full Name
                  </label>
                  <div className="flex items-center gap-2 text-[#1a1a1a]">
                    <User size={16} className="text-gray-400" />
                    {user?.fullName || 'Not provided'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 text-[#1a1a1a]">
                    <Mail size={16} className="text-gray-400" />
                    {user?.primaryEmailAddress?.emailAddress || 'Not provided'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2 text-[#1a1a1a]">
                    <Phone size={16} className="text-gray-400" />
                    {user?.primaryPhoneNumber?.phoneNumber || 'Not provided'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Company
                  </label>
                  <div className="flex items-center gap-2 text-[#1a1a1a]">
                    <Building size={16} className="text-gray-400" />
                    Not provided
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Preferences */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-display text-lg text-[#1a1a1a] mb-4">
                Investment Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-[#1a1a1a]">Accredited Investor Status</p>
                    <p className="text-sm text-gray-500">Required for certain investment opportunities</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    Pending Verification
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-[#1a1a1a]">Investment Range</p>
                    <p className="text-sm text-gray-500">Your typical investment amount</p>
                  </div>
                  <span className="text-gray-600">Not specified</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-[#1a1a1a]">Preferred Property Types</p>
                    <p className="text-sm text-gray-500">Types of investments you're interested in</p>
                  </div>
                  <span className="text-gray-600">All types</span>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-display text-lg text-[#1a1a1a] mb-4">
                Account Settings
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-[#c9a961] hover:bg-[#c9a961]/5 transition-colors">
                  <p className="font-medium text-[#1a1a1a]">Update Profile</p>
                  <p className="text-sm text-gray-500">Manage your account through Clerk</p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-[#c9a961] hover:bg-[#c9a961]/5 transition-colors">
                  <p className="font-medium text-[#1a1a1a]">Notification Preferences</p>
                  <p className="text-sm text-gray-500">Choose how you want to be notified</p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-[#c9a961] hover:bg-[#c9a961]/5 transition-colors">
                  <p className="font-medium text-[#1a1a1a]">Security Settings</p>
                  <p className="text-sm text-gray-500">Manage passwords and authentication</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
