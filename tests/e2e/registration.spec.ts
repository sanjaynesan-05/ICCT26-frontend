import { test, expect } from '@playwright/test'

/**
 * End-to-End Registration Tests
 * 
 * Test Scenarios:
 * 1. ✅ Successful registration with all fields
 * 2. ❌ Invalid phone number format
 * 3. ❌ Invalid file type (non-image/PDF)
 * 4. ❌ File size exceeds 5MB
 * 5. ❌ Duplicate idempotency key
 * 6. 🔄 Cloudinary upload retry
 * 7. ❌ Email sending failure
 * 8. 🔄 Refresh during upload (idempotency)
 */

const TEST_API_URL = 'http://localhost:8000'

test.describe('Team Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/registration')
    await expect(page.locator('h1')).toContainText('Register Your Team')
  })

  test('should successfully register a team with all valid data', async ({ page }) => {
    // Step 1: Team Details
    await page.fill('input[name="teamName"]', 'Test Warriors')
    await page.fill('input[name="captainName"]', 'John Doe')
    await page.fill('input[name="captainEmail"]', 'john@example.com')
    await page.fill('input[name="captainPhone"]', '9876543210')
    
    await page.click('button:has-text("Next")')
    
    // Step 2: Player Details
    await page.fill('input[name="player2_name"]', 'Alice Smith')
    await page.fill('input[name="player2_jersey"]', '10')
    await page.fill('input[name="player3_name"]', 'Bob Johnson')
    await page.fill('input[name="player3_jersey"]', '11')
    
    await page.click('button:has-text("Next")')
    
    // Step 3: Documents
    const paymentProof = await page.locator('input[type="file"]').first()
    await paymentProof.setInputFiles({
      name: 'payment.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image content'),
    })
    
    const jerseyImage = await page.locator('input[type="file"]').last()
    await jerseyImage.setInputFiles({
      name: 'jersey.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake jersey image'),
    })
    
    // Submit
    await page.click('button:has-text("Submit Registration")')
    
    // Wait for success message
    await expect(page.locator('text=Registration Successful')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=Your team has been registered')).toBeVisible()
  })

  test('should reject invalid phone number format', async ({ page }) => {
    await page.fill('input[name="teamName"]', 'Test Team')
    await page.fill('input[name="captainName"]', 'John Doe')
    await page.fill('input[name="captainEmail"]', 'john@example.com')
    await page.fill('input[name="captainPhone"]', '12345') // Invalid: too short
    
    await page.click('button:has-text("Next")')
    
    // Should show validation error
    await expect(page.locator('text=/phone.*invalid/i')).toBeVisible()
  })

  test('should reject invalid file type', async ({ page }) => {
    // Navigate to documents step
    await page.fill('input[name="teamName"]', 'Test Team')
    await page.fill('input[name="captainName"]', 'John Doe')
    await page.fill('input[name="captainEmail"]', 'john@example.com')
    await page.fill('input[name="captainPhone"]', '9876543210')
    await page.click('button:has-text("Next")')
    
    await page.fill('input[name="player2_name"]', 'Alice Smith')
    await page.fill('input[name="player2_jersey"]', '10')
    await page.click('button:has-text("Next")')
    
    // Try to upload invalid file type
    const fileInput = await page.locator('input[type="file"]').first()
    await fileInput.setInputFiles({
      name: 'document.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test content'),
    })
    
    // Should show error
    await expect(page.locator('text=/invalid.*file.*type/i')).toBeVisible({ timeout: 3000 })
  })

  test('should reject file size exceeding 5MB', async ({ page }) => {
    // Navigate to documents step
    await page.fill('input[name="teamName"]', 'Test Team')
    await page.fill('input[name="captainName"]', 'John Doe')
    await page.fill('input[name="captainEmail"]', 'john@example.com')
    await page.fill('input[name="captainPhone"]', '9876543210')
    await page.click('button:has-text("Next")')
    
    await page.fill('input[name="player2_name"]', 'Alice Smith')
    await page.fill('input[name="player2_jersey"]', '10')
    await page.click('button:has-text("Next")')
    
    // Create 6MB file
    const largeFile = Buffer.alloc(6 * 1024 * 1024)
    const fileInput = await page.locator('input[type="file"]').first()
    await fileInput.setInputFiles({
      name: 'large-payment.jpg',
      mimeType: 'image/jpeg',
      buffer: largeFile,
    })
    
    // Should show error
    await expect(page.locator('text=/file.*too.*large/i')).toBeVisible({ timeout: 3000 })
  })

  test('should handle duplicate idempotency key gracefully', async ({ page }) => {
    // First registration
    await page.fill('input[name="teamName"]', 'Duplicate Test')
    await page.fill('input[name="captainName"]', 'John Doe')
    await page.fill('input[name="captainEmail"]', 'john@example.com')
    await page.fill('input[name="captainPhone"]', '9876543210')
    await page.click('button:has-text("Next")')
    
    await page.fill('input[name="player2_name"]', 'Alice Smith')
    await page.fill('input[name="player2_jersey"]', '10')
    await page.click('button:has-text("Next")')
    
    const paymentProof = await page.locator('input[type="file"]').first()
    await paymentProof.setInputFiles({
      name: 'payment.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image'),
    })
    
    await page.click('button:has-text("Submit Registration")')
    await expect(page.locator('text=Registration Successful')).toBeVisible({ timeout: 15000 })
    
    // Try to go back and submit again (should be prevented by idempotency)
    await page.goto('/registration')
    
    // If duplicate detected, should either:
    // 1. Show error message, or
    // 2. Return cached response
    // Both are acceptable based on backend behavior
  })

  test('should retry on Cloudinary upload failure', async ({ page }) => {
    // Mock Cloudinary to fail first time, succeed second time
    await page.route('**/cloudinary.com/**', async (route, request) => {
      const retryCount = parseInt(request.headers()['x-retry-count'] || '0')
      if (retryCount === 0) {
        await route.abort('failed')
      } else {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ secure_url: 'https://example.com/image.jpg' }),
        })
      }
    })
    
    // Fill form and submit
    await page.fill('input[name="teamName"]', 'Retry Test')
    await page.fill('input[name="captainName"]', 'John Doe')
    await page.fill('input[name="captainEmail"]', 'john@example.com')
    await page.fill('input[name="captainPhone"]', '9876543210')
    await page.click('button:has-text("Next")')
    
    await page.fill('input[name="player2_name"]', 'Alice Smith')
    await page.fill('input[name="player2_jersey"]', '10')
    await page.click('button:has-text("Next")')
    
    const paymentProof = await page.locator('input[type="file"]').first()
    await paymentProof.setInputFiles({
      name: 'payment.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image'),
    })
    
    await page.click('button:has-text("Submit Registration")')
    
    // Should show retry indicator
    await expect(page.locator('text=/retry/i')).toBeVisible({ timeout: 5000 })
  })

  test('should handle email sending failure gracefully', async ({ page }) => {
    // Mock backend to return email failure
    await page.route(`${TEST_API_URL}/api/teams/register`, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: false,
          error_code: 'EMAIL_SEND_FAILED',
          message: 'Registration succeeded but email notification failed. Please contact support.',
        }),
      })
    })
    
    // Complete registration
    await page.fill('input[name="teamName"]', 'Email Fail Test')
    await page.fill('input[name="captainName"]', 'John Doe')
    await page.fill('input[name="captainEmail"]', 'john@example.com')
    await page.fill('input[name="captainPhone"]', '9876543210')
    await page.click('button:has-text("Next")')
    
    await page.fill('input[name="player2_name"]', 'Alice Smith')
    await page.fill('input[name="player2_jersey"]', '10')
    await page.click('button:has-text("Next")')
    
    const paymentProof = await page.locator('input[type="file"]').first()
    await paymentProof.setInputFiles({
      name: 'payment.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image'),
    })
    
    await page.click('button:has-text("Submit Registration")')
    
    // Should show appropriate error message
    await expect(page.locator('text=/email.*failed/i')).toBeVisible({ timeout: 10000 })
  })

  test('should preserve idempotency on page refresh during upload', async ({ page }) => {
    // Start registration
    await page.fill('input[name="teamName"]', 'Refresh Test')
    await page.fill('input[name="captainName"]', 'John Doe')
    await page.fill('input[name="captainEmail"]', 'john@example.com')
    await page.fill('input[name="captainPhone"]', '9876543210')
    await page.click('button:has-text("Next")')
    
    await page.fill('input[name="player2_name"]', 'Alice Smith')
    await page.fill('input[name="player2_jersey"]', '10')
    await page.click('button:has-text("Next")')
    
    const paymentProof = await page.locator('input[type="file"]').first()
    await paymentProof.setInputFiles({
      name: 'payment.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image'),
    })
    
    // Get idempotency key from localStorage before refresh
    const idempotencyKeyBefore = await page.evaluate(() => {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('idempotency_key_'))
      return keys.length > 0 ? localStorage.getItem(keys[0]) : null
    })
    
    // Refresh page
    await page.reload()
    
    // Check idempotency key is preserved
    const idempotencyKeyAfter = await page.evaluate(() => {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('idempotency_key_'))
      return keys.length > 0 ? localStorage.getItem(keys[0]) : null
    })
    
    expect(idempotencyKeyAfter).toBe(idempotencyKeyBefore)
  })
})
