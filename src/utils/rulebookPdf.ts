/**
 * Generates the official rulebook PDF in the browser from the same data the
 * website uses (RULE_SECTIONS, TOURNAMENT, ORGANIZERS) — so the PDF can never
 * drift out of date. jsPDF is loaded on demand, only when someone downloads.
 */

import { RULE_SECTIONS, IMPORTANT_NOTE } from '../data/rules'
import { TOURNAMENT } from '../data/home'
import { ORGANIZERS } from '../data/contact'

type RGB = [number, number, number]

const C = {
  ink: [10, 31, 68] as RGB,
  ink900: [6, 20, 46] as RGB,
  gold: [255, 194, 26] as RGB,
  flame: [230, 57, 70] as RGB,
  flameDark: [193, 18, 31] as RGB,
  text: [31, 42, 68] as RGB,
  muted: [90, 103, 133] as RGB,
  surface: [244, 246, 250] as RGB,
  line: [227, 232, 240] as RGB,
  white: [255, 255, 255] as RGB,
  noteBg: [253, 236, 238] as RGB,
}

// A4 in points
const PAGE_W = 595.28
const PAGE_H = 841.89
const M = 48 // side margin
const CONTENT_W = PAGE_W - M * 2
const FOOTER_Y = PAGE_H - 36
const BOTTOM_LIMIT = PAGE_H - 70

const loadImage = async (src: string): Promise<{ data: string; w: number; h: number } | null> => {
  try {
    const blob = await (await fetch(src)).blob()
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    const size = await new Promise<{ w: number; h: number }>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
      img.onerror = reject
      img.src = data
    })
    return { data, ...size }
  } catch {
    return null // logos are decoration; never block the download
  }
}

const formatFee = (n: number) => `Rs. ${n.toLocaleString('en-IN')}`

/** Download the rulebook in the browser. */
export async function downloadRulebook(): Promise<void> {
  const doc = await buildRulebook()
  doc.save('ICCT27_Rulebook.pdf')
}

