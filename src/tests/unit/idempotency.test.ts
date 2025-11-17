import {
  generateIdempotencyKey,
  storeIdempotencyKey,
  getIdempotencyKey,
  hasValidIdempotencyKey,
  clearExpiredIdempotencyKeys,
  clearAllIdempotencyKeys,
} from '../../utils/idempotency'

describe('Idempotency Utils', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('generateIdempotencyKey', () => {
    it('should generate a valid UUID v4', () => {
      const key = generateIdempotencyKey()
      
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      expect(key).toMatch(uuidRegex)
    })

    it('should generate unique keys on multiple calls', () => {
      const key1 = generateIdempotencyKey()
      const key2 = generateIdempotencyKey()
      const key3 = generateIdempotencyKey()
      
      expect(key1).not.toBe(key2)
      expect(key2).not.toBe(key3)
      expect(key1).not.toBe(key3)
    })

    it('should generate 100 unique keys', () => {
      const keys = new Set<string>()
      for (let i = 0; i < 100; i++) {
        keys.add(generateIdempotencyKey())
      }
      expect(keys.size).toBe(100)
    })
  })

  describe('storeIdempotencyKey', () => {
    it('should store key with operation prefix', () => {
      const key = 'test-uuid-123'
      const operation = 'team_registration'
      
      storeIdempotencyKey(operation, key)
      
      const stored = localStorage.getItem('idempotency_key_team_registration')
      expect(stored).toBeTruthy()
      
      const parsed = JSON.parse(stored!)
      expect(parsed.key).toBe(key)
      expect(parsed.timestamp).toBeDefined()
      expect(typeof parsed.timestamp).toBe('number')
    })

    it('should overwrite existing key for same operation', () => {
      const operation = 'test_op'
      const key1 = 'key-1'
      const key2 = 'key-2'
      
      storeIdempotencyKey(operation, key1)
      storeIdempotencyKey(operation, key2)
      
      const stored = localStorage.getItem('idempotency_key_test_op')
      const parsed = JSON.parse(stored!)
      expect(parsed.key).toBe(key2)
    })

    it('should store current timestamp', () => {
      const key = 'test-key'
      const operation = 'test'
      const beforeTime = Date.now()
      
      storeIdempotencyKey(operation, key)
      
      const afterTime = Date.now()
      const stored = JSON.parse(localStorage.getItem('idempotency_key_test')!)
      
      expect(stored.timestamp).toBeGreaterThanOrEqual(beforeTime)
      expect(stored.timestamp).toBeLessThanOrEqual(afterTime)
    })
  })

  describe('getIdempotencyKey', () => {
    it('should retrieve stored key', () => {
      const key = 'test-uuid-456'
      const operation = 'payment'
      
      storeIdempotencyKey(operation, key)
      const retrieved = getIdempotencyKey(operation)
      
      expect(retrieved).toBe(key)
    })

    it('should return null if key does not exist', () => {
      const retrieved = getIdempotencyKey('non_existent_operation')
      expect(retrieved).toBeNull()
    })

    it('should return null if key is expired (>24h)', () => {
      const key = 'expired-key'
      const operation = 'old_operation'
      
      // Store key with timestamp 25 hours ago
      const expiredTimestamp = Date.now() - (25 * 60 * 60 * 1000)
      localStorage.setItem(
        'idempotency_key_old_operation',
        JSON.stringify({ key, timestamp: expiredTimestamp })
      )
      
      const retrieved = getIdempotencyKey(operation)
      expect(retrieved).toBeNull()
    })

    it('should return key if within 24h window', () => {
      const key = 'recent-key'
      const operation = 'recent_op'
      
      // Store key with timestamp 23 hours ago
      const recentTimestamp = Date.now() - (23 * 60 * 60 * 1000)
      localStorage.setItem(
        'idempotency_key_recent_op',
        JSON.stringify({ key, timestamp: recentTimestamp })
      )
      
      const retrieved = getIdempotencyKey(operation)
      expect(retrieved).toBe(key)
    })

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('idempotency_key_corrupted', 'invalid json')
      
      const retrieved = getIdempotencyKey('corrupted')
      expect(retrieved).toBeNull()
    })
  })

  describe('hasValidIdempotencyKey', () => {
    it('should return true if valid key exists', () => {
      const operation = 'test_check'
      storeIdempotencyKey(operation, 'valid-key')
      
      expect(hasValidIdempotencyKey(operation)).toBe(true)
    })

    it('should return false if no key exists', () => {
      expect(hasValidIdempotencyKey('non_existent')).toBe(false)
    })

    it('should return false if key is expired', () => {
      const operation = 'expired_check'
      const expiredTimestamp = Date.now() - (25 * 60 * 60 * 1000)
      localStorage.setItem(
        'idempotency_key_expired_check',
        JSON.stringify({ key: 'expired', timestamp: expiredTimestamp })
      )
      
      expect(hasValidIdempotencyKey(operation)).toBe(false)
    })
  })

  describe('clearExpiredIdempotencyKeys', () => {
    it('should remove expired keys only', () => {
      const now = Date.now()
      
      // Recent key (23h old)
      localStorage.setItem(
        'idempotency_key_recent',
        JSON.stringify({ key: 'recent', timestamp: now - (23 * 60 * 60 * 1000) })
      )
      
      // Expired key (25h old)
      localStorage.setItem(
        'idempotency_key_expired',
        JSON.stringify({ key: 'expired', timestamp: now - (25 * 60 * 60 * 1000) })
      )
      
      // Another expired key (30h old)
      localStorage.setItem(
        'idempotency_key_very_old',
        JSON.stringify({ key: 'very_old', timestamp: now - (30 * 60 * 60 * 1000) })
      )
      
      clearExpiredIdempotencyKeys()
      
      expect(localStorage.getItem('idempotency_key_recent')).toBeTruthy()
      expect(localStorage.getItem('idempotency_key_expired')).toBeNull()
      expect(localStorage.getItem('idempotency_key_very_old')).toBeNull()
    })

    it('should not remove non-idempotency keys', () => {
      localStorage.setItem('other_key', 'should_remain')
      localStorage.setItem('user_preference', 'dark_mode')
      
      const expiredTimestamp = Date.now() - (25 * 60 * 60 * 1000)
      localStorage.setItem(
        'idempotency_key_expired',
        JSON.stringify({ key: 'expired', timestamp: expiredTimestamp })
      )
      
      clearExpiredIdempotencyKeys()
      
      expect(localStorage.getItem('other_key')).toBe('should_remain')
      expect(localStorage.getItem('user_preference')).toBe('dark_mode')
      expect(localStorage.getItem('idempotency_key_expired')).toBeNull()
    })

    it('should handle corrupted keys without throwing', () => {
      localStorage.setItem('idempotency_key_corrupted', 'not json')
      
      expect(() => clearExpiredIdempotencyKeys()).not.toThrow()
    })
  })

  describe('clearAllIdempotencyKeys', () => {
    it('should remove all idempotency keys', () => {
      storeIdempotencyKey('op1', 'key1')
      storeIdempotencyKey('op2', 'key2')
      storeIdempotencyKey('op3', 'key3')
      
      clearAllIdempotencyKeys()
      
      expect(localStorage.getItem('idempotency_key_op1')).toBeNull()
      expect(localStorage.getItem('idempotency_key_op2')).toBeNull()
      expect(localStorage.getItem('idempotency_key_op3')).toBeNull()
    })

    it('should not remove non-idempotency keys', () => {
      localStorage.setItem('user_token', 'abc123')
      localStorage.setItem('theme', 'dark')
      storeIdempotencyKey('test', 'test-key')
      
      clearAllIdempotencyKeys()
      
      expect(localStorage.getItem('user_token')).toBe('abc123')
      expect(localStorage.getItem('theme')).toBe('dark')
      expect(localStorage.getItem('idempotency_key_test')).toBeNull()
    })

    it('should handle empty localStorage', () => {
      expect(() => clearAllIdempotencyKeys()).not.toThrow()
    })
  })

  describe('Integration: Complete workflow', () => {
    it('should handle full registration lifecycle', () => {
      const operation = 'team_registration'
      
      // 1. Check no key exists
      expect(hasValidIdempotencyKey(operation)).toBe(false)
      
      // 2. Generate and store key
      const key = generateIdempotencyKey()
      storeIdempotencyKey(operation, key)
      
      // 3. Verify key is stored and valid
      expect(hasValidIdempotencyKey(operation)).toBe(true)
      expect(getIdempotencyKey(operation)).toBe(key)
      
      // 4. Clear all keys
      clearAllIdempotencyKeys()
      
      // 5. Verify key is removed
      expect(hasValidIdempotencyKey(operation)).toBe(false)
      expect(getIdempotencyKey(operation)).toBeNull()
    })

    it('should handle multiple concurrent operations', () => {
      const ops = ['op1', 'op2', 'op3']
      const keys = ops.map(() => generateIdempotencyKey())
      
      // Store all keys
      ops.forEach((op, i) => storeIdempotencyKey(op, keys[i]))
      
      // Verify all keys exist
      ops.forEach((op, i) => {
        expect(getIdempotencyKey(op)).toBe(keys[i])
      })
      
      // Clear expired (none should be removed as they're fresh)
      clearExpiredIdempotencyKeys()
      
      ops.forEach((op, i) => {
        expect(getIdempotencyKey(op)).toBe(keys[i])
      })
    })
  })
})
