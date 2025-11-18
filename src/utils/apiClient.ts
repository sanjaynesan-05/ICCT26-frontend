/**
 * ICCT26 Frontend API Client - PRODUCTION GRADE
 * Axios-based client with retry logic, multipart support, and error handling
 * 
 * ✅ Fixed Issues (Nov 18, 2025):
 * - Correct baseURL from VITE_API_URL
 * - NO manual Content-Type for multipart
 * - Preserves browser-generated boundary
 * - Retry logic with exponential backoff
 * - Progress tracking
 * - Idempotency-Key support
 * - Unified error parsing
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

// ============================================================================
// CONFIGURATION
// ============================================================================

// ✅ FIX #3: Correct baseURL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://icct26-backend.onrender.com'
const MAX_RETRIES = 3
const RETRY_DELAYS = [1000, 2000, 4000] // Exponential backoff: 1s → 2s → 4s
const TIMEOUT = 120000 // 120 seconds for large file uploads

console.log('🔧 API Client initialized with baseURL:', API_BASE_URL)

// ============================================================================
// TYPES
// ============================================================================

export interface BackendError {
  success: false
  error_code: string
  message: string
  details?: Record<string, any>
}

export interface BackendSuccess<T = any> {
  success: true
  data: T
  message?: string
}

export type BackendResponse<T = any> = BackendSuccess<T> | BackendError

export interface UploadProgressCallback {
  (progressEvent: { loaded: number; total: number; percentage: number }): void
}

export interface UploadOptions {
  idempotencyKey: string
  onProgress?: UploadProgressCallback
}

// ============================================================================
// AXIOS INSTANCE
// ============================================================================

// ✅ FIX #6: Correct axios instance with proper configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Accept': 'application/json',
  },
  // ✅ NO transformRequest - let browser handle FormData
  // ✅ NO default Content-Type - set per request
})

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number
      retryCount?: number
    }
  }
}

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.metadata = { 
      startTime: Date.now(),
      retryCount: config.metadata?.retryCount || 0
    }
    
    const isMultipart = config.data instanceof FormData
    
    console.log(`📤 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      isMultipart,
      hasIdempotencyKey: !!config.headers['Idempotency-Key'],
      retryCount: config.metadata.retryCount,
    })
    
    return config
  },
  (error: AxiosError) => {
    console.error('❌ [API Request Error]', error.message)
    return Promise.reject(error)
  }
)

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

apiClient.interceptors.response.use(
  (response) => {
    const duration = Date.now() - (response.config.metadata?.startTime || Date.now())
    
    console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      duration: `${duration}ms`,
      success: response.data?.success,
    })
    
    return response
  },
  (error: AxiosError) => {
    const duration = error.config?.metadata?.startTime 
      ? Date.now() - error.config.metadata.startTime 
      : 0
    
    const status = error.response?.status
    const errorData = error.response?.data as any
    
    console.error(`❌ [API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status,
      duration: `${duration}ms`,
      message: error.message,
      errorCode: errorData?.error_code,
      errorMessage: errorData?.message,
    })
    
    return Promise.reject(error)
  }
)

// ============================================================================
// ERROR DETECTION
// ============================================================================

function isRetryableError(error: AxiosError): boolean {
  // Network errors (no response)
  if (!error.response) {
    return true
  }

  const status = error.response.status

  // Retryable status codes
  if (status >= 500 || status === 408 || status === 429) {
    return true
  }

  // Check for specific backend error codes
  const data = error.response.data as any
  if (data?.error_code === 'CLOUDINARY_UPLOAD_FAILED') {
    return true
  }

  return false
}

function isBackendError(data: any): data is BackendError {
  return (
    data &&
    typeof data === 'object' &&
    data.success === false &&
    typeof data.error_code === 'string' &&
    typeof data.message === 'string'
  )
}

// ============================================================================
// RETRY LOGIC
// ============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function retryRequest<T>(
  requestFn: () => Promise<T>,
  retryCount = 0
): Promise<T> {
  try {
    return await requestFn()
  } catch (error) {
    const axiosError = error as AxiosError

    if (retryCount < MAX_RETRIES && isRetryableError(axiosError)) {
      const delay = RETRY_DELAYS[retryCount]
      console.log(`🔄 Retry ${retryCount + 1}/${MAX_RETRIES} after ${delay}ms...`)
      
      await sleep(delay)
      return retryRequest(requestFn, retryCount + 1)
    }

    throw error
  }
}

// ============================================================================
// REQUEST WRAPPER
// ============================================================================

async function requestWithRetry<T>(
  config: AxiosRequestConfig
): Promise<BackendResponse<T>> {
  return retryRequest(async () => {
    try {
      const response = await apiClient.request<BackendResponse<T>>(config)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError

      if (axiosError.response && isBackendError(axiosError.response.data)) {
        return axiosError.response.data as BackendError
      }

      throw axiosError
    }
  })
}

// ============================================================================
// MULTIPART UPLOAD - PRODUCTION READY
// ============================================================================

/**
 * ✅ FIX #2: Uploads FormData without breaking multipart boundary
 * 
 * Key fixes:
 * - NO manual Content-Type header
 * - Browser auto-generates multipart/form-data with boundary
 * - FormData sent as-is (no transformation)
 * - Retry logic preserved
 * - Progress tracking works
 * - Idempotency-Key header included
 */
