/**
 * File Validation Utility
 * Validates uploaded files against allowed formats (JPEG, PNG, PDF) and size limits
 */

// Allowed file extensions
export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf']

// Allowed MIME types
export const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'application/pdf']

// Maximum file size in bytes (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024
export const MAX_FILE_SIZE_MB = 5

/**
 * Get file extension from filename
 */
const getFileExtension = (filename: string): string => {
  return '.' + filename.split('.').pop()?.toLowerCase()
}

/**
 * Check if file type is valid based on extension
 */
export const isValidFileExtension = (file: File): boolean => {
  const extension = getFileExtension(file.name)
  return ALLOWED_EXTENSIONS.includes(extension)
}

/**
 * Check if file type is valid based on MIME type
 */
export const isValidMimeType = (file: File): boolean => {
  return ALLOWED_MIMES.includes(file.type)
}

/**
 * Check if file size is valid
 */
export const isValidFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE
}

/**
 * Get file type error message
 */
export const getFileTypeError = (file: File): string | null => {
  // Check extension first (user-facing)
  if (!isValidFileExtension(file)) {
    return `Invalid file format: ${getFileExtension(file.name)}. Only JPEG (.jpg, .jpeg), PNG (.png), and PDF (.pdf) are allowed.`
  }

  // Check MIME type (security)
  if (!isValidMimeType(file)) {
    return `Invalid file type: ${file.type || 'unknown'}. Only JPEG, PNG, and PDF files are allowed.`
  }

  return null
}

/**
 * Get file size error message
 */
export const getFileSizeError = (file: File): string | null => {
  if (!isValidFileSize(file)) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1)
    return `File too large: ${sizeInMB}MB. Maximum allowed: ${MAX_FILE_SIZE_MB}MB`
  }

  return null
}

/**
 * Comprehensive file validation
 * Returns object with validation status and error message if invalid
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const typeError = getFileTypeError(file)
  if (typeError) {
    return { valid: false, error: typeError }
  }

  // Check file size
  const sizeError = getFileSizeError(file)
  if (sizeError) {
    return { valid: false, error: sizeError }
  }

  // All validations passed
  return { valid: true }
}

/**
 * Get supported formats as a readable string
 */
export const getSupportedFormats = (): string => {
  return 'JPEG (.jpg, .jpeg), PNG (.png), PDF (.pdf)'
}

/**
 * Get help text for file upload fields
 */
export const getFileUploadHelpText = (): string => {
  return `Supported: ${getSupportedFormats()} | Max ${MAX_FILE_SIZE_MB}MB`
}
