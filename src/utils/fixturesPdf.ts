/**
 * Fixtures PDF — branded A4 schedule generated in the browser from the live
 * match data. jsPDF is loaded on demand only when someone downloads.
 */

import { TOURNAMENT } from '../data/home'
import { VENUE } from '../data/contact'
import {
  type Match,
  formatMatchDay,
  formatMatchTime,
  formatScore,
  groupByRound,
  resultText,
  statusLabel,
} from './fixtures'

type RGB = [number, number, number]
const C = {
  ink: [10, 31, 68] as RGB,
  gold: [255, 194, 26] as RGB,
  flame: [230, 57, 70] as RGB,
  pitch: [22, 133, 80] as RGB,
  text: [31, 42, 68] as RGB,
  muted: [90, 103, 133] as RGB,
  surface: [244, 246, 250] as RGB,
  line: [227, 232, 240] as RGB,
  white: [255, 255, 255] as RGB,
  soft: [200, 211, 230] as RGB,
}

const PAGE_W = 595.28
const PAGE_H = 841.89
const M = 40
const CONTENT_W = PAGE_W - M * 2
const FOOTER_Y = PAGE_H - 30
const BOTTOM_LIMIT = PAGE_H - 60

// Column layout (x offsets from M)
const COL = { no: 0, when: 42, match: 150, status: CONTENT_W - 150 }

