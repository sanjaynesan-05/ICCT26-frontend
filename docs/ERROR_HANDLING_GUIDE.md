# ICCT26 Error Handling Guide

## Overview

This guide provides comprehensive error handling patterns, recovery strategies, and best practices for the ICCT26 Frontend application.

---

## 🎯 Error Handling Philosophy

### Core Principles

1. **Fail Gracefully**: Never crash the entire application
2. **Retry Automatically**: Auto-retry transient failures
3. **Inform Users**: Clear, actionable error messages
4. **Log Everything**: Structured logging for debugging
5. **Recover Quickly**: Provide recovery options (retry, go back)

---

## 🔴 Error Categories

### 1. **React Rendering Errors**

**Cause**: JavaScript errors in component rendering logic.

**Examples**:
- `TypeError: Cannot read property 'name' of undefined`
- `RangeError: Maximum call stack size exceeded`
- Infinite loops causing browser freeze

**Handler**: `ErrorBoundary` component

**Recovery**:
- Show fallback UI
- Log error details
- Offer "Try Again" button
- Reload page option

**Example**:
```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

### 2. **Network Errors**

**Cause**: Network connectivity issues.

**Examples**:
- No internet connection
- DNS resolution failure
- Firewall blocking requests

**Detection**:
```typescript
if (!axiosError.response) {
  // Network error
  return {
    message: 'Network error. Please check your internet connection.',
    errorCode: 'NETWORK_ERROR',
    isRetryable: true
  }
}
```

**Recovery**:
- Auto-retry with exponential backoff (500ms → 1s → 2s)
- Show "Retrying..." indicator
- After max retries, show manual retry button

---

### 3. **API Errors (4xx)**

**Cause**: Client-side validation failures or invalid requests.

**Examples**:
- 400: Invalid phone number format
- 401: Unauthorized (token expired)
- 404: Team not found
- 409: Duplicate idempotency key

**Detection**:
```typescript
if (axiosError.response?.status >= 400 && axiosError.response?.status < 500) {
  // Client error
  return parseBackendError(axiosError.response.data)
}
```

**Recovery**:
- **400 Validation**: Show field-specific error, user corrects input
- **401 Unauthorized**: Redirect to login
- **404 Not Found**: Show "Resource not found" message
- **409 Duplicate**: Return cached response (idempotency)

**Do NOT Retry**: These errors won't resolve with retries.

---

### 4. **Server Errors (5xx)**

**Cause**: Backend failures or temporary unavailability.

**Examples**:
- 500: Database error
- 500: Cloudinary upload failed
- 503: Service temporarily unavailable

**Detection**:
```typescript
if (axiosError.response?.status >= 500 && axiosError.response?.status < 600) {
  // Server error - retryable
  return {
    isRetryable: true,
    message: 'Server error. Retrying...'
  }
}
```

**Recovery**:
- Auto-retry with exponential backoff
- After max retries, show "Please try again later"
- Contact support option

---

### 5. **Timeout Errors**

**Cause**: Request takes longer than 60 seconds.

**Examples**:
- Large file upload stalls
- Backend processing takes too long

**Detection**:
```typescript
if (axiosError.code === 'ECONNABORTED') {
  return {
    message: 'Request timed out. Please try again.',
    errorCode: 'TIMEOUT',
    isRetryable: true
  }
}
```

**Recovery**:
- Auto-retry once
- Show "Upload taking longer than expected"
- Option to cancel and retry later

---

### 6. **File Validation Errors**

**Cause**: Invalid file type or size.

**Examples**:
- File type is `.txt` (expected image/PDF)
- File size is 10MB (limit 5MB)

**Detection**:
```typescript
const result = validateImageFile(file)
if (!result.valid) {
  return {
    message: result.error,
    errorCode: 'FILE_VALIDATION_ERROR',
    isRetryable: false
  }
}
```

**Recovery**:
- Show inline error below file input
- Highlight file input in red
- User selects correct file

---

## 🛠 Error Handling Implementations

### **1. ErrorBoundary Component**

**Purpose**: Catch React rendering errors.

**Location**: `src/components/ErrorBoundary.tsx`

**Usage**:
```tsx
import ErrorBoundary from './components/ErrorBoundary'

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Features**:
- User-friendly error UI
- Technical details (collapsible)
- Retry button
- Reload page button
- Go home button

**Logging**:
```typescript
console.error('ErrorBoundary caught an error:', {
  message: error.message,
  stack: error.stack,
  componentStack: errorInfo.componentStack,
  timestamp: new Date().toISOString()
})

// TODO: Send to external service (Sentry, LogRocket)
```

---

### **2. API Client Error Handling**

**Purpose**: Handle HTTP errors with retry logic.

**Location**: `src/utils/apiClient.ts`

