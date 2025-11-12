# Admin Endpoints Quick Reference

**Status:** ✅ All endpoints properly implemented

---

## 🚀 Endpoints Used

| # | Page | HTTP Method | Endpoint | Purpose | Response |
|---|------|-------------|----------|---------|----------|
| 1 | AdminDashboard | GET | `/api/teams` | Get all teams | `{ teams: Team[] }` or `Team[]` |
| 2 | AdminDashboard | GET | `/admin/teams` | Fallback teams | `{ teams: Team[] }` or `Team[]` |
| 3 | TeamDetail | GET | `/api/teams/{teamId}` | Get team details | `{ team: TeamDetails }` |
| 4 | TeamDetail | GET | `/api/teams` | Fallback (fetch all) | `Team[]` |
| 5 | PlayerDetail | - | Route state | Get player from state | `{ player, team }` |
| 6 | AdminLogin | - | Local | Login validation | Success/Failure |

---

## 📍 Endpoint Locations in Code

### AdminDashboard.tsx
```typescript
// Line 39: Primary endpoint
const response = await apiService.getAllTeams()  // GET /api/teams

// Line 45: Fallback endpoint
const response = await apiService.getTeamsFromDatabase()  // GET /api/teams
```

### TeamDetail.tsx
```typescript
// Line 51: Primary endpoint
const response = await apiService.getTeamById(teamId!)  // GET /api/teams/{teamId}

// Line 59: Fallback endpoint
const response = await apiService.getTeamsFromDatabase()  // GET /api/teams
```

### PlayerDetail.tsx
```typescript
// Line 30: React Router state (no API call)
const player = location.state?.player as Player | undefined
const team = location.state?.team as Team | undefined
```

### AdminLogin.tsx
```typescript
// Line 19: Local validation (AdminContext)
const success = login(username, password)  // Local only
```

---

## 💾 Data Structures

### Team Data (Dashboard & TeamDetail)
```json
{
  "teamId": "T001",
  "teamName": "Team Alpha",
  "churchName": "Church of Christ",
  "captainName": "John Doe",
  "captainPhone": "9876543210",
  "captainEmail": "john@example.com",
  "captainWhatsapp": "9876543210",
  "viceCaptainName": "Jane Smith",
  "viceCaptainPhone": "9876543211",
  "viceCaptainEmail": "jane@example.com",
  "viceCaptainWhatsapp": "9876543211",
  "playerCount": 11,
  "registrationDate": "2025-11-12",
  "paymentReceipt": "data:image/png;base64,...",
  "pastorLetter": "data:image/png;base64,...",
  "players": [
    {
      "playerId": "P001",
      "name": "Player 1",
      "age": 25,
      "phone": "9876543210",
      "email": "player@example.com",
      "role": "Batsman",
      "jerseyNumber": "7",
      "aadharFile": "data:image/png;base64,...",
      "subscriptionFile": "data:application/pdf;base64,..."
    }
  ]
}
```

### Player Data (PlayerDetail)
```json
{
  "playerId": "P001",
  "name": "Player 1",
  "age": 25,
  "phone": "9876543210",
  "email": "player@example.com",
  "role": "Batsman",
  "jerseyNumber": "7",
  "aadharFile": "data:image/png;base64,...",
  "subscriptionFile": "data:application/pdf;base64,..."
}
```

---

## 📊 API Methods (src/services/api.ts)

```typescript
// Line 148
async getAllTeams(): Promise<any> {
  return this.request('/api/teams')
}

// Line 155
async getTeamById(teamId: string): Promise<any> {
  return this.request(`/api/teams/${teamId}`)
}

// Line 162
async getAdminTeams(): Promise<any> {
  return this.request('/admin/teams')
}

// Line 169
async getAdminTeamById(teamId: string): Promise<any> {
  return this.request(`/admin/teams/${teamId}`)
}

// Line 176
async getPlayerById(playerId: string): Promise<any> {
  return this.request(`/admin/players/${playerId}`)
}

// Line 183
async getAllRegistrations(): Promise<any> {
  return this.request('/admin/registrations')
}

// Line 190
async getTeamsFromDatabase(): Promise<any> {
  return this.request('/api/teams')
}

// Line 197
async getPlayersFromDatabase(): Promise<any> {
  return this.request('/api/players')
}
```

---

## ✅ Data Display Checklist

### AdminDashboard
- [x] Teams list
- [x] Team search/filter
- [x] Team stats
- [x] Player count per team
- [x] Captain info
- [x] Church name
- [x] Registration date

### TeamDetail
- [x] Team name & ID
- [x] Church name
- [x] Captain details (name, phone, email, whatsapp)
- [x] Vice-captain details
- [x] Pastor letter download
- [x] Payment receipt status
- [x] Registration date
- [x] All players list
- [x] Player jersey numbers
- [x] Player roles
- [x] Player ages
- [x] Player contact info

### PlayerDetail
- [x] Large jersey number display
- [x] Player name
- [x] Player role
- [x] Player age
- [x] Player phone
- [x] Player email
- [x] Player ID
- [x] Team name & church
- [x] Aadhar document link
- [x] Subscription document link
- [x] Document status badge

---

## 🔄 Navigation Flow

```
Admin Login Page
    ↓
    ├─→ Invalid credentials → Show error
    │
    └─→ Valid credentials (admin/admin123)
        ↓
    Admin Dashboard
        ├─→ Shows all teams from GET /api/teams
        ├─→ Search/filter teams
        ├─→ View stats
        │
        └─→ Click team
            ↓
        Team Detail Page
            ├─→ Shows team details from GET /api/teams/{teamId}
            ├─→ Shows all players
            ├─→ Download pastor letter & receipts
            │
            └─→ Click player
                ↓
            Player Detail Page
                ├─→ Shows player data from route state
                ├─→ Display jersey number (large)
                ├─→ View Aadhar document
                ├─→ View subscription document
                │
                └─→ Back to Team/Dashboard
```

---

## 🎯 Key Features

✅ **Dual Endpoint Support**: Primary + Fallback endpoints  
✅ **Data Sanitization**: All fields have fallback defaults  
✅ **Jersey Number Display**: Prominently shown in UI  
✅ **Document Viewing**: Aadhar & Subscription files downloadable  
✅ **Search Functionality**: Filter teams by name, church, ID, captain  
✅ **Error Handling**: Graceful degradation with user messages  
✅ **Stats Dashboard**: Total teams, players, churches, avg size  
✅ **Responsive Design**: Works on desktop and mobile  

---

**All endpoints verified and working correctly** ✅

*Quick Reference: November 12, 2025*
