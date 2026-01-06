# 🔧 ICCT26 API Documentation

## API Overview

The ICCT26 backend provides a RESTful API for managing tournament data, team registrations, and match information.

**Base URL**: `https://icct26-backend.onrender.com`

**Technology**: FastAPI (Python)

**Database**: PostgreSQL

**Authentication**: Session-based (admin routes)

---

## API Configuration

**File**: [`src/config/app.config.ts`](../src/config/app.config.ts)

```typescript
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'https://icct26-backend.onrender.com',
  timeout: 30000, // 30 seconds
  retries: 3,
}
```

**Environment Variable**:
```bash
VITE_API_URL=https://icct26-backend.onrender.com
```

---

## Public Endpoints

### 1. Health Check

**GET** `/`

Get API status and basic information.

**Response**:
```json
{
  "message": "ICCT26 API is running",
  "version": "1.0.0",
  "status": "healthy"
}
```

---

### 2. Get All Matches

**GET** `/matches`

Retrieve all tournament matches.

**Query Parameters**:
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `round` | string | Filter by round (Group, Quarter, Semi, Final) | No |
| `status` | string | Filter by status (scheduled, live, completed) | No |
| `date` | string | Filter by date (YYYY-MM-DD) | No |

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "round": "Group A",
      "round_number": 1,
      "match_number": 1,
      "team1": "Thunder Strikers",
      "team2": "Lightning Warriors",
      "status": "scheduled",
      "scheduled_start_time": "2026-01-24T09:00:00",
      "actual_start_time": null,
      "match_end_time": null,
      "toss_winner": null,
      "toss_choice": null,
      "first_innings_team": null,
      "team1_first_innings_score": null,
      "team2_first_innings_score": null,
      "match_score_url": null,
      "result": null,
      "created_at": "2026-01-01T10:00:00",
      "updated_at": "2026-01-01T10:00:00"
    }
  ]
}
```

**Match Object**:
```typescript
interface Match {
  id: number
  round: string
  round_number: number
  match_number: number
  team1: string
  team2: string
  status: 'scheduled' | 'live' | 'completed'
  scheduled_start_time: string | null
  actual_start_time: string | null
  match_end_time: string | null
  toss_winner: string | null
  toss_choice: 'bat' | 'bowl' | null
  first_innings_team: string | null
  team1_first_innings_score: number | null
  team2_first_innings_score: number | null
  match_score_url: string | null
  result: MatchResult | null
  created_at: string
  updated_at: string
}

interface MatchResult {
  winner: string
  margin: number
  marginType: 'runs' | 'wickets'
  wonByBattingFirst: boolean
}
```

---

### 3. Get Match by ID

**GET** `/matches/:id`

Retrieve details of a specific match.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Match ID |

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "round": "Group A",
    "team1": "Thunder Strikers",
    "team2": "Lightning Warriors",
    "status": "completed",
    "team1_first_innings_score": 145,
    "team2_first_innings_score": 120,
    "result": {
      "winner": "Thunder Strikers",
      "margin": 25,
      "marginType": "runs",
      "wonByBattingFirst": true
    }
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "error": "Match not found",
  "detail": "No match with ID 999"
}
```

---

### 4. Team Registration

**POST** `/register`

Register a new team for the tournament.

**Content-Type**: `multipart/form-data`

**Headers**:
```
Content-Type: multipart/form-data
X-Idempotency-Key: <UUID>
```

**Request Body (FormData)**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `team_name` | string | Yes | Team name (unique) |
| `church_name` | string | Yes | Church name |
| `captain.name` | string | Yes | Captain full name |
| `captain.phone` | string | Yes | Captain phone (10 digits) |
| `captain.email` | string | Yes | Captain email |
| `captain.whatsapp` | string | Yes | Captain WhatsApp |
| `viceCaptain.name` | string | Yes | Vice captain name |
| `viceCaptain.phone` | string | Yes | Vice captain phone |
| `viceCaptain.email` | string | Yes | Vice captain email |
| `viceCaptain.whatsapp` | string | Yes | Vice captain WhatsApp |
| `payment_receipt` | file | Yes | Payment receipt (PDF/Image, max 5MB) |
| `pastor_letter` | file | Yes | Pastor letter (PDF, max 5MB) |
| `groupPhoto` | file | Yes | Team photo (Image, max 5MB) |
| `players[0].name` | string | Yes | Player 1 name |
| `players[0].role` | string | Yes | Player 1 role |
| `players[0].aadhar_file` | file | Yes | Player 1 Aadhar (PDF/Image) |
| `players[0].subscription_file` | file | Yes | Player 1 subscription (PDF/Image) |
| ... | ... | ... | Repeat for players 1-15 |

