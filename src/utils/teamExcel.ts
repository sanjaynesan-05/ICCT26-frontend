/**
 * Excel export for admin pages.
 *
 * Every team gets one sheet in the same layout, used by both
 * "Download Excel" (Team Detail) and "Export All Teams" (Admin Dashboard):
 *
 *   Team / church / captain header rows
 *   Player ID | Player Name | Round 1 | Round 2 | Semi-Final | Final
 *   ☐ boxes under every round for each player, to tick on match day
 */

import * as XLSX from 'xlsx'
import { type AdminTeam } from './adminTeams'

export const ROUND_COLUMNS = ['Round 1', 'Round 2', 'Semi-Final', 'Final'] as const

const EMPTY_BOX = '☐'

const buildTeamRows = (team: AdminTeam): (string | number)[][] => [
  [`${team.teamName} (${team.teamId})`],
  ['Church', team.churchName],
  ['Captain', `${team.captainName}${team.captainPhone ? ` · ${team.captainPhone}` : ''}`],
  ['Vice-Captain', `${team.viceCaptainName}${team.viceCaptainPhone ? ` · ${team.viceCaptainPhone}` : ''}`],
  ['Status', team.registrationStatus.toUpperCase()],
  [`Players: ${team.players.length}`, `Tick ${EMPTY_BOX} → ☑ for each player who plays the round`],
  [],
  ['Player ID', 'Player Name', ...ROUND_COLUMNS],
  ...team.players.map((p) => [p.playerId, p.name, ...ROUND_COLUMNS.map(() => EMPTY_BOX)]),
]

const buildTeamSheet = (team: AdminTeam): XLSX.WorkSheet => {
  const ws = XLSX.utils.aoa_to_sheet(buildTeamRows(team))
  ws['!cols'] = [{ wch: 16 }, { wch: 34 }, ...ROUND_COLUMNS.map(() => ({ wch: 12 }))]
  return ws
}

/** Excel sheet names: max 31 chars, unique, none of : \ / ? * [ ] */
const uniqueSheetName = (team: AdminTeam, used: Set<string>): string => {
  const base = (team.teamName || team.teamId).replace(/[:\\/?*[\]]/g, ' ').trim().slice(0, 31) || 'Team'
  let name = base
  for (let i = 2; used.has(name.toLowerCase()); i++) {
    const suffix = ` (${i})`
    name = base.slice(0, 31 - suffix.length) + suffix
  }
  used.add(name.toLowerCase())
  return name
}

const safeFilePart = (value: string) => value.replace(/[^\w-]+/g, '_').replace(/^_+|_+$/g, '')
const today = () => new Date().toISOString().split('T')[0]

export const exportTeamToExcel = (team: AdminTeam) => {
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, buildTeamSheet(team), uniqueSheetName(team, new Set()))
  XLSX.writeFile(wb, `ICCT27_${safeFilePart(team.teamName)}_${safeFilePart(team.teamId)}_${today()}.xlsx`)
}

export const exportTeamsToExcel = (teams: AdminTeam[], label = 'All_Teams') => {
  const wb = XLSX.utils.book_new()
  const used = new Set<string>()
  teams.forEach((team) => {
    XLSX.utils.book_append_sheet(wb, buildTeamSheet(team), uniqueSheetName(team, used))
  })
  XLSX.writeFile(wb, `ICCT27_${safeFilePart(label)}_${today()}.xlsx`)
}
