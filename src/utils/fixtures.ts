/**
 * Fixtures — shared match types + helpers for the Fixtures page and PDF export.
 * Data comes from GET /api/schedule/matches (managed in Admin → Schedule).
 */

export type MatchStatus = 'scheduled' | 'live' | 'completed'

export interface MatchResult {
  winner: string
  margin: number
  marginType: 'runs' | 'wickets'
  wonByBattingFirst?: boolean
}

export interface Match {
  id: number
  round: string
  round_number: number
  match_number: number
  team1: string
  team2: string
  status: MatchStatus
  toss_winner?: string | null
  toss_choice?: 'bat' | 'bowl' | null
  scheduled_start_time?: string | null
  team1_first_innings_runs?: number | null
  team1_first_innings_wickets?: number | null
  team2_first_innings_runs?: number | null
  team2_first_innings_wickets?: number | null
  match_score_url?: string | null
  result?: MatchResult | null
}

export interface RoundGroup {
  roundNumber: number
  round: string
  matches: Match[]
}

const API_URL = import.meta.env.VITE_API_URL || 'https://icct26-backend.onrender.com'

/** Fetch all matches, normalised and sorted by round then match number. */
export async function fetchMatches(): Promise<Match[]> {
  const res = await fetch(`${API_URL}/api/schedule/matches`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Could not load fixtures (HTTP ${res.status})`)
  const data = await res.json()
  const raw: Array<Record<string, unknown>> = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []

  return raw
    .map((m) => {
      const status = String(m.status ?? 'scheduled')
      return {
        ...(m as unknown as Match),
        round: String(m.round ?? `Round ${m.round_number ?? ''}`).trim(),
        round_number: Number(m.round_number ?? 0),
        match_number: Number(m.match_number ?? 0),
        status: (status === 'done' ? 'completed' : status) as MatchStatus,
      }
    })
    .sort((a, b) => a.round_number - b.round_number || a.match_number - b.match_number)
}

export function groupByRound(matches: Match[]): RoundGroup[] {
  const map = new Map<number, RoundGroup>()
  matches.forEach((m) => {
    const g = map.get(m.round_number) ?? { roundNumber: m.round_number, round: m.round, matches: [] }
    g.matches.push(m)
    map.set(m.round_number, g)
  })
  return [...map.values()].sort((a, b) => a.roundNumber - b.roundNumber)
}

export const hasScore = (runs?: number | null) => runs !== null && runs !== undefined

export const formatScore = (runs?: number | null, wickets?: number | null) =>
  hasScore(runs) ? `${runs}/${wickets ?? 0}` : ''

export const formatMatchTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : 'Time TBA'

export const formatMatchDay = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : ''

export const resultText = (m: Match) =>
  m.result ? `${m.result.winner} won by ${m.result.margin} ${m.result.marginType}` : ''

export const statusLabel: Record<MatchStatus, string> = {
  scheduled: 'Upcoming',
  live: 'Live',
  completed: 'Result',
}
