/**
 * Registration Form Data
 * Contains registration configuration and validation rules
 */

import type { RegistrationStep } from '../types'

/**
 * Registration Steps Configuration
 */
export const REGISTRATION_STEPS: RegistrationStep[] = [
  { number: 1, title: 'Payment' },
  { number: 2, title: 'Team Details' },
  { number: 3, title: 'Captain & Vice-Captain' },
  { number: 4, title: 'Players' },
  { number: 5, title: 'Review' },
]

/**
 * Registration Configuration
 */
export const REGISTRATION_CONFIG = {
  totalSteps: REGISTRATION_STEPS.length,
  minPlayers: 11,
  maxPlayers: 15,
  defaultPlayers: 11,
  registrationFee: 2000, // in INR
  currency: 'INR',
}

/**
 * UPI Configuration
 */
export const UPI_CONFIG = {
  upiId: 'icct26@upi',
  payeeName: 'ICCT26',
  amount: REGISTRATION_CONFIG.registrationFee,
  description: 'ICCT26 Registration Fee',
  qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent('icct26@upi')}&pn=${encodeURIComponent('ICCT26')}&am=${REGISTRATION_CONFIG.registrationFee}&tn=${encodeURIComponent('ICCT26 Registration Fee')}`,
}

/**
 * Form Validation Rules
 */
export const VALIDATION_RULES = {
  teamName: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s]+$/,
    message: 'Team name must be 3-50 characters and contain only letters and numbers',
  },
  playerName: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Player name must be 3-50 characters and contain only letters',
  },
  phone: {
    minLength: 10,
    maxLength: 10,
    pattern: /^[0-9]{10}$/,
    message: 'Phone number must be 10 digits',
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  jerseyNumber: {
    minLength: 1,
    maxLength: 2,
    pattern: /^[0-9]{1,2}$/,
    message: 'Jersey number must be 1-2 digits',
  },
}

/**
 * File Upload Configuration
 */
export const FILE_CONFIG = {
  paymentReceipt: {
    maxSize: 5 * 1024 * 1024, // 5 MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf'],
  },
  teamLogo: {
    maxSize: 5 * 1024 * 1024, // 5 MB
    allowedTypes: ['image/jpeg', 'image/png'],
    allowedExtensions: ['jpg', 'jpeg', 'png'],
  },
}

/**
 * Get step by number
 */
export const getStepByNumber = (number: number): RegistrationStep | undefined => {
  return REGISTRATION_STEPS.find(step => step.number === number)
}

/**
 * Get step title by number
 */
export const getStepTitle = (number: number): string | undefined => {
  return REGISTRATION_STEPS.find(step => step.number === number)?.title
}

/**
 * Calculate progress percentage
 */
export const calculateProgress = (currentStep: number): number => {
  return (currentStep / REGISTRATION_CONFIG.totalSteps) * 100
}

/**
 * Validate file
 */
export const validateFile = (
  file: File,
  fileType: keyof typeof FILE_CONFIG
): { valid: boolean; error?: string } => {
  const config = FILE_CONFIG[fileType]

  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${config.maxSize / (1024 * 1024)} MB`,
    }
  }

  if (!config.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${config.allowedExtensions.join(', ')}`,
    }
  }

  return { valid: true }
}
