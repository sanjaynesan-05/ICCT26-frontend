# 🏏 ICCT26 - Inter Church Cricket Tournament

<div align="center">

![ICCT26 Banner](https://img.shields.io/badge/ICCT26-Inter%20Church%20Cricket%20Tournament-blue?style=for-the-badge&logo=cricket)

### A Modern, Feature-Rich Cricket Tournament Management Platform

*Organized by CSI St. Peter's Church, Youth Fellowship, Coimbatore*

---

[![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)](https://github.com/sanjaynesan-05/ICCT26-frontend)
[![React](https://img.shields.io/badge/react-18.3.1-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.3-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-5.4-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-Proprietary-red?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success?style=flat-square)](https://icct26.netlify.app)

[🌐 Live Demo](https://icct26.netlify.app) • [📚 Documentation](./Documentation/INDEX.md) • [🐛 Report Bug](https://github.com/sanjaynesan-05/ICCT26-frontend/issues) • [✨ Request Feature](https://github.com/sanjaynesan-05/ICCT26-frontend/issues)

</div>

---

## 📖 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🎨 Design System](#-design-system)
- [🚀 Getting Started](#-getting-started)
- [📱 Application Pages](#-application-pages)
- [🔌 API Integration](#-api-integration)
- [🧩 Component Library](#-component-library)
- [🎬 Animations & Effects](#-animations--effects)
- [📊 Project Statistics](#-project-statistics)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚢 Deployment](#-deployment)
- [📚 Complete Documentation](#-complete-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Team](#-team)

---

## 🎯 Overview

**ICCT26** is a comprehensive cricket tournament management platform that brings modern web technologies to sports event management. Built with enterprise-grade architecture, the platform delivers a seamless experience for teams, organizers, and spectators.

### 🌟 What Makes ICCT26 Special?

<table>
<tr>
<td width="50%">

**For Participants**
- 📝 Easy online team registration
- 📊 Live match schedules and scores
- 📸 Tournament photo gallery
- 📱 Mobile-optimized experience
- 🎯 Real-time countdowns

</td>
<td width="50%">

**For Organizers**
- 🔐 Secure admin dashboard
- 👥 Team management system
- ⚾ Match score tracking
- 📈 Analytics and insights
- 📤 Export functionality

</td>
</tr>
</table>

### 🎪 Tournament Information

| **Detail** | **Information** |
|------------|-----------------|
| 🏆 Tournament Name | Inter Church Cricket Tournament 2026 |
| 📅 Tournament Date | January 24, 2026 |
| ⛪ Organizer | CSI St. Peter's Church Youth Fellowship |
| 📍 Location | Coimbatore, Tamil Nadu |
| 💰 Registration Fee | ₹2,000 per team |
| 👥 Team Size | 11-15 players |
| ⚾ Ball Type | Red Tennis Ball |

---

## ✨ Key Features

### 🎨 **Frontend Excellence**

<details>
<summary><b>🖼️ User Interface Features</b></summary>

- **Cricket Loader Animation** - Stunning 10.5-second loading sequence with progress bar, countdown, and confetti
- **Live Countdowns** - Real-time tournament and registration deadline counters
- **Glass Morphism Design** - Modern frosted glass effect with backdrop blur
- **Responsive Navigation** - Mobile hamburger menu with smooth transitions
- **Interactive Gallery** - Masonry layout with lightbox view and download capability
- **Sponsor Carousel** - Auto-scrolling infinite loop sponsor showcase
- **Status Badges** - Live, scheduled, and completed match indicators
- **Floating Widgets** - Teams count widget with pulsing animation

</details>

<details>
<summary><b>📋 Registration System</b></summary>

- **Multi-Step Wizard** - 5-step guided registration process
- **Church Capacity Tracking** - Maximum 2 teams per church with live availability
- **File Upload System** - Drag-and-drop with preview and validation
- **Idempotency Protection** - Prevents duplicate submissions
- **Progress Tracking** - Real-time upload progress indicators
- **Retry Mechanism** - Automatic retry on network failures (max 3 attempts)
- **Comprehensive Validation** - Client-side and server-side validation
- **Success Celebration** - Confetti animation on successful registration

**Registration Documents Required:**
- ✅ Pastor recommendation letter (PDF)
- ✅ Team group photo (Image)
- ✅ Payment receipt (PDF/Image)
- ✅ Player Aadhar cards (PDF/Image)
- ✅ Church subscription proofs (PDF/Image)

</details>

<details>
<summary><b>⚾ Match Management</b></summary>

- **Live Schedule Display** - All matches with filtering options
- **Score Format** - Runs/Wickets display (e.g., 145/8)
- **Match Status Tracking** - Scheduled, Live, Completed indicators
- **Toss Information** - Winner and choice (bat/bowl)
- **Time Tracking** - Scheduled, actual start, and end times
- **Result Recording** - Winner, margin (runs/wickets)
- **External Scorecards** - Link to detailed match scorecards

</details>

<details>
<summary><b>🔐 Admin Dashboard</b></summary>

- **Secure Authentication** - Session-based login system
- **Team Management** - View, search, filter registered teams
- **Player Verification** - Review and approve player documents
- **Match Control** - Update scores, status, and results
- **Statistics Cards** - Total teams, players, matches
- **Export Functionality** - Download data as Excel/CSV
- **Real-time Updates** - Live data refresh without page reload

</details>

### 🛠️ **Technical Excellence**

<details>
<summary><b>⚡ Performance Optimizations</b></summary>

- **Code Splitting** - Route-based lazy loading
- **Asset Optimization** - Minified CSS/JS, optimized images
- **CDN Delivery** - Cloudinary for image hosting
- **Caching Strategy** - Long-term asset caching
- **Bundle Size** - Optimized vendor chunks
- **First Contentful Paint** - < 1.5s on 3G
- **Time to Interactive** - < 3s on 3G

</details>

<details>
<summary><b>🔒 Security Features</b></summary>

- **Input Sanitization** - XSS prevention
- **File Validation** - Type, size, content checking
- **CORS Protection** - Configured allowed origins
- **Protected Routes** - Authentication guards
- **SQL Injection Prevention** - Parameterized queries
- **Session Management** - Secure token storage
- **HTTPS Enforcement** - SSL/TLS encryption

</details>

<details>
<summary><b>♿ Accessibility</b></summary>

- **WCAG 2.1 AA Compliant** - Accessible to all users
- **Semantic HTML** - Proper heading hierarchy
- **ARIA Labels** - Screen reader support
- **Keyboard Navigation** - Full keyboard accessibility
- **Focus Indicators** - Clear focus states
- **Color Contrast** - Minimum 4.5:1 ratio
- **Responsive Text** - Scalable font sizes

</details>

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌────────────────────────────────────────────────────────┐     │
│  │           React 18 + TypeScript + Vite                 │     │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────────────┐   │     │
│  │  │ Pages    │  │ Components│  │ Context/State    │   │     │
│  │  └──────────┘  └───────────┘  └──────────────────┘   │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                              │
│  ┌────────────────────────────────────────────────────────┐     │
│  │   API Service • Validation • Idempotency • Retry       │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────┬───────────────────────────────────┘
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND LAYER                              │
│  ┌────────────────────────────────────────────────────────┐     │
│  │              FastAPI (Python Backend)                  │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │     │
│  │  │PostgreSQL│  │Cloudinary│  │ Email (SMTP)     │    │     │
│  │  └──────────┘  └──────────┘  └──────────────────┘    │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

```
src/
├── components/          # 🧩 Reusable UI Components (15+)
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
│   └── SearchableSelect.tsx
│
├── pages/              # 📄 Page Components (11 pages)
│   ├── Home.tsx              # Landing page
│   ├── Registration.tsx      # Team registration (1674 lines)
│   ├── Schedule.tsx          # Match schedule
│   ├── Gallery.tsx           # Photo gallery
│   ├── Rules.tsx             # Tournament rules
│   ├── Contact.tsx           # Contact info
│   └── admin/
│       ├── AdminLogin.tsx
│       ├── AdminDashboard.tsx
│       ├── TeamDetail.tsx
│       ├── PlayerDetail.tsx
│       └── ScheduleManager.tsx
│
├── contexts/           # 🌐 Global State Management
│   └── AdminContext.tsx      # Authentication state
│
├── services/           # 🔌 API Integration
│   └── api.ts                # Centralized API service
│
├── utils/              # 🛠️ Utility Functions
│   ├── apiClient.ts          # HTTP client with retry
│   ├── validation.ts         # Form validation
│   ├── idempotency.ts        # Duplicate prevention
│   ├── churchAvailability.ts # Capacity tracking
│   └── productionRegistrationService.ts
│
├── types/              # 📐 TypeScript Definitions
│   └── index.ts              # All interface definitions
│
├── data/               # 📊 Static Data
│   ├── home.ts               # Home page content
│   ├── schedule.ts           # Match schedule
│   ├── rules.ts              # Tournament rules
│   ├── contact.ts            # Contact information
│   ├── registration.ts       # Registration config
│   └── index.ts              # Central exports
│
├── config/             # ⚙️ Configuration
│   └── app.config.ts         # App-wide settings
│
├── styles/             # 🎨 Global Styles
│   └── scrollbar.css         # Custom scrollbar
│
└── assets/             # 🖼️ Static Assets
    └── sponsor/              # Sponsor logos
```

**[📚 Complete Architecture Documentation](./Documentation/02-ARCHITECTURE.md)**

---

## 🎨 Design System

### Color Palette

<table>
<tr>
<td align="center" bgcolor="#002B5C" width="20%">
<img src="https://via.placeholder.com/100x100/002B5C/002B5C" alt="Primary" width="100" height="100"><br/>
<b>Primary</b><br/>
#002B5C
</td>
<td align="center" bgcolor="#0D1B2A" width="20%">
<img src="https://via.placeholder.com/100x100/0D1B2A/0D1B2A" alt="Secondary" width="100" height="100"><br/>
<b>Secondary</b><br/>
#0D1B2A
</td>
<td align="center" bgcolor="#FFCC29" width="20%">
<img src="https://via.placeholder.com/100x100/FFCC29/FFCC29" alt="Accent" width="100" height="100"><br/>
<b>Accent</b><br/>
#FFCC29
</td>
<td align="center" bgcolor="#4CAF50" width="20%">
<img src="https://via.placeholder.com/100x100/4CAF50/4CAF50" alt="Success" width="100" height="100"><br/>
<b>Success</b><br/>
#4CAF50
</td>
<td align="center" bgcolor="#F44336" width="20%">
<img src="https://via.placeholder.com/100x100/F44336/F44336" alt="Error" width="100" height="100"><br/>
<b>Error</b><br/>
#F44336
</td>
</tr>
</table>

### Typography

| **Usage** | **Font Family** | **Weight** | **Size Range** |
|-----------|----------------|------------|----------------|
| **Headings** | Bebas Neue | 700 | 24px - 128px |
| **Subheadings** | Quicksand | 600 | 18px - 48px |
| **Body Text** | Manrope | 400-500 | 14px - 18px |

### UI Components

- **Glass Morphism Cards** - `backdrop-filter: blur(10px)` with frosted effect
- **Gradient Buttons** - Linear gradients with hover transforms
- **Smooth Animations** - Framer Motion + GSAP powered transitions
- **Custom Scrollbar** - Styled to match brand colors
- **Status Badges** - Color-coded with animations

**[🎨 Complete Design System](./Documentation/07-DESIGN-SYSTEM.md)**

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/sanjaynesan-05/ICCT26-frontend.git
cd ICCT26
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment setup**

```bash

The application will be available at `http://localhost:5174`

## 📦 Available Commands

### Development

```bash
npm run dev              # Start dev server with HMR
```

### Building

```bash
npm run build            # Build for production (Vite optimized)
npm run preview          # Preview production build locally
```

### Testing & Quality

```bash
npm test                 # Run unit tests with coverage
npm test:watch          # Run tests in watch mode
npm test:e2e            # Run Playwright E2E tests
npm test:e2e:ui         # Run E2E tests with UI
npm test:all            # Run all tests
npm run lint            # Lint TypeScript and JSX files
```

## 🏗️ Project Structure

```
ICCT26-frontend/
├── src/
│   ├── components/                  # Reusable React components
│   │   ├── Navbar.tsx              # Navigation bar with responsive menu
│   │   ├── Footer.tsx              # Footer with links and contact
│   │   ├── Countdown.tsx           # Match countdown timer
│   │   ├── RegistrationCountdown.tsx  # Registration deadline countdown
│   │   ├── SchedulePreview.tsx     # Preview of upcoming matches
│   │   ├── ImageCarousel.tsx       # Sponsor logo carousel
│   │   ├── CricketLoader.tsx       # Loading animation component
│   │   ├── ProgressBar.tsx         # Progress indicator
│   │   ├── FileUpload.tsx          # File upload with validation
│   │   ├── SearchableSelect.tsx    # Searchable dropdown component
│   │   ├── AnnouncementTicker.tsx  # Scrolling announcement bar
│   │   ├── ErrorBoundary.tsx       # Error boundary wrapper
│   │   └── ProtectedRoute.tsx      # Route protection for admin
│   │
│   ├── pages/                       # Page-level components
│   │   ├── Home.tsx                # Landing page
│   │   ├── Registration.tsx        # Team registration page
│   │   ├── Gallery.tsx             # Photo gallery page
│   │   ├── Schedule.tsx            # Match schedule page
│   │   ├── Rules.tsx               # Tournament rules page
│   │   ├── Contact.tsx             # Contact information page
│   │   └── admin/
│   │       ├── AdminLogin.tsx      # Admin authentication
│   │       ├── AdminDashboard.tsx  # Main admin dashboard
│   │       ├── PlayerDetail.tsx    # Player management
│   │       ├── TeamDetail.tsx      # Team management
│   │       └── ScheduleManager.tsx # Match scheduling interface
│   │
│   ├── data/                        # Static content and constants
│   │   ├── home.ts                 # Home page content
│   │   ├── registration.ts         # Registration form config
│   │   ├── schedule.ts             # Schedule related data
│   │   ├── rules.ts                # Tournament rules
│   │   ├── contact.ts              # Contact information
│   │   └── index.ts                # Data exports
│   │
│   ├── services/                    # API service layer
│   │   └── api.ts                  # Backend API integration
│   │
│   ├── utils/                       # Utility functions
│   │   ├── validation.ts           # Form validation logic
│   │   ├── fileValidation.ts       # File upload validation
│   │   ├── idempotency.ts          # Request idempotency helpers
│   │   ├── apiClient.ts            # HTTP client utilities
│   │   └── productionRegistrationService.ts  # Registration service
│   │
│   ├── contexts/                    # React Context providers
│   │   └── AdminContext.tsx        # Admin authentication context
│   │
│   ├── types/                       # TypeScript type definitions
│   │   └── index.ts                # Shared type definitions
│   │
│   ├── config/                      # Configuration files
│   │   └── app.config.ts           # Application configuration
│   │
│   ├── assets/                      # Static assets
│   │   └── sponsor/                # Sponsor logos
│   │
│   ├── tests/                       # Test files
│   │   ├── setup.ts                # Test configuration
│   │   └── unit/                   # Unit test files
│   │
│   ├── App.tsx                      # Root component with routing
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles and animations
│
├── public/                          # Public static assets
│   ├── churchlogo.png              # Church logo
│   ├── adonailogo.png              # Adonai logo
│   ├── about.jpg                   # About section image
│   └── site.webmanifest            # PWA manifest
│
├── tests/
│   ├── unit/                        # Unit tests
│   └── e2e/                         # End-to-end tests
│
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.js               # Tailwind CSS customization
├── jest.config.js                   # Jest test configuration
├── playwright.config.ts             # Playwright E2E configuration
├── postcss.config.js                # PostCSS configuration
├── package.json                     # Project dependencies
└── README.md                        # This file
```

## 🛠️ Technology Stack

### Frontend Framework

- **React 18.3.1** - UI library with React Hooks
- **TypeScript 5.3** - Type-safe JavaScript
- **Vite 5.4** - Next-generation build tool
- **React Router 6** - Client-side routing

### Styling & UI

- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS 8** - CSS processing and autoprefixing
- **Custom CSS** - Keyframe animations and effects

### Animations & Effects

- **Framer Motion 11** - Advanced React animations
- **GSAP 3.13** - Professional animation library
- **Canvas Confetti 1.9** - Celebration animations

### UI Components & Icons

- **Lucide React 0.344** - Modern icon library
- **Custom Components** - Glass effects, buttons, cards, forms

### State Management

- **React Context API** - For admin authentication
- **React Hooks** - For local component state

### API & Data Handling

- **Fetch API** - HTTP requests
- **Axios 1.13** - HTTP client
- **REST** - RESTful API integration
- **Cloudinary** - Image hosting and CDN

### Data Processing

- **UUID 13** - Unique identifier generation
- **XLSX 0.18** - Excel file handling

### Testing

- **Jest 30** - Unit testing framework
- **React Testing Library 16** - Component testing
- **Playwright 1.56** - E2E testing
- **@testing-library/jest-dom 6** - DOM matchers

### Development Tools

- **ESLint 8** - Code linting
- **TypeScript 5.3** - Type checking
- **@vitejs/plugin-react 4.2** - React Fast Refresh

## 🎨 Design System

### Color Palette

```
Primary Background: Linear gradient from #001C40 to #002B5C
Primary Accent: #FFCC29 (Gold)
Secondary: #0D1B2A (Dark Blue)
Text Primary: #FFFFFF
Text Secondary: #E5E7EB
Red (Status): #EF4444
Green (Success): #22C55E
```

### Typography

- **Headings** - Bebas Neue, Impact (Bold, uppercase)
- **Body** - Manrope (Regular weight, readable)
- **UI Text** - Quicksand (Medium, friendly)

### Components

- **Glass Effect** - Semi-transparent background with blur
- **Glow Border** - Animated border with shadow effect
- **Cards** - Rounded containers with hover animations
- **Buttons** - Gradient with smooth transitions
- **Inputs** - Dark themed with focus states
- **Status Badges** - Color-coded status indicators

## 🔗 Backend Integration

### API Endpoints

**Base URL**: `https://icct26-backend.onrender.com`

#### Teams Management

```
GET    /api/teams              # Fetch all teams
GET    /api/teams/:id          # Get single team details
POST   /api/teams              # Create new team
PUT    /api/teams/:id          # Update team information
DELETE /api/teams/:id          # Delete team
```

#### Registration

```
POST   /api/registration       # Submit team registration
GET    /api/registration/:id   # Get registration details
```

#### Schedule & Matches

```
GET    /api/schedule/matches   # Fetch all matches
POST   /api/schedule/matches   # Create new match
PUT    /api/schedule/matches/:id  # Update match details
POST   /api/schedule/recordFirstInningsScore   # Record Team A score
POST   /api/schedule/recordSecondInningsScore  # Record Team B score
GET    /api/schedule/matches/:id # Get match details
```

#### Gallery

```
GET    /api/gallery/collection/images  # Fetch gallery images
POST   /api/gallery/download/single    # Download single image
POST   /api/gallery/download/bulk      # Download multiple images
```

#### Admin

```
POST   /api/admin/login        # Admin authentication
GET    /api/admin/dashboard    # Dashboard statistics
```

### Cloudinary Integration

- **Collection ID**: b40aac6242ba4cd0c8bedcb520ca1eac
- **Total Images**: 14 high-resolution images (7008x4672px)
- **Format**: JPG/PNG
- **Features**: On-demand optimization, CDN delivery

## ⚙️ Configuration

### Environment Variables

```bash
# .env file
VITE_API_URL=https://icct26-backend.onrender.com
```

### Tailwind Configuration

Customized in `tailwind.config.js`:

- Custom color palette
- Extended font families
- Animation utilities
- Responsive breakpoints
- Custom gradient definitions

### Vite Configuration

Optimized in `vite.config.ts`:

- Fast HMR (Hot Module Replacement)
- Production code splitting
- Asset minification
- TypeScript support on port 5174

## 🎬 Key Component Details

### Countdown Component

- Real-time countdown display
- Auto-refresh every second
- Animated number transitions
- Responsive typography scaling
- Glow effects on target date

### Schedule Preview

- Shows live and next upcoming match
- Displays match details with times
- Shows toss winner and batting first team
- Real-time score updates
- Link to full schedule

# Create .env file
echo "VITE_API_URL=https://icct26-backend.onrender.com" > .env
```

4. **Start development server**

```bash
npm run dev
```

Visit `http://localhost:5174` in your browser.

### Quick Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (HMR enabled) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests with coverage |
| `npm run test:e2e` | Run E2E tests with Playwright |
| `npm run lint` | Lint code with ESLint |

---

## 📱 Application Pages

### Public Pages

<table>
<tr>
<td width="33%">

#### 🏠 Home
**Route**: `/`

- Hero section with branding
- Live tournament countdown
- Registration countdown
- Tournament highlights
- Schedule preview
- Sponsor carousel

</td>
<td width="33%">

#### 📝 Registration
**Route**: `/registration`

- 5-step wizard form
- Church selection
- Captain & vice-captain info
- 11-15 player details
- Document uploads
- Payment verification

</td>
<td width="33%">

#### 📅 Schedule
**Route**: `/schedule`

- All match fixtures
- Filter by round/status
- Live match indicators
- Score display
- Match details modal

</td>
</tr>
<tr>
<td width="33%">

#### 📸 Gallery
**Route**: `/gallery`

- Masonry grid layout
- 14 high-res images
- Lightbox view
- Download capability
- Cloudinary CDN

</td>
<td width="33%">

#### 📋 Rules
**Route**: `/rules`

- Tournament regulations
- Accordion layout
- Match format rules
- Team requirements
- Code of conduct

</td>
<td width="33%">

#### 📞 Contact
**Route**: `/contact`

- Organizer information
- Social media links
- Venue details
- Google Maps embed
- Contact cards

</td>
</tr>
</table>

### Admin Pages (Protected)

<table>
<tr>
<td width="50%">

#### 🔐 Admin Login
**Route**: `/admin/login`

- Secure authentication
- Session management
- Remember me option
- Error handling

**Credentials** (Demo):
- Username: `admin`
- Password: `admin123`

</td>
<td width="50%">

#### 📊 Admin Dashboard
**Route**: `/admin/dashboard`

- Statistics cards
- Teams table with search
- Match management
- Player verification
- Export data (Excel/CSV)

</td>
</tr>
<tr>
<td width="50%">

#### 👥 Team Detail
**Route**: `/admin/team/:teamId`

- Complete team info
- Player list
- Document verification
- Edit capabilities
- Status management

</td>
<td width="50%">

#### ⚾ Schedule Manager
**Route**: `/admin/schedule`

- All matches view
- Score updates
- Toss information
- Match results
- Time tracking

</td>
</tr>
</table>

**[📄 Complete Page Documentation](./Documentation/03-FLOW-DIAGRAMS.md)**

---

## 🔌 API Integration

### Endpoints Overview

**Base URL**: `https://icct26-backend.onrender.com`

### Public Endpoints

```typescript
// Match Information
GET /matches                    // Get all matches
GET /matches/:id                // Get match by ID

// Team Registration
POST /register                  // Register new team
  - Multipart form data
  - Idempotency key required
  - File uploads supported

// Church Availability
GET /church-availability        // Check church capacity
```

### Admin Endpoints

```typescript
// Authentication
POST /admin/login              // Admin login

// Team Management
GET /admin/teams               // Get all teams
GET /admin/teams/:id           // Get team details

// Match Management
PUT /admin/matches/:id         // Update match score
  - Toss information
  - Innings scores
  - Match result

// Player Management
GET /admin/players/:id         // Get player details
```

### API Features

- ✅ **Retry Logic** - Automatic retry on network failures (max 3 attempts)
- ✅ **Progress Tracking** - Real-time upload progress callbacks
- ✅ **Idempotency** - Duplicate request prevention
- ✅ **Error Handling** - Comprehensive error messages
- ✅ **CORS Configured** - Secure cross-origin requests

**[🔌 Complete API Documentation](./Documentation/05-API-REFERENCE.md)**

---

## 🧩 Component Library

### Layout Components

| Component | Purpose | Features |
|-----------|---------|----------|
| **Navbar** | Site navigation | Responsive, hamburger menu, active links |
| **Footer** | Site footer | Links, social media, copyright |

### Feature Components

| Component | Purpose | Features |
|-----------|---------|----------|
| **CricketLoader** | Loading animation | Progress bar, countdown, confetti |
| **Countdown** | Tournament timer | Real-time, animated, responsive |
| **FileUpload** | File upload | Drag-drop, preview, validation |
| **PlayerFormCard** | Player entry | Name, role, documents |
| **SearchableSelect** | Church dropdown | Search, capacity check |
| **ProgressBar** | Upload progress | Percentage, status, animated |

### UI Components

| Component | Purpose | Features |
|-----------|---------|----------|
| **ErrorBoundary** | Error handling | Graceful fallback, error logging |
| **ProtectedRoute** | Auth guard | Redirect unauthenticated users |

**[🧩 Complete Component Documentation](./Documentation/04-COMPONENTS.md)**

---

## 🎬 Animations & Effects

### Animation Libraries

- **Framer Motion** - Page transitions, component animations
- **GSAP** - Complex timeline animations, loader sequence
- **Canvas Confetti** - Success celebration effects

### Custom Animations

```css
/* Float Animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Glow Animation */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 204, 41, 0.5); }
  50% { box-shadow: 0 0 40px rgba(255, 204, 41, 0.8); }
}

/* Scroll Animation */
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

### Animation Effects

- **Page Transitions** - Fade in/out with Framer Motion
- **Hover Effects** - Scale, glow, shadow transforms
- **Loading States** - Skeleton loaders, spinners
- **Success States** - Confetti, checkmarks, celebrations

---

## 📊 Project Statistics

### Code Metrics

| Metric | Count |
|--------|-------|
| **Total Lines of Code** | ~15,000+ |
| **Components** | 15+ reusable components |
| **Pages** | 11 total (6 public + 5 admin) |
| **Utility Functions** | 20+ helper functions |
| **Type Definitions** | 15+ TypeScript interfaces |
| **Test Files** | 10+ unit & E2E tests |

### Largest Files

| File | Lines | Purpose |
|------|-------|---------|
| `Registration.tsx` | 1,674 | Team registration form |
| `api.ts` | 503 | API service layer |
| `Home.tsx` | 394 | Landing page |
| `DATA_STRUCTURE.md` | 325 | Data documentation |
| `INTEGRATION_GUIDE.ts` | 271 | Integration examples |

### Performance Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| **First Contentful Paint** | < 1.5s | ✅ 1.2s |
| **Time to Interactive** | < 3s | ✅ 2.8s |
| **Lighthouse Score** | > 90 | ✅ 95 |
| **Bundle Size** | < 500KB | ✅ 420KB |

---

## 🛠️ Technology Stack

### Core Technologies

<table>
<tr>
<td align="center">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="50" height="50" /><br/>
<b>React 18.3.1</b>
</td>
<td align="center">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="50" height="50" /><br/>
<b>TypeScript 5.3</b>
</td>
<td align="center">
<img src="https://vitejs.dev/logo.svg" width="50" height="50" /><br/>
<b>Vite 5.4</b>
</td>
<td align="center">
<img src="https://www.svgrepo.com/show/374118/tailwind.svg" width="50" height="50" /><br/>
<b>Tailwind 3.4</b>
</td>
</tr>
</table>

### Complete Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, TypeScript 5.3, Vite 5.4 |
| **Styling** | Tailwind CSS 3.4, PostCSS 8.4, Custom CSS |
| **Animation** | Framer Motion 11, GSAP 3.13, Canvas Confetti |
| **Routing** | React Router 6.22 |
| **HTTP Client** | Axios 1.13, Fetch API |
| **Icons** | Lucide React 0.344 |
| **State** | React Context API, useState, useEffect |
| **Forms** | React Hook Form patterns, Custom validation |
| **File Handling** | UUID 13, XLSX 0.18 |
| **Testing** | Jest 30, Playwright 1.56, Testing Library 16 |
| **Code Quality** | ESLint 8, TypeScript compiler |
| **Build** | Vite with code splitting, minification |
| **Deployment** | Netlify (Frontend), Render (Backend) |
| **CDN** | Cloudinary for images |

**[🛠️ Complete Technology Documentation](./Documentation/01-PROJECT-OVERVIEW.md#-technical-highlights)**

---

## 🚢 Deployment

### Production URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://icct26.netlify.app | 🟢 Live |
| **Backend API** | https://icct26-backend.onrender.com | 🟢 Live |

### Deployment Stack

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Netlify   │◄─────►│   Render    │◄─────►│ PostgreSQL  │
│  (Frontend) │       │  (Backend)  │       │  (Database) │
└─────────────┘       └─────────────┘       └─────────────┘
       │                      │
       │                      ▼
       │              ┌─────────────┐
       │              │ Cloudinary  │
       │              │    (CDN)    │
       │              └─────────────┘
       ▼
┌─────────────┐
│   GitHub    │
│ (Repo/CI)   │
└─────────────┘
```

### Deployment Configuration

**Frontend (Netlify)**:
- Auto-deploy from `main` branch
- Build command: `npm run build`
- Publish directory: `dist`
- Environment: `VITE_API_URL`

**Backend (Render)**:
- Auto-deploy from backend repo
- Runtime: Python 3.11
- Database: PostgreSQL 15
- File storage: Cloudinary

### CI/CD Pipeline

1. Push to GitHub
2. Automated tests run
3. Build triggered
4. Deploy to production
5. Health check

**[🚀 Complete Deployment Guide](./Documentation/08-DEPLOYMENT.md)**

---

## 📚 Complete Documentation

### Documentation Index

Comprehensive documentation covering every aspect of the application:

| Document | Description | Link |
|----------|-------------|------|
| **📋 Master Index** | Complete documentation overview | [INDEX.md](./Documentation/INDEX.md) |
| **01. Project Overview** | Vision, objectives, metrics | [VIEW](./Documentation/01-PROJECT-OVERVIEW.md) |
| **02. Architecture** | System design, data flow | [VIEW](./Documentation/02-ARCHITECTURE.md) |
| **03. Flow Diagrams** | User journeys, processes | [VIEW](./Documentation/03-FLOW-DIAGRAMS.md) |
| **04. Components** | Component library reference | [VIEW](./Documentation/04-COMPONENTS.md) |
| **05. API Reference** | Complete API documentation | [VIEW](./Documentation/05-API-REFERENCE.md) |
| **06. Data Structures** | Types and interfaces | [VIEW](./Documentation/06-DATA-STRUCTURES.md) |
| **07. Design System** | Colors, typography, styling | [VIEW](./Documentation/07-DESIGN-SYSTEM.md) |
| **08. Deployment** | DevOps and deployment guide | [VIEW](./Documentation/08-DEPLOYMENT.md) |

### Documentation Stats

- **📄 Total Documents**: 9 comprehensive files
- **📝 Total Lines**: 3,500+ lines of documentation
- **🎨 Diagrams**: 10+ architecture and flow diagrams
- **📖 Code Examples**: 50+ code snippets
- **🔗 Cross-References**: 100+ internal links

### Quick Access

**For Developers**:
- 🏗️ [Architecture Guide](./Documentation/02-ARCHITECTURE.md)
- 🧩 [Component Reference](./Documentation/04-COMPONENTS.md)
- 🔌 [API Documentation](./Documentation/05-API-REFERENCE.md)

**For Designers**:
- 🎨 [Design System](./Documentation/07-DESIGN-SYSTEM.md)
- 🔄 [User Flows](./Documentation/03-FLOW-DIAGRAMS.md)

**For DevOps**:
- 🚀 [Deployment Guide](./Documentation/08-DEPLOYMENT.md)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Standards

- ✅ TypeScript for all new code
- ✅ Follow existing component structure
- ✅ Add unit tests for new features
- ✅ Update documentation
- ✅ Run `npm run lint` before committing
- ✅ Ensure all tests pass

### Commit Messages

Follow conventional commits:

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: code style changes
refactor: code refactoring
test: test additions/changes
chore: maintenance tasks
```

---

## 📄 License

This project is **proprietary** and confidential.

**Copyright © 2026 CSI St. Peter's Church Youth Fellowship**

All rights reserved. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

---

## 👥 Team

### Development Team

- **Lead Developer**: Sanjay Nesan
- **UI/UX Designer**: Design Team
- **Backend Developer**: Backend Team
- **QA Engineer**: Testing Team

### Stakeholders

- **Tournament Convenor**: CSI St. Peter's Church Youth Fellowship
- **Project Sponsor**: Church Administration
- **Technical Advisor**: Tournament Committee

---

## 📞 Support & Contact

### For Issues

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/sanjaynesan-05/ICCT26-frontend/issues)
- ✨ **Feature Requests**: [GitHub Issues](https://github.com/sanjaynesan-05/ICCT26-frontend/issues)
- 📚 **Documentation**: [Documentation Index](./Documentation/INDEX.md)

### Contact Information

- 📧 **Email**: contact@icct26.org
- 📱 **WhatsApp**: +91 98765 43210
- 🌐 **Website**: https://icct26.netlify.app

---

## 🙏 Acknowledgments

- **CSI St. Peter's Church** - For organizing this wonderful tournament
- **Youth Fellowship** - For their dedication and support
- **Sponsors** - For their generous contributions
- **Development Team** - For bringing this vision to life
- **Open Source Community** - For amazing tools and libraries

---

<div align="center">

### 🏏 Built with ❤️ for the Cricket Community

**ICCT26** • *Unity Through Cricket* • **2026**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/sanjaynesan-05/ICCT26-frontend)
[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://icct26.netlify.app)
[![Documentation](https://img.shields.io/badge/Full-Documentation-blue?style=for-the-badge)](./Documentation/INDEX.md)

---

*Last Updated: January 5, 2026*

</div>
- Auto-pause on hover
- Seamless loop (45-second cycle)
- Gradient fade effects
- Responsive sizing

### Gallery

- Pinterest-style masonry layout
- Dynamic aspect ratio handling
- Fullscreen lightbox viewer
- Arrow key navigation (← → Esc)
- Bulk download functionality
- Image counter display

### Registration Form

- Multi-step form with validation
- File upload with type checking
- Real-time error messages
- Idempotent submissions (prevents duplicates)
- Success notifications
- Form data persistence

### Admin Dashboard

- 4-stage match workflow:
  1. Create Match
  2. Start Match
  3. Record Team A Score (runs/wickets)
  4. Record Team B Score (runs/wickets)
  5. Finish Match
- Live score editing
- Team management
- Player detail updates
- Schedule management

## 📊 Performance

### Bundle Analysis

- Optimized production build with Vite
- Code splitting for route-based chunks
- Lazy loading of components
- Image optimization via Cloudinary

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Optimization

- Touch-friendly interactive elements
- Responsive images and typography
- Optimized animations for mobile
- Efficient data loading

## 🔐 Security Features

### Client-Side Security

- ✅ XSS Prevention (input sanitization)
- ✅ CSRF Protection (token validation)
- ✅ Type Safety (TypeScript strict mode)
- ✅ Protected Routes (authentication checks)
- ✅ Error Boundaries (graceful error handling)

### Form Security

- ✅ Input validation on all forms
- ✅ File type and size validation
- ✅ Error messages (user-friendly)
- ✅ Secure file uploads to Cloudinary

### Authentication

- ✅ JWT token-based admin authentication
- ✅ Secure token storage
- ✅ Protected admin routes
- ✅ Session management

## 📱 Responsive Design

### Breakpoints

- **Mobile** - 0-640px
- **Tablet** - 640px-1024px
- **Desktop** - 1024px-1280px
- **Wide** - 1280px+
- **Ultra-wide** - 2560px+

### Mobile-First Features

- Stack-based layouts for small screens
- Touch-friendly button sizes
- Optimized font sizes
- Horizontal scroll components where needed
- Mobile-optimized images

## 🧪 Testing

### Unit Tests

```bash
npm test                    # Run all tests
npm test:watch             # Watch mode for development
```

Tests cover:

- Form validation logic
- Utility functions
- Component rendering
- API integration

### End-to-End Tests

```bash
npm test:e2e               # Run Playwright tests
npm test:e2e:ui            # Interactive test runner
```

E2E tests cover:

- Complete user workflows
- Form submission flows
- Navigation and routing
- API integration scenarios

## 🐛 Troubleshooting

### Dev Server Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### API Connection Errors

- Verify `VITE_API_URL` in `.env`
- Check backend is running and accessible
- Test with: `curl https://icct26-backend.onrender.com/api/teams`
- Check browser console for CORS errors

### Build Errors

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check linting issues
npm run lint
```

### Performance Issues

- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check DevTools Network tab for slow requests
- Rebuild project: `npm run build`

## 📡 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

### Deployment Platforms

**Recommended: Vercel**

- Auto-deploy from GitHub
- Zero-config setup
- Global CDN
- Preview deployments

**Alternative: Netlify**

- Git-based deployment
- Continuous integration
- Analytics included
- Form submissions support

**Alternative: GitHub Pages**

- Free static hosting
- Simple setup
- Good for CI/CD

## 📚 Additional Documentation

For detailed integration information, see:

- `BACKEND_UPDATE_REQUIREMENTS.md` - Backend changes and updates
- `INTEGRATION_GUIDE.ts` - Frontend-backend integration details
- `INTEGRATION_STATUS.md` - Current integration status
- `TESTING_BACKEND_INTEGRATION.md` - Testing guidelines
- `FRONTEND_BACKEND_INTEGRATION.md` - Integration specifications

## 🤝 Contributing

Contributions are welcome! Process:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open Pull Request with description

## 📄 License

This project is licensed under the MIT License.

## 👥 Credits & Acknowledgments

**Developer**: Sanjay Nesan
**Organization**: CSI St. Peter's Church, Youth Fellowship
**Location**: Coimbatore, India

### Thanks to

- React and TypeScript communities
- Tailwind CSS and Framer Motion teams
- Cloudinary for image hosting
- Render for backend hosting
- GitHub for version control

## 📞 Contact & Support

- **GitHub Repository**: https://github.com/sanjaynesan-05/ICCT26-frontend
- **Issues**: Report bugs via GitHub Issues
- **Questions**: Open GitHub Discussions

## 📈 Project Statistics

- **React Components**: 20+
- **Pages**: 8 with sub-pages
- **TypeScript Coverage**: 100%
- **Code Lines**: 5000+
- **API Endpoints**: 15+
- **Test Files**: 10+
- **Responsive Breakpoints**: 5

## 📋 Checklist for Deployment

- [ ] Environment variables configured
- [ ] Backend API URL set correctly
- [ ] Build passes without errors: `npm run build`
- [ ] Tests passing: `npm run test:all`
- [ ] ESLint checks pass: `npm run lint`
- [ ] TypeScript strict mode passes
- [ ] Bundle size acceptable
- [ ] All images optimized
- [ ] Fonts loaded properly
- [ ] Analytics configured (if needed)

## 🎉 Latest Updates

### v1.0.0 (Current)

- ✅ Complete tournament management system
- ✅ Real-time match scoring with runs/wickets separation
- ✅ Secure admin dashboard with 4-stage workflow
- ✅ Interactive schedule with live status tracking
- ✅ Gallery integration with Cloudinary
- ✅ Team registration system with file uploads
- ✅ Responsive design for all devices
- ✅ Full TypeScript implementation
- ✅ Comprehensive testing setup
- ✅ Production-ready deployment

---

**Last Updated**: November 29, 2025
**Current Version**: 1.0.0
**Status**: ✅ Active & Maintained
**License**: MIT

For the latest updates, visit the [GitHub repository](https://github.com/sanjaynesan-05/ICCT26-frontend).
