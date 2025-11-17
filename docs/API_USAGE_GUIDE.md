# ICCT26 API Usage Guide

## Overview

This guide provides comprehensive documentation for integrating with the ICCT26 Backend API. It covers all endpoints, request/response formats, error codes, and usage examples.

**Base URL**: `https://icct26-backend.onrender.com` (Production)  
**Base URL**: `http://localhost:8000` (Development)

---

## 🔐 Authentication

### Admin Authentication

**Endpoint**: `POST /api/admin/login`

**Request Body**:
```json
{
  "username": "admin",
  "password": "secure_password"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "admin"
  },
  "message": "Login successful"
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error_code": "INVALID_CREDENTIALS",
  "message": "Invalid username or password"
}
```

**Usage**:
```typescript
import { postWithRetry } from '../utils/apiClient'

async function login(username: string, password: string) {
  const response = await postWithRetry('/api/admin/login', { username, password })
  
  if (response.success) {
    localStorage.setItem('admin_token', response.data.token)
    return response.data
  } else {
    throw new Error(response.message)
  }
}
```

---

## 📝 Team Registration

### Register Team (Multipart)

**Endpoint**: `POST /api/teams/register`

**Method**: Multipart form-data (not JSON)

**Headers**:
```
Content-Type: multipart/form-data
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

**Form Fields**:

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `team_name` | string | ✅ | 3-100 chars |
| `captain_name` | string | ✅ | 2-100 chars |
| `captain_email` | string | ✅ | Valid email |
| `captain_phone` | string | ✅ | 10 digits |
| `player2_name` | string | ✅ | 2-100 chars |
| `player2_jersey` | string | ✅ | 1-99 |
| `player3_name` | string | ✅ | 2-100 chars |
| `player3_jersey` | string | ✅ | 1-99 |
| ... | ... | ... | ... |
| `player11_name` | string | ✅ | 2-100 chars |
| `player11_jersey` | string | ✅ | 1-99 |
| `payment_proof` | file | ✅ | Image/PDF, <5MB |
| `jersey_image` | file | ✅ | Image, <5MB |

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "team_id": "67890",
    "team_name": "Warriors XI",
    "registration_date": "2025-11-18T10:30:00Z",
    "payment_proof_url": "https://res.cloudinary.com/...",
    "jersey_image_url": "https://res.cloudinary.com/...",
    "captain": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    }
  },
  "message": "Team registered successfully"
}
```

**Response (Validation Error)**:
```json
{
  "success": false,
  "error_code": "VALIDATION_ERROR",
  "message": "Invalid phone number format",
  "details": {
    "field": "captain_phone",
    "value": "12345",
    "rule": "Must be 10 digits"
  }
}
```

**Response (Duplicate Idempotency Key)**:
```json
{
  "success": true,
  "data": { ... },  // Returns cached response
  "message": "Request already processed (idempotent)"
}
```

**Usage**:
```typescript
import { uploadMultipartWithRetry } from '../utils/apiClient'
import { generateIdempotencyKey, storeIdempotencyKey } from '../utils/idempotency'

async function registerTeam(teamData: TeamData, files: Files) {
  // 1. Generate idempotency key
  const idempotencyKey = generateIdempotencyKey()
  storeIdempotencyKey('team_registration', idempotencyKey)
  
  // 2. Build FormData
  const formData = new FormData()
  formData.append('team_name', teamData.teamName)
  formData.append('captain_name', teamData.captainName)
  formData.append('captain_email', teamData.captainEmail)
  formData.append('captain_phone', teamData.captainPhone)
  
  // Add players
  teamData.players.forEach((player, index) => {
    const num = index + 2  // Players 2-11
    formData.append(`player${num}_name`, player.name)
    formData.append(`player${num}_jersey`, player.jersey.toString())
  })
  
  // Add files
  formData.append('payment_proof', files.paymentProof)
  formData.append('jersey_image', files.jerseyImage)
  
  // 3. Upload with retry
  const response = await uploadMultipartWithRetry(
    '/api/teams/register',
    formData,
    {
      idempotencyKey,
      onProgress: (progress) => {
        console.log(`Upload: ${progress.percentage}%`)
      }
    }
  )
  
  if (response.success) {
    return response.data
  } else {
    throw new Error(response.message)
  }
}
```

---

## 👥 Team Management

### Get All Teams

