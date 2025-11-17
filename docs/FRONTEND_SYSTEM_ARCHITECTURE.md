# ICCT26 Frontend System Architecture

## Overview

This document provides a comprehensive technical architecture overview of the ICCT26 Frontend system, including component hierarchy, data flow patterns, state management, and design decisions.

---

## 🏗 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐    │
│  │              React Application                      │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │          Error Boundary (Top Level)          │  │    │
│  │  │  ┌────────────────────────────────────────┐  │  │    │
│  │  │  │         Router (React Router)          │  │  │    │
│  │  │  │  ┌──────────────────────────────────┐  │  │  │    │
│  │  │  │  │  Pages & Components              │  │  │  │    │
│  │  │  │  │  - Home                          │  │  │  │    │
│  │  │  │  │  - Registration (Multi-step)     │  │  │  │    │
│  │  │  │  │  - Admin Dashboard               │  │  │  │    │
│  │  │  │  └──────────────────────────────────┘  │  │  │    │
│  │  │  └────────────────────────────────────────┘  │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │          Utility Layer (Business Logic)            │    │
│  │  - Validation (validation.ts)                      │    │
│  │  - Idempotency (idempotency.ts)                    │    │
│  │  - API Client (apiClient.ts)                       │    │
│  │  - Registration Service (productionRegistrationService)│    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │          Storage Layer (Persistence)               │    │
│  │  - localStorage (idempotency keys)                 │    │
│  │  - sessionStorage (form state)                     │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend Services (FastAPI)                 │
│  - Team Registration API                                    │
│  - Admin Management API                                     │
│  - Cloudinary Integration                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Component Architecture

### **1. Page Components**

#### **Registration Page** (`src/pages/Registration.tsx`)

**Purpose**: Multi-step team registration form.

**State Management**:
```typescript
interface RegistrationState {
  currentStep: number              // 1, 2, or 3
  teamData: TeamFormData           // Team details
  playerData: PlayerFormData[]     // 11 players
  files: {
    paymentProof: File | null
    jerseyImage: File | null
  }
  isSubmitting: boolean
  showSuccess: boolean
  validationError: string | null
}
```

**Step Flow**:
```
Step 1: Team Details
├── Team Name (validated)
├── Captain Name (validated)
├── Captain Email (validated)
└── Captain Phone (validated)
      ↓
Step 2: Player Details
├── Player 2-11 Names (validated)
├── Jersey Numbers (validated)
└── Validation: No duplicate jersey numbers
      ↓
Step 3: Document Upload
├── Payment Proof (image/PDF, <5MB)
├── Jersey Image (image, <5MB)
└── File validation before upload
      ↓
Submit → API Call → Success Screen
```

**Key Functions**:
- `handleNext()` - Validate and move to next step
- `handlePrevious()` - Return to previous step
- `handleSubmit()` - Orchestrate submission with idempotency
- `validateCurrentStep()` - Step-specific validation

**Optimizations**:
- `useCallback` for event handlers to prevent re-renders
- `React.memo` for heavy child components (PlayerFormCard)
- Conditional rendering to mount only active step

---

#### **Admin Dashboard** (`src/pages/admin/AdminDashboard.tsx`)

**Purpose**: View and manage registered teams.

**State Management**:
```typescript
interface AdminState {
  teams: Team[]
  loading: boolean
  error: string | null
  selectedTeam: Team | null
  filters: {
    search: string
    status: 'all' | 'pending' | 'approved'
  }
}
```

**Features**:
- Team listing with search and filters
- Team detail view
- Payment status management
- Export to CSV

---

### **2. Reusable Components**

#### **ErrorBoundary** (`src/components/ErrorBoundary.tsx`)

**Purpose**: Catch and recover from React errors.

**Props**:
```typescript
interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}
```

**State**:
```typescript
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}
```

**Lifecycle**:
1. `getDerivedStateFromError()` - Update state when error caught
2. `componentDidCatch()` - Log error details
3. Render fallback UI with retry button
4. `handleReset()` - Clear error state and retry

---

#### **CricketLoader** (`src/components/CricketLoader.tsx`)

**Purpose**: Cricket-themed loading animation.

**Variants**:
- `spinner` - Rotating cricket ball
- `bouncing` - Bouncing ball animation
- `stumps` - Wickets animation

**Usage**:
```tsx
<CricketLoader variant="spinner" size="lg" text="Loading..." />
```

---

#### **ProgressBar** (`src/components/ProgressBar.tsx`)

**Purpose**: Upload progress visualization.

**Props**:
```typescript
interface ProgressBarProps {
  progress: number        // 0-100
  variant: 'linear' | 'circular' | 'stepped'
  label?: string
  showPercentage?: boolean
  color?: 'blue' | 'green' | 'red'
}
```

**Variants**:
1. **Linear**: Horizontal bar (file uploads)
2. **Circular**: Radial progress (loading states)
3. **Stepped**: Multi-step wizard (registration flow)

---

