# Backend Integration Testing Guide

## ✅ Configuration Status

### Environment Variables
- ✅ `.env` configured with: `VITE_API_URL=https://icct26-backend.onrender.com`
- ✅ `app.config.ts` reads from `VITE_API_URL`
- ✅ API client uses correct base URL
- ✅ Build successful

### API Endpoints
All frontend calls now use:
- `https://icct26-backend.onrender.com/api/schedule/matches`

---

## Testing Checklist

### 1. Start Frontend Development Server
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

### 2. Test Admin Schedule Manager

#### A. Access Admin Dashboard
1. Navigate to `/admin` or click "Admin" in navigation
2. Login with admin credentials
3. Click "📅 Schedule Manager" button

#### B. Test Create Match
1. Click "➕ Create Match" button
2. Fill in form:
   - Round: "Round 1"
   - Round Number: 1
   - Match Number: 1
   - Team 1: Enter a team name from your database
   - Team 2: Enter another team name
3. Click "Save Match"
4. **Expected Result**: Success message, match appears in list

**If Error**: Check browser console (F12) for:
- Network tab → verify request went to correct URL
- Response shows `detail` error message from backend
- Common errors:
  - "Team 'X' not found" → Team doesn't exist in database
  - CORS error → Backend CORS not configured
  - Connection refused → Backend not running

#### C. Test Update Status
1. Find a match with status "scheduled"
2. Click the "▶ Set Live" button
3. **Expected Result**: Status changes to "live", button changes to "✅ Complete"
4. Click "✅ Complete" button
5. **Expected Result**: Status changes to "completed"

#### D. Test Set Result
1. Find a completed match (or complete one)
2. Click "Set Result" button
3. Fill in result form:
   - Winner: Select team1 or team2
   - How They Won: Choose "Batting First" or "Chasing"
   - Margin: Enter number (1-999 for runs, 1-10 for wickets)
4. **Expected Result**: 
   - Preview shows: "Team X won by Y runs/wickets"
   - Click Save
   - Success message appears
   - Result displays in match card

**Validation Tests**:
- Try margin = 0 → Should show error "Margin must be greater than 0"
- Try wickets > 10 → Should show error "Wickets margin cannot exceed 10"
- Try runs > 999 → Should show error "Runs margin cannot exceed 999"

#### E. Test Update Match
1. Click "✏️ Edit" button on any scheduled match
2. Change team names or match number
3. Click "Save Match"
4. **Expected Result**: Match updated successfully

#### F. Test Delete Match
1. Find a SCHEDULED match
2. Click "🗑️ Delete" button
3. Confirm deletion
4. **Expected Result**: Match removed from list

**Try with completed match**:
- Should show error "Cannot delete a completed match"

---

### 3. Test Public Schedule Page

#### A. Navigate to Schedule
1. Go to `/schedule` or click "Schedule" in navigation
2. **Expected Result**: Matches load from backend

#### B. Test Tab Filtering
1. Check "Ongoing" tab → Shows only live matches
2. Check "Upcoming" tab → Shows only scheduled matches
3. Check "Done" tab → Shows only completed matches with results

#### C. Verify Results Display
For completed matches, verify:
- Winner name shown
- Margin and type displayed correctly
- "Batting first" or "Chasing" indicator shown
- Example: "Mumbai Kings won by 45 runs (batting first)"

---

### 4. Test Export Functionality

1. In Schedule Manager, click "💾 Export Schedule" button
2. **Expected Result**: 
   - JSON file downloads
   - Filename: `icct26-schedule-YYYY-MM-DD.json`
   - Contains all matches with results

---

## Common Issues & Solutions

### Issue 1: CORS Error
**Symptom**: Console shows `Access-Control-Allow-Origin` error

**Solution**: Backend must have CORS middleware:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 2: 404 on All API Calls
**Symptom**: All requests return 404

**Check**:
1. Backend is running at `https://icct26-backend.onrender.com`
2. Try direct API call: `https://icct26-backend.onrender.com/api/schedule/matches`
3. Verify `.env` file has correct URL

### Issue 3: "Team not found" Error
**Symptom**: Can't create match, error says team doesn't exist

