/**
 * Type definitions for ICCT26 Cricket Tournament Website
 */

/**
 * Match information interface
 */
export interface Match {
  id: number
  round: string
  round_number: number
  match_number: number
  team1: string
  team2: string
  status: 'scheduled' | 'live' | 'completed'
  toss_winner?: string | null
  toss_choice?: 'bat' | 'bowl' | null
  scheduled_start_time?: string | null
  actual_start_time?: string | null
  match_end_time?: string | null
  team1_first_innings_score?: number | null
  team2_first_innings_score?: number | null
  match_score_url?: string | null
  first_innings_team?: string | null
  second_innings_team?: string | null
  result?: MatchResult | null
  created_at?: string
  updated_at?: string
}

/**
 * Match result interface
 */
export interface MatchResult {
  winner: string
  margin: number
  marginType: 'runs' | 'wickets'
  wonByBattingFirst: boolean
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
  image?: string
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