**Validation Rules**:
- Team name: 2-100 characters, unique
- Church: Must be from predefined list, max 2 teams per church
- Names: 2-50 characters, letters and spaces only
- Email: Valid email format
- Phone: Exactly 10 digits
- Players: Minimum 11, maximum 15
- Files: Max 5MB each, proper MIME types

**Success Response (201)**:
```json
{
  "success": true,
  "data": {
    "team_id": "550e8400-e29b-41d4-a716-446655440000",
    "team_name": "Thunder Strikers",
    "email_sent": true,
    "message": "Team registered successfully"
  }
}
```

**Error Response (400)**:
```json
{
  "success": false,
  "error": "Validation error",
  "detail": {
    "field": "captain.email",
    "message": "Invalid email format"
  }
}
```

**Error Response (409)**:
```json
{
  "success": false,
  "error": "Duplicate registration",
  "detail": "Team name already exists"
}
```

**Idempotency**:
- Uses `X-Idempotency-Key` header
- Prevents duplicate submissions
- Returns original response for duplicate keys

---

### 5. Church Availability

**GET** `/church-availability`

Get registration capacity for each church.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "church_name": "CSI St Peters Church Rathinapuri",
      "registered_teams": 2,
      "max_teams": 2,
      "is_full": true,
      "is_locked": true
    },
    {
      "church_name": "CSI Immanuel Church Coimbatore",
      "registered_teams": 1,
      "max_teams": 2,
      "is_full": false,
      "is_locked": false
    }
  ]
}
```

---

## Admin Endpoints

### Authentication Required

All admin endpoints require authentication. Include session token from login.

---

### 6. Admin Login

**POST** `/admin/login`

Authenticate admin user.

**Request Body**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "username": "admin",
      "role": "admin"
    }
  }
}
```

**Error Response (401)**:
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### 7. Get All Teams

**GET** `/admin/teams`

Retrieve all registered teams (admin only).

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by team/church name |
| `status` | string | Filter by status |

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "team_name": "Thunder Strikers",
      "church_name": "CSI St Peters Church",
      "captain_name": "John Doe",
      "captain_email": "john@example.com",
      "captain_phone": "9876543210",
      "vice_captain_name": "Jane Smith",
      "player_count": 12,
      "payment_receipt_url": "https://...",
      "pastor_letter_url": "https://...",
      "group_photo_url": "https://...",
      "status": "approved",
      "registration_date": "2026-01-05T10:30:00"
    }
  ],
  "total": 16
}
```

---

### 8. Get Team Details

**GET** `/admin/teams/:id`

Get detailed information about a specific team.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Team ID |

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "team_name": "Thunder Strikers",
    "church_name": "CSI St Peters Church",
    "captain": {
      "name": "John Doe",
      "phone": "9876543210",
      "whatsapp": "9876543210",
      "email": "john@example.com"
    },
    "viceCaptain": {
      "name": "Jane Smith",
      "phone": "9876543211",
      "whatsapp": "9876543211",
      "email": "jane@example.com"
    },
    "players": [
      {
        "id": "uuid-1",
        "name": "Player One",
        "role": "Batsman",
        "aadhar_file_url": "https://...",
        "subscription_file_url": "https://..."
      }
    ],
    "documents": {
      "payment_receipt": "https://...",
      "pastor_letter": "https://...",
      "group_photo": "https://..."
    },
    "status": "approved",
    "registration_date": "2026-01-05T10:30:00"
  }
}
```

---

### 9. Update Match

**PUT** `/admin/matches/:id`

Update match details and scores.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Match ID |

