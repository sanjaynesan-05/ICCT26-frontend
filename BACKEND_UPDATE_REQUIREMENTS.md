# Backend Update Requirements - Cricket Match Result System

## Overview
Complete backend implementation guide for ICCT26 cricket tournament schedule management with match result tracking, validation, and database integration.

---

## Current Frontend Implementation
The frontend has been fully built with:
- ✅ Admin Schedule Manager (create, edit, delete matches)
- ✅ Public Schedule Display (tabbed view - Ongoing/Upcoming/Done)
- ✅ Enhanced Result Modal (cricket-specific terminology)
- ✅ Real-time status updates
- ✅ Export functionality

---

## Database Schema

### Create Tables

```sql
-- Teams Table (if not already exists)
CREATE TABLE teams (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  city VARCHAR(50),
  logo_url VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Matches Table (NEW - for schedule management)
CREATE TABLE matches (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  round VARCHAR(50) NOT NULL,
  round_number INTEGER NOT NULL,
  match_number INTEGER NOT NULL,
  team1_id INTEGER NOT NULL,
  team2_id INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'live', 'completed'
  
  -- Result fields (NULL until match is completed)
  winner_id INTEGER,
  margin INTEGER,
  margin_type VARCHAR(20), -- 'runs' or 'wickets'
  won_by_batting_first BOOLEAN,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (team1_id) REFERENCES teams(id),
  FOREIGN KEY (team2_id) REFERENCES teams(id),
  FOREIGN KEY (winner_id) REFERENCES teams(id),
  
  UNIQUE KEY unique_match (round_number, match_number),
  INDEX idx_status (status),
  INDEX idx_round (round_number)
);

-- Create indexes for faster queries
CREATE INDEX idx_teams_name ON teams(name);
CREATE INDEX idx_matches_team1 ON matches(team1_id);
CREATE INDEX idx_matches_team2 ON matches(team2_id);
```

---

## API Endpoints

### 1. GET `/api/schedule/matches` - Fetch All Matches
**Purpose**: Get all matches for public schedule display

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "round": "Round 1",
      "roundNumber": 1,
      "matchNumber": 1,
      "team1": "Mumbai Kings",
      "team2": "Delhi Warriors",
      "status": "completed",
      "result": {
        "winner": "Mumbai Kings",
        "margin": 45,
        "marginType": "runs",
        "wonByBattingFirst": true
      }
    },
    {
      "id": 2,
      "round": "Round 1",
      "roundNumber": 1,
      "matchNumber": 2,
      "team1": "Chennai Super Kings",
      "team2": "Bangalore United",
      "status": "scheduled",
      "result": null
    }
  ]
}
```

**Notes**:
- Return team names (not IDs) for frontend display
- Include result object only if status is 'completed'
- Order by roundNumber, then matchNumber

---

### 2. POST `/api/schedule/matches` - Create Match
**Purpose**: Admin creates a new match

**Request Body**:
```json
{
  "round": "Round 1",
  "roundNumber": 1,
  "matchNumber": 1,
  "team1": "Mumbai Kings",
  "team2": "Delhi Warriors"
}
```

**Validation**:
- Both team1 and team2 must exist in teams table
- roundNumber must be positive integer
- matchNumber must be positive integer
- Cannot create duplicate match (same roundNumber + matchNumber)

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Match created successfully",
  "data": {
    "id": 1,
    "round": "Round 1",
    "roundNumber": 1,
    "matchNumber": 1,
    "team1": "Mumbai Kings",
    "team2": "Delhi Warriors",
    "status": "scheduled",
    "result": null
  }
}
```

**Error Response (400)**:
```json
{
  "success": false,
  "error": "Team 'Invalid Team' not found"
}
```

---

### 3. PUT `/api/schedule/matches/{matchId}` - Update Match
**Purpose**: Admin edits match details (team, round, etc.)

**Request Body**:
```json
{
  "round": "Round 1",
  "roundNumber": 1,
  "matchNumber": 1,
  "team1": "Mumbai Kings",
  "team2": "Delhi Warriors"
}
```

