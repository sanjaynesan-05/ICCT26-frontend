# 📚 ICCT26 Data Structures & Types

## TypeScript Type System

The ICCT26 application uses TypeScript for comprehensive type safety across all data structures.

**Main Types File**: [`src/types/index.ts`](../src/types/index.ts)

---

## Core Data Types

### 1. Match Interface

Represents a cricket match in the tournament.

```typescript
interface Match {
  // Identification
  id: number
  round: string                    // e.g., "Group A", "Quarter Final 1"
  round_number: number              // 1-4 (Group, Quarter, Semi, Final)
  match_number: number              // Unique match number
  
  // Teams
  team1: string                     // First team name
  team2: string                     // Second team name
  
  // Status & Timing
  status: 'scheduled' | 'live' | 'completed'
  scheduled_start_time: string | null    // ISO 8601 datetime
  actual_start_time: string | null       // ISO 8601 datetime
  match_end_time: string | null          // ISO 8601 datetime
  
  // Toss Information
  toss_winner: string | null             // Team name
  toss_choice: 'bat' | 'bowl' | null
  
  // Scoring
  first_innings_team: string | null
  team1_first_innings_score: number | null   // Total runs
  team2_first_innings_score: number | null   // Total runs
  match_score_url: string | null             // External scorecard link
  
  // Result
  result: MatchResult | null
  
  // Metadata
  created_at: string                     // ISO 8601 datetime
  updated_at: string                     // ISO 8601 datetime
}
```

**Example**:
```json
{
  "id": 1,
  "round": "Group A - Match 1",
  "round_number": 1,
  "match_number": 1,
  "team1": "Thunder Strikers",
  "team2": "Lightning Warriors",
  "status": "completed",
  "scheduled_start_time": "2026-01-24T09:00:00",
  "actual_start_time": "2026-01-24T09:15:00",
  "match_end_time": "2026-01-24T13:30:00",
  "toss_winner": "Thunder Strikers",
  "toss_choice": "bat",
  "first_innings_team": "Thunder Strikers",
  "team1_first_innings_score": 145,
  "team2_first_innings_score": 120,
  "match_score_url": "https://example.com/scorecard/1",
  "result": {
    "winner": "Thunder Strikers",
    "margin": 25,
    "marginType": "runs",
    "wonByBattingFirst": true
  },
  "created_at": "2026-01-01T10:00:00",
  "updated_at": "2026-01-24T13:35:00"
}
```

---

### 2. MatchResult Interface

Details about match outcome.

```typescript
interface MatchResult {
  winner: string                     // Winning team name
  margin: number                     // Victory margin (runs or wickets)
  marginType: 'runs' | 'wickets'    // Type of victory
  wonByBattingFirst: boolean        // True if winner batted first
}
```

**Examples**:
```typescript
// Won by runs (batted first)
{
  "winner": "Thunder Strikers",
  "margin": 25,
  "marginType": "runs",
  "wonByBattingFirst": true
}

// Won by wickets (chased successfully)
{
  "winner": "Lightning Warriors",
  "margin": 6,
  "marginType": "wickets",
  "wonByBattingFirst": false
}
```

---

### 3. Team Interface

Registered team information.

```typescript
interface Team {
  // Identification
  id: string                        // UUID
  team_name: string                 // Unique team name
  church_name: string               // Church affiliation
  
  // Captain Details
  captain_name: string
  captain_phone: string             // 10 digits
  captain_whatsapp: string
  captain_email: string
  
  // Vice Captain Details
  vice_captain_name: string
  vice_captain_phone: string
  vice_captain_whatsapp: string
  vice_captain_email: string
  
  // Documents
  payment_receipt_url: string       // Cloudinary URL
  pastor_letter_url: string         // Cloudinary URL
  group_photo_url: string           // Cloudinary URL
  
  // Players
  players: Player[]                 // Array of 11-15 players
  player_count: number              // Calculated field
  
  // Status
  status: 'pending' | 'approved' | 'rejected'
  verification_notes: string | null
  
  // Metadata
  registration_date: string         // ISO 8601 datetime
  created_at: string
  updated_at: string
}
```

---

### 4. Player Interface

Individual player information.

```typescript
interface Player {
  // Identification
  playerId: string                  // UUID
  team_id: string                   // Foreign key to Team
  
  // Basic Info
  name: string                      // Player full name
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket Keeper'
  
  // Documents
  aadharFile: string | null         // Cloudinary URL or File object
  subscriptionFile: string | null   // Cloudinary URL or File object
  
  // Verification
  verification_status: 'pending' | 'verified' | 'rejected'
}
```

**Role Types**:
- `Batsman` - Specialist batsman
- `Bowler` - Specialist bowler
- `All-rounder` - Both batting and bowling
- `Wicket Keeper` - Designated wicket keeper

---

### 5. Rule Interface

Tournament rule definition.

```typescript
interface Rule {
  id: number                        // Rule ID
  title: string                     // Rule heading
  icon: string                      // Emoji or icon character
  content: string[]                 // Array of rule points
}
```

