# Jersey Number NotNullViolationError - Complete Resolution Guide

**Status:** ✅ Frontend Correct | ⏳ Backend Needs Verification

**Updated:** November 12, 2025

---

## 🎯 Executive Summary

### Problem
```
asyncpg.exceptions.NotNullViolationError: null value in column "jersey_number" violates not-null constraint
```

### Root Cause Analysis
1. ✅ **Frontend:** Correctly sends `"jersey_number": "7"` in payload
2. ⏳ **Backend:** May not be receiving, parsing, or storing the value correctly

### Solution
1. ✅ Frontend implementation verified and enhanced
2. ⏳ Backend needs to be checked/debugged with provided guide

---

## ✅ What Frontend is Doing RIGHT

### 1. **Component Level** (PlayerFormCard.tsx)
✅ Collects `jerseyNumber` in state (camelCase)
```tsx
value={player.jerseyNumber}
onChange={(e) => onChange({ jerseyNumber: e.target.value })}
```

### 2. **State Management** (Registration.tsx)
✅ Preserves field through updates with spread operator
```typescript
{ ...p, ...data }  // Safely preserves all fields including jerseyNumber
```

### 3. **Validation** (Registration.tsx line 136)
✅ Ensures value is valid (1-3 digits)
```typescript
if (!/^\d{1,3}$/.test(player.jerseyNumber.trim())) 
  return `Player ${i + 1}: Jersey number must be 1-3 digits`
```

### 4. **Transformation** (Registration.tsx line 270)
✅ Maps to snake_case for API + fallback pattern
```typescript
jersey_number: p.jerseyNumber || String(idx + 1).padStart(2, '0')
```
Result: `jersey_number` is NEVER null or undefined

### 5. **TypeScript Contract** (src/services/api.ts)
✅ Interface expects `jersey_number: string`
```typescript
export interface TeamRegistrationPayload {
  players: Array<{
    jersey_number: string  // ✅ Correct
  }>
}
```

### 6. **Debugging** (Registration.tsx line 277-280)
✅ Console logs visible in DevTools
```typescript
console.log('📤 Registration Payload - Players jersey_number validation:')
payload.players.forEach((p, idx) => {
  console.log(`  Player ${idx + 1}: jersey_number="${p.jersey_number}" (type: ${typeof p.jersey_number})`)
})
```

---

## 📊 Expected API Payload

```json
{
  "team_name": "Team Alpha",
  "church_name": "Church Name",
  "captain": { "name": "...", "phone": "...", "email": "...", "whatsapp": "..." },
  "viceCaptain": { "name": "...", "phone": "...", "email": "...", "whatsapp": "..." },
  "payment_receipt": "data:image/png;base64,ABC123...",
  "pastor_letter": "data:image/png;base64,DEF456...",
  "players": [
    {
      "name": "Player 1",
      "age": 25,
      "phone": "9876543210",
      "role": "Batsman",
      "jersey_number": "7",                    ← ✅ CORRECT!
      "aadhar_file": "data:image/png;base64,GHI789...",
      "subscription_file": "data:application/pdf;base64,JKL012..."
    },
    {
      "name": "Player 2",
      "age": 26,
      "phone": "9876543211",
      "role": "Bowler",
      "jersey_number": "8",                    ← ✅ CORRECT!
      "aadhar_file": "data:image/png;base64,MNO345...",
      "subscription_file": "data:application/pdf;base64,PQR678..."
    }
  ]
}
```

**✅ Verified:** Frontend sends this exact structure

---

## 🧪 Verification Steps

### For Frontend Developers
1. Open browser DevTools (F12)
2. Go to Console tab
3. Fill form and submit
4. Look for: `📤 Registration Payload - Players jersey_number validation:`
5. Verify each player shows: `Player N: jersey_number="X"`

### For Backend Developers
1. Add logging to registration route (see BACKEND_JERSEY_NUMBER_DEBUG_GUIDE.md)
2. Submit test form from frontend
3. Check backend console for player data
4. Verify jersey_number is received and stored in DB

---

## 🔄 Data Flow Chain

```
Frontend                    │    Backend
─────────────────────────────────────────
User Input (7)              │
     ↓                       │
camelCase: jerseyNumber    │
     ↓                       │
Validation ✅ (1-3 digits)  │
     ↓                       │
Transform → jersey_number   │
     ↓                       │
Payload sent ─────────────→ Receive JSON
                           ├─ Parse to Pydantic
                           ├─ Validate field
                           ├─ Extract jersey_number value
                           ├─ Pass to DB insert
                           ├─ Insert into Column
                           └─ ✅ Success (no NULL error)
```

