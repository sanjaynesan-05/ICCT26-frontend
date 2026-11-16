import React, { useState, useRef } from 'react'
import { Upload, X, FileCheck2, AlertCircle } from 'lucide-react'
import { validateFile, getFileUploadHelpText } from '../lib/fileValidation'

interface Props {
  file: File | null
  onFileChange: (file: File | null) => void
  accept?: string
  placeholder?: string
  className?: string
}

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

const FileUpload: React.FC<Props> = ({
  file,
  onFileChange,
  accept = '.jpg,.jpeg,.png,.pdf',
  placeholder = 'Upload file',
  className = '',
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
    e.preventDefault()
    e.stopPropagation()
    onFileChange(null)
    if (inputRef.current) inputRef.current.value = ''
    setError('')
  }

  return (
    <div className={className}>
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border-2 border-pitch/40 bg-pitch/5 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-pitch text-white">
            <FileCheck2 className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{file.name}</p>
            <p className="text-xs text-muted-dark">{formatSize(file.size)} · ready to submit</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-dark hover:bg-flame/10 hover:text-flame"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
            dragActive ? 'border-gold bg-gold/10' : 'border-ink/20 bg-white hover:border-ink/50'
          }`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink">
            <Upload className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold text-ink">{placeholder}</span>
          <span className="text-xs text-muted-dark">{getFileUploadHelpText()}</span>
          <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
        </label>
      )}

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-flame" role="alert">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}
    </div>
  )
}

export default FileUpload
