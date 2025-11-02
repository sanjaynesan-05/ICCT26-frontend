# Data Structure Documentation

## Overview

The ICCT26 Cricket Tournament website data has been organized into separate, well-typed TypeScript files for better maintainability, scalability, and code organization.

## Directory Structure

```
src/
├── types/
│   └── index.ts              # All TypeScript interfaces and types
├── data/
│   ├── schedule.ts           # Match schedule data
│   ├── rules.ts              # Tournament rules
│   ├── contact.ts            # Organizer & venue information
│   ├── registration.ts       # Registration form configuration
│   ├── home.ts               # Home page announcements & highlights
│   └── index.ts              # Central export point
└── config/
    └── app.config.ts         # Application configuration & settings
```

## Type Definitions (`src/types/index.ts`)

All TypeScript interfaces are centralized here:

- **Match** - Match information including teams, timing, and status
- **Rule** - Tournament rules with title, icon, and content
- **Organizer** - Organizer contact information
- **SocialLink** - Social media links configuration
- **FormData** - Registration form data structure
- **Player** - Player information
- **RegistrationStep** - Registration step configuration
- **Announcement** - Home page announcements
- **Venue** - Venue location details
- **AppConfig** - Global application configuration

## Data Files

### 1. Schedule Data (`src/data/schedule.ts`)

Contains all tournament match information and utility functions.

**Exports:**
- `MATCHES` - Array of all matches
- `UNIQUE_MATCH_DATES` - Array of unique match dates
- `getMatchesByDate(date)` - Filter matches by date
- `getUpcomingMatches()` - Get all upcoming matches
- `getMatchById(id)` - Get specific match by ID

**Usage:**
```typescript
import { MATCHES, getMatchesByDate } from '@/data'

const matches = MATCHES
const jan24Matches = getMatchesByDate('2026-01-24')
```

### 2. Rules Data (`src/data/rules.ts`)

Contains tournament rules and regulations.

**Exports:**
- `TOURNAMENT_RULES` - Array of all tournament rules
- `getRuleById(id)` - Get rule by ID
- `getRuleTitles()` - Get all rule titles
- `getRuleContentByTitle(title)` - Get rule content by title

**Usage:**
```typescript
import { TOURNAMENT_RULES, getRuleById } from '@/data'

const allRules = TOURNAMENT_RULES
const rule1 = getRuleById(1)
```

### 3. Contact Data (`src/data/contact.ts`)

Contains organizer information, social links, and venue details.

**Exports:**
- `ORGANIZERS` - Array of tournament organizers
- `SOCIAL_LINKS` - Array of social media links
- `VENUE` - Venue location information
- `getOrganizerByRole(role)` - Get organizer by role
- `getSocialLinkByName(name)` - Get social link by name
- `getFormattedVenueAddress()` - Get formatted venue address

**Usage:**
```typescript
import { ORGANIZERS, SOCIAL_LINKS, VENUE } from '@/data'

const organizers = ORGANIZERS
const instagram = getSocialLinkByName('Instagram')
const address = getFormattedVenueAddress()
```

### 4. Registration Data (`src/data/registration.ts`)

Contains registration form configuration and validation rules.

**Exports:**
- `REGISTRATION_STEPS` - Array of registration steps
- `REGISTRATION_CONFIG` - Registration configuration
- `UPI_CONFIG` - UPI payment configuration
- `VALIDATION_RULES` - Form validation rules
- `FILE_CONFIG` - File upload configuration
- `getStepByNumber(number)` - Get step by number
- `getStepTitle(number)` - Get step title
- `calculateProgress(currentStep)` - Calculate progress percentage
- `validateFile(file, fileType)` - Validate file upload

**Usage:**
```typescript
import { REGISTRATION_CONFIG, REGISTRATION_STEPS, UPI_CONFIG } from '@/data'

const fee = REGISTRATION_CONFIG.registrationFee
const steps = REGISTRATION_STEPS
const qrUrl = UPI_CONFIG.qrCodeUrl
```

### 5. Home Page Data (`src/data/home.ts`)

Contains announcements and tournament highlights.

**Exports:**
- `ANNOUNCEMENTS` - Array of announcement ticker items
- `HERO_SECTION` - Hero section content
- `TOURNAMENT_HIGHLIGHTS` - Tournament features/highlights
- `getAnnouncementById(id)` - Get announcement by ID
- `getRandomAnnouncement()` - Get random announcement

