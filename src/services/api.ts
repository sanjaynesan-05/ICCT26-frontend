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
  groupPhoto: string
  players: Array<{
    name: string
    role: string
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
   * Register a team using multipart/form-data
   */
  async registerTeamMultipart(formData: FormData): Promise<any> {
    const url = this.getUrl('/api/register/team')
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
        }))
        throw new Error(errorData.detail || JSON.stringify(errorData))
      }

      return await response.json()
    } catch (error) {
      console.error('Multipart registration error:', error)
      throw error
    }
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
  async getAdminTeams(status?: 'pending' | 'confirmed' | 'rejected'): Promise<any> {
    const queryParam = status ? `?status=${status}` : ''
    return this.request(`/admin/teams${queryParam}`)
  }

  /**
   * Admin: Get team details by ID
   */
  async getAdminTeamById(teamId: string): Promise<any> {
    return this.request(`/admin/teams/${teamId}`)
  }

  /**
   * Admin: Confirm/Approve team registration
   */
  async confirmTeam(teamId: string): Promise<any> {
    return this.request(`/admin/teams/${teamId}/confirm`, {
      method: 'PUT'
    })
  }

  /**
   * Admin: Reject team registration
   */
  async rejectTeam(teamId: string): Promise<any> {
    return this.request(`/admin/teams/${teamId}/reject`, {
      method: 'PUT'
    })
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

  /**
   * MATCH SCHEDULE API METHODS
   */

  /**
   * Get all matches
   */
  async getAllMatches(skip: number = 0, limit: number = 100): Promise<any> {
    return this.request(`/api/schedule/matches?skip=${skip}&limit=${limit}`)
  }

  /**
   * Get single match by ID
   */
  async getMatchById(matchId: number): Promise<any> {
    return this.request(`/api/schedule/matches/${matchId}`)
  }

  /**
   * Create a new match
   */
  async createMatch(matchData: {
    round: string
    round_number: number
    match_number: number
    team1: string
    team2: string
    scheduled_start_time?: string
  }): Promise<any> {
    return this.request('/api/schedule/matches', {
      method: 'POST',
      body: JSON.stringify(matchData)
    })
  }

  /**
   * Update entire match (full update)
   */
  async updateMatch(matchId: number, matchData: {
    round?: string
    round_number?: number
    match_number?: number
    team1?: string
    team2?: string
    scheduled_start_time?: string
  }): Promise<any> {
    return this.request(`/api/schedule/matches/${matchId}`, {
      method: 'PUT',
      body: JSON.stringify(matchData)
    })
  }

  /**
   * Update match status
   */
  async updateMatchStatus(matchId: number, status: 'scheduled' | 'live' | 'completed'): Promise<any> {
    return this.request(`/api/schedule/matches/${matchId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  }

  /**
   * Update toss details
   */
  async updateMatchToss(matchId: number, tossData: {
    toss_winner: string
    toss_choice: 'bat' | 'bowl'
  }): Promise<any> {
    return this.request(`/api/schedule/matches/${matchId}/toss`, {
      method: 'PUT',
      body: JSON.stringify(tossData)
    })
  }

  /**
   * Update match timing
   */
  async updateMatchTiming(matchId: number, timingData: {
    scheduled_start_time?: string | null
    actual_start_time?: string | null
    match_end_time?: string | null
  }): Promise<any> {
    return this.request(`/api/schedule/matches/${matchId}/timing`, {
      method: 'PUT',
      body: JSON.stringify(timingData)
    })
  }

  /**
   * Update innings scores with separate runs and wickets
   */
  async updateMatchScores(matchId: number, scoresData: {
    team1_runs?: number | null
    team1_wickets?: number | null
    team2_runs?: number | null
    team2_wickets?: number | null
  }): Promise<any> {
    return this.request(`/api/schedule/matches/${matchId}/scores`, {
      method: 'PUT',
      body: JSON.stringify(scoresData)
    })
  }

  /**
   * Update match scorecard URL (NEW)
   */
  async updateMatchScoreUrl(matchId: number, scoreUrl: string): Promise<any> {
    return this.request(`/api/schedule/matches/${matchId}/score-url`, {
      method: 'PUT',
      body: JSON.stringify({ match_score_url: scoreUrl })
    })
  }

  /**
   * Set match result
   */
  async setMatchResult(matchId: number, resultData: {
    winner: string
    margin: number
    marginType: 'runs' | 'wickets'
    wonByBattingFirst: boolean
  }): Promise<any> {
    return this.request(`/api/schedule/matches/${matchId}/result`, {
      method: 'POST',
      body: JSON.stringify(resultData)
    })
  }

  /**
   * Delete match
   */
  async deleteMatch(matchId: number): Promise<any> {
    return this.request(`/api/schedule/matches/${matchId}`, {
      method: 'DELETE'
    })
  }

  /**
   * 4-STAGE MATCH WORKFLOW ENDPOINTS
   */

  /**
   * Stage 2: Start Match (scheduled → live)
   * Add toss info, score URL, and actual start time
   */
  async startMatch(matchId: number, startData: {
    toss_winner: string
    toss_choice: 'bat' | 'bowl'
    match_score_url: string
    actual_start_time: string
  }): Promise<any> {
    return this.request(`/api/schedule/matches/${matchId}/start`, {
      method: 'PUT',
      body: JSON.stringify(startData)
    })
  }

  /**
   * Stage 3A: Record First Innings Score (status stays live)
   */
  async recordFirstInningsScore(matchId: number, scoreData: {
    batting_team: string
    runs: number
    wickets: number
  }): Promise<any> {
    return this.request(`/api/schedule/matches/${matchId}/first-innings-score`, {
      method: 'PUT',
      body: JSON.stringify(scoreData)
    })
  }

  /**
   * Stage 3B: Record Second Innings Score (status stays live)
   */
  async recordSecondInningsScore(matchId: number, scoreData: {
    batting_team: string
    runs: number
    wickets: number
  }): Promise<any> {
    return this.request(`/api/schedule/matches/${matchId}/second-innings-score`, {
      method: 'PUT',
      body: JSON.stringify(scoreData)
    })
  }

  /**
   * Stage 4: Finish Match (live → completed)
   * Record winner, margin, and match end time
   */
  async finishMatch(matchId: number, finishData: {
    winner: string
    margin: number
    margin_type: 'runs' | 'wickets'
    match_end_time: string
  }): Promise<any> {
    return this.request(`/api/schedule/matches/${matchId}/finish`, {
      method: 'PUT',
      body: JSON.stringify(finishData)
    })
  }

  /**
   * Update team using multipart/form-data (supports partial file updates)
   */
  async updateTeamMultipart(teamId: string, formData: FormData): Promise<any> {
    const url = this.getUrl(`/api/teams/${teamId}`)
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
        }))
        throw new Error(errorData.detail || JSON.stringify(errorData))
      }

      return await response.json()
    } catch (error) {
      console.error('Team update error:', error)
      throw error
    }
  }

  /**
   * Update player using multipart/form-data (supports partial file updates)
   */
  async updatePlayerMultipart(playerId: string, formData: FormData): Promise<any> {
    const url = this.getUrl(`/api/players/${playerId}`)
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
        }))
        throw new Error(errorData.detail || JSON.stringify(errorData))
      }

      return await response.json()
    } catch (error) {
      console.error('Player update error:', error)
      throw error
    }
  }
}

export const apiService = new ApiService()
