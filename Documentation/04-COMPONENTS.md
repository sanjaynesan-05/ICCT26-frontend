# 🧩 ICCT26 Component Documentation

## Component Architecture

The ICCT26 application follows a component-based architecture with reusable, modular components organized by functionality.

## Component Categories

### 1. Layout Components
### 2. Feature Components
### 3. UI Components
### 4. Admin Components
### 5. Page Components

---

## 1. Layout Components

### Navbar Component

**File**: [`src/components/Navbar.tsx`](../src/components/Navbar.tsx)

**Purpose**: Main navigation header for the application

**Features**:
- Responsive mobile menu with hamburger icon
- Active route highlighting
- Smooth scroll-to-top on navigation
- Sticky header on desktop
- Glass-morphism design

**Props**: None (uses React Router for navigation)

**State**:
```typescript
const [isOpen, setIsOpen] = useState(false) // Mobile menu toggle
```

**Navigation Links**:
- Home (/)
- Registration (/registration)
- Schedule (/schedule)
- Gallery (/gallery)
- Rules (/rules)
- Contact (/contact)

---

### Footer Component

**File**: [`src/components/Footer.tsx`](../src/components/Footer.tsx)

**Purpose**: Site-wide footer with branding and links

**Features**:
- Organized information
- Social media links
- Copyright information
- Responsive design
- Quick links to important pages

**Sections**:
1. About section with tournament description
2. Quick links (Registration, Schedule, Rules)
3. Contact information
4. Social media icons

---

## 2. Feature Components

### CricketLoader Component

**File**: [`src/components/CricketLoader.tsx`](../src/components/CricketLoader.tsx)

**Purpose**: Animated loading screen shown on first visit

**Features**:
- Multi-phase animation sequence
- Progress bar (4.5 seconds)
- Countdown animation (3, 2, 1)
- "GET READY!" flash
- Confetti celebration
- GSAP animations for smooth transitions

**Props**:
```typescript
interface Props {
  onComplete: () => void // Callback when animation completes
}
```

**Animation Timeline**:
1. Progress bar: 0% → 100% (4.5s)
2. Countdown: 3 → 2 → 1 (4.5s total)
3. Flash: "GET READY!" (1s)
4. Confetti burst (0.5s)

---

### Countdown Component

**File**: [`src/components/Countdown.tsx`](../src/components/Countdown.tsx)

**Purpose**: Live countdown to tournament start date

**Features**:
- Real-time updates every second
- Days, hours, minutes, seconds display
- Glass-morphism card design
- Responsive grid layout
- Animated transitions

**Props**:
```typescript
interface Props {
  targetDate: string // ISO date string
}
```

**State**:
```typescript
const [timeLeft, setTimeLeft] = useState({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})
```

---

### RegistrationCountdown Component

**File**: [`src/components/RegistrationCountdown.tsx`](../src/components/RegistrationCountdown.tsx)

**Purpose**: Countdown specifically for registration deadline

**Features**:
- Separate countdown for registration close
- Different styling from tournament countdown
- Urgency indicators as deadline approaches
- Auto-updates every second

---

### FileUpload Component

**File**: [`src/components/FileUpload.tsx`](../src/components/FileUpload.tsx)

**Purpose**: Reusable file upload component with drag-and-drop

**Features**:
- Drag and drop support
- Click to browse
- File type validation (images, PDFs)
- File size validation (max 5MB)
- Preview for uploaded files
- Remove file option
- Visual feedback states (idle, drag-over, uploading, success, error)

**Props**:
```typescript
interface FileUploadProps {
  label: string
  accept: string // MIME types (e.g., "image/*,.pdf")
  maxSize?: number // in MB
  file: File | null
  onChange: (file: File | null) => void
  error?: string
  required?: boolean
  helpText?: string
}
```

**Validation**:
- File type checking against accept prop
- Size limit enforcement
- Visual error display

---

### PlayerFormCard Component

**File**: [`src/components/PlayerFormCard.tsx`](../src/components/PlayerFormCard.tsx)

