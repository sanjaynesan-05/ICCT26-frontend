# Quick Start: Testing Frontend with Backend

## Current Status
✅ Frontend updated and corrected  
✅ Build compiles successfully  
✅ Development server running on `http://localhost:5174/`  
✅ Backend responding at `https://icct26-backend.onrender.com`

---

## Step 1: Start Dev Server
Already running! Visit: **http://localhost:5174/**

---

## Step 2: Test Registration Form

### Fill Out Complete Form:
1. **Step 1 - Terms:** Accept terms and conditions
2. **Step 2 - Church & Team:**
   - Select a church name
   - Enter team name (e.g., "Test Team")
3. **Step 3 - Captain:**
   - Name: "John Doe"
   - Phone: "9876543210"
   - Email: "john@example.com"
   - WhatsApp: "9876543210"
4. **Step 4 - Vice-Captain:**
   - Name: "Jane Smith"
   - Phone: "9876543211"
   - Email: "jane@example.com"
   - WhatsApp: "9876543211"
5. **Step 5 - Players:**
   - Add 11 players with:
     - Name
     - Age (18-40)
     - Phone
     - Role (Batsman, Bowler, etc.)
     - **Jersey Number (01-11)** ← NEW FIELD
     - Aadhar file (JPEG/PNG/PDF)
     - Subscription file (JPEG/PNG/PDF)
6. **Step 6 - Documents:**
   - Upload payment receipt
   - Upload pastor letter
7. **Review & Submit**

---

## Step 3: Verify API Call

### Using Browser DevTools:
1. Open DevTools: Press `F12`
2. Go to **Network** tab
3. Submit the form
4. Look for request to: `https://icct26-backend.onrender.com/api/register/team`
5. Click on request
6. Check **Payload** tab to verify structure:
   ```json
   {
     "team_name": "...",
     "church_name": "...",
     "captain": { "name": "...", ... },
     "viceCaptain": { "name": "...", ... },
     "players": [
       {
         "name": "...",
         "jersey_number": "01",
         ...
       }
     ]
   }
   ```

---

## Step 4: Check Response

### Expected Success Response:
- Status: `200` or `201`
- Response body contains confirmation
- Success modal appears on frontend

### If Error Occurs:
1. Check console for JavaScript errors: **F12 → Console**
2. Check Network response for error details
3. Verify all required fields are filled
4. Verify file uploads are valid

---

## What's New in This Version

### ✅ Jersey Number Field
- **Location:** Each player form
- **Validation:** Required, max 3 characters
- **Included in:** API payload under `players[].jersey_number`

### ✅ Corrected Payload Structure
- **Captain:** Now nested object `{ captain: { name, phone, email, whatsapp } }`
- **Vice-Captain:** Now nested object `{ viceCaptain: { name, phone, email, whatsapp } }`
- **Players:** Still array with jersey_number included

### ✅ File Upload Format
- **Accepted:** JPEG, PNG, PDF only
- **Encoding:** Base64 with `data:mime/type;base64,...` format
- **Size limit:** 5MB per file

---

## Quick Test Checklist

- [ ] Form loads without errors
- [ ] All fields are visible and editable
- [ ] Jersey number field appears in each player form
- [ ] File upload accepts JPEG, PNG, PDF
- [ ] File upload rejects other formats
- [ ] Form validation shows errors for empty fields
- [ ] Form submission sends request to backend
- [ ] Backend returns success response
- [ ] Success modal appears

---

## Troubleshooting

### Form Won't Submit
- Check console for errors
- Verify all required fields are filled
- Ensure files are valid format

### Files Won't Upload
- Check file format (JPEG, PNG, PDF only)
- Check file size (< 5MB)
- Try a different file

### Backend Connection Failed
- Check internet connection
- Verify backend URL in DevTools
- Check CORS errors in console

### Jersey Number Field Missing
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Check that npm run build succeeded

---

## Test Data Example

```
Team Name: Test Team Alpha
Church: St. James Church

Captain: John Doe
- Phone: 9876543210
- Email: john@example.com
- WhatsApp: 9876543210

Vice-Captain: Jane Smith
- Phone: 9876543211
- Email: jane@example.com
- WhatsApp: 9876543211

Players (11):
1. Rohit Sharma - Age 28 - Batsman - Jersey 01
2. Jasprit Bumrah - Age 30 - Bowler - Jersey 02
3. Virat Kohli - Age 35 - All-rounder - Jersey 03
... (8 more players)

Files:
- Payment Receipt: receipt.jpg or .pdf
- Pastor Letter: letter.pdf or .jpg
```

---

## Files & Resources

- **Frontend:** http://localhost:5174/
- **Backend API:** https://icct26-backend.onrender.com/api/register/team
- **Test Script:** `node test-api.js`
- **Testing Guide:** `FRONTEND_BACKEND_TESTING_GUIDE.md`
- **Integration Results:** `INTEGRATION_TEST_RESULTS.md`
- **Status Document:** `TESTING_COMPLETE_STATUS.md`

---

## Environment

- **Frontend Framework:** React 18+ with TypeScript
- **Dev Server:** Vite (http://localhost:5174/)
- **Backend:** FastAPI (https://icct26-backend.onrender.com)
- **Database:** Neon PostgreSQL
- **Deployment:** Netlify (Frontend) + Render (Backend)

---

**Last Updated:** November 12, 2025  
**Status:** Ready for comprehensive testing  
**Build:** ✅ Successful
