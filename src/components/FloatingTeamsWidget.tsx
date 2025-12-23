/**
 * Floating Teams Widget
 * Displays registered teams count and list in a floating widget
 * Accessible from all pages with detailed team view
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Users } from 'lucide-react'
import { apiService } from '../services/api'
import '../styles/scrollbar.css'

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

export const FloatingTeamsWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  // Fetch confirmed teams when widget opens
  useEffect(() => {
    if (isOpen && teams.length === 0) {
      fetchTeams()
    }
  }, [isOpen])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiService.getAdminTeams('confirmed')
      const teamsData = response.data || response.teams || response
      
      if (Array.isArray(teamsData)) {
        // Fetch detailed info for each team
        const detailedTeamsPromises = teamsData.map(async (team: any) => {
          try {
            const teamId = team.teamId || team.team_id
            const detailResponse = await apiService.getAdminTeamById(teamId)
            const teamData = detailResponse.team || detailResponse.data?.team || detailResponse.data || detailResponse
            const playersData = detailResponse.players || detailResponse.data?.players || []

            return {
              teamId: teamData.teamId || teamData.team_id || '',
              teamName: teamData.teamName || teamData.team_name || 'Unnamed Team',
              churchName: teamData.churchName || teamData.church_name || 'Unknown Church',
              captain: {
                name: teamData.captain?.name || teamData.captainName || teamData.captain_name || 'N/A',
                email: teamData.captain?.email || teamData.captainEmail || teamData.captain_email || '',
                phone: teamData.captain?.phone || teamData.captainPhone || teamData.captain_phone || '',
                whatsapp: teamData.captain?.whatsapp || teamData.captainWhatsapp || ''
              },
              viceCaptain: {
                name: teamData.viceCaptain?.name || teamData.viceCaptainName || teamData.vice_captain_name || 'N/A',
                email: teamData.viceCaptain?.email || teamData.viceCaptainEmail || teamData.vice_captain_email || '',
                phone: teamData.viceCaptain?.phone || teamData.viceCaptainPhone || teamData.vice_captain_phone || '',
                whatsapp: teamData.viceCaptain?.whatsapp || teamData.viceCaptainWhatsapp || ''
              },
              playerCount: teamData.playerCount || teamData.player_count || (playersData?.length || 0),
              registrationDate: teamData.registrationDate || teamData.registration_date || '',
              registrationStatus: teamData.registrationStatus || teamData.registration_status || 'confirmed',
              players: (playersData || []).map((p: any) => ({
                playerId: p.playerId || p.player_id || '',
                name: p.name || 'Unknown',
                role: p.role || 'N/A',
                aadharFile: p.aadharFile || p.aadhar_file || '',
                subscriptionFile: p.subscriptionFile || p.subscription_file || ''
              }))
            }
          } catch (err) {
            console.warn(`Failed to fetch details for team:`, err)
            // Return basic team info if detail fetch fails
            return {
              teamId: team.teamId || team.team_id || '',
              teamName: team.teamName || team.team_name || 'Unnamed Team',
              churchName: team.churchName || team.church_name || 'Unknown Church',
              captain: { name: 'N/A', email: '', phone: '', whatsapp: '' },
              viceCaptain: { name: 'N/A', email: '', phone: '', whatsapp: '' },
              playerCount: team.playerCount || team.player_count || 0,
              registrationDate: '',
              registrationStatus: 'confirmed',
              players: []
            }
          }
        })

        const detailedTeams = await Promise.all(detailedTeamsPromises)
        setTeams(detailedTeams)
      }
    } catch (err) {
      console.error('Failed to fetch teams:', err)
      setError('Failed to load teams')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-40 px-7 py-4 rounded-2xl bg-gradient-to-br from-accent via-yellow-500 to-accent shadow-2xl flex items-center justify-center gap-3 text-black font-bold hover:shadow-3xl transition-all"
        style={{ 
          boxShadow: '0 0 30px rgba(255, 204, 41, 0.4)',
          borderRadius: '20px'
        }}
      >
        <span className="font-body text-base tracking-wide">TEAMS</span>
      </motion.button>

      {/* Teams List Panel */}
      <AnimatePresence>
        {isOpen && !selectedTeam && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-24 right-8 z-50 w-full max-w-md glass-effect rounded-2xl p-6 border border-accent/30 shadow-2xl max-h-[70vh] overflow-y-auto custom-scrollbar"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 43, 92, 0.8) 0%, rgba(13, 27, 42, 0.8) 100%)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading text-2xl text-accent">Registered Teams</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    {teams.length} team{teams.length !== 1 ? 's' : ''} confirmed
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-accent border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
                  {error}
                </div>
              ) : teams.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No registered teams yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {teams.map((team, index) => (
                    <motion.button
                      key={team.teamId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedTeam(team)}
                      className="w-full text-left bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all border border-white/10 hover:border-accent/50 group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-subheading font-semibold text-white text-sm group-hover:text-accent transition-colors">
                          {team.teamName}
                        </h4>
                        <span className="bg-accent/20 text-accent text-xs font-bold px-2 py-1 rounded">
                          {team.playerCount} Players
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {team.churchName}
                      </p>

                      <p className="text-xs text-gray-300">
                        Captain: {team.captain.name}
                      </p>

                      <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="text-xs text-gray-500">Click to view details</span>
                        <svg className="w-4 h-4 text-accent/60 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400 text-center">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
              <div className="w-full max-w-2xl rounded-3xl overflow-hidden border border-accent/40 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(13, 27, 42, 0.95) 50%, rgba(0, 43, 92, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: '0 25px 50px rgba(255, 204, 41, 0.15), 0 0 60px rgba(255, 204, 41, 0.1)'
                }}
              >
                {/* Modal Header */}
                <div className="relative overflow-hidden p-8 border-b border-accent/20"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 204, 41, 0.15) 0%, rgba(255, 204, 41, 0.05) 100%)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
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
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                  {/* Captain Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-3"
                  >
                    <h3 className="font-heading text-lg text-accent uppercase tracking-wider">Captain</h3>
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-accent/30 transition-all group hover:border-accent/60"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 204, 41, 0.1) 0%, rgba(255, 204, 41, 0.05) 100%)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <motion.div 
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border border-accent/40"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 204, 41, 0.3) 0%, rgba(255, 204, 41, 0.1) 100%)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <span className="text-lg font-bold text-accent">C</span>
                      </motion.div>
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
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-accent/30 transition-all group hover:border-accent/60"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 204, 41, 0.1) 0%, rgba(255, 204, 41, 0.05) 100%)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <motion.div 
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border border-accent/40"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 204, 41, 0.3) 0%, rgba(255, 204, 41, 0.1) 100%)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <span className="text-lg font-bold text-accent">VC</span>
                      </motion.div>
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
                            className="p-3 rounded-lg border border-accent/30 transition-all hover:border-accent/60"
                            style={{
                              background: 'linear-gradient(135deg, rgba(255, 204, 41, 0.08) 0%, rgba(255, 204, 41, 0.03) 100%)',
                              backdropFilter: 'blur(8px)'
                            }}
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
    </>
  )
}

export default FloatingTeamsWidget
