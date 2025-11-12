# Frontend-Backend Integration Testing Guide

## Development Server
✅ **Running on:** `http://localhost:5174/`
✅ **Backend API:** `https://icct26-backend.onrender.com`

## Test Scenarios

### 1. Navigation & UI Tests

#### Test 1.1: Home Page Load
- [ ] Navigate to `http://localhost:5174/`
- [ ] Verify page loads without errors
- [ ] Check console for any JavaScript errors
- [ ] Verify all header/navigation elements display correctly

#### Test 1.2: Registration Page Load
- [ ] Click on "Registration" in navigation
- [ ] Verify registration form loads
- [ ] Check that all form fields are visible
- [ ] Verify progress bar shows Step 1/6

---

### 2. Form Validation Tests

#### Test 2.1: Terms and Conditions
- [ ] Verify terms checkbox is required
- [ ] Try clicking "Next" without accepting terms
- [ ] Should show error: "Please accept the terms and conditions to proceed"
- [ ] Accept terms and verify "Next" button works

#### Test 2.2: Church & Team Information
- [ ] Try submitting without entering church name
- [ ] Should show error: "Please select a church name"
- [ ] Try submitting without entering team name
- [ ] Should show error: "Please enter a team name"

#### Test 2.3: Captain Information
- [ ] Verify all captain fields are required:
  - [ ] Name: "Please enter captain name"
  - [ ] Phone: "Please enter captain phone number"
  - [ ] Email: "Please enter valid email for captain"
  - [ ] WhatsApp: "Please enter valid 10-digit WhatsApp number for captain"

#### Test 2.4: Vice-Captain Information
- [ ] Verify all vice-captain fields work same as captain
- [ ] Test with different values than captain

---

### 3. Player Form Tests

#### Test 3.1: Player Count Validation
- [ ] Verify form starts with 11 players
- [ ] Try removing players below 11
- [ ] Should show error: "Team must have between 11 and 15 players"
- [ ] Add players up to 15
- [ ] Try adding 16th player
- [ ] Should disable "Add Player" button at 15 players

#### Test 3.2: Player Field Validation
For each player, test:
- [ ] Name field (required)
- [ ] Age field (must be 18-40)
- [ ] Phone field (required, valid format)
- [ ] Role selection (Batsman, Bowler, All-rounder, Wicketkeeper)
- [ ] **Jersey Number** (required, max 3 characters)
- [ ] Aadhar/ID file upload (JPEG, PNG, PDF only)
- [ ] Subscription/Consent file upload (JPEG, PNG, PDF only)

#### Test 3.3: File Upload Validation
- [ ] Try uploading unsupported file type (e.g., .txt, .docx)
- [ ] Should show error or reject file
- [ ] Upload valid JPEG file
- [ ] Verify file is converted to Base64
- [ ] Upload valid PNG file
- [ ] Upload valid PDF file
- [ ] Verify file size limit (5MB)

#### Test 3.4: Jersey Number Field
- [ ] Verify jersey number field appears for each player
- [ ] Enter jersey number and verify maxLength=3
- [ ] Try submitting without jersey number
- [ ] Should show error: "Please enter jersey number"

---

### 4. Document Upload Tests

#### Test 4.1: Payment Receipt
- [ ] Try submitting without payment receipt
- [ ] Should show error: "Please upload payment receipt"
- [ ] Upload valid payment receipt (JPEG/PNG/PDF)
- [ ] Verify file is converted to Base64

#### Test 4.2: Pastor Letter
- [ ] Try submitting without pastor letter
- [ ] Should show error: "Please upload a church letter"
- [ ] Upload valid pastor letter
- [ ] Verify file is converted to Base64

---

### 5. Form Submission Tests

