import {useState} from 'react'
import {Link, useLoaderData, useNavigate} from 'react-router'
import {useUser} from '@clerk/react-router'
import {ArrowLeft, AlertCircle, CheckCircle, FileText, Loader2} from 'lucide-react'
import {loadQuery} from '~/sanity/loader.server'
import {PROSPECTUS_QUERY} from '~/sanity/queries'
import {SignaturePad} from '~/components/SignaturePad'

import type {Route} from './+types/$slug.loi'

interface Prospectus {
  _id: string
  title: string
  slug: string
  status: string
  minimumInvestment: number
  totalRaise: number
  targetReturn: string
}

export async function loader({params, request}: Route.LoaderArgs) {
  const {data: prospectus} = await loadQuery<Prospectus | null>(
    PROSPECTUS_QUERY,
    {slug: params.slug},
    {request}
  )

  if (!prospectus) {
    throw new Response('Not Found', {status: 404})
  }

  // Don't allow LOI submission if not open
  if (prospectus.status !== 'open') {
    throw new Response('This opportunity is not open for investment', {status: 403})
  }

  return {prospectus}
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function SubmitLOI() {
  const {prospectus} = useLoaderData<typeof loader>()
  const {user} = useUser()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    investmentAmount: '',
    fundingSource: '',
    investorType: '',
    investorNotes: '',
    accreditedStatus: false,
    riskAcknowledgment: false,
    termsAccepted: false,
    signatureImage: '',
    printedName: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const {name, value, type} = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = {...prev}
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    const amount = Number(formData.investmentAmount)
    if (!formData.investmentAmount || isNaN(amount)) {
      newErrors.investmentAmount = 'Please enter a valid investment amount'
    } else if (prospectus.minimumInvestment && amount < prospectus.minimumInvestment) {
      newErrors.investmentAmount = `Minimum investment is ${formatCurrency(prospectus.minimumInvestment)}`
    }

    if (!formData.fundingSource) {
      newErrors.fundingSource = 'Please select a funding source'
    }

    if (!formData.investorType) {
      newErrors.investorType = 'Please select your investor type'
    }

    if (!formData.accreditedStatus) {
      newErrors.accreditedStatus = 'You must confirm your accredited investor status'
    }

    if (!formData.riskAcknowledgment) {
      newErrors.riskAcknowledgment = 'You must acknowledge the investment risks'
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions'
    }

    if (!formData.signatureImage) {
      newErrors.signatureImage = 'Please sign in the signature pad above'
    }

    if (!formData.printedName.trim()) {
      newErrors.printedName = 'Please enter your full legal name'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    if (!user?.id) {
      setErrors({submit: 'You must be logged in to submit an LOI'})
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/resource/submit-loi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: user.id,
          prospectusSlug: prospectus.slug,
          investmentAmount: Number(formData.investmentAmount),
          fundingSource: formData.fundingSource,
          investorType: formData.investorType,
          signatureImage: formData.signatureImage,
          printedName: formData.printedName,
          investorNotes: formData.investorNotes,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit LOI')
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Failed to submit LOI:', error)
      setErrors({
        submit:
          error instanceof Error ? error.message : 'Failed to submit. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="font-display text-2xl text-[#1a1a1a] mb-4">
              Letter of Intent Submitted
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in {prospectus.title}. Our team will review your
              Letter of Intent and contact you within 2-3 business days.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Investment Amount</p>
              <p className="font-semibold text-[#1a1a1a] text-xl">
                {formatCurrency(Number(formData.investmentAmount))}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/investor/dashboard"
                className="btn-gold px-6 py-3 rounded-lg font-semibold"
              >
                Return to Dashboard
              </Link>
              <Link
                to="/investor/opportunities"
                className="px-6 py-3 rounded-lg font-semibold border border-gray-200 text-[#1a1a1a] hover:bg-gray-50"
              >
                View More Opportunities
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        {/* Back Link */}
        <Link
          to={`/investor/opportunities/${prospectus.slug}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1a1a1a] mb-6"
        >
          <ArrowLeft size={18} />
          Back to Opportunity
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl text-[#1a1a1a] mb-2">
            Submit Letter of Intent
          </h1>
          <p className="text-gray-600">
            Complete this form to express your interest in investing in{' '}
            <strong>{prospectus.title}</strong>.
          </p>
        </div>

        {/* Opportunity Summary */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <p className="text-white/60 text-sm">Minimum Investment</p>
              <p className="text-white font-semibold text-lg">
                {prospectus.minimumInvestment
                  ? formatCurrency(prospectus.minimumInvestment)
                  : 'TBD'}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Raise</p>
              <p className="text-white font-semibold text-lg">
                {formatCurrency(prospectus.totalRaise)}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Target Return</p>
              <p className="text-[#c9a961] font-semibold text-lg">
                {prospectus.targetReturn || 'TBD'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Investment Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display text-lg text-[#1a1a1a] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#c9a961]" />
              Investment Details
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="investmentAmount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Investment Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    id="investmentAmount"
                    name="investmentAmount"
                    value={formData.investmentAmount}
                    onChange={handleChange}
                    placeholder={
                      prospectus.minimumInvestment
                        ? String(prospectus.minimumInvestment)
                        : '50000'
                    }
                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a961] ${
                      errors.investmentAmount ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.investmentAmount && (
                  <p className="text-red-500 text-sm mt-1">{errors.investmentAmount}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Minimum:{' '}
                  {prospectus.minimumInvestment
                    ? formatCurrency(prospectus.minimumInvestment)
                    : 'TBD'}
                </p>
              </div>

              <div>
                <label
                  htmlFor="fundingSource"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Source of Funds *
                </label>
                <select
                  id="fundingSource"
                  name="fundingSource"
                  value={formData.fundingSource}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a961] ${
                    errors.fundingSource ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select funding source</option>
                  <option value="personal_savings">Personal Savings</option>
                  <option value="retirement_account">Retirement Account (IRA/401k)</option>
                  <option value="trust">Trust</option>
                  <option value="business_entity">Business Entity</option>
                  <option value="other">Other</option>
                </select>
                {errors.fundingSource && (
                  <p className="text-red-500 text-sm mt-1">{errors.fundingSource}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="investorType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Investor Type *
                </label>
                <select
                  id="investorType"
                  name="investorType"
                  value={formData.investorType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a961] ${
                    errors.investorType ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select investor type</option>
                  <option value="individual">Individual</option>
                  <option value="joint">Joint (Married)</option>
                  <option value="entity">Entity (LLC/Corp)</option>
                  <option value="trust">Trust</option>
                  <option value="ira">IRA/Retirement Account</option>
                </select>
                {errors.investorType && (
                  <p className="text-red-500 text-sm mt-1">{errors.investorType}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="investorNotes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="investorNotes"
                  name="investorNotes"
                  value={formData.investorNotes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any questions or comments for our team..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a961]"
                />
              </div>
            </div>
          </div>

          {/* Acknowledgments */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display text-lg text-[#1a1a1a] mb-4">
              Required Acknowledgments
            </h2>

            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg border ${errors.accreditedStatus ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="accreditedStatus"
                    checked={formData.accreditedStatus}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-[#c9a961] rounded focus:ring-[#c9a961]"
                  />
                  <div>
                    <p className="font-medium text-[#1a1a1a]">
                      Accredited Investor Certification *
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      I certify that I am an accredited investor as defined by SEC Rule
                      501 of Regulation D, with a net worth exceeding $1,000,000
                      (excluding primary residence) or annual income exceeding $200,000
                      ($300,000 with spouse) for the past two years.
                    </p>
                  </div>
                </label>
                {errors.accreditedStatus && (
                  <p className="text-red-500 text-sm mt-2 ml-7">
                    {errors.accreditedStatus}
                  </p>
                )}
              </div>

              <div
                className={`p-4 rounded-lg border ${errors.riskAcknowledgment ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="riskAcknowledgment"
                    checked={formData.riskAcknowledgment}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-[#c9a961] rounded focus:ring-[#c9a961]"
                  />
                  <div>
                    <p className="font-medium text-[#1a1a1a]">Risk Acknowledgment *</p>
                    <p className="text-sm text-gray-600 mt-1">
                      I understand that investing in real estate involves significant
                      risk, including the potential loss of my entire investment. I have
                      reviewed the investment materials and understand the risks involved.
                    </p>
                  </div>
                </label>
                {errors.riskAcknowledgment && (
                  <p className="text-red-500 text-sm mt-2 ml-7">
                    {errors.riskAcknowledgment}
                  </p>
                )}
              </div>

              <div
                className={`p-4 rounded-lg border ${errors.termsAccepted ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-[#c9a961] rounded focus:ring-[#c9a961]"
                  />
                  <div>
                    <p className="font-medium text-[#1a1a1a]">Terms & Conditions *</p>
                    <p className="text-sm text-gray-600 mt-1">
                      I have read and agree to the{' '}
                      <a href="#" className="text-[#c9a961] hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-[#c9a961] hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                </label>
                {errors.termsAccepted && (
                  <p className="text-red-500 text-sm mt-2 ml-7">{errors.termsAccepted}</p>
                )}
              </div>
            </div>
          </div>

          {/* Digital Signature */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display text-lg text-[#1a1a1a] mb-4">
              Digital Signature
            </h2>

            <div className="space-y-4">
              <div>
                <SignaturePad
                  label="Sign Here"
                  required
                  onSave={(dataUrl) => {
                    setFormData((prev) => ({...prev, signatureImage: dataUrl}))
                    if (errors.signatureImage) {
                      setErrors((prev) => {
                        const newErrors = {...prev}
                        delete newErrors.signatureImage
                        return newErrors
                      })
                    }
                  }}
                  onClear={() => {
                    setFormData((prev) => ({...prev, signatureImage: ''}))
                  }}
                />
                {errors.signatureImage && (
                  <p className="text-red-500 text-sm mt-1">{errors.signatureImage}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="printedName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Print Full Legal Name *
                </label>
                <input
                  type="text"
                  id="printedName"
                  name="printedName"
                  value={formData.printedName}
                  onChange={handleChange}
                  placeholder={user?.fullName || 'Your Full Name'}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a961] ${
                    errors.printedName ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.printedName && (
                  <p className="text-red-500 text-sm mt-1">{errors.printedName}</p>
                )}
              </div>

              <p className="text-sm text-gray-500">
                By signing above and entering your name, you are providing a legally binding
                electronic signature.
              </p>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Letter of Intent'
              )}
            </button>
            <Link
              to={`/investor/opportunities/${prospectus.slug}`}
              className="px-8 py-3 rounded-lg font-semibold border border-gray-200 text-[#1a1a1a] hover:bg-gray-50 text-center"
            >
              Cancel
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500">
            This Letter of Intent is non-binding and does not create any obligation on
            either party. Final investment terms will be documented in a separate
            subscription agreement.
          </p>
        </form>
      </div>
    </div>
  )
}
