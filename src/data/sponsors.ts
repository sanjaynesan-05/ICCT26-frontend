/**
 * Sponsors — update logos here.
 *
 * Drop logo files in src/assets (or public/sponsor) and swap the placeholders.
 * Each entry: { name, logo, url? }
 */

import comingSoonLogo from '../assets/coming soon.png'

export interface Sponsor {
  name: string
  logo: string
  url?: string
}

export const TITLE_SPONSOR: Sponsor = {
  name: 'Title Sponsor',
  logo: comingSoonLogo,
}

export const CO_SPONSORS: Sponsor[] = Array.from({ length: 12 }, (_, i) => ({
  name: `Co-Sponsor ${i + 1}`,
  logo: comingSoonLogo,
}))