**Purpose**: Form card for individual player information entry

**Features**:
- Player name input
- Role selection dropdown (Batsman, Bowler, All-rounder, Wicket Keeper)
- Aadhar card file upload
- Subscription proof file upload
- Remove player button
- Real-time validation
- Collapsible/expandable design

**Props**:
```typescript
interface PlayerFormCardProps {
  index: number
  player: PlayerData
  onChange: (index: number, field: string, value: any) => void
  onRemove: (index: number) => void
  isRemovable: boolean
}

interface PlayerData {
  name: string
  role: string
  aadharFile: File | null
  subscriptionFile: File | null
}
```

---

### ProgressBar Component

**File**: [`src/components/ProgressBar.tsx`](../src/components/ProgressBar.tsx)

**Purpose**: Visual progress indicator for multi-step processes

**Features**:
- Animated progress bar
- Percentage display
- Status message
- Color coding (processing, success, error)
- Smooth transitions

**Props**:
```typescript
interface ProgressBarProps {
  progress: number // 0-100
  status?: 'processing' | 'success' | 'error'
  message?: string
}
```

**DetailedProgressBar Variant**:
```typescript
interface DetailedProgressBarProps {
  current: number // Current step
  total: number // Total steps
  label?: string
}
```

---

### SearchableSelect Component

**File**: [`src/components/SearchableSelect.tsx`](../src/components/SearchableSelect.tsx)

**Purpose**: Searchable dropdown for church selection

**Features**:
- Real-time search filtering
- Keyboard navigation
- Accessibility (ARIA labels)
- Church capacity indicator
- Locked church indication
- Highlight matching text

**Props**:
```typescript
interface SearchableSelectProps {
  options: string[] // List of church names
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  churchAvailability?: ChurchAvailability[]
}
```

---

### ImageCarousel Component

**File**: [`src/components/ImageCarousel.tsx`](../src/components/ImageCarousel.tsx)

**Purpose**: Sponsor logo carousel on home page

**Features**:
- Auto-scrolling animation
- Infinite loop
- Responsive sizing
- Smooth transitions
- Hover pause

**Props**:
```typescript
interface ImageCarouselProps {
  images: string[] // Array of image URLs
  autoScroll?: boolean
  scrollSpeed?: number // in seconds
}
```

---

### SchedulePreview Component

**File**: [`src/components/SchedulePreview.tsx`](../src/components/SchedulePreview.tsx)

**Purpose**: Preview of upcoming matches on home page

**Features**:
- Shows next 3-5 upcoming matches
- Match cards with team info
- Status badges (scheduled, live, completed)
- Link to full schedule
- Responsive grid

---

### FloatingTeamsWidget Component

**File**: [`src/components/FloatingTeamsWidget.tsx`](../src/components/FloatingTeamsWidget.tsx)

**Purpose**: Floating button showing total registered teams

**Features**:
- Fixed position widget
- Live team count
- Smooth animations
- Click to navigate to admin
- Pulsing effect for attention

---

### AnnouncementTicker Component

**File**: [`src/components/AnnouncementTicker.tsx`](../src/components/AnnouncementTicker.tsx)

**Purpose**: Scrolling ticker for important announcements

**Features**:
- Auto-scrolling text
- Infinite loop
- Pause on hover
- Icon support
- Customizable speed

---

## 3. UI Components

### ErrorBoundary Component

**File**: [`src/components/ErrorBoundary.tsx`](../src/components/ErrorBoundary.tsx)

**Purpose**: Catch and handle React errors gracefully

**Features**:
- Error catching at component level
- Fallback UI display
- Error logging
- Reset functionality
- User-friendly error messages

