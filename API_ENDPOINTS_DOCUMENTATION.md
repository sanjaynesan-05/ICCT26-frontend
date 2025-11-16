# ICCT26 API Endpoints Documentation

**Last Updated:** November 16, 2025  
**Status:** ✅ Current and Complete  
**Base URL:** Configured in `src/config/app.config.ts`

---

## 📊 API Endpoints Overview

### Total Endpoints: 15

| Category | Count | Endpoints |
|----------|-------|-----------|
| **Registration** | 1 | registerTeam |
| **Status & Health** | 3 | health, status, db |
| **Teams** | 4 | getAllTeams, getTeamById, getTeamsFromDatabase, getAdminTeams |
| **Players** | 2 | getPlayerById, getPlayersFromDatabase |
| **Admin** | 5 | getAdminTeams, getAdminTeamById, getPlayerById, getAllRegistrations |

---

## 🔐 Authentication

**Status:** ⚠️ No authentication required (open endpoints)

**Note:** If you need to add authentication:
- Add Bearer token to request headers
- Implement JWT or similar auth mechanism
- Add auth middleware to backend

---

## 📋 Detailed Endpoint Reference

### 1. REGISTRATION ENDPOINTS

#### 1.1 Register Team
```
Method: POST
Endpoint: /api/register/team
Base URL: {VITE_API_URL}/api/register/team

Request Body:
{
  "team_name": string,
  "church_name": string,
  "captain": {
    "name": string,
    "phone": string (10 digits),
    "email": string,
    "whatsapp": string (10 digits)
  },
  "viceCaptain": {
    "name": string,
    "phone": string (10 digits),
    "email": string,
    "whatsapp": string (10 digits)
  },
  "payment_receipt": string (base64),
  "pastor_letter": string (base64),
  "groupPhoto": string (base64, optional),
  "players": [
    {
      "name": string,
      "role": string (optional),
      "aadhar_file": string (base64),
      "subscription_file": string (base64)
    }
  ]
}

Response:
{
  "success": boolean,
  "data": { team_id, registration_id },
  "error": string (if failed)
}

Status Codes:
- 201: Created - Team registered successfully
- 400: Bad Request - Validation error
- 500: Server Error
```

**Function:** `apiService.registerTeam(payload)`

---

### 2. STATUS & HEALTH CHECK ENDPOINTS

#### 2.1 Health Check
```
Method: GET
Endpoint: /health
Base URL: {VITE_API_URL}/health

Response:
{
  "status": "healthy",
  "timestamp": ISO8601
}

Status Codes:
- 200: OK - Backend is running
- 503: Service Unavailable
```

**Function:** `apiService.healthCheck()`

---

#### 2.2 API Status
```
Method: GET
Endpoint: /status
Base URL: {VITE_API_URL}/status

Response:
{
  "status": "operational",
  "api_version": string,
  "uptime": number
}

Status Codes:
- 200: OK
- 503: Service Unavailable
```

**Function:** `apiService.getApiStatus()` or `apiService.getRegistrationStatus()`

---

#### 2.3 Database Stats
```
Method: GET
Endpoint: /db
Base URL: {VITE_API_URL}/db

Response:
{
  "total_teams": number,
  "total_players": number,
  "total_churches": number,
  "database_status": string
}

Status Codes:
- 200: OK
- 503: Database unavailable
```

**Function:** `apiService.getDatabaseStats()`

---

### 3. TEAMS ENDPOINTS

#### 3.1 Get All Teams
```
Method: GET
Endpoint: /api/teams
Base URL: {VITE_API_URL}/api/teams

Query Parameters: None

Response:
{
  "success": boolean,
  "teams": [
    {
      "team_id": string,
      "team_name": string,
      "church_name": string,
      "captain_name": string,
      "captain_phone": string,
      "captain_email": string,
      "captain_whatsapp": string,
      "viceCaptain_name": string,
      "viceCaptain_phone": string,
      "viceCaptain_email": string,
      "viceCaptain_whatsapp": string,
      "player_count": number,
      "registration_date": ISO8601,
      "payment_receipt": data:URI (base64),
      "pastor_letter": data:URI (base64),
      "groupPhoto": data:URI (base64, optional)
    }
  ]
}

Status Codes:
- 200: OK
- 404: No teams found
- 500: Server Error
```

