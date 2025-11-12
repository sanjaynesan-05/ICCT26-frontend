#!/usr/bin/env node

/**
 * Frontend-Backend Integration Test Script
 * Tests the registration API endpoint with sample data
 */

const BASE_URL = 'https://icct26-backend.onrender.com'
const API_ENDPOINT = '/api/register/team'

// Sample Base64 data (1x1 pixel JPEG for testing)
const SAMPLE_JPEG_BASE64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k='
const SAMPLE_PDF_BASE64 = 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MNCjEgMCBvYmo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iagoyIDAgb2JqPDwvVHlwZS9QYWdlcwovS2lkc1szIDAgUl0vQ291bnQgMT4+ZW5kCjMgMCBvYmo8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjE8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWxtZXRpY2E+Pj4+Pj4vUHJvY1NldFs+XT4vQ29udGVudHMgNCAwIFI+PmVuZG9iCjQgMCBvYmo8PC9MZW5ndGggNDQvRmlsdGVyL0ZsYXRlRGVjb2RlPj5zdHJlYW0KeJwr5HIKZXLh0uRyVVGqKkWFBdkpOZlpmSmVXJpcDkxGBZn56ZVcmlxOXIpcPlyKXH5chiXZ+XmVXJpcDlyKXH5cunwuXD5cunwKXAZcDlyGXA5chlwOXIZcDlyGXAZcDlyGXAZcDlyGXAZcBlwOXAZcDlyGXAZcDlyGXAZcD'

/**
 * Generate sample player data
 */
function generatePlayers(count = 11) {
  const roles = ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper']
  const players = []
  
  for (let i = 1; i <= count; i++) {
    players.push({
      name: `Test Player ${i}`,
      age: 20 + (i % 20),
      phone: `989765432${String(i).padStart(2, '0')}`,
      role: roles[i % roles.length],
      jersey_number: String(i).padStart(2, '0'),
      aadhar_file: SAMPLE_JPEG_BASE64,
      subscription_file: SAMPLE_PDF_BASE64,
    })
  }
  
  return players
}

/**
 * Create test payload
 */
function createTestPayload(playerCount = 11) {
  return {
    team_name: `Test Team ${new Date().getTime()}`,
    church_name: 'St. James Church',
    captain_name: 'Captain Test',
    captain_phone: '9876543210',
    captain_email: 'captain@test.com',
    captain_whatsapp: '9876543210',
    vice_captain_name: 'Vice Captain Test',
    vice_captain_phone: '9876543211',
    vice_captain_email: 'vicecaptain@test.com',
    vice_captain_whatsapp: '9876543211',
    payment_receipt: SAMPLE_JPEG_BASE64,
    pastor_letter: SAMPLE_PDF_BASE64,
    players: generatePlayers(playerCount),
  }
}

/**
 * Test API endpoint
 */
async function testRegistrationAPI() {
  console.log('\n' + '='.repeat(60))
  console.log('ICCT26 Frontend-Backend Integration Test')
  console.log('='.repeat(60) + '\n')

  const payload = createTestPayload(11)

  console.log('📋 Test Payload:')
  console.log(JSON.stringify(payload, null, 2).substring(0, 500) + '...\n')

  console.log(`🚀 Sending request to: ${BASE_URL}${API_ENDPOINT}`)
  console.log('Method: POST')
  console.log('Content-Type: application/json\n')

  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    console.log(`📊 Response Status: ${response.status} ${response.statusText}\n`)

    const responseData = await response.json()

    console.log('📥 Response Data:')
    console.log(JSON.stringify(responseData, null, 2) + '\n')

    if (response.ok) {
      console.log('✅ SUCCESS: Registration submitted successfully!')
      console.log(`Team: ${payload.team_name}`)
      console.log(`Players: ${payload.players.length}`)
      console.log(`Team ID: ${responseData.data?.id || responseData.id || 'N/A'}\n`)
    } else {
      console.log('❌ ERROR: Request failed')
      console.log(`Status: ${response.status}`)
      console.log(`Error: ${responseData.error || responseData.detail || 'Unknown error'}\n`)
    }

    return response.ok
  } catch (error) {
    console.log('❌ NETWORK ERROR:')
    console.log(`Error: ${error.message}`)
    console.log('Make sure backend is running at:', BASE_URL + '\n')
    return false
  }
}

/**
 * Validate payload schema
 */
function validatePayloadSchema(payload) {
  console.log('\n' + '='.repeat(60))
  console.log('Payload Schema Validation')
  console.log('='.repeat(60) + '\n')

  const checks = [
    { name: 'team_name', check: () => typeof payload.team_name === 'string' },
    { name: 'church_name', check: () => typeof payload.church_name === 'string' },
    { name: 'captain_name', check: () => typeof payload.captain_name === 'string' },
    { name: 'captain_phone', check: () => typeof payload.captain_phone === 'string' },
    { name: 'captain_email', check: () => typeof payload.captain_email === 'string' },
    { name: 'captain_whatsapp', check: () => typeof payload.captain_whatsapp === 'string' },
    { name: 'vice_captain_name', check: () => typeof payload.vice_captain_name === 'string' },
    { name: 'vice_captain_phone', check: () => typeof payload.vice_captain_phone === 'string' },
    { name: 'vice_captain_email', check: () => typeof payload.vice_captain_email === 'string' },
    { name: 'vice_captain_whatsapp', check: () => typeof payload.vice_captain_whatsapp === 'string' },
    { name: 'payment_receipt', check: () => typeof payload.payment_receipt === 'string' && payload.payment_receipt.startsWith('data:') },
    { name: 'pastor_letter', check: () => typeof payload.pastor_letter === 'string' && payload.pastor_letter.startsWith('data:') },
    { name: 'players', check: () => Array.isArray(payload.players) && payload.players.length >= 11 && payload.players.length <= 15 },
  ]

  let passed = 0
  let failed = 0

  checks.forEach(({ name, check }) => {
    const result = check()
    const status = result ? '✅' : '❌'
    console.log(`${status} ${name}`)
    if (result) passed++
    else failed++
  })

  if (payload.players && payload.players.length > 0) {
    console.log(`\n📋 Player Schema Check (${payload.players.length} players):`)
    const player = payload.players[0]
    const playerChecks = [
      { name: 'name', check: () => typeof player.name === 'string' },
      { name: 'age', check: () => typeof player.age === 'number' && player.age >= 18 && player.age <= 40 },
      { name: 'phone', check: () => typeof player.phone === 'string' },
      { name: 'role', check: () => ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'].includes(player.role) },
      { name: 'jersey_number', check: () => typeof player.jersey_number === 'string' },
      { name: 'aadhar_file', check: () => typeof player.aadhar_file === 'string' && player.aadhar_file.startsWith('data:') },
      { name: 'subscription_file', check: () => typeof player.subscription_file === 'string' && player.subscription_file.startsWith('data:') },
    ]

    playerChecks.forEach(({ name, check }) => {
      const result = check()
      const status = result ? '✅' : '❌'
      console.log(`  ${status} ${name}`)
      if (result) passed++
      else failed++
    })
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`)
  return failed === 0
}

/**
 * Main execution
 */
async function main() {
  const payload = createTestPayload(11)
  
  const schemaValid = validatePayloadSchema(payload)
  if (!schemaValid) {
    console.log('⚠️  Payload schema validation failed. Proceeding anyway...\n')
  }

  const testPassed = await testRegistrationAPI()

  console.log('='.repeat(60))
  console.log('Test Complete')
  console.log('='.repeat(60) + '\n')

  process.exit(testPassed ? 0 : 1)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
