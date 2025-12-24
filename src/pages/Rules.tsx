import React from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  ClipboardList,  // Registration and Match Rules  
  Users,          // Team Registration  
  FileText,       // Documents Required  
  Gavel,          // Umpire's Decision  
  Flame,          // Power-Play Rules  
  Target,         // Bowling Restrictions  
  Flag,           // Tie-Breaker Rule  
  AlertTriangle,  // Important Notice  
  ChevronDown,    // UI dropdown toggle (if used)  
  Download        // Download button (if used)
} from 'lucide-react'
import { TOURNAMENT_RULES } from '../data/rules'

// Set to true to close/lock rules page
const RULES_CLOSED = false

const iconMap = {
  ClipboardList,
  Users,
  FileText,
  Gavel,
  Flame,
  Target,
  Flag,
  AlertTriangle,
}

const Rules = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(1)
  const rules = TOURNAMENT_RULES

  // Show coming soon message if flag is true
  if (RULES_CLOSED) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen pt-32 pb-20 px-4 lg:px-8"
      >
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-12"
          >
            <h1 className="font-heading text-6xl md:text-7xl text-accent mb-4">
              Rules & Regulations
            </h1>
            <p className="font-subheading text-xl text-gray-300">
              Coming Soon
            </p>
          </motion.div>

          {/* Coming Soon Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-12 md:p-16 text-center border-2 border-accent/40 shadow-2xl shadow-accent/30 bg-gradient-to-br from-accent/20 via-accent/10 to-transparent backdrop-blur-xl glass-effect"
          >
            {/* Animated Icon */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-8"
            >
              <div className="inline-block">
                <div className="text-6xl md:text-8xl font-heading text-accent mb-6">⏳</div>
              </div>
            </motion.div>

            {/* Main Message */}
            <h2 className="font-heading text-4xl md:text-5xl text-accent mb-6">
              Rules Coming Soon
            </h2>
            
            <p className="font-body text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              The tournament rules and regulations for ICCT26 Cricket Tournament will be available soon. Stay tuned for detailed guidelines!
            </p>

            {/* Follow Updates */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-body text-gray-400 text-sm md:text-base mt-12"
            >
              Follow us on social media for latest announcements and updates
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  const SIMPLE_RULES = [
    'Matches will be played using a Red Tennis Ball format.',
    'Each team can have a maximum of 15 players.', 
    'There is no age limit for participation.',
    'Each team will play 10 overs per side.',
    'Powerplay (Overs 1–2): Only 2 fielders are allowed outside the 30-yard circle.',
    'Second Powerplay: Can be taken in any one over between Overs 6, 7, or 8; only 5 fielders are allowed outside the 30-yard circle.',
    'A bowler can bowl a maximum of 3 overs in a match.',
    'If a match ends in a tie, a Super Over will be played to decide the winner.',
    'The Umpire\'s decision is final.'
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
        </motion.div>

        {/* Simple Rules List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-2xl p-8 md:p-12 border border-accent/30 glow-border"
        >
          <div className="space-y-6">
            {SIMPLE_RULES.map((rule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent/20 border border-accent/40">
                    <span className="text-accent font-bold text-sm">{index + 1}</span>
                  </div>
                </div>
                <p className="text-gray-300 font-subheading text-lg pt-1 leading-relaxed">
                  {rule}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

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