#### Test 5.1: Complete Valid Registration
Fill out complete form with:
```
Church: Select valid church
Team Name: "Test Team 1"
Captain: Name "John Doe", Phone "9876543210", Email "john@example.com", WhatsApp "9876543210"
Vice-Captain: Name "Jane Smith", Phone "9876543211", Email "jane@example.com", WhatsApp "9876543211"
11 Players with:
  - Valid names
  - Age 18-40
  - Valid phone numbers
  - Valid roles
  - Jersey numbers (01-11)
  - Valid file uploads
Payment Receipt: Upload valid file
Pastor Letter: Upload valid file
```

Then:
- [ ] Click "Submit" button
- [ ] Monitor Network tab in browser DevTools
- [ ] Verify API request is sent to: `POST https://icct26-backend.onrender.com/api/register/team`
- [ ] Check request payload matches schema:
  ```json
  {
    "team_name": "Test Team 1",
    "church_name": "Selected Church",
    "captain_name": "John Doe",
    "captain_phone": "9876543210",
    "captain_email": "john@example.com",
    "captain_whatsapp": "9876543210",
    "vice_captain_name": "Jane Smith",
    "vice_captain_phone": "9876543211",
    "vice_captain_email": "jane@example.com",
    "vice_captain_whatsapp": "9876543211",
    "payment_receipt": "data:image/jpeg;base64,...",
    "pastor_letter": "data:image/jpeg;base64,...",
    "players": [
      {
        "name": "Player 1",
        "age": 25,
        "phone": "9876543220",
        "role": "Batsman",
        "jersey_number": "01",
        "aadhar_file": "data:image/jpeg;base64,...",
        "subscription_file": "data:image/jpeg;base64,..."
      },
      ...
    ]
  }
  ```

#### Test 5.2: Verify Success Response
- [ ] Backend should respond with 200/201 status
- [ ] Success modal should appear
- [ ] Modal should display confirmation message
- [ ] Verify response data (if any)

#### Test 5.3: Error Handling
- [ ] If backend returns error, verify error message displays
- [ ] Check console for error details
- [ ] Verify form doesn't reset (allows user to fix and resubmit)

---

### 6. Network Tests

#### Test 6.1: Backend Connectivity
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Fill and submit form
- [ ] Verify request goes to correct URL:
  - `https://icct26-backend.onrender.com/api/register/team`
- [ ] Check request headers include:
  - `Content-Type: application/json`
- [ ] Verify response status (should be 200 or 201)

#### Test 6.2: CORS Testing
- [ ] If CORS error appears in console, verify backend CORS configuration
- [ ] Backend should allow requests from:
  - `http://localhost:5174` (development)
  - `https://icct26.netlify.app` (production)

#### Test 6.3: Offline Testing
- [ ] Disable internet/network in DevTools
- [ ] Try submitting form
- [ ] Should show network error message
- [ ] Verify error message is user-friendly

---

### 7. Data Validation Tests

#### Test 7.1: Field Format Validation
- [ ] Email fields: Test invalid emails (missing @, no domain)
- [ ] Phone numbers: Test invalid formats
- [ ] Age field: Test values < 18 and > 40
- [ ] Jersey numbers: Test values > 3 characters

#### Test 7.2: File Format Validation
- [ ] Upload .txt file → Should reject
- [ ] Upload .doc/.docx file → Should reject
- [ ] Upload .jpg file → Should accept
- [ ] Upload .png file → Should accept
- [ ] Upload .pdf file → Should accept
- [ ] Upload file > 5MB → Should reject or show size error

#### Test 7.3: Duplicate Data
- [ ] Submit form with same data twice
- [ ] Verify backend handles duplicate submissions
- [ ] Check if backend returns appropriate error

---

### 8. Console & Performance Tests

#### Test 8.1: Browser Console
- [ ] Open DevTools Console (F12 → Console tab)
- [ ] Fill and submit form
- [ ] Verify NO JavaScript errors appear
- [ ] Check for any warning messages

#### Test 8.2: Network Performance
- [ ] Monitor Network tab
- [ ] Verify API request completes within reasonable time (< 10s)
- [ ] Check file upload performance (Base64 encoding)
- [ ] Verify no failed requests

