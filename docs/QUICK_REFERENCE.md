# 🚀 Quick Reference Guide

## Fastest Way to Use Data

### Import Everything You Need
```typescript
import { 
  MATCHES, 
  TOURNAMENT_RULES, 
  ORGANIZERS,
  REGISTRATION_STEPS,
  ANNOUNCEMENTS 
} from '@/data'

import { APP_CONFIG, ROUTES } from '@/config/app.config'
```

## Common Usage Patterns

### 1️⃣ Display All Matches
```typescript
import { MATCHES } from '@/data'

function SchedulePage() {
  return (
    <div>
      {MATCHES.map(match => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  )
}
```

### 2️⃣ Get Matches for Specific Date
```typescript
import { getMatchesByDate } from '@/data'

const jan24Matches = getMatchesByDate('2026-01-24')
```

### 3️⃣ Display All Rules
```typescript
import { TOURNAMENT_RULES } from '@/data'

function RulesPage() {
  return (
    <div>
      {TOURNAMENT_RULES.map(rule => (
        <RuleCard key={rule.id} rule={rule} />
      ))}
    </div>
  )
}
```

### 4️⃣ Get Rule by ID
```typescript
import { getRuleById } from '@/data'

const rule = getRuleById(1)
```

### 5️⃣ Display Organizers
```typescript
import { ORGANIZERS } from '@/data'

function ContactPage() {
  return (
    <div>
      {ORGANIZERS.map((org, idx) => (
        <OrganizerCard key={idx} organizer={org} />
      ))}
    </div>
  )
}
```

### 6️⃣ Get Organizer by Role
```typescript
import { getOrganizerByRole } from '@/data'

const convenor = getOrganizerByRole('Tournament Convenor')
```

### 7️⃣ Display Social Links
```typescript
import { SOCIAL_LINKS } from '@/data'

function SocialLinks() {
  return (
    <div>
      {SOCIAL_LINKS.map(link => (
        <a key={link.name} href={link.url} target="_blank">
          <link.icon size={32} />
        </a>
      ))}
    </div>
  )
}
```

### 8️⃣ Get Registration Steps
```typescript
import { REGISTRATION_STEPS } from '@/data'

function RegistrationForm() {
  return (
    <div>
      {REGISTRATION_STEPS.map(step => (
        <Step key={step.number} step={step} />
      ))}
    </div>
  )
}
```

### 9️⃣ Display Announcements
```typescript
import { ANNOUNCEMENTS } from '@/data'

function AnnouncementTicker() {
  return (
    <ticker>
      {ANNOUNCEMENTS.map(announcement => (
        <Announcement key={announcement.id} text={announcement.text} />
      ))}
    </ticker>
  )
}
```

### 🔟 Use App Configuration
```typescript
import { APP_CONFIG, COLOR_PALETTE, ROUTES } from '@/config/app.config'

// Tournament info
const fee = APP_CONFIG.registrationFee  // 2000
const year = APP_CONFIG.tournamentYear  // 2026

// Colors
const primaryColor = COLOR_PALETTE.primary  // #002B5C
const accentColor = COLOR_PALETTE.accent    // #FFCC29

// Routes
const homeRoute = ROUTES.home            // /
const scheduleRoute = ROUTES.schedule    // /schedule
```

## Data Cheat Sheet

| Need | Import | Function |
|------|--------|----------|
| All matches | `MATCHES` | `getMatchesByDate()` |
| Matches by date | `getMatchesByDate(date)` | Returns filtered matches |
| Match by ID | `getMatchById(id)` | Returns single match |
| Upcoming matches | `getUpcomingMatches()` | Returns upcoming matches |
| All rules | `TOURNAMENT_RULES` | `getRuleById()` |
| Rule by ID | `getRuleById(id)` | Returns single rule |
| Rule titles | `getRuleTitles()` | Returns all titles |
| Rule content | `getRuleContentByTitle(title)` | Returns content array |
| All organizers | `ORGANIZERS` | `getOrganizerByRole()` |
| Organizer by role | `getOrganizerByRole(role)` | Returns organizer |
| Social links | `SOCIAL_LINKS` | `getSocialLinkByName()` |
| Social by name | `getSocialLinkByName(name)` | Returns link |
| Venue info | `VENUE` | `getFormattedVenueAddress()` |
| Formatted address | `getFormattedVenueAddress()` | Returns string |
| Registration steps | `REGISTRATION_STEPS` | `getStepByNumber()` |
| Step by number | `getStepByNumber(number)` | Returns step |
| Announcements | `ANNOUNCEMENTS` | `getAnnouncementById()` |
| Announcement by ID | `getAnnouncementById(id)` | Returns announcement |
| Random announcement | `getRandomAnnouncement()` | Returns random |
| Highlights | `TOURNAMENT_HIGHLIGHTS` | - |
| Hero section | `HERO_SECTION` | - |
| App config | `APP_CONFIG` | `getConfigValue()` |
| Config value | `getConfigValue(key)` | Returns value |
| Feature status | `isFeatureEnabled(feature)` | Returns boolean |

