/**
 * Jersey Number Validation Test
 * Quick test to verify the regex pattern works correctly
 * Run in browser console or Node.js
 */

// Test regex pattern
const jerseyRegex = /^\d{1,3}$/;

const testCases = [
  { input: "7", expected: true, description: "Single digit" },
  { input: "07", expected: true, description: "Two digits" },
  { input: "99", expected: true, description: "Two digits (high)" },
  { input: "123", expected: true, description: "Three digits" },
  { input: "001", expected: true, description: "Three digits (with leading zeros)" },
  { input: "1234", expected: false, description: "Four digits (too many)" },
  { input: "", expected: false, description: "Empty string" },
  { input: "ABC", expected: false, description: "Non-numeric" },
  { input: "7A", expected: false, description: "Mixed alphanumeric" },
  { input: " 7", expected: false, description: "With leading space" },
  { input: "7 ", expected: false, description: "With trailing space" },
  { input: "7.5", expected: false, description: "Decimal" },
];

console.log("🧪 Jersey Number Validation Tests\n");
console.log("Regex Pattern: /^\\d{1,3}$/\n");

let passed = 0;
let failed = 0;

testCases.forEach(test => {
  const result = jerseyRegex.test(test.input);
  const status = result === test.expected ? "✅ PASS" : "❌ FAIL";
  
  if (result === test.expected) {
    passed++;
  } else {
    failed++;
  }
  
  console.log(`${status} | Input: "${test.input}" | Expected: ${test.expected} | Got: ${result} | ${test.description}`);
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

// Test with trim()
console.log("\n🧪 With .trim() method (as used in validation):\n");

const trimTestCases = [
  { input: " 7 ", expected: true, description: "Single digit with spaces" },
  { input: "  99  ", expected: true, description: "Two digits with spaces" },
];

trimTestCases.forEach(test => {
  const result = jerseyRegex.test(test.input.trim());
  const status = result === test.expected ? "✅ PASS" : "❌ FAIL";
  console.log(`${status} | Input: "${test.input}" | After trim: "${test.input.trim()}" | Expected: ${test.expected} | Got: ${result} | ${test.description}`);
});

// Fallback pattern test
console.log("\n🧪 Fallback Pattern Test:\n");
console.log("Pattern: `jersey_number: p.jerseyNumber || String(idx + 1).padStart(2, '0')`\n");

const fallbackTest = [
  { jerseyNumber: "7", index: 0, expected: "7" },
  { jerseyNumber: "08", index: 1, expected: "08" },
  { jerseyNumber: "", index: 0, expected: "01" },
  { jerseyNumber: "", index: 1, expected: "02" },
  { jerseyNumber: null, index: 10, expected: "11" },
  { jerseyNumber: undefined, index: 10, expected: "11" },
];

fallbackTest.forEach(test => {
  const result = test.jerseyNumber || String(test.index + 1).padStart(2, '0');
  const status = result === test.expected ? "✅ PASS" : "❌ FAIL";
  console.log(`${status} | jerseyNumber="${test.jerseyNumber}" | index=${test.index} | Expected: "${test.expected}" | Got: "${result}"`);
});
