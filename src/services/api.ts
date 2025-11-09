/**
 * API Service Layer
 * Centralized backend communication for the ICCT26 frontend
 */

import { API_CONFIG } from '../config/app.config'

export interface TeamRegistrationPayload {
  churchName: string
  teamName: string
  pastorLetter: string
  captain: {
    name: string
    phone: string
    whatsapp: string
    email: string
  }
  viceCaptain: {
    name: string
    phone: string
    whatsapp: string
    email: string
  }
  players: Array<{
    name: string
    age: number
    phone: string
    role: string
    aadharFile: string
    subscriptionFile: string
  }>
  paymentReceipt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  detail?: string
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl
  }

  /**
   * Get the full API URL
   */
  private getUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = this.getUrl(endpoint)
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
        }))
        throw new Error(errorData.detail || JSON.stringify(errorData))
      }

      return await response.json()
    } catch (error) {
      // Better error messages for common issues
      let message = 'Network error'
      
      if (error instanceof TypeError) {
        if (error.message.includes('Failed to fetch')) {
          message = `Cannot reach backend at ${this.baseUrl}. Make sure:\n1. Backend is running on ${this.baseUrl}\n2. Backend has CORS enabled\n3. Check your .env file: VITE_API_URL=${this.baseUrl}`
        } else if (error.message.includes('CORS')) {
          message = `CORS Error: Backend at ${this.baseUrl} needs to allow requests from this origin. Contact backend administrator.`
        } else {
          message = error.message
        }
      } else if (error instanceof Error) {
        message = error.message
      }
      
      console.error(`API Error [${endpoint}]:`, error)
      throw new Error(message)
    }
  }

  /**
   * Register a team
   */
  async registerTeam(payload: TeamRegistrationPayload): Promise<any> {
    return this.request('/register/team', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  /**
   * Get registration status
   */
  async getRegistrationStatus(): Promise<any> {
    return this.request('/status')
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<any> {
    return this.request('/')
  }

  /**
   * Admin: Get all registered teams
   */
  async getAllTeams(): Promise<any> {
    return this.request('/admin/teams')
  }

  /**
   * Admin: Get team details by ID
   */
  async getTeamById(teamId: string): Promise<any> {
    return this.request(`/admin/teams/${teamId}`)
  }

  /**
   * Admin: Get player details
   */
  async getPlayerById(playerId: string): Promise<any> {
    return this.request(`/admin/players/${playerId}`)
  }

  /**
   * Admin: Get all registrations (teams + players)
   */
  async getAllRegistrations(): Promise<any> {
    return this.request('/admin/registrations')
  }

  /**
   * Get all registered teams from database (alternative endpoint)
   */
  async getTeamsFromDatabase(): Promise<any> {
    return this.request('/teams')
  }

  /**
   * Get all players from database (alternative endpoint)
   */
  async getPlayersFromDatabase(): Promise<any> {
    return this.request('/players')
  }
}

export const apiService = new ApiService()
