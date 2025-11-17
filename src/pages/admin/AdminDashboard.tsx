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
  groupPhoto: string
  players?: any[]
}

const AdminDashboard = () => {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { logout } = useAdmin()

  // Sanitize file URLs to handle legacy data (null, {}, local paths)
  const cleanFileUrl = (url: any): string => {
    if (!url || typeof url !== 'string' || url.trim() === '') return ''
    // Filter out local file paths and invalid URLs
    if (url.startsWith('data:') || url.startsWith('file:') || url.startsWith('C:') || url.startsWith('/')) return ''
    // Only accept valid HTTP/HTTPS URLs (Cloudinary)
    if (!url.startsWith('http://') && !url.startsWith('https://')) return ''
    return url.trim()
  }

  // Unified file status helper for Cloudinary URLs
  const getFileStatusIcon = (url: string | undefined) => {
    const cleanUrl = cleanFileUrl(url)
    if (!url) {
      return <span className="text-red-500 font-semibold text-xs">No File</span>
    }

    const ext = url.split('.').pop()?.toLowerCase()

    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) {
      return (
        <img 
          src={cleanUrl} 
          alt="Document thumbnail"
          className="w-12 h-12 rounded border-2 border-accent/50 object-cover cursor-pointer hover:border-accent transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            window.open(cleanUrl, '_blank')
          }}
        />
      )
    }

    if (ext === 'pdf') {
      return <span className="text-blue-400 underline text-xs font-semibold">PDF</span>
    }

    return <span className="text-blue-400 underline text-xs font-semibold">File</span>
  }

  // Removed unused viewFile function - click handlers are inline in JSX

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
            // Sanitize file URLs to handle legacy data
            paymentReceipt: cleanFileUrl(team.paymentReceipt || team.payment_receipt),
            pastorLetter: cleanFileUrl(team.pastorLetter || team.pastor_letter),
            groupPhoto: cleanFileUrl(team.groupPhoto || team.group_photo),
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white tracking-wider">ICCT'26 ADMIN</h1>
              <p className="font-body text-accent text-xs sm:text-sm">Team Management Dashboard</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/')}
                className="font-body text-sm sm:text-base text-white/80 hover:text-accent transition-colors"
              >
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500/80 hover:bg-red-500 text-white px-4 sm:px-6 py-2 rounded-lg font-body text-sm sm:text-base transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[
            { label: 'Total Teams', value: teams.length },
            {
              label: 'Total Players',
              value: teams.reduce((sum, team) => sum + (team.playerCount || 0), 0)
            },
            {
              label: 'Churches',
              value: new Set(teams.map(t => t.churchName || 'Unknown')).size
            }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-effect rounded-xl p-4 sm:p-6 glow-border"
            >
              <div className="text-accent font-body text-xs sm:text-sm mb-2">{stat.label}</div>
              <div className="text-white font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-xl p-4 sm:p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 input-focus focus:outline-none font-body text-sm sm:text-base"
            />
            <button onClick={fetchTeams} className="btn-gold px-6 sm:px-8 py-3 rounded-lg font-body text-sm sm:text-base whitespace-nowrap">
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Teams List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white mb-4 sm:mb-6 tracking-wide">
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
                  className="glass-effect rounded-xl p-4 sm:p-6 hover:border-accent hover:bg-white/20 transition-all cursor-pointer group glow-border"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 w-full">
                      <div className="flex-shrink-0">
                        <img 
                          src={team.groupPhoto} 
                          alt="Team photo" 
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-accent/50 hover:border-accent transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(team.groupPhoto, '_blank')
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3">
                          <span className="bg-accent/20 text-accent px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-body font-semibold">
                            {team.teamId}
                          </span>
                          <h3 className="font-heading text-xl sm:text-2xl md:text-3xl text-white group-hover:text-accent transition-colors tracking-wide break-words">
                            {team.teamName || 'Unnamed Team'}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          <div>
                            <p className="text-accent text-xs sm:text-sm font-body mb-1">Church Name</p>
                            <p className="text-white font-body text-sm sm:text-base break-words">{team.churchName || 'Unknown'}</p>
                          </div>
                          <div>
                            <p className="text-accent text-xs sm:text-sm font-body mb-1">Registration Date</p>
                            <p className="text-white font-body text-sm sm:text-base">{team.registrationDate || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-accent text-xs sm:text-sm font-body mb-1">Total Players</p>
                            <p className="text-white font-body text-sm sm:text-base">{team.playerCount || 0} players</p>
                          </div>
                          <div>
                            <p className="text-accent text-xs sm:text-sm font-body mb-1">Captain</p>
                            <p className="text-white font-body text-sm sm:text-base break-words">{team.captainName || 'N/A'}</p>
                              <p className="text-white/60 text-xs sm:text-sm font-body">{team.captainPhone || ''}</p>
                            {team.captainEmail && (
                              <p className="text-white/60 text-xs font-body break-all">{team.captainEmail}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-accent text-xs sm:text-sm font-body mb-1">Vice Captain</p>
                            <p className="text-white font-body text-sm sm:text-base break-words">{team.viceCaptainName || 'N/A'}</p>
                            <p className="text-white/60 text-xs sm:text-sm font-body">{team.viceCaptainPhone || ''}</p>
                            {team.viceCaptainEmail && (
                              <p className="text-white/60 text-xs font-body break-all">{team.viceCaptainEmail}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-accent text-xs sm:text-sm font-body mb-2">Team Documents</p>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="flex flex-col items-center gap-1">
                                {getFileStatusIcon(team.paymentReceipt)}
                                <span className="text-[10px] text-white/60">Receipt</span>
                              </div>
                              <div className="flex flex-col items-center gap-1">
                                {getFileStatusIcon(team.pastorLetter)}
                                <span className="text-[10px] text-white/60">Letter</span>
                              </div>
                              <div className="flex flex-col items-center gap-1">
                                {getFileStatusIcon(team.groupPhoto)}
                                <span className="text-[10px] text-white/60">Photo</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-auto sm:ml-4 flex-shrink-0 self-start flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/admin/team/${team.teamId}`)
                        }}
                        className="bg-accent/20 hover:bg-accent/30 text-accent px-3 py-2 rounded-lg text-xs font-body transition-all flex items-center gap-1 whitespace-nowrap"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-accent group-hover:translate-x-1 transition-transform self-center"
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
