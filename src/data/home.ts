/**
 * Home Page Data
 * Contains announcements and hero section information
 */

import type { Announcement } from '../types'
import { Trophy, MapPin, Calendar, Users } from 'lucide-react'

/**
 * Announcements with images for carousel
 */


/**
 * Tournament facts — single source for the Home page.
 * Update dates / fee here and every section follows.
 */
export const TOURNAMENT = {
  season: 4,
  registrationCloses: '2026-12-25T19:00:00', // local time
  firstBall: '2027-01-23T00:00:00', // day 1
  lastDay: '2027-01-24T00:00:00', // final day
  entryFee: 2027,
  oversPerSide: 10,
  minPlayers: 13,
  maxPlayers: 17,
  format: 'Red Tennis Ball',
  city: 'Coimbatore',
  pastSeasons: ["'17", "'25", "'26"],
}

/**
 * Hero Section Information
 */
export const HERO_SECTION = {
  mainTitle: "ICCT'27",
  subTitle: 'Inter Church Cricket Tournament',
  tagline: 'Experience the Ultimate Cricket Championship',
  description:
    '',
}

/**
 * Features/Highlights
 */
export const TOURNAMENT_HIGHLIGHTS = [
  {
    icon: Trophy,
    title: 'Trophies',
    value: 'TROPHIES & SPECIAL PRIZES',
    color: 'text-accent',
  },
  {
    icon: MapPin,
    title: 'Venue',
    value: 'TBA ',
    color: 'text-blue-400',
  },
  {
    icon: Calendar,
    title: 'Dates',
    value: '23/01/2026 - 24/01/2026',
    color: 'text-green-400',
  },
  {
    icon: Users,
    title: 'Teams Registered',
    value: '0',
    color: 'text-purple-400',
  },
]

/**
 * Get announcement by ID
 */
export const getAnnouncementById = (id: number): Announcement | undefined => {
  return ANNOUNCEMENTS.find(a => a.id === id)
}

/**
 * Get random announcement
 */
export const getRandomAnnouncement = (): Announcement => {
  return ANNOUNCEMENTS[Math.floor(Math.random() * ANNOUNCEMENTS.length)]
}
