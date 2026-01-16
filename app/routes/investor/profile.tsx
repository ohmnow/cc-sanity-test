import {useState, useRef} from 'react'
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
  Upload,
  FileText,
  Download,
  X,
} from 'lucide-react'
import {loadQuery} from '~/sanity/loader.server'
import {getViewClient} from '~/sanity/client.server'

import type {Route} from './+types/profile'

interface AccreditationDocument {
  _key: string
  title: string
  documentType?: string
  uploadedAt?: string
  status?: string
  reviewerNotes?: string
  fileUrl?: string
}

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
  accreditationDocuments?: AccreditationDocument[]
}

const INVESTOR_PROFILE_QUERY = `*[_type == "investor" && clerkId == $clerkId][0]{
  _id,
  name,
  email,
  phone,
  company,
  accreditedStatus,
  investmentCapacity,
  investmentInterests,
  status,
  accreditationDocuments[]{
    _key,
    title,
    documentType,
    uploadedAt,
    status,
    reviewerNotes,
    "fileUrl": file.asset->url
  }
}`

export async function loader(args: Route.LoaderArgs) {
  const {userId} = await getAuth(args)

  if (!userId) {
    throw new Response('Unauthorized', {status: 401})
  }

  // Fetch investor record from Sanity
  const {data: investor} = await loadQuery<Investor | null>(
    INVESTOR_PROFILE_QUERY,
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

            {/* Accreditation Documents */}
            <AccreditationDocumentsSection
              investorId={investor?._id || ''}
              documents={investor?.accreditationDocuments || []}
            />

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

// Document type labels
const documentTypeLabels: Record<string, string> = {
  cpa_letter: 'CPA Letter',
  tax_return: 'Tax Return',
  bank_statement: 'Bank Statement',
  brokerage_statement: 'Brokerage Statement',
  third_party: 'Third-Party Verification',
  other: 'Other',
}

// Document status badges
function getDocumentStatusBadge(status?: string) {
  switch (status) {
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
          <CheckCircle size={12} />
          Approved
        </span>
      )
    case 'under_review':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
          <Clock size={12} />
          Under Review
        </span>
      )
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
          <X size={12} />
          Rejected
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
          <Clock size={12} />
          Pending
        </span>
      )
  }
}

function AccreditationDocumentsSection({
  investorId,
  documents,
}: {
  investorId: string
  documents: AccreditationDocument[]
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [documentType, setDocumentType] = useState('other')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size must be less than 10MB')
        return
      }
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        setUploadError('File type must be PDF, JPG, or PNG')
        return
      }
      setSelectedFile(file)
      setUploadError('')
      // Auto-populate title with filename
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !title || !investorId) {
      setUploadError('Please provide a document title and select a file')
      return
    }

    setIsUploading(true)
    setUploadError('')
    setUploadSuccess('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', title)
      formData.append('documentType', documentType)
      formData.append('investorId', investorId)

      const response = await fetch('/resource/upload-accreditation', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      setUploadSuccess('Document uploaded successfully. Refreshing...')
      setSelectedFile(null)
      setTitle('')
      setDocumentType('other')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Refresh the page to show the new document
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-display text-lg text-[#1a1a1a] mb-2">
        Accreditation Documents
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Upload documents to verify your accredited investor status. Accepted formats: PDF, JPG, PNG (max 10MB).
      </p>

      {/* Upload Form */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 2024 Tax Return"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a961] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a961] focus:border-transparent"
            >
              <option value="cpa_letter">CPA Letter</option>
              <option value="tax_return">Tax Return</option>
              <option value="bank_statement">Bank Statement</option>
              <option value="brokerage_statement">Brokerage Statement</option>
              <option value="third_party">Third-Party Verification</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select File
          </label>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#c9a961] file:text-white hover:file:bg-[#b8994f]"
            />
          </div>
          {selectedFile && (
            <p className="mt-1 text-sm text-gray-500">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {uploadError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle size={16} />
            {uploadError}
          </div>
        )}

        {uploadSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
            <CheckCircle size={16} />
            {uploadSuccess}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile || !title}
          className="flex items-center gap-2 px-4 py-2 bg-[#c9a961] text-white rounded-lg font-medium hover:bg-[#b8994f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload Document
            </>
          )}
        </button>
      </div>

      {/* Uploaded Documents List */}
      {documents.length > 0 ? (
        <div className="space-y-3">
          <h4 className="font-medium text-[#1a1a1a]">Uploaded Documents</h4>
          {documents.map((doc) => (
            <div
              key={doc._key}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                  <FileText size={20} className="text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-[#1a1a1a]">{doc.title}</p>
                  <p className="text-xs text-gray-500">
                    {documentTypeLabels[doc.documentType || 'other'] || 'Document'}
                    {doc.uploadedAt && (
                      <> &bull; {new Date(doc.uploadedAt).toLocaleDateString()}</>
                    )}
                  </p>
                  {doc.status === 'rejected' && doc.reviewerNotes && (
                    <p className="text-xs text-red-600 mt-1">
                      Note: {doc.reviewerNotes}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getDocumentStatusBadge(doc.status)}
                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-[#c9a961] transition-colors"
                    title="Download"
                  >
                    <Download size={16} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No documents uploaded yet</p>
          <p className="text-sm">Upload your first accreditation document above</p>
        </div>
      )}
    </div>
  )
}