**Function:** `apiService.getAllTeams()` or `apiService.getTeamsFromDatabase()`

**Usage in Frontend:**
- Admin Dashboard: Display all teams
- Home Page: Count registered teams

---

#### 3.2 Get Team by ID
```
Method: GET
Endpoint: /api/teams/{team_id}
Base URL: {VITE_API_URL}/api/teams/{team_id}

Path Parameters:
- team_id: string (required)

Response:
{
  "success": boolean,
  "team": {
    "team_id": string,
    "team_name": string,
    "church_name": string,
    "captain": {
      "name": string,
      "phone": string,
      "email": string,
      "whatsapp": string
    },
    "viceCaptain": {
      "name": string,
      "phone": string,
      "email": string,
      "whatsapp": string
    },
    "payment_receipt": data:URI,
    "pastor_letter": data:URI,
    "groupPhoto": data:URI (optional),
    "registration_date": ISO8601
  },
  "players": [
    {
      "player_id": string,
      "name": string,
      "role": string,
      "aadhar_file": data:URI,
      "subscription_file": data:URI
    }
  ]
}

Status Codes:
- 200: OK
- 404: Team not found
- 500: Server Error
```

**Function:** `apiService.getTeamById(teamId)`

**Usage in Frontend:**
- Team Detail Page: Display team and squad info
- Admin Dashboard: Fetch complete team details

---

### 4. PLAYERS ENDPOINTS

#### 4.1 Get Player by ID
```
Method: GET
Endpoint: /admin/players/{player_id}
Base URL: {VITE_API_URL}/admin/players/{player_id}

Path Parameters:
- player_id: string (required)

Response:
{
  "success": boolean,
  "player": {
    "player_id": string,
    "name": string,
    "role": string,
    "team_id": string,
    "aadhar_file": data:URI,
    "subscription_file": data:URI
  }
}

Status Codes:
- 200: OK
- 404: Player not found
- 500: Server Error
```

**Function:** `apiService.getPlayerById(playerId)`

**Usage in Frontend:**
- Player Detail Page: Display player info and documents

---

#### 4.2 Get All Players
```
Method: GET
Endpoint: /api/players
Base URL: {VITE_API_URL}/api/players

Response:
{
  "success": boolean,
  "players": [
    {
      "player_id": string,
      "name": string,
      "role": string,
      "team_id": string,
      "team_name": string
    }
  ]
}

Status Codes:
- 200: OK
- 404: No players found
- 500: Server Error
```

**Function:** `apiService.getPlayersFromDatabase()`

---

### 5. ADMIN ENDPOINTS

#### 5.1 Get Admin Teams
```
Method: GET
Endpoint: /admin/teams
Base URL: {VITE_API_URL}/admin/teams

Response:
{
  "success": boolean,
  "teams": [
    {
      "team_id": string,
      "team_name": string,
      "church_name": string,
      "captain_name": string,
      "player_count": number,
      "registration_date": ISO8601
    }
  ]
}

Status Codes:
- 200: OK
- 403: Unauthorized (if auth required)
- 404: No teams found
- 500: Server Error
```

**Function:** `apiService.getAdminTeams()`

**Usage in Frontend:**
- Admin Dashboard: Display all teams with summary

---

#### 5.2 Get Admin Team by ID
```
Method: GET
Endpoint: /admin/teams/{team_id}
Base URL: {VITE_API_URL}/admin/teams/{team_id}

Path Parameters:
- team_id: string (required)

Response: Same as /api/teams/{team_id}

Status Codes:
- 200: OK
- 403: Unauthorized
- 404: Team not found
- 500: Server Error
```

**Function:** `apiService.getAdminTeamById(teamId)`

**Usage in Frontend:**
- Admin Team Details Page

