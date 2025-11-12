# Quick Browser Verification Steps

**Last Updated:** November 12, 2025

---

## 🚀 Quick Test to Verify Frontend is Sending Correct Data

### Step 1: Start Dev Server
```bash
cd d:\ICCT26
npm run dev
```
Access at: http://localhost:5175

---

### Step 2: Open DevTools
**Keyboard Shortcut:**
- Windows/Linux: `F12`
- Mac: `Cmd + Option + I`

**Or right-click:** Inspect → DevTools

---

### Step 3: Go to Console Tab
Click "Console" tab in DevTools

---

### Step 4: Fill the Form

**Step 1 (Team Details):**
- Church Name: Select any
- Team Name: "Test Team"
- Upload pastor letter: Any PDF/image
- Check "Accept terms"

**Step 2 (Captains):**
- Captain name: "John"
- Captain phone: "9876543210"
- Captain WhatsApp: "9876543210"
- Captain email: "john@test.com"
- Vice-captain: Same details

**Step 3 (Players) - AT LEAST 11:**
For each player:
- Name: "Player X"
- Age: 25
- Phone: "9876543210"
- Role: Select one
- **Jersey Number: "1", "2", "3", etc.** ← IMPORTANT
- Upload Aadhar: Any image
- Upload Subscription: Any image

**Step 4 (Review):**
- Click through (no action needed)

**Step 5 (Payment):**
- Upload payment receipt: Any image
- Click "Submit"

---

### Step 5: Check Console Output

**After clicking Submit, look for:**

```
📤 Registration Payload - Players jersey_number validation:
  Player 1: jersey_number="1" (type: string)
  Player 2: jersey_number="2" (type: string)
  Player 3: jersey_number="3" (type: string)
  ...
  Player 11: jersey_number="11" (type: string)
```

✅ **If you see this → Frontend is correct!**

---

### Step 6: Check Network Tab

1. Click "Network" tab in DevTools
2. Look for the `register/team` request (it's a POST)
3. Click on it
4. Go to "Payload" or "Request" tab
5. Scroll to `players` array
6. Expand first player
7. Look for: `"jersey_number": "1"`

✅ **If you see this → Frontend is sending correct format!**

---

## 📋 What to Look For

### ✅ CORRECT (What You Should See)

**Console Output:**
```
Player 1: jersey_number="1" (type: string)
Player 2: jersey_number="2" (type: string)
```

**Network Payload:**
```json
{
  "players": [
    {
      "name": "Player 1",
      "jersey_number": "1"
    }
  ]
}
```

---

### ❌ WRONG (What Would Indicate a Problem)

**Console Output:**
```
Player 1: jersey_number="undefined" (type: undefined)
Player 1: jersey_number="null" (type: object)
Player 1: jersey_number="" (type: string)
```

**Network Payload:**
```json
{
  "players": [
    {
      "name": "Player 1",
      "jerseyNumber": "1"              ❌ Wrong key!
    }
  ]
}
```

---

## 🧪 Test Different Jersey Numbers

Try these values to verify validation:

| Input | Expected Result |
|-------|-----------------|
| `7` | ✅ Accepted |
| `07` | ✅ Accepted |
| `99` | ✅ Accepted |
| `123` | ✅ Accepted |
| `1234` | ❌ Rejected (too long) |
| `ABC` | ❌ Rejected (non-numeric) |
| (empty) | ❌ Rejected (empty) |

---

## 🔍 Advanced: Check Full Payload

After submission, look at the full logged payload:

```
📤 Full payload:
{
  "team_name": "Test Team",
  "church_name": "Church Name",
  "captain": {
    "name": "John",
    "phone": "9876543210",
    "email": "john@test.com",
    "whatsapp": "9876543210"
  },
  "viceCaptain": {
    "name": "Jane",
    "phone": "9876543210",
    "email": "jane@test.com",
    "whatsapp": "9876543210"
  },
  "payment_receipt": "data:image/png;base64,ABC123...",
  "pastor_letter": "data:image/png;base64,DEF456...",
  "players": [
    {
      "name": "Player 1",
      "age": 25,
      "phone": "9876543210",
      "role": "Batsman",
      "jersey_number": "1",            ← ✅ Check this!
      "aadhar_file": "data:image/png;base64,GHI789...",
      "subscription_file": "data:application/pdf;base64,JKL012..."
    }
  ]
}
```

**Key things to verify:**
- ✅ `jersey_number` is present (not `jerseyNumber`)
- ✅ `jersey_number` has a value (not null/undefined)
- ✅ All Base64 files have `data:` prefix
- ✅ Payload structure matches this format

---

## 📱 Mobile Testing

To test on mobile:
1. Dev server by default accessible on local network
2. Find your computer's IP: `ipconfig` in terminal
3. Access from phone: `http://YOUR_IP:5175`
4. Use phone's DevTools if available (varies by browser)

---

## 🎯 Success Checklist

- [ ] Form fills without errors
- [ ] Console shows `📤 Registration Payload` message
- [ ] Console shows `Player N: jersey_number="X"` for all players
- [ ] Network request contains `"jersey_number": "X"`
- [ ] All players have jersey_number (not null/undefined)
- [ ] No validation errors appear
- [ ] Submit completes (either success or backend error)

✅ **If all checked → Frontend is working correctly!**

---

## 💡 Troubleshooting

### No Console Output After Submit
- Check if there were validation errors (red text)
- Look for JavaScript errors (red text in console)
- Try with fewer players (minimum 11)
- Ensure all required fields are filled

### Wrong Keys in Payload
- Close browser and clear cache
- Rebuild frontend: `npm run build`
- Restart dev server: `npm run dev`
- Refresh page completely: `Ctrl + Shift + R`

### Missing Files in Payload
- Ensure files are uploaded for each player
- Check that file uploads show checkmark/confirmation
- Try with different file types

---

## 🚀 Next Step: Backend Integration

Once frontend verification is complete:
1. **Frontend sends:** ✅ Verified
2. **Backend receives:** ⏳ Check backend logs
3. **Database stores:** ⏳ Query database
4. **Test result:** ⏳ See if NotNullViolationError resolves

---

*Quick Verification Guide - November 12, 2025*