---

## ❌ If Backend Still Fails

### Checklist to Verify
- [ ] Backend Pydantic model has `jersey_number: str` (not `jerseyNumber`)
- [ ] FastAPI route receives the payload correctly
- [ ] Database model has `jersey_number` column
- [ ] Insert query includes `jersey_number=value`
- [ ] Column constraint is NOT NULL
- [ ] Value is not empty string being treated as null

### Debug Steps
1. Enable backend logging (see guide)
2. Submit form from frontend
3. Check backend console for jersey_number in logs
4. Query database for actual values
5. Check database schema for column definition

---

## 📋 Complete File Changes

### Modified Files
1. **src/pages/Registration.tsx**
   - Line 136: Added regex validation for jersey format
   - Line 270: Added fallback pattern for jersey_number
   - Lines 277-280: Added console logging for debugging

2. **src/components/PlayerFormCard.tsx**
   - Already correct (jersey input with proper validation)

3. **src/services/api.ts**
   - Already correct (jersey_number in TeamRegistrationPayload)

### No Breaking Changes
- All existing functionality preserved
- Only added validation and safety measures
- Console logs added for debugging (can be removed in production)

---

## ✅ Testing Checklist Before Deployment

- [x] Build successful (npm run build)
- [x] No TypeScript errors
- [x] Dev server running (npm run dev)
- [x] Form validation working
- [x] Jersey number input accepts 1-3 digits
- [x] Jersey number validation shows error for invalid input
- [x] Console logs show jersey_number in payload
- [x] Network tab shows jersey_number in POST request
- [ ] Backend receives and parses jersey_number correctly
- [ ] Database stores jersey_number without null violations
- [ ] End-to-end test from form submission to DB insert

---

## 🚀 Deployment Status

### Frontend: ✅ READY
- All changes implemented and tested
- Build successful with 0 errors
- No TypeScript errors
- Validation working correctly
- Debugging logs added

### Backend: ⏳ NEEDS VERIFICATION
- Check logging output when frontend submits
- Verify Pydantic model field name matches
- Confirm database insert includes jersey_number
- Test end-to-end with debug logging enabled

---

## 📞 If You Need Help

### Frontend Issues
Check:
1. Browser Console for error messages
2. DevTools Network → POST payload for jersey_number field
3. Validation error messages for clues

### Backend Issues
Enable debug logging and share:
1. Full request payload received
2. Player data after parsing
3. Database insert query
4. Final value in database

---

## 🎯 Success Criteria

✅ **Deployment is successful when:**
1. Form submission completes without errors
2. Backend logs show `jersey_number` in player data
3. Database query shows jersey_number values (not NULL)
4. No `NotNullViolationError` exceptions
5. All 11-15 players registered per team

---

## 📝 Summary Table

| Step | Component | Status | Notes |
|------|-----------|--------|-------|
| 1 | User enters jersey number | ✅ | Input accepts 1-3 digits |
| 2 | Component state | ✅ | camelCase: jerseyNumber |
| 3 | Validation | ✅ | Regex /^\d{1,3}$/ |
| 4 | Transform to payload | ✅ | snake_case: jersey_number |
| 5 | Add fallback | ✅ | `p.jerseyNumber \|\| String(idx+1).padStart(2,'0')` |
| 6 | API transmission | ✅ | POST with correct JSON |
| 7 | Backend receives | ⏳ | Needs verification |
| 8 | Pydantic parse | ⏳ | Must have jersey_number field |
| 9 | DB insert | ⏳ | Must pass jersey_number value |
| 10 | DB constraint | ✅ | NOT NULL constraint exists |

---

## 🔗 Related Documents

- `DEPLOYMENT_READY.md` - Production readiness checklist
- `FRONTEND_JERSEY_NUMBER_VERIFICATION.md` - Detailed frontend verification
- `BACKEND_JERSEY_NUMBER_DEBUG_GUIDE.md` - Backend debugging steps
- `CHANGES_SUMMARY.md` - Summary of code changes
- `JERSEY_NUMBER_VALIDATION_TEST.md` - Testing procedures

---

**Status: Ready for Backend Integration Testing**

*Last Updated: November 12, 2025*