**Request Body**:
```json
{
  "status": "completed",
  "toss_winner": "Thunder Strikers",
  "toss_choice": "bat",
  "first_innings_team": "Thunder Strikers",
  "actual_start_time": "2026-01-24T09:15:00",
  "match_end_time": "2026-01-24T13:30:00",
  "team1_first_innings_score": 145,
  "team2_first_innings_score": 120,
  "match_score_url": "https://example.com/scorecard",
  "result": {
    "winner": "Thunder Strikers",
    "margin": 25,
    "marginType": "runs",
    "wonByBattingFirst": true
  }
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "completed",
    "result": {
      "winner": "Thunder Strikers",
      "margin": 25,
      "marginType": "runs"
    }
  },
  "message": "Match updated successfully"
}
```

---

### 10. Get Player Details

**GET** `/admin/players/:id`

Get detailed player information.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Player ID |

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "name": "Player One",
    "role": "Batsman",
    "team_id": "team-uuid",
    "team_name": "Thunder Strikers",
    "aadhar_file_url": "https://...",
    "subscription_file_url": "https://...",
    "verification_status": "verified"
  }
}
```

---

## API Client Implementation

**File**: [`src/utils/apiClient.ts`](../src/utils/apiClient.ts)

### Features

1. **Retry Logic**
   - Automatic retry on network errors
   - Exponential backoff (1s, 2s, 4s)
   - Maximum 3 attempts

2. **Progress Tracking**
   - Upload progress callbacks
   - Real-time percentage updates

3. **Error Handling**
   - Network errors
   - Validation errors
   - Server errors
   - CORS errors

4. **Idempotency**
   - UUID-based keys
   - Duplicate prevention
   - Request tracking

### Usage Example

```typescript
import { uploadMultipartWithRetry } from '@/utils/apiClient'

// Upload with retry and progress
const response = await uploadMultipartWithRetry({
  endpoint: '/register',
  formData: registrationData,
  idempotencyKey: 'unique-uuid-key',
  onProgress: (percent) => {
    console.log(`Upload: ${percent}%`)
  },
  maxRetries: 3
})

if (response.success) {
  console.log('Team ID:', response.data.team_id)
}
```

---

## API Service Layer

**File**: [`src/services/api.ts`](../src/services/api.ts)

Centralized API methods for all backend communication.

### Methods

```typescript
class ApiService {
  // Public methods
  getMatches(filters?: MatchFilters): Promise<Match[]>
  getMatchById(id: number): Promise<Match>
  registerTeam(data: TeamRegistrationPayload): Promise<RegistrationResponse>
  getChurchAvailability(): Promise<ChurchAvailability[]>
  
  // Admin methods
  login(username: string, password: string): Promise<LoginResponse>
  getAllTeams(filters?: TeamFilters): Promise<Team[]>
  getTeamById(id: string): Promise<Team>
  updateMatch(id: number, data: MatchUpdate): Promise<Match>
  getPlayerById(id: string): Promise<Player>
}

export default new ApiService()
```

### Usage

```typescript
import api from '@/services/api'

// Get all matches
const matches = await api.getMatches()

// Register team
const result = await api.registerTeam(formData)

// Admin: Update match
const updated = await api.updateMatch(1, scoreData)
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error type",
  "detail": "Detailed error message",
  "field": "field_name" // For validation errors
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET/PUT |
| 201 | Created | Successful POST (registration) |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry |
| 422 | Unprocessable Entity | Invalid data format |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Server down/maintenance |

### Client-Side Error Handling

```typescript
try {
  const result = await api.registerTeam(data)
  // Handle success
} catch (error) {
  if (error.status === 400) {
    // Validation error - show field errors
  } else if (error.status === 409) {
    // Duplicate - show conflict message
  } else if (error.status >= 500) {
    // Server error - retry or contact support
  } else {
    // Network error - check connection
  }
}
```

---

## Rate Limiting

**Current**: No rate limiting implemented

**Future**: 
- 100 requests per minute per IP
- 10 registrations per hour per IP
- Admin endpoints: 200 requests per minute

---

## CORS Configuration

**Allowed Origins**:
- `https://icct26.netlify.app` (Production)
- `http://localhost:5174` (Development)

**Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers**: Content-Type, X-Idempotency-Key, Authorization

---

## API Versioning

**Current Version**: v1 (default)

**Future**: Versioned endpoints `/api/v2/...`

---

*Complete API reference for ICCT26 application*
