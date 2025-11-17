/**
 * ICCT26 Validation Unit Tests
 * Tests all validation functions
 * Created: November 17, 2025
 */

import { describe, it, expect } from '@jest/globals'
import {
  isValidName,
  isValidTeamName,
  isValidPhone,
  isValidEmail,
  isValidFileMimeType,
  isValidFileSize,
  isValidFileExtension,
  isValidFile,
  sanitizeFilename
} from '../../src/utils/validation'

describe('Name Validation', () => {
  it('should accept valid names', () => {
    expect(isValidName('John Doe').isValid).toBe(true)
    expect(isValidName("O'Connor").isValid).toBe(true)
    expect(isValidName('Mary-Jane Smith').isValid).toBe(true)
    expect(isValidName('ABC').isValid).toBe(true) // Min length
  })

  it('should reject names that are too short', () => {
    const result = isValidName('AB')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('at least 3 characters')
  })

  it('should reject names that are too long', () => {
    const result = isValidName('A'.repeat(51))
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('must not exceed 50 characters')
  })

  it('should reject names with invalid characters', () => {
    const result = isValidName('John123')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('can only contain letters')
  })

  it('should reject empty names', () => {
    const result = isValidName('')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('required')
  })
})

describe('Team Name Validation', () => {
  it('should accept valid team names', () => {
    expect(isValidTeamName('Warriors 2024').isValid).toBe(true)
    expect(isValidTeamName("St. Peter's Lions").isValid).toBe(true)
    expect(isValidTeamName('ABC').isValid).toBe(true) // Min length
  })

  it('should reject team names that are too short', () => {
    const result = isValidTeamName('AB')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('at least 3 characters')
  })

  it('should reject team names that are too long', () => {
    const result = isValidTeamName('A'.repeat(81))
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('must not exceed 80 characters')
  })

  it('should accept team names with numbers', () => {
    expect(isValidTeamName('Team 123').isValid).toBe(true)
  })
})

describe('Phone Validation', () => {
  it('should accept valid 10-digit phone numbers', () => {
    expect(isValidPhone('9876543210').isValid).toBe(true)
    expect(isValidPhone('1234567890').isValid).toBe(true)
  })

  it('should reject phone numbers with less than 10 digits', () => {
    const result = isValidPhone('987654321')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('exactly 10 digits')
  })

  it('should reject phone numbers with more than 10 digits', () => {
    const result = isValidPhone('98765432101')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('exactly 10 digits')
  })

  it('should reject phone numbers with non-numeric characters', () => {
    const result = isValidPhone('987-654-321')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('exactly 10 digits')
  })

  it('should reject empty phone numbers', () => {
    const result = isValidPhone('')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('required')
  })
})

describe('Email Validation', () => {
  it('should accept valid email addresses', () => {
    expect(isValidEmail('test@example.com').isValid).toBe(true)
    expect(isValidEmail('user.name+tag@domain.co.in').isValid).toBe(true)
    expect(isValidEmail('user_123@test-domain.com').isValid).toBe(true)
  })

  it('should reject email without @', () => {
    const result = isValidEmail('testexample.com')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('valid email')
  })

  it('should reject email without domain', () => {
    const result = isValidEmail('test@')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('valid email')
  })

  it('should reject email without TLD', () => {
    const result = isValidEmail('test@domain')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('valid email')
  })

  it('should reject empty emails', () => {
    const result = isValidEmail('')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('required')
  })
})

describe('File MIME Type Validation', () => {
  it('should accept PNG files', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    expect(isValidFileMimeType(file).isValid).toBe(true)
  })

  it('should accept JPEG files', () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    expect(isValidFileMimeType(file).isValid).toBe(true)
  })

  it('should accept PDF files', () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    expect(isValidFileMimeType(file).isValid).toBe(true)
  })

  it('should reject unsupported MIME types', () => {
    const file = new File(['test'], 'test.gif', { type: 'image/gif' })
    const result = isValidFileMimeType(file)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('Invalid file type')
  })
})

describe('File Size Validation', () => {
  it('should accept files under 5MB', () => {
    const file = new File(['x'.repeat(1024 * 1024)], 'test.png', { type: 'image/png' }) // 1MB
    expect(isValidFileSize(file).isValid).toBe(true)
  })

  it('should accept files exactly 5MB', () => {
    const file = new File(['x'.repeat(5 * 1024 * 1024)], 'test.png', { type: 'image/png' }) // 5MB
    expect(isValidFileSize(file).isValid).toBe(true)
  })

  it('should reject files over 5MB', () => {
    const file = new File(['x'.repeat(6 * 1024 * 1024)], 'test.png', { type: 'image/png' }) // 6MB
    const result = isValidFileSize(file)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('must not exceed 5MB')
  })
})

describe('File Extension Validation', () => {
  it('should accept .png files', () => {
    const file = new File(['test'], 'document.png', { type: 'image/png' })
    expect(isValidFileExtension(file).isValid).toBe(true)
  })

  it('should accept .jpg files', () => {
    const file = new File(['test'], 'document.jpg', { type: 'image/jpeg' })
    expect(isValidFileExtension(file).isValid).toBe(true)
  })

  it('should accept .jpeg files', () => {
    const file = new File(['test'], 'document.jpeg', { type: 'image/jpeg' })
    expect(isValidFileExtension(file).isValid).toBe(true)
  })

  it('should accept .pdf files', () => {
    const file = new File(['test'], 'document.pdf', { type: 'application/pdf' })
    expect(isValidFileExtension(file).isValid).toBe(true)
  })

  it('should reject unsupported extensions', () => {
    const file = new File(['test'], 'document.gif', { type: 'image/gif' })
    const result = isValidFileExtension(file)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('must be')
  })
})

describe('Complete File Validation', () => {
  it('should accept valid files', () => {
    const file = new File(['x'.repeat(1024)], 'test.png', { type: 'image/png' }) // 1KB PNG
    expect(isValidFile(file).isValid).toBe(true)
  })

  it('should reject files with invalid MIME', () => {
    const file = new File(['test'], 'test.gif', { type: 'image/gif' })
    const result = isValidFile(file)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('Invalid file type')
  })

  it('should reject files that are too large', () => {
    const file = new File(['x'.repeat(6 * 1024 * 1024)], 'test.png', { type: 'image/png' })
    const result = isValidFile(file)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('must not exceed')
  })

  it('should reject files with invalid extension', () => {
    const file = new File(['test'], 'test.exe', { type: 'application/octet-stream' })
    const result = isValidFile(file)
    expect(result.isValid).toBe(false)
  })
})

describe('Filename Sanitization', () => {
  it('should preserve valid filenames', () => {
    expect(sanitizeFilename('document.pdf')).toBe('document.pdf')
    expect(sanitizeFilename('my-file_123.png')).toBe('my-file_123.png')
  })

  it('should replace invalid characters with underscores', () => {
    expect(sanitizeFilename('my file!@#.pdf')).toBe('my_file____.pdf')
    expect(sanitizeFilename('résumé.pdf')).toBe('r_sum_.pdf')
  })

  it('should handle filenames without extensions', () => {
    expect(sanitizeFilename('document')).toBe('document')
  })

  it('should handle empty filenames', () => {
    expect(sanitizeFilename('')).toBe('')
  })

  it('should preserve file extensions', () => {
    expect(sanitizeFilename('my weird file!.pdf').endsWith('.pdf')).toBe(true)
  })
})
