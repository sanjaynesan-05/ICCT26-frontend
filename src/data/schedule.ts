/**
 * Tournament Schedule Data
 * Contains all match information for ICCT26
 */

import type { Match } from '../types'

export const MATCHES: Match[] = [
  {
    id: 1,
    match: 'Match 1 - Group A',
    date: '2026-01-24',
    time: '09:00 AM',
    venue: 'Main Ground',
    teamA: 'Thunder Strikers',
    teamB: 'Lightning Warriors',
    status: 'upcoming',
  },
  {
    id: 2,
    match: 'Match 2 - Group A',
    date: '2026-01-24',
    time: '02:00 PM',
    venue: 'Main Ground',
    teamA: 'Royal Challengers',
    teamB: 'Super Kings',
    status: 'upcoming',
  },
  {
    id: 3,
    match: 'Match 3 - Group B',
    date: '2026-01-25',
    time: '10:00 AM',
    venue: 'Main Ground',
    teamA: 'Mumbai Titans',
    teamB: 'Delhi Daredevils',
    status: 'upcoming',
  },
  {
    id: 4,
    match: 'Match 4 - Group B',
    date: '2026-01-25',
    time: '03:00 PM',
    venue: 'Main Ground',
    teamA: 'Kolkata Knights',
    teamB: 'Punjab Panthers',
    status: 'upcoming',
  },
  {
    id: 5,
    match: 'Semi Final',
    date: '2026-01-25',
    time: '06:00 PM',
    venue: 'Main Ground',
    teamA: 'TBD',
    teamB: 'TBD',
    status: 'upcoming',
  },
  {
    id: 6,
    match: 'Grand Final',
    date: '2026-01-26',
    time: '02:00 PM',
    venue: 'Main Ground',
    teamA: 'TBD',
    teamB: 'TBD',
    status: 'upcoming',
  },
]

/**
 * Get unique match dates
 */
export const UNIQUE_MATCH_DATES = Array.from(new Set(MATCHES.map(m => m.date)))

/**
 * Filter matches by date
 */
export const getMatchesByDate = (date: string): Match[] => {
  return MATCHES.filter(m => m.date === date)
}

/**
 * Get all upcoming matches
 */
export const getUpcomingMatches = (): Match[] => {
  return MATCHES.filter(m => m.status === 'upcoming')
}

/**
 * Get match by ID
 */
export const getMatchById = (id: number): Match | undefined => {
  return MATCHES.find(m => m.id === id)
}
