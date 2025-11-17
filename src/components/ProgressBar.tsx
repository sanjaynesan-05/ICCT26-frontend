/**
 * ICCT26 Frontend Progress Bar Component
 * Shows upload progress with animations
 * Created: November 17, 2025
 */

import React from 'react'

interface ProgressBarProps {
  progress: number // 0-100
  isVisible: boolean
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  isVisible,
  className = ''
}) => {
  if (!isVisible) return null

  const percentage = Math.min(100, Math.max(0, progress))
  const isComplete = percentage === 100

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar Container */}
      <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
        {/* Progress Fill */}
        <div
          className={`h-full transition-all duration-300 ease-out ${
            isComplete
              ? 'bg-gradient-to-r from-green-500 to-green-400'
              : 'bg-gradient-to-r from-gold via-yellow-500 to-gold'
          }`}
          style={{ width: `${percentage}%` }}
        >
          {/* Animated Shine Effect */}
          {!isComplete && percentage > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
          )}
        </div>
      </div>

      {/* Progress Text */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-300">
          {isComplete ? 'Upload Complete!' : 'Uploading...'}
        </span>
        <span className="text-sm font-bold text-gold">
          {percentage}%
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// DETAILED PROGRESS BAR WITH FILE INFO
// ============================================================================

interface DetailedProgressBarProps {
  progress: number
  isVisible: boolean
  uploadedBytes?: number
  totalBytes?: number
  fileName?: string
  className?: string
}

export const DetailedProgressBar: React.FC<DetailedProgressBarProps> = ({
  progress,
  isVisible,
  uploadedBytes = 0,
  totalBytes = 0,
  fileName = '',
  className = ''
}) => {
  if (!isVisible) return null

  const percentage = Math.min(100, Math.max(0, progress))
  const isComplete = percentage === 100

  // Format bytes to human-readable
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  return (
    <div className={`w-full p-4 bg-cricket-dark rounded-lg border border-gray-700 ${className}`}>
      {/* File Name */}
      {fileName && (
        <div className="mb-2">
          <p className="text-sm text-gray-400 truncate">
            {fileName}
          </p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
        <div
          className={`h-full transition-all duration-300 ease-out ${
            isComplete
              ? 'bg-gradient-to-r from-green-500 to-green-400'
              : 'bg-gradient-to-r from-gold via-yellow-500 to-gold'
          }`}
          style={{ width: `${percentage}%` }}
        >
          {!isComplete && percentage > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
          )}
        </div>
      </div>

      {/* Progress Details */}
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs text-gray-300">
          {totalBytes > 0 ? (
            <span>
              {formatBytes(uploadedBytes)} / {formatBytes(totalBytes)}
            </span>
          ) : (
            <span>{isComplete ? 'Upload Complete!' : 'Uploading...'}</span>
          )}
        </div>
        <div className="text-sm font-bold text-gold">
          {percentage}%
        </div>
      </div>

      {/* Status Message */}
      {isComplete && (
        <div className="mt-2 flex items-center text-green-400 text-sm">
          <svg
            className="w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Files uploaded successfully</span>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// MULTI-FILE PROGRESS BAR
// ============================================================================

interface FileProgress {
  fileName: string
  progress: number
  status: 'pending' | 'uploading' | 'complete' | 'error'
  error?: string
}

interface MultiFileProgressBarProps {
  files: FileProgress[]
  isVisible: boolean
  className?: string
}

export const MultiFileProgressBar: React.FC<MultiFileProgressBarProps> = ({
  files,
  isVisible,
  className = ''
}) => {
  if (!isVisible || files.length === 0) return null

  const totalProgress = files.reduce((sum, file) => sum + file.progress, 0) / files.length
  const completedFiles = files.filter(f => f.status === 'complete').length
  const uploadingFiles = files.filter(f => f.status === 'uploading').length
  const errorFiles = files.filter(f => f.status === 'error').length

  return (
    <div className={`w-full p-4 bg-cricket-dark rounded-lg border border-gray-700 ${className}`}>
      {/* Overall Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">
            Overall Progress
          </span>
          <span className="text-sm font-bold text-gold">
            {Math.round(totalProgress)}%
          </span>
        </div>
        <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
          <div
            className="h-full transition-all duration-300 ease-out bg-gradient-to-r from-gold via-yellow-500 to-gold"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </div>

      {/* File Count Summary */}
      <div className="flex gap-4 text-xs mb-3">
        <span className="text-gray-400">
          Total: {files.length}
        </span>
        <span className="text-green-400">
          Completed: {completedFiles}
        </span>
        {uploadingFiles > 0 && (
          <span className="text-yellow-400">
            Uploading: {uploadingFiles}
          </span>
        )}
        {errorFiles > 0 && (
          <span className="text-red-400">
            Failed: {errorFiles}
          </span>
        )}
      </div>

      {/* Individual File Progress */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {files.map((file, index) => (
          <div key={index} className="text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-300 truncate flex-1 mr-2">
                {file.fileName}
              </span>
              <span className={`font-bold ${
                file.status === 'complete' ? 'text-green-400' :
                file.status === 'error' ? 'text-red-400' :
                'text-gold'
              }`}>
                {file.status === 'complete' ? '✓' :
                 file.status === 'error' ? '✗' :
                 `${file.progress}%`}
              </span>
            </div>
            {file.status === 'error' && file.error && (
              <p className="text-red-400 text-xs mt-1">{file.error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressBar
