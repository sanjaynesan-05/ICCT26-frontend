import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown, Download } from 'lucide-react'

interface Rule {
  id: number
  title: string
  icon: string
  content: string[]
}

const Rules = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(1)

  const rules: Rule[] = [
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
        'Teams must arrive 30 minutes before match time',
        'Proper cricket attire mandatory',
        'Points deduction for code of conduct violations',
      ],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-4 lg:px-8"
    >
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-6xl md:text-7xl text-accent mb-4">
            Rules & Regulations
          </h1>
          <p className="font-subheading text-2xl text-gray-300 mb-8">
            Know the Game. Play Fair.
          </p>
          <button className="btn-gold inline-flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Rulebook PDF
          </button>
        </motion.div>

        {/* Rules Accordion */}
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass-effect rounded-2xl overflow-hidden glow-border"
            >
              <button
                onClick={() => setOpenAccordion(openAccordion === rule.id ? null : rule.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{rule.icon}</span>
                  <h3 className="font-heading text-2xl md:text-3xl text-white">
                    {rule.title}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: openAccordion === rule.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-accent" />
                </motion.div>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openAccordion === rule.id ? 'auto' : 0,
                  opacity: openAccordion === rule.id ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pl-20">
                  <ul className="space-y-3">
                    {rule.content.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-gray-300 font-subheading"
                      >
                        <span className="text-accent mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Important Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 glass-effect rounded-2xl p-8 border-2 border-accent"
        >
          <h3 className="font-heading text-3xl text-accent mb-4">
            Important Note
          </h3>
          <p className="text-gray-300 font-subheading text-lg leading-relaxed">
            All participants are expected to read and understand these rules thoroughly. 
            The tournament committee reserves the right to modify rules if necessary for 
            fair play. Any disputes will be resolved by the tournament organizing committee, 
            and their decision shall be final and binding.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Rules
