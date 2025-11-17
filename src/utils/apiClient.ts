/**
 * ICCT26 Frontend API Client with Advanced Retry Logic & Interceptors
 * Axios-based client with automatic retries, backoff, timeout handling, and request tracking
 * Created: November 17, 2025
 * Enhanced: November 18, 2025 (Added interceptors, abort controller, unified error parsing)
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

// ============================================================================
// CONSTANTS
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const MAX_RETRIES = 3
const RETRY_DELAYS = [500, 1000, 2000] // Backoff: 500ms → 1s → 2s
const TIMEOUT = 60000 // 60 seconds for large file uploads

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

// ============================================================================
// AXIOS INSTANCE WITH INTERCEPTORS
// ============================================================================

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Accept': 'application/json',
  }
})

// Request interceptor: Add request timing and logging
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add request start time for duration tracking
    config.metadata = { startTime: Date.now() }
    
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      hasData: !!config.data,
    })
    
    return config
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Response interceptor: Log duration and handle errors uniformly
apiClient.interceptors.response.use(
  (response) => {
    const duration = Date.now() - (response.config.metadata?.startTime || Date.now())
    
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
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
    
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      duration: `${duration}ms`,
      message: error.message,
      errorCode: (error.response?.data as any)?.error_code,
    })
    
    return Promise.reject(error)
  }
)

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number
    }
  }
}

// ============================================================================
// ERROR DETECTION
// ============================================================================

/**
 * Checks if error is retryable (network errors, 5xx, Cloudinary failures)
 */
function isRetryableError(error: AxiosError): boolean {
  // Network errors (no response)
  if (!error.response) {
    console.log('Retryable: Network error (no response)')
    return true
  }

  // 5xx server errors
  if (error.response.status >= 500 && error.response.status < 600) {
    console.log(`Retryable: Server error ${error.response.status}`)
    return true
  }

  // 408 Request Timeout
  if (error.response.status === 408) {
    console.log('Retryable: Request timeout')
    return true
  }

  // 429 Too Many Requests
  if (error.response.status === 429) {
    console.log('Retryable: Rate limit')
    return true
  }

  // Check for Cloudinary-specific errors in response
  const data = error.response.data as any
  if (data?.error_code === 'CLOUDINARY_UPLOAD_FAILED') {
    console.log('Retryable: Cloudinary upload failed')
    return true
  }

  console.log(`Non-retryable: ${error.response.status} ${data?.error_code || ''}`)
  return false
}

/**
 * Checks if error response matches backend error format
 */
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
// RETRY LOGIC WITH EXPONENTIAL BACKOFF
// ============================================================================

/**
 * Sleeps for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retries a request with exponential backoff
 */
async function retryRequest<T>(
  requestFn: () => Promise<T>,
  retryCount = 0
): Promise<T> {
  try {
    return await requestFn()
  } catch (error) {
    const axiosError = error as AxiosError

    // Check if we should retry
    if (retryCount < MAX_RETRIES && isRetryableError(axiosError)) {
      const delay = RETRY_DELAYS[retryCount]
      console.log(`Retry attempt ${retryCount + 1}/${MAX_RETRIES} after ${delay}ms...`)
      
      await sleep(delay)
      return retryRequest(requestFn, retryCount + 1)
    }

    // Max retries reached or non-retryable error
    throw error
  }
}

// ============================================================================
// REQUEST WRAPPER WITH RETRY
// ============================================================================

/**
 * Wraps axios request with retry logic
 */
async function requestWithRetry<T>(
  config: AxiosRequestConfig
): Promise<BackendResponse<T>> {
  return retryRequest(async () => {
    try {
      const response = await apiClient.request<BackendResponse<T>>(config)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError

      // If we have a response with backend error format
      if (axiosError.response && isBackendError(axiosError.response.data)) {
        return axiosError.response.data as BackendError
      }

      // Network error or unexpected format
      throw axiosError
    }
  })
}

// ============================================================================
// MULTIPART UPLOAD WITH PROGRESS
// ============================================================================

export interface UploadOptions {
  idempotencyKey: string
  onProgress?: UploadProgressCallback
}

/**
 * Uploads multipart form data with progress tracking and retry logic
 */
export async function uploadMultipartWithRetry<T>(
  endpoint: string,
  formData: FormData,
  options: UploadOptions
): Promise<BackendResponse<T>> {
  const { idempotencyKey, onProgress } = options

  const config: AxiosRequestConfig = {
    method: 'POST',
    url: endpoint,
    data: formData,
    headers: {
      'Idempotency-Key': idempotencyKey,
      // Don't set Content-Type - browser will set with boundary
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
    } : undefined
  }

  return requestWithRetry<T>(config)
}

/**
 * Updates team with multipart data (PUT request)
 */
