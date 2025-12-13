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
 * Hero Section Information
 */
export const HERO_SECTION = {
  mainTitle: "ICCT'26",
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
    value: 'DON BOSCO\n(Cricket ground)\nThudiyalur ',
    color: 'text-blue-400',
  },
  {
    icon: Calendar,
    title: 'Start Date',
    value: 'JANUARY 24, 2026',
    color: 'text-green-400',
  },
  {
    icon: Users,
    title: 'Teams Registered',
    value: '15',
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