---

#### 5.3 Get All Registrations
```
Method: GET
Endpoint: /admin/registrations
Base URL: {VITE_API_URL}/admin/registrations

Response:
{
  "success": boolean,
  "registrations": [
    {
      "team_id": string,
      "team_name": string,
      "players": [
        {
          "player_id": string,
          "name": string,
          "role": string
        }
      ]
    }
  ]
}

Status Codes:
- 200: OK
- 403: Unauthorized
- 500: Server Error
```

**Function:** `apiService.getAllRegistrations()`

**Usage in Frontend:**
- Admin: View all team and player registrations together

---

## 🔄 Request/Response Flow

### Registration Flow
```
1. User fills registration form
   ↓
2. Frontend converts files to Base64
   ↓
3. POST /api/register/team
   ↓
4. Backend validates and stores data
   ↓
5. Returns team_id and confirmation
   ↓
6. Frontend shows success modal
```

### Data Retrieval Flow
```
1. Admin logs in to dashboard
   ↓
2. GET /api/teams (fetch all teams summary)
   ↓
3. For each team, GET /api/teams/{team_id} (fetch full details)
   ↓
4. Merge team + players data
   ↓
5. Display in admin dashboard
```

---

## 🛠️ Implementation Details

### Base Configuration
**File:** `src/config/app.config.ts`

```typescript
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000'
}
```

### Error Handling
```typescript
try {
  const response = await apiService.getAllTeams()
  // Handle response
} catch (error) {
  // Frontend automatically shows:
  // - "Cannot reach backend" if connection fails
  // - "CORS Error" if CORS not configured
  // - Specific error message from backend
}
```

### Data Format Notes
- **Base64 Files:** Sent without data URI prefix in request
- **Response Files:** Returned with data URI prefix (e.g., `data:image/png;base64,...`)
- **Phone Numbers:** Must be exactly 10 digits (numeric only)
- **Emails:** Must be valid format (user@domain.ext)
- **Timestamps:** ISO 8601 format

---

## 📈 API Usage Statistics

### Frontend Pages Using Each Endpoint

| Endpoint | Used By | Purpose |
|----------|---------|---------|
| `registerTeam` | Registration Page | Submit team registration |
| `getAllTeams` | Home Page | Display teams count |
| `getAllTeams` | Admin Dashboard | List all teams |
| `getTeamById` | Admin Dashboard | Fetch full team details |
| `getTeamById` | Team Detail Page | Display team info |
| `getPlayerById` | Player Detail Page | Display player info |
| `healthCheck` | App Initialization | Verify backend availability |
| `getApiStatus` | Debug/Monitoring | Check API health |
| `getDatabaseStats` | Admin Dashboard | Display stats |

---

## ✅ Frontend Mapping

### Current Endpoint Usage
```typescript
// Home Page
apiService.getAllTeams()  // → Get teams count

// Registration Page
apiService.registerTeam(payload)  // → Register team

// Admin Dashboard
apiService.getAllTeams()  // → List teams
apiService.getTeamById(teamId)  // → Get team details

// Team Detail Page
apiService.getTeamById(teamId)  // → Get team + players

// Player Detail Page
apiService.getPlayerById(playerId)  // → Get player info
```

---

## 🚀 Production Checklist

- [ ] Verify all endpoints are accessible
- [ ] Test CORS configuration
- [ ] Validate error handling
- [ ] Check authentication (if needed)
- [ ] Monitor response times
- [ ] Test file upload (Base64) limits
- [ ] Verify data validation on backend
- [ ] Check rate limiting (if implemented)

---

## 📝 Notes

1. **No Authentication:** Current implementation has no authentication. Add if needed.
2. **CORS Required:** Backend must have CORS enabled for frontend domain
3. **Base64 Files:** Large files (5MB+) may cause timeout issues
4. **Error Messages:** Frontend provides helpful error messages for debugging
5. **Data Normalization:** Frontend handles both snake_case and camelCase responses

---

**API Documentation Complete** ✅  
Last Generated: November 16, 2025
