# 📖 ICCT26 Complete Documentation Index

## Welcome to ICCT26 Documentation

This comprehensive documentation covers every aspect of the ICCT26 (Inter Church Cricket Tournament 2026) web application, from architecture to deployment.

---

## 📚 Documentation Structure

### [01. Project Overview](./01-PROJECT-OVERVIEW.md)
**Complete project introduction and vision**

- Executive Summary
- Project Vision & Objectives
- Key Features & Highlights
- Target Audience
- Technical Stack
- Development Timeline
- Future Enhancements

**Read this first** to understand the overall project scope and goals.

---

### [02. System Architecture](./02-ARCHITECTURE.md)
**Deep dive into system design and architecture**

- 3-Tier Architecture Overview
- Frontend Architecture & Component Hierarchy
- Directory Structure
- Data Flow Architecture
- State Management
- API Architecture
- Security Architecture
- Performance Architecture
- Deployment Architecture
- Database Schema

**Essential for** understanding how the application is structured and how components interact.

---

### [03. Application Flow Diagrams](./03-FLOW-DIAGRAMS.md)
**Visual representation of user journeys and data flows**

#### User Flows:
- Public User Journey
- Team Registration Flow (Step-by-step)
- Schedule Viewing Flow
- Gallery Interaction Flow

#### Admin Flows:
- Admin Login Flow
- Admin Dashboard Flow
- Match Score Update Flow

#### Data Flows:
- Registration Data Flow
- Real-Time Match Updates
- Error Handling Flow

**Use this** to understand user interactions and system processes.

---

### [04. Component Documentation](./04-COMPONENTS.md)
**Comprehensive component reference**

#### Layout Components:
- Navbar - Navigation header
- Footer - Site-wide footer

#### Feature Components:
- CricketLoader - Animated loading screen
- Countdown - Tournament countdown
- FileUpload - File upload with drag-drop
- PlayerFormCard - Player information form
- ProgressBar - Upload progress indicator
- SearchableSelect - Church selection dropdown
- ImageCarousel - Sponsor carousel
- SchedulePreview - Match preview widget
- FloatingTeamsWidget - Teams count widget

#### UI Components:
- ErrorBoundary - Error handling wrapper
- ProtectedRoute - Auth route guard

#### Admin Components:
- AdminLogin - Authentication
- AdminDashboard - Management console
- TeamDetail - Team details view
- PlayerDetail - Player details view
- ScheduleManager - Match management

#### Page Components:
- Home - Landing page
- Registration - Team registration (1674 lines)
- Schedule - Match schedule
- Gallery - Photo gallery
- Rules - Tournament rules
- Contact - Contact information

**Reference this** for component APIs, props, and usage examples.

---

### [05. API Reference](./05-API-REFERENCE.md)
**Complete API documentation**

#### Public Endpoints:
- `GET /` - Health check
- `GET /matches` - Get all matches
- `GET /matches/:id` - Get match details
- `POST /register` - Team registration
- `GET /church-availability` - Church capacity

#### Admin Endpoints:
- `POST /admin/login` - Admin authentication
- `GET /admin/teams` - Get all teams
- `GET /admin/teams/:id` - Team details
- `PUT /admin/matches/:id` - Update match
- `GET /admin/players/:id` - Player details

#### Features:
- Retry Logic
- Progress Tracking
- Error Handling
- Idempotency Support

**Use this** for integrating with the backend API.

---

### [06. Data Structures & Types](./06-DATA-STRUCTURES.md)
**TypeScript type definitions and data schemas**

#### Core Types:
- `Match` - Match information
- `MatchResult` - Match outcome
- `Team` - Team registration
- `Player` - Player details
- `Rule` - Tournament rules
- `Organizer` - Contact information
- `FormData` - Registration form
- `AppConfig` - App configuration

#### Utility Types:
- `ScoreFormat` - Score string format
- `MatchStatus` - Match status types
- `RoundType` - Tournament rounds
- `ChurchAvailability` - Church capacity

#### Data Files:
- `src/data/schedule.ts` - Match data
- `src/data/rules.ts` - Tournament rules
- `src/data/contact.ts` - Contact info
- `src/data/home.ts` - Home page data
- `src/data/registration.ts` - Registration config

**Reference this** for type definitions and data structures.

---

### [07. Design System](./07-DESIGN-SYSTEM.md)
**Complete styling and design guidelines**

#### Color Palette:
- Primary Colors (Navy Blue, Gold)
- Background Colors
- Text Colors
- Status Colors
- UI Colors

#### Typography:
- Font Families (Bebas Neue, Quicksand, Manrope)
- Font Sizes (9xl to xs)
- Font Weights
- Line Heights

