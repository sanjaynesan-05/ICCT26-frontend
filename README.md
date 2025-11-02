# 🏏 ICCT26 Cricket Tournament Website

A professional, IPL-inspired, mobile-responsive website for the ICCT26 Cricket Tournament built with React, Vite, TypeScript, Tailwind CSS, and Framer Motion.

## ✨ Features

### Pages
- **5 Complete Pages**: Home, Schedule, Registration, Rules, Contact
- **Multi-Step Registration**: 5-step form with payment QR code, progress tracking, and file uploads
- **Interactive Schedule**: Filterable tournament schedule with 6 matches (Jan 24-26, 2026)
- **Rules Section**: 8 comprehensive tournament rules with accordion layout

### Design & UX
- **Professional Design**: IPL-inspired color palette (Deep Royal Blue #002B5C, Bright Gold #FFCC29, Midnight Navy #0D1B2A)
- **Smooth Animations**: Powered by Framer Motion for engaging user experience
- **Fully Responsive**: Mobile-first design that works on all devices
- **Glassmorphic Effects**: Modern UI with blur effects and glow borders
- **Interactive Components**: Countdown timer, announcement ticker, social media links

### Data Architecture
- **Type-Safe Data Layer**: 100% TypeScript with 10+ interfaces
- **Organized Structure**: Data separated by domain (schedule, rules, contact, registration, home)
- **20+ Helper Functions**: Utility functions for filtering, searching, and formatting data
- **Centralized Configuration**: Global app settings, colors, routes, and feature flags
- **Scalable & Maintainable**: Production-ready code structure

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🗂️ Data Architecture

All website data is organized into type-safe TypeScript files for better maintainability and scalability.

### Data Files (`src/data/`)
```
data/
├── schedule.ts          # 6 tournament matches + helpers
├── rules.ts             # 8 tournament rules + helpers
├── contact.ts           # 3 organizers + social links + venue
├── registration.ts      # Registration config + validation
├── home.ts              # 6 announcements + highlights
└── index.ts             # Central export point
```

### Type Definitions (`src/types/`)
```
types/
└── index.ts             # 10 TypeScript interfaces
    ├── Match, Rule, Organizer
    ├── SocialLink, FormData, Player
    └── RegistrationStep, Announcement, Venue, AppConfig
```

### Configuration (`src/config/`)
```
config/
└── app.config.ts        # Global app settings
    ├── APP_CONFIG       # Tournament info, dates, fees
    ├── COLOR_PALETTE    # Color scheme
    ├── ROUTES           # Page routes
    ├── FEATURE_FLAGS    # Feature toggles
    └── Helper functions
```

### Usage Example
```typescript
// Import data
import { MATCHES, TOURNAMENT_RULES, ORGANIZERS } from '@/data'
import { APP_CONFIG, COLOR_PALETTE } from '@/config/app.config'

// Use in components
{MATCHES.map(m => <MatchCard key={m.id} match={m} />)}

// Get specific data
const convenor = getOrganizerByRole('Tournament Convenor')
const jan24Matches = getMatchesByDate('2026-01-24')

// Access configuration
const fee = APP_CONFIG.registrationFee  // 2000
const primaryColor = COLOR_PALETTE.primary  // #002B5C
```

### Benefits
✅ **Type-Safe** - Full TypeScript support  
✅ **Organized** - Data separated by domain  
✅ **Reusable** - Import anywhere in the app  
✅ **Maintainable** - Easy to find and update  
✅ **Scalable** - Simple to extend  
✅ **20+ Helper Functions** - Utility functions included  

### Data Statistics
- **6 Matches** - Tournament schedule (Jan 24-26, 2026)
- **8 Rules** - Comprehensive tournament rules
- **3 Organizers** - Contact information
- **2 Social Platforms** - Instagram, Facebook
- **5 Registration Steps** - Multi-step form flow
- **6 Announcements** - Ticker content
- **40+ Config Options** - App-wide settings

## 🌐 Pages Overview

### 1. Home (`/`)
- Hero section with floating cricket ball animations
- Live countdown timer to tournament start
- Tournament highlights cards (Prize Money, Venue, Date, Teams)
- Scrolling announcement ticker
- About section

### 2. Schedule (`/schedule`)
- Complete tournament match schedule
- Filter by date
- Match details with teams, time, venue
- LIVE badge for ongoing matches
- Responsive grid/card layout

### 3. Registration (`/registration`)
- **5-Step Multi-Step Form:**
  1. Payment upload with transaction ID
  2. Team details (name, logo, city)
  3. Captain & Vice-Captain information
  4. Player details (11-15 players with dynamic add/remove)
  5. Review & Submit
- Progress bar with step indicators
- File upload with preview
- Success modal with Team ID
- Form validation

### 4. Rules (`/rules`)
- Accordion-style rules layout
- 8 rule categories with expandable content
- Download rulebook PDF button
- Smooth animations on expand/collapse

### 5. Contact (`/contact`)
- Organizer information cards with phone, WhatsApp, and email
- Social media links (Instagram, Facebook)
- Embedded Google Maps for venue location
- Glassmorphic card design

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) folder:

