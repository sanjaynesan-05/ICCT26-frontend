# 🏏 Admin Panel Backend Integration Guide

## Overview

The admin panel is now connected to fetch real data from the backend. This guide documents:
1. Required backend endpoints for admin functionality
2. Expected response formats
3. How to implement the endpoints
4. Error handling and fallback strategies

---

## 📡 Required Backend Endpoints

### Priority 1: Core Admin Endpoints (Required)

#### 1. Get All Teams
```
GET /admin/teams
```

**Purpose:** Fetch list of all registered teams

**Response Format:**
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
    }
  ]
}
```

**Alternative Success Response:**
```json
{
  "data": [
    { /* team object */ }
  ]
}
```

**Error Response:**
```json
{
  "error": "error_code",
  "message": "Error description",
  "detail": "Detailed error information"
}
```

---

#### 2. Get Team Details by ID
```
GET /admin/teams/{teamId}
```

**Path Parameters:**
- `teamId` (string): Team ID (e.g., "ICCT26-0001")

**Purpose:** Fetch complete team information including all players

**Response Format:**
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
    "pastorLetter": "https://drive.google.com/file/d/...",
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
        "aadharFile": "https://drive.google.com/file/d/...",
        "subscriptionFile": "https://drive.google.com/file/d/..."
      }
      // ... 10-14 more players
    ]
  }
}
```

---

#### 3. Get Player Details by ID
```
GET /admin/players/{playerId}
```

**Path Parameters:**
- `playerId` (string): Player ID (e.g., "ICCT26-0001-P001")

**Purpose:** Fetch individual player information with document URLs

**Response Format:**
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
    "aadharFile": "https://drive.google.com/file/d/...",
    "subscriptionFile": "https://drive.google.com/file/d/..."
  }
}
```

---

### Priority 2: Alternative Endpoints (Fallback)

These endpoints are used if the admin-specific endpoints are not available.

#### 4. Get All Teams (Alternative)
```
GET /teams
```

**Response:** Same format as `/admin/teams`

---

#### 5. Get All Players (Alternative)
```
GET /players
```

**Response Format:**
```json
{
  "success": true,
  "players": [
    {
      "playerId": "ICCT26-0001-P001",
      "teamId": "ICCT26-0001",
      "teamName": "Thunder Strikers",
      "name": "John Doe",
      "age": 25,
      "phone": "+919876543210",
      "email": "john@example.com",
      "role": "Captain",
      "jerseyNumber": "1",
      "aadharFile": "...",
      "subscriptionFile": "..."
    }
  ]
}
```

---

## 🔧 Implementation Strategy

### Current Flow (Frontend)

```
AdminDashboard (fetch teams)
    ↓
Try: GET /admin/teams
    ↓ (if fails)
Try: GET /teams
    ↓ (if fails)
Use: Dummy Data
```

```
TeamDetail (fetch team + players)
    ↓
Try: GET /admin/teams/{teamId}
    ↓ (if fails)
Try: GET /teams → filter by ID
    ↓ (if fails)