export async function uploadMultipartWithRetry<T>(
  endpoint: string,
  formData: FormData,
  options: UploadOptions
): Promise<BackendResponse<T>> {
  const { idempotencyKey, onProgress } = options

  // ✅ FIX #5: Debug output (development only)
  if (import.meta.env.DEV) {
    console.log('🔍 DEBUG — FormData dump:')
    for (const [key, value] of formData.entries()) {
      console.log(' → ', key, value instanceof File ? `${value.name} (${value.size} bytes)` : value)
    }
  }

  const config: AxiosRequestConfig = {
    method: 'POST',
    url: endpoint,
    data: formData,
    headers: {
      'Idempotency-Key': idempotencyKey,
      // ✅ FIX #2: DO NOT set Content-Type
      // Browser automatically sets: multipart/form-data; boundary=----WebKitFormBoundary...
    },
    onUploadProgress: onProgress ? (progressEvent) => {
      const total = progressEvent.total || 0
      const loaded = progressEvent.loaded || 0
      const percentage = total > 0 ? Math.round((loaded * 100) / total) : 0
      
      onProgress({
        loaded,
        total,
        percentage
      })
    } : undefined,
    // ✅ Ensure no transformation happens
    transformRequest: [(data) => data],
  }

  return requestWithRetry<T>(config)
}

// ============================================================================
// STANDARD API METHODS
// ============================================================================

export async function getWithRetry<T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<BackendResponse<T>> {
  return requestWithRetry<T>({
    method: 'GET',
    url: endpoint,
    ...config
  })
}

export async function postWithRetry<T>(
  endpoint: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<BackendResponse<T>> {
  return requestWithRetry<T>({
    method: 'POST',
    url: endpoint,
    data,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers
    },
    ...config
  })
}

export async function putWithRetry<T>(
  endpoint: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<BackendResponse<T>> {
  return requestWithRetry<T>({
    method: 'PUT',
    url: endpoint,
    data,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers
    },
    ...config
  })
}

export async function deleteWithRetry<T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<BackendResponse<T>> {
  return requestWithRetry<T>({
    method: 'DELETE',
    url: endpoint,
    ...config
  })
}

// ============================================================================
// ERROR PARSING
// ============================================================================

export function extractErrorMessage(response: BackendResponse): string {
  if ('error_code' in response && response.success === false) {
    return response.message
  }
  return 'An unexpected error occurred'
}

export function extractErrorCode(response: BackendResponse): string | null {
  if ('error_code' in response && response.success === false) {
    return response.error_code
  }
  return null
}

export function isSuccessResponse<T>(
  response: BackendResponse<T>
): response is BackendSuccess<T> {
  return response.success === true
}

export function handleAxiosError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Network error. Please check your internet connection and try again.'
    }

    if (error.response.status === 413) {
      return 'Files are too large. Please reduce file sizes and try again.'
    }

    if (error.response.status === 422) {
      const data = error.response.data as any
      if (data?.message) {
        return data.message
      }
      if (data?.detail) {
        return JSON.stringify(data.detail)
      }
      return 'Validation error. Please check all required fields.'
    }

    if (error.response.status === 408) {
      return 'Request timeout. Please try again.'
    }

    if (isBackendError(error.response.data)) {
      return error.response.data.message
    }

    return `Server error (${error.response.status}). Please try again.`
  }

  return 'An unexpected error occurred. Please try again.'
}

// ============================================================================
// EXPORTS
// ============================================================================

export default apiClient
