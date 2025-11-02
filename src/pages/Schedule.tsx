import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Radio } from 'lucide-react'
import { useState } from 'react'

interface Match {
  id: number
  match: string
  date: string
  time: string
  venue: string
  teamA: string
  teamB: string
  status: 'upcoming' | 'live' | 'completed'
}

const Schedule = () => {
  const [filter, setFilter] = useState<string>('all')

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
    {
      id: 2,
      match: 'Match 2 - Group A',
      date: '2026-01-24',
      time: '02:00 PM',
      venue: 'Main Ground',
      teamA: 'Royal Challengers',
      teamB: 'Super Kings',
      status: 'upcoming',
    },
    {
      id: 3,
      match: 'Match 3 - Group B',
      date: '2026-01-25',
      time: '10:00 AM',
      venue: 'Main Ground',
      teamA: 'Mumbai Titans',
      teamB: 'Delhi Daredevils',
      status: 'upcoming',
    },
    {
      id: 4,
      match: 'Match 4 - Group B',
      date: '2026-01-25',
      time: '03:00 PM',
      venue: 'Main Ground',
      teamA: 'Kolkata Knights',
      teamB: 'Punjab Panthers',
      status: 'upcoming',
    },
    {
      id: 5,
      match: 'Semi Final',
      date: '2026-01-25',
      time: '06:00 PM',
      venue: 'Main Ground',
      teamA: 'TBD',
      teamB: 'TBD',
      status: 'upcoming',
    },
    {
      id: 6,
      match: 'Grand Final',
      date: '2026-01-26',
      time: '02:00 PM',
      venue: 'Main Ground',
      teamA: 'TBD',
      teamB: 'TBD',
      status: 'upcoming',
    },
  ]

  const filteredMatches = filter === 'all' ? matches : matches.filter(m => m.date === filter)
  const uniqueDates = Array.from(new Set(matches.map(m => m.date)))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-4 lg:px-8"
    >
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-6xl md:text-7xl text-accent mb-4">
            Tournament Schedule
          </h1>
          <p className="font-subheading text-xl text-gray-300">
            Mark your calendars for these exciting matches
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-subheading font-semibold transition-all duration-300 ${
              filter === 'all'
                ? 'bg-gradient-gold text-primary'
                : 'glass-effect text-white hover:bg-white/20'
            }`}
          >
            All Matches
          </button>
          {uniqueDates.map(date => (
            <button
              key={date}
              onClick={() => setFilter(date)}
              className={`px-6 py-3 rounded-lg font-subheading font-semibold transition-all duration-300 ${
                filter === date
                  ? 'bg-gradient-gold text-primary'
                  : 'glass-effect text-white hover:bg-white/20'
              }`}
            >
              {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </button>
          ))}
        </motion.div>

        {/* Matches Grid */}
        <div className="space-y-6">
          {filteredMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className="glass-effect glow-border rounded-2xl p-6 md:p-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Match Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-heading text-2xl md:text-3xl text-accent">
                      {match.match}
                    </h3>
                    {match.status === 'live' && (
                      <span className="flex items-center gap-2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse-slow">
                        <Radio className="w-4 h-4" />
                        LIVE
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-accent" />
                      <span className="font-subheading">
                        {new Date(match.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-accent" />
                      <span className="font-subheading">{match.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-accent" />
                      <span className="font-subheading">{match.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Teams */}
                <div className="flex items-center gap-6">
                  <div className="text-center flex-1">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gradient-gold rounded-full flex items-center justify-center">
                      <span className="font-heading text-2xl text-primary">
                        {match.teamA.charAt(0)}
                      </span>
                    </div>
                    <p className="font-subheading font-semibold text-white text-sm">
                      {match.teamA}
                    </p>
                  </div>

                  <span className="font-heading text-3xl text-accent">VS</span>

                  <div className="text-center flex-1">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center border-2 border-accent">
                      <span className="font-heading text-2xl text-accent">
                        {match.teamB.charAt(0)}
                      </span>
                    </div>
                    <p className="font-subheading font-semibold text-white text-sm">
                      {match.teamB}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredMatches.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="font-subheading text-2xl text-gray-400">
              No matches found for the selected date
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Schedule
