/**
 * Home Page Data
 * Contains announcements and hero section information
 */

import type { Announcement } from '../types'

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
  mainTitle: 'ICCT26',
  subTitle: 'Cricket Tournament',
  tagline: 'Experience the Ultimate Cricket Championship',
  description:
    'Join us for an exciting 3-day cricket tournament featuring red tennis ball format cricket with teams competing for glory and prizes.',
}

/**
 * Features/Highlights
 */
export const TOURNAMENT_HIGHLIGHTS = [
  {
    icon: '🏏',
    title: 'Red Tennis Ball Cricket',
    description: 'Exciting and inclusive cricket format for all skill levels',
  },
  {
    icon: '🏆',
    title: 'Prize Pool',
    description: 'Compete for amazing prizes and trophies',
  },
  {
    icon: '👥',
    title: 'Team Based',
    description: '11-15 players per team with flexible squad sizes',
  },
  {
    icon: '📅',
    title: '3 Days of Action',
    description: 'January 24-26, 2026 - Back-to-back matches',
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
