/**
 * Contact & Organization Data
 * Contains organizer information, social links, and venue details
 */

import {
  Instagram,
  Facebook,
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
      whatsapp: '919543656533',
      
    },
    {
      role: 'Co-Ordinator',
      name: 'Mr. Jeba',
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
    url: 'https://www.instagram.com/st_peters_youth_fellowship?igsh=MWZtZDd3MWc3ZHYxOQ==',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://facebook.com/icct26',
    color: 'from-blue-600 to-blue-400',
  },
]

/**
 * Venue Information
 */
export const VENUE: Venue = {
  name: 'CSI St. Peter\'s Church',
  address: '1234 Church Street, R.S. Puram',
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  zipCode: '641002',
  country: 'India',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.3384789234567!2d76.9558!3d11.0168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAxJzAwLjUiTiA3NsKwNTcnMjAuOSJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
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
