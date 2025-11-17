/**
 * ICCT26 Frontend Validation Module
 * Production-grade validation aligned with backend requirements
 * Created: November 17, 2025
 */

// ============================================================================
// VALIDATION RULES (Must match backend exactly)
// ============================================================================

const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[A-Za-z '\-]{3,50}$/,
    DESCRIPTION: "3-50 characters, letters, spaces, hyphens, and apostrophes only"
  },
  TEAM_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 80,
    PATTERN: /^[A-Za-z0-9 '\-]{3,80}$/,
    DESCRIPTION: "3-80 characters, alphanumeric, spaces, hyphens, and apostrophes only"
  },
  PHONE: {
    PATTERN: /^[0-9]{10}$/,
    DESCRIPTION: "Exactly 10 digits"
  },
  EMAIL: {
    PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    DESCRIPTION: "Valid email format"
  },
  FILE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB in bytes
    ALLOWED_MIME_TYPES: [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/pdf'
    ],
    ALLOWED_EXTENSIONS: ['png', 'jpg', 'jpeg', 'pdf'],
    DESCRIPTION: "PNG, JPEG, or PDF, max 5MB"
  }
} as const

// ============================================================================
// VALIDATION ERROR MESSAGES
// ============================================================================

export const VALIDATION_MESSAGES = {
  NAME_REQUIRED: "Name is required",
  NAME_TOO_SHORT: `Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters`,
  NAME_TOO_LONG: `Name must not exceed ${VALIDATION_RULES.NAME.MAX_LENGTH} characters`,
  NAME_INVALID_CHARS: "Name can only contain letters, spaces, hyphens, and apostrophes",
  
  TEAM_NAME_REQUIRED: "Team name is required",
  TEAM_NAME_TOO_SHORT: `Team name must be at least ${VALIDATION_RULES.TEAM_NAME.MIN_LENGTH} characters`,
  TEAM_NAME_TOO_LONG: `Team name must not exceed ${VALIDATION_RULES.TEAM_NAME.MAX_LENGTH} characters`,
  TEAM_NAME_INVALID_CHARS: "Team name can only contain letters, numbers, spaces, hyphens, and apostrophes",
  
  PHONE_REQUIRED: "Phone number is required",
  PHONE_INVALID: "Phone number must be exactly 10 digits",
  
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Please enter a valid email address",
  
  FILE_REQUIRED: "File is required",
  FILE_TOO_LARGE: `File size must not exceed ${VALIDATION_RULES.FILE.MAX_SIZE / (1024 * 1024)}MB`,
  FILE_INVALID_TYPE: `File must be ${VALIDATION_RULES.FILE.ALLOWED_EXTENSIONS.join(', ').toUpperCase()}`,
  FILE_INVALID_MIME: "Invalid file type detected",
  
  CHURCH_NAME_REQUIRED: "Church name is required",
  ROLE_REQUIRED: "Player role is required"
}

// ============================================================================
// VALIDATION RESULT TYPE
// ============================================================================

export interface ValidationResult {
  isValid: boolean
  error?: string
}

// ============================================================================
// NAME VALIDATION
// ============================================================================

/**
 * Validates person names (captain, vice-captain, players)
 * Rules: 3-50 chars, A-Z only + spaces + hyphens + apostrophes
 */
export function isValidName(name: string): ValidationResult {
  if (!name || name.trim() === '') {
    return { isValid: false, error: VALIDATION_MESSAGES.NAME_REQUIRED }
  }

  const trimmedName = name.trim()

  if (trimmedName.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    return { isValid: false, error: VALIDATION_MESSAGES.NAME_TOO_SHORT }
  }

  if (trimmedName.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    return { isValid: false, error: VALIDATION_MESSAGES.NAME_TOO_LONG }
  }

  if (!VALIDATION_RULES.NAME.PATTERN.test(trimmedName)) {
    return { isValid: false, error: VALIDATION_MESSAGES.NAME_INVALID_CHARS }
  }

  return { isValid: true }
}