## TypeScript Types

```typescript
// Match
interface Match {
  id: number
  match: string
  date: string
  time: string
  venue: string
  teamA: string
  teamB: string
  status: 'upcoming' | 'live' | 'completed'
}

// Rule
interface Rule {
  id: number
  title: string
  icon: string
  content: string[]
}

// Organizer
interface Organizer {
  role: string
  name: string
  phone: string
  whatsapp: string
  email: string
}

// SocialLink
interface SocialLink {
  name: string
  icon: any // React icon component
  url: string
  color: string
}

// RegistrationStep
interface RegistrationStep {
  number: number
  title: string
}

// Announcement
interface Announcement {
  id: number
  text: string
  emoji: string
}
```

## File Locations

```
src/types/index.ts              ← All interfaces
src/data/schedule.ts            ← Matches data
src/data/rules.ts               ← Rules data
src/data/contact.ts             ← Organizers, social, venue
src/data/registration.ts        ← Registration config
src/data/home.ts                ← Announcements, highlights
src/data/index.ts               ← Central exports
src/config/app.config.ts        ← App configuration
```

## Color Palette

```typescript
Primary:      #002B5C (Deep Royal Blue)
Secondary:    #0D1B2A (Midnight Navy)
Accent:       #FFCC29 (Bright Gold)
BG Start:     #0A0E27
Text Primary: #FFFFFF
Text Secondary: #B0B0B0
Success:      #4CAF50
Error:        #F44336
Warning:      #FFC107
```

## Registration Configuration

```typescript
Fee:           ₹2000 INR
Min Players:   11
Max Players:   15
Steps:         5 (Payment → Team → Captain → Players → Review)
QR Code:       api.qrserver.com (dynamic generation)
Max File Size: 5 MB
```

## Routes

```
/              Home
/schedule      Tournament schedule
/registration  Team registration
/rules         Tournament rules
/contact       Contact organizers
```

## Feature Flags

```typescript
enableRegistration     true
enableLiveScore        false
enableGallery          false
enableTeamLeaderboard  false
```

## Common Patterns

### Filter Data
```typescript
const groupAMatches = MATCHES.filter(m => m.match.includes('Group A'))
const liveMatches = MATCHES.filter(m => m.status === 'live')
```

### Map Over Data
```typescript
const matchIds = MATCHES.map(m => m.id)
const ruleContents = TOURNAMENT_RULES.map(r => r.content)
```

### Find Specific Item
```typescript
const finalMatch = MATCHES.find(m => m.match === 'Grand Final')
const powerplayRule = TOURNAMENT_RULES.find(r => r.id === 3)
```

### Sort Data
```typescript
const sortedByDate = [...MATCHES].sort((a, b) => 
  new Date(a.date).getTime() - new Date(b.date).getTime()
)
```

### Group Data
```typescript
const matchesByDate = UNIQUE_MATCH_DATES.map(date => ({
  date,
  matches: getMatchesByDate(date)
}))
```

## Validation Examples

```typescript
// Check file size
const isValid = file.size <= FILE_CONFIG.paymentReceipt.maxSize

// Validate file type
const isImage = FILE_CONFIG.paymentReceipt.allowedTypes.includes(file.type)

// Validate team name
const isValidTeamName = /^[a-zA-Z0-9\s]+$/.test(teamName)

// Calculate progress
const progress = calculateProgress(currentStep) // Returns 0-100
```

## Performance Tips

✅ Import only what you need  
✅ Use helper functions instead of manual filtering  
✅ Memoize filtered results  
✅ Use const for immutable data  
✅ Leverage TypeScript for type checking  

## Debugging Tips

```typescript
// Log all matches
console.log(MATCHES)

// Log specific match
console.log(getMatchById(1))

// Log config
console.log(APP_CONFIG)

// Check feature
console.log(isFeatureEnabled('enableRegistration'))

// Validate data
console.log(MATCHES.length) // Should be 6
console.log(TOURNAMENT_RULES.length) // Should be 8
console.log(ORGANIZERS.length) // Should be 3
```

## Next Steps After Setup

1. ✅ Review this quick reference
2. ✅ Check DATA_STRUCTURE.md for details
3. ✅ See INTEGRATION_GUIDE.ts for code examples
4. ✅ Update components to use imported data
5. ✅ Remove inline data from components
6. ✅ Test all features work correctly
7. ✅ Deploy updated application

---

**Last Updated:** November 2, 2025  
**For detailed documentation:** See DATA_STRUCTURE.md