### **3. Context Providers**

#### **AdminContext** (`src/contexts/AdminContext.tsx`)

**Purpose**: Global admin authentication state.

**State**:
```typescript
interface AdminContextState {
  isAuthenticated: boolean
  username: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}
```

**Usage**:
```tsx
const { isAuthenticated, login, logout } = useAdminContext()
```

---

## 🔄 Data Flow Patterns

### **Registration Flow (Detailed)**

```
User Input (Form)
      ↓
Client-Side Validation (validation.ts)
      ↓
[PASS] → Generate Idempotency Key (idempotency.ts)
      ↓
Store Key in localStorage
      ↓
Build FormData Object (multipart)
      ↓
Upload via API Client (apiClient.ts)
      ↓
[Progress Tracking] → Update Progress Bar
      ↓
[Retry on Failure] → Exponential Backoff
      ↓
Backend Response (success/error)
      ↓
[Success] → Show Success Screen
[Error] → Show Error + Retry Option
```

---

### **Error Handling Flow**

```
Error Occurs
      ↓
Is React Error?
  ├─ YES → ErrorBoundary catches
  │         ↓
  │      Log to console
  │         ↓
  │      Show fallback UI
  │         ↓
  │      User clicks "Retry"
  │         ↓
  │      Reset error state
  │
  └─ NO → Is API Error?
           ├─ YES → parseApiError()
           │         ↓
           │      Determine retryable
           │         ↓
           │      [Retryable] → Auto-retry (3x)
           │      [Not Retryable] → Show error message
           │
           └─ NO → Generic error handler
```

---

### **Idempotency Flow**

```
User Starts Registration
      ↓
Check localStorage for existing key
      ↓
[Key Exists & Valid] → Use existing key
      ↓
[No Key] → Generate new UUID v4
      ↓
Store key with timestamp
      ↓
Attach key to API request header
      ↓
Backend checks idempotency
      ↓
[Duplicate] → Return cached response (409)
[New] → Process request
      ↓
[Success] → Keep key for 24h (replay protection)
[Failure] → Keep key for retry
      ↓
[After 24h] → Auto-expire key
```

---

## 🗄 State Management Strategy

### **Local State (useState)**

**Use Cases**:
- Component-specific UI state
- Form input values
- Loading/error states

**Example**:
```tsx
const [currentStep, setCurrentStep] = useState(1)
const [isSubmitting, setIsSubmitting] = useState(false)
```

---

### **Persistent State (localStorage)**

**Use Cases**:
- Idempotency keys (24h TTL)
- User preferences
- Draft form data

**Structure**:
```typescript
{
  "idempotency_key_team_registration": {
    "key": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": 1700000000000
  }
}
```

---

### **Context State (React Context)**

**Use Cases**:
- Global authentication state
- Theme preferences
- Language settings

**Example**:
```tsx
<AdminContext.Provider value={{ isAuthenticated, login, logout }}>
  <App />
</AdminContext.Provider>
```

---

## 🔌 API Integration Layer

### **API Client Architecture**

```typescript
// Base Axios Instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { 'Accept': 'application/json' }
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: Date.now() }
    console.log('[API Request]', config.method, config.url)
    return config
  }
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata.startTime
    console.log('[API Response]', response.status, `${duration}ms`)
    return response
  },
  (error) => {
    console.error('[API Error]', error.response?.status, error.message)
    return Promise.reject(error)
  }
)
```

---

### **Retry Logic**

```typescript
async function retryRequest<T>(
  requestFn: () => Promise<T>,
  retryCount = 0
): Promise<T> {
  try {
    return await requestFn()
  } catch (error) {
    if (retryCount < MAX_RETRIES && isRetryableError(error)) {
      const delay = RETRY_DELAYS[retryCount]  // [500, 1000, 2000]
      await sleep(delay)
      return retryRequest(requestFn, retryCount + 1)
    }
    throw error
  }
}
```

**Retryable Errors**:
- Network errors (no response)
- 5xx server errors
- 408 Request Timeout
- 429 Too Many Requests
- Cloudinary upload failures

---

## 🎨 UI/UX Design Patterns

### **1. Responsive Layout**

```css
/* Mobile-first approach */
.container {
  @apply px-4 py-6;        /* Mobile */
  @apply md:px-8 md:py-8;  /* Tablet */
  @apply lg:px-12 lg:py-10; /* Desktop */
}
```

---

### **2. Loading States**

```tsx
{isLoading && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <CricketLoader variant="spinner" size="lg" text="Submitting..." />
  </div>
)}
```

---

### **3. Error States**

```tsx
{error && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <p className="text-red-800">{error}</p>
    <button onClick={handleRetry} className="text-red-600 underline mt-2">
      Try Again
    </button>
  </div>
)}
```

---

### **4. Success States**

```tsx
{showSuccess && (
  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
    <h2 className="text-2xl font-bold text-green-800">Success!</h2>
    <p className="text-green-700 mt-2">Your team has been registered.</p>
    <button onClick={handleReset} className="mt-4 btn-primary">
      Register Another Team
    </button>
  </div>
)}
```