#### Test 8.3: Memory Usage
- [ ] Open DevTools Performance tab
- [ ] Perform form submission
- [ ] Verify no memory leaks
- [ ] Check performance is acceptable

---

## Test Data Templates

### Church Names
```
Select from available churches in dropdown
```

### Sample Players Data
```
Player 1: Name="Rohit Sharma", Age=28, Phone="9876543220", Role="Batsman", Jersey="01"
Player 2: Name="Jasprit Bumrah", Age=30, Phone="9876543221", Role="Bowler", Jersey="02"
Player 3: Name="Virat Kohli", Age=35, Phone="9876543222", Role="All-rounder", Jersey="03"
Player 4: Name="MS Dhoni", Age=43, Phone="9876543223", Role="Wicketkeeper", Jersey="04"
Player 5: Name="Hardik Pandya", Age=30, Phone="9876543224", Role="All-rounder", Jersey="05"
Player 6: Name="Ravindra Jadeja", Age=35, Phone="9876543225", Role="All-rounder", Jersey="06"
Player 7: Name="Suryakumar Yadav", Age=33, Phone="9876543226", Role="Batsman", Jersey="07"
Player 8: Name="Rishabh Pant", Age=26, Phone="9876543227", Role="Wicketkeeper", Jersey="08"
Player 9: Name="KL Rahul", Age=32, Phone="9876543228", Role="Batsman", Jersey="09"
Player 10: Name="Bhuvneshwar Kumar", Age=34, Phone="9876543229", Role="Bowler", Jersey="10"
Player 11: Name="Yuzvendra Chahal", Age=32, Phone="9876543230", Role="Bowler", Jersey="11"
```

### File References
- **Test JPEG:** Use any .jpg or .jpeg image file
- **Test PNG:** Use any .png image file  
- **Test PDF:** Use any .pdf document
- **Ensure files are < 5MB each**

---

## Common Issues & Troubleshooting

### Issue 1: Backend Not Responding
**Error:** "Cannot reach backend at https://icct26-backend.onrender.com"
**Solution:**
- [ ] Check backend is running: `https://icct26-backend.onrender.com/api/health` (if available)
- [ ] Verify VITE_API_URL in .env file
- [ ] Check internet connection
- [ ] Verify CORS is enabled on backend

### Issue 2: CORS Error
**Error:** "Access to XMLHttpRequest blocked by CORS policy"
**Solution:**
- [ ] Backend must include CORS headers
- [ ] Add frontend URL to backend CORS whitelist

### Issue 3: Files Not Uploading
**Error:** "File upload failed" or files not appearing in payload
**Solution:**
- [ ] Verify file format is JPEG, PNG, or PDF
- [ ] Check file size is < 5MB
- [ ] Clear browser cache and try again
- [ ] Check browser console for errors

### Issue 4: Field Validation Not Working
**Error:** Form allows invalid data
**Solution:**
- [ ] Clear browser cache
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Check browser console for JavaScript errors

### Issue 5: Jersey Number Field Missing
**Error:** Jersey number field not visible for players
**Solution:**
- [ ] Verify PlayerFormCard.tsx was updated
- [ ] Hard refresh browser
- [ ] Check npm run build was successful

---

## Success Criteria ✅

- [ ] All form fields validate correctly
- [ ] All file uploads work (JPEG, PNG, PDF)
- [ ] API request payload matches backend schema (snake_case keys)
- [ ] jersey_number field is included in payload
- [ ] All Base64 files are properly encoded
- [ ] Backend responds successfully (200/201 status)
- [ ] Success modal appears after submission
- [ ] No JavaScript errors in console
- [ ] Form submissions complete within 10 seconds
- [ ] Data persists correctly on backend

---

## Notes
- Development server: `http://localhost:5174/`
- Backend API: `https://icct26-backend.onrender.com`
- API Endpoint: `POST /api/register/team`
- Maximum payload size will depend on backend (typically 10-50MB for Base64 files)
- All sensitive data should be validated on both frontend and backend

---

**Last Updated:** November 12, 2025
**Status:** Ready for Testing
