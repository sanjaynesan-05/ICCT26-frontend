import type { Rule } from '../types'

export const TOURNAMENT_RULES: Rule[] = [
  {
    id: 1,
    title: 'Registration and Match Rules',
    icon: 'ClipboardList',
    content: [
      'Ensure that all the details you provide are accurate and match your Photo, Subscription Card, and Aadhaar Card details.',
      'Only after proper verification will your team be qualified for registration.'
    ],
  },
  {
    id: 2,
    title: 'Team Registration',
    icon: 'Users',
    content: [
      'Only one team can represent a single church.',
      'The first 16 teams that complete registration with all required documents will be eligible to participate.'
    ],
  },
  {
    id: 3,
    title: 'Documents Required',
    icon: 'FileText',
    content: [
      'Each team must submit the following for every player:',
      '• Passport-size photo',
      '• Subscription card',
      '• Aadhaar card',
      'Note: Each document must be uploaded as a separate image (JPG format) and named after the respective player (e.g., John_Doe_Photo.jpg, John_Doe_Aadhaar.jpg).'
    ],
  },
  {
    id: 4,
    title: "Umpire's Decision",
    icon: 'Gavel',
    content: [
      'The umpire’s decision is final and binding on all teams.',
      'Any disputes must be resolved respectfully on the field.'
    ],
  },
  {
    id: 5,
    title: 'Power-Play Rules',
    icon: 'Flame',
    content: [
      'Each match will consist of 10 overs per side.',
      'First Power-Play: Overs 1–2 — Only two fielders are allowed outside the 30-yard circle.',
      'Second Power-Play: Can be taken in any one of the 6th, 7th, or 8th overs.',
      'During the second Power-Play, only five fielders are allowed outside the 30-yard circle.'
    ],
  },
  {
    id: 6,
    title: 'Bowling Restrictions',
    icon: 'Target',
    content: [
      'Each bowler can bowl a maximum of 3 overs.'
    ],
  },
  {
    id: 7,
    title: 'Tie-Breaker Rule',
    icon: 'Flag',
    content: [
      'In case of a tie, a Super Over will decide the winner.'
    ],
  },
  {
    id: 8,
    title: 'Important Notice to All Teams',
    icon: 'AlertTriangle',
    content: [
      '• The main 11 players must submit all the required documents (photo, subscription card, and Aadhaar).',
      '• If your team has only 11 players, you don’t need to fill the last 4 players’ details.',
      '• During the match, substitutes cannot be used if your team has registered only 11 players.',
      '• If any player’s name is submitted without the required documents, the application will be rejected even if registration appears successful.'
    ],
  }
]

export const getRuleById = (id: number): Rule | undefined => {
  return TOURNAMENT_RULES.find(r => r.id === id)
}

export const getRuleTitles = (): string[] => {
  return TOURNAMENT_RULES.map(r => r.title)
}

export const getRuleContentByTitle = (title: string): string[] | undefined => {
  return TOURNAMENT_RULES.find(r => r.title === title)?.content
}

/**
 * ICCT'27 match rules — single source for the Rules page and the
 * "Key rules" panel on Registration. Edit here and both update.
 */
export interface RuleSection {
  id: string
  title: string
  rules: string[]
}

export const RULE_SECTIONS: RuleSection[] = [
  {
    id: 'registration',
    title: 'Registration',
    rules: [
      'Each church may enter only one team.',
      'All details entered in the registration form must be accurate and match official records.',
      'A registration is confirmed only after the organisers verify the entry-fee payment. The captain then receives the Team ID by email.',
    ],
  },
  {
    id: 'format',
    title: 'Format',
    rules: [
      'Matches are played with a Red Tennis Ball.',
      'Each team plays 10 overs per side.',
      'There is no age limit for participation.',
    ],
  },
  {
    id: 'squad',
    title: 'Squad',
    rules: ['Each team registers 13 to 17 players, including the captain and vice-captain.'],
  },
  {
    id: 'powerplay',
    title: 'Powerplays',
    rules: [
      'First powerplay (overs 1–2): only 2 fielders are allowed outside the 30-yard circle.',
      'Second powerplay: taken in any one over from overs 6, 7 or 8; only 5 fielders are allowed outside the 30-yard circle.',
    ],
  },
  {
    id: 'bowling',
    title: 'Bowling',
    rules: [
      'A bowler can bowl a maximum of 3 overs in a match.',
      'No bowler may exceed this limit under any circumstances.',
    ],
  },
  {
    id: 'results',
    title: 'Results & conduct',
    rules: [
      'If a match ends in a tie, a Super Over decides the winner.',
      "The umpire's decision is final and binding on all teams.",
      'Arguments or disputes against umpire decisions will not be entertained.',
    ],
  },
]

/** Closing note — shown at the end of the Rules page and the PDF rulebook */
export const IMPORTANT_NOTE =
  'All participants are expected to read and understand these rules. The tournament committee may modify rules if necessary for fair play. Any disputes are resolved by the organising committee, whose decision is final and binding. Failure to comply with these rules may lead to disqualification without refund.'

/** Short list shown on the Registration page */
export const KEY_RULES: string[] = RULE_SECTIONS.flatMap((s) => s.rules)
