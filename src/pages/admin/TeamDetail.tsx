import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { apiService } from '../../services/api'

interface Player {
  playerId: string
  name: string
  role: string
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
  groupPhoto: string
  registrationDate: string
  players: Player[]
}

/* 🧠 Utility — normalize any file (base64 or hosted URL) */
const normalizeFileURL = (file?: string, type: 'image' | 'pdf' = 'image'): string => {
  if (!file) return ''
  if (file.startsWith('data:')) return file // already valid base64 URI
  if (file.startsWith('http')) return file  // hosted file
  // Add proper prefix if backend sent raw base64
  return type === 'pdf'
    ? `data:application/pdf;base64,${file}`
    : `data:image/png;base64,${file}`
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
        const response = await apiService.getTeamById(teamId!)
        fetchedTeam = response.team || response.data || response
        if (fetchedTeam && response.players) {
          fetchedTeam.players = response.players
        }
      } catch (adminError: any) {
        console.warn('Admin team endpoint failed, fallback mode:', adminError.message)
        const response = await apiService.getTeamsFromDatabase()
        const teams = Array.isArray(response)
          ? response
          : response.teams || response.data || []
        fetchedTeam = teams.find((t: any) => t.teamId === teamId)
      }

      if (!fetchedTeam) {
        setError('⚠️ Team not found in backend data.')
        setTeam(null)
        return
      }

      const safeTeam: TeamDetails = {
        teamId: fetchedTeam.teamId || fetchedTeam.team_id || 'UNKNOWN-ID',
        teamName: fetchedTeam.teamName || fetchedTeam.team_name || 'Unnamed Team',
        churchName: fetchedTeam.churchName || fetchedTeam.church_name || 'Unknown Church',
        captainName: fetchedTeam.captain?.name || fetchedTeam.captainName || 'N/A',
        captainPhone: fetchedTeam.captain?.phone || fetchedTeam.captainPhone || '',
        captainEmail: fetchedTeam.captain?.email || fetchedTeam.captainEmail || '',
        captainWhatsapp: fetchedTeam.captain?.whatsapp || fetchedTeam.captainWhatsapp || '',
        viceCaptainName: fetchedTeam.viceCaptain?.name || fetchedTeam.viceCaptainName || 'N/A',
        viceCaptainPhone: fetchedTeam.viceCaptain?.phone || fetchedTeam.viceCaptainPhone || '',
        viceCaptainEmail: fetchedTeam.viceCaptain?.email || fetchedTeam.viceCaptainEmail || '',
        viceCaptainWhatsapp: fetchedTeam.viceCaptain?.whatsapp || fetchedTeam.viceCaptainWhatsapp || '',
        paymentReceipt: normalizeFileURL(fetchedTeam.paymentReceipt || fetchedTeam.payment_receipt, 'image'),
        pastorLetter: normalizeFileURL(fetchedTeam.pastorLetter || fetchedTeam.pastor_letter, 'pdf'),
        groupPhoto: normalizeFileURL(fetchedTeam.groupPhoto || fetchedTeam.group_photo, 'image'),
        registrationDate: fetchedTeam.registrationDate || fetchedTeam.registration_date || '',
        players: Array.isArray(fetchedTeam.players)
          ? fetchedTeam.players.map((p: any) => ({
              playerId: p.playerId || 'UNKNOWN',
              name: p.name || 'Unnamed Player',
              role: p.role || 'Unknown Role',
              aadharFile: normalizeFileURL(p.aadharFile || p.aadhar_file, 'pdf'),
              subscriptionFile: normalizeFileURL(p.subscriptionFile || p.subscription_file, 'pdf'),
            }))
          : []
      }

      setTeam(safeTeam)
    } catch (err) {
      console.error('Error fetching team details:', err)
      setError('❌ Failed to load team details. Connection issue.')
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
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-accent hover:text-white transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-xl sm:text-2xl md:text-3xl text-white tracking-wide truncate">{team.teamName}</h1>
              <p className="font-body text-accent text-xs sm:text-sm truncate">{team.teamId}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-accent/20 hover:bg-accent/30 text-accent px-4 py-2 rounded-lg font-body text-sm sm:text-base transition-all whitespace-nowrap self-end sm:self-auto"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Team Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-4 sm:p-6 md:p-8 glow-border mb-6 sm:mb-8"
        >
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white mb-6 sm:mb-8 tracking-wide">Team Details</h2>

          {/* Team Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 pb-8 border-b border-white/10">
            <InfoCard label="Team Name" value={team.teamName} />
            <InfoCard label="Church Name" value={team.churchName} />
            <InfoCard label="Registration Date" value={team.registrationDate} />
          </div>

          {/* Captain Section */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <h3 className="font-heading text-lg sm:text-xl text-accent mb-4 tracking-wide">Captain Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <InfoCard label="Name" value={team.captainName} />
              <InfoCard label="Phone" value={team.captainPhone} />
              <InfoCard label="Email" value={team.captainEmail} />
              <InfoCard label="WhatsApp" value={team.captainWhatsapp} />
            </div>
          </div>

          {/* Vice Captain Section */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <h3 className="font-heading text-lg sm:text-xl text-accent mb-4 tracking-wide">Vice Captain Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <InfoCard label="Name" value={team.viceCaptainName} />
              <InfoCard label="Phone" value={team.viceCaptainPhone} />
              <InfoCard label="Email" value={team.viceCaptainEmail} />
              <InfoCard label="WhatsApp" value={team.viceCaptainWhatsapp} />
            </div>
          </div>

          {/* Documents Section */}
          <div className="mt-8">
            <h3 className="font-heading text-xl sm:text-2xl text-white mb-6 tracking-wide">Submitted Documents</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Pastor Letter */}
              {team.pastorLetter && (
                <div className="flex flex-col">
                  <p className="text-accent text-sm font-body mb-3 font-semibold">Pastor Letter</p>
                  {team.pastorLetter.startsWith('data:image') ? (
                    <img 
                      src={team.pastorLetter} 
                      alt="Pastor Letter" 
                      className="w-full h-64 object-cover rounded-lg border-2 border-accent/50 cursor-pointer hover:border-accent transition-colors"
                      onClick={() => window.open(team.pastorLetter, '_blank')}
                    />
                  ) : (
                    <iframe 
                      src={team.pastorLetter} 
                      className="w-full h-64 rounded-lg border-2 border-accent/50"
                      title="Pastor Letter"
                    />
                  )}
                </div>
              )}

              {/* Payment Receipt */}
              {team.paymentReceipt && (
                <div className="flex flex-col">
                  <p className="text-accent text-sm font-body mb-3 font-semibold">Payment Receipt</p>
                  <img 
                    src={team.paymentReceipt} 
                    alt="Payment Receipt" 
                    className="w-full h-64 object-cover rounded-lg border-2 border-accent/50 cursor-pointer hover:border-accent transition-colors"
                    onClick={() => window.open(team.paymentReceipt, '_blank')}
                  />
                </div>
              )}

              {/* Group Photo */}
              <div className="flex flex-col">
                <p className="text-accent text-sm font-body mb-3 font-semibold">Team Group Photo</p>
                <img 
                  src={team.groupPhoto} 
                  alt="Team group photo" 
                  className="w-full h-64 object-cover rounded-lg border-2 border-accent/50 cursor-pointer hover:border-accent transition-colors"
                  onClick={() => window.open(team.groupPhoto, '_blank')}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ♻️ Reusable subcomponents */
const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-accent/50 transition-colors">
    <p className="text-accent text-xs sm:text-sm font-body font-semibold mb-2 uppercase tracking-wide">{label}</p>
    <p className="text-white font-body text-sm sm:text-base break-words line-clamp-2">{value || 'N/A'}</p>
  </div>
)

export default TeamDetail
