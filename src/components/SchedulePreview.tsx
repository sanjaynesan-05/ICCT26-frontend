import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Clock, Trophy, ExternalLink } from 'lucide-react'

interface Match {
  id: number
  round: string
  round_number: number
  match_number: number
  team1: string
  team2: string
  status: 'scheduled' | 'live' | 'completed'
  toss_winner?: string | null
  toss_choice?: 'bat' | 'bowl' | null
  scheduled_start_time?: string | null
  actual_start_time?: string | null
  match_end_time?: string | null
  team1_first_innings_score?: number | null
  team2_first_innings_score?: number | null
  team1_first_innings_runs?: number | null
  team1_first_innings_wickets?: number | null
  team2_first_innings_runs?: number | null
  team2_first_innings_wickets?: number | null
  match_score_url?: string | null
  first_innings_team?: string | null
  second_innings_team?: string | null
  result?: {
    winner: string
    margin: number
    marginType: 'runs' | 'wickets'
    wonByBattingFirst: boolean
  }
}

const SchedulePreview = () => {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = import.meta.env.VITE_API_URL || 'https://icct26-backend.onrender.com'

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/api/schedule/matches`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch matches')
        }

        const data = await response.json()
        const normalizedMatches = (data.data || []).map((match: any) => ({
          ...match,
          status: match.status === 'done' ? 'completed' : match.status
        }))
        setMatches(normalizedMatches)
        setError(null)
      } catch (err: any) {
        console.error('Error fetching matches:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [API_URL])

  // Get live match or nearest upcoming match
  const getLiveOrUpcomingMatch = (): Match | null => {
    const liveMatch = matches.find(m => m.status === 'live')
    if (liveMatch) return liveMatch

    const upcomingMatches = matches.filter(m => m.status === 'scheduled')
    return upcomingMatches.length > 0 ? upcomingMatches[0] : null
  }

  // Get next match after the first one
  const getNextMatch = (): Match | null => {
    const firstMatch = getLiveOrUpcomingMatch()
    if (!firstMatch) {
      const upcomingMatches = matches.filter(m => m.status === 'scheduled')
      return upcomingMatches.length > 1 ? upcomingMatches[1] : null
    }

    const upcomingMatches = matches.filter(
      m => m.status === 'scheduled' && m.id !== firstMatch.id
    )
    return upcomingMatches.length > 0 ? upcomingMatches[0] : null
  }

  const primaryMatch = getLiveOrUpcomingMatch()
  const secondaryMatch = getNextMatch()

  if (loading) {
    return (
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-5xl md:text-6xl text-center text-accent mb-16"
          >
            Schedule
          </motion.h2>
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !primaryMatch) {
    return null
  }

  const formatScore = (runs?: number | null, wickets?: number | null): string => {
    if (runs === null || runs === undefined) {
      return '-'
    }
    const w = wickets ?? 0
    return `${runs}/${w}`
  }

  const MatchCard = ({ match }: { match: Match }) => {
    const formatTime = (timeString: string) => {
      return new Date(timeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }

    const formatDate = (timeString: string) => {
      return new Date(timeString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02, y: -5 }}
        className={`rounded-2xl p-6 md:p-8 border-2 transition-all duration-300 ${
          match.status === 'live'
            ? 'bg-red-500/10 border-red-400/40 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/20'
            : 'bg-accent/10 border-accent/40 hover:border-accent hover:shadow-lg hover:shadow-accent/20'
        }`}
      >
        {/* Round and Status */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-xs md:text-sm font-bold uppercase tracking-wider ${
              match.status === 'live' ? 'text-red-300' : 'text-accent'
            }`}>
              {match.round}
            </p>
            <h3 className="text-lg md:text-xl font-bold text-white">
              Match {match.match_number}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-3 md:px-4 py-1 md:py-2 rounded-lg font-bold text-xs md:text-sm ${
              match.status === 'live'
                ? 'bg-red-500/40 text-red-100 animate-pulse'
                : 'bg-accent/30 text-accent'
            }`}>
              {match.status === 'live' ? '🔴 LIVE' : '⏳ UPCOMING'}
            </div>
            {match.match_score_url && (
              <a
                href={match.match_score_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded-lg transition-all"
                title="View Scorecard"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Teams */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="flex-1">
              <p className="text-center font-bold text-gray-200 text-sm md:text-lg mb-2">
                {match.team1}
              </p>
            </div>
            <div className={`px-2 md:px-3 py-1 rounded font-bold text-xs md:text-sm flex-shrink-0 ${
              match.status === 'live'
                ? 'bg-red-500 text-white'
                : 'bg-accent text-black'
            }`}>
              VS
            </div>
            <div className="flex-1">
              <p className="text-center font-bold text-gray-200 text-sm md:text-lg mb-2">
                {match.team2}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 md:space-y-4 pt-4 border-t border-white/10">
          {/* Scheduled Time */}
          {match.status !== 'live' && match.scheduled_start_time && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3"
            >
              <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs md:text-sm text-gray-400">Scheduled Time</p>
                <p className="text-sm md:text-base font-bold text-white">
                  {formatTime(match.scheduled_start_time)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(match.scheduled_start_time)}
                </p>
              </div>
            </motion.div>
          )}

          {/* Toss Info for Live/Completed Matches */}
          {match.status !== 'scheduled' && match.toss_winner && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3"
            >
              <Trophy className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs md:text-sm text-gray-400">Toss</p>
                <p className="text-sm md:text-base font-bold text-white">
                  {match.toss_winner} won • chose to {match.toss_choice === 'bat' ? 'bat' : 'bowl'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Scores for Live/Completed Matches */}
          {(match.status === 'live' || match.status === 'completed') && 
           (match.team1_first_innings_runs !== null || match.team2_first_innings_runs !== null) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3"
            >
              <div className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 font-bold">📊</div>
              <div className="flex-1">
                <p className="text-xs md:text-sm text-gray-400 mb-2">Scores</p>
                <div className="space-y-1">
                  {match.team1_first_innings_runs !== null && (
                    <p className="text-xs md:text-sm font-semibold text-white">
                      {match.team1}: <span className="text-blue-300">{formatScore(match.team1_first_innings_runs, match.team1_first_innings_wickets)}</span>
                    </p>
                  )}
                  {match.team2_first_innings_runs !== null && (
                    <p className="text-xs md:text-sm font-semibold text-white">
                      {match.team2}: <span className="text-purple-300">{formatScore(match.team2_first_innings_runs, match.team2_first_innings_wickets)}</span>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <section className="py-20 px-4 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-5xl md:text-6xl text-accent mb-4">
            Schedule
          </h2>
          <p className="text-gray-300 text-lg">Upcoming matches at a glance</p>
        </motion.div>

        {/* Match Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
          {primaryMatch && <MatchCard match={primaryMatch} />}
          {secondaryMatch && <MatchCard match={secondaryMatch} />}
        </div>

        {/* View Full Schedule Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/schedule"
            className="inline-block btn-gold transition-transform hover:scale-105"
          >
            View Full Schedule
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default SchedulePreview