**Usage**:
```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**State**:
```typescript
interface State {
  hasError: boolean
  error: Error | null
}
```

---

### ProtectedRoute Component

**File**: [`src/components/ProtectedRoute.tsx`](../src/components/ProtectedRoute.tsx)

**Purpose**: Protect admin routes from unauthorized access

**Features**:
- Authentication check
- Automatic redirect to login
- Children rendering on success

**Props**:
```typescript
interface ProtectedRouteProps {
  children: ReactNode
}
```

**Logic**:
```typescript
const { isAuthenticated } = useAdmin()
if (!isAuthenticated) {
  return <Navigate to="/admin/login" replace />
}
return <>{children}</>
```

---

## 4. Admin Components

### AdminLogin Component

**File**: [`src/pages/admin/AdminLogin.tsx`](../src/pages/admin/AdminLogin.tsx)

**Purpose**: Authentication page for admin access

**Features**:
- Username/password form
- Credential validation
- Session management
- Error messaging
- Redirect on success

**State**:
```typescript
const [credentials, setCredentials] = useState({
  username: '',
  password: ''
})
const [error, setError] = useState('')
```

**Credentials** (Demo):
- Username: `admin`
- Password: `admin123`

---

### AdminDashboard Component

**File**: [`src/pages/admin/AdminDashboard.tsx`](../src/pages/admin/AdminDashboard.tsx)

**Purpose**: Main admin control panel

**Features**:
- Statistics overview cards
- Teams table with search/filter
- Matches management
- Quick actions
- Export functionality (Excel/CSV)
- Real-time data updates

**Sections**:
1. **Statistics Cards**:
   - Total Teams
   - Total Players
   - Completed Matches
   - Upcoming Matches

2. **Teams Management**:
   - Searchable table
   - Filter by church
   - View team details
   - Player count
   - Status indicators

3. **Match Management**:
   - Update scores
   - Change status
   - View details
   - Link to schedule manager

**State**:
```typescript
const [teams, setTeams] = useState<Team[]>([])
const [matches, setMatches] = useState<Match[]>([])
const [loading, setLoading] = useState(true)
const [searchTerm, setSearchTerm] = useState('')
```

---

### TeamDetail Component

**File**: [`src/pages/admin/TeamDetail.tsx`](../src/pages/admin/TeamDetail.tsx)

**Purpose**: Detailed view of a specific team

**Features**:
- Full team information
- Captain and vice-captain details
- Player list with roles
- Uploaded documents view
- Payment receipt verification
- Edit capabilities
- Status management

**Route**: `/admin/team/:teamId`

---

### PlayerDetail Component

**File**: [`src/pages/admin/PlayerDetail.tsx`](../src/pages/admin/PlayerDetail.tsx)

**Purpose**: Detailed view of individual player

**Features**:
- Player information
- Document verification
- Aadhar card view
- Subscription proof view
- Approval/rejection workflow

**Route**: `/admin/player/:playerId`

---

### ScheduleManager Component

**File**: [`src/pages/admin/ScheduleManager.tsx`](../src/pages/admin/ScheduleManager.tsx)

**Purpose**: Comprehensive match schedule management

**Features**:
- All matches view
- Filter by round/status
- Update match details
- Score entry (runs/wickets format)
- Toss information
- Time management
- Result recording
- Bulk operations

**Match Update Fields**:
- Toss winner
- Toss choice (Bat/Bowl)
- First innings team
- Team scores (XXX/X format)
- Match result (winner + margin)
- Start/end times
- External scorecard URL

---

## 5. Page Components

### Home Component

**File**: [`src/pages/Home.tsx`](../src/pages/Home.tsx)

**Purpose**: Landing page with tournament overview

**Sections**:
1. **Hero Section**:
   - Tournament branding
   - Church logos
   - Tagline

2. **Countdowns**:
   - Tournament countdown
   - Registration countdown

3. **Highlights**:
   - Tournament features
   - Prize pool
   - Participating teams

4. **Schedule Preview**:
   - Upcoming matches

5. **Sponsor Carousel**:
   - Rotating sponsor logos

6. **Call-to-Action**:
   - Register now button
   - View schedule button

---

### Registration Component

**File**: [`src/pages/Registration.tsx`](../src/pages/Registration.tsx)

**Purpose**: Team registration form (1674 lines)

**Features**:
- Multi-step wizard (5 steps)
- Comprehensive validation
- File upload with progress
- Idempotency support
- Retry mechanism
- Church capacity checking
- Real-time error display
- Success confirmation with confetti

**Steps**:
1. Basic Information (Church, Team Name, Documents)
2. Captain Information
3. Vice Captain Information
4. Player Information (11-15 players)
5. Payment Information

**Validation Features**:
- Name: 2-50 characters, letters only
- Email: RFC 5322 compliant
- Phone: Exactly 10 digits
- Files: Type and size validation
- Team name: Uniqueness check
- Church: Capacity limit (2 teams max)

---

### Schedule Component

**File**: [`src/pages/Schedule.tsx`](../src/pages/Schedule.tsx)

**Purpose**: Tournament match schedule display

**Features**:
- All matches list
- Filter by round
- Filter by status
- Filter by date
- Match cards with details
- Live status indicators
- Score display (runs/wickets)
- Expandable match details

**Match Information**:
- Teams
- Date and time
- Venue
- Status badge
- Score (if applicable)
- Round information

---

### Gallery Component

**File**: [`src/pages/Gallery.tsx`](../src/pages/Gallery.tsx)

**Purpose**: Photo gallery from tournament

**Features**:
- Masonry grid layout
- Cloudinary CDN integration
- Lazy loading
- Lightbox view
- Download capability
- Responsive columns (1-4)
- Smooth animations

**Layout**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

---

### Rules Component

**File**: [`src/pages/Rules.tsx`](../src/pages/Rules.tsx)

**Purpose**: Tournament rules and regulations

**Features**:
- Accordion-style display
- Searchable rules
- Categorized sections
- Print-friendly format

**Rule Categories**:
- Match format
- Team composition
- Player eligibility
- Scoring system
- Code of conduct

---

### Contact Component

**File**: [`src/pages/Contact.tsx`](../src/pages/Contact.tsx)

**Purpose**: Contact information and venue details

**Features**:
- Organizer contact cards
- Social media links
- Venue information
- Embedded map
- Email/phone links

**Sections**:
1. Organizers list
2. Social media
3. Venue details
4. Map integration

---

## Component Naming Conventions

### File Naming
- PascalCase for component files
- Match component name: `Navbar.tsx` exports `Navbar`

### Component Structure
```typescript
// 1. Imports
import { useState } from 'react'
import { motion } from 'framer-motion'

