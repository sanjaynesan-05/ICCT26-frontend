/**
 * ICCT26 Frontend Idempotency Module
 * Prevents duplicate submissions with UUID-based idempotency keys
 * Created: November 17, 2025
 */

import { v4 as uuidv4 } from 'uuid'

// ============================================================================
// CONSTANTS
// ============================================================================

const IDEMPOTENCY_KEY_PREFIX = 'icct26_idempotency_'
const IDEMPOTENCY_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

// ============================================================================
// TYPES
// ============================================================================

interface IdempotencyRecord {
  key: string
  timestamp: number
  status: 'pending' | 'success' | 'failed'
  teamId?: string
}

// ============================================================================
// IDEMPOTENCY KEY GENERATION
// ============================================================================

/**
 * Generates a new UUID v4 idempotency key
 * @returns UUID string (e.g., "550e8400-e29b-41d4-a716-446655440000")
 */
export function generateIdempotencyKey(): string {
  return uuidv4()
}

// ============================================================================
// LOCALSTORAGE MANAGEMENT
// ============================================================================

/**
 * Gets the localStorage key for a specific idempotency key
 */
function getStorageKey(idempotencyKey: string): string {
  return `${IDEMPOTENCY_KEY_PREFIX}${idempotencyKey}`
}

/**
 * Saves idempotency record to localStorage
 */
export function saveIdempotencyRecord(
  idempotencyKey: string,
  status: 'pending' | 'success' | 'failed',
  teamId?: string
): void {
  const record: IdempotencyRecord = {
    key: idempotencyKey,
    timestamp: Date.now(),
    status,
    teamId
  }

  try {
    localStorage.setItem(getStorageKey(idempotencyKey), JSON.stringify(record))
  } catch (error) {
    console.error('Failed to save idempotency record:', error)
  }
}

/**
 * Gets idempotency record from localStorage
 */
export function getIdempotencyRecord(idempotencyKey: string): IdempotencyRecord | null {
  try {
    const data = localStorage.getItem(getStorageKey(idempotencyKey))
    if (!data) return null

    const record: IdempotencyRecord = JSON.parse(data)

    // Check if expired (24 hours)
    if (Date.now() - record.timestamp > IDEMPOTENCY_EXPIRY_MS) {
      removeIdempotencyRecord(idempotencyKey)
      return null
    }

    return record
  } catch (error) {
    console.error('Failed to get idempotency record:', error)
    return null
  }
}

/**
 * Removes idempotency record from localStorage
 */
export function removeIdempotencyRecord(idempotencyKey: string): void {
  try {
    localStorage.removeItem(getStorageKey(idempotencyKey))
  } catch (error) {
    console.error('Failed to remove idempotency record:', error)
  }
}

/**
 * Checks if an idempotency key is currently pending
 */
export function isPending(idempotencyKey: string): boolean {
  const record = getIdempotencyRecord(idempotencyKey)
  return record?.status === 'pending'
}

/**
 * Checks if an idempotency key has succeeded
 */
export function hasSucceeded(idempotencyKey: string): boolean {
  const record = getIdempotencyRecord(idempotencyKey)
  return record?.status === 'success'
}

/**
 * Checks if an idempotency key has failed
 */
export function hasFailed(idempotencyKey: string): boolean {
  const record = getIdempotencyRecord(idempotencyKey)
  return record?.status === 'failed'
}

// ============================================================================
// CLEANUP UTILITIES
// ============================================================================

/**
 * Cleans up all expired idempotency records from localStorage
 */
export function cleanupExpiredRecords(): void {
  try {
    const keysToRemove: string[] = []

    // Find all idempotency keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(IDEMPOTENCY_KEY_PREFIX)) {
        const idempotencyKey = key.replace(IDEMPOTENCY_KEY_PREFIX, '')
        const record = getIdempotencyRecord(idempotencyKey)
        
        // If record is null (expired), it's already removed by getIdempotencyRecord
        // If record exists but is old success/failed, remove it
        if (record && record.status !== 'pending') {
          if (Date.now() - record.timestamp > IDEMPOTENCY_EXPIRY_MS) {
            keysToRemove.push(idempotencyKey)
          }
        }
      }
    }

    // Remove expired keys
    keysToRemove.forEach(key => removeIdempotencyRecord(key))

    console.log(`Cleaned up ${keysToRemove.length} expired idempotency records`)
  } catch (error) {
    console.error('Failed to cleanup expired records:', error)
  }
}

/**
 * Gets all active idempotency records (for debugging)
 */
export function getAllIdempotencyRecords(): IdempotencyRecord[] {
  const records: IdempotencyRecord[] = []

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(IDEMPOTENCY_KEY_PREFIX)) {
        const idempotencyKey = key.replace(IDEMPOTENCY_KEY_PREFIX, '')
        const record = getIdempotencyRecord(idempotencyKey)
        if (record) {
          records.push(record)
        }
      }
    }
  } catch (error) {
    console.error('Failed to get all idempotency records:', error)
  }

  return records
}

// ============================================================================
// LAST SUBMISSION TRACKING
// ============================================================================

const LAST_SUBMISSION_KEY = 'icct26_last_submission'

interface LastSubmission {
  teamId: string
  teamName: string
  timestamp: number
  idempotencyKey: string
}

/**
 * Saves the last successful submission to localStorage
 */
export function saveLastSubmission(
  teamId: string,
  teamName: string,
  idempotencyKey: string
): void {
  const submission: LastSubmission = {
    teamId,
    teamName,
    timestamp: Date.now(),
    idempotencyKey
  }

  try {
    localStorage.setItem(LAST_SUBMISSION_KEY, JSON.stringify(submission))
  } catch (error) {
    console.error('Failed to save last submission:', error)
  }
}

/**
 * Gets the last successful submission from localStorage
 */
export function getLastSubmission(): LastSubmission | null {
  try {
    const data = localStorage.getItem(LAST_SUBMISSION_KEY)
    if (!data) return null

    const submission: LastSubmission = JSON.parse(data)

    // Check if expired (7 days)
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - submission.timestamp > SEVEN_DAYS_MS) {
      clearLastSubmission()
      return null
    }

    return submission
  } catch (error) {
    console.error('Failed to get last submission:', error)
    return null
  }
}

/**
 * Clears the last submission from localStorage
 */
export function clearLastSubmission(): void {
  try {
    localStorage.removeItem(LAST_SUBMISSION_KEY)
  } catch (error) {
    console.error('Failed to clear last submission:', error)
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize idempotency module (run on app startup)
 * Cleans up expired records
 */
export function initializeIdempotency(): void {
  cleanupExpiredRecords()
  console.log('Idempotency module initialized')
}
