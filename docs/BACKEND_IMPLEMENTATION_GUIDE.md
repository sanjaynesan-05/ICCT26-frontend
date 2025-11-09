# 🏗️ Backend Implementation Guide - Admin Panel Endpoints

## Overview

This guide details all the backend endpoints required for the admin panel to function with real data from the PostgreSQL database.

---

## 📡 Priority 1: Critical Endpoints (Must Implement)

### 1. GET `/admin/teams` - List All Teams

Fetch all registered teams for the admin dashboard.

**Endpoint:**
```
GET /admin/teams
```

**Description:**
Returns a list of all registered teams with basic information. Used to populate the admin dashboard with team statistics and search functionality.

**Request:**
```bash
curl http://localhost:8000/admin/teams
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "teams": [
    {
      "teamId": "ICCT26-0001",
      "teamName": "Thunder Strikers",
      "churchName": "CSI St. Peter's Church",
      "captainName": "John Doe",
      "captainPhone": "+919876543210",
      "captainEmail": "john@example.com",
      "viceCaptainName": "Jane Smith",
      "viceCaptainPhone": "+919123456789",
      "viceCaptainEmail": "jane@example.com",
      "playerCount": 11,
      "registrationDate": "2026-01-15 10:30:45",
      "paymentReceipt": "TXN123456789"
    },
    {
      "teamId": "ICCT26-0002",
      "teamName": "Victory Kings",
      "churchName": "St. Thomas Cathedral",
      "captainName": "Raj Kumar",
      "captainPhone": "+919876543211",
      "captainEmail": "raj@example.com",
      "viceCaptainName": "Priya Singh",
      "viceCaptainPhone": "+919123456790",
      "viceCaptainEmail": "priya@example.com",
      "playerCount": 12,
      "registrationDate": "2026-01-20 14:15:30",
      "paymentReceipt": "TXN123456790"
    }
  ]
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "database_error",
  "message": "Failed to fetch teams from database",
  "detail": "Connection to PostgreSQL database failed"
}
```

**Implementation Notes:**
- Query the `teams` table from PostgreSQL
- Count the number of players per team from the `players` table
- Return all teams, sorted by registration date (newest first)
- Handle missing fields gracefully (use null/empty string)

---

### 2. GET `/admin/teams/{teamId}` - Get Team Details with Player Roster

Fetch complete team information including all players.

**Endpoint:**
```
GET /admin/teams/{teamId}
```

**Parameters:**
| Name | Type | Location | Required | Example |
|------|------|----------|----------|---------|
| teamId | string | URL Path | Yes | ICCT26-0001 |

**Description:**
Returns detailed information for a specific team, including the complete player roster with all player details and document URLs.

**Request:**
```bash
curl http://localhost:8000/admin/teams/ICCT26-0001
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "team": {
    "teamId": "ICCT26-0001",
    "teamName": "Thunder Strikers",
    "churchName": "CSI St. Peter's Church",
    "captainName": "John Doe",
    "captainPhone": "+919876543210",
    "captainEmail": "john@example.com",
    "captainWhatsapp": "919876543210",
    "viceCaptainName": "Jane Smith",
    "viceCaptainPhone": "+919123456789",
    "viceCaptainEmail": "jane@example.com",
    "viceCaptainWhatsapp": "919123456789",
    "paymentReceipt": "TXN123456789",
    "pastorLetter": "https://drive.google.com/file/d/1abc123xyz/view",
    "registrationDate": "2026-01-15 10:30:45",
    "players": [
      {
        "playerId": "ICCT26-0001-P001",
        "name": "John Doe",
        "age": 25,
        "phone": "+919876543210",
        "email": "john@example.com",
        "role": "Captain",
        "jerseyNumber": "1",
        "aadharFile": "https://drive.google.com/file/d/aadhar1/view",
        "subscriptionFile": "https://drive.google.com/file/d/sub1/view"
      },
      {
        "playerId": "ICCT26-0001-P002",
        "name": "Mike Johnson",
        "age": 24,
        "phone": "+919876543211",
        "email": "mike@example.com",
        "role": "Batsman",
        "jerseyNumber": "2",
        "aadharFile": "https://drive.google.com/file/d/aadhar2/view",
        "subscriptionFile": "https://drive.google.com/file/d/sub2/view"
      }
      // ... 9-13 more players
    ]
  }
}
```

**Error Response - Team Not Found (404):**
```json
{
  "error": "team_not_found",
  "message": "Team ICCT26-0001 not found",
  "detail": "The requested team does not exist in the database"
}
```

**Error Response - Database Error (500):**
```json
{
  "error": "database_error",
  "message": "Failed to fetch team details",
  "detail": "Connection to PostgreSQL database failed"
}
```

**Implementation Notes:**
- Query `teams` table for the team by `teamId`
- Query `players` table for all players belonging to this team
- Validate that `teamId` format is correct (ICCT26-XXXX)
- Return 404 if team doesn't exist
- Include all player documents as URLs
- Sort players by jersey number