**Endpoint**: `GET /api/teams`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 50 | Items per page |
| `search` | string | - | Search by team name |
| `status` | string | - | Filter by status |

**Response**:
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": "67890",
        "team_name": "Warriors XI",
        "captain_name": "John Doe",
        "captain_email": "john@example.com",
        "captain_phone": "9876543210",
        "registration_date": "2025-11-18T10:30:00Z",
        "payment_status": "pending",
        "payment_proof_url": "https://...",
        "jersey_image_url": "https://...",
        "player_count": 11
      }
    ],
    "total": 45,
    "page": 1,
    "limit": 50,
    "pages": 1
  }
}
```

**Usage**:
```typescript
import { getWithRetry } from '../utils/apiClient'

async function getTeams(page = 1, search = '') {
  const token = localStorage.getItem('admin_token')
  
  const response = await getWithRetry(
    `/api/teams?page=${page}&search=${encodeURIComponent(search)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  
  if (response.success) {
    return response.data
  } else {
    throw new Error(response.message)
  }
}
```

---

### Get Team by ID

**Endpoint**: `GET /api/teams/{team_id}`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "67890",
    "team_name": "Warriors XI",
    "captain": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "jersey_number": "1"
    },
    "players": [
      {
        "position": 2,
        "name": "Alice Smith",
        "jersey_number": "10"
      },
      // ... 9 more players
    ],
    "payment_proof_url": "https://...",
    "jersey_image_url": "https://...",
    "payment_status": "pending",
    "registration_date": "2025-11-18T10:30:00Z"
  }
}
```

**Usage**:
```typescript
async function getTeamDetails(teamId: string) {
  const token = localStorage.getItem('admin_token')
  
  const response = await getWithRetry(`/api/teams/${teamId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  
  return response.success ? response.data : null
}
```

---

### Update Team

**Endpoint**: `PUT /api/teams/{team_id}`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "payment_status": "approved",
  "notes": "Payment verified manually"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "67890",
    "payment_status": "approved",
    "updated_at": "2025-11-18T11:00:00Z"
  },
  "message": "Team updated successfully"
}
```

---

### Delete Team

**Endpoint**: `DELETE /api/teams/{team_id}`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "message": "Team deleted successfully"
}
```

---

## ❌ Error Codes Reference

### Client Errors (4xx)

| Code | HTTP | Description | Retryable |
|------|------|-------------|-----------|
| `VALIDATION_ERROR` | 400 | Invalid input data | ❌ |
| `DUPLICATE_TEAM_NAME` | 400 | Team name already exists | ❌ |
| `DUPLICATE_JERSEY` | 400 | Duplicate jersey numbers | ❌ |
| `INVALID_FILE_TYPE` | 400 | File type not allowed | ❌ |
| `FILE_TOO_LARGE` | 400 | File exceeds 5MB | ❌ |
| `UNAUTHORIZED` | 401 | Invalid or missing token | ❌ |
| `FORBIDDEN` | 403 | Insufficient permissions | ❌ |
| `NOT_FOUND` | 404 | Resource not found | ❌ |
| `DUPLICATE_IDEMPOTENCY_KEY` | 409 | Request already processed | ❌ |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | ✅ |

---

### Server Errors (5xx)

| Code | HTTP | Description | Retryable |
|------|------|-------------|-----------|
| `CLOUDINARY_UPLOAD_FAILED` | 500 | File upload failed | ✅ |
| `DATABASE_ERROR` | 500 | Database operation failed | ✅ |
| `EMAIL_SEND_FAILED` | 500 | Email notification failed | ✅ |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error | ✅ |
| `SERVICE_UNAVAILABLE` | 503 | Backend temporarily down | ✅ |

---

### Network Errors

| Code | Description | Retryable |
|------|-------------|-----------|
| `NETWORK_ERROR` | No response from server | ✅ |
| `TIMEOUT` | Request took >60 seconds | ✅ |
| `CANCELLED` | Request manually cancelled | ❌ |

---

## 🔄 Idempotency

### How It Works

1. **Client generates UUID v4** before submission
2. **Client stores key** in localStorage with 24h TTL
3. **Client sends key** in `Idempotency-Key` header
4. **Backend checks** if key exists in cache
5. **If duplicate**: Return cached response (HTTP 200 or 409)
6. **If new**: Process request and cache response for 24h

