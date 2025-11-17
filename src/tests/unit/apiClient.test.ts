import {
  isRetryableError,
  parseApiError,
  createAbortController,
} from '../../utils/apiClient'
import axios, { AxiosError } from 'axios'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('API Client Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createAbortController', () => {
    it('should create abort controller without timeout', () => {
      const { signal, cancel } = createAbortController()
      
      expect(signal).toBeDefined()
      expect(signal.aborted).toBe(false)
      expect(typeof cancel).toBe('function')
    })

    it('should allow manual cancellation', () => {
      const { signal, cancel } = createAbortController()
      
      expect(signal.aborted).toBe(false)
      cancel()
      expect(signal.aborted).toBe(true)
    })

    it('should auto-abort after timeout', async () => {
      jest.useFakeTimers()
      const { signal } = createAbortController(1000)
      
      expect(signal.aborted).toBe(false)
      
      jest.advanceTimersByTime(1000)
      
      expect(signal.aborted).toBe(true)
      
      jest.useRealTimers()
    })

    it('should not auto-abort if no timeout specified', async () => {
      jest.useFakeTimers()
      const { signal } = createAbortController()
      
      expect(signal.aborted).toBe(false)
      
      jest.advanceTimersByTime(10000)
      
      expect(signal.aborted).toBe(false)
      
      jest.useRealTimers()
    })
  })

  describe('parseApiError', () => {
    it('should parse backend error response', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            success: false,
            error_code: 'VALIDATION_ERROR',
            message: 'Invalid phone number',
            details: { field: 'phone' },
          },
          statusText: 'Bad Request',
          headers: {},
          config: {} as any,
        },
        config: {} as any,
        name: 'AxiosError',
        message: 'Request failed',
      }

      mockedAxios.isAxiosError.mockReturnValue(true)
      
      const parsed = parseApiError(axiosError as AxiosError)
      
      expect(parsed.message).toBe('Invalid phone number')
      expect(parsed.errorCode).toBe('VALIDATION_ERROR')
      expect(parsed.details).toEqual({ field: 'phone' })
      expect(parsed.isNetworkError).toBe(false)
    })

    it('should parse network error (no response)', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: undefined,
        config: {} as any,
        name: 'AxiosError',
        message: 'Network Error',
      }

      mockedAxios.isAxiosError.mockReturnValue(true)
      
      const parsed = parseApiError(axiosError as AxiosError)
      
      expect(parsed.message).toContain('Network error')
      expect(parsed.errorCode).toBe('NETWORK_ERROR')
      expect(parsed.isNetworkError).toBe(true)
      expect(parsed.isRetryable).toBe(true)
    })

    it('should parse timeout error', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        code: 'ECONNABORTED',
        response: undefined,
        config: {} as any,
        name: 'AxiosError',
        message: 'timeout exceeded',
      }

      mockedAxios.isAxiosError.mockReturnValue(true)
      
      const parsed = parseApiError(axiosError as AxiosError)
      
      expect(parsed.message).toContain('timed out')
      expect(parsed.errorCode).toBe('TIMEOUT')
      expect(parsed.isNetworkError).toBe(true)
      expect(parsed.isRetryable).toBe(true)
    })

    it('should parse cancelled request', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        config: {} as any,
        name: 'AxiosError',
        message: 'cancelled',
      }

      mockedAxios.isAxiosError.mockReturnValue(true)
      mockedAxios.isCancel.mockReturnValue(true)
      
      const parsed = parseApiError(axiosError as AxiosError)
      
      expect(parsed.message).toContain('cancelled')
      expect(parsed.errorCode).toBe('CANCELLED')
      expect(parsed.isNetworkError).toBe(false)
      expect(parsed.isRetryable).toBe(false)
    })

    it('should parse generic HTTP error', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {},
          statusText: 'Not Found',
          headers: {},
          config: {} as any,
        },
        config: {} as any,
        name: 'AxiosError',
        message: 'Request failed with status code 404',
      }

      mockedAxios.isAxiosError.mockReturnValue(true)
      
      const parsed = parseApiError(axiosError as AxiosError)
      
      expect(parsed.message).toContain('404')
      expect(parsed.errorCode).toBe('HTTP_404')
      expect(parsed.isNetworkError).toBe(false)
    })

    it('should parse generic Error object', () => {
      const error = new Error('Something went wrong')
      
      mockedAxios.isAxiosError.mockReturnValue(false)
      
      const parsed = parseApiError(error)
      
      expect(parsed.message).toBe('Something went wrong')
      expect(parsed.errorCode).toBe('UNKNOWN_ERROR')
      expect(parsed.isNetworkError).toBe(false)
      expect(parsed.isRetryable).toBe(false)
    })

    it('should handle unknown error types', () => {
      mockedAxios.isAxiosError.mockReturnValue(false)
      
      const parsed = parseApiError('some string error')
      
      expect(parsed.message).toBe('An unexpected error occurred')
      expect(parsed.errorCode).toBe('UNKNOWN_ERROR')
      expect(parsed.isNetworkError).toBe(false)
      expect(parsed.isRetryable).toBe(false)
    })
  })

  describe('Integration: Request lifecycle', () => {
    it('should handle complete request flow with abort', async () => {
      const { signal, cancel } = createAbortController()
      
      expect(signal.aborted).toBe(false)
      
      // Simulate request cancellation
      cancel()
      
      expect(signal.aborted).toBe(true)
      
      // Parse the cancellation error
      const cancelError: Partial<AxiosError> = {
        isAxiosError: true,
        message: 'Request cancelled',
        config: {} as any,
        name: 'AxiosError',
      }
      
      mockedAxios.isAxiosError.mockReturnValue(true)
      mockedAxios.isCancel.mockReturnValue(true)
      
      const parsed = parseApiError(cancelError as AxiosError)
      
      expect(parsed.errorCode).toBe('CANCELLED')
      expect(parsed.isRetryable).toBe(false)
    })

    it('should handle timeout scenario', async () => {
      jest.useFakeTimers()
      
      const { signal } = createAbortController(5000)
      
      expect(signal.aborted).toBe(false)
      
      // Simulate timeout
      jest.advanceTimersByTime(5000)
      
      expect(signal.aborted).toBe(true)
      
      // Parse timeout error
      const timeoutError: Partial<AxiosError> = {
        isAxiosError: true,
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
        config: {} as any,
        name: 'AxiosError',
      }
      
      mockedAxios.isAxiosError.mockReturnValue(true)
      
      const parsed = parseApiError(timeoutError as AxiosError)
      
      expect(parsed.errorCode).toBe('TIMEOUT')
      expect(parsed.isRetryable).toBe(true)
      
      jest.useRealTimers()
    })
  })
})
