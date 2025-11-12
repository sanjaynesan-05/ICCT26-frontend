# E2E Testing Execution Plan - ICCT26 Registration Form

**Date:** November 12, 2025  
**Test Environment:** http://localhost:5174  
**Backend URL:** https://icct26-backend.onrender.com/api/register/team  
**Status:** IN PROGRESS 🔄

---

## Test Objectives

1. ✅ Verify UI renders correctly with all form fields
2. ✅ Test jersey number input field validation
3. ✅ Test form navigation (multi-step workflow)
4. ✅ Validate file upload functionality
5. ✅ Test form submission with complete data
6. ✅ Verify API integration and backend response
7. ✅ Confirm data persistence

---

## Test Environment Setup

| Component | Status | Details |
|-----------|--------|---------|
| **Dev Server** | ✅ RUNNING | Port 5174 (localhost:5174) |
| **Backend API** | ✅ AVAILABLE | https://icct26-backend.onrender.com |
| **Browser** | ✅ OPEN | Simple Browser at http://localhost:5174 |
| **Console** | 📋 READY | Monitor for errors/warnings |
| **Network** | 📋 READY | Monitor API calls |

---

## Test Cases

### Phase 1: UI & Navigation Tests

#### Test 1.1: Home Page Load ✅
**Objective:** Verify application loads without errors

**Steps:**
1. Open http://localhost:5174
2. Check if homepage displays correctly
3. Verify navigation menu is visible
4. Check for console errors

**Expected Result:** 
- Homepage renders with all sections
- No console errors or warnings
- Navigation is functional

---

#### Test 1.2: Navigate to Registration ✅
**Objective:** Verify registration page accessible

**Steps:**
1. Click "Register" button or navigate to registration page
2. Verify form title displays
3. Check initial step indicator (Step 1/5 or similar)
4. Verify all form fields are visible

**Expected Result:**
- Registration page loads
- Form title displays
- First step of form shows with input fields
- No navigation errors

---

### Phase 2: Form Field Validation Tests

#### Test 2.1: Team Information Input ✅
**Objective:** Verify team name and contact info validation

**Steps:**
1. Enter team name: "Test Team ICCT26"
2. Enter city: "Mumbai"
3. Enter contact name: "Test Manager"
4. Enter contact phone: "9876543210"
5. Click Next/Continue
6. Verify no validation errors

**Expected Result:**
- All fields accept input
- Next button enables when required fields filled
- Form advances to next step

---

#### Test 2.2: Player Information - Jersey Number ✅
**Objective:** Test jersey number field specifically

**Steps - For Player 1:**
1. Navigate to Step 5 (Players section)
2. Locate Player 1 jersey number field
3. **Test Valid Input:**
   - Enter "7" → Should accept ✅
   - Enter "07" → Should accept ✅
   - Enter "099" → Should accept ✅
4. **Test Invalid Input:**
   - Try to enter "1000" → Should NOT accept (maxLength=3)
   - Try to enter "abc" → Pattern validation should reject
5. **Test Required Validation:**
   - Clear jersey number field
   - Try to submit form → Should show error

**Expected Result:**
- Single digit numbers (1-9) accepted ✅
- Double digit numbers (01-99) accepted ✅
- Triple digit numbers (001-999) accepted ✅
- Fourth digit blocked (maxLength=3) ✅
- Non-numeric characters rejected (pattern) ✅
- Empty field rejected on submit ✅
- Error message displays clearly

---

#### Test 2.3: All Players - Jersey Numbers ✅
**Objective:** Verify all 11 players have jersey number fields

**Steps:**
1. Navigate to Players section
2. Count total player cards: Should be 11
3. For each player (1-11):
   - Verify jersey number input field exists
   - Enter jersey number: 1-11 (or random 1-3 digits)
   - Verify input accepts the value

**Expected Result:**
- All 11 players displayed with their form cards
- Each player has jersey number input field
- All fields accept valid input (1-3 digits)
- All values are retained

---

#### Test 2.4: Player Addition/Removal ✅
**Objective:** Test dynamic player list management

**Steps:**
1. Verify initial player count: 11
2. Click "Add Player" button
3. Verify player count increases to 12
4. Verify new player has empty jersey number field
5. Enter jersey number for player 12: "12"
6. Click "Remove" button on player 12
7. Verify player count returns to 11

