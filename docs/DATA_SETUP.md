# 📁 Data Structure Setup Guide

## What's New

The ICCT26 Cricket Tournament website now has a well-organized, type-safe data structure that centralizes all website content and configuration.

## Directory Structure

```
src/
├── types/
│   └── index.ts                    # TypeScript interfaces & types
├── data/
│   ├── schedule.ts                 # Match schedule data
│   ├── rules.ts                    # Tournament rules
│   ├── contact.ts                  # Organizers & venue info
│   ├── registration.ts             # Registration config & validation
│   ├── home.ts                     # Home page announcements
│   └── index.ts                    # Central export point
├── config/
│   └── app.config.ts               # Global app configuration
├── DATA_STRUCTURE.md               # Detailed documentation
└── INTEGRATION_GUIDE.ts            # Integration examples
```

## Quick Start

### Import Data in Components

**Option 1: Import from central index (Recommended)**
```typescript
import { MATCHES, TOURNAMENT_RULES, ORGANIZERS, ANNOUNCEMENTS } from '@/data'
```

**Option 2: Import specific data file**
```typescript
import { MATCHES } from '@/data/schedule'
import { TOURNAMENT_RULES } from '@/data/rules'
```

**Option 3: Import configuration**
```typescript
import { APP_CONFIG, COLOR_PALETTE, ROUTES } from '@/config/app.config'
```

## Data Files Overview

| File | Purpose | Main Exports |
|------|---------|--------------|
| `schedule.ts` | Match schedule | `MATCHES`, helper functions |
| `rules.ts` | Tournament rules | `TOURNAMENT_RULES`, helper functions |
| `contact.ts` | Organizers & venue | `ORGANIZERS`, `SOCIAL_LINKS`, `VENUE` |
| `registration.ts` | Registration config | `REGISTRATION_STEPS`, `UPI_CONFIG`, validation rules |
| `home.ts` | Home page content | `ANNOUNCEMENTS`, `HERO_SECTION` |
| `app.config.ts` | App settings | `APP_CONFIG`, `COLOR_PALETTE`, `ROUTES` |

## Key Features

✅ **Type Safe** - Full TypeScript support with interfaces  
✅ **Centralized** - All data in one place  
✅ **Reusable** - Helper functions for common operations  
✅ **Scalable** - Easy to add new data  
✅ **Maintainable** - Clear organization and documentation  
✅ **Testable** - Data can be easily mocked  

## Common Tasks

### Get Matches for a Specific Date
```typescript
import { getMatchesByDate } from '@/data'

const jan24Matches = getMatchesByDate('2026-01-24')
```

### Get Tournament Rule by ID
```typescript
import { getRuleById } from '@/data'

const rule = getRuleById(1)
```

### Get Organizer by Role
```typescript
import { getOrganizerByRole } from '@/data'

const convenor = getOrganizerByRole('Tournament Convenor')
```

### Get Social Link
```typescript
import { getSocialLinkByName } from '@/data'

const instagram = getSocialLinkByName('Instagram')
```

### Check if Feature is Enabled
```typescript
import { isFeatureEnabled } from '@/config/app.config'

if (isFeatureEnabled('enableRegistration')) {
  // Show registration button
}
```

### Get Configuration Value
```typescript
import { APP_CONFIG } from '@/config/app.config'

const fee = APP_CONFIG.registrationFee
const tournamentName = APP_CONFIG.tournamentName
```

## Updating Data

### Add New Match
Edit `src/data/schedule.ts` and add to `MATCHES` array:
```typescript
{
  id: 7,
  match: 'New Match',
  date: '2026-01-27',
  time: '05:00 PM',
  venue: 'Main Ground',
  teamA: 'Team A',
  teamB: 'Team B',
  status: 'upcoming',
}
```

### Add New Rule
Edit `src/data/rules.ts` and add to `TOURNAMENT_RULES` array:
```typescript
{
  id: 9,
  title: 'New Rule',
  icon: '✨',
  content: ['Point 1', 'Point 2'],
}
```

### Add New Organizer
Edit `src/data/contact.ts` and add to `ORGANIZERS` array:
```typescript
{
  role: 'New Role',
  name: 'Name',
  phone: '+91 98765 43213',
  whatsapp: '919876543213',
  email: 'email@icct26.org',
}
```

### Update App Configuration
Edit `src/config/app.config.ts`:
```typescript
export const APP_CONFIG: AppConfig = {
  tournamentName: 'ICCT26',
  tournamentYear: 2026,
  // ... other config
}
```

## File Structure Details

### types/index.ts
Contains all TypeScript interfaces:
- `Match` - Match information
- `Rule` - Tournament rules
- `Organizer` - Organizer details
- `SocialLink` - Social media links
- `FormData` - Registration form data
- `Player` - Player information
- `RegistrationStep` - Registration steps
- `Announcement` - Announcements
- `Venue` - Venue information
- `AppConfig` - App configuration

### data/schedule.ts
- `MATCHES` - All tournament matches
- `UNIQUE_MATCH_DATES` - Array of unique dates
- `getMatchesByDate(date)` - Filter by date
- `getUpcomingMatches()` - Get upcoming matches
- `getMatchById(id)` - Get by ID

### data/rules.ts
- `TOURNAMENT_RULES` - All rules
- `getRuleById(id)` - Get by ID
- `getRuleTitles()` - Get all titles
- `getRuleContentByTitle(title)` - Get content by title

### data/contact.ts
- `ORGANIZERS` - All organizers
- `SOCIAL_LINKS` - All social links
- `VENUE` - Venue information
- Helper functions for filtering and formatting

### data/registration.ts
- `REGISTRATION_STEPS` - Registration flow
- `REGISTRATION_CONFIG` - Configuration
- `UPI_CONFIG` - Payment configuration
- `VALIDATION_RULES` - Form validation
- `FILE_CONFIG` - File upload settings
- Helper functions for validation and progress

### data/home.ts
- `ANNOUNCEMENTS` - Ticker announcements
- `HERO_SECTION` - Hero section content
- `TOURNAMENT_HIGHLIGHTS` - Features list
- Helper functions for announcements

### config/app.config.ts
- `APP_CONFIG` - Main app configuration
- `COLOR_PALETTE` - Colors
- `TYPOGRAPHY` - Fonts
- `ROUTES` - Route paths
- `ANIMATIONS` - Animation timing
- `API_CONFIG` - API settings
- `FEATURE_FLAGS` - Feature toggles

## Migration Checklist

- [ ] Review existing components with inline data
- [ ] Import data from `@/data` or `@/config/app.config`
- [ ] Replace inline data with imported constants
- [ ] Use helper functions instead of filtering inline
- [ ] Update components to use centralized data
- [ ] Test all components with new data imports
- [ ] Verify no regressions in functionality

## Benefits

1. **Single Source of Truth** - All data in one organized place
2. **Type Safety** - TypeScript catches errors at compile time
3. **Maintainability** - Easy to find and update data
4. **Reusability** - Use same data across multiple components
5. **Testability** - Mock data easily for unit tests
6. **Performance** - Static data optimized at build time
7. **Scalability** - Easy to extend with new data
8. **Documentation** - Self-documenting code with comments

## Need Help?

- See `src/DATA_STRUCTURE.md` for detailed documentation
- See `src/INTEGRATION_GUIDE.ts` for code examples
- Check individual data files for comments and usage

---

**Created:** November 2, 2025  
**Version:** 1.0  
**Status:** Ready for integration