**Usage:**
```typescript
import { ANNOUNCEMENTS, HERO_SECTION, TOURNAMENT_HIGHLIGHTS } from '@/data'

const announcements = ANNOUNCEMENTS
const highlights = TOURNAMENT_HIGHLIGHTS
```

### 6. App Configuration (`src/config/app.config.ts`)

Global application settings and configuration.

**Exports:**
- `APP_CONFIG` - Main app configuration
- `COLOR_PALETTE` - Color scheme
- `TYPOGRAPHY` - Font settings
- `ROUTES` - Route paths
- `ANIMATIONS` - Animation timing
- `API_CONFIG` - API settings
- `FEATURE_FLAGS` - Feature toggles
- `getConfigValue(key)` - Get config value
- `isFeatureEnabled(feature)` - Check if feature is enabled

**Usage:**
```typescript
import { APP_CONFIG, COLOR_PALETTE, ROUTES, isFeatureEnabled } from '@/config/app.config'

const tournamentName = APP_CONFIG.tournamentName
const primaryColor = COLOR_PALETTE.primary
const homeRoute = ROUTES.home
const registrationEnabled = isFeatureEnabled('enableRegistration')
```

## Data Export Index (`src/data/index.ts`)

Central export point for all data files. Import from here for convenience:

```typescript
// Single import for all data
import {
  MATCHES,
  TOURNAMENT_RULES,
  ORGANIZERS,
  REGISTRATION_STEPS,
  ANNOUNCEMENTS,
  getMatchesByDate,
  getRuleById,
} from '@/data'
```

## Benefits

1. **Separation of Concerns** - Data is separated from components
2. **Type Safety** - Full TypeScript support with interfaces
3. **Reusability** - Data can be easily imported and used across components
4. **Maintainability** - Centralized data makes updates easier
5. **Scalability** - Easy to add new data types
6. **Testing** - Data can be easily mocked for tests
7. **Performance** - Static data is optimized at build time

## How to Update Data

### Adding a New Match
```typescript
// In src/data/schedule.ts
export const MATCHES: Match[] = [
  // existing matches...
  {
    id: 7,
    match: 'Match 7 - Playoff',
    date: '2026-01-27',
    time: '05:00 PM',
    venue: 'Main Ground',
    teamA: 'Team A',
    teamB: 'Team B',
    status: 'upcoming',
  },
]
```

### Adding a New Rule
```typescript
// In src/data/rules.ts
export const TOURNAMENT_RULES: Rule[] = [
  // existing rules...
  {
    id: 9,
    title: 'New Rule Title',
    icon: '✨',
    content: ['Rule content point 1', 'Rule content point 2'],
  },
]
```

### Adding a New Organizer
```typescript
// In src/data/contact.ts
export const ORGANIZERS: Organizer[] = [
  // existing organizers...
  {
    role: 'New Role',
    name: 'Name',
    phone: '+91 98765 43213',
    whatsapp: '919876543213',
    email: 'email@icct26.org',
  },
]
```

## Component Usage Examples

### Using Schedule Data
```typescript
import { MATCHES, getMatchesByDate } from '@/data'

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState('2026-01-24')
  const matchesForDate = getMatchesByDate(selectedDate)

  return (
    <div>
      {matchesForDate.map(match => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  )
}
```

### Using Rules Data
```typescript
import { TOURNAMENT_RULES } from '@/data'

const Rules = () => {
  return (
    <div>
      {TOURNAMENT_RULES.map(rule => (
        <RuleAccordion key={rule.id} rule={rule} />
      ))}
    </div>
  )
}
```

### Using Configuration
```typescript
import { APP_CONFIG, ROUTES, isFeatureEnabled } from '@/config/app.config'

if (isFeatureEnabled('enableRegistration')) {
  // Show registration link
}

const homeLink = ROUTES.home
```

## Migration Guide

If you have existing components using inline data, migrate them as follows:

**Before:**
```typescript
const Contact = () => {
  const organizers = [
    { role: 'Tournament Convenor', name: 'Mr. John Samuel', ... }
  ]
  // component code
}
```

**After:**
```typescript
import { ORGANIZERS } from '@/data'

const Contact = () => {
  // use ORGANIZERS directly
  // component code
}
```

## Future Enhancements

1. Add environment-specific configurations
2. Add database integration layer
3. Add API endpoints for dynamic data
4. Add data validation schemas
5. Add data caching mechanisms
6. Add multi-language support

---

For more information, refer to specific data file comments and type definitions.