**Expected Result:**
- Add button allows expanding to 15 players max
- Remove button works until 11 players (minimum)
- New players have empty jerseyNumber field
- Jersey numbers persist correctly

---

### Phase 3: File Upload Tests

#### Test 3.1: Aadhar File Upload ✅
**Objective:** Verify file upload validation (JPEG/PNG only)

**Steps:**
1. For Player 1, click on "Aadhar File" upload area
2. Upload a JPEG or PNG file (valid format)
3. Verify file preview shows
4. Verify file name displays
5. Check console for no errors

**Expected Result:**
- File upload dialog opens
- Valid file (JPEG/PNG) uploads successfully
- Preview or filename displays
- No console errors

---

#### Test 3.2: Subscription File Upload ✅
**Objective:** Verify file upload validation (PDF/JPEG/PNG)

**Steps:**
1. For Player 1, click on "Subscription File" upload area
2. Upload a PDF file (valid format)
3. Verify file uploads successfully
4. Verify filename/preview displays

**Expected Result:**
- PDF file uploads successfully
- File preview or name displays
- No validation errors

---

### Phase 4: Form Submission Tests

#### Test 4.1: Complete Form with All Data ✅
**Objective:** Test end-to-end submission with complete valid data

**Test Data:**
```
Team Information:
  Team Name: "Test Team ICCT26"
  City: "Test City"
  Contact Name: "Test Contact"
  Contact Phone: "9876543210"

Captain: Player 1
  Name: "Captain Name"
  Age: 25
  Phone: "9876543211"
  Role: "Captain"
  Jersey Number: "01"
  Files: Valid JPEG/PNG + PDF

Vice Captain: Player 2
  Name: "Vice Captain Name"
  Age: 24
  Phone: "9876543212"
  Role: "Vice Captain"
  Jersey Number: "02"
  Files: Valid JPEG/PNG + PDF

Other Players (3-11):
  Jersey Numbers: "03" through "11"
  Files: Valid JPEG/PNG + PDF
```

**Steps:**
1. Fill in all form steps with test data
2. Enter jersey numbers for all 11 players (01-11)
3. Upload valid files for all players
4. Review form data on final page
5. Click "Submit" button
6. Monitor Network tab for API request
7. Wait for backend response
8. Check for success modal/message

**Expected Result:**
- Form accepts all data without validation errors
- Jersey numbers 01-11 all accepted
- All files upload successfully (Base64 encoded)
- Submit button initiates API call
- Backend receives POST request to /api/register/team
- Request includes nested captain/viceCaptain objects
- Request includes jersey_number for each player
- Response status: 200 (success) or 201 (created)
- Success modal displays
- Team registration confirmed

---

#### Test 4.2: Jersey Number Validation on Submit ✅
**Objective:** Verify form won't submit without jersey numbers

**Steps:**
1. Start with partially filled form
2. Leave jersey number empty for Player 1
3. Proceed to final step
4. Click "Submit" button
5. Observe validation error

**Expected Result:**
- Form submission blocked
- Error message: "Player 1: Please enter jersey number" or similar
- User can correct and retry

---

### Phase 5: API Integration Tests

#### Test 5.1: Request Payload Verification ✅
**Objective:** Verify API request structure matches backend expectations

**Steps:**
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Fill and submit complete form
4. In Network tab, find POST request to /api/register/team
5. Click on request and view Request Payload
6. Verify payload structure

**Expected Payload Structure:**
```json
{
  "team_name": "Test Team ICCT26",
  "city": "Test City",
  "contact_name": "Test Contact",
  "contact_phone": "9876543210",
  "captain": {
    "name": "Captain Name",
    "age": 25,
    "phone": "9876543211",
    "role": "Captain",
    "jersey_number": "01",
    "aadhar_file": "data:image/jpeg;base64,...",
    "subscription_file": "data:application/pdf;base64,..."
  },
  "vice_captain": {
    "name": "Vice Captain Name",
    "age": 24,
    "phone": "9876543212",
    "role": "Vice Captain",
    "jersey_number": "02",
    "aadhar_file": "data:image/jpeg;base64,...",
    "subscription_file": "data:application/pdf;base64,..."
  },
  "players": [
    {
      "name": "Player 3 Name",
      "age": 23,
      "phone": "9876543213",
      "role": "All-rounder",
      "jersey_number": "03",
      "aadhar_file": "data:image/jpeg;base64,...",
      "subscription_file": "data:application/pdf;base64,..."
    },
    // ... 8 more players ...
  ]
}
```