**Validation**:
- Teams must exist in database
- Cannot change if match is already completed (optional - send 409 error)
- New match number must be unique within round

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Match updated successfully",
  "data": {
    "id": 1,
    "round": "Round 1",
    "roundNumber": 1,
    "matchNumber": 1,
    "team1": "Mumbai Kings",
    "team2": "Delhi Warriors",
    "status": "scheduled",
    "result": null
  }
}
```

---

### 4. DELETE `/api/schedule/matches/{matchId}` - Delete Match
**Purpose**: Admin deletes a match

**Validation**:
- Can only delete if status is 'scheduled'
- Send 409 error if match is live or completed

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Match deleted successfully"
}
```

**Error Response (409)**:
```json
{
  "success": false,
  "error": "Cannot delete a match that is live or completed"
}
```

---

### 5. PUT `/api/schedule/matches/{matchId}/status` - Update Status
**Purpose**: Change match status (scheduled → live → completed)

**Request Body**:
```json
{
  "status": "live"
}
```

**Valid Status Transitions**:
- scheduled → live
- live → completed
- scheduled → completed (optional, for offline matches)

**Validation**:
- Status must be one of: 'scheduled', 'live', 'completed'
- Cannot downgrade status (live cannot go back to scheduled)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Match status updated",
  "data": {
    "id": 1,
    "round": "Round 1",
    "roundNumber": 1,
    "matchNumber": 1,
    "team1": "Mumbai Kings",
    "team2": "Delhi Warriors",
    "status": "live",
    "result": null
  }
}
```

**Important**: Do NOT clear result when status changes. Keep result data intact.

---

### 6. POST `/api/schedule/matches/{matchId}/result` - Set Match Result ⭐ MOST IMPORTANT

**Purpose**: Admin sets the final result (winner, margin, etc.)

**Request Body**:
```json
{
  "winner": "Mumbai Kings",
  "margin": 45,
  "marginType": "runs",
  "wonByBattingFirst": true
}
```

**Field Descriptions**:
- **winner** (string): Exact team name (must be team1 or team2)
- **margin** (number): Numeric margin value
  - If marginType="runs": runs difference (opposition fell short)
  - If marginType="wickets": wickets remaining when chasing
- **marginType** (string): Either "runs" or "wickets"
- **wonByBattingFirst** (boolean): 
  - true = Team batted first, opposition fell short
  - false = Team chased and completed target

**Server-Side Validation**:
```
1. Check match exists (404 if not)
2. Validate winner is in [team1, team2] → 400 error
3. Validate margin > 0 → 400 error
4. Validate marginType in ['runs', 'wickets'] → 400 error
5. If marginType='runs': margin <= 999 → 400 error
6. If marginType='wickets': margin <= 10 → 400 error
7. Validate wonByBattingFirst is boolean → 400 error
```

**Error Messages**:
- "Match not found"
- "Invalid winner. Winner must be one of the teams in this match."
- "Margin must be greater than 0"
- "Runs margin cannot exceed 999"
- "Wickets margin cannot exceed 10"
- "Invalid margin type. Must be 'runs' or 'wickets'"

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Match result saved successfully",
  "data": {
    "id": 1,
    "round": "Round 1",
    "roundNumber": 1,
    "matchNumber": 1,
    "team1": "Mumbai Kings",
    "team2": "Delhi Warriors",
    "status": "completed",
    "result": {
      "winner": "Mumbai Kings",
      "margin": 45,
      "marginType": "runs",
      "wonByBattingFirst": true
    }
  }
}
```

**Auto-Action**: When result is saved, automatically set match.status = 'completed'

**Error Response (400)**:
```json
{
  "success": false,
  "error": "Margin must be greater than 0"
}
```

---

