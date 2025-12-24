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
      const response = await apiService.getAdminTeams()
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
        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-40 px-5 md:px-7 py-3 md:py-4 rounded-2xl bg-gradient-to-br from-accent via-yellow-500 to-accent shadow-2xl flex items-center justify-center gap-2 md:gap-3 text-black font-bold hover:shadow-3xl transition-all text-sm md:text-base"
        style={{ 
          boxShadow: '0 0 30px rgba(255, 204, 41, 0.4)',
          borderRadius: '20px'
        }}
      >
        <span className="font-body tracking-wide">TEAMS</span>
      </motion.button>

      {/* Teams List Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/75 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-20 right-4 md:bottom-24 md:right-8 z-50 w-[calc(100%-2rem)] md:w-full md:max-w-md glass-effect rounded-2xl p-4 md:p-6 border border-accent/30 shadow-2xl max-h-[60vh] md:max-h-[70vh] overflow-y-auto custom-scrollbar"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 43, 92, 0.8) 0%, rgba(13, 27, 42, 0.8) 100%)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4 md:mb-6 gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-xl md:text-2xl text-accent">All Teams</h3>
                  <p className="text-xs md:text-sm text-gray-300 mt-1">
                    {teams.length} team{teams.length !== 1 ? 's' : ''} registered
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5 text-white" />
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
                  {teams.map((team, index) => {
                    // Determine status color and label
                    const statusConfig = {
                      'confirmed': { label: 'Registered', bgColor: 'bg-green-500/20', textColor: 'text-green-400', borderColor: 'border-green-500/30' },
                      'pending': { label: 'In Progress', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/30' },
                      'waiting': { label: 'In Progress', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/30' },
                      'rejected': { label: 'Rejected', bgColor: 'bg-red-500/20', textColor: 'text-red-400', borderColor: 'border-red-500/30' }
                    }
                    const status = team.registrationStatus?.toLowerCase() || 'pending'
                    const statusStyle = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending']

                    return (
                    <div
                      key={team.teamId}
                      className="w-full text-left bg-white/10 hover:bg-white/20 rounded-xl p-3 md:p-4 transition-all border border-white/10 hover:border-accent/50 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <h4 className="font-subheading font-semibold text-white text-xs md:text-sm group-hover:text-accent transition-colors break-words flex-1">
                          {team.teamName}
                        </h4>
                        <span className={`${statusStyle.bgColor} ${statusStyle.textColor} text-xs font-bold px-2 md:px-3 py-1 rounded border ${statusStyle.borderColor} flex-shrink-0`}>
                          {statusStyle.label}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mb-1 md:mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{team.churchName}</span>
                      </p>

                      <p className="text-xs text-gray-300 truncate">
                        Captain: {team.captain.name}
                      </p>
                    </div>
                    )
                  })}
                </div>
              )}

              {/* Footer */}
              <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400 text-center">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


    </>
  )
}

export default FloatingTeamsWidget