// ============================================================================
// TEAM NAME VALIDATION
// ============================================================================

/**
 * Validates team names
 * Rules: 3-80 chars, alphanumeric + spaces + hyphens + apostrophes
 */
export function isValidTeamName(teamName: string): ValidationResult {
  if (!teamName || teamName.trim() === '') {
    return { isValid: false, error: VALIDATION_MESSAGES.TEAM_NAME_REQUIRED }
  }

  const trimmedName = teamName.trim()

  if (trimmedName.length < VALIDATION_RULES.TEAM_NAME.MIN_LENGTH) {
    return { isValid: false, error: VALIDATION_MESSAGES.TEAM_NAME_TOO_SHORT }
  }

  if (trimmedName.length > VALIDATION_RULES.TEAM_NAME.MAX_LENGTH) {
    return { isValid: false, error: VALIDATION_MESSAGES.TEAM_NAME_TOO_LONG }
  }

  if (!VALIDATION_RULES.TEAM_NAME.PATTERN.test(trimmedName)) {
    return { isValid: false, error: VALIDATION_MESSAGES.TEAM_NAME_INVALID_CHARS }
  }

  return { isValid: true }
}

// ============================================================================
// PHONE VALIDATION
// ============================================================================

/**
 * Validates phone numbers
 * Rules: Exactly 10 digits
 */
export function isValidPhone(phone: string): ValidationResult {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: VALIDATION_MESSAGES.PHONE_REQUIRED }
  }

  const trimmedPhone = phone.trim()

  if (!VALIDATION_RULES.PHONE.PATTERN.test(trimmedPhone)) {
    return { isValid: false, error: VALIDATION_MESSAGES.PHONE_INVALID }
  }

  return { isValid: true }
}

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

/**
 * Validates email addresses
 * Rules: RFC-like email format
 */
export function isValidEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return { isValid: false, error: VALIDATION_MESSAGES.EMAIL_REQUIRED }
  }

  const trimmedEmail = email.trim()

  if (!VALIDATION_RULES.EMAIL.PATTERN.test(trimmedEmail)) {
    return { isValid: false, error: VALIDATION_MESSAGES.EMAIL_INVALID }
  }

  return { isValid: true }
}

// ============================================================================
// FILE MIME TYPE VALIDATION
// ============================================================================

/**
 * Validates file MIME type
 * Rules: Only image/png, image/jpeg, application/pdf
 */
export function isValidFileMimeType(file: File): ValidationResult {
  if (!file) {
    return { isValid: false, error: VALIDATION_MESSAGES.FILE_REQUIRED }
  }

  if (!VALIDATION_RULES.FILE.ALLOWED_MIME_TYPES.includes(file.type)) {
    return { 
      isValid: false, 
      error: `${VALIDATION_MESSAGES.FILE_INVALID_MIME}. Got: ${file.type}` 
    }
  }

  return { isValid: true }
}

// ============================================================================
// FILE SIZE VALIDATION
// ============================================================================

/**
 * Validates file size
 * Rules: Max 5MB
 */
export function isValidFileSize(file: File): ValidationResult {
  if (!file) {
    return { isValid: false, error: VALIDATION_MESSAGES.FILE_REQUIRED }
  }

  if (file.size > VALIDATION_RULES.FILE.MAX_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
    return { 
      isValid: false, 
      error: `${VALIDATION_MESSAGES.FILE_TOO_LARGE}. File is ${sizeMB}MB` 
    }
  }

  return { isValid: true }
}

// ============================================================================
// FILE EXTENSION VALIDATION
// ============================================================================

/**
 * Validates file extension
 * Rules: Only .png, .jpg, .jpeg, .pdf
 */
