# ICCT26 - Inter Church Cricket Tournament

A modern, production-ready web application for the ICCT26 Inter Church Cricket Tournament organized by CSI St. Peter's Church, Coimbatore.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-active-success)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

## 🏏 Project Overview

ICCT26 is a comprehensive cricket tournament management website featuring an IPL-inspired design with modern web technologies. The platform provides complete tournament information, team registration, real-time updates, and an interactive gallery system.

### Key Highlights
- ⚡ **Fast & Responsive** - React 18 + Vite (770KB bundle, 244KB gzipped)
- 🎨 **Beautiful Design** - Tailwind CSS with glass-effect components
- 🎬 **Smooth Animations** - Framer Motion powered transitions
- 📱 **Mobile First** - Fully responsive across all devices
- 🖼️ **Pinterest-style Gallery** - Masonry layout with Cloudinary CDN
- 🔐 **Secure** - Type-safe with proper validation and error handling
- 🚀 **Production Ready** - Deployed and tested

## ✨ Core Features

### Frontend Features
- **Real-time Countdowns** - Tournament and registration deadlines with live updates
- **Team Management** - View teams, player details, and statistics
- **Tournament Schedule** - Match fixtures and timetable
- **Registration System** - Online team registration with file uploads
- **Photo Gallery** - Interactive gallery with lightbox and downloads
- **Sponsor Carousel** - Smooth scrolling sponsor display with hover pause
- **Admin Dashboard** - Secure login and data management
- **Responsive Design** - Optimized for mobile (320px+) to desktop (2560px+)

### Technical Features
- ✅ **TypeScript** - 100% type-safe codebase
- ✅ **Form Validation** - Comprehensive input validation
- ✅ **Error Handling** - Error boundaries and graceful fallbacks
- ✅ **SEO Optimized** - Meta tags and semantic HTML
- ✅ **Performance** - Code splitting and lazy loading
- ✅ **Accessibility** - WCAG compliant components

## 📄 Pages

| Page | Path | Features |
|------|------|----------|
| **Home** | `/` | Hero section, countdowns, highlights, sponsor carousel |
| **Registration** | `/register` | Team registration form with validation |
| **Schedule** | `/schedule` | Tournament fixture details |
| **Rules** | `/rules` | Tournament rules and regulations |
| **Gallery** | `/gallery` | Photo gallery with masonry layout |
| **Contact** | `/contact` | Contact info and social links |
| **Admin Login** | `/admin/login` | Secure admin authentication |
| **Admin Dashboard** | `/admin/dashboard` | Team and player management |

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
# Copy example config
cp .env.example .env