---

### 3. GET `/admin/players/{playerId}` - Get Player Details

Fetch individual player information with team context.

**Endpoint:**
```
GET /admin/players/{playerId}
```

**Parameters:**
| Name | Type | Location | Required | Example |
|------|------|----------|----------|---------|
| playerId | string | URL Path | Yes | ICCT26-0001-P001 |

**Description:**
Returns detailed information for a specific player, including team details, contact information, and document URLs.

**Request:**
```bash
curl http://localhost:8000/admin/players/ICCT26-0001-P001
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "player": {
    "playerId": "ICCT26-0001-P001",
    "teamId": "ICCT26-0001",
    "teamName": "Thunder Strikers",
    "churchName": "CSI St. Peter's Church",
    "name": "John Doe",
    "age": 25,
    "phone": "+919876543210",
    "email": "john@example.com",
    "role": "Captain",
    "jerseyNumber": "1",
    "aadharFile": "https://drive.google.com/file/d/aadhar1/view",
    "subscriptionFile": "https://drive.google.com/file/d/sub1/view"
  }
}
```

**Error Response - Player Not Found (404):**
```json
{
  "error": "player_not_found",
  "message": "Player ICCT26-0001-P001 not found",
  "detail": "The requested player does not exist in the database"
}
```

**Error Response - Database Error (500):**
```json
{
  "error": "database_error",
  "message": "Failed to fetch player details",
  "detail": "Connection to PostgreSQL database failed"
}
```

**Implementation Notes:**
- Query `players` table for the player by `playerId`
- Include team information from `teams` table
- Validate that `playerId` format is correct (ICCT26-XXXX-PXXX)
- Return 404 if player doesn't exist
- Include document URLs as stored in the database

---

## 📋 Field Specifications

### Team Fields

| Field | Type | Required | Format | Constraints | Example |
|-------|------|----------|--------|-------------|---------|
| teamId | string | Yes | ICCT26-XXXX | 4-digit sequential | ICCT26-0001 |
| teamName | string | Yes | text | 3-50 characters | Thunder Strikers |
| churchName | string | Yes | text | - | CSI St. Peter's Church |
| captainName | string | Yes | text | - | John Doe |
| captainPhone | string | Yes | +91XXXXXXXXXX | 13 characters with +91 prefix | +919876543210 |
| captainEmail | string | Yes | email | valid email format | john@example.com |
| captainWhatsapp | string | No | 91XXXXXXXXXX | 12 characters without prefix | 919876543210 |
| viceCaptainName | string | Yes | text | - | Jane Smith |
| viceCaptainPhone | string | Yes | +91XXXXXXXXXX | 13 characters with +91 prefix | +919123456789 |
| viceCaptainEmail | string | Yes | email | valid email format | jane@example.com |
| viceCaptainWhatsapp | string | No | 91XXXXXXXXXX | 12 characters without prefix | 919123456789 |
| playerCount | number | Yes | integer | 11-15 players | 11 |
| registrationDate | string | Yes | YYYY-MM-DD HH:MM:SS | ISO datetime format | 2026-01-15 10:30:45 |
| paymentReceipt | string | Yes | text | transaction ID | TXN123456789 |
| pastorLetter | string | No | URL or null | Google Drive link or null | https://drive.google.com/file/d/... |

### Player Fields

| Field | Type | Required | Format | Constraints | Example |
|-------|------|----------|--------|-------------|---------|
| playerId | string | Yes | ICCT26-XXXX-PXXX | team ID + sequential P# | ICCT26-0001-P001 |
| teamId | string | Yes | ICCT26-XXXX | same as team | ICCT26-0001 |
| teamName | string | Yes | text | - | Thunder Strikers |
| churchName | string | Yes | text | - | CSI St. Peter's Church |
| name | string | Yes | text | - | John Doe |
| age | number | Yes | integer | 16-70 years | 25 |
| phone | string | Yes | +91XXXXXXXXXX | 13 characters with +91 prefix | +919876543210 |
| email | string | Yes | email | valid email format | john@example.com |
| role | string | Yes | enum | Batsman/Bowler/All-rounder/Wicket Keeper | Batsman |
| jerseyNumber | string | Yes | number | 1-99 (numeric string) | "1" |
| aadharFile | string | Yes | URL or null | Google Drive link or null | https://drive.google.com/file/d/... |
| subscriptionFile | string | Yes | URL or null | Google Drive link or null | https://drive.google.com/file/d/... |

---

## 🔄 Alternative Endpoints (Fallback)

If the admin-specific endpoints aren't available yet, the frontend will try these generic endpoints:

### GET `/teams` - Alternative Teams List

**Response Format:** Same as `GET /admin/teams`

```bash
curl http://localhost:8000/teams
```

### GET `/players` - Alternative Players List

