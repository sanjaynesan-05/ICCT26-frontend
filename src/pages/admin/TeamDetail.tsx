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
  groupPhoto?: string
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
  const [viewingDocument, setViewingDocument] = useState<{ type: string; url: string } | null>(null)

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
              age: p.age || 0,
              phone: p.phone || '',
              email: p.email || '',
              role: p.role || 'Unknown Role',
              jerseyNumber: p.jerseyNumber || '--',
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Team Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-8 glow-border mb-8"
        >
          <h2 className="font-heading text-4xl text-white mb-6 tracking-wide">Team Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Info label="Team Name" value={team.teamName} />
            <Info label="Church" value={team.churchName} />
            <Info label="Registration Date" value={team.registrationDate} />
            <Info label="Captain" value={team.captainName} sub1={team.captainPhone} sub2={team.captainEmail} />
            <Info label="Vice Captain" value={team.viceCaptainName} sub1={team.viceCaptainPhone} sub2={team.viceCaptainEmail} />
          </div>

          {/* Pastor Letter */}
          {team.pastorLetter && (
            <DocButton type="Pastor Letter" url={team.pastorLetter} onView={setViewingDocument} />
          )}

          {/* Payment Receipt */}
          {team.paymentReceipt && (
            <DocButton type="Payment Receipt" url={team.paymentReceipt} onView={setViewingDocument} />
          )}

          {/* Group Photo */}
          {team.groupPhoto && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="font-heading text-2xl text-white mb-4 tracking-wide">Team Group Photo</h3>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <img 
                  src={team.groupPhoto} 
                  alt="Team group photo" 
                  className="max-w-md w-full rounded-lg border-2 border-accent/50 hover:border-accent transition-colors cursor-pointer"
                  onClick={() => window.open(team.groupPhoto, '_blank')}
                />
                <button
                  onClick={() => window.open(team.groupPhoto, '_blank')}
                  className="btn-gold px-6 py-3 rounded-lg font-body"
                >
                  View Full Size
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Players */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-heading text-4xl text-white mb-6 tracking-wide">
            Squad ({team.players?.length || 0} Players)
          </h2>
          {team.players?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {team.players.map((p, index) => (
                <motion.div
                  key={p.playerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/admin/player/${p.playerId}`, { state: { player: p, team } })}
                  className="glass-effect rounded-xl p-6 hover:border-accent hover:bg-white/20 transition-all cursor-pointer group glow-border"
                >
                  <div className="flex items-center gap-6">
                    <div className="bg-accent/20 text-accent w-16 h-16 rounded-full flex items-center justify-center">
                      <span className="font-heading text-3xl">{p.jerseyNumber}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                      <Info label="Player Name" value={p.name} />
                      <Info label="Role" value={p.role} />
                      <Info label="Age" value={`${p.age} years`} />
                      <Info label="Phone" value={p.phone} />
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

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-primary rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden glass-effect"
          >
            <div className="bg-primary/80 border-b border-white/10 p-4 flex justify-between items-center">
              <h3 className="font-heading text-2xl text-white">{viewingDocument.type}</h3>
              <button onClick={() => setViewingDocument(null)} className="text-white hover:text-accent">
                ✕
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              {viewingDocument.url.startsWith('data:image') ? (
                <img src={viewingDocument.url} alt={viewingDocument.type} className="w-full rounded-lg" />
              ) : viewingDocument.url.startsWith('data:application/pdf') ? (
                <iframe src={viewingDocument.url} className="w-full h-[70vh] rounded-lg" title={viewingDocument.type} />
              ) : (
                <div className="text-center text-white font-body">
                  <p className="mb-4">Unable to preview this file type</p>
                  <a href={viewingDocument.url} download className="btn-gold px-6 py-3 rounded-lg inline-block">
                    Download File
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

/* ♻️ Reusable subcomponents */
const Info = ({ label, value, sub1, sub2 }: { label: string; value: string; sub1?: string; sub2?: string }) => (
  <div>
    <p className="text-accent text-sm font-body mb-1">{label}</p>
    <p className="text-white font-body text-lg">{value || 'N/A'}</p>
    {sub1 && <p className="text-white/60 text-sm font-body">{sub1}</p>}
    {sub2 && <p className="text-white/60 text-sm font-body">{sub2}</p>}
  </div>
)

const DocButton = ({
  type,
  url,
  onView
}: {
  type: string
  url: string
  onView: (d: { type: string; url: string }) => void
}) => (
  <div className="mt-6 pt-6 border-t border-white/20">
    <p className="text-accent text-sm font-body mb-2">{type}</p>
    <button onClick={() => onView({ type, url })} className="btn-gold px-6 py-3 rounded-lg font-body inline-flex items-center gap-2">
      👁️ View {type}
    </button>
  </div>
)

export default TeamDetail