# Edit .env with your API URL
VITE_API_URL=https://icct26-backend.onrender.com
```

4. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📦 Available Commands

### Development
```bash
npm run dev              # Start dev server with HMR
npm run dev:open        # Start and open in browser
```

### Building
```bash
npm run build            # Build for production
npm run preview          # Preview production build locally
```

### Testing
```bash
npm test                 # Run unit tests
npm test:watch          # Run tests in watch mode
npm test:coverage       # Generate coverage report
npm run test:e2e        # Run Playwright E2E tests
```

### Code Quality
```bash
npm run lint            # Lint TypeScript and styles
npm run format          # Format code with Prettier
npm run type-check      # Check TypeScript types
```

## 🏗️ Project Structure

```
ICCT26-frontend/
├── src/
│   ├── components/              # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Countdown.tsx
│   │   ├── RegistrationCountdown.tsx
│   │   ├── ImageCarousel.tsx       # Sponsor carousel
│   │   ├── CricketLoader.tsx       # Loading animation
│   │   ├── ProgressBar.tsx
│   │   ├── FileUpload.tsx
│   │   ├── SearchableSelect.tsx
│   │   ├── AnnouncementTicker.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── pages/                   # Page components
│   │   ├── Home.tsx
│   │   ├── Registration.tsx
│   │   ├── Gallery.tsx
│   │   ├── Schedule.tsx
│   │   ├── Rules.tsx
│   │   ├── Contact.tsx
│   │   └── admin/
│   │       ├── AdminLogin.tsx
│   │       ├── AdminDashboard.tsx
│   │       ├── PlayerDetail.tsx
│   │       └── TeamDetail.tsx
│   │
│   ├── data/                    # Static content
│   │   ├── home.ts
│   │   ├── registration.ts
│   │   ├── schedule.ts
│   │   ├── rules.ts
│   │   ├── contact.ts
│   │   └── index.ts
│   │
│   ├── services/                # API services
│   │   └── api.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── validation.ts
│   │   ├── fileValidation.ts
│   │   ├── idempotency.ts
│   │   └── apiClient.ts
│   │
│   ├── contexts/                # React contexts
│   │   └── AdminContext.tsx
│   │
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   │
│   ├── config/                  # Configuration
│   │   └── app.config.ts
│   │
│   ├── assets/                  # Static assets
│   │   └── sponsor/             # Sponsor logos
│   │
│   ├── tests/                   # Test files
│   │   ├── setup.ts
│   │   └── unit/
│   │
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
│
├── public/                      # Public assets
│   ├── churchlogo.png
│   ├── about.jpg
│   └── site.webmanifest
│
├── tests/
│   ├── integration/             # Integration tests
│   ├── e2e/                     # E2E tests
│   └── unit/                    # Unit tests
│
├── .env.example                 # Environment template
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind config
├── jest.config.js              # Jest config
├── playwright.config.ts        # Playwright config
└── package.json                # Dependencies
```

## 🛠️ Technology Stack

### Frontend Framework
- **React 18.3.1** - UI library with hooks
- **TypeScript 5.6** - Type-safe JavaScript
- **Vite 5.4** - Fast build tool
- **React Router 6** - Client-side routing

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS
- **PostCSS 8** - CSS processing
- **Custom CSS** - Keyframe animations

### Animations
- **Framer Motion 11** - Advanced animations
- **CSS Keyframes** - Native animations

### UI Components
- **Lucide React** - Icon library
- **Custom Components** - Glass effect cards, buttons, inputs

### State Management
- **React Context** - Admin authentication context
- **React Hooks** - Local component state

### API & Data
- **Fetch API** - HTTP requests
- **REST** - RESTful API integration
- **Cloudinary** - Image hosting CDN

### Testing
- **Jest** - Unit testing
- **Playwright** - E2E testing
- **React Testing Library** - Component testing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## 🎨 Design System

### Color Palette
```
Primary Background: #0f1419 → #1a1f3a (gradient)
Primary Accent: #FFCC29 (gold)
Secondary: #1e3a8a (dark blue)
Text: #ffffff, #e5e7eb
```

### Typography
- **Headings**: Bebas Neue (bold, uppercase)
- **Body**: Manrope (regular weight)
- **Subheading**: Quicksand (medium)

### Components
- **Glass Effect** - Blur background with transparency
- **Glow Border** - Animated border with shadow
- **Cards** - Rounded containers with hover effects
- **Buttons** - Gradient with smooth transitions
- **Inputs** - Dark themed with focus states

## 🔗 Backend Integration

### API Endpoints

**Base URL**: `https://icct26-backend.onrender.com`

#### Teams
```
GET    /api/teams              # Fetch all teams
GET    /api/teams/:id          # Get single team
POST   /api/teams              # Create team
PUT    /api/teams/:id          # Update team
DELETE /api/teams/:id          # Delete team
```

#### Registration
```
POST   /api/registration       # Submit team registration
GET    /api/registration/:id   # Get registration details
```

#### Gallery
```
GET    /api/gallery/collection/images     # Fetch gallery images
POST   /api/gallery/download/single       # Download single image
POST   /api/gallery/download/bulk         # Download multiple images
```

#### Admin
```
POST   /api/admin/login        # Admin authentication
GET    /api/admin/dashboard    # Dashboard data
```

### Gallery Integration

**Collection Details:**
- Collection ID: `b40aac6242ba4cd0c8bedcb520ca1eac`
- Total Images: 14 high-resolution (7008x4672px)
- CDN: Cloudinary
- Format: JPG/PNG

**Gallery Features:**
- Masonry layout (2-4 columns responsive)
- Lightbox fullscreen viewing
- Arrow key navigation (← → Esc)
- Download functionality
- Image counter display
- Smooth transitions

## ⚙️ Configuration

### Environment Variables
```bash
# .env file
VITE_API_URL=https://icct26-backend.onrender.com
VITE_APP_NAME=ICCT26
VITE_APP_VERSION=1.0.0
```

### Tailwind Configuration
Customized in `tailwind.config.js` with:
- Custom colors and gradients
- Font family overrides
- Animation utilities
- Glass effect classes

### Vite Configuration
Optimized for:
- Fast HMR (hot module replacement)
- Production code splitting
- Asset compression
- TypeScript support

