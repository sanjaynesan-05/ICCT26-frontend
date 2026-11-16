import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { apiService } from '../../services/api'
import { exportTeamToExcel } from '../../utils/teamExcel'
import {
  type AdminTeam,
  STATUS_BADGE_CLASSES,
  extractTeamList,
  formatRegistrationDate,
  getFileKind,
  normalizeTeam,
  normalizeTeamResponse,
} from '../../utils/adminTeams'

const TeamDetail = () => {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()
  const [team, setTeam] = useState<AdminTeam | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchTeamDetails()
  }, [teamId])

  const fetchTeamDetails = async () => {
    if (!teamId) return
    try {
      setLoading(true)
      setError('')
      let fetchedTeam: AdminTeam | null = null

      try {
        // Admin endpoint returns { team, players } including registration status
        fetchedTeam = normalizeTeamResponse(await apiService.getAdminTeamById(teamId))
      } catch (adminError) {
        console.warn('Admin team endpoint failed, trying public endpoints:', adminError)
        try {
          fetchedTeam = normalizeTeamResponse(await apiService.getTeamById(teamId))
        } catch {
          const match = extractTeamList(await apiService.getTeamsFromDatabase())
            .map((t) => normalizeTeam(t))
            .find((t) => t.teamId === teamId)
          fetchedTeam = match ?? null
        }
      }

      if (!fetchedTeam) {
        setError('⚠️ Team not found in backend data.')
        setTeam(null)
        return
      }

      setTeam(fetchedTeam)
    } catch (err) {
      console.error('Error fetching team details:', err)
      setError('❌ Failed to load team details. Connection issue.')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!team) return
    if (!confirm('Approve this team registration? Check the payment receipt first. A confirmation email will be sent to the captain.')) {
      return
    }
    setActionLoading(true)
    try {
      const response = await apiService.confirmTeam(team.teamId)
      if (response.success) {
        alert(`✅ Team approved! Email ${response.email_notification || 'sent'}`)
        await fetchTeamDetails()
      } else {
        alert('❌ Failed to approve team: ' + (response.message || 'Unknown error'))
      }
    } catch (err) {
      alert('❌ Error approving team: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!team) return
    if (!confirm('Are you sure you want to REJECT this team? The church slot will be freed for another registration.')) {
      return
    }
    setActionLoading(true)
    try {
      const response = await apiService.rejectTeam(team.teamId)
      if (response.success) {
        alert('❌ Team rejected.')
        await fetchTeamDetails()
      } else {
        alert('❌ Failed to reject team: ' + (response.message || 'Unknown error'))
      }
    } catch (err) {
      alert('❌ Error rejecting team: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setActionLoading(false)
    }
  }

  // Export team data to Excel (same per-team sheet as the dashboard's Export All)
  const exportToExcel = () => {
    if (team) exportTeamToExcel(team)
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
              aria-label="Back to dashboard"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-xl sm:text-2xl md:text-3xl text-white tracking-wide truncate">{team.teamName}</h1>
              <div className="flex items-center gap-2">
                <p className="font-body text-accent text-xs sm:text-sm truncate">{team.teamId}</p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-body font-semibold border ${STATUS_BADGE_CLASSES[team.registrationStatus]}`}>
                  {team.registrationStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 self-end sm:self-auto">
            {team.registrationStatus === 'pending' && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg font-body text-sm sm:text-base transition-all whitespace-nowrap disabled:opacity-50"
                >
                  {actionLoading ? 'Processing...' : '✅ Approve'}
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg font-body text-sm sm:text-base transition-all whitespace-nowrap disabled:opacity-50"
                >
                  {actionLoading ? 'Processing...' : '❌ Reject'}
                </button>
              </>
            )}
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-body text-sm sm:text-base transition-all whitespace-nowrap flex items-center gap-2"
              title="Download team data as Excel"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download Excel</span>
              <span className="sm:hidden">Excel</span>
            </button>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-accent/20 hover:bg-accent/30 text-accent px-4 py-2 rounded-lg font-body text-sm sm:text-base transition-all whitespace-nowrap"
            >
              Back
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-4 sm:p-6 md:p-8 glow-border mb-6 sm:mb-8"
        >
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white mb-6 sm:mb-8 tracking-wide">Team Details</h2>

          {/* Team Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 pb-8 border-b border-white/10">
            <InfoCard label="Team Name" value={team.teamName} />
            <InfoCard label="Church Name" value={team.churchName} />
            <InfoCard label="Registration Date" value={formatRegistrationDate(team.registrationDate)} />
          </div>

          {/* Captain Section */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <h3 className="font-heading text-lg sm:text-xl text-accent mb-4 tracking-wide">Captain Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <InfoCard label="Name" value={team.captainName} />
              <InfoCard label="Phone" value={team.captainPhone} />
              <InfoCard label="Email" value={team.captainEmail} />
              <InfoCard label="WhatsApp" value={team.captainWhatsapp} />
            </div>
          </div>

          {/* Vice Captain Section */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <h3 className="font-heading text-lg sm:text-xl text-accent mb-4 tracking-wide">Vice Captain Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <InfoCard label="Name" value={team.viceCaptainName} />
              <InfoCard label="Phone" value={team.viceCaptainPhone} />
              <InfoCard label="Email" value={team.viceCaptainEmail} />
              <InfoCard label="WhatsApp" value={team.viceCaptainWhatsapp} />
            </div>
          </div>

          {/* Players Section */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white mb-6 tracking-wide">
              Squad ({team.players.length} Players)
            </h2>
            {team.players.length > 0 ? (
              <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {team.players.map((p, index) => (
                  <li
                    key={`${p.playerId}-${index}`}
                    className="bg-white/5 rounded-lg px-4 py-3 border border-white/10 flex items-center gap-3"
                  >
                    <span className="font-heading text-accent text-lg w-8 text-right flex-shrink-0">{index + 1}</span>
                    <div className="min-w-0">
                      <p className="text-white font-body text-sm sm:text-base break-words">{p.name}</p>
                      <p className="text-white/50 font-body text-xs">{p.playerId}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="glass-effect rounded-xl p-8 sm:p-12 text-center">
                <p className="text-white font-body text-base sm:text-lg">No players found for this team.</p>
              </div>
            )}
          </div>

          {/* Payment Receipt */}
          <div>
            <h3 className="font-heading text-xl sm:text-2xl text-white mb-6 tracking-wide">Payment Receipt</h3>
            <ReceiptPreview url={team.paymentReceipt} />
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

const ReceiptPreview = ({ url }: { url: string }) => {
  if (!url) {
    return (
      <div className="rounded-xl p-6 border border-red-500/50 bg-red-500/10">
        <p className="text-red-200 font-body text-sm">No payment receipt on file for this team.</p>
      </div>
    )
  }

  const kind = getFileKind(url)

  if (kind === 'image') {
    return (
      <img
        src={url}
        alt="Payment receipt"
        className="max-w-full sm:max-w-2xl w-full rounded-lg border-2 border-accent/50 cursor-pointer hover:border-accent transition-colors"
        onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
      />
    )
  }

  return (
    <div className="w-full max-w-2xl h-[240px] rounded-lg border-2 border-accent/50 bg-white/5 flex flex-col items-center justify-center gap-4">
      <svg className="w-16 h-16 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <a href={url} target="_blank" rel="noopener noreferrer" className="btn-gold px-6 py-3 rounded-lg">
        {kind === 'pdf' ? 'View PDF' : 'Download File'}
      </a>
    </div>
  )
}

export default TeamDetail
