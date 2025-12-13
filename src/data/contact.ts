/**
 * Contact & Organization Data
 * Contains organizer information, social links, and venue details
 */

import {
  Instagram,
  Facebook,
  Youtube,
  Globe,
} from 'lucide-react'
import type { Organizer, SocialLink, Venue } from '../types'

/**
 * Tournament Organizers
 */
export const ORGANIZERS: Organizer[] = [
  {
      role: 'Youth Convenor',
      name: 'Mr. Robinson Charly',
      phone: '+91 9677940308',
      whatsapp: '919677940308',
    
    },
    {
      role: 'Head Co-Ordinator',
      name: 'Mr. Sam Richard',
      phone: '+91 9543656533',
      whatsapp: '917092341518',
      
    },
    {
      role: 'Co-Ordinator',
      name: 'Mr. Jebarsan',
      phone: '+91 7806965812',
      whatsapp: '917806965812',
      
    },

    {
      role: 'Co-Ordinator',
      name: 'Mr. Jerald',
      phone: '+91 7871541469',
      whatsapp: '917871541469',
      
    },
]

/**
 * Social Media Links
 */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/st_peters_youth_fellowship/',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://www.facebook.com/share/1D5bQK3wHk/',
    color: 'from-blue-600 to-blue-400',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://www.youtube.com/@CSIStPetersChurchRathinapuri',
    color: 'from-red-600 to-red-400',
  },
  {
    name: 'Website',
    icon: Globe,
    url: 'https://www.csichurchrathinapuri.com/',
    color: 'from-cyan-500 to-blue-500',
  },
]

/**
 * Venue Information
 */
export const VENUE: Venue = {
  name: "Don Bosco Sport Academy (Cricket ground)",
  address: "Thudiyalur - Saravanampatti Rd, Fathima Nagar, Vellakinar",
  city: "Coimbatore",
  state: "Tamil Nadu",
  zipCode: "641029",
  country: "India",
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1033.827757739101!2d76.96839547578858!3d11.081894026594052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f7bc8e9c32c5%3A0x4ad24d5bea5c250d!2sDon%20Bosco%20Sport%20Academy%20(Cricket%20ground)!5e0!3m2!1sen!2sin!4v1765175449153!5m2!1sen!2sin',
}

/**
 * Get organizer by role
 */
export const getOrganizerByRole = (role: string): Organizer | undefined => {
  return ORGANIZERS.find(org => org.role === role)
}

/**
 * Get social link by name
 */
export const getSocialLinkByName = (name: string): SocialLink | undefined => {
  return SOCIAL_LINKS.find(link => link.name === name)
}

/**
 * Format venue address
 */
export const getFormattedVenueAddress = (): string => {
  return `${VENUE.address}, ${VENUE.city}, ${VENUE.state} ${VENUE.zipCode}, ${VENUE.country}`
}