## 🎬 Key Component Details

### Countdown Component
- Real-time countdown timer
- Animated number transitions
- Auto-refresh every second
- Responsive typography
- Glow effects

### Image Carousel
- Continuous horizontal scroll (45s loop)
- Pause on logo hover
- Seamless resume from position
- Gradient fade effects
- Responsive sizing

### Gallery Component
- Pinterest-style masonry
- Dynamic aspect ratio handling
- Fullscreen lightbox
- Image navigation controls
- Lazy loading

### Registration Form
- Multi-step form
- File upload validation
- Real-time error messages
- Idempotent submissions
- Success notifications

## 📊 Performance Metrics

### Build Stats
```
Bundle Size: 770.40 KB
Gzipped Size: 244.58 KB
Modules Transformed: 1945
Build Time: ~8 seconds
```

### Optimization Techniques
- ✅ Code splitting with dynamic imports
- ✅ Image lazy loading
- ✅ CSS minification
- ✅ JavaScript minification
- ✅ Cloudinary image optimization
- ✅ Gzip compression

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔐 Security

### Client-Side Security
- ✅ XSS Prevention (input sanitization)
- ✅ CSRF Protection (token validation)
- ✅ Type Safety (TypeScript)
- ✅ Protected Routes (authentication checks)
- ✅ Error Boundaries (graceful fallbacks)

### Form Security
- ✅ Input Validation
- ✅ File Type Checking
- ✅ Size Limit Validation
- ✅ Error Messages (user-friendly)

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 0-640px
- **Tablet**: 640px-1024px
- **Desktop**: 1024px+
- **Wide**: 1280px+

### Mobile Optimization
- Touch-friendly buttons
- Stack layout for small screens
- Optimized images
- Readable typography
- Smooth interactions

## 🐛 Troubleshooting

### Common Issues

**Dev server won't start**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**API connection errors**
- Check `VITE_API_URL` in `.env`
- Verify backend is running
- Test with: `curl https://icct26-backend.onrender.com/api/teams`

**Build errors**
```bash
# Check TypeScript errors
npm run type-check

# Check lint errors
npm run lint
```

**Performance issues**
- Clear browser cache
- Rebuild project: `npm run build`
- Check network tab in DevTools

## 🧪 Testing

### Unit Tests
```bash
npm test                    # Run all tests
npm test:watch             # Watch mode
npm test:coverage          # Coverage report
```

### E2E Tests
```bash
npm run test:e2e           # Run Playwright tests
npx playwright show-report # View test report
```

## 📡 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
1. **Vercel** (Recommended)
   - Auto-deploy from GitHub
   - Zero-config setup
   - Fast CDN

2. **Netlify**
   - Continuous deployment
   - Form handling
   - Analytics

3. **GitHub Pages**
   - Simple deployment
   - Free hosting

### Environment for Production
```env
VITE_API_URL=https://icct26-backend.onrender.com
```

## 📈 Future Roadmap

- [ ] PWA support (offline functionality)
- [ ] Dark mode toggle
- [ ] Multi-language support (Tamil, English)
- [ ] Live score updates (WebSocket)
- [ ] Player statistics dashboard
- [ ] Ticket booking system
- [ ] Virtual live streaming
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Credits

**Developed by**: Sanjay Nesan  
**Organization**: CSI St. Peter's Church  
**Location**: Coimbatore, India

### Technologies & Services
- React & TypeScript community
- Tailwind CSS team
- Framer Motion creators
- Cloudinary for image hosting
- Render for backend hosting
- Vercel/Netlify for deployment

## 📞 Support & Contact

- **Website**: (Tournament website URL)
- **Email**: support@icct26.com
- **GitHub**: https://github.com/sanjaynesan-05/ICCT26-frontend
- **Issues**: Open GitHub Issues for bugs and feature requests

## 📊 Project Statistics

- **Lines of Code**: ~5000+
- **Components**: 20+
- **Pages**: 8
- **TypeScript Coverage**: 100%
- **Test Coverage**: In progress
- **Performance Score**: 95+

## 🎉 Acknowledgments

Thanks to:
- All tournament sponsors
- CSI St. Peter's Church leadership
- Development team members
- Testing contributors
- Community feedback

---

**Last Updated**: November 24, 2025  
**Current Version**: 1.0.0  
**Status**: ✅ Active Development  
**License**: MIT

For more information, visit the [project repository](https://github.com/sanjaynesan-05/ICCT26-frontend).
