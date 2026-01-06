# 🏗️ ICCT26 System Architecture

## Architecture Overview

ICCT26 follows a modern **3-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   React 18 + TypeScript + Tailwind CSS + Vite       │  │
│  │   - Components (UI Elements)                         │  │
│  │   - Pages (Route Containers)                         │  │
│  │   - Context (State Management)                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Business Logic & Services                          │  │
│  │   - API Service (api.ts)                             │  │
│  │   - Validation Utils (validation.ts)                 │  │
│  │   - Idempotency Manager (idempotency.ts)             │  │
│  │   - API Client (apiClient.ts)                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Backend API (FastAPI - Python)                     │  │
│  │   - PostgreSQL Database                              │  │
│  │   - File Storage (Cloudinary)                        │  │
│  │   - Email Service (SMTP)                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App.tsx (Root)
├── ErrorBoundary
│   ├── AdminProvider (Context)
│   │   └── Router
│   │       ├── Public Routes
│   │       │   ├── Navbar
│   │       │   ├── Pages
│   │       │   │   ├── Home
│   │       │   │   ├── Registration
│   │       │   │   ├── Schedule
│   │       │   │   ├── Gallery
│   │       │   │   ├── Rules
│   │       │   │   └── Contact
│   │       │   └── Footer
│   │       └── Protected Routes (Admin)
│   │           ├── AdminLogin
│   │           ├── AdminDashboard
│   │           ├── TeamDetail
│   │           ├── PlayerDetail
│   │           └── ScheduleManager
```

### Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── AnnouncementTicker.tsx
│   ├── Countdown.tsx
│   ├── CricketLoader.tsx
│   ├── ErrorBoundary.tsx
│   ├── FileUpload.tsx
│   ├── FloatingTeamsWidget.tsx
│   ├── Footer.tsx
│   ├── ImageCarousel.tsx
│   ├── Navbar.tsx
│   ├── PlayerFormCard.tsx
│   ├── ProgressBar.tsx
│   ├── ProtectedRoute.tsx
│   ├── RegistrationCountdown.tsx
│   ├── SchedulePreview.tsx
│   ├── SearchableSelect.tsx
│   └── scoring/
│
├── pages/              # Page-level components
│   ├── Home.tsx
│   ├── Registration.tsx
│   ├── Schedule.tsx
│   ├── Gallery.tsx
│   ├── Rules.tsx
│   ├── Contact.tsx
│   └── admin/
│       ├── AdminLogin.tsx
│       ├── AdminDashboard.tsx
│       ├── TeamDetail.tsx
│       ├── PlayerDetail.tsx
│       └── ScheduleManager.tsx
│
├── contexts/           # React Context providers
│   └── AdminContext.tsx
│
├── services/           # API service layer
│   └── api.ts
│
├── utils/              # Utility functions
│   ├── apiClient.ts
│   ├── validation.ts
│   ├── idempotency.ts
│   ├── churchAvailability.ts
│   └── productionRegistrationService.ts
│
├── types/              # TypeScript type definitions
│   └── index.ts
│
├── data/               # Static data and configurations
│   ├── home.ts
│   ├── schedule.ts
│   ├── rules.ts
│   ├── contact.ts
│   ├── registration.ts
│   └── index.ts
│
├── config/             # Application configuration
│   └── app.config.ts
│
├── styles/             # Global styles
│   └── scrollbar.css
│
└── assets/             # Static assets
    └── sponsor/
```

## Data Flow Architecture

### Registration Flow

```
┌──────────────┐
│     User     │
│  (Browser)   │
└──────┬───────┘
       │ 1. Fill Form
       ▼
┌──────────────────────┐
│  Registration.tsx    │
│  - Form Validation   │
│  - File Validation   │
└──────┬───────────────┘
       │ 2. Submit with Idempotency Key
       ▼
┌──────────────────────┐
│  apiClient.ts        │
│  - Retry Logic       │
│  - Progress Tracking │
└──────┬───────────────┘
       │ 3. Multipart FormData
       ▼
┌──────────────────────┐
│  Backend API         │
│  - Validation        │
│  - File Upload       │
│  - Database Save     │
│  - Send Email        │
└──────┬───────────────┘
       │ 4. Response
       ▼
┌──────────────────────┐
│  Success/Error UI    │
│  - Confirmation      │
│  - Team ID Display   │
└──────────────────────┘
```

