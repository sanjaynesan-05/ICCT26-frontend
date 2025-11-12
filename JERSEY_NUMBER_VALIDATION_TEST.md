# Jersey Number Validation & Backend Alignment Test Guide

## 🎯 Objective
Verify that the frontend correctly collects jersey numbers and sends them to the backend without null values.

## 📋 Test Checklist

### ✅ Pre-Test Verification
- [x] Jersey number validation with regex pattern added: `!/^\d{1,3}$/.test()`
- [x] Fallback pattern implemented: `jersey_number: p.jerseyNumber || String(idx + 1).padStart(2, '0')`
- [x] Console logging added to debug payload
- [x] FileUpload returns proper Base64 format with MIME type
- [x] Build successful: 0 errors

### 🧪 Manual Test Steps

#### Step 1: Test Jersey Number Input Validation

**Scenario 1a: Valid jersey numbers (1-3 digits)**
1. Navigate to http://localhost:5175
2. Fill in Steps 1-2 (church, team, captain, vice-captain)
3. Add first player on Step 3
4. Enter jersey number: `7`
5. ✅ **Expected**: Field accepts input, no error message
6. Verify in DevTools Console: Player object shows `jerseyNumber: "7"`

**Scenario 1b: Invalid jersey number (4+ digits)**
1. Try to enter jersey number: `1234`
2. ✅ **Expected**: Input field should only allow max 3 characters due to `maxLength={3}` on input
3. If bypassed somehow, validation on next button should show error: "Jersey number must be 1-3 digits"

**Scenario 1c: Invalid jersey number (non-numeric)**
1. Try to enter jersey number: `ABC`
2. ✅ **Expected**: Input field has `pattern="\d{1,3}"` so browser blocks non-numeric input
3. Mobile users using numeric keyboard due to `inputMode="numeric"`

**Scenario 1d: Empty jersey number**
1. Add player without entering jersey number
2. Click "Next" button
3. ✅ **Expected**: Error message: "Player 1: Please enter jersey number"

#### Step 2: Test Payload Jersey Number Mapping

**Steps to reach submission:**
1. Fill all required fields through Step 4 (review)
2. Add at least 11 players (Step 3)
3. Fill in payment receipt (Step 5)
4. Click "Submit" button

**Verification in DevTools Console:**
1. Open DevTools → Console tab
2. Look for log lines starting with `📤 Registration Payload`
3. You should see:
```
📤 Registration Payload - Players jersey_number validation:
  Player 1: jersey_number="7" (type: string)
  Player 2: jersey_number="8" (type: string)
  Player 3: jersey_number="9" (type: string)
  ... (all players)
  Player N: jersey_number="XX" (type: string)
```
4. ✅ **Expected**: Every player has a jersey_number that is a string, never null or undefined

#### Step 3: Test Network Payload Inspection

**Using DevTools Network Tab:**
1. Open DevTools → Network tab
2. Filter by XHR/Fetch requests
3. Fill form and submit
4. Click on the `register/team` POST request
5. Go to "Request" or "Payload" tab
6. Look for players array:
```json
{
  "players": [
    {
      "name": "Player 1",
      "age": 25,
      "phone": "1234567890",
      "role": "Batsman",
      "jersey_number": "7",
      "aadhar_file": "data:image/png;base64,...",
      "subscription_file": "data:image/png;base64,..."
    },
    ...
  ]
}
```
7. ✅ **Expected**: All players have `jersey_number` as a string value (e.g., "7", "8", "9"), NEVER null

#### Step 4: Test Fallback Pattern

**Scenario: Empty jersey number gets fallback value**
1. Manually edit payload in DevTools (for testing purposes)
2. If a player has empty `jerseyNumber: ""`
3. ✅ **Expected**: Fallback pattern provides: `jersey_number: String(idx + 1).padStart(2, '0')`
   - Player 1 (index 0) gets: `"01"`
   - Player 2 (index 1) gets: `"02"`
   - etc.

#### Step 5: Test File Uploads

**Aadhar/ID File Upload:**
1. Click on Aadhar/ID upload area
2. Select a PNG, JPG, or PDF file (< 5MB)
3. ✅ **Expected**: File shows as uploaded with checkmark
4. DevTools Console should show: File accepted and converted to Base64
5. Payload should contain: `"aadhar_file": "data:image/png;base64,..."`