// 2. Types/Interfaces
interface ComponentProps {
  // props definition
}

// 3. Component Definition
const ComponentName = ({ props }: ComponentProps) => {
  // 4. State
  const [state, setState] = useState()
  
  // 5. Effects
  useEffect(() => {}, [])
  
  // 6. Handlers
  const handleAction = () => {}
  
  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

// 8. Export
export default ComponentName
```

### Props Pattern
- Use TypeScript interfaces
- Destructure in parameter
- Provide defaults where appropriate
- Document complex props

### State Management
- Local state with `useState`
- Global state with Context API
- Form state with controlled components

---

## Component Reusability

### Highly Reusable
- `FileUpload` - Used across registration form
- `ProgressBar` - Used for uploads and loading
- `SearchableSelect` - Can be used for any dropdown
- `ErrorBoundary` - Wraps entire app

### Page-Specific
- `PlayerFormCard` - Registration only
- `SchedulePreview` - Home page only
- `FloatingTeamsWidget` - Specific feature

### Layout Components
- `Navbar` - Global header
- `Footer` - Global footer

---

## Component Performance

### Optimization Techniques
1. **Memoization**:
   - `useMemo` for expensive calculations
   - `useCallback` for handlers passed as props

2. **Lazy Loading**:
   - Route-based code splitting
   - Image lazy loading

3. **Virtualization**:
   - Large lists (teams, players)
   - Scroll-based rendering

4. **Debouncing**:
   - Search inputs
   - Auto-save functionality

---

*Complete component reference for ICCT26 application*