**Example**:
```json
{
  "id": 1,
  "title": "Red Tennis Ball Match",
  "icon": "⚾",
  "content": [
    "All matches will be played with red tennis balls",
    "Cricket tennis balls (hard) are not allowed",
    "Organizers will provide tournament balls"
  ]
}
```

---

### 6. Organizer Interface

Tournament organizer contact information.

```typescript
interface Organizer {
  role: string                      // e.g., "Tournament Convenor"
  name: string                      // Organizer name
  phone: string                     // Contact number
  whatsapp: string                  // WhatsApp number
  email: string                     // Email address
}
```

---

### 7. SocialLink Interface

Social media platform links.

```typescript
interface SocialLink {
  name: string                      // Platform name
  icon: any                         // Lucide React icon component
  url: string                       // Profile URL
  color: string                     // Brand color (hex)
}
```

**Example**:
```typescript
{
  name: "Instagram",
  icon: Instagram,                  // from lucide-react
  url: "https://instagram.com/icct26",
  color: "#E4405F"
}
```

---

### 8. Venue Interface

Tournament venue details.

```typescript
interface Venue {
  name: string                      // Venue name
  address: string                   // Street address
  city: string
  state: string
  zipCode: string
  country: string
  mapEmbedUrl: string              // Google Maps embed URL
}
```

---

### 9. FormData Interface

Team registration form data (client-side).

```typescript
interface FormData {
  // Basic Information
  churchName: string
  teamName: string
  pastorLetter: File | null
  groupPhoto: File | null
  
  // Captain
  captain: CaptainInfo
  
  // Vice Captain
  viceCaptain: CaptainInfo
  
  // Players (11-15)
  players: PlayerData[]
  
  // Payment
  paymentReceipt: File | null
}

interface CaptainInfo {
  name: string
  phone: string
  whatsapp: string
  email: string
}

interface PlayerData {
  name: string
  role: string
  aadharFile: File | null
  subscriptionFile: File | null
}
```

---

### 10. AppConfig Interface

Application-wide configuration.

```typescript
interface AppConfig {
  tournamentName: string            // "ICCT26"
  tournamentYear: number            // 2026
  countdownTargetDate: string       // ISO 8601 date
  registrationFee: number           // in rupees
  upiId: string                     // UPI payment ID
  contactEmail: string
  socialMedia: {
    instagram: string               // Instagram URL
    facebook: string                // Facebook URL
    youtube: string                 // YouTube URL
    whatsapp: string                // WhatsApp number
  }
}
```

---

### 11. Announcement Interface

Home page announcements.

```typescript
interface Announcement {
  id: number
  text: string                      // Announcement message
  emoji: string                     // Emoji character
  image?: string                    // Optional image URL
}
```

---

### 12. RegistrationStep Interface

Multi-step form configuration.

```typescript
interface RegistrationStep {
  number: number                    // Step number (1-5)
  title: string                     // Step heading
}
```

---

## Data Validation Types

### ValidationError Interface

Client-side validation errors.

```typescript
interface FieldError {
  field: string                     // Field name
  message: string                   // Error message
  code: string                      // Error code
}

interface ValidationResult {
  isValid: boolean
  errors: FieldError[]
}
```

---

### ChurchAvailability Interface

Church registration capacity tracking.

```typescript
interface ChurchAvailability {
  church_name: string
  registered_teams: number          // Current count
  max_teams: number                 // Maximum allowed (2)
  is_full: boolean                  // Capacity reached
  is_locked: boolean                // Registration closed
}
```

---

## API Response Types

### Generic API Response

```typescript
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  detail?: string
}
```

**Usage Examples**:
```typescript
// Success response
const response: ApiResponse<Team[]> = {
  success: true,
  data: [...teams]
}

// Error response
const response: ApiResponse = {
  success: false,
  error: "Validation error",
  detail: "Invalid email format"
}
```

---

### TeamRegistrationPayload

Backend registration payload format.

```typescript
interface TeamRegistrationPayload {
  team_name: string
  church_name: string
  captain: {
    name: string
    phone: string
    email: string
    whatsapp: string
  }
  viceCaptain: {
    name: string
    phone: string
    email: string
    whatsapp: string
  }
  payment_receipt: string           // Base64 or URL
  pastor_letter: string
  groupPhoto: string
  players: Array<{
    name: string
    role: string
    aadhar_file: string
    subscription_file: string
  }>
}
```

---

## Form State Types

### Multi-Step Form State

```typescript
interface FormState {
  currentStep: number               // 1-5
  formData: FormData
  errors: Record<string, string>    // Field errors
  touched: Record<string, boolean>  // Touched fields
  isSubmitting: boolean
  isValid: boolean
}
```

---

### Upload Progress State

```typescript
interface UploadProgress {
  fileName: string
  progress: number                  // 0-100
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}
```

---

## Utility Types

### Score Format

```typescript
type ScoreFormat = `${number}/${number}`  // e.g., "145/8"

interface ScoreParsed {
  runs: number
  wickets: number
}

// Parse score string
function parseScore(score: string): ScoreParsed {
  const [runs, wickets] = score.split('/').map(Number)
  return { runs, wickets }
}
```