**Solution**: 
1. Check team names exactly match database
2. Teams must exist in `teams` table
3. Use exact team name with correct capitalization

### Issue 4: Empty Schedule
**Symptom**: Schedule page shows no matches

**Check**:
1. Open browser console (F12)
2. Network tab → Check if `/api/schedule/matches` returns data
3. If backend returns empty array, create matches first in admin panel

### Issue 5: Status Update Fails
**Symptom**: Status button doesn't work

**Check**:
1. Console shows error message
2. Verify backend endpoint: `PUT /api/schedule/matches/{id}/status`
3. Verify request body: `{"status": "live"}`

---

## API Request Examples

### Successful Requests (for debugging)

#### 1. Fetch Matches
```
GET https://icct26-backend.onrender.com/api/schedule/matches

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "round": "Round 1",
      "round_number": 1,
      "match_number": 1,
      "team1": "Mumbai Kings",
      "team2": "Delhi Warriors",
      "status": "scheduled",
      "result": null
    }
  ]
}
```

#### 2. Create Match
```
POST https://icct26-backend.onrender.com/api/schedule/matches
Content-Type: application/json

{
  "round": "Round 1",
  "round_number": 1,
  "match_number": 1,
  "team1": "Mumbai Kings",
  "team2": "Delhi Warriors"
}

Response:
{
  "success": true,
  "message": "Match created successfully",
  "data": { ...match object }
}
```

#### 3. Update Status
```
PUT https://icct26-backend.onrender.com/api/schedule/matches/1/status
Content-Type: application/json

{
  "status": "live"
}

Response:
{
  "success": true,
  "message": "Match status updated",
  "data": { ...match object with status="live" }
}
```

#### 4. Set Result
```
POST https://icct26-backend.onrender.com/api/schedule/matches/1/result
Content-Type: application/json

{
  "winner": "Mumbai Kings",
  "margin": 45,
  "marginType": "runs",
  "wonByBattingFirst": true
}

Response:
{
  "success": true,
  "message": "Match result saved successfully",
  "data": { ...match object with result and status="completed" }
}
```

---

## Browser Console Debugging

### Enable Detailed Logging
Frontend already has console logging. Open console (F12) and look for:

- `📤 [API Request]` - Shows outgoing requests
- `✅ [API Response]` - Shows successful responses
- `❌ [API Error]` - Shows error details

### Example Console Output (Success)
```
📤 [API Request] POST /api/schedule/matches { isMultipart: false }
✅ [API Response] POST /api/schedule/matches { status: 201, duration: 324ms, success: true }
```

### Example Console Output (Error)
```
📤 [API Request] POST /api/schedule/matches { isMultipart: false }
❌ [API Error] POST /api/schedule/matches {
  status: 400,
  duration: 156ms,
  message: "Request failed with status code 400",
  errorMessage: "Team 'Invalid Team' not found"
}
```

---

## Quick Verification Commands

### Check Backend is Running
```bash
curl https://icct26-backend.onrender.com/api/schedule/matches
```

Should return JSON with matches array.

### Check CORS
Open browser console on your site and run:
```javascript
fetch('https://icct26-backend.onrender.com/api/schedule/matches')
  .then(r => r.json())
  .then(d => console.log('✅ CORS working:', d))
  .catch(e => console.error('❌ CORS error:', e))
```

---

## Success Criteria

✅ **Integration is working when**:
1. Admin can create matches without errors
2. Admin can update match status (scheduled → live → completed)
3. Admin can set match results with validation
4. Public schedule displays matches from backend
5. Tab filtering works correctly
6. Results display with correct formatting
7. Export downloads JSON file

---

## Next Steps After Testing

1. **If all tests pass**: Deploy frontend to production (Netlify/Vercel)
2. **If tests fail**: Check console errors and use debugging section above
3. **Add more matches**: Use admin panel to create full tournament schedule
4. **Test with real team data**: Ensure team names match your database exactly

---

## Support

If you encounter issues:
1. Check browser console (F12) for detailed error messages
2. Check Network tab to see exact request/response
3. Verify backend is accessible: `curl https://icct26-backend.onrender.com/api/schedule/matches`
4. Check backend logs on Render.com dashboard
