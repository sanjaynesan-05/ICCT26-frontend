import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Trophy } from 'lucide-react'
import { useState } from 'react'

interface Match {
  id: string
  round: string
  team1: string
  team2: string
  date: string
  time: string
  venue: string
  status: 'scheduled' | 'live' | 'completed'
  result?: string
}

const Schedule = () => {
  // Toggle between schedule view and coming soon
  const [scheduleReleased] = useState(false)

  // 16-Team Knockout Tournament Schedule
  const rounds = {
    quarterfinals: [
      {
        id: 'qf1',
        round: 'Quarterfinal 1',
        team1: 'Team 1',
        team2: 'Team 16',
        date: 'Jan 24, 2026',
        time: '09:00 AM',
        venue: 'Ground A',
        status: 'scheduled' as const,
      },
      {
        id: 'qf2',
        round: 'Quarterfinal 2',
        team1: 'Team 8',
        team2: 'Team 9',
        date: 'Jan 24, 2026',
        time: '11:30 AM',
        venue: 'Ground B',
        status: 'scheduled' as const,
      },
      {
        id: 'qf3',
        round: 'Quarterfinal 3',
        team1: 'Team 5',
        team2: 'Team 12',
        date: 'Jan 24, 2026',
        time: '02:00 PM',
        venue: 'Ground C',
        status: 'scheduled' as const,
      },
      {
        id: 'qf4',
        round: 'Quarterfinal 4',
        team1: 'Team 4',
        team2: 'Team 13',
        date: 'Jan 24, 2026',
        time: '04:30 PM',
        venue: 'Ground D',
        status: 'scheduled' as const,
      },
    ],
    semifinals: [
      {
        id: 'sf1',
        round: 'Semifinal 1',
        team1: 'Winner QF1',
        team2: 'Winner QF2',
        date: 'Jan 25, 2026',
        time: '10:00 AM',
        venue: 'Ground A',
        status: 'scheduled' as const,
      },
      {
        id: 'sf2',
        round: 'Semifinal 2',
        team1: 'Winner QF3',
        team2: 'Winner QF4',
        date: 'Jan 25, 2026',
        time: '03:00 PM',
        venue: 'Ground B',
        status: 'scheduled' as const,
      },
    ],
    finals: [
      {
        id: 'final',
        round: 'Grand Final',
        team1: 'Winner SF1',
        team2: 'Winner SF2',
        date: 'Jan 26, 2026',
        time: '05:00 PM',
        venue: 'Main Ground',
        status: 'scheduled' as const,
      },
    ],
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <span className="px-3 py-1 bg-red-500/30 text-red-300 rounded-full text-xs font-bold">🔴 LIVE</span>
      case 'completed':
        return <span className="px-3 py-1 bg-green-500/30 text-green-300 rounded-full text-xs font-bold">✅ COMPLETED</span>
      default:
        return <span className="px-3 py-1 bg-blue-500/30 text-blue-300 rounded-full text-xs font-bold">⏳ SCHEDULED</span>
    }
  }

  const MatchCard = ({ match }: { match: Match }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card rounded-xl p-4 md:p-6 border border-primary/30 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-primary/20"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Round & Status */}
        <div className="md:w-32">
          <p className="font-subheading font-bold text-primary text-sm">{match.round}</p>
          <div className="mt-2">{getStatusBadge(match.status)}</div>
        </div>

        {/* Teams */}
        <div className="flex-1">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex-1 text-right">
              <p className="font-subheading font-semibold text-gray-100">{match.team1}</p>
            </div>
            <div className="px-3 py-1 bg-accent/20 rounded-lg text-accent font-bold">VS</div>
            <div className="flex-1 text-left">
              <p className="font-subheading font-semibold text-gray-100">{match.team2}</p>
            </div>
          </div>
        </div>

        {/* Date, Time & Venue */}
        <div className="md:w-48 text-sm">
          <p className="text-accent font-bold mb-1">{match.date}</p>
          <p className="text-gray-300">{match.time}</p>
          <p className="text-gray-400 text-xs">{match.venue}</p>
        </div>
      </div>
    </motion.div>
  )

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
          <div className="flex items-center justify-center gap-4 mb-6">
            <Calendar className="w-12 h-12 text-accent" />
          </div>
          <h1 className="font-heading text-6xl md:text-7xl text-accent mb-4">
            Match Schedule
          </h1>
          <p className="font-subheading text-xl text-gray-300 mb-8">
            ICCT26 16-Team Knockout Tournament
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {scheduleReleased ? (
            // Schedule View
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Quarterfinals */}
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="w-6 h-6 text-accent" />
                  <h2 className="font-heading text-3xl text-accent">Quarterfinals</h2>
                  <span className="text-gray-400 text-sm">{rounds.quarterfinals.length} Matches</span>
                </div>
                <div className="space-y-4">
                  {rounds.quarterfinals.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>

              {/* Semifinals */}
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="w-6 h-6 text-primary" />
                  <h2 className="font-heading text-3xl text-primary">Semifinals</h2>
                  <span className="text-gray-400 text-sm">{rounds.semifinals.length} Matches</span>
                </div>
                <div className="space-y-4">
                  {rounds.semifinals.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>

              {/* Finals */}
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h2 className="font-heading text-3xl text-yellow-400">Grand Final</h2>
                  <span className="text-gray-400 text-sm">{rounds.finals.length} Match</span>
                </div>
                <div className="space-y-4">
                  {rounds.finals.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>

              {/* Tournament Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-16 p-8 rounded-2xl bg-primary/20 border border-primary/30"
              >
                <h3 className="font-heading text-2xl text-accent mb-4">Tournament Info</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Matches</p>
                    <p className="font-heading text-3xl text-accent">7</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Tournament Duration</p>
                    <p className="font-heading text-3xl text-primary">3 Days</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Teams Competing</p>
                    <p className="font-heading text-3xl text-yellow-400">16</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            // Coming Soon View
            <motion.div
              key="coming-soon"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-12 md:p-16 text-center border-2 border-primary/40 shadow-2xl shadow-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-xl glass-effect"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-8"
              >
                <div className="inline-block">
                  <div className="text-6xl md:text-8xl font-heading text-accent mb-6">⏳</div>
                </div>
              </motion.div>

              <h2 className="font-heading text-4xl md:text-5xl text-accent mb-6">Schedule Coming Soon</h2>
              <p className="font-body text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
                The detailed match schedule for ICCT26 Cricket Tournament will be released soon. Stay tuned for updates on match dates, times, venues, and team matchups!
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <div className="rounded-xl px-8 py-4 border-2 border-accent/60 bg-accent/10 backdrop-blur-lg shadow-lg shadow-accent/20 glass-effect hover:shadow-xl transition-all">
                  <p className="font-subheading font-bold text-accent">🏏 Tournament Start: January 24, 2026</p>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-body text-gray-400 text-sm md:text-base mt-12"
              >
                Follow us on social media for latest announcements and updates
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Schedule
