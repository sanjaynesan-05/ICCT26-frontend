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
    title: 'Start Date',
    value: 'TBA',
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
