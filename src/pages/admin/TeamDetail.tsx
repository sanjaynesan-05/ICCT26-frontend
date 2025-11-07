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

      try {
        const response = await apiService.getTeamById(teamId!)
        setTeam(response.team || response.data)
      } catch (apiError) {
        // Dummy data for demo
        console.warn('Team details API not available, using dummy data:', apiError)
        setTeam(generateDummyTeamDetails(teamId!))
      }
    } catch (err) {
      setError('Failed to load team details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const generateDummyTeamDetails = (id: string): TeamDetails => {
    const playerRoles = ['Batsman', 'Bowler', 'All-rounder', 'Wicket Keeper']
    const players: Player[] = Array.from({ length: 11 }, (_, i) => ({
      playerId: `${id}-P${String(i + 1).padStart(3, '0')}`,
      name: `Player ${i + 1}`,
      age: 20 + Math.floor(Math.random() * 15),
      phone: `+9198765432${10 + i}`,
      email: `player${i + 1}@example.com`,
      role: playerRoles[Math.floor(Math.random() * playerRoles.length)],
      jerseyNumber: String(i + 1),
      aadharFile: `https://example.com/aadhar/${id}-P${i + 1}.pdf`,
      subscriptionFile: `https://example.com/subscription/${id}-P${i + 1}.pdf`
    }))

    return {
      teamId: id,
      teamName: 'Thunder Strikers',
      churchName: 'CSI St. Peter\'s Church',
      captainName: 'John Doe',
      captainPhone: '+919876543210',
      captainEmail: 'john@example.com',
      captainWhatsapp: '919876543210',
      viceCaptainName: 'Jane Smith',
      viceCaptainPhone: '+919876543211',
      viceCaptainEmail: 'jane@example.com',
      viceCaptainWhatsapp: '919876543211',
      paymentReceipt: 'TXN123456789',
      pastorLetter: 'https://example.com/pastor-letter.pdf',
      registrationDate: '2026-01-15 10:30:45',
      players
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cricket-gold border-t-transparent"></div>
          <p className="text-white font-body mt-4">Loading team details...</p>
        </div>
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-red-200 font-body">
          {error || 'Team not found'}
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
        {/* Team Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-8 glow-border mb-8"
        >
          <h2 className="font-heading text-4xl text-white mb-6 tracking-wide">Team Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-accent text-sm font-body mb-1">Team Name</p>
              <p className="text-white font-body text-lg">{team.teamName}</p>
            </div>
            <div>
              <p className="text-accent text-sm font-body mb-1">Church</p>
              <p className="text-white font-body text-lg">{team.churchName}</p>
            </div>
            <div>
              <p className="text-accent text-sm font-body mb-1">Registration Date</p>
              <p className="text-white font-body text-lg">{team.registrationDate}</p>
            </div>
            <div>
              <p className="text-accent text-sm font-body mb-1">Captain</p>
              <p className="text-white font-body text-lg">{team.captainName}</p>
              <p className="text-white/60 text-sm font-body">{team.captainPhone}</p>
              <p className="text-white/60 text-sm font-body">{team.captainEmail}</p>
            </div>
            <div>
              <p className="text-accent text-sm font-body mb-1">Vice Captain</p>
              <p className="text-white font-body text-lg">{team.viceCaptainName}</p>
              <p className="text-white/60 text-sm font-body">{team.viceCaptainPhone}</p>
              <p className="text-white/60 text-sm font-body">{team.viceCaptainEmail}</p>
            </div>
            <div>
              <p className="text-accent text-sm font-body mb-1">Payment Receipt</p>
              <p className="text-white font-body text-lg">{team.paymentReceipt}</p>
            </div>
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
            Squad ({team.players.length} Players)
          </h2>

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
                      <div>
                        <p className="text-accent text-sm font-body mb-1">Player Name</p>
                        <p className="text-white font-body text-lg group-hover:text-accent transition-colors">
                          {player.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-accent text-sm font-body mb-1">Role</p>
                        <p className="text-white font-body">{player.role}</p>
                      </div>
                      <div>
                        <p className="text-accent text-sm font-body mb-1">Age</p>
                        <p className="text-white font-body">{player.age} years</p>
                      </div>
                      <div>
                        <p className="text-accent text-sm font-body mb-1">Contact</p>
                        <p className="text-white/80 text-sm font-body">{player.phone}</p>
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TeamDetail