export function isValidFileExtension(file: File): ValidationResult {
  if (!file) {
    return { isValid: false, error: VALIDATION_MESSAGES.FILE_REQUIRED }
  }

  const extension = file.name.split('.').pop()?.toLowerCase()
  
  if (!extension || !VALIDATION_RULES.FILE.ALLOWED_EXTENSIONS.includes(extension)) {
    return { isValid: false, error: VALIDATION_MESSAGES.FILE_INVALID_TYPE }
  }

  return { isValid: true }
}

// ============================================================================
// COMPLETE FILE VALIDATION
// ============================================================================

/**
 * Validates file completely (MIME, size, extension)
 * Use this for comprehensive file validation before upload
 */
export function isValidFile(file: File): ValidationResult {
  if (!file) {
    return { isValid: false, error: VALIDATION_MESSAGES.FILE_REQUIRED }
  }

  // Check MIME type
  const mimeValidation = isValidFileMimeType(file)
  if (!mimeValidation.isValid) {
    return mimeValidation
  }

  // Check size
  const sizeValidation = isValidFileSize(file)
  if (!sizeValidation.isValid) {
    return sizeValidation
  }

  // Check extension
  const extensionValidation = isValidFileExtension(file)
  if (!extensionValidation.isValid) {
    return extensionValidation
  }

  return { isValid: true }
}

// ============================================================================
// FILENAME SANITIZATION
// ============================================================================

/**
 * Sanitizes filename by replacing disallowed characters with underscores
 * Preserves extension
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return ''

  // Split into name and extension
  const parts = filename.split('.')
  const extension = parts.pop() || ''
  const name = parts.join('.')

  // Replace disallowed characters with underscore
  // Allow only: letters, numbers, dash, underscore, dot
  const sanitizedName = name.replace(/[^a-zA-Z0-9\-_.]/g, '_')

  return extension ? `${sanitizedName}.${extension}` : sanitizedName
}

// ============================================================================
// BATCH VALIDATION FOR FORMS
// ============================================================================

export interface FieldError {
  field: string
  error: string
}

/**
 * Validates all team registration fields
 * Returns array of errors (empty if all valid)
 */
