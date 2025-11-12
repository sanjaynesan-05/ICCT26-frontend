import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdmin } from '../../contexts/AdminContext'
import { apiService } from '../../services/api'

interface Team {
  teamId: string
  teamName: string
  churchName: string
  captainName: string
  captainPhone: string
  captainEmail: string
  captainWhatsapp: string
  viceCaptainName: string
  viceCaptainPhone: string
  viceCaptainEmail: string
  viceCaptainWhatsapp: string
  playerCount: number
  registrationDate: string
  paymentReceipt: string
  pastorLetter: string
  players?: any[]
}

const AdminDashboard = () => {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { logout } = useAdmin()

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      setError('')

      let teamsList: any[] = []

      try {
        const response = await apiService.getAllTeams()
        const summaryTeams = response.teams || response.data || response
        
        // Fetch complete details for each team
        if (Array.isArray(summaryTeams) && summaryTeams.length > 0) {
          console.log(`Fetching complete details for ${summaryTeams.length} teams...`)
          
          const detailedTeamsPromises = summaryTeams.map(async (team: any) => {
            try {
              const teamId = team.teamId || team.team_id
              const detailResponse = await apiService.getTeamById(teamId)
              
              // Backend returns { team: {...}, players: [...] }
              // Merge them together
              const teamData = detailResponse.team || detailResponse.data || detailResponse
              const playersData = detailResponse.players || []
              
              return {
                ...teamData,
                players: playersData
              }
            } catch (err) {
              console.warn(`Failed to fetch details for team ${team.teamId}:`, err)
              return team // Return summary data if detail fetch fails
            }
          })
          
          teamsList = await Promise.all(detailedTeamsPromises)
        }
      } catch (adminError: any) {
        console.warn('Admin teams endpoint not available, trying fallback:', adminError.message)
        try {
          const response = await apiService.getTeamsFromDatabase()
          teamsList = response.teams || response.data || response
        } catch (databaseError: any) {
          console.error('Teams endpoint not available:', databaseError.message)
          setError('Failed to load teams from backend. Please ensure the backend server is running and accessible.')
          setTeams([])
          return
        }
      }

      // ✅ Sanitize data: ensure all string fields are safe strings
      const safeTeams = Array.isArray(teamsList)
        ? teamsList.map((team: any) => ({
            ...team,
            teamId: team.teamId || team.team_id || 'UNKNOWN-ID',
            teamName: team.teamName || team.team_name || 'Unnamed Team',
            churchName: team.churchName || team.church_name || 'Unknown Church',
            // Handle nested captain object OR flat properties
            captainName: team.captain?.name || team.captainName || team.captain_name || 'N/A',
            captainPhone: team.captain?.phone || team.captainPhone || team.captain_phone || '',
            captainEmail: team.captain?.email || team.captainEmail || team.captain_email || '',
            captainWhatsapp: team.captain?.whatsapp || team.captainWhatsapp || team.captain_whatsapp || '',
            // Handle nested viceCaptain object OR flat properties
            viceCaptainName: team.viceCaptain?.name || team.viceCaptainName || team.vice_captain_name || 'N/A',
            viceCaptainPhone: team.viceCaptain?.phone || team.viceCaptainPhone || team.vice_captain_phone || '',
            viceCaptainEmail: team.viceCaptain?.email || team.viceCaptainEmail || team.vice_captain_email || '',
            viceCaptainWhatsapp: team.viceCaptain?.whatsapp || team.viceCaptainWhatsapp || team.vice_captain_whatsapp || '',
            playerCount: team.playerCount || team.player_count || (team.players?.length || 0),
            registrationDate: team.registrationDate || team.registration_date || '',
            paymentReceipt: team.paymentReceipt || team.payment_receipt || '',
            pastorLetter: team.pastorLetter || team.pastor_letter || '',
            players: team.players || []
          }))
        : []

      setTeams(safeTeams)
    } catch (err) {
      console.error('Error fetching teams:', err)
      setError('Failed to load teams from backend. Connection error.')
      setTeams([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  // ✅ Safe Filtering (prevents "Cannot read toLowerCase of undefined")
  const filteredTeams = teams.filter(team => {
    const query = (searchQuery || '').toLowerCase()
    const teamName = (team.teamName || '').toLowerCase()
    const churchName = (team.churchName || '').toLowerCase()
    const teamId = (team.teamId || '').toLowerCase()
    const captainName = (team.captainName || '').toLowerCase()

    return (
      teamName.includes(query) ||
      churchName.includes(query) ||
      teamId.includes(query) ||
      captainName.includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Admin Header */}
      <header className="bg-primary/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-4xl text-white tracking-wider">ICCT'26 ADMIN</h1>
              <p className="font-body text-accent text-sm">Team Management Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="font-body text-white/80 hover:text-accent transition-colors"
              >
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500/80 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-body transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Teams', value: teams.length },
            {
              label: 'Total Players',
              value: teams.reduce((sum, team) => sum + (team.playerCount || 0), 0)
            },
            {
              label: 'Churches',
              value: new Set(teams.map(t => t.churchName || 'Unknown')).size
            },
            {
              label: 'Avg Team Size',
              value:
                teams.length > 0
                  ? Math.round(
                      teams.reduce((sum, t) => sum + (t.playerCount || 0), 0) / teams.length
                    )
                  : 0
            }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-effect rounded-xl p-6 glow-border"
            >
              <div className="text-accent font-body text-sm mb-2">{stat.label}</div>
              <div className="text-white font-heading text-5xl tracking-wide">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search teams by name, church, ID, or captain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 input-focus focus:outline-none font-body"
            />
            <button onClick={fetchTeams} className="btn-gold px-8 py-3 rounded-lg font-body">
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Teams List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h2 className="font-heading text-4xl text-white mb-6 tracking-wide">
            Registered Teams ({filteredTeams.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
              <p className="text-white font-body mt-4">Loading teams...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-red-200 font-body">
              {error}
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="glass-effect rounded-xl p-12 text-center">
              <p className="text-white font-body text-lg">No teams found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredTeams.map((team, index) => (
                <motion.div
                  key={team.teamId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/admin/team/${team.teamId}`)}
                  className="glass-effect rounded-xl p-6 hover:border-accent hover:bg-white/20 transition-all cursor-pointer group glow-border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-body font-semibold">
                          {team.teamId}
                        </span>
                        <h3 className="font-heading text-3xl text-white group-hover:text-accent transition-colors tracking-wide">
                          {team.teamName || 'Unnamed Team'}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <p className="text-accent text-sm font-body mb-1">Church Name</p>
                          <p className="text-white font-body">{team.churchName || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-accent text-sm font-body mb-1">Registration Date</p>
                          <p className="text-white font-body">{team.registrationDate || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-accent text-sm font-body mb-1">Total Players</p>
                          <p className="text-white font-body">{team.playerCount || 0} players</p>
                        </div>
                        <div>
                          <p className="text-accent text-sm font-body mb-1">Captain</p>
                          <p className="text-white font-body">{team.captainName || 'N/A'}</p>
                          <p className="text-white/60 text-sm font-body">{team.captainPhone || ''}</p>
                          {team.captainEmail && (
                            <p className="text-white/60 text-xs font-body">{team.captainEmail}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-accent text-sm font-body mb-1">Vice Captain</p>
                          <p className="text-white font-body">{team.viceCaptainName || 'N/A'}</p>
                          <p className="text-white/60 text-sm font-body">{team.viceCaptainPhone || ''}</p>
                          {team.viceCaptainEmail && (
                            <p className="text-white/60 text-xs font-body">{team.viceCaptainEmail}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-accent text-sm font-body mb-1">Documents</p>
                          <div className="flex gap-2 flex-wrap">
                            {team.paymentReceipt && (
                              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">✓ Receipt</span>
                            )}
                            {team.pastorLetter && (
                              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">✓ Letter</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <svg
                        className="w-6 h-6 text-accent group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