**Retry Logic**:
```typescript
async function retryRequest<T>(
  requestFn: () => Promise<T>,
  retryCount = 0
): Promise<T> {
  try {
    return await requestFn()
  } catch (error) {
    const axiosError = error as AxiosError
    
    if (retryCount < MAX_RETRIES && isRetryableError(axiosError)) {
      const delay = RETRY_DELAYS[retryCount]  // [500, 1000, 2000]
      console.log(`Retry attempt ${retryCount + 1}/${MAX_RETRIES} after ${delay}ms...`)
      
      await sleep(delay)
      return retryRequest(requestFn, retryCount + 1)
    }
    
    throw error  // Max retries reached or non-retryable
  }
}
```

**Retryable Errors**:
```typescript
function isRetryableError(error: AxiosError): boolean {
  // Network errors
  if (!error.response) return true
  
  // 5xx server errors
  if (error.response.status >= 500 && error.response.status < 600) return true
  
  // 408 Request Timeout
  if (error.response.status === 408) return true
  
  // 429 Too Many Requests
  if (error.response.status === 429) return true
  
  // Cloudinary upload failures
  const data = error.response.data as any
  if (data?.error_code === 'CLOUDINARY_UPLOAD_FAILED') return true
  
  return false
}
```

---

### **3. Unified Error Parser**

**Purpose**: Convert all error types to consistent format.

**Location**: `src/utils/apiClient.ts`

**Function**: `parseApiError()`

**Usage**:
```typescript
try {
  const response = await apiClient.post('/api/teams/register', formData)
  return response.data
} catch (error) {
  const parsed = parseApiError(error)
  
  console.error('Error:', {
    message: parsed.message,
    errorCode: parsed.errorCode,
    isRetryable: parsed.isRetryable,
    isNetworkError: parsed.isNetworkError
  })
  
  if (parsed.isRetryable) {
    // Auto-retry handled by retryRequest
  } else {
    showUserError(parsed.message)
  }
}
```

**Output Format**:
```typescript
interface ParsedError {
  message: string              // User-friendly message
  errorCode?: string           // Machine-readable code
  details?: Record<string, any> // Additional context
  isNetworkError: boolean      // Is it a network issue?
  isRetryable: boolean         // Should we retry?
}
```

---

### **4. Form Validation Errors**

**Purpose**: Prevent invalid data submission.

**Location**: `src/utils/validation.ts`

**Pattern**:
```typescript
// Validate before submission
const validation = validateRegistrationForm(teamData, playerData)

if (!validation.valid) {
  validation.errors.forEach(error => {
    showFieldError(error.field, error.message)
  })
  return
}

// Proceed with submission
await register(teamData, playerData)
```

**Field-Level Validation**:
```tsx
const [phoneError, setPhoneError] = useState<string | null>(null)

const handlePhoneChange = (value: string) => {
  setCaptainPhone(value)
  
  // Validate on change
  const validation = validatePhone(value)
  setPhoneError(validation.valid ? null : validation.error)
}

<input
  type="tel"
  value={captainPhone}
  onChange={(e) => handlePhoneChange(e.target.value)}
  className={phoneError ? 'border-red-500' : 'border-gray-300'}
/>
{phoneError && (
  <p className="text-red-600 text-sm mt-1">{phoneError}</p>
)}
```

---

### **5. File Upload Errors**

**Purpose**: Validate files before upload.

**Location**: `src/lib/fileValidation.ts`

**Pattern**:
```typescript
const handleFileChange = (file: File) => {
  const validation = validateImageFile(file, 5 * 1024 * 1024)
  
  if (!validation.valid) {
    setFileError(validation.error)
    setFile(null)
    return
  }
  
  setFileError(null)
  setFile(file)
}

<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0]
    if (file) handleFileChange(file)
  }}
/>
{fileError && (
  <p className="text-red-600 text-sm mt-1">{fileError}</p>
)}
```

---

## 📊 Error State Management

### **Component State Pattern**

```typescript
interface ErrorState {
  hasError: boolean
  errorMessage: string | null
  errorCode: string | null
  canRetry: boolean
}

const [error, setError] = useState<ErrorState>({
  hasError: false,
  errorMessage: null,
  errorCode: null,
  canRetry: false
})

const handleError = (err: unknown) => {
  const parsed = parseApiError(err)
  
  setError({
    hasError: true,
    errorMessage: parsed.message,
    errorCode: parsed.errorCode || null,
    canRetry: parsed.isRetryable
  })
}

const handleRetry = () => {
  setError({ hasError: false, errorMessage: null, errorCode: null, canRetry: false })
  submitForm()  // Retry submission
}
```

---

### **Error UI Components**

**Inline Field Error**:
```tsx
{fieldError && (
  <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" />
    </svg>
    {fieldError}
  </div>
)}
```

**Banner Error (Dismissible)**:
```tsx
{error.hasError && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
    </svg>
    <div className="flex-1">
      <p className="font-semibold text-red-800">Error</p>
      <p className="text-red-700 text-sm mt-1">{error.errorMessage}</p>
      {error.canRetry && (
        <button onClick={handleRetry} className="text-red-600 underline text-sm mt-2">
          Try Again
        </button>
      )}
    </div>
    <button onClick={() => setError({ ...error, hasError: false })} className="text-red-600">
      ✕
    </button>
  </div>
)}
```