---

### Match Status

```typescript
type MatchStatus = 'scheduled' | 'live' | 'completed'

// Status badge colors
const statusColors: Record<MatchStatus, string> = {
  scheduled: 'bg-blue-500',
  live: 'bg-red-500 animate-pulse',
  completed: 'bg-green-500'
}
```

---

### Round Types

```typescript
type RoundType = 'Group' | 'Quarter Final' | 'Semi Final' | 'Final'

const roundNumbers: Record<RoundType, number> = {
  'Group': 1,
  'Quarter Final': 2,
  'Semi Final': 3,
  'Final': 4
}
```

---

## Data Files

### Schedule Data

**File**: [`src/data/schedule.ts`](../src/data/schedule.ts)

```typescript
export const MATCHES: Match[] = [...]

export const UNIQUE_MATCH_DATES: string[] = [...]

export function getMatchesByDate(date: string): Match[] {
  return MATCHES.filter(m => m.date === date)
}

export function getUpcomingMatches(): Match[] {
  const now = new Date()
  return MATCHES.filter(m => new Date(m.date) > now)
}

export function getMatchById(id: number): Match | undefined {
  return MATCHES.find(m => m.id === id)
}
```

---

### Rules Data

**File**: [`src/data/rules.ts`](../src/data/rules.ts)

```typescript
export const TOURNAMENT_RULES: Rule[] = [...]

export function getRuleById(id: number): Rule | undefined {
  return TOURNAMENT_RULES.find(r => r.id === id)
}

export function getRuleTitles(): string[] {
  return TOURNAMENT_RULES.map(r => r.title)
}
```

---

### Contact Data

**File**: [`src/data/contact.ts`](../src/data/contact.ts)

```typescript
export const ORGANIZERS: Organizer[] = [...]

export const SOCIAL_LINKS: SocialLink[] = [...]

export const VENUE: Venue = {...}

export function getOrganizerByRole(role: string): Organizer | undefined {
  return ORGANIZERS.find(o => o.role === role)
}

export function getSocialLinkByName(name: string): SocialLink | undefined {
  return SOCIAL_LINKS.find(s => s.name === name)
}

export function getFormattedVenueAddress(): string {
  return `${VENUE.address}, ${VENUE.city}, ${VENUE.state} ${VENUE.zipCode}`
}
```

---

### Home Data

**File**: [`src/data/home.ts`](../src/data/home.ts)

```typescript
export const HERO_SECTION = {
  mainTitle: "ICCT26",
  subTitle: "Inter Church Cricket Tournament",
  tagline: "Unity Through Cricket",
  description: "..."
}

export const TOURNAMENT_HIGHLIGHTS = [
  {
    icon: "🏆",
    title: "Prize Pool",
    value: "₹50,000"
  },
  // ...
]

export const ANNOUNCEMENTS: Announcement[] = [...]
```

---

### Registration Data

**File**: [`src/data/registration.ts`](../src/data/registration.ts)

```typescript
export const CHURCH_NAMES: string[] = [...]

export const PLAYER_ROLES: string[] = [
  "Batsman",
  "Bowler",
  "All-rounder",
  "Wicket Keeper"
]

export const REGISTRATION_STEPS: RegistrationStep[] = [
  { number: 1, title: "Basic Information" },
  { number: 2, title: "Captain Details" },
  { number: 3, title: "Vice Captain Details" },
  { number: 4, title: "Players Information" },
  { number: 5, title: "Payment Details" }
]

export const MIN_PLAYERS = 11
export const MAX_PLAYERS = 15
export const REGISTRATION_FEE = 2000
export const MAX_TEAMS_PER_CHURCH = 2
```

---

## Type Guards

### Utility Functions for Type Checking

```typescript
// Check if match is completed
function isCompletedMatch(match: Match): match is Match & { 
  result: MatchResult 
} {
  return match.status === 'completed' && match.result !== null
}

// Check if player has files
function hasPlayerDocuments(player: PlayerData): boolean {
  return player.aadharFile !== null && player.subscriptionFile !== null
}

// Validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone
function isValidPhone(phone: string): boolean {
  return /^\d{10}$/.test(phone)
}
```

---

## Enums and Constants

```typescript
// File types
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg']
export const ACCEPTED_PDF_TYPE = ['application/pdf']
export const ACCEPTED_DOCUMENT_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_PDF_TYPE]

// File sizes (in bytes)
export const MAX_FILE_SIZE = 5 * 1024 * 1024  // 5MB

// Validation lengths
export const NAME_MIN_LENGTH = 2
export const NAME_MAX_LENGTH = 50
export const TEAM_NAME_MIN_LENGTH = 2
export const TEAM_NAME_MAX_LENGTH = 100
export const PHONE_LENGTH = 10

// Date formats
export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const DISPLAY_DATE_FORMAT = 'DD MMM YYYY'
export const DISPLAY_TIME_FORMAT = 'hh:mm A'
```

---

*Complete type reference for ICCT26 application data structures*