/** Build the rulebook document (separate from saving, so it can be tested). */
export async function buildRulebook() {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true })
  doc.setProperties({
    title: "ICCT'27 – Official Rules & Regulations",
    subject: 'Inter Church Cricket Tournament rulebook',
    author: "CSI St. Peter's Church, Rathinapuri Youth Fellowship",
  })

  const fill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2])
  const stroke = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2])
  const color = (c: RGB) => doc.setTextColor(c[0], c[1], c[2])
  const font = (style: 'normal' | 'bold', size: number) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
  }

  const [leftLogo, rightLogo] = await Promise.all([loadImage('/adonailogo.png'), loadImage('/churchlogo.png')])

  /* ---------------- Cover header (page 1) ---------------- */
  const HEADER_H = 178
  fill(C.ink)
  doc.rect(0, 0, PAGE_W, HEADER_H, 'F')
  // subtle diagonal stripes (slightly lighter navy, like the website's hero)
  fill([15, 39, 80])
  for (let x = -HEADER_H; x < PAGE_W; x += 30) {
    const w = 10
    doc.triangle(x, HEADER_H, x + w, HEADER_H, x + w + HEADER_H, 0, 'F')
    doc.triangle(x, HEADER_H, x + w + HEADER_H, 0, x + HEADER_H, 0, 'F')
  }
  // bottom bands
  fill(C.gold)
  doc.rect(0, HEADER_H, PAGE_W, 5, 'F')
  fill(C.flame)
  doc.rect(0, HEADER_H + 5, PAGE_W, 2, 'F')

  const LOGO = 66
  const drawLogo = (logo: typeof leftLogo, x: number) => {
    if (!logo) return
    const scale = Math.min(LOGO / logo.w, LOGO / logo.h)
    const w = logo.w * scale
    const h = logo.h * scale
    doc.addImage(logo.data, 'PNG', x + (LOGO - w) / 2, 36 + (LOGO - h) / 2, w, h, undefined, 'FAST')
  }
  drawLogo(leftLogo, M)
  drawLogo(rightLogo, PAGE_W - M - LOGO)

  // Title: white "ICCT" + gold "'27"
  font('bold', 46)
  const partA = 'ICCT'
  const partB = "'27"
  const titleW = doc.getTextWidth(partA) + doc.getTextWidth(partB)
  const titleX = (PAGE_W - titleW) / 2
  color(C.white)
  doc.text(partA, titleX, 84)
  color(C.gold)
  doc.text(partB, titleX + doc.getTextWidth(partA), 84)

  font('bold', 10)
  color([200, 211, 230])
  doc.text('INTER CHURCH CRICKET TOURNAMENT', PAGE_W / 2, 106, { align: 'center', charSpace: 2 })

  font('bold', 15)
  color(C.gold)
  doc.text('OFFICIAL RULES & REGULATIONS', PAGE_W / 2, 136, { align: 'center', charSpace: 1 })

  font('normal', 9.5)
  color([200, 211, 230])
  doc.text(
    `Season ${TOURNAMENT.season}  ·  ${TOURNAMENT.city}  ·  CSI St. Peter's Church, Rathinapuri Youth Fellowship`,
    PAGE_W / 2,
    156,
    { align: 'center' }
  )

  /* ---------------- Quick facts strip ---------------- */
  let y = HEADER_H + 30
  const facts = [
    {
      label: 'DATES',
      value: `${new Date(TOURNAMENT.firstBall).getDate()}–${new Date(TOURNAMENT.lastDay).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}`,
    },
    { label: 'BALL', value: TOURNAMENT.format },
    { label: 'SQUAD', value: `${TOURNAMENT.minPlayers}–${TOURNAMENT.maxPlayers} players` },
    { label: 'ENTRY', value: `${formatFee(TOURNAMENT.entryFee)} / team` },
  ]
  const GAP = 10
  const boxW = (CONTENT_W - GAP * (facts.length - 1)) / facts.length
  const BOX_H = 50
  facts.forEach((f, i) => {
    const x = M + i * (boxW + GAP)
    fill(C.surface)
    stroke(C.line)
    doc.setLineWidth(0.8)
    doc.roundedRect(x, y, boxW, BOX_H, 6, 6, 'FD')
    fill(i === 3 ? C.flame : C.gold)
    doc.rect(x, y + 10, 3, BOX_H - 20, 'F')
    font('bold', 7.5)
    color(C.muted)
    doc.text(f.label, x + 12, y + 19, { charSpace: 1 })
    font('bold', 11)
    color(C.ink)
    doc.text(f.value, x + 12, y + 36, { maxWidth: boxW - 18 })
  })
  y += BOX_H + 34

  /* ---------------- Continuation pages ---------------- */
  const newPage = () => {
    doc.addPage()
    fill(C.ink)
    doc.rect(0, 0, PAGE_W, 34, 'F')
    fill(C.gold)
    doc.rect(0, 34, PAGE_W, 3, 'F')
    font('bold', 11)
    color(C.white)
    doc.text('ICCT', M, 22)
    color(C.gold)
    doc.text("'27", M + doc.getTextWidth('ICCT'), 22)
    font('normal', 9)
    color([200, 211, 230])
    doc.text('Official Rules & Regulations', PAGE_W - M, 22, { align: 'right' })
    y = 66
  }
  const ensure = (needed: number) => {
    if (y + needed > BOTTOM_LIMIT) newPage()
  }

  /* ---------------- Rule sections ---------------- */
  const RULE_FONT = 10.5
  const LINE_H = 15
  const TEXT_X = M + 30
  const TEXT_W = CONTENT_W - 30
  let ruleNo = 0

  RULE_SECTIONS.forEach((section, si) => {
    font('normal', RULE_FONT)
    const ruleHeights = section.rules.map((r) => (doc.splitTextToSize(r, TEXT_W) as string[]).length * LINE_H + 7)
    const sectionH = 32 + ruleHeights.reduce((a, b) => a + b, 0)
    // Keep short sections whole; long ones at least keep the heading with its first rule
    ensure(sectionH < 260 ? sectionH : 32 + (ruleHeights[0] ?? 0))

    // Section heading
    fill(C.gold)
    doc.roundedRect(M, y - 15, 22, 22, 4, 4, 'F')
    font('bold', 11)
    color(C.ink)
    doc.text(String(si + 1), M + 11, y + 0.5, { align: 'center' })
    font('bold', 15)
    color(C.ink)
    doc.text(section.title.toUpperCase(), M + 32, y + 1, { charSpace: 0.5 })
    y += 12
    stroke(C.line)
    doc.setLineWidth(1)
    doc.line(M, y, PAGE_W - M, y)
    y += 20

    // Rules
    section.rules.forEach((rule) => {
      ruleNo += 1
      font('normal', RULE_FONT)
      const lines = doc.splitTextToSize(rule, TEXT_W) as string[]
      ensure(lines.length * LINE_H + 4)

      font('bold', RULE_FONT)
      color(C.flame)
      doc.text(`${ruleNo}.`, TEXT_X - 8, y, { align: 'right' })
      font('normal', RULE_FONT)
      color(C.text)
      doc.text(lines, TEXT_X, y, { lineHeightFactor: LINE_H / RULE_FONT })
      y += lines.length * LINE_H + 7
    })
    y += 16
  })

  /* ---------------- Important note ---------------- */
  font('normal', 10)
  const noteLines = doc.splitTextToSize(IMPORTANT_NOTE, CONTENT_W - 36) as string[]
  const NOTE_H = 40 + noteLines.length * 14
  ensure(NOTE_H + 10)
  fill(C.noteBg)
  doc.roundedRect(M, y, CONTENT_W, NOTE_H, 6, 6, 'F')
  fill(C.flame)
  doc.rect(M, y, 4, NOTE_H, 'F')
  font('bold', 12)
  color(C.flameDark)
  doc.text('IMPORTANT NOTE', M + 20, y + 22, { charSpace: 0.8 })
  font('normal', 10)
  color(C.text)
  doc.text(noteLines, M + 20, y + 40, { lineHeightFactor: 1.4 })
  y += NOTE_H + 26

  /* ---------------- Contact ---------------- */
  const contacts = ORGANIZERS.slice(0, 2)
  if (contacts.length) {
    ensure(54)
    font('bold', 8)
    color(C.muted)
    doc.text('QUESTIONS? CONTACT THE ORGANISERS', M, y, { charSpace: 1 })
    y += 16
    font('normal', 10)
    color(C.text)
    contacts.forEach((p, i) => {
      const colX = M + i * (CONTENT_W / 2)
      font('bold', 10)
      doc.text(p.name, colX, y)
      font('normal', 9.5)
      color(C.muted)
      doc.text(`${p.role}  ·  ${p.phone}`, colX, y + 14)
      color(C.text)
    })
  }

  /* ---------------- Footer on every page ---------------- */
  const total = doc.getNumberOfPages()
  const generated = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  for (let i = 1; i <= total; i++) {
    doc.setPage(i)
    stroke(C.gold)
    doc.setLineWidth(1.2)
    doc.line(M, FOOTER_Y - 12, PAGE_W - M, FOOTER_Y - 12)
    font('normal', 8)
    color(C.muted)
    doc.text(`ICCT'27 · Official Rules & Regulations · Updated ${generated}`, M, FOOTER_Y)
    doc.text(`Page ${i} of ${total}`, PAGE_W - M, FOOTER_Y, { align: 'right' })
  }

  return doc
}
