# ICCT26 - Inter Church Cricket Tournament

A modern, feature-rich web application for the ICCT26 Inter Church Cricket Tournament organized by CSI St. Peter's Church, Youth Fellowship, Coimbatore.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/react-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.3-blue)
![Status](https://img.shields.io/badge/status-active-success)

## 🏏 Project Overview

ICCT26 is a comprehensive cricket tournament management platform featuring modern design with advanced web technologies. The platform provides tournament information, real-time match scheduling, team registration, live score tracking, and an interactive gallery system with secure admin controls.

### Key Highlights

- ⚡ **Fast & Optimized** - React 18 + Vite with hot module replacement
- 🎨 **Modern UI** - Tailwind CSS with glass-effect components and smooth gradients
- 🎬 **Smooth Animations** - Framer Motion + GSAP for polished transitions
- 📱 **Mobile Optimized** - Fully responsive design (320px to 2560px+)
- 🖼️ **Interactive Gallery** - Masonry layout with Cloudinary CDN integration
- 📊 **Live Scoring System** - Real-time match updates with separate runs/wickets tracking
- 🔐 **Secure Admin** - Protected admin dashboard with JWT authentication
- 🚀 **Production Ready** - Type-safe, tested, and deployed

## ✨ Core Features

### Frontend Features

- **Real-time Countdowns** - Tournament and registration deadlines with live updates
- **Team Management** - View teams, player details, and statistics
- **Tournament Schedule** - Match fixtures with live status tracking and timing
- **Registration System** - Online team registration with file uploads and validation
- **Photo Gallery** - Interactive masonry gallery with lightbox and downloads
- **Live Scoring** - Real-time match scores displayed as runs/wickets format
- **Sponsor Showcase** - Carousel display of tournament sponsors with smooth animations
- **Admin Dashboard** - Secure admin panel for tournament management
- **Responsive Design** - Optimized for mobile (320px+) to desktop (2560px+)

### Technical Features

- ✅ **TypeScript** - 100% type-safe codebase with strict mode
- ✅ **Form Validation** - Comprehensive input validation for all forms
- ✅ **Error Handling** - Error boundaries and graceful fallback UI
- ✅ **API Integration** - RESTful backend integration with proper error handling
- ✅ **Performance** - Code splitting, lazy loading, and asset optimization
- ✅ **Accessibility** - WCAG compliant components with semantic HTML
- ✅ **Testing** - Unit tests with Jest and E2E tests with Playwright

## 📄 Pages & Routes

| Page | Path | Features |
|------|------|----------|
| **Home** | `/` | Hero section, countdowns, highlights, schedule preview, sponsor carousel |
| **Registration** | `/register` | Team registration form with file uploads |
| **Schedule** | `/schedule` | Tournament fixtures with live status and detailed match info |
| **Rules** | `/rules` | Tournament rules and regulations |
| **Gallery** | `/gallery` | Photo gallery with masonry layout and downloads |
| **Contact** | `/contact` | Contact information and social media links |
| **Admin Login** | `/admin/login` | Secure admin authentication |
| **Admin Dashboard** | `/admin/dashboard` | Team and match management |

## 🚀 Quick Start

### Prerequisites

```bash
# Required versions
Node.js >= 18.0.0
npm >= 9.0.0
```

### Installation

1. **Clone repository**

```bash
git clone https://github.com/sanjaynesan-05/ICCT26-frontend.git
cd ICCT26
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment**

```bash
# Copy example config (if available)
cp .env.example .env

# Edit .env with your API URL
VITE_API_URL=https://icct26-backend.onrender.com
```

4. **Start development server**

```bash
npm run dev
```

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

### Image Carousel

- Continuous horizontal scrolling
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
