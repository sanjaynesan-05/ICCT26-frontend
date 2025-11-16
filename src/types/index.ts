/**
 * Type definitions for ICCT26 Cricket Tournament Website
 */

/**
 * Match information interface
 */
export interface Match {
  id: number
  match: string
  date: string
  time: string
  venue: string
  teamA: string
  teamB: string
  status: 'upcoming' | 'live' | 'completed'
}

/**
 * Tournament rule interface
 */
export interface Rule {
  id: number
  title: string
  icon: string
  content: string[]
}

/**
 * Organizer/Contact information interface
 */
export interface Organizer {
  role: string
  name: string
  phone: string
  whatsapp: string
  email: string
}

/**
 * Social media link interface
 */
export interface SocialLink {
  name: string
  icon: any // React component from lucide-react
  url: string
  color: string
}

/**
 * Registration form data interface
 */
export interface FormData {
  paymentReceipt: File | null
  teamName: string
  teamLogo: File | null
  captainName: string
  captainPhone: string
  captainEmail: string
  viceCaptainName: string
  viceCaptainPhone: string
  viceCaptainEmail: string
}

/**
 * Player information interface
 */
export interface Player {
  playerId: string
  name: string
  role: string
  aadharFile?: string
  subscriptionFile?: string
}

/**
 * Registration step interface
 */
export interface RegistrationStep {
  number: number
  title: string
}

/**
 * Home page announcement interface
 */
export interface Announcement {
  id: number
  text: string
  emoji: string
}

/**
 * Venue information interface
 */
export interface Venue {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  mapEmbedUrl: string
}

/**
 * App configuration interface
 */
export interface AppConfig {
  tournamentName: string
  tournamentYear: number
  countdownTargetDate: string
  registrationFee: number
  upiId: string
  contactEmail: string
  socialMedia: {
    instagram: string
    facebook: string
    youtube: string
    whatsapp: string
  }
}
