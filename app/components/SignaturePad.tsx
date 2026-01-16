import {useRef, useEffect, useState} from 'react'
import SignatureCanvas from 'react-signature-canvas'
import {Eraser, Check} from 'lucide-react'

interface SignaturePadProps {
  onSave: (dataUrl: string) => void
  onClear?: () => void
  initialValue?: string
  width?: number
  height?: number
  label?: string
  required?: boolean
}

export function SignaturePad({
  onSave,
  onClear,
  initialValue,
  width = 500,
  height = 200,
  label = 'Signature',
  required = false,
}: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null)
  const [isEmpty, setIsEmpty] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (initialValue && sigCanvas.current) {
      sigCanvas.current.fromDataURL(initialValue)
      setIsEmpty(false)
      setIsSaved(true)
    }
  }, [initialValue])

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear()
      setIsEmpty(true)
      setIsSaved(false)
      onClear?.()
    }
  }

  const handleEnd = () => {
    if (sigCanvas.current) {
      const isCanvasEmpty = sigCanvas.current.isEmpty()
      setIsEmpty(isCanvasEmpty)
      if (!isCanvasEmpty) {
        const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')
        onSave(dataUrl)
        setIsSaved(true)
      }
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#1a1a1a]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative border-2 border-dashed border-gray-300 rounded-lg bg-white overflow-hidden">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            width,
            height,
            className: 'signature-canvas w-full',
            style: {
              width: '100%',
              height: `${height}px`,
              touchAction: 'none',
            },
          }}
          penColor="#1a1a1a"
          onEnd={handleEnd}
        />

        {/* Signature line */}
        <div className="absolute bottom-8 left-8 right-8 border-b border-gray-300" />
        <span className="absolute bottom-2 left-8 text-xs text-gray-400">
          Sign above the line
        </span>

        {/* Status indicator */}
        {isSaved && !isEmpty && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
            <Check size={12} />
            Captured
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Eraser size={16} />
          Clear Signature
        </button>

        {isEmpty && (
          <span className="text-sm text-gray-400">
            Draw your signature above
          </span>
        )}
      </div>
    </div>
  )
}

// Compact version for smaller forms
export function SignaturePadCompact({
  onSave,
  onClear,
  label = 'Signature',
  required = false,
}: Omit<SignaturePadProps, 'width' | 'height'>) {
  return (
    <SignaturePad
      onSave={onSave}
      onClear={onClear}
      label={label}
      required={required}
      width={400}
      height={150}
    />
  )
}
