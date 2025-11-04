/**
 * Home Page Data
 * Contains announcements and hero section information
 */

import type { Announcement } from '../types'
import { Trophy, MapPin, Calendar, Users } from 'lucide-react'

/**
 * Announcements for the ticker
 */
export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    text: '🏏 Registration now open for ICCT26 Cricket Tournament 2026!',
    emoji: '📝',
  },
  {
    id: 2,
    text: '🎯 Tournament dates: January 24-26, 2026',
    emoji: '📅',
  },
  {
    id: 3,
    text: '🏆 Prize pool and awards for top performing teams',
    emoji: '🥇',
  },
  {
    id: 4,
    text: '👥 Team size: 11-15 players per team',
    emoji: '👫',
  },
  {
    id: 5,
    text: '⚾ Red tennis ball format cricket',
    emoji: '🎾',
  },
  {
    id: 6,
    text: '📍 Venue: CSI St. Peter\'s Church, Coimbatore',
    emoji: '🏟️',
  },
]

/**
 * Hero Section Information
 */
export const HERO_SECTION = {
  mainTitle: "ICCT'26",
  subTitle: 'Cricket Tournament',
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
    value: 'CSI St. Peter\'s Church',
    color: 'text-blue-400',
  },
  {
    icon: Calendar,
    title: 'Start Date',
    value: 'January 24, 2026',
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
