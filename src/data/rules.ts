/**
 * Tournament Rules Data
 * Contains all rules and regulations for ICCT26
 */
import type { Rule } from '../types'

export const TOURNAMENT_RULES: Rule[] = [
  {
    id: 1,
    title: 'Registration and Match Rules',
    icon: 'ClipboardList',
    content: [
      'Ensure all the details you filled is correct & it must be matches with your Photo, Subscription card & Aadhaar Card details, after that your team will be qualify for registration.',
    ],
  },
  {
    id: 2,
    title: 'Team Registration',
    icon: 'Users',
    content: [
      'Only one team is allowed to represent a single church.',
      'The first 16 teams that complete their registration with the required documents will be eligible to participate.',
    ],
  },
  {
    id: 3,
    title: 'Documents Required',
    icon: 'FileText',
    content: [
      'To register, each team must submit the following:',
      '• Passport-sized photo of each player.',
      '• Subscription card.',
      '• Aadhar card.',
      'Note: Each document must be submitted as a separate IMAGE (jpg) file, labeled with the respective player\'s name.',
    ],
  },
  {
    id: 4,
    title: 'Umpire\'s Decision',
    icon: 'Gavel',
    content: [
      'The umpire\'s decision is final and binding on all teams.',
    ],
  },
  {
    id: 4,
    title: "Umpire's Decision",
    icon: 'Gavel',
    content: [
      'It\'s a 10 overs match.',
      'First Power-Play: Overs 1-2',
      'Only two fielders are allowed outside the 30-yard circle.',
      'Second Power-Play: Can be taken in any one of the 6th, 7th, or 8th over.',
      'Only five fielders are allowed outside the 30-yard circle during this period.',
    ],
  },
  {
    id: 5,
    title: 'Power-Play Rules',
    icon: 'Flame',
    content: [
      'Only One bowler is allowed to bowl a maximum of 3 overs.',
    ],
  },
  {
    id: 6,
    title: 'Bowling Restrictions',
    icon: 'Target',
    content: [
      'Only One bowler is allowed to bowl a maximum of 3 overs.',
    ],
  },
  {
    id: 7,
    title: 'Tie-Breaker Rule',
    icon: 'Flag',
    content: [
      'In the event of a tie, a super over will be provided.',
    ],
  },
  {
    id: 8,
    title: 'Important Notice to all Teams',
    icon: 'AlertTriangle',
    content: [
      '• Main 11 players need to be submit all the above required details.',
      '• If your team has only main 11 players you don\'t need to fill the last 4 players details.',
      '• While match you cannot change over the substitute if you submit only main 11 players.',
      '• If the player name is submitted without the required details that application is not accepted even you get the registration successful.',
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