export async function buildFixturesPdf(matches: Match[]) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true })
  doc.setProperties({ title: "ICCT'27 – Fixtures", subject: 'Inter Church Cricket Tournament match schedule' })

  const fill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2])
  const color = (c: RGB) => doc.setTextColor(c[0], c[1], c[2])
  const stroke = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2])
  const font = (style: 'normal' | 'bold', size: number) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
  }

  const venue = VENUE.name.replace(/\s*\(.*\)\s*$/, '')
  const dates = `${new Date(TOURNAMENT.firstBall).getDate()}–${new Date(TOURNAMENT.lastDay).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`

  /* ---------- Header (page 1) ---------- */
  const HEADER_H = 118
  fill(C.ink)
  doc.rect(0, 0, PAGE_W, HEADER_H, 'F')
  fill([15, 39, 80])
  for (let x = -HEADER_H; x < PAGE_W; x += 30) {
    doc.triangle(x, HEADER_H, x + 10, HEADER_H, x + 10 + HEADER_H, 0, 'F')
    doc.triangle(x, HEADER_H, x + 10 + HEADER_H, 0, x + HEADER_H, 0, 'F')
  }
  fill(C.gold)
  doc.rect(0, HEADER_H, PAGE_W, 4, 'F')
  fill(C.flame)
  doc.rect(0, HEADER_H + 4, PAGE_W, 2, 'F')

  font('bold', 34)
  const a = 'ICCT'
  const b = "'27"
  color(C.white)
  doc.text(a, M, 58)
  color(C.gold)
  doc.text(b, M + doc.getTextWidth(a), 58)
  font('bold', 13)
  color(C.gold)
  doc.text('FIXTURES', M, 82, { charSpace: 2 })
  font('normal', 9.5)
  color(C.soft)
  doc.text(`Inter Church Cricket Tournament · Season ${TOURNAMENT.season}`, M, 100)

  font('bold', 10)
  color(C.white)
  doc.text(dates, PAGE_W - M, 58, { align: 'right' })
  font('normal', 9)
  color(C.soft)
  doc.text(venue, PAGE_W - M, 74, { align: 'right' })
  doc.text(`${VENUE.city}, ${VENUE.state}`, PAGE_W - M, 88, { align: 'right' })

  let y = HEADER_H + 34

  const newPage = () => {
    doc.addPage()
    fill(C.ink)
    doc.rect(0, 0, PAGE_W, 30, 'F')
    fill(C.gold)
    doc.rect(0, 30, PAGE_W, 3, 'F')
    font('bold', 10)
    color(C.white)
    doc.text('ICCT', M, 20)
    color(C.gold)
    doc.text("'27", M + doc.getTextWidth('ICCT'), 20)
    font('normal', 9)
    color(C.soft)
    doc.text('Fixtures', PAGE_W - M, 20, { align: 'right' })
    y = 58
  }
  const ensure = (h: number) => {
    if (y + h > BOTTOM_LIMIT) newPage()
  }

  /* ---------- Rounds ---------- */
  const ROW_H = 34
  groupByRound(matches).forEach((group) => {
    ensure(28 + 18 + ROW_H * Math.min(2, group.matches.length))

    // Round heading
    fill(C.gold)
    doc.roundedRect(M, y - 13, 4, 18, 1, 1, 'F')
    font('bold', 14)
    color(C.ink)
    doc.text(group.round.toUpperCase(), M + 12, y + 1, { charSpace: 0.6 })
    font('normal', 9)
    color(C.muted)
    doc.text(`${group.matches.length} match${group.matches.length === 1 ? '' : 'es'}`, PAGE_W - M, y + 1, { align: 'right' })
    y += 14

    // Column labels
    font('bold', 7.5)
    color(C.muted)
    doc.text('#', M + COL.no + 8, y + 10)
    doc.text('DATE & TIME', M + COL.when, y + 10, { charSpace: 0.5 })
    doc.text('MATCH', M + COL.match, y + 10, { charSpace: 0.5 })
    doc.text('STATUS / RESULT', M + COL.status, y + 10, { charSpace: 0.5 })
    y += 16

    group.matches.forEach((m, i) => {
      ensure(ROW_H)
      if (i % 2 === 0) {
        fill(C.surface)
        doc.rect(M, y, CONTENT_W, ROW_H, 'F')
      }
      const mid = y + ROW_H / 2 + 3.5

      font('bold', 11)
      color(C.ink)
      doc.text(String(m.match_number || i + 1), M + COL.no + 8, mid)

      font('bold', 9)
      color(C.text)
      doc.text(formatMatchDay(m.scheduled_start_time) || 'Date TBA', M + COL.when, mid - 5)
      font('normal', 9)
      color(C.muted)
      doc.text(formatMatchTime(m.scheduled_start_time), M + COL.when, mid + 6)

      // Teams (with scores when available)
      const s1 = formatScore(m.team1_first_innings_runs, m.team1_first_innings_wickets)
      const s2 = formatScore(m.team2_first_innings_runs, m.team2_first_innings_wickets)
      const teamW = COL.status - COL.match - 12
      font('bold', 10)
      color(C.ink)
      const t1 = doc.splitTextToSize(`${m.team1}${s1 ? `  ${s1}` : ''}`, teamW)[0]
      const t2 = doc.splitTextToSize(`${m.team2}${s2 ? `  ${s2}` : ''}`, teamW)[0]
      doc.text(t1, M + COL.match, mid - 5)
      font('normal', 8)
      color(C.flame)
      doc.text('vs', M + COL.match, mid + 4.5)
      font('bold', 10)
      color(C.ink)
      doc.text(t2, M + COL.match + 14, mid + 6)

      // Status
      const res = resultText(m)
      font('bold', 9)
      color(m.status === 'live' ? C.flame : m.status === 'completed' ? C.pitch : C.muted)
      doc.text(statusLabel[m.status].toUpperCase(), M + COL.status, res ? mid - 5 : mid, { charSpace: 0.5 })
      if (res) {
        font('normal', 8.5)
        color(C.text)
        doc.text(doc.splitTextToSize(res, CONTENT_W - COL.status - 4)[0], M + COL.status, mid + 6)
      }

      y += ROW_H
    })

    stroke(C.line)
    doc.setLineWidth(0.8)
    doc.line(M, y, PAGE_W - M, y)
    y += 28
  })

  /* ---------- Footer ---------- */
  const total = doc.getNumberOfPages()
  const generated = new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
  for (let i = 1; i <= total; i++) {
    doc.setPage(i)
    stroke(C.gold)
    doc.setLineWidth(1.2)
    doc.line(M, FOOTER_Y - 12, PAGE_W - M, FOOTER_Y - 12)
    font('normal', 8)
    color(C.muted)
    doc.text(`ICCT'27 Fixtures · Generated ${generated} · Times may change — check the website for live updates`, M, FOOTER_Y)
    doc.text(`Page ${i} of ${total}`, PAGE_W - M, FOOTER_Y, { align: 'right' })
  }

  return doc
}

export async function downloadFixturesPdf(matches: Match[]) {
  const doc = await buildFixturesPdf(matches)
  doc.save('ICCT27_Fixtures.pdf')
}
