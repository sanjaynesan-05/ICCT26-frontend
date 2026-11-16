import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Download, ExternalLink, FileText, Mail, MessageCircle, Phone, X, AlertTriangle } from 'lucide-react'
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
import { AdminButton, AdminHeader, useToasts } from '../../components/admin/AdminShell'

const TeamDetail = () => {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()
  const [team, setTeam] = useState<AdminTeam | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const { notify, toasts } = useToasts()

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
        setError('Team not found in backend data.')
        setTeam(null)
        return
      }

      setTeam(fetchedTeam)
    } catch (err) {
      console.error('Error fetching team details:', err)
      setError('Failed to load team details. Check your connection and try again.')
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
        notify('success', `Team approved. Email ${response.email_notification || 'sent'}.`)
        await fetchTeamDetails()
      } else {
        notify('error', 'Failed to approve team: ' + (response.message || 'Unknown error'))
      }
    } catch (err) {
      notify('error', 'Error approving team: ' + (err instanceof Error ? err.message : 'Unknown error'))
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
        notify('info', 'Team rejected. The church slot is free again.')
        await fetchTeamDetails()
      } else {
        notify('error', 'Failed to reject team: ' + (response.message || 'Unknown error'))
      }
    } catch (err) {
      notify('error', 'Error rejecting team: ' + (err instanceof Error ? err.message : 'Unknown error'))
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
      <div className="flex min-h-screen items-center justify-center bg-ink-900">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          <p className="mt-4 text-sm text-muted">Loading team details…</p>
        </div>
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
        <div className="card-dark max-w-md p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-flame-light" />
          <p className="mt-4 font-semibold text-white">{error || 'Team not found'}</p>
          <AdminButton tone="gold" className="mt-6" onClick={() => navigate('/admin/dashboard')}>
            Back to dashboard
          </AdminButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink-900">
      <AdminHeader
        backTo="/admin/dashboard"
        title={team.teamName}
        subtitle={
          <span className="flex items-center gap-2">
            <span className="font-mono text-gold">{team.teamId}</span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE_CLASSES[team.registrationStatus]}`}
            >
              {team.registrationStatus}
            </span>
          </span>
        }
        actions={
          <>
            {team.registrationStatus === 'pending' && (
              <>
                <AdminButton tone="success" onClick={handleApprove} disabled={actionLoading}>
                  <Check className="h-4 w-4" /> {actionLoading ? 'Working…' : 'Approve'}
                </AdminButton>
                <AdminButton tone="danger" onClick={handleReject} disabled={actionLoading}>
                  <X className="h-4 w-4" /> Reject
                </AdminButton>
              </>
            )}
            <AdminButton tone="gold" onClick={exportToExcel} title="Download team sheet as Excel">
              <Download className="h-4 w-4" /> Excel
            </AdminButton>
          </>
        }
      />

      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="page-container space-y-6 py-8">
        {/* Overview */}
        <section className="card-dark p-6">
          <p className="text-eyebrow uppercase text-muted">Team</p>
          <div className="mt-3 grid gap-5 sm:grid-cols-3">
            <Info label="Team name" value={team.teamName} />
            <Info label="Church" value={team.churchName} />
            <Info label="Registered" value={formatRegistrationDate(team.registrationDate)} />
          </div>
        </section>

        {/* Leaders */}
        <section className="grid gap-6 md:grid-cols-2">
          {[
            { label: 'Captain', name: team.captainName, phone: team.captainPhone, whatsapp: team.captainWhatsapp, email: team.captainEmail },
            {
              label: 'Vice-Captain',
              name: team.viceCaptainName,
              phone: team.viceCaptainPhone,
              whatsapp: team.viceCaptainWhatsapp,
              email: team.viceCaptainEmail,
            },
          ].map((p) => (
            <div key={p.label} className="card-dark p-6">
              <p className="text-eyebrow uppercase text-muted">{p.label}</p>
              <p className="mt-2 break-words text-xl font-bold text-white">{p.name || 'N/A'}</p>
              <div className="mt-4 space-y-2 text-sm">
                <ContactRow icon={Phone} value={p.phone} href={p.phone ? `tel:${p.phone}` : undefined} />
                <ContactRow
                  icon={MessageCircle}
                  value={p.whatsapp}
                  href={p.whatsapp ? `https://wa.me/91${p.whatsapp.replace(/\D/g, '').slice(-10)}` : undefined}
                />
                <ContactRow icon={Mail} value={p.email} href={p.email ? `mailto:${p.email}` : undefined} />
              </div>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
          {/* Squad */}
          <section className="card-dark p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-eyebrow uppercase text-muted">Squad</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">{team.players.length} players</span>
            </div>
            {team.players.length > 0 ? (
              <ol className="grid gap-2 sm:grid-cols-2">
                {team.players.map((p, index) => (
                  <li key={`${p.playerId}-${index}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold font-display text-base text-ink-900">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-white">{p.name}</p>
                      <p className="font-mono text-[11px] text-white/45">{p.playerId}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-muted">
                No players found for this team.
              </p>
            )}
          </section>

          {/* Receipt */}
          <section className="card-dark p-6">
            <p className="mb-4 text-eyebrow uppercase text-muted">Payment receipt</p>
            <ReceiptPreview url={team.paymentReceipt} />
          </section>
        </div>
      </motion.main>

      {toasts}
    </div>
  )
}

/* Reusable subcomponents */
const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="text-xs font-semibold text-muted">{label}</p>
    <p className="mt-1 break-words font-semibold text-white">{value || 'N/A'}</p>
  </div>
)

const ContactRow = ({ icon: Icon, value, href }: { icon: typeof Phone; value: string; href?: string }) => (
  <div className="flex items-center gap-3">
    <Icon className="h-4 w-4 shrink-0 text-white/40" />
    {value && href ? (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="break-all text-white/85 hover:text-gold">
        {value}
      </a>
    ) : (
      <span className="text-white/40">N/A</span>
    )}
  </div>
)

const ReceiptPreview = ({ url }: { url: string }) => {
  if (!url) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-flame/40 bg-flame/10 p-4 text-sm text-flame-light">
        <AlertTriangle className="h-5 w-5 shrink-0" /> No payment receipt on file for this team.
      </div>
    )
  }

  const kind = getFileKind(url)

  if (kind === 'image') {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="group block">
        <img src={url} alt="Payment receipt" className="w-full rounded-xl border border-white/10 transition-colors group-hover:border-gold" />
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-muted group-hover:text-gold">
          Open full size <ExternalLink className="h-3.5 w-3.5" />
        </span>
      </a>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-8">
      <FileText className="h-12 w-12 text-gold" />
      <a href={url} target="_blank" rel="noopener noreferrer" className="btn-gold">
        {kind === 'pdf' ? 'View PDF' : 'Download file'} <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  )
}

export default TeamDetail