#### Styling:
- Spacing System
- Border Radius
- Shadows (Glass effects)
- Animations (Float, Glow, Scroll)
- Transitions

#### Components:
- Buttons (Primary, Secondary, Ghost)
- Cards (Glass, Solid, Hover)
- Inputs (Text, Error states)
- Badges (Status indicators)
- Progress Bars

#### Responsive Design:
- Breakpoints (xs to 2xl)
- Mobile-first approach

**Use this** for consistent styling across the application.

---

### [08. Deployment & DevOps](./08-DEPLOYMENT.md)
**Production deployment and operations guide**

#### Deployment Platforms:
- **Frontend**: Netlify (https://icct26.netlify.app)
- **Backend**: Render (https://icct26-backend.onrender.com)
- **Database**: PostgreSQL on Render
- **CDN**: Cloudinary

#### Configuration:
- Environment Variables
- Build Settings
- Deploy Process
- Custom Domain Setup

#### CI/CD:
- GitHub Actions Workflow
- Automated Testing
- Automated Deployment

#### Monitoring:
- Netlify Analytics
- Render Metrics
- Error Tracking
- Logging

#### Performance:
- Frontend Optimizations
- Backend Optimizations
- Caching Strategies
- Database Indexing

#### Security:
- CORS Configuration
- Input Sanitization
- SQL Injection Prevention
- File Upload Validation

#### Backup & Recovery:
- Database Backups
- File Storage Backups
- Rollback Procedures

**Essential for** deployment, maintenance, and operations.

---

## 🗂️ Quick Reference

### Project Structure
```
ICCT26/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page-level components
│   ├── contexts/       # React Context providers
│   ├── services/       # API service layer
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   ├── data/           # Static data
│   ├── config/         # App configuration
│   └── styles/         # Global styles
├── public/             # Static assets
├── Documentation/      # This documentation
└── tests/             # Test files
```

### Key Technologies

| Category | Technology | Version |
|----------|-----------|---------|
| **Frontend** | React | 18.3.1 |
| **Language** | TypeScript | 5.3.3 |
| **Build Tool** | Vite | 5.4.21 |
| **Styling** | Tailwind CSS | 3.4.1 |
| **Animation** | Framer Motion | 11.0.3 |
| **Animation** | GSAP | 3.13.0 |
| **Routing** | React Router | 6.22.0 |
| **HTTP Client** | Axios | 1.13.2 |
| **Icons** | Lucide React | 0.344.0 |
| **Testing** | Jest | 30.2.0 |
| **E2E Testing** | Playwright | 1.56.1 |

### Environment Setup

```bash
# 1. Clone Repository
git clone https://github.com/sanjaynesan-05/ICCT26-frontend.git
cd ICCT26

# 2. Install Dependencies
npm install

# 3. Setup Environment
echo "VITE_API_URL=https://icct26-backend.onrender.com" > .env

# 4. Start Development Server
npm run dev

# 5. Run Tests
npm test

# 6. Build for Production
npm run build
```

### Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5174)
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:e2e         # Run E2E tests with Playwright
npm run test:e2e:ui      # Run E2E tests with UI
npm run test:all         # Run all tests

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler check
```

### Application URLs

| Environment | Frontend | Backend |
|-------------|----------|---------|
| **Production** | https://icct26.netlify.app | https://icct26-backend.onrender.com |
| **Development** | http://localhost:5174 | http://localhost:8000 |

---

## 📋 Documentation Best Practices

### When to Read What

**Starting the Project?**
→ Read [01-PROJECT-OVERVIEW.md](./01-PROJECT-OVERVIEW.md)

**Building a Feature?**
→ Read [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) and [04-COMPONENTS.md](./04-COMPONENTS.md)

**Styling Components?**
→ Read [07-DESIGN-SYSTEM.md](./07-DESIGN-SYSTEM.md)

**Integrating APIs?**
→ Read [05-API-REFERENCE.md](./05-API-REFERENCE.md)

**Understanding Data?**
→ Read [06-DATA-STRUCTURES.md](./06-DATA-STRUCTURES.md)

**Deploying Changes?**
→ Read [08-DEPLOYMENT.md](./08-DEPLOYMENT.md)

**Understanding User Flow?**
→ Read [03-FLOW-DIAGRAMS.md](./03-FLOW-DIAGRAMS.md)

---

## 🔍 Search Index

### Features
- **Registration**: [03-FLOW-DIAGRAMS.md](./03-FLOW-DIAGRAMS.md#2-team-registration-flow), [04-COMPONENTS.md](./04-COMPONENTS.md#registration-component)
- **Authentication**: [03-FLOW-DIAGRAMS.md](./03-FLOW-DIAGRAMS.md#5-admin-login-flow), [04-COMPONENTS.md](./04-COMPONENTS.md#adminlogin-component)
- **Match Scoring**: [05-API-REFERENCE.md](./05-API-REFERENCE.md#9-update-match), [03-FLOW-DIAGRAMS.md](./03-FLOW-DIAGRAMS.md#7-match-score-update-flow)
- **File Upload**: [04-COMPONENTS.md](./04-COMPONENTS.md#fileupload-component), [05-API-REFERENCE.md](./05-API-REFERENCE.md#4-team-registration)

### Components
- **Navbar**: [04-COMPONENTS.md](./04-COMPONENTS.md#navbar-component)
- **Footer**: [04-COMPONENTS.md](./04-COMPONENTS.md#footer-component)
- **Countdown**: [04-COMPONENTS.md](./04-COMPONENTS.md#countdown-component)
- **FileUpload**: [04-COMPONENTS.md](./04-COMPONENTS.md#fileupload-component)
- **ErrorBoundary**: [04-COMPONENTS.md](./04-COMPONENTS.md#errorboundary-component)

### API Endpoints
- **Match API**: [05-API-REFERENCE.md](./05-API-REFERENCE.md#2-get-all-matches)
- **Registration API**: [05-API-REFERENCE.md](./05-API-REFERENCE.md#4-team-registration)
- **Admin API**: [05-API-REFERENCE.md](./05-API-REFERENCE.md#admin-endpoints)

### Styling
- **Colors**: [07-DESIGN-SYSTEM.md](./07-DESIGN-SYSTEM.md#color-palette)
- **Typography**: [07-DESIGN-SYSTEM.md](./07-DESIGN-SYSTEM.md#typography)
- **Animations**: [07-DESIGN-SYSTEM.md](./07-DESIGN-SYSTEM.md#animations)
- **Buttons**: [07-DESIGN-SYSTEM.md](./07-DESIGN-SYSTEM.md#buttons)

### Deployment
- **Netlify Setup**: [08-DEPLOYMENT.md](./08-DEPLOYMENT.md#frontend-deployment-netlify)
- **Render Setup**: [08-DEPLOYMENT.md](./08-DEPLOYMENT.md#backend-deployment-render)
- **Environment Variables**: [08-DEPLOYMENT.md](./08-DEPLOYMENT.md#environment-variables-netlify)

---

## 🎯 Learning Path

### For New Developers

**Week 1**: Understanding the Project
1. Read [01-PROJECT-OVERVIEW.md](./01-PROJECT-OVERVIEW.md)
2. Read [02-ARCHITECTURE.md](./02-ARCHITECTURE.md)
3. Setup local development environment
4. Explore codebase

**Week 2**: Component Development
1. Read [04-COMPONENTS.md](./04-COMPONENTS.md)
2. Read [07-DESIGN-SYSTEM.md](./07-DESIGN-SYSTEM.md)
3. Build a simple component
4. Style using design system

**Week 3**: API Integration
1. Read [05-API-REFERENCE.md](./05-API-REFERENCE.md)
2. Read [06-DATA-STRUCTURES.md](./06-DATA-STRUCTURES.md)
3. Make API calls
4. Handle responses

**Week 4**: Deployment
1. Read [08-DEPLOYMENT.md](./08-DEPLOYMENT.md)
2. Deploy to staging
3. Test deployment
4. Deploy to production

---

## 📞 Support & Contact

**Project Maintainer**: Development Team

**For Questions**:
- Technical Issues: Check documentation first
- Bug Reports: Create GitHub issue
- Feature Requests: Submit via GitHub
- General Queries: Contact project lead

---

## 📄 Document Information

- **Documentation Version**: 1.0.0
- **Last Updated**: January 5, 2026
- **Total Pages**: 8 documents
- **Total Lines**: ~3,500+ lines of documentation
- **Status**: Complete & Current

---

## 🎨 Visual Guide

### Architecture Diagram
See [02-ARCHITECTURE.md](./02-ARCHITECTURE.md#architecture-overview) for complete system architecture.

### Flow Diagrams
See [03-FLOW-DIAGRAMS.md](./03-FLOW-DIAGRAMS.md) for all user and data flow diagrams.

### Component Tree
See [04-COMPONENTS.md](./04-COMPONENTS.md#component-hierarchy) for component relationships.

---

## ✅ Documentation Checklist

- [x] Project Overview & Vision
- [x] System Architecture
- [x] Application Flow Diagrams
- [x] Component Documentation
- [x] API Reference
- [x] Data Structures & Types
- [x] Design System
- [x] Deployment Guide
- [x] Master Index
- [x] README Integration

---

**This comprehensive documentation ensures that developers, maintainers, and stakeholders have complete understanding of the ICCT26 application.**

*For the latest updates, always refer to this documentation index.*
