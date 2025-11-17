import React, { useState, useRef } from 'react'
import { Upload, X, CheckCircle } from 'lucide-react'
import { validateFile, getFileUploadHelpText, ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB } from '../lib/fileValidation'

interface Props {
  file: File | null
  onFileChange: (file: File | null) => void
  accept?: string
  placeholder?: string
  className?: string
}

const FileUpload: React.FC<Props> = ({ 
  file, 
  onFileChange, 
  accept = '.jpg,.jpeg,.png,.pdf', 
  placeholder = 'Upload file', 
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFile = (f: File) => {
    const validation = validateFile(f)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setError('')
    onFileChange(f)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = e.dataTransfer.files
    if (files && files[0]) handleFile(files[0])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFileChange(null)
    if (inputRef.current) inputRef.current.value = ''
    setError('')
  }

  const CricketAnimation = () => (
    <svg className="w-6 h-6" viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      {/* Bat */}
      <g transform="translate(10,32)">
        <rect x="0" y="-24" width="6" height="36" rx="2" fill="#8B5CF6" transform="rotate(-20 3 0)">
          <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" values="-20 3 0;10 3 0;-20 3 0" repeatCount="indefinite" />
        </rect>
        <rect x="6" y="4" width="18" height="6" rx="3" fill="#F59E0B" transform="rotate(-20 15 7)">
          <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" values="-20 15 7;10 15 7;-20 15 7" repeatCount="indefinite" />
        </rect>
      </g>

      {/* Ball (bouncing) */}
      <g>
        <circle cx="48" cy="12" r="5" fill="#EF4444">
          <animateTransform attributeName="transform" attributeType="XML" type="translate" dur="1s" values="0 0; -8 14; 0 0" repeatCount="indefinite" />
        </circle>
        <ellipse cx="48" cy="22" rx="6" ry="2.4" fill="#000" opacity="0.12">
          <animate attributeName="opacity" dur="1s" values="0.12;0.3;0.12" repeatCount="indefinite" />
          <animateTransform attributeName="transform" attributeType="XML" type="translate" dur="1s" values="0 0; -8 14; 0 0" repeatCount="indefinite" />
        </ellipse>
      </g>
    </svg>
  )

  return (
    <div className={className}>
      <div className="relative">
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex items-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:shadow-md transition text-sm ${dragActive ? 'border-gray-700 bg-gray-100' : 'border-gray-300'}`}
        >
          {file ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Upload className="w-5 h-5 text-gray-600" />
          )}
          <span className="truncate max-w-[180px] text-gray-700 font-subheading text-sm">{file ? file.name : placeholder}</span>
          <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
        </label>

        {file && (
          <button
            type="button"
            className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-gray-200 text-gray-500 shadow"
            style={{ zIndex: 2, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={handleClear}
            aria-label="Cancel upload"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-xs mt-2">❌ {error}</p>
      )}

      <p className="text-xs text-gray-600 mt-2">{getFileUploadHelpText()}</p>
    </div>
  )
}

export default FileUpload