### Admin Dashboard Flow

```
┌──────────────┐
│    Admin     │
└──────┬───────┘
       │ 1. Login
       ▼
┌──────────────────────┐
│  AdminContext        │
│  - Authentication    │
│  - Session Storage   │
└──────┬───────────────┘
       │ 2. Protected Route
       ▼
┌──────────────────────┐
│  AdminDashboard      │
│  - Fetch Teams       │
│  - Fetch Matches     │
└──────┬───────────────┘
       │ 3. API Calls
       ▼
┌──────────────────────┐
│  api.ts Service      │
│  - GET /teams        │
│  - GET /matches      │
│  - PUT /match/:id    │
└──────┬───────────────┘
       │ 4. Data
       ▼
┌──────────────────────┐
│  Dashboard UI        │
│  - Tables            │
│  - Charts            │
│  - Export Options    │
└──────────────────────┘
```

## State Management Architecture

### Context-Based State

```typescript
// AdminContext - Global authentication state
{
  isAuthenticated: boolean,
  login: (username, password) => boolean,
  logout: () => void
}

// Component-Level State (useState)
- Form data
- Loading states
- Error states
- UI state (modals, accordions, etc.)

// URL-Based State (React Router)
- Current page
- Route parameters (teamId, playerId)
- Query parameters (filters, search)
```

### Data Persistence

```
┌─────────────────────┐
│  Local Storage      │
├─────────────────────┤
│ - admin_session     │
│ - idempotency_keys  │
│ - last_submission   │
└─────────────────────┘

┌─────────────────────┐
│  Session Storage    │
├─────────────────────┤
│ - cricketLoaderShown│
│ - form_draft        │
└─────────────────────┘
```

## API Architecture

### Endpoint Structure

```
Backend Base URL: https://icct26-backend.onrender.com

Public Endpoints:
├── GET    /                          # API status
├── GET    /matches                   # Get all matches
├── GET    /matches/:id               # Get match by ID
├── POST   /register                  # Team registration
└── GET    /church-availability       # Church capacity

Admin Endpoints:
├── GET    /admin/teams               # Get all teams
├── GET    /admin/teams/:id           # Get team details
├── GET    /admin/players/:id         # Get player details
├── PUT    /admin/matches/:id         # Update match
└── POST   /admin/schedule            # Update schedule
```

### API Client Features

```typescript
// Retry Mechanism
- Max retries: 3
- Backoff strategy: Exponential (1s, 2s, 4s)
- Retry on: Network errors, 500+ status codes

// Progress Tracking
- Upload progress percentage
- Callback for UI updates

// Error Handling
- Network errors
- Validation errors
- Server errors
- CORS errors

// Idempotency
- UUID-based keys
- Duplicate prevention
- Request tracking
```

## Component Communication Patterns

### Parent-Child Props

```typescript
// Parent passes data and callbacks
<PlayerFormCard
  index={0}
  player={playerData}
  onChange={(index, field, value) => updatePlayer(index, field, value)}
  onRemove={(index) => removePlayer(index)}
/>
```

### Context API

```typescript
// Global state access
const { isAuthenticated, login, logout } = useAdmin()
```

### Event Emitters

```typescript
// File upload progress
onProgress={(percent) => setUploadProgress(percent)}
```

## Security Architecture

### Authentication Flow

```
┌──────────────┐
│  Admin Login │
└──────┬───────┘
       │ 1. Credentials
       ▼
┌──────────────────────┐
│  AdminContext        │
│  - Validate          │
│  - Set Session       │
└──────┬───────────────┘
       │ 2. Authenticated
       ▼
┌──────────────────────┐
│  ProtectedRoute      │
│  - Check Auth        │
│  - Redirect if No    │
└──────┬───────────────┘
       │ 3. Allow Access
       ▼
┌──────────────────────┐
│  Admin Dashboard     │
└──────────────────────┘
```

### Input Validation Layers

```
Layer 1: Client-Side (TypeScript)
├── Type checking
├── Required fields
└── Basic format validation

Layer 2: Utils (validation.ts)
├── Email regex
├── Phone number format
├── File type/size
└── Name sanitization

Layer 3: Backend API
├── Schema validation
├── Business logic rules
├── Database constraints
└── File processing
```

## Performance Architecture

### Code Splitting Strategy

