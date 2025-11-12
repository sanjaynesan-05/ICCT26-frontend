import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { apiService } from '../../services/api'

interface Player {
  playerId: string
  name: string
  age: number
  phone: string
  email?: string
  role: string
  jerseyNumber: string
  aadharFile?: string
  subscriptionFile?: string
}

interface TeamDetails {
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
  paymentReceipt: string
  pastorLetter?: string
  registrationDate: string
  players: Player[]
}

const TeamDetail = () => {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()
  const [team, setTeam] = useState<TeamDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTeamDetails()
  }, [teamId])

  const fetchTeamDetails = async () => {
    try {
      setLoading(true)
      setError('')

      let fetchedTeam: any = null

      try {
        // Try admin endpoint
        const response = await apiService.getTeamById(teamId!)
        fetchedTeam = response.team || response.data || response
      } catch (adminError: any) {
        console.warn('Admin team endpoint not available:', adminError.message)

        // Fallback: Fetch all teams and find the match
        try {
          const response = await apiService.getTeamsFromDatabase()
          const teams = Array.isArray(response)
            ? response
            : response.teams || response.data || []

          fetchedTeam = teams.find((t: any) => t.teamId === teamId)
        } catch (dbError: any) {
          console.error('Teams endpoint not available:', dbError.message)
          setError('⚠️ Failed to load team details from backend. Please ensure the backend is running.')
          setTeam(null)
          return
        }
      }

      // ✅ Normalize & sanitize data
      if (fetchedTeam) {
        const safeTeam: TeamDetails = {
          teamId: fetchedTeam.teamId || fetchedTeam.team_id || 'UNKNOWN-ID',
          teamName: fetchedTeam.teamName || fetchedTeam.team_name || 'Unnamed Team',
          churchName: fetchedTeam.churchName || fetchedTeam.church_name || 'Unknown Church',
          captainName: fetchedTeam.captainName || fetchedTeam.captain_name || 'N/A',
          captainPhone: fetchedTeam.captainPhone || fetchedTeam.captain_phone || '',
          captainEmail: fetchedTeam.captainEmail || fetchedTeam.captain_email || '',
          captainWhatsapp: fetchedTeam.captainWhatsapp || fetchedTeam.captain_whatsapp || '',
          viceCaptainName: fetchedTeam.viceCaptainName || fetchedTeam.vice_captain_name || 'N/A',
          viceCaptainPhone: fetchedTeam.viceCaptainPhone || fetchedTeam.vice_captain_phone || '',
          viceCaptainEmail: fetchedTeam.viceCaptainEmail || fetchedTeam.vice_captain_email || '',
          viceCaptainWhatsapp:
            fetchedTeam.viceCaptainWhatsapp || fetchedTeam.vice_captain_whatsapp || '',
          paymentReceipt: fetchedTeam.paymentReceipt || fetchedTeam.payment_receipt || '',
          pastorLetter: fetchedTeam.pastorLetter || fetchedTeam.pastor_letter || '',
          registrationDate: fetchedTeam.registrationDate || fetchedTeam.registration_date || '',
          players: Array.isArray(fetchedTeam.players)
            ? fetchedTeam.players.map((p: any) => ({
                playerId: p.playerId || p.player_id || 'UNKNOWN',
                name: p.name || 'Unnamed Player',
                age: p.age || 0,
                phone: p.phone || '',
                email: p.email || '',
                role: p.role || 'Unknown Role',
                jerseyNumber: p.jerseyNumber || p.jersey_number || '--',
                aadharFile: p.aadharFile || p.aadhar_file || '',
                subscriptionFile: p.subscriptionFile || p.subscription_file || ''
              }))
            : []
        }

        setTeam(safeTeam)
      } else {
        setError('❌ Team not found in backend data.')
        setTeam(null)
      }
    } catch (err) {
      console.error('Error fetching team details:', err)
      setError('Failed to load team details. Connection error.')
      setTeam(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
          <p className="text-white font-body mt-4">Loading team details...</p>
        </div>
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-red-200 font-body text-center max-w-md">
          <p className="mb-2 text-lg font-semibold">{error || 'Team not found'}</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="btn-gold px-6 py-2 rounded-lg font-body mt-4"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Header */}
      <header className="bg-primary/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-accent hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="font-heading text-3xl text-white tracking-wide">{team.teamName}</h1>
                <p className="font-body text-accent text-sm">{team.teamId}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-accent/20 hover:bg-accent/30 text-accent px-4 py-2 rounded-lg font-body transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Team Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-8 glow-border mb-8"
        >
          <h2 className="font-heading text-4xl text-white mb-6 tracking-wide">Team Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Info label="Team Name" value={team.teamName} />
            <Info label="Church" value={team.churchName} />
            <Info label="Registration Date" value={team.registrationDate} />
            <Info label="Captain" value={team.captainName} sub1={team.captainPhone} sub2={team.captainEmail} />
            <Info label="Vice Captain" value={team.viceCaptainName} sub1={team.viceCaptainPhone} sub2={team.viceCaptainEmail} />
            <Info label="Payment Receipt" value={team.paymentReceipt ? 'Available' : 'Not uploaded'} />
          </div>

          {team.pastorLetter && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-accent text-sm font-body mb-2">Pastor's Letter</p>
              <a
                href={team.pastorLetter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-gold px-6 py-3 rounded-lg font-body"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Pastor's Letter
              </a>
            </div>
          )}
        </motion.div>

        {/* Players List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-heading text-4xl text-white mb-6 tracking-wide">
            Squad ({team.players?.length || 0} Players)
          </h2>

          {team.players?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {team.players.map((player, index) => (
                <motion.div
                  key={player.playerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/admin/player/${player.playerId}`, { state: { player, team } })}
                  className="glass-effect rounded-xl p-6 hover:border-accent hover:bg-white/20 transition-all cursor-pointer group glow-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                      {/* Jersey Number */}
                      <div className="bg-accent/20 text-accent w-16 h-16 rounded-full flex items-center justify-center">
                        <span className="font-heading text-3xl tracking-wide">{player.jerseyNumber}</span>
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Info label="Player Name" value={player.name} />
                        <Info label="Role" value={player.role} />
                        <Info label="Age" value={`${player.age} years`} />
                        <Info label="Contact" value={player.phone} />
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
          ) : (
            <div className="glass-effect rounded-xl p-12 text-center">
              <p className="text-white font-body text-lg">No players found for this team.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

/* ✅ Small Reusable Info Component */
const Info = ({ label, value, sub1, sub2 }: { label: string; value: string; sub1?: string; sub2?: string }) => (
  <div>
    <p className="text-accent text-sm font-body mb-1">{label}</p>
    <p className="text-white font-body text-lg">{value || 'N/A'}</p>
    {sub1 && <p className="text-white/60 text-sm font-body">{sub1}</p>}
    {sub2 && <p className="text-white/60 text-sm font-body">{sub2}</p>}
  </div>
)

export default TeamDetail
