import {useState} from 'react'
import {Link, useLoaderData, useNavigate} from 'react-router'
import {
  ArrowLeft,
  Building,
  Calendar,
  DollarSign,
  User,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import {getViewClient} from '~/sanity/client.server'
import {SignaturePad} from '~/components/SignaturePad'
import type {Route} from './+types/lois.$id.countersign'

const LOI_DETAIL_QUERY = `*[_type == "letterOfIntent" && _id == $id][0]{
  _id,
  status,
  investmentAmount,
  submittedAt,
  investorNotes,
  investorSignature {
    signed,
    signedAt,
    printedName,
    "signatureImageUrl": signatureImage.asset->url
  },
  "investor": investor->{
    _id,
    name,
    email
  },
  "prospectus": prospectus->{
    _id,
    title,
    slug,
    targetReturn
  }
}`

interface LOIDetail {
  _id: string
  status: string
  investmentAmount: number
  submittedAt: string
  investorNotes?: string
  investorSignature?: {
    signed: boolean
    signedAt: string
    printedName: string
    signatureImageUrl?: string
  }
  investor: {
    _id: string
    name: string
    email: string
  }
  prospectus: {
    _id: string
    title: string
    slug: string
    targetReturn: string
  }
}

export async function loader({params}: Route.LoaderArgs) {
  const loi = await getViewClient().fetch<LOIDetail>(LOI_DETAIL_QUERY, {
    id: params.id,
  })

  if (!loi) {
    throw new Response('LOI not found', {status: 404})
  }

  if (loi.status !== 'approved') {
    throw new Response('LOI must be approved before countersigning', {status: 400})
  }

  return {loi}
}

export function meta() {
  return [
    {title: 'Countersign LOI | Admin'},
  ]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function CountersignLOI() {
  const {loi} = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    signerName: '',
    signerEmail: '',
    signerTitle: '',
    signatureImage: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.signerName.trim()) {
      newErrors.signerName = 'Your name is required'
    }
    if (!formData.signerEmail.trim()) {
      newErrors.signerEmail = 'Your email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.signerEmail)) {
      newErrors.signerEmail = 'Please enter a valid email address'
    }
    if (!formData.signerTitle.trim()) {
      newErrors.signerTitle = 'Your title is required'
    }
    if (!formData.signatureImage) {
      newErrors.signatureImage = 'Please provide your signature'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/resource/countersign-loi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loiId: loi._id,
          ...formData,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to countersign LOI')
      }

      setSubmitSuccess(true)
      // Redirect back to LOIs after 2 seconds
      setTimeout(() => {
        navigate('/admin/lois')
      }, 2000)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 rounded-xl border border-green-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-display text-2xl text-green-800 mb-2">
            LOI Countersigned Successfully
          </h2>
          <p className="text-green-600 mb-4">
            The Letter of Intent has been countersigned. The investor will be notified.
          </p>
          <Link
            to="/admin/lois"
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
          >
            <ArrowLeft size={16} />
            Return to LOIs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        to="/admin/lois"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Letters of Intent
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-[#1a1a1a] mb-2">
          Countersign Letter of Intent
        </h1>
        <p className="text-gray-600">
          Review the LOI details and add your signature to complete the countersigning process.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LOI Details */}
        <div className="space-y-6">
          {/* Investor Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display text-lg text-[#1a1a1a] mb-4 flex items-center gap-2">
              <User size={18} className="text-gray-400" />
              Investor Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-[#1a1a1a]">{loi.investor.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-[#1a1a1a]">{loi.investor.email}</p>
              </div>
            </div>
          </div>

          {/* Opportunity Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display text-lg text-[#1a1a1a] mb-4 flex items-center gap-2">
              <Building size={18} className="text-gray-400" />
              Investment Opportunity
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Project</p>
                <p className="font-medium text-[#1a1a1a]">{loi.prospectus.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Target Return</p>
                <p className="font-medium text-green-600">{loi.prospectus.targetReturn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Investment Amount</p>
                <p className="font-bold text-2xl text-[#1a1a1a]">
                  {formatCurrency(loi.investmentAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Investor Signature */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display text-lg text-[#1a1a1a] mb-4 flex items-center gap-2">
              <FileText size={18} className="text-gray-400" />
              Investor Signature
            </h2>
            {loi.investorSignature ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Signed By</p>
                  <p className="font-medium text-[#1a1a1a]">
                    {loi.investorSignature.printedName || loi.investor.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Signed On</p>
                  <p className="font-medium text-[#1a1a1a] flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(loi.investorSignature.signedAt).toLocaleString()}
                  </p>
                </div>
                {loi.investorSignature.signatureImageUrl && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Signature</p>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <img
                        src={loi.investorSignature.signatureImageUrl}
                        alt="Investor Signature"
                        className="max-w-full h-auto max-h-32"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">No signature on file</p>
            )}
          </div>
        </div>

        {/* Countersign Form */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-display text-lg text-[#1a1a1a] mb-6">
            Company Signature
          </h2>

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Submission Failed</p>
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Signer Name */}
            <div>
              <label htmlFor="signerName" className="block text-sm font-medium text-[#1a1a1a] mb-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="signerName"
                value={formData.signerName}
                onChange={(e) => {
                  setFormData((prev) => ({...prev, signerName: e.target.value}))
                  if (errors.signerName) {
                    setErrors((prev) => ({...prev, signerName: ''}))
                  }
                }}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.signerName ? 'border-red-300' : 'border-gray-200'
                } focus:border-[#c9a961] focus:ring-1 focus:ring-[#c9a961] outline-none transition-colors`}
                placeholder="John Smith"
              />
              {errors.signerName && (
                <p className="mt-1 text-sm text-red-500">{errors.signerName}</p>
              )}
            </div>

            {/* Signer Email */}
            <div>
              <label htmlFor="signerEmail" className="block text-sm font-medium text-[#1a1a1a] mb-1">
                Your Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="signerEmail"
                value={formData.signerEmail}
                onChange={(e) => {
                  setFormData((prev) => ({...prev, signerEmail: e.target.value}))
                  if (errors.signerEmail) {
                    setErrors((prev) => ({...prev, signerEmail: ''}))
                  }
                }}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.signerEmail ? 'border-red-300' : 'border-gray-200'
                } focus:border-[#c9a961] focus:ring-1 focus:ring-[#c9a961] outline-none transition-colors`}
                placeholder="john@goldengatehomeadvisors.com"
              />
              {errors.signerEmail && (
                <p className="mt-1 text-sm text-red-500">{errors.signerEmail}</p>
              )}
            </div>

            {/* Signer Title */}
            <div>
              <label htmlFor="signerTitle" className="block text-sm font-medium text-[#1a1a1a] mb-1">
                Your Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="signerTitle"
                value={formData.signerTitle}
                onChange={(e) => {
                  setFormData((prev) => ({...prev, signerTitle: e.target.value}))
                  if (errors.signerTitle) {
                    setErrors((prev) => ({...prev, signerTitle: ''}))
                  }
                }}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.signerTitle ? 'border-red-300' : 'border-gray-200'
                } focus:border-[#c9a961] focus:ring-1 focus:ring-[#c9a961] outline-none transition-colors`}
                placeholder="Managing Director"
              />
              {errors.signerTitle && (
                <p className="mt-1 text-sm text-red-500">{errors.signerTitle}</p>
              )}
            </div>

            {/* Signature Pad */}
            <div>
              <SignaturePad
                label="Your Signature"
                required
                width={400}
                height={150}
                onSave={(dataUrl) => {
                  setFormData((prev) => ({...prev, signatureImage: dataUrl}))
                  if (errors.signatureImage) {
                    setErrors((prev) => ({...prev, signatureImage: ''}))
                  }
                }}
                onClear={() => {
                  setFormData((prev) => ({...prev, signatureImage: ''}))
                }}
              />
              {errors.signatureImage && (
                <p className="mt-1 text-sm text-red-500">{errors.signatureImage}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#c9a961] hover:bg-[#b8994d] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Countersign LOI
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-500 text-center">
            By signing, you confirm that Golden Gate Home Advisors acknowledges
            and accepts this Letter of Intent.
          </p>
        </div>
      </div>
    </div>
  )
}
