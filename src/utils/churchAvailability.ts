/**
 * Church Availability Utility
 * Manages fetching and caching of church team counts and capacity status
 */

export interface ChurchAvailability {
  church_name: string
  team_count: number
  locked: boolean
}

export interface ChurchAvailabilityResponse {
  churches: ChurchAvailability[]
  summary: {
    total_churches: number
    locked_churches: number
    available_churches: number
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://icct26-backend.onrender.com'

/**
 * Fetch church availability from backend
 * Shows how many teams are registered for each church
 */
export const fetchChurchAvailability = async (): Promise<ChurchAvailabilityResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/churches/availability`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch church availability: ${response.status}`)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching church availability:', error)
    return null
  }
}

/**
 * Check if a specific church is at capacity (locked)
 */
export const isChurchLocked = (
  churchName: string,
  churchAvailability: ChurchAvailability[] | undefined
): boolean => {
  if (!churchAvailability) return false
  const church = churchAvailability.find((c) => c.church_name === churchName)
  return church?.locked ?? false
}

/**
 * Get team count for a specific church
 */
export const getChurchTeamCount = (
  churchName: string,
  churchAvailability: ChurchAvailability[] | undefined
): number => {
  if (!churchAvailability) return 0
  const church = churchAvailability.find((c) => c.church_name === churchName)
  return church?.team_count ?? 0
}

/**
 * Get capacity status text (e.g., "2/2", "1/2")
 */
export const getChurchCapacityText = (
  churchName: string,
  churchAvailability: ChurchAvailability[] | undefined
): string => {
  const count = getChurchTeamCount(churchName, churchAvailability)
  return `${count}/2 teams`
}