**Expected Result:**
- ✅ Team information in correct field names (snake_case)
- ✅ Captain as nested object with all fields including jersey_number
- ✅ Vice Captain as nested object with all fields including jersey_number
- ✅ Players as array of objects, each with jersey_number
- ✅ Files Base64 encoded with proper MIME types
- ✅ All required fields present

---

#### Test 5.2: Response Handling ✅
**Objective:** Verify success response handling

**Steps:**
1. After form submission, observe Network tab
2. View Response for POST request
3. Check Response Status Code (should be 200 or 201)
4. Observe frontend behavior after response

**Expected Result:**
- Status Code: 200 (OK) or 201 (Created) ✅
- Response body includes success message or team ID
- Success modal/message displays in UI
- Form resets or redirects

---

### Phase 6: Error Handling Tests

#### Test 6.1: Network Error Handling ✅
**Objective:** Verify graceful handling of API failures

**Steps:**
1. Temporarily disable internet or mock API error
2. Fill and submit form
3. Observe error handling in UI

**Expected Result:**
- Error message displays clearly
- User can retry submission
- No console errors (handled gracefully)

---

#### Test 6.2: Validation Error Display ✅
**Objective:** Verify all validation errors display clearly

**Steps:**
1. Try to submit form with missing required fields
2. Leave jersey number empty for random player
3. Upload invalid file format
4. Observe error messages

**Expected Result:**
- All validation errors display clearly
- User can identify which fields need correction
- Error messages are actionable

---

## Test Execution Log

### Session Start: November 12, 2025
- **Dev Server Status:** ✅ Running on port 5174
- **Browser:** ✅ Simple Browser opened
- **Backend:** ✅ Available at https://icct26-backend.onrender.com

---

### Testing Progress

#### Phase 1: UI & Navigation
- [ ] Test 1.1: Home Page Load
- [ ] Test 1.2: Navigate to Registration

#### Phase 2: Form Field Validation
- [ ] Test 2.1: Team Information Input
- [ ] Test 2.2: Player Information - Jersey Number
- [ ] Test 2.3: All Players - Jersey Numbers
- [ ] Test 2.4: Player Addition/Removal

#### Phase 3: File Upload
- [ ] Test 3.1: Aadhar File Upload
- [ ] Test 3.2: Subscription File Upload

#### Phase 4: Form Submission
- [ ] Test 4.1: Complete Form Submission
- [ ] Test 4.2: Jersey Number Validation on Submit

#### Phase 5: API Integration
- [ ] Test 5.1: Request Payload Verification
- [ ] Test 5.2: Response Handling

#### Phase 6: Error Handling
- [ ] Test 6.1: Network Error Handling
- [ ] Test 6.2: Validation Error Display

---

## Test Results Summary

| Category | Status | Details |
|----------|--------|---------|
| **UI Rendering** | 📋 PENDING | Awaiting manual verification |
| **Form Validation** | 📋 PENDING | Jersey numbers, required fields |
| **File Upload** | 📋 PENDING | JPEG, PNG, PDF formats |
| **API Integration** | 📋 PENDING | Payload structure, response |
| **Error Handling** | 📋 PENDING | Validation, network errors |
| **Jersey Number** | 📋 PENDING | 1-3 digits, validation |

---

## Next Steps

1. **Manual Testing:** Navigate through form and fill with test data
2. **Payload Inspection:** Check Network tab for correct API structure
3. **Response Verification:** Confirm successful backend registration
4. **Data Persistence:** Verify team data stored in backend
5. **Documentation:** Record any issues or successes

---

## Notes for Testing

- ✅ Jersey Number field should:
  - Accept 1-3 digit numbers
  - Have inputMode="numeric"
  - Show placeholder "e.g. 07"
  - Be required field

- ✅ API Payload should:
  - Include nested captain/viceCaptain objects
  - Use snake_case for all keys
  - Include jersey_number for each player
  - Include Base64 encoded files

- ✅ Backend should:
  - Accept POST request at /api/register/team
  - Validate nested objects structure
  - Store jersey_number in database
  - Return 200/201 success response

---

**Test Status:** IN PROGRESS 🔄  
**Last Updated:** November 12, 2025  
**Next Update:** After manual testing completion
