/**
 * Teams Display Page
 * Shows all approved/confirmed teams with their players
 * Fetches real data from backend API
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, MapPin } from 'lucide-react'
import { apiService } from '../services/api'

// Set to true to close/lock teams page
const TEAMS_LOCKED = false

interface Player {
  playerId?: string
  name: string
  role: string
  aadharFile?: string
  subscriptionFile?: string
}

interface Team {
  teamId: string
  teamName: string
  churchName: string
  captain: {
    name: string
    email: string
    phone: string
    whatsapp?: string
  }
  viceCaptain: {
    name: string
    email: string
    phone: string
    whatsapp?: string
  }
  playerCount: number
  registrationDate: string
  registrationStatus: string
  players?: Player[]
}

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  // Show coming soon message if page is locked
  if (TEAMS_LOCKED) {
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
              Approved Teams
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
              Teams Coming Soon
            </h2>
            
            <p className="font-body text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              The list of approved teams for ICCT26 Cricket Tournament will be displayed soon. Stay tuned to see all participating teams!
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

  useEffect(() => {
    fetchApprovedTeams()
  }, [])

  const fetchApprovedTeams = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch only confirmed teams
      const response = await apiService.getAdminTeams('confirmed')
      const teamsData = response.data || response.teams || response

      if (Array.isArray(teamsData) && teamsData.length > 0) {
        // Fetch complete details for each team
        const detailedTeamsPromises = teamsData.map(async (team: any) => {
          try {
            const teamId = team.teamId || team.team_id
            const detailResponse = await apiService.getAdminTeamById(teamId)

            const teamData = detailResponse.team || detailResponse.data?.team || detailResponse.data || detailResponse
            const playersData = detailResponse.players || detailResponse.data?.players || []

            return {
              ...teamData,
              players: playersData
            }
          } catch (err) {
            console.warn(`Failed to fetch details for team ${team.teamId}:`, err)
            return team
          }
        })

        const detailedTeams = await Promise.all(detailedTeamsPromises)

        // Sanitize data
        const safeTeams = detailedTeams.map((team: any) => ({
          teamId: team.teamId || team.team_id || 'UNKNOWN',
          teamName: team.teamName || team.team_name || 'Unnamed Team',
          churchName: team.churchName || team.church_name || 'Unknown Church',
          captain: {
            name: team.captain?.name || team.captainName || team.captain_name || 'N/A',
            email: team.captain?.email || team.captainEmail || team.captain_email || '',
            phone: team.captain?.phone || team.captainPhone || team.captain_phone || '',
            whatsapp: team.captain?.whatsapp || team.captainWhatsapp || ''
          },
          viceCaptain: {
            name: team.viceCaptain?.name || team.viceCaptainName || team.vice_captain_name || 'N/A',
            email: team.viceCaptain?.email || team.viceCaptainEmail || team.vice_captain_email || '',
            phone: team.viceCaptain?.phone || team.viceCaptainPhone || team.vice_captain_phone || '',
            whatsapp: team.viceCaptain?.whatsapp || team.viceCaptainWhatsapp || ''
          },
          playerCount: team.playerCount || team.player_count || (team.players?.length || 0),
          registrationDate: team.registrationDate || team.registration_date || '',
          registrationStatus: team.registrationStatus || team.registration_status || 'confirmed',
          players: (team.players || []).map((p: any) => ({
            playerId: p.playerId || p.player_id || '',
            name: p.name || 'Unknown',
            role: p.role || 'N/A',
            aadharFile: p.aadharFile || p.aadhar_file || '',
            subscriptionFile: p.subscriptionFile || p.subscription_file || ''
          }))
        }))

        setTeams(safeTeams)
      } else {
        setTeams([])
      }
    } catch (err) {
      console.error('Error fetching teams:', err)
      setError('Failed to load teams. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const filteredTeams = teams.filter(team => {
    const query = searchQuery.toLowerCase()
    return (
      (team.teamName || '').toLowerCase().includes(query) ||
      (team.teamId || '').toLowerCase().includes(query) ||
      (team.churchName || '').toLowerCase().includes(query) ||
      (team.captain?.name || '').toLowerCase().includes(query)
    )
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-4 lg:px-8 bg-gradient-to-b from-bg-start via-primary to-secondary"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <motion.div className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-accent/20 border border-accent/50 text-accent font-body text-sm font-semibold mb-6">
              ✨ TOURNAMENT TEAMS
            </span>
          </motion.div>
          <h1 className="font-heading text-7xl md:text-8xl text-white mb-4 tracking-tight">
            Tournament<br />
            <span className="bg-gradient-to-r from-accent via-yellow-300 to-accent bg-clip-text text-transparent">
              Teams
            </span>
          </h1>
          <p className="font-subheading text-gray-300 text-lg max-w-2xl mx-auto mb-6">
            Meet the {teams.length} confirmed teams competing in ICCT26 Cricket Tournament
          </p>
          <div className="inline-block px-6 py-3 rounded-lg bg-accent/10 border border-accent/30">
            <span className="font-heading text-2xl text-accent">{teams.length}</span>
            <span className="text-gray-300 font-body ml-2">Teams Confirmed</span>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border-2 border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent/50 font-body text-base transition-all hover:border-white/20"
            />
            <svg className="absolute right-4 top-4 w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>

        {/* Teams Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
              <p className="text-white font-body mt-4">Loading teams...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-8 text-red-200 font-body text-center">
              {error}
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white font-body text-lg">
                {teams.length === 0 ? 'No teams available' : 'No teams match your search'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTeams.map((team, index) => (
                <motion.div
                  key={team.teamId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedTeam(team)}
                  className="group cursor-pointer"
                >
                  {/* Team Card */}
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 hover:border-accent/50 transition-all duration-300 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl hover:shadow-2xl hover:shadow-accent/10">
                    {/* Hover Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Card Content */}
                    <div className="relative p-6">
                      {/* Team Header */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <span className="inline-block px-3 py-1 rounded-lg bg-accent/20 text-accent text-xs font-body font-semibold mb-3">
                              {team.teamId}
                            </span>
                            <h3 className="font-heading text-2xl text-white group-hover:text-accent transition-colors duration-300 mb-2">
                              {team.teamName}
                            </h3>
                            <p className="text-gray-400 font-body text-sm flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-accent/60" />
                              {team.churchName}
                            </p>
                          </div>
                          <motion.div
                            className="ml-4 flex-shrink-0"
                          >
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </div>
                          </motion.div>
                        </div>

                        {/* Captain Preview */}
                        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-accent">C</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-body">Captain</p>
                            <p className="text-sm text-white font-subheading truncate">{team.captain.name}</p>
                          </div>
                        </div>
                      </div>

                      {/* Players Count Badge */}
                      <div className="flex items-center gap-2 text-gray-400 font-body text-sm">
                        <Users className="w-4 h-4 text-accent/60" />
                        <span>{team.players?.length || 0} Players</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Team Details Modal */}
        <AnimatePresence>
          {selectedTeam && (
            <>
              {/* Modal Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTeam(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="w-full max-w-2xl rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary border border-white/10 shadow-2xl overflow-hidden">
                  {/* Modal Header */}
                  <div className="relative overflow-hidden bg-gradient-to-r from-accent/20 to-accent/10 p-8">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <span className="inline-block px-4 py-2 rounded-lg bg-accent/20 text-accent text-xs font-body font-semibold mb-4">
                          {selectedTeam.teamId}
                        </span>
                        <h2 className="font-heading text-4xl text-white mb-3">
                          {selectedTeam.teamName}
                        </h2>
                        <p className="text-gray-300 font-subheading flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-accent" />
                          {selectedTeam.churchName}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedTeam(null)}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Captain Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-3"
                    >
                      <h3 className="font-heading text-lg text-accent uppercase tracking-wider">Captain</h3>
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent/30 transition-all">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/40 to-accent/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-accent">C</span>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs font-body mb-1">Team Captain</p>
                          <p className="text-white font-subheading text-lg">{selectedTeam.captain.name}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Vice Captain Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="space-y-3"
                    >
                      <h3 className="font-heading text-lg text-accent uppercase tracking-wider">Vice Captain</h3>
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent/30 transition-all">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/40 to-accent/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-accent">VC</span>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs font-body mb-1">Vice Captain</p>
                          <p className="text-white font-subheading text-lg">{selectedTeam.viceCaptain.name}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Players Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-3"
                    >
                      <h3 className="font-heading text-lg text-accent uppercase tracking-wider">
                        Players ({selectedTeam.players?.length || 0})
                      </h3>
                      {selectedTeam.players && selectedTeam.players.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedTeam.players.map((player, playerIndex) => (
                            <motion.div
                              key={player.playerId || playerIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.25 + playerIndex * 0.02 }}
                              className="p-3 rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/50 transition-all"
                            >
                              <p className="text-white font-body text-sm">
                                <span className="text-accent font-semibold">{playerIndex + 1}.</span> {player.name}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 font-body">No players registered</p>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Teams