```javascript
// Route-based splitting
const Home = lazy(() => import('./pages/Home'))
const Registration = lazy(() => import('./pages/Registration'))
const Gallery = lazy(() => import('./pages/Gallery'))

// Component-based splitting
const HeavyComponent = lazy(() => import('./components/HeavyComponent'))
```

### Asset Optimization

```
Images:
├── Cloudinary CDN (Gallery)
├── WebP format with fallbacks
├── Lazy loading
└── Responsive srcset

Fonts:
├── Local font files
├── Font-display: swap
└── Subset loading

Scripts:
├── Vendor chunk splitting
├── Tree shaking
└── Minification
```

### Caching Strategy

```
Static Assets:
├── Long-term caching (1 year)
├── Content hash in filename
└── CDN distribution

API Responses:
├── Short-term caching (5 min)
├── Conditional requests
└── ETag validation

Dynamic Content:
├── No caching
├── Fresh data on each request
└── Real-time updates
```

## Deployment Architecture

```
┌──────────────────────────────────────────────┐
│              Netlify CDN                      │
│  ┌────────────────────────────────────────┐  │
│  │   Frontend (React SPA)                 │  │
│  │   - Auto-deploy from Git               │  │
│  │   - HTTPS enabled                      │  │
│  │   - Custom domain                      │  │
│  └────────────────────────────────────────┘  │
└──────────────────┬───────────────────────────┘
                   │ API Calls
                   ▼
┌──────────────────────────────────────────────┐
│              Render Platform                  │
│  ┌────────────────────────────────────────┐  │
│  │   Backend API (FastAPI)                │  │
│  │   - Auto-deploy from Git               │  │
│  │   - PostgreSQL database                │  │
│  │   - CORS configured                    │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│           External Services                   │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │ Cloudinary  │  │   Email Service      │  │
│  │ (CDN)       │  │   (SMTP)             │  │
│  └─────────────┘  └──────────────────────┘  │
└──────────────────────────────────────────────┘
```

## Database Schema (Overview)

```sql
-- Teams Table
teams {
  id: UUID PRIMARY KEY
  team_name: VARCHAR(100)
  church_name: VARCHAR(200)
  captain_name: VARCHAR(100)
  captain_email: VARCHAR(255)
  captain_phone: VARCHAR(20)
  vice_captain_name: VARCHAR(100)
  payment_receipt_url: TEXT
  pastor_letter_url: TEXT
  group_photo_url: TEXT
  registration_date: TIMESTAMP
  status: VARCHAR(20)
}

-- Players Table
players {
  id: UUID PRIMARY KEY
  team_id: UUID FOREIGN KEY
  name: VARCHAR(100)
  role: VARCHAR(50)
  aadhar_file_url: TEXT
  subscription_file_url: TEXT
}

-- Matches Table
matches {
  id: INTEGER PRIMARY KEY
  round: VARCHAR(50)
  round_number: INTEGER
  match_number: INTEGER
  team1: VARCHAR(100)
  team2: VARCHAR(100)
  status: VARCHAR(20)
  scheduled_start_time: TIMESTAMP
  actual_start_time: TIMESTAMP
  match_end_time: TIMESTAMP
  team1_first_innings_score: INTEGER
  team2_first_innings_score: INTEGER
  winner: VARCHAR(100)
}
```

## Technology Stack Diagram

```
┌─────────────────────────────────────────────┐
│           Frontend Technologies              │
├─────────────────────────────────────────────┤
│ React 18.3.1        │ Component Framework  │
│ TypeScript 5.3      │ Type Safety          │
│ Vite 5.4           │ Build Tool           │
│ Tailwind CSS 3.4   │ Styling              │
│ Framer Motion 11   │ Animations           │
│ GSAP 3.13          │ Advanced Animations  │
│ React Router 6     │ Routing              │
│ Axios 1.13         │ HTTP Client          │
│ Lucide React       │ Icons                │
│ Canvas Confetti    │ Celebrations         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│           Development Tools                  │
├─────────────────────────────────────────────┤
│ ESLint             │ Code Linting         │
│ Jest               │ Unit Testing         │
│ Playwright         │ E2E Testing          │
│ TypeScript         │ Type Checking        │
└─────────────────────────────────────────────┘
```

---

*This architecture supports scalability, maintainability, and optimal performance.*