**Subscription/Consent File Upload:**
1. Click on Subscription/Consent upload area
2. Select a PDF file (< 5MB)
3. ✅ **Expected**: File shows as uploaded with checkmark
4. Payload should contain: `"subscription_file": "data:application/pdf;base64,..."`

**Payment Receipt File Upload:**
1. Go to Step 5
2. Upload payment receipt (PNG, JPG, or PDF, < 5MB)
3. ✅ **Expected**: Shows with checkmark
4. Payload should contain: `"payment_receipt": "data:image/png;base64,..."`

#### Step 6: Test Complete End-to-End Flow

**Full Registration Test:**
1. **Step 1**: Enter church name, team name, upload pastor letter
2. **Step 2**: Fill captain details (name, phone, whatsapp, email)
3. **Step 2**: Fill vice-captain details
4. **Step 3**: Add exactly 11 players with:
   - Name
   - Age (18-40)
   - Phone number
   - Role (Bowler, Batsman, All-rounder)
   - **Jersey Number (1-3 digits)** ← CRITICAL
   - Aadhar/ID file
   - Subscription file
5. **Step 4**: Review all information
6. **Step 5**: Upload payment receipt
7. **Submit**: Click submit button
8. Monitor:
   - ✅ Console logs show jersey_numbers for all players
   - ✅ Network request shows all players with jersey_number field
   - ✅ Backend responds with success (check Network Response tab)

## 🔍 Debugging Guide

### If You See Backend Error: "null value in column 'jersey_number'"

**Debug Steps:**
1. Open DevTools Console
2. Look for lines starting with `📤 Registration Payload`
3. Check if any player has `jersey_number` as null, undefined, or empty string
4. If yes:
   - Check if validation error appeared before submission
   - If validation passed but still null, there's a state issue
   - Check if fallback pattern is being applied

### If Validation Not Working

**Check:**
1. PlayerFormCard input has `maxLength={3}` attribute
2. Input has `pattern="\d{1,3}"` pattern
3. Validation function in Registration.tsx line 135 checks: `if (!/^\d{1,3}$/.test(player.jerseyNumber.trim()))`

### If Files Show as Base64 with Wrong Format

**Check:**
1. FileUpload component uses `FileReader.readAsDataURL()`
2. This should return: `data:image/png;base64,ABC123...`
3. If missing prefix, API will fail

## 📊 Expected Backend Payload Structure

```json
{
  "team_name": "Team Alpha",
  "church_name": "Church of Christ",
  "captain": {
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "whatsapp": "9876543210"
  },
  "viceCaptain": {
    "name": "Jane Smith",
    "phone": "9876543211",
    "email": "jane@example.com",
    "whatsapp": "9876543211"
  },
  "payment_receipt": "data:image/png;base64,ABC...",
  "pastor_letter": "data:image/png;base64,DEF...",
  "players": [
    {
      "name": "Player 1",
      "age": 25,
      "phone": "1234567890",
      "role": "Batsman",
      "jersey_number": "7",
      "aadhar_file": "data:image/png;base64,GHI...",
      "subscription_file": "data:application/pdf;base64,JKL..."
    },
    {
      "name": "Player 2",
      "age": 26,
      "phone": "1234567891",
      "role": "Bowler",
      "jersey_number": "8",
      "aadhar_file": "data:image/png;base64,MNO...",
      "subscription_file": "data:application/pdf;base64,PQR..."
    }
  ]
}
```

**Key Points:**
- ✅ `jersey_number` is a string (e.g., "7", "08", "123")
- ✅ NEVER null, undefined, or empty
- ✅ All Base64 strings include MIME type prefix (data:image/png;base64,...)
- ✅ Nested objects for captain and viceCaptain
- ✅ All required fields present

## 🚀 Production Deployment

After successful testing:
1. Verify no console errors in production mode
2. Test with real backend at https://icct26-backend.onrender.com/api/register/team
3. Check backend logs for any validation errors
4. Deploy frontend to Netlify

## 📝 Notes

- Jersey number validation is case-sensitive (only allows digits)
- Fallback pattern ensures no null values even if validation passes empty string
- Console logs provide visibility into exact payload being sent
- All file uploads include Base64 encoding with MIME type prefix