**Modal Error (Critical)**:
```tsx
{error.hasError && !error.canRetry && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
      <h2 className="text-2xl font-bold text-red-800 mb-2">Unable to Submit</h2>
      <p className="text-gray-700 mb-4">{error.errorMessage}</p>
      <div className="flex gap-3">
        <button onClick={() => window.location.reload()} className="btn-secondary flex-1">
          Reload Page
        </button>
        <button onClick={() => window.location.href = '/'} className="btn-primary flex-1">
          Go Home
        </button>
      </div>
    </div>
  </div>
)}
```

---

## 🔍 Error Logging

### **Console Logging (Development)**

```typescript
console.error('[Registration Error]', {
  timestamp: new Date().toISOString(),
  errorCode: error.errorCode,
  message: error.message,
  retryable: error.isRetryable,
  userAgent: navigator.userAgent,
  url: window.location.href
})
```

---

### **Structured Logging (Production)**

```typescript
function logError(error: ParsedError, context: Record<string, any>) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: 'error',
    message: error.message,
    errorCode: error.errorCode,
    isRetryable: error.isRetryable,
    context: {
      ...context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  }
  
  console.error(JSON.stringify(logEntry))
  
  // TODO: Send to external service
  // sendToSentry(logEntry)
  // sendToLogRocket(logEntry)
}

// Usage
try {
  await register(teamData)
} catch (err) {
  const parsed = parseApiError(err)
  logError(parsed, { operation: 'team_registration', teamName: teamData.teamName })
}
```

---

## 🚨 Error Recovery Strategies

### **1. Automatic Retry**

**When**: Network errors, 5xx errors, timeouts.

**How**: Exponential backoff (500ms → 1s → 2s).

**Code**:
```typescript
// Handled automatically by apiClient.ts
const response = await uploadMultipartWithRetry('/api/teams/register', formData, options)
```

---

### **2. Manual Retry**

**When**: After max auto-retries exhausted.

**How**: Show "Try Again" button.

**Code**:
```tsx
{error.canRetry && (
  <button onClick={handleRetry} className="btn-primary">
    Try Again
  </button>
)}
```

---

### **3. Form State Preservation**

**When**: Page refresh or navigation away.

**How**: Store form data in sessionStorage.

**Code**:
```typescript
// Save on change
useEffect(() => {
  sessionStorage.setItem('registration_draft', JSON.stringify(formData))
}, [formData])

// Restore on mount
useEffect(() => {
  const draft = sessionStorage.getItem('registration_draft')
  if (draft) {
    setFormData(JSON.parse(draft))
  }
}, [])
```

---

### **4. Idempotency Protection**

**When**: Network failure during submission.

**How**: Reuse same idempotency key on retry.

**Code**:
```typescript
const key = getIdempotencyKey('team_registration') || generateIdempotencyKey()
storeIdempotencyKey('team_registration', key)

try {
  await register(formData, key)
} catch (err) {
  // Same key will be used on retry
  console.log('Retry with same key:', key)
}
```

---

### **5. Graceful Degradation**

**When**: Non-critical features fail (e.g., email).

**How**: Show warning but allow continuation.

**Code**:
```typescript
if (response.error_code === 'EMAIL_SEND_FAILED') {
  showWarning('Registration succeeded but email notification failed. Please contact support for confirmation.')
  // Still show success screen
}
```

---

## 📝 Error Message Best Practices

### **User-Facing Messages**

✅ **Good**:
- "Your phone number should be 10 digits. Example: 9876543210"
- "File is too large. Maximum size is 5MB."
- "Network error. Please check your internet connection and try again."

❌ **Bad**:
- "Validation failed"
- "Error 400"
- "TypeError: Cannot read property 'name' of undefined"

---

### **Technical Logs**

✅ **Good**:
```typescript
console.error('Team registration failed:', {
  errorCode: 'VALIDATION_ERROR',
  field: 'captain_phone',
  value: '12345',
  expected: '10 digits',
  timestamp: '2025-11-18T10:30:00Z'
})
```

❌ **Bad**:
```typescript
console.log('error')  // No context
```

---

## ✅ Error Handling Checklist

- ✅ ErrorBoundary wraps entire app
- ✅ All API calls wrapped with try/catch
- ✅ Retryable errors auto-retry (3 attempts)
- ✅ Non-retryable errors show user message
- ✅ Field validation shows inline errors
- ✅ File validation before upload
- ✅ Network errors show connectivity message
- ✅ Timeout errors handled gracefully
- ✅ Idempotency prevents duplicates
- ✅ Form state preserved on errors
- ✅ Structured logging in place
- ✅ User-friendly error messages
- ✅ Technical details in console
- ✅ Recovery options provided (retry, go back)

---

## 🤝 Support

**Questions**: Contact tournament organizers  
**Issues**: See `DEPLOYMENT_CHECKLIST.md` for troubleshooting

---

**Version**: 2.0.0  
**Last Updated**: November 18, 2025
