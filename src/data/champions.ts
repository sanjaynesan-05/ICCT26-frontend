/**
 * Hall of Champions — derived from src/data/seasons.ts.
 *
 * Edit champions, runners-up and champions' photos in seasons.ts;
 * the Home page strip and the Gallery both update from there.
 */

import { SEASONS, formatCredit } from './seasons'

export interface Champion {
  season: number
  year: number
  edition: string
  team: string
  church: string
  runnerUp?: string
  image?: string
}

export const CHAMPIONS: Champion[] = SEASONS.filter((s) => s.status === 'completed').map((s) => ({
  season: s.season,
  year: s.year,
  edition: s.edition,
  team: s.champion?.team ?? '',
  church: s.champion?.place ?? '',
  runnerUp: formatCredit(s.runnerUp),
  image: s.championsPhoto ?? '',
}))

/** The season being played now — shown as the "who will win?" card */
const upcoming = SEASONS.find((s) => s.status === 'upcoming')
export const NEXT_SEASON = upcoming
  ? { season: upcoming.season, year: upcoming.year, edition: upcoming.edition }
  : { season: SEASONS.length + 1, year: new Date().getFullYear(), edition: '' }
