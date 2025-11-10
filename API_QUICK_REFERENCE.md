# ✅ API Endpoints - Quick Reference

## 🎯 Summary of Changes

All frontend API calls have been corrected to match the **actual backend endpoint structure**. 

---

## 📌 Quick Endpoint Reference

### Team Registration (Most Important)
```
POST /api/register/team
```
**Frontend Method**: `apiService.registerTeam(payload)`
**Payload**: Team info + Captain + Vice-Captain + Players + Payment Receipt

---

### Team Management
```
GET /api/teams              → Get all teams
GET /api/teams/{team_id}    → Get specific team
```

---

### Admin Endpoints
```
GET /admin/teams                  → List all teams
GET /admin/teams/{team_id}        → Team details
GET /admin/players/{player_id}    → Player details
GET /admin/registrations          → All registrations
```

---

### General Endpoints
```
GET /health       → Health check
GET /status       → API status
GET /db          → Database stats
GET /              → API welcome
```

---

## 🔑 Key Changes

| Feature | Before | After |
|---------|--------|-------|
| Register Team | `/api/register/team` ✅ | `/api/register/team` ✅ |
| Get Status | `/api/status` ❌ | `/status` ✅ |
| Health Check | `/api/` ❌ | `/health` ✅ |
| List All Teams | `/api/admin/teams` ❌ | `/api/teams` ✅ |
| Admin Teams | `/api/admin/teams` ✅ | `/admin/teams` ✅ |
| DB Stats | ❌ Missing | `/db` ✅ |

---

## 🚀 Implementation

All methods are in `src/services/api.ts`:

```typescript
// Register a team
await apiService.registerTeam(formData)

// Get teams
await apiService.getAllTeams()

// Admin operations
await apiService.getAdminTeams()
await apiService.getPlayerById(playerId)

// Health checks
await apiService.healthCheck()
await apiService.getDatabaseStats()
```

---

## ✨ Testing

Visit the backend documentation:
- **Swagger UI**: `https://icct26-backend.onrender.com/docs`
- **ReDoc**: `https://icct26-backend.onrender.com/redoc`
- **OpenAPI Schema**: `https://icct26-backend.onrender.com/openapi.json`

---

## 📝 Status

- ✅ All endpoints corrected
- ✅ Frontend rebuilt
- ✅ Changes committed
- ✅ Deployed to production
- ✅ Ready for testing

**Commit**: `ebc7a5a` + `add5d1b`