export function validateTeamRegistration(data: {
  teamName: string
  churchName: string
  captainName: string
  captainPhone: string
  captainEmail: string
  captainWhatsapp?: string
  viceName: string
  vicePhone: string
  viceEmail: string
  viceWhatsapp?: string
  pastorLetter: File | null
  paymentReceipt: File | null
  groupPhoto: File | null
  players: Array<{
    name: string
    role: string
    aadharFile: File | null
    subscriptionFile: File | null
  }>
}): FieldError[] {
  const errors: FieldError[] = []

  // Team name
  const teamNameValidation = isValidTeamName(data.teamName)
  if (!teamNameValidation.isValid) {
    errors.push({ field: 'teamName', error: teamNameValidation.error! })
  }

  // Church name
  if (!data.churchName || data.churchName.trim() === '') {
    errors.push({ field: 'churchName', error: VALIDATION_MESSAGES.CHURCH_NAME_REQUIRED })
  }

  // Captain
  const captainNameValidation = isValidName(data.captainName)
  if (!captainNameValidation.isValid) {
    errors.push({ field: 'captainName', error: captainNameValidation.error! })
  }

  const captainPhoneValidation = isValidPhone(data.captainPhone)
  if (!captainPhoneValidation.isValid) {
    errors.push({ field: 'captainPhone', error: captainPhoneValidation.error! })
  }

  const captainEmailValidation = isValidEmail(data.captainEmail)
  if (!captainEmailValidation.isValid) {
    errors.push({ field: 'captainEmail', error: captainEmailValidation.error! })
  }

  // Captain WhatsApp (optional, but validate if provided)
  if (data.captainWhatsapp && data.captainWhatsapp.trim() !== '') {
    const captainWhatsappValidation = isValidPhone(data.captainWhatsapp)
    if (!captainWhatsappValidation.isValid) {
      errors.push({ field: 'captainWhatsapp', error: captainWhatsappValidation.error! })
    }
  }

  // Vice Captain
  const viceNameValidation = isValidName(data.viceName)
  if (!viceNameValidation.isValid) {
    errors.push({ field: 'viceName', error: viceNameValidation.error! })
  }

  const vicePhoneValidation = isValidPhone(data.vicePhone)
  if (!vicePhoneValidation.isValid) {
    errors.push({ field: 'vicePhone', error: vicePhoneValidation.error! })
  }

  const viceEmailValidation = isValidEmail(data.viceEmail)
  if (!viceEmailValidation.isValid) {
    errors.push({ field: 'viceEmail', error: viceEmailValidation.error! })
  }

  // Vice WhatsApp (optional, but validate if provided)
  if (data.viceWhatsapp && data.viceWhatsapp.trim() !== '') {
    const viceWhatsappValidation = isValidPhone(data.viceWhatsapp)
    if (!viceWhatsappValidation.isValid) {
      errors.push({ field: 'viceWhatsapp', error: viceWhatsappValidation.error! })
    }
  }

  // Team files
  if (!data.pastorLetter) {
    errors.push({ field: 'pastorLetter', error: 'Pastor letter is required' })
  } else {
    const fileValidation = isValidFile(data.pastorLetter)
    if (!fileValidation.isValid) {
      errors.push({ field: 'pastorLetter', error: fileValidation.error! })
    }
  }

  if (!data.paymentReceipt) {
    errors.push({ field: 'paymentReceipt', error: 'Payment receipt is required' })
  } else {
    const fileValidation = isValidFile(data.paymentReceipt)
    if (!fileValidation.isValid) {
      errors.push({ field: 'paymentReceipt', error: fileValidation.error! })
    }
  }

  if (!data.groupPhoto) {
    errors.push({ field: 'groupPhoto', error: 'Group photo is required' })
  } else {
    const fileValidation = isValidFile(data.groupPhoto)
    if (!fileValidation.isValid) {
      errors.push({ field: 'groupPhoto', error: fileValidation.error! })
    }
  }

  // Players (minimum 11)
  if (data.players.length < 11) {
    errors.push({ field: 'players', error: 'At least 11 players are required' })
  }

  data.players.forEach((player, index) => {
    // Player name
    const playerNameValidation = isValidName(player.name)
    if (!playerNameValidation.isValid) {
      errors.push({ 
        field: `player_${index}_name`, 
        error: `Player ${index + 1}: ${playerNameValidation.error}` 
      })
    }

    // Player role
    if (!player.role || player.role.trim() === '') {
      errors.push({ 
        field: `player_${index}_role`, 
        error: `Player ${index + 1}: ${VALIDATION_MESSAGES.ROLE_REQUIRED}` 
      })
    }

    // Player Aadhar file
    if (!player.aadharFile) {
      errors.push({ 
        field: `player_${index}_aadhar`, 
        error: `Player ${index + 1}: Aadhar card is required` 
      })
    } else {
      const fileValidation = isValidFile(player.aadharFile)
      if (!fileValidation.isValid) {
        errors.push({ 
          field: `player_${index}_aadhar`, 
          error: `Player ${index + 1} Aadhar: ${fileValidation.error}` 
        })
      }
    }

    // Player Subscription file
    if (!player.subscriptionFile) {
      errors.push({ 
        field: `player_${index}_subscription`, 
        error: `Player ${index + 1}: Subscription file is required` 
      })
    } else {
      const fileValidation = isValidFile(player.subscriptionFile)
      if (!fileValidation.isValid) {
        errors.push({ 
          field: `player_${index}_subscription`, 
          error: `Player ${index + 1} Subscription: ${fileValidation.error}` 
        })
      }
    }
  })

  return errors
}

// ============================================================================
// EXPORTS
// ============================================================================

export { VALIDATION_RULES }