export async function updateMultipartWithRetry<T>(
  endpoint: string,
  formData: FormData,
  options: UploadOptions
): Promise<BackendResponse<T>> {
  const { idempotencyKey, onProgress } = options

  const config: AxiosRequestConfig = {
    method: 'PUT',
    url: endpoint,
    data: formData,
    headers: {
      'Idempotency-Key': idempotencyKey,
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
    } : undefined
  }

  return requestWithRetry<T>(config)
}

// ============================================================================
// STANDARD API METHODS (Non-multipart)
// ============================================================================

/**
 * GET request with retry
 */
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

/**
 * POST request with retry (JSON)
 */
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

/**
 * PUT request with retry (JSON)
 */
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

/**
 * DELETE request with retry
 */
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
// ABORT CONTROLLER SUPPORT
// ============================================================================

/**
 * Creates an AbortController with timeout
 * Useful for cancelling long-running requests
 * 
 * @example
 * ```ts
 * const { signal, cancel } = createAbortController(30000)
 * try {
 *   const response = await getWithRetry('/api/data', { signal })
 * } catch (error) {
 *   if (axios.isCancel(error)) {
 *     console.log('Request cancelled')
 *   }
 * }
 * ```
 */
export function createAbortController(timeoutMs?: number): {
  signal: AbortSignal
  cancel: () => void
} {
  const controller = new AbortController()
  
  if (timeoutMs) {
    setTimeout(() => controller.abort(), timeoutMs)
  }
  
  return {
    signal: controller.signal,
    cancel: () => controller.abort()
  }
}

// ============================================================================
// UNIFIED ERROR PARSING
// ============================================================================

/**
 * Unified error parser that handles all error types
 * Returns a consistent error object regardless of error source
 */
export function parseApiError(error: unknown): {
  message: string
  errorCode?: string
  details?: Record<string, any>
  isNetworkError: boolean
  isRetryable: boolean
} {
  // Axios error
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    
    // Check if response has backend error format
    if (axiosError.response && isBackendError(axiosError.response.data)) {
      const backendError = axiosError.response.data as BackendError
      return {
        message: backendError.message,
        errorCode: backendError.error_code,
        details: backendError.details,
        isNetworkError: false,
        isRetryable: isRetryableError(axiosError),
      }
    }
    
    // Network error (no response)
    if (!axiosError.response) {
      return {
        message: 'Network error. Please check your internet connection and try again.',
        errorCode: 'NETWORK_ERROR',
        isNetworkError: true,
        isRetryable: true,
      }
    }
    
    // Timeout
    if (axiosError.code === 'ECONNABORTED') {
      return {
        message: 'Request timed out. Please try again.',
        errorCode: 'TIMEOUT',
        isNetworkError: true,
        isRetryable: true,
      }
    }
    
    // Cancelled request
    if (axios.isCancel(error)) {
      return {
        message: 'Request was cancelled.',
        errorCode: 'CANCELLED',
        isNetworkError: false,
        isRetryable: false,
      }
    }
    
    // Other HTTP errors
    return {
      message: `Request failed with status ${axiosError.response.status}: ${axiosError.message}`,
      errorCode: `HTTP_${axiosError.response.status}`,
      isNetworkError: false,
      isRetryable: isRetryableError(axiosError),
    }
  }
  
  // Generic error
  if (error instanceof Error) {
    return {
      message: error.message,
      errorCode: 'UNKNOWN_ERROR',
      isNetworkError: false,
      isRetryable: false,
    }
  }
  
  // Unknown error type
  return {
    message: 'An unexpected error occurred',
    errorCode: 'UNKNOWN_ERROR',
    isNetworkError: false,
    isRetryable: false,
  }
}

// ============================================================================
// ERROR EXTRACTION HELPERS
// ============================================================================

/**
 * Extracts user-friendly error message from backend response
 */
export function extractErrorMessage(response: BackendResponse): string {
  if ('error_code' in response && response.success === false) {
    return response.message
  }
  return 'An unexpected error occurred'

}

/**
 * Extracts error code from backend response
 */
export function extractErrorCode(response: BackendResponse): string | null {
  if ('error_code' in response && response.success === false) {
    return response.error_code
  }
  return null
}

/**
 * Checks if response is successful
 */
export function isSuccessResponse<T>(
  response: BackendResponse<T>
): response is BackendSuccess<T> {
  return response.success === true
}

// ============================================================================
// NETWORK ERROR HANDLER
// ============================================================================

/**
 * Handles Axios errors and returns user-friendly message
 */
export function handleAxiosError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Network error. Please check your internet connection and try again.'
    }

    if (error.response.status === 413) {
      return 'Files are too large. Please reduce file sizes and try again.'
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
