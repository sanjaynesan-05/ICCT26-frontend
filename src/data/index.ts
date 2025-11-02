/**
 * Data Export Index
 * Central export point for all data files
 */

// Schedule Data
export {
  MATCHES,
  UNIQUE_MATCH_DATES,
  getMatchesByDate,
  getUpcomingMatches,
  getMatchById,
} from './schedule'

// Rules Data
export {
  TOURNAMENT_RULES,
  getRuleById,
  getRuleTitles,
  getRuleContentByTitle,
} from './rules'

// Contact Data
export {
  ORGANIZERS,
  SOCIAL_LINKS,
  VENUE,
  getOrganizerByRole,
  getSocialLinkByName,
  getFormattedVenueAddress,
} from './contact'

// Registration Data
export {
  REGISTRATION_STEPS,
  REGISTRATION_CONFIG,
  UPI_CONFIG,
  VALIDATION_RULES,
  FILE_CONFIG,
  getStepByNumber,
  getStepTitle,
  calculateProgress,
  validateFile,
} from './registration'

// Home Data
export {
  ANNOUNCEMENTS,
  HERO_SECTION,
  TOURNAMENT_HIGHLIGHTS,
  getAnnouncementById,
  getRandomAnnouncement,
} from './home'