Use: Dummy Data
```

---

## 📋 Response Format Requirements

### Field Types & Constraints

| Field | Type | Required | Format | Example |
|-------|------|----------|--------|---------|
| teamId | string | Yes | ICCT26-XXXX | ICCT26-0001 |
| teamName | string | Yes | 3-50 chars | Thunder Strikers |
| churchName | string | Yes | - | CSI St. Peter's Church |
| captainName | string | Yes | - | John Doe |
| captainPhone | string | Yes | +91XXXXXXXXXX | +919876543210 |
| captainEmail | string | Yes | valid email | john@example.com |
| captainWhatsapp | string | No | 91XXXXXXXXXX | 919876543210 |
| viceCaptainName | string | Yes | - | Jane Smith |
| playerCount | number | Yes | 11-15 | 11 |
| registrationDate | string | Yes | YYYY-MM-DD HH:MM:SS | 2026-01-15 10:30:45 |
| paymentReceipt | string | Yes | - | TXN123456789 |
| pastorLetter | string/URL | No | valid URL or null | https://drive.google.com/file/d/... |
| players | array | Yes (in team detail) | Array of Player objects | - |
| playerId | string | Yes | ICCT26-XXXX-PXXX | ICCT26-0001-P001 |
| playerName | string | Yes | - | John Doe |
| age | number | Yes | 16-70 | 25 |
| phone | string | Yes | +91XXXXXXXXXX | +919876543210 |
| email | string | Yes | valid email | player@example.com |
| role | string | Yes | Batsman/Bowler/All-rounder/Wicket Keeper | Batsman |
| jerseyNumber | string | Yes | 1-99 | 1 |
| aadharFile | string/URL | Yes | valid URL or null | https://... |
| subscriptionFile | string/URL | Yes | valid URL or null | https://... |

---

## 🐛 Error Handling

### Error Response Format

```json
{
  "error": "resource_not_found",
  "message": "Team ICCT26-0001 not found",
  "detail": "The requested team does not exist in the database"
}
```

### Common Error Scenarios

| Scenario | Status Code | Error Code | Handling |
|----------|------------|-----------|----------|
| Team not found | 404 | `team_not_found` | Show "Team not found" message, fallback to dummy data |
| Player not found | 404 | `player_not_found` | Show "Player not found" message |
| Database error | 500 | `database_error` | Show "Connection failed" message, use dummy data |
| Invalid team ID | 400 | `invalid_team_id` | Show validation error |
| No teams registered | 200 | - | Show empty state with message |

---

## 🔄 Fallback Strategy

### When Backend Endpoints Don't Exist

The admin panel implements a graceful fallback strategy:

1. **Primary**: Try admin-specific endpoints (`/admin/teams`, `/admin/teams/{id}`)
2. **Secondary**: Try generic endpoints (`/teams`, `/players`)
3. **Tertiary**: Use dummy/demo data

This ensures the admin panel works even before backend endpoints are fully implemented.

---

## 📝 Implementation Checklist

### For Backend Developer

- [ ] **Endpoint 1**: `GET /admin/teams` - Return all teams
  - [ ] Query PostgreSQL `teams` table for all teams
  - [ ] Count players per team from `players` table
  - [ ] Return proper JSON format
  - [ ] Handle errors gracefully

- [ ] **Endpoint 2**: `GET /admin/teams/{teamId}` - Return team + players
  - [ ] Query team by ID
  - [ ] Query all players for that team
  - [ ] Include file URLs
  - [ ] Return proper JSON format

- [ ] **Endpoint 3**: `GET /admin/players/{playerId}` - Return player details
  - [ ] Query player by ID
  - [ ] Include team information
  - [ ] Include document URLs
  - [ ] Return proper JSON format

- [ ] **Endpoint 4** (Optional): `GET /teams` - Alternative teams endpoint
- [ ] **Endpoint 5** (Optional): `GET /players` - Alternative players endpoint

---

## 🧪 Testing the Integration

### 1. Test Teams Endpoint
```bash
curl http://localhost:8000/admin/teams
```

Expected Response:
```json
{
  "success": true,
  "teams": [
    { "teamId": "ICCT26-0001", ... }
  ]
}
```

### 2. Test Team Details Endpoint
```bash
curl http://localhost:8000/admin/teams/ICCT26-0001
```

Expected Response:
```json
{
  "success": true,
  "team": { ... }
}
```

### 3. Test Player Endpoint
```bash
curl http://localhost:8000/admin/players/ICCT26-0001-P001
```

### 4. Test Frontend Integration
1. Go to `http://localhost:5174/admin/login`
2. Login with `admin` / `admin123`
3. Check console for any errors
4. Verify teams load from backend
5. Click team to see players
6. Click player to see details

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────┐
│        Admin Frontend (React)                │
├─────────────────────────────────────────────┤
│                                             │
│  AdminDashboard                             │
│    ↓                                        │
│  apiService.getAllTeams()                   │
│    ↓                                        │
│  Try: GET /admin/teams                      │
│  Fallback: GET /teams                       │
│  Default: Dummy Data                        │
│    ↓                                        │
│  Display Teams List                         │
│    ↓                                        │
│  User clicks team                           │
│    ↓                                        │
│  TeamDetail                                 │
│    ↓                                        │
│  apiService.getTeamById(teamId)             │
│    ↓                                        │
│  Try: GET /admin/teams/{teamId}             │
│  Fallback: GET /teams → filter              │
│  Default: Dummy Data                        │
│    ↓                                        │
│  Display Team + Players                     │
│    ↓                                        │
│  User clicks player                         │
│    ↓                                        │
│  PlayerDetail                               │
│    ↓                                        │
│  Display Player Info + Documents            │
│                                             │
└─────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────┐
│    FastAPI Backend (Python)                 │
├─────────────────────────────────────────────┤
│                                             │
│  Router Endpoints                           │
│    ↓                                        │
│  /admin/teams                               │
│  /admin/teams/{teamId}                      │
│  /admin/players/{playerId}                  │
│    ↓                                        │
│  Query PostgreSQL Database                  │
│    ↓                                        │
│  Return JSON Response                       │
│                                             │
└─────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────┐
│    PostgreSQL Database                      │
├─────────────────────────────────────────────┤
│                                             │
│  Table: teams                               │
│  Table: players                             │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🚀 Next Steps

1. **Backend Development**:
   - Implement the required endpoints
   - Test with Postman/Thunder Client
   - Ensure proper error handling

2. **Frontend Testing**:
   - Test with real backend data
   - Verify search/filter functionality
   - Check document URL display

3. **Production Deployment**:
   - Enable authentication for admin endpoints
   - Rate limit admin endpoints
   - Add audit logging for admin access
   - Cache team data for performance

---

## 📞 Troubleshooting

### Issue: "Cannot reach backend" or empty teams list
**Solution**: 
1. Verify backend is running (`http://localhost:8000`)
2. Check browser console for errors
3. Verify endpoints return correct format
4. Check CORS configuration on backend

### Issue: Teams load but players don't show
**Solution**:
1. Verify `GET /admin/teams/{teamId}` includes players array
2. Check player objects have all required fields
3. Verify file URLs are valid

### Issue: File links not working
**Solution**:
1. Verify `aadharFile` and `subscriptionFile` are complete URLs
2. Check file permissions on Google Drive
3. Ensure service account has access to files

---

## 📚 Reference Links

- **Backend API Documentation**: `BACKEND_DOCUMENTATION.md`
- **Frontend API Service**: `src/services/api.ts`
- **Admin Components**: `src/pages/admin/`
- **Admin Context**: `src/contexts/AdminContext.tsx`

---

**Last Updated**: November 2025  
**Status**: Ready for Backend Integration
