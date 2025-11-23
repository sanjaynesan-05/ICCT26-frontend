/**
 * Home Page Data
 * Contains announcements and hero section information
 */

import type { Announcement } from '../types'
import { Trophy, MapPin, Calendar, Users } from 'lucide-react'

/**
 * Announcements with images for carousel
 */
export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    text: '🏏 Registration now open for ICCT26 Cricket Tournament 2026!',
    emoji: '📝',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
  },
  {
    id: 2,
    text: '🎯 Tournament dates: January 24-26, 2026',
    emoji: '📅',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop',
  },
  {
    id: 3,
    text: '🏆 Prize pool and awards for top performing teams',
    emoji: '🥇',
    image: 'https://images.unsplash.com/photo-1554224311-beee415c15cb?w=800&h=400&fit=crop',
  },
  {
    id: 4,
    text: '👥 Team size: 11-15 players per team',
    emoji: '👫',
    image: 'https://images.unsplash.com/photo-1552993881-448e15db9daa?w=800&h=400&fit=crop',
  },
  {
    id: 5,
    text: '⚾ Red tennis ball format cricket',
    emoji: '🎾',
    image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e637?w=800&h=400&fit=crop',
  },
  {
    id: 6,
    text: '📍 Venue: CSI St. Peter\'s Church, Coimbatore',
    emoji: '🏟️',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
  },
]

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
    value: 'TBH',
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
