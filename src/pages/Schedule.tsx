import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Trophy, Clock, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Match {
  id: number
  round: string
  round_number: number
  match_number: number
  team1: string
  team2: string
  status: 'scheduled' | 'live' | 'completed'
  result?: {
    winner: string
    margin: number
    marginType: 'runs' | 'wickets'
    wonByBattingFirst: boolean
  }
}

const Schedule = () => {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'upcoming' | 'done'>('ongoing')
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = import.meta.env.VITE_API_URL || 'https://icct26-backend.onrender.com'

  // Fetch matches from backend
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/api/schedule/matches`)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || 'Failed to fetch matches')
        }

        const data = await response.json()
        setMatches(data.data || [])
        setError(null)
      } catch (err: any) {
        console.error('Error fetching matches:', err)
        setError(err.message || 'Failed to load schedule')
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
    
    // Refresh every 30 seconds for live updates
    const interval = setInterval(fetchMatches, 30000)
    return () => clearInterval(interval)
  }, [API_URL])

  // Filter matches by status
  const ongoingMatches = matches.filter(m => m.status === 'live')
  const upcomingMatches = matches.filter(m => m.status === 'scheduled')
  const doneMatches = matches.filter(m => m.status === 'completed').reverse() // Show latest matches first (stack format)

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

  const getRoundIcon = (roundNumber: number): string => {
    const icons = ['🏏', '⚡', '🏆', '⭐', '👑']
    return icons[roundNumber - 1] || '🏏'
  }

  const getRoundColor = (roundNumber: number): string => {
    const colors = [
      'text-blue-400',
      'text-green-400',
      'text-accent',
      'text-primary',
      'text-yellow-400'
    ]
    return colors[roundNumber - 1] || 'text-gray-400'
  }

  const MatchCard = ({ match }: { match: Match }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, x: 0 }}
      className="glass-card rounded-xl p-4 md:p-6 border border-primary/30 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Round & Status */}
        <div className="md:w-40">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getRoundIcon(match.round_number)}</span>
            <p className={`font-subheading font-bold ${getRoundColor(match.round_number)} text-sm`}>
              {match.round}
            </p>
          </div>
          <p className="text-gray-400 text-xs mb-2">Match {match.match_number}</p>
          <div>{getStatusBadge(match.status)}</div>
        </div>

        {/* Teams */}
        <div className="flex-1">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex-1 text-right">
              <p className="font-subheading font-semibold text-gray-100 text-sm md:text-base">
                {match.team1}
              </p>
            </div>
            <div className="px-3 py-1 bg-accent/20 rounded-lg text-accent font-bold text-sm">
              VS
            </div>
            <div className="flex-1 text-left">
              <p className="font-subheading font-semibold text-gray-100 text-sm md:text-base">
                {match.team2}
              </p>
            </div>
          </div>
          
          {/* Result Display for Completed Matches */}
          {match.status === 'completed' && match.result && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-center text-green-400 font-bold text-sm">
                {match.result.winner} won by {match.result.margin} {match.result.marginType}
                {match.result.wonByBattingFirst ? ' (batting first)' : ' (chasing)'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-primary pt-20 md:pt-32 pb-20 px-3 md:px-4 lg:px-8"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
            <div className="text-5xl md:text-8xl font-bold text-accent animate-pulse">🏏</div>
          </div>
          <h1 className="font-heading text-3xl md:text-5xl lg:text-7xl text-accent mb-2 md:mb-4 tracking-wider">
            MATCH SCHEDULE
          </h1>
          <p className="font-body text-sm md:text-lg lg:text-xl text-gray-300 mb-2">
            ICCT26 Tournament Schedule
          </p>
          <div className="w-16 md:w-20 h-1 bg-gradient-gold rounded-full mx-auto"></div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent border-t-transparent mx-auto mb-6"></div>
            <p className="text-gray-300 text-xl">Loading schedule...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 border-2 border-red-500/30 text-center"
          >
            <div className="text-5xl mb-4">❌</div>
            <h3 className="text-2xl font-bold text-red-400 mb-2">Error Loading Schedule</h3>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-gold text-primary rounded-lg font-bold hover:shadow-lg hover:shadow-accent/50 transition-all"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && matches.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl overflow-hidden backdrop-blur-xl"
          >
            <div className="relative bg-gradient-to-br from-primary/40 via-primary/20 to-secondary/30 border-2 border-accent/50 p-16 md:p-24">
              {/* Animated background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl -z-10"></div>

              <div className="relative z-10 text-center">
                {/* Animated icon */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block mb-8"
                >
                  <div className="text-8xl">📅</div>
                </motion.div>

                {/* Title */}
                <h3 className="font-heading text-4xl md:text-5xl font-bold text-accent mb-6 tracking-wider">
                  No Matches Scheduled
                </h3>

                {/* Subtitle */}
                <p className="font-body text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                  The tournament schedule will be available soon.
                </p>

                {/* Description */}
                <div className="inline-block px-8 py-4 rounded-2xl bg-accent/10 border-2 border-accent/40 backdrop-blur-lg mb-8">
                  <p className="text-gray-300 font-medium">
                    ✨ Matches will appear here once the admin adds them
                  </p>
                </div>

                {/* CTA Text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-accent text-sm font-bold uppercase tracking-widest"
                >
                  Check back soon for updates!
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Schedule View */}
        <AnimatePresence mode="wait">
          {!loading && !error && matches.length > 0 && (
            // Schedule View - Tabbed Interface
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Round Header */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-8 md:mb-12 px-2"
              >
                <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 md:px-6 py-3 rounded-full bg-accent/10 border-2 border-accent/40 mb-6 backdrop-blur-lg">
                  <span className="text-2xl animate-bounce flex-shrink-0">🏏</span>
                  <h2 className="font-heading text-lg md:text-2xl lg:text-3xl text-accent uppercase tracking-wider">
                    Match Center
                  </h2>
                  <span className="text-accent text-xs md:text-sm font-bold bg-accent/20 px-2 md:px-3 py-1 rounded-full whitespace-nowrap">{matches.length} Matches</span>
                </div>
              </motion.div>

              {/* Tab Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-center mb-8 md:mb-12 px-2"
              >
                <div className="bg-secondary/80 backdrop-blur-xl rounded-2xl p-1 md:p-2 border-2 border-accent/30 shadow-2xl shadow-accent/20 w-full max-w-md">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    {[
                      { id: 'ongoing', label: 'LIVE NOW', count: ongoingMatches.length, color: 'bg-red-500', icon: '🔴' },
                      { id: 'upcoming', label: 'UPCOMING', count: upcomingMatches.length, color: 'bg-accent', icon: '⏳' },
                      { id: 'done', label: 'COMPLETED', count: doneMatches.length, color: 'bg-green-500', icon: '✅' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'ongoing' | 'upcoming' | 'done')}
                        className={`px-3 md:px-6 py-2 md:py-3 rounded-xl font-heading font-bold transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 uppercase tracking-wider text-xs md:text-sm flex-1 ${
                          activeTab === tab.id
                            ? `${tab.color} text-white shadow-lg shadow-accent/50 transform scale-100 md:scale-105`
                            : 'text-gray-400 hover:text-accent border border-gray-500/30 hover:border-accent/50'
                        }`}
                      >
                        <span className="text-lg">{tab.icon}</span>
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs font-bold ${
                          activeTab === tab.id
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-700/50 text-gray-300'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Matches List */}
                  <div className="space-y-4">
                    {(() => {
                      const currentMatches = activeTab === 'ongoing' ? ongoingMatches :
                                           activeTab === 'upcoming' ? upcomingMatches : doneMatches

                      if (currentMatches.length === 0) {
                        return (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                          >
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="font-heading text-xl text-gray-600 mb-2">
                              No {activeTab} matches
                            </h3>
                            <p className="text-gray-500">
                              {activeTab === 'ongoing' && 'No matches are currently in progress.'}
                              {activeTab === 'upcoming' && 'All matches have been completed.'}
                              {activeTab === 'done' && 'No matches have been completed yet.'}
                            </p>
                          </motion.div>
                        )
                      }

                      return currentMatches.map((match, index) => (
                        <motion.div
                          key={match.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.01, x: 0 }}
                          className={`backdrop-blur-xl rounded-2xl p-4 md:p-6 lg:p-8 border-2 transition-all hover:shadow-2xl ${
                            activeTab === 'ongoing' 
                              ? 'bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-400/50 hover:border-red-400 hover:shadow-red-500/30'
                              : activeTab === 'upcoming' 
                              ? 'bg-gradient-to-br from-accent/15 to-accent/5 border-accent/30 hover:border-accent/60 hover:shadow-accent/40'
                              : 'bg-gradient-to-br from-green-500/15 to-green-600/5 border-green-400/40 hover:border-green-400 hover:shadow-green-500/30'
                          }`}
                        >
                          {/* Match Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 md:mb-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                                activeTab === 'ongoing' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                                activeTab === 'upcoming' ? 'bg-gradient-to-br from-accent to-yellow-500' : 'bg-gradient-to-br from-green-500 to-green-600'
                              }`}>
                                {match.match_number}
                              </div>
                              <div className="min-w-0">
                                <h3 className={`font-heading text-base md:text-lg font-bold truncate ${
                                  activeTab === 'ongoing' ? 'text-red-300' :
                                  activeTab === 'upcoming' ? 'text-accent' : 'text-green-300'
                                }`}>
                                  Match {match.match_number}
                                </h3>
                                <p className="text-gray-400 text-xs md:text-sm">{match.round}</p>
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              {getStatusBadge(match.status)}
                            </div>
                          </div>

                          {/* Teams */}
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
                            <div className="w-full sm:flex-1">
                              <div className={`border-2 rounded-xl px-2 md:px-4 py-3 md:py-4 text-center transition-all ${
                                activeTab === 'ongoing' ? 'bg-red-500/10 border-red-400/60 hover:bg-red-500/20' :
                                activeTab === 'upcoming' ? 'bg-accent/10 border-accent/40 hover:bg-accent/20' :
                                'bg-green-500/10 border-green-400/60 hover:bg-green-500/20'
                              }`}>
                                <p className={`font-heading font-bold text-sm md:text-base lg:text-lg truncate ${
                                  activeTab === 'ongoing' ? 'text-red-200' :
                                  activeTab === 'upcoming' ? 'text-accent' : 'text-green-200'
                                }`}>
                                  {match.team1}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-center flex-shrink-0">
                              <div className={`text-white px-3 md:px-4 py-1 md:py-2 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider whitespace-nowrap ${
                                activeTab === 'ongoing' ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50' :
                                activeTab === 'upcoming' ? 'bg-gradient-gold shadow-lg shadow-accent/50' : 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/50'
                              }`}>
                                VS
                              </div>
                            </div>
                            <div className="w-full sm:flex-1">
                              <div className={`border-2 rounded-xl px-2 md:px-4 py-3 md:py-4 text-center transition-all ${
                                activeTab === 'ongoing' ? 'bg-red-500/10 border-red-400/60 hover:bg-red-500/20' :
                                activeTab === 'upcoming' ? 'bg-accent/10 border-accent/40 hover:bg-accent/20' :
                                'bg-green-500/10 border-green-400/60 hover:bg-green-500/20'
                              }`}>
                                <p className={`font-heading font-bold text-sm md:text-base lg:text-lg truncate ${
                                  activeTab === 'ongoing' ? 'text-red-200' :
                                  activeTab === 'upcoming' ? 'text-accent' : 'text-green-200'
                                }`}>
                                  {match.team2}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Match Footer */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 md:pt-6 border-t border-white/10">
                            <div className="flex flex-wrap items-center gap-2">
                              {activeTab === 'done' && match.result && (
                                <div className={`flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg text-xs font-bold backdrop-blur ${
                                  match.result.wonByBattingFirst 
                                    ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50'
                                    : 'bg-purple-500/30 text-purple-200 border border-purple-400/50'
                                }`}>
                                  <Trophy className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{match.result.winner} won by {match.result.margin} {match.result.marginType}</span>
                                </div>
                              )}
                              <div className={`px-3 md:px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                                activeTab === 'ongoing'
                                  ? 'bg-red-500/40 text-red-200 border border-red-400/50 animate-pulse'
                                  : activeTab === 'upcoming'
                                  ? 'bg-accent/30 text-accent border border-accent/50'
                                  : 'bg-green-500/40 text-green-200 border border-green-400/50'
                              }`}>
                                {activeTab === 'ongoing' && '🔴 LIVE'}
                                {activeTab === 'upcoming' && '⏳ SCHEDULED'}
                                {activeTab === 'done' && '✅ COMPLETED'}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    })()}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Schedule