---

## 🔒 Security Architecture

### **1. Client-Side Validation**

**Purpose**: Prevent invalid data from reaching the backend.

**Validation Layers**:
1. Input-level validation (onChange)
2. Field-level validation (onBlur)
3. Form-level validation (onSubmit)

---

### **2. Idempotency Protection**

**Purpose**: Prevent duplicate submissions.

**Mechanism**:
1. Generate UUID v4 on form init
2. Store in localStorage with 24h TTL
3. Attach to API request header
4. Backend checks for duplicate key
5. Return 409 if duplicate detected

---

### **3. File Upload Security**

**Validation**:
- Client-side: Type and size validation
- Server-side: MIME type verification
- Cloudinary: Automatic malware scanning
- CDN: Secure HTTPS URLs

---

## 📊 Performance Optimizations

### **1. Code Splitting**

```typescript
// Lazy load admin routes
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))

<Suspense fallback={<CricketLoader />}>
  <Route path="/admin" element={<AdminDashboard />} />
</Suspense>
```

---

### **2. Memoization**

```typescript
// Memoize expensive components
const PlayerFormCard = React.memo(({ player, onChange }) => {
  return <div>...</div>
}, (prevProps, nextProps) => {
  return prevProps.player.id === nextProps.player.id &&
         prevProps.player.name === nextProps.player.name
})

// Memoize callbacks
const handlePlayerChange = useCallback((playerId, field, value) => {
  setPlayers(prev => prev.map(p => 
    p.id === playerId ? { ...p, [field]: value } : p
  ))
}, [])
```

---

### **3. Debouncing**

```typescript
// Debounce search input
const debouncedSearch = useMemo(
  () => debounce((value) => {
    performSearch(value)
  }, 300),
  []
)
```

---

## 🧪 Testing Strategy

### **Unit Tests (Jest)**

**Coverage**:
- Validation functions
- Idempotency utilities
- File handlers
- API client utilities

**Approach**: Test pure functions in isolation.

---

### **Integration Tests (Jest + Testing Library)**

**Coverage**:
- Component rendering
- User interactions
- State updates
- Context integration

**Approach**: Test components with mocked dependencies.

---

### **E2E Tests (Playwright)**

**Coverage**:
- Complete user journeys
- Multi-step flows
- Error scenarios
- Retry logic

**Approach**: Test full application with real backend.

---

## 📚 Design Patterns

### **1. Container/Presentational Pattern**

**Container Components**: Handle logic and state.  
**Presentational Components**: Render UI only.

**Example**:
```tsx
// Container
const RegistrationContainer = () => {
  const [state, setState] = useState(...)
  const handleSubmit = () => { ... }
  
  return <RegistrationForm state={state} onSubmit={handleSubmit} />
}

// Presentational
const RegistrationForm = ({ state, onSubmit }) => {
  return <form onSubmit={onSubmit}>...</form>
}
```

---

### **2. Custom Hooks Pattern**

**Purpose**: Encapsulate reusable logic.

**Example**:
```typescript
function useIdempotency(operation: string) {
  const [key, setKey] = useState<string | null>(null)
  
  useEffect(() => {
    const existingKey = getIdempotencyKey(operation)
    if (existingKey) {
      setKey(existingKey)
    } else {
      const newKey = generateIdempotencyKey()
      storeIdempotencyKey(operation, newKey)
      setKey(newKey)
    }
  }, [operation])
  
  return key
}
```

---

### **3. Error Boundary Pattern**

**Purpose**: Catch React errors and show fallback UI.

**Implementation**: Class component with `componentDidCatch`.

---

## 🚀 Deployment Architecture

```
Developer Commits → GitHub Repository
      ↓
GitHub Actions (CI/CD)
      ↓
Run Tests (Jest + Playwright)
      ↓
[Tests Pass] → Build Production Bundle (Vite)
      ↓
Optimize Assets (minify, gzip)
      ↓
Deploy to Netlify
      ↓
Cloudflare CDN (Global Edge Network)
      ↓
Users Worldwide
```

**Deployment Platform**: Netlify  
**CDN**: Cloudflare  
**HTTPS**: Automatic SSL  
**Domain**: Custom domain support

---

## 📝 Summary

The ICCT26 Frontend follows a **modular, scalable architecture** with:

- ✅ **Component-based design** for reusability
- ✅ **Layered architecture** (UI → Logic → API)
- ✅ **Comprehensive error handling** at all levels
- ✅ **Performance optimizations** (memoization, code-splitting)
- ✅ **Security best practices** (validation, idempotency)
- ✅ **Testability** (unit, integration, E2E)
- ✅ **Production-ready** deployment pipeline

**Next Steps**: See `API_USAGE_GUIDE.md` for API integration details.

---

**Version**: 2.0.0  
**Last Updated**: November 18, 2025