**Example**:
```typescript
// First request
const key = generateIdempotencyKey()  // "550e8400-..."
storeIdempotencyKey('team_registration', key)
const response1 = await register(formData, key)  // 201 Created

// Retry (same key)
const response2 = await register(formData, key)  // 200 OK (cached)
```

**Benefits**:
- Prevents duplicate registrations on network failures
- Safe to retry failed requests
- Consistent response on retries

---

## 📊 Rate Limiting

**Limits**:
- Registration: 5 requests per minute per IP
- Team listing: 100 requests per minute
- Team details: 100 requests per minute

**Response on Limit Exceeded**:
```json
{
  "success": false,
  "error_code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please try again in 60 seconds.",
  "details": {
    "retry_after": 60,
    "limit": 5,
    "window": "1 minute"
  }
}
```

**Handling**:
```typescript
if (response.error_code === 'RATE_LIMIT_EXCEEDED') {
  const retryAfter = response.details.retry_after
  console.log(`Rate limited. Retry after ${retryAfter}s`)
  await sleep(retryAfter * 1000)
  return await register(formData, key)  // Retry
}
```

---

## 🔍 Testing the API

### Using cURL

```bash
# Register team
curl -X POST https://icct26-backend.onrender.com/api/teams/register \
  -H "Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000" \
  -F "team_name=Warriors XI" \
  -F "captain_name=John Doe" \
  -F "captain_email=john@example.com" \
  -F "captain_phone=9876543210" \
  -F "player2_name=Alice" \
  -F "player2_jersey=10" \
  -F "payment_proof=@payment.jpg" \
  -F "jersey_image=@jersey.png"

# Get teams
curl -X GET https://icct26-backend.onrender.com/api/teams \
  -H "Authorization: Bearer <token>"

# Get team details
curl -X GET https://icct26-backend.onrender.com/api/teams/67890 \
  -H "Authorization: Bearer <token>"
```

---

### Using Postman

1. **Set Base URL**: `https://icct26-backend.onrender.com`
2. **Set Authorization**: Bearer Token (for protected routes)
3. **Set Body Type**: `form-data` (for registration)
4. **Add Idempotency-Key**: Custom header
5. **Send Request**

---

## 🚀 Best Practices

### 1. Always Use Idempotency Keys

```typescript
// ✅ Good
const key = generateIdempotencyKey()
storeIdempotencyKey('team_registration', key)
await register(formData, key)

// ❌ Bad
await register(formData, Math.random().toString())  // New key on retry
```

---

### 2. Handle All Error Codes

```typescript
if (!response.success) {
  switch (response.error_code) {
    case 'VALIDATION_ERROR':
      showFieldError(response.details.field, response.message)
      break
    case 'DUPLICATE_TEAM_NAME':
      showError('Team name already taken. Please choose another.')
      break
    case 'CLOUDINARY_UPLOAD_FAILED':
      showError('File upload failed. Retrying...')
      // Auto-retry handled by apiClient
      break
    default:
      showError(response.message)
  }
}
```

---

### 3. Track Upload Progress

```typescript
await uploadMultipartWithRetry('/api/teams/register', formData, {
  idempotencyKey: key,
  onProgress: ({ percentage, loaded, total }) => {
    setProgress(percentage)
    console.log(`${loaded} / ${total} bytes (${percentage}%)`)
  }
})
```

---

### 4. Use AbortController for Long Requests

```typescript
const { signal, cancel } = createAbortController(30000)  // 30s timeout

setTimeout(() => {
  cancel()  // Cancel after 30s
}, 30000)

try {
  const response = await getWithRetry('/api/teams', { signal })
} catch (error) {
  if (axios.isCancel(error)) {
    console.log('Request cancelled')
  }
}
```

---

## 📝 Summary

The ICCT26 API provides:

- ✅ **RESTful endpoints** for team registration and management
- ✅ **Multipart uploads** for files with progress tracking
- ✅ **Idempotency protection** against duplicate submissions
- ✅ **Comprehensive error codes** for all failure scenarios
- ✅ **Rate limiting** to prevent abuse
- ✅ **Automatic retries** for transient failures
- ✅ **Production-ready** with timeout and abort support

**Next Steps**: See `ERROR_HANDLING_GUIDE.md` for detailed error handling patterns.

---

**Version**: 2.0.0  
**Last Updated**: November 18, 2025
