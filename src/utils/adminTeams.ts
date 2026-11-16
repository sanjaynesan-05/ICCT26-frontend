/**
 * Admin team data (2027 registration format)
 *
 * A team registration now carries only:
 * - team + church name, captain & vice-captain contact details
 * - 13–17 players (name + generated player ID)
 * - one payment receipt (Cloudinary URL)
 * - registration status: pending | confirmed | rejected
 *
 * The backend may answer in camelCase, snake_case or with nested captain objects,
 * so every admin page goes through normalizeTeam() / normalizePlayer().
 */

export type RegistrationStatus = 'pending' | 'confirmed' | 'rejected'

export interface AdminPlayer {
  playerId: string
  name: string
}

export interface AdminTeam {
  teamId: string
  teamName: string
  churchName: string
  captainName: string
  captainPhone: string
  captainEmail: string
  captainWhatsapp: string
  viceCaptainName: string
  viceCaptainPhone: string
  viceCaptainEmail: string
  viceCaptainWhatsapp: string
  paymentReceipt: string
  registrationStatus: RegistrationStatus
  registrationDate: string
  playerCount: number
  players: AdminPlayer[]
}

type Raw = Record<string, unknown>

const str = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value.trim()
    if (typeof value === 'number') return String(value)
  }
  return ''
}

const obj = (value: unknown): Raw => (value && typeof value === 'object' ? (value as Raw) : {})

/** Keeps only real http(s) URLs; drops null, {}, data:/file: and local paths. */
export const cleanFileUrl = (url: unknown): string => {
  if (typeof url !== 'string') return ''
  const trimmed = url.trim()
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : ''
}

export const getFileKind = (url: string): 'image' | 'pdf' | 'other' => {
  // Ignore query strings / fragments when reading the extension
  const ext = url.split(/[?#]/)[0].split('.').pop()?.toLowerCase() || ''
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return 'image'
  if (ext === 'pdf') return 'pdf'
  return 'other'
}

const toStatus = (value: unknown): RegistrationStatus => {
  const status = str(value).toLowerCase()
  return status === 'confirmed' || status === 'rejected' ? status : 'pending'
}

export const formatRegistrationDate = (value: string): string => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const normalizePlayer = (raw: unknown, index: number): AdminPlayer => {
  const p = obj(raw)
  return {
    playerId: str(p.playerId, p.player_id) || `#${index + 1}`,
    name: str(p.name, p.player_name) || 'Unnamed Player',
  }
}

/** Accepts a team object, optionally with its players array passed separately. */
export const normalizeTeam = (raw: unknown, playersRaw?: unknown): AdminTeam => {
  const t = obj(raw)
  const captain = obj(t.captain)
  const vice = obj(t.viceCaptain ?? t.vice_captain)
  const playersSource = Array.isArray(playersRaw) ? playersRaw : Array.isArray(t.players) ? t.players : []
  const players = playersSource.map(normalizePlayer)
  const declaredCount = Number(t.playerCount ?? t.player_count)

  return {
    teamId: str(t.teamId, t.team_id) || 'UNKNOWN-ID',
    teamName: str(t.teamName, t.team_name) || 'Unnamed Team',
    churchName: str(t.churchName, t.church_name) || 'Unknown Church',
    captainName: str(captain.name, t.captainName, t.captain_name) || 'N/A',
    captainPhone: str(captain.phone, t.captainPhone, t.captain_phone),
    captainEmail: str(captain.email, t.captainEmail, t.captain_email),
    captainWhatsapp: str(captain.whatsapp, t.captainWhatsapp, t.captain_whatsapp),
    viceCaptainName: str(vice.name, t.viceCaptainName, t.vice_captain_name) || 'N/A',
    viceCaptainPhone: str(vice.phone, t.viceCaptainPhone, t.vice_captain_phone),
    viceCaptainEmail: str(vice.email, t.viceCaptainEmail, t.vice_captain_email),
    viceCaptainWhatsapp: str(vice.whatsapp, t.viceCaptainWhatsapp, t.vice_captain_whatsapp),
    paymentReceipt: cleanFileUrl(t.paymentReceipt ?? t.payment_receipt),
    registrationStatus: toStatus(t.registrationStatus ?? t.registration_status),
    registrationDate: str(t.registrationDate, t.registration_date, t.created_at),
    playerCount: players.length || (Number.isFinite(declaredCount) ? declaredCount : 0),
    players,
  }
}

/** Unwraps { team, players } / { data: { team, players } } / plain team responses. */
export const normalizeTeamResponse = (response: unknown): AdminTeam | null => {
  const r = obj(response)
  const data = obj(r.data)
  const team = r.team ?? data.team ?? (Object.keys(data).length ? data : r)
  if (!team || typeof team !== 'object' || !Object.keys(team as Raw).length) return null
  const players = r.players ?? data.players
  return normalizeTeam(team, players)
}

/** Unwraps list responses: [..] / { data: [..] } / { teams: [..] }. */
export const extractTeamList = (response: unknown): unknown[] => {
  if (Array.isArray(response)) return response
  const r = obj(response)
  if (Array.isArray(r.data)) return r.data
  if (Array.isArray(r.teams)) return r.teams
  const data = obj(r.data)
  if (Array.isArray(data.teams)) return data.teams
  return []
}

export const STATUS_BADGE_CLASSES: Record<RegistrationStatus, string> = {
  pending: 'bg-gold/15 text-gold border-gold/40',
  confirmed: 'bg-pitch/15 text-pitch-light border-pitch/40',
  rejected: 'bg-flame/15 text-flame-light border-flame/40',
}