**Response Format:**
```json
{
  "success": true,
  "players": [
    {
      "playerId": "ICCT26-0001-P001",
      "teamId": "ICCT26-0001",
      "teamName": "Thunder Strikers",
      "churchName": "CSI St. Peter's Church",
      "name": "John Doe",
      "age": 25,
      "phone": "+919876543210",
      "email": "john@example.com",
      "role": "Captain",
      "jerseyNumber": "1",
      "aadharFile": "https://drive.google.com/file/d/...",
      "subscriptionFile": "https://drive.google.com/file/d/..."
    }
  ]
}
```

---

## 🛠️ Implementation Checklist

### Step 1: Setup Dependencies
- [ ] FastAPI is installed
- [ ] PostgreSQL database is configured
- [ ] SQLAlchemy or similar ORM is set up
- [ ] Database connection string is configured

### Step 2: Implement GET `/admin/teams`
- [ ] Query `teams` table from PostgreSQL
- [ ] Calculate `playerCount` from `players` table
- [ ] Format response according to spec
- [ ] Add error handling for database connection failures
- [ ] Test endpoint with `curl http://localhost:8000/admin/teams`

### Step 3: Implement GET `/admin/teams/{teamId}`
- [ ] Validate `teamId` format
- [ ] Query team from `teams` table
- [ ] Fetch all players for that team from `players` table
- [ ] Format complete response with player array
- [ ] Return 404 if team not found
- [ ] Test with `curl http://localhost:8000/admin/teams/ICCT26-0001`

### Step 4: Implement GET `/admin/players/{playerId}`
- [ ] Validate `playerId` format
- [ ] Query player from "Player Details" sheet
- [ ] Include team information
- [ ] Format response according to spec
- [ ] Return 404 if player not found
- [ ] Test with `curl http://localhost:8000/admin/players/ICCT26-0001-P001`

### Step 5: Testing
- [ ] Test all three endpoints with curl commands
- [ ] Verify response JSON format matches spec exactly
- [ ] Test with non-existent IDs (should return 404)
- [ ] Test error handling (database connection failures)
- [ ] Verify data loads in frontend admin panel

### Step 6: (Optional) Implement Fallback Endpoints
- [ ] Implement `GET /teams` (same as `/admin/teams`)
- [ ] Implement `GET /players` (returns all players list)

---

## 🔌 Frontend Integration

Once these endpoints are implemented:

1. **Admin Dashboard** will automatically populate with real team data
2. **Search/Filter** will work with actual team information
3. **Team Detail Page** will show real players and documents
4. **Player Detail Page** will display correct player information
5. **Statistics** will reflect actual registration data

### Frontend Expected Behavior:

**Admin Login:**
- Credentials: `admin` / `admin123`
- Route: `http://localhost:5174/admin/login`

**After Login:**
- Dashboard shows all teams from `/admin/teams`
- Click team card → navigates to team detail page
- Team detail loads from `/admin/teams/{teamId}`
- Click player → navigates to player detail page
- Player detail loads from `/admin/players/{playerId}`

---

## 🚀 Deployment Notes

### Development
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5174`
- PostgreSQL: Local database connection

### Production
- Backend: `https://icct26-backend.onrender.com` (or your Render.com URL)
- Frontend: Netlify deployment
- PostgreSQL: Hosted database (Render.com or similar)
- Update API base URL in `src/config/app.config.ts` if needed

---

## 📞 Support & Debugging

### Common Issues

**Issue: 404 Team Not Found**
- Check if `teamId` exists in "Team Info" sheet
- Verify ID format is `ICCT26-XXXX`

**Issue: Empty Players Array**
- Verify players exist in "Player Details" sheet
- Check if `teamId` in player row matches team's ID

**Issue: Missing Document URLs**
- Ensure document URLs are stored in the database
- Check file storage and URL generation logic

**Issue: Database Connection Error**
- Verify PostgreSQL connection string is valid
- Check database credentials and permissions
- Ensure database server is running and accessible

---

## 📚 Reference

### PostgreSQL Database Structure
- **Table: `teams`** - Contains all team and captain information
- **Table: `players`** - Contains all player information linked by team_id

### Response Format Philosophy
- All successful responses include `"success": true`
- All error responses include `"error"`, `"message"`, and `"detail"`
- URLs are complete, absolute paths (ready to open in browser)
- Phone numbers always include country code prefix
- Timestamps use ISO 8601 extended format

---

## ✅ Verification Checklist

Before marking implementation as complete:

- [ ] All three endpoints respond with 200 OK
- [ ] Response JSON exactly matches format in this guide
- [ ] All required fields are present
- [ ] Phone numbers have correct format
- [ ] Timestamps are in correct format
- [ ] Document URLs are valid and accessible
- [ ] 404 responses work correctly for missing IDs
- [ ] Error responses have proper structure
- [ ] Frontend admin panel displays real data
- [ ] Team/player search and filter work
- [ ] Document downloads work (where applicable)

---

**Last Updated:** November 7, 2025
**Status:** Ready for Backend Implementation
**Frontend Status:** ✅ Complete and waiting for backend endpoints