### 7. POST `/api/schedule/export` - Export Schedule
**Purpose**: Export all matches as JSON file

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "round": "Round 1",
      "roundNumber": 1,
      "matchNumber": 1,
      "team1": "Mumbai Kings",
      "team2": "Delhi Warriors",
      "status": "completed",
      "result": {
        "winner": "Mumbai Kings",
        "margin": 45,
        "marginType": "runs",
        "wonByBattingFirst": true
      }
    }
  ]
}
```

---

## Implementation Checklist

### Database Setup
- [ ] Create `teams` table
- [ ] Create `matches` table
- [ ] Add all indexes
- [ ] Seed teams data from registration system

### API Implementation
- [ ] GET `/api/schedule/matches` - Fetch all matches
- [ ] POST `/api/schedule/matches` - Create match
- [ ] PUT `/api/schedule/matches/{id}` - Update match
- [ ] DELETE `/api/schedule/matches/{id}` - Delete match
- [ ] PUT `/api/schedule/matches/{id}/status` - Update status
- [ ] POST `/api/schedule/matches/{id}/result` - Set result (CRITICAL)
- [ ] POST `/api/schedule/export` - Export schedule

### Validation & Error Handling
- [ ] Input validation on all endpoints
- [ ] Proper HTTP status codes (200, 201, 400, 404, 409, 500)
- [ ] Error messages with helpful details
- [ ] Foreign key constraints enforced
- [ ] Duplicate match prevention

### Response Format
- [ ] All responses have `success` boolean
- [ ] All responses have `data` object or `error` message
- [ ] Team names returned (not IDs)
- [ ] Result object included only when match is completed
- [ ] Timestamp fields on updates

---

## Cricket Rules Context

### Result Types Explained

**Example 1: Batting First Win**
- Mumbai batted first, scored 150 runs
- Delhi chased but only scored 105 runs
- Mumbai wins by 45 runs (ran out of opposition runs)
- Request: `{winner: "Mumbai Kings", margin: 45, marginType: "runs", wonByBattingFirst: true}`

**Example 2: Chasing Win**
- Mumbai batted first, scored 150 runs
- Delhi chased and scored 152 with 7 wickets down (3 wickets remaining)
- Delhi wins by 3 wickets (had 3 wickets left to spare)
- Request: `{winner: "Delhi Warriors", margin: 3, marginType: "wickets", wonByBattingFirst: false}`

---

## Data Flow Diagram

```
Frontend Admin Dashboard
         ↓
Create Match: POST /api/schedule/matches
         ↓
Database Insert: matches table
         ↓
Return Match Object to Frontend
         ↓
Frontend displays in admin list
         ↓
Admin clicks "Set Result"
         ↓
Result Modal with validation
         ↓
POST /api/schedule/matches/{id}/result
         ↓
Backend validates ALL fields
         ↓
If valid: UPDATE matches SET status='completed', result={...}
         ↓
Return updated match
         ↓
Frontend refreshes list
         ↓
Public Schedule fetches GET /api/schedule/matches
         ↓
Shows result with proper formatting
```

---

## Testing Checklist

### Unit Tests
- [ ] Match creation with valid data
- [ ] Match creation with invalid team names
- [ ] Duplicate match prevention
- [ ] Result validation (margin ranges)
- [ ] Winner validation (must be team1 or team2)

### Integration Tests
- [ ] Create match → Fetch → Update → Set result → Fetch
- [ ] Status transitions (scheduled → live → completed)
- [ ] Result persistence across fetches
- [ ] Error handling for all edge cases

### Cricket Logic Tests
- [ ] Batting first win with runs
- [ ] Chasing win with wickets
- [ ] Invalid margin values
- [ ] Wickets > 10 rejected
- [ ] Runs > 999 rejected

---

## Security Notes

- Validate all input on server side (never trust frontend)
- Use parameterized queries to prevent SQL injection
- Verify admin authentication before allowing create/update/delete
- Log all result updates for audit trail
- Prevent result tampering by validating against match data

---

## Performance Optimization

- Index on `status` field for filtering
- Index on `round_number` for sorting
- Index on `team1_id`, `team2_id` for lookups
- Consider pagination for large match lists (future)
- Cache teams list if it's static

---

## Deployment Notes

1. Run database migrations to create tables
2. Seed teams data from existing registration database
3. Deploy API endpoints
4. Test all endpoints with Postman/Insomnia
5. Verify frontend can connect and fetch data
6. Monitor error logs for validation issues

---

## Future Enhancements

- [ ] Match commentary/updates during live play
- [ ] Man of the match selection
- [ ] Player of the tournament stats
- [ ] Detailed scorecard per match
- [ ] Team statistics (wins, losses, avg margin)
- [ ] Leaderboard generation
- [ ] Email notifications for match updates
