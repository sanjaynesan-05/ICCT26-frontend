/**
 * Tournament Rules Data
 * Contains all rules and regulations for ICCT26
 */

import type { Rule } from '../types'

export const TOURNAMENT_RULES: Rule[] = [
  {
    id: 1,
    title: 'Red Tennis Ball Match',
    icon: '⚾',
    content: [
      'All matches will be played with red tennis balls',
      'Standard cricket rules apply with tennis ball modifications',
      'No bouncers above shoulder height',
      'Wide and no-ball rules as per standard cricket',
    ],
  },
  {
    id: 2,
    title: 'Team Composition',
    icon: '👥',
    content: [
      'Minimum 11 players, maximum 15 players per team',
      'All players must be registered before the tournament starts',
      'No player substitution between matches',
      'Captain and vice-captain must be clearly designated',
    ],
  },
  {
    id: 3,
    title: 'Powerplay Rules',
    icon: '🔥',
    content: [
      'First 4 overs are powerplay overs',
      'Maximum 3 fielders allowed outside the 30-yard circle during powerplay',
      'After powerplay, maximum 5 fielders allowed outside the circle',
      'Mandatory powerplay cannot be delayed or split',
    ],
  },
  {
    id: 4,
    title: 'Bowling Restrictions',
    icon: '🕒',
    content: [
      'Each bowler can bowl a maximum of 3 overs',
      'No bowler can bowl more than 2 consecutive overs',
      'Minimum 5 bowlers must be used in a match',
      'Wide balls will be re-bowled and count as extra runs',
    ],
  },
  {
    id: 5,
    title: 'Super Over for Tie',
    icon: '🏁',
    content: [
      'In case of a tie, a super over will be played',
      'Each team will face 6 balls',
      'Same batting order as in the main match',
      'If super over is also tied, team with more boundaries wins',
    ],
  },
  {
    id: 6,
    title: 'Umpire Decision',
    icon: '⚖️',
    content: [
      'Umpire\'s decision is final and binding',
      'No DRS (Decision Review System) available',
      'Players must maintain discipline and sportsmanship',
      'Any form of dissent will result in penalties',
      'Severe cases may lead to team disqualification',
    ],
  },
  {
    id: 7,
    title: 'Match Duration',
    icon: '⏱️',
    content: [
      '15 overs per side',
      'Maximum 60 minutes per innings',
      'Break between innings: 10 minutes',
      'Penalty overs for slow over rate',
    ],
  },
  {
    id: 8,
    title: 'Fair Play & Conduct',
    icon: '🤝',
    content: [
      'Spirit of cricket must be upheld at all times',
      'No verbal or physical abuse tolerated',
      'Respect for opponents and umpires is mandatory',
      'First offense: Warning; Second offense: Penalty run; Third offense: Player disqualification',
    ],
  },
]

/**
 * Get rule by ID
 */
export const getRuleById = (id: number): Rule | undefined => {
  return TOURNAMENT_RULES.find(r => r.id === id)
}

/**
 * Get all rule titles
 */
export const getRuleTitles = (): string[] => {
  return TOURNAMENT_RULES.map(r => r.title)
}

/**
 * Get rules content by title
 */
export const getRuleContentByTitle = (title: string): string[] | undefined => {
  return TOURNAMENT_RULES.find(r => r.title === title)?.content
}