- **[START_HERE.md](./docs/START_HERE.md)** - Quick overview and entry point
- **[DATA_SETUP.md](./docs/DATA_SETUP.md)** - Setup guide and import patterns
- **[QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md)** - Cheat sheet for common tasks
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System design and architecture diagrams
- **[DATA_ORGANIZATION_SUMMARY.md](./docs/DATA_ORGANIZATION_SUMMARY.md)** - Project overview
- **[IMPLEMENTATION_COMPLETE.md](./docs/IMPLEMENTATION_COMPLETE.md)** - Complete implementation summary
- **[FILE_LISTING.md](./docs/FILE_LISTING.md)** - Complete file reference
- **[INDEX.md](./docs/INDEX.md)** - Documentation index

**Also check:**
- `src/DATA_STRUCTURE.md` - Detailed data structure reference
- `src/INTEGRATION_GUIDE.ts` - Code integration examples

### Quick Links
- 🚀 [Getting Started](./docs/START_HERE.md)
- 📖 [Quick Reference](./docs/QUICK_REFERENCE.md)
- 🏗️ [Architecture Guide](./docs/ARCHITECTURE.md)
- 📂 [All Documentation](./docs/)

## 🎨 Color Palette

```css
Primary: #002B5C (Deep Royal Blue)
Secondary: #0D1B2A (Midnight Navy)
Accent: #FFCC29 (Bright Gold)
Background: Linear gradient from #001C40 to #002B5C
Text: White / Light Gray
```

## 🪶 Typography

- **Headings**: Bebas Neue (700)
- **Subheadings**: Quicksand (600)
- **Body**: Manrope (400-500)

## 📱 Responsive Breakpoints

- **Mobile**: ≤768px - Stacked layouts, hamburger menu
- **Tablet**: 768px-1024px - 1.5 column layouts
- **Desktop**: ≥1024px - Full-width grids, motion effects

## 🎯 Key Components

- `Navbar.tsx` - Sticky navigation with mobile menu
- `Footer.tsx` - Footer with social links & scroll-to-top
- `Countdown.tsx` - Tournament countdown timer
- `AnnouncementTicker.tsx` - Auto-scrolling news ticker
- `PlayerFormCard.tsx` - Reusable player input form

## 🔧 Customization

All data is now centralized in the `src/data/` and `src/config/` folders for easy customization.

### Update Tournament Data
Edit data files in `src/data/`:

```typescript
// src/data/schedule.ts - Update matches
export const MATCHES: Match[] = [
  { id: 1, match: 'Match 1', date: '2026-01-24', ... }
]

// src/data/contact.ts - Update organizers
export const ORGANIZERS: Organizer[] = [
  { role: 'Tournament Convenor', name: 'Your Name', ... }
]

// src/data/rules.ts - Update rules
export const TOURNAMENT_RULES: Rule[] = [
  { id: 1, title: 'Your Rule', content: [...] }
]
```

