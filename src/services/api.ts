/**
 * API Service Layer
 * Centralized backend communication for the ICCT26 frontend
 */

import { API_CONFIG } from '../config/app.config'

export interface TeamRegistrationPayload {
  team_name: string
  church_name: string
  captain: {
    name: string
    phone: string
    email: string
    whatsapp: string
  }
  viceCaptain: {
    name: string
    phone: string
    email: string
    whatsapp: string
  }
  payment_receipt: string
  pastor_letter: string
  players: Array<{
    name: string
    age: number
    phone: string
    role: string
    jersey_number: string
    aadhar_file: string
    subscription_file: string
  }>
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
    return this.request('/api/register/team', {
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
    return this.request('/health')
  }

  /**
   * Get API status
   */
  async getApiStatus(): Promise<any> {
    return this.request('/status')
  }

  /**
   * Get database stats
   */
  async getDatabaseStats(): Promise<any> {
    return this.request('/db')
  }

  /**
   * Get all registered teams (Team Management)
   */
  async getAllTeams(): Promise<any> {
    return this.request('/api/teams')
  }

  /**
   * Get team details by ID (Team Management)
   */
  async getTeamById(teamId: string): Promise<any> {
    return this.request(`/api/teams/${teamId}`)
  }

  /**
   * Admin: Get all registered teams
   */
  async getAdminTeams(): Promise<any> {
    return this.request('/admin/teams')
  }

  /**
   * Admin: Get team details by ID
   */
  async getAdminTeamById(teamId: string): Promise<any> {
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
   * Get all teams from database
   */
  async getTeamsFromDatabase(): Promise<any> {
    return this.request('/api/teams')
  }

  /**
   * Get all players from database
   */
  async getPlayersFromDatabase(): Promise<any> {
    return this.request('/api/players')
  }
}

export const apiService = new ApiService()
