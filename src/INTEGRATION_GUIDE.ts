/**
 * Integration Guide for Using Data Files
 * Examples of how to integrate data files into existing components
 */

// ============================================
// Schedule.tsx Integration Example
// ============================================

/*
// BEFORE: Inline data
const Schedule = () => {
  const matches: Match[] = [
    {
      id: 1,
      match: 'Match 1 - Group A',
      date: '2026-01-24',
      time: '09:00 AM',
      venue: 'Main Ground',
      teamA: 'Thunder Strikers',
      teamB: 'Lightning Warriors',
      status: 'upcoming',
    },
    // ... more matches
  ]

  return (
    // component JSX
  )
}

// AFTER: Using data from schedule.ts
import { MATCHES, getMatchesByDate } from '@/data'

const Schedule = () => {
  const [filter, setFilter] = useState<string>('all')

  const filteredMatches = filter === 'all' ? MATCHES : getMatchesByDate(filter)
  const uniqueDates = Array.from(new Set(MATCHES.map(m => m.date)))

  return (
    // component JSX - same as before, but using imported data
  )
}
*/

// ============================================
// Rules.tsx Integration Example
// ============================================

/*
// BEFORE: Inline data
const Rules = () => {
  const rules: Rule[] = [
    {
      id: 1,
      title: 'Red Tennis Ball Match',
      icon: '⚾',
      content: [
        'All matches will be played with red tennis balls',
        // ... more content
      ],
    },
    // ... more rules
  ]

  return (
    // component JSX
  )
}

// AFTER: Using data from rules.ts
import { TOURNAMENT_RULES } from '@/data'

const Rules = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(1)

  return (
    // component JSX - use TOURNAMENT_RULES instead of inline rules
  )
}
*/

// ============================================
// Contact.tsx Integration Example
// ============================================

/*
// BEFORE: Inline data
const Contact = () => {
  const organizers = [
    {
      role: 'Tournament Convenor',
      name: 'Mr. John Samuel',
      phone: '+91 98765 43210',
      whatsapp: '919876543210',
      email: 'convenor@icct26.org',
    },
    // ... more organizers
  ]

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/icct26',
      color: 'from-purple-500 to-pink-500',
    },
    // ... more links
  ]

  return (
    // component JSX
  )
}

// AFTER: Using data from contact.ts
import { ORGANIZERS, SOCIAL_LINKS, VENUE } from '@/data'

const Contact = () => {
  return (
    // component JSX - use ORGANIZERS, SOCIAL_LINKS, VENUE directly
  )
}
*/

// ============================================
// Registration.tsx Integration Example
// ============================================

/*
// BEFORE: Inline configuration
const Registration = () => {
  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const steps = [
    { number: 1, title: 'Payment' },
    { number: 2, title: 'Team Details' },
    { number: 3, title: 'Captain & Vice-Captain' },
    { number: 4, title: 'Players' },
    { number: 5, title: 'Review' },
  ]

  return (
    // component JSX
  )
}

// AFTER: Using data from registration.ts
import {
  REGISTRATION_STEPS,
  REGISTRATION_CONFIG,
  UPI_CONFIG,
  calculateProgress,
} from '@/data'

const Registration = () => {
  const [currentStep, setCurrentStep] = useState(1)

  const totalSteps = REGISTRATION_CONFIG.totalSteps
  const progress = calculateProgress(currentStep)

  return (
    // component JSX - use REGISTRATION_STEPS, UPI_CONFIG, etc.
  )
}
*/

// ============================================
// AnnouncementTicker.tsx Integration Example
// ============================================

/*
// BEFORE: Inline data
const AnnouncementTicker = () => {
  const announcements = [
    {
      id: 1,
      text: '🏏 Registration now open for ICCT26 Cricket Tournament 2026!',
      emoji: '📝',
    },
    // ... more announcements
  ]

  return (
    // component JSX
  )
}

// AFTER: Using data from home.ts
import { ANNOUNCEMENTS } from '@/data'

const AnnouncementTicker = () => {
  return (
    // component JSX - use ANNOUNCEMENTS directly
  )
}
*/

// ============================================
// Using App Configuration
// ============================================

/*
import { APP_CONFIG, COLOR_PALETTE, ROUTES, isFeatureEnabled } from '@/config/app.config'

// Get tournament name
const tournamentName = APP_CONFIG.tournamentName

// Get color values
const primaryColor = COLOR_PALETTE.primary
const accentColor = COLOR_PALETTE.accent

// Navigate to routes
const homeLink = ROUTES.home
const registrationLink = ROUTES.registration

// Check features
if (isFeatureEnabled('enableRegistration')) {
  // Show registration button
}

// Social media links
const instagramUrl = APP_CONFIG.socialMedia.instagram
const facebookUrl = APP_CONFIG.socialMedia.facebook
*/

// ============================================
// Import Examples
// ============================================

// Option 1: Import from individual data files
import type { Match, Rule, Organizer } from '@/types'
import { MATCHES } from '@/data/schedule'
import { TOURNAMENT_RULES } from '@/data/rules'
import { ORGANIZERS } from '@/data/contact'

// Option 2: Import from central data index
import { MATCHES, TOURNAMENT_RULES, ORGANIZERS } from '@/data'

// Option 3: Import from config
import { APP_CONFIG, COLOR_PALETTE, ROUTES } from '@/config/app.config'

// ============================================
// Helper Functions Usage
// ============================================

/*
// Get specific items
const match1 = getMatchById(1)
const rule1 = getRuleById(1)
const convenor = getOrganizerByRole('Tournament Convenor')
const instagramLink = getSocialLinkByName('Instagram')

// Get filtered data
const jan24Matches = getMatchesByDate('2026-01-24')
const upcomingMatches = getUpcomingMatches()
const rulesByTitle = getRuleContentByTitle('Red Tennis Ball Match')

// Get formatted data
const venueAddress = getFormattedVenueAddress()

// Utilities
const isRegistrationEnabled = isFeatureEnabled('enableRegistration')
const progressPercentage = calculateProgress(currentStep)
const fileValidation = validateFile(file, 'paymentReceipt')
*/

export {}