### Update Configuration
Edit `src/config/app.config.ts`:

```typescript
export const APP_CONFIG = {
  tournamentName: 'ICCT26',
  countdownTargetDate: '2026-01-24T00:00:00',
  registrationFee: 2000,
  // ... more settings
}

export const COLOR_PALETTE = {
  primary: '#002B5C',
  accent: '#FFCC29',
  // ... more colors
}
```

**See [DATA_SETUP.md](./docs/DATA_SETUP.md) for detailed customization guide.**

## 📄 Project Structure

```
ICCT26/
├── docs/                           # 📚 Documentation
│   ├── README.md                   # Documentation index
│   ├── START_HERE.md               # Quick start guide
│   ├── DATA_SETUP.md               # Setup & import guide
│   ├── QUICK_REFERENCE.md          # Cheat sheet
│   ├── ARCHITECTURE.md             # System design
│   ├── DATA_ORGANIZATION_SUMMARY.md
│   ├── IMPLEMENTATION_COMPLETE.md
│   └── FILE_LISTING.md
│
├── src/
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   │
│   ├── data/                       # 🗂️ Organized data files
│   │   ├── schedule.ts             # Tournament matches
│   │   ├── rules.ts                # Tournament rules
│   │   ├── contact.ts              # Organizers & venue
│   │   ├── registration.ts         # Registration config
│   │   ├── home.ts                 # Announcements
│   │   └── index.ts                # Central export
│   │
│   ├── config/
│   │   └── app.config.ts           # Global configuration
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Countdown.tsx
│   │   ├── PlayerFormCard.tsx
│   │   └── AnnouncementTicker.tsx
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Schedule.tsx
│   │   ├── Registration.tsx
│   │   ├── Rules.tsx
│   │   └── Contact.tsx
│   │
│   ├── lib/
│   │   └── utils.ts
│   │
│   ├── DATA_STRUCTURE.md           # Detailed data docs
│   ├── INTEGRATION_GUIDE.ts        # Code examples
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── README.md                       # This file
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🎬 Animations

- Fade-in on scroll
- Hover glow effects on cards/buttons
- Floating cricket ball animation
- Pulsing LIVE badges
- Slide transitions in multi-step form
- Smooth page transitions
- Scroll-triggered animations

## 📝 License

This project is created for the ICCT26 Cricket Tournament organized by CSI St. Peter's Church, Coimbatore.

## 🎯 Project Highlights

### Data Organization (November 2, 2025)
- ✅ **8 Data Files** - All website data organized into TypeScript files
- ✅ **10 Type Interfaces** - Full TypeScript support for type safety
- ✅ **20+ Helper Functions** - Utility functions for data operations
- ✅ **90+ Data Points** - Matches, rules, organizers, config organized
- ✅ **100% Type Coverage** - Complete TypeScript implementation
- ✅ **8 Documentation Files** - Comprehensive guides in `docs/` folder
- ✅ **Production Ready** - Scalable, maintainable code structure

### Key Metrics
| Metric | Value |
|--------|-------|
| Data Files | 8 |
| TypeScript Interfaces | 10 |
| Helper Functions | 20+ |
| Total Data Points | 90+ |
| Documentation Files | 8 |
| Lines of Code | 3,000+ |
| TypeScript Coverage | 100% |

**See [docs/](./docs/) for complete documentation.**

## 🤝 Credits

- **Design Inspiration**: IPL (Indian Premier League)
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Bebas Neue, Quicksand, Manrope)
- **Images**: Unsplash (Cricket stadium backgrounds)

---

**© 2026 ICCT Tournament | CSI St. Peter's Church, Coimbatore**

Made with ❤️ for cricket enthusiasts
