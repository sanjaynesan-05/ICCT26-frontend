import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdmin } from '../../contexts/AdminContext'
import { apiService } from '../../services/api'
import {
  type AdminTeam,
  type RegistrationStatus,
  STATUS_BADGE_CLASSES,
  extractTeamList,
  formatRegistrationDate,
  getFileKind,
  normalizeTeam,
  normalizeTeamResponse,
} from '../../utils/adminTeams'
import { exportTeamsToExcel } from '../../utils/teamExcel'
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Inbox,
  LogOut,
  RefreshCw,
  Search,
  X,
} from 'lucide-react'
import { AdminButton, AdminHeader, useToasts } from '../../components/admin/AdminShell'

type StatusTab = RegistrationStatus | 'all'

const AdminDashboard = () => {
  const [allTeams, setAllTeams] = useState<AdminTeam[]>([])
  const [displayedTeams, setDisplayedTeams] = useState<AdminTeam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  // New registrations arrive as "pending", so open on the review queue
  const [activeTab, setActiveTab] = useState<StatusTab>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAdmin()
  const { notify, toasts } = useToasts()

  // Payment receipt thumbnail / badge
  const getReceiptPreview = (url: string) => {
    if (!url) {
      return <span className="text-xs font-semibold text-flame-light">Missing</span>
    }

    const open = (e: React.MouseEvent) => {
      e.stopPropagation()
      window.open(url, '_blank', 'noopener,noreferrer')
    }

    if (getFileKind(url) === 'image') {
      return (
        <img
          src={url}
          alt="Payment receipt"
          className="h-10 w-10 cursor-pointer rounded-lg border border-white/15 object-cover transition-colors hover:border-gold"
          onClick={open}
        />
      )
    }

    return (
      <button onClick={open} className="inline-flex items-center gap-1 text-xs font-semibold text-white/85 hover:text-gold">
        <FileText className="h-4 w-4" /> {getFileKind(url) === 'pdf' ? 'PDF' : 'File'}
      </button>
    )
  }

  // Fetch all teams once on component mount
  useEffect(() => {
    fetchAllTeams()
  }, [])

  // Filter teams when activeTab or searchQuery changes
  useEffect(() => {
    filterTeams()
  }, [activeTab, searchQuery, allTeams])

  const fetchAllTeams = async () => {
    try {
      setLoading(true)
      setError('')

      let teamsList: AdminTeam[] = []

      try {
        // Always fetch ALL teams with all statuses
        const summaries = extractTeamList(await apiService.getAdminTeams())

        // Only fetch per-team details when the list doesn't already carry a player count
        teamsList = await Promise.all(
          summaries.map(async (summary) => {
            const team = normalizeTeam(summary)
            const raw = summary as Record<string, unknown>
            const hasCount = raw.player_count != null || raw.playerCount != null || Array.isArray(raw.players)
            if (hasCount) return team

            try {
              return normalizeTeamResponse(await apiService.getAdminTeamById(team.teamId)) ?? team
            } catch (err) {
              console.warn(`Failed to fetch details for team ${team.teamId}:`, err)
              return team
            }
          })
        )
      } catch (adminError) {
        console.warn('Admin teams endpoint not available, trying fallback:', adminError)
        try {
          teamsList = extractTeamList(await apiService.getAllTeams()).map((t) => normalizeTeam(t))
        } catch (databaseError) {
          console.error('Teams endpoint not available:', databaseError)
          setError('Failed to load teams from backend. Please ensure the backend server is running and accessible.')
          setAllTeams([])
          return
        }
      }

      // Newest registrations first
      teamsList.sort((a, b) => (b.registrationDate || '').localeCompare(a.registrationDate || ''))
      setAllTeams(teamsList)
    } catch (err) {
      console.error('Error fetching teams:', err)
      setError('Failed to load teams from backend. Connection error.')
      setAllTeams([])
    } finally {
      setLoading(false)
    }
  }

  // Filter teams based on activeTab and searchQuery
  const filterTeams = () => {
    let filtered = allTeams

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(t => t.registrationStatus === activeTab)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(team => {
        const teamName = (team.teamName || '').toLowerCase()
        const teamId = (team.teamId || '').toLowerCase()
        const churchName = (team.churchName || '').toLowerCase()
        const captainName = (team.captainName || '').toLowerCase()
        const captainPhone = team.captainPhone || ''
        const playerNames = team.players.map(p => p.name.toLowerCase()).join(' ')
        return (
          teamName.includes(query) ||
          teamId.includes(query) ||
          churchName.includes(query) ||
          captainName.includes(query) ||
          captainPhone.includes(query) ||
          playerNames.includes(query)
        )
      })
    }

    setDisplayedTeams(filtered)
  }

  const handleApprove = async (teamId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm('Approve this team registration? Check the payment receipt first. A confirmation email will be sent to the captain.')) {
      return
    }
    
    setActionLoading(teamId)
    try {
      const response = await apiService.confirmTeam(teamId)
      
      if (response.success) {
        notify('success', `Team approved. Email ${response.email_notification || 'sent'}.`)
        fetchAllTeams() // Refresh list
      } else {
        notify('error', 'Failed to approve team: ' + (response.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error approving team:', error)
      notify('error', 'Error approving team: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (teamId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to REJECT this team? The church slot will be freed for another registration.')) {
      return
    }
    
    setActionLoading(teamId)
    try {
      const response = await apiService.rejectTeam(teamId)
      
      if (response.success) {
        notify('info', 'Team rejected. The church slot is free again.')
        fetchAllTeams() // Refresh list
      } else {
        notify('error', 'Failed to reject team: ' + (response.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error rejecting team:', error)
      notify('error', 'Error rejecting team: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setActionLoading(null)
    }
  }

  // Export the teams in the current tab (+ search) — one sheet per team
  const handleExportAll = async () => {
    if (displayedTeams.length === 0) {
      notify('info', 'No teams to export in this view.')
      return
    }
    setExporting(true)
    try {
      // The list endpoint may carry only a player count; load full squads where missing
      const teams = await Promise.all(
        displayedTeams.map(async (team) => {
          if (team.players.length > 0) return team
          try {
            return normalizeTeamResponse(await apiService.getAdminTeamById(team.teamId)) ?? team
          } catch (err) {
            console.warn(`Failed to load players for ${team.teamId}:`, err)
            return team
          }
        })
      )
      const missing = teams.filter((t) => t.players.length === 0).map((t) => t.teamName)
      if (missing.length && !confirm(`Players could not be loaded for: ${missing.join(', ')}.\nExport anyway?`)) {
        return
      }
      const label = activeTab === 'all' ? 'All_Teams' : `${activeTab}_Teams`
      exportTeamsToExcel(teams, label)
    } finally {
      setExporting(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  // Count teams by status from ALL teams (for accurate counts)
  const pendingCount = allTeams.filter(t => t.registrationStatus === 'pending').length
  const confirmedCount = allTeams.filter(t => t.registrationStatus === 'confirmed').length
  const rejectedCount = allTeams.filter(t => t.registrationStatus === 'rejected').length

  const tabs: { key: StatusTab; label: string; count: number; dot: string }[] = [
    { key: 'pending', label: 'Pending', count: pendingCount, dot: 'bg-gold' },
    { key: 'confirmed', label: 'Confirmed', count: confirmedCount, dot: 'bg-pitch-light' },
    { key: 'rejected', label: 'Rejected', count: rejectedCount, dot: 'bg-flame-light' },
    { key: 'all', label: 'All teams', count: allTeams.length, dot: 'bg-white/60' },
  ]

  return (
    <div className="min-h-screen bg-ink-900">
      <AdminHeader
        title={
          <>
            ICCT<span className="text-gold">'27</span> Admin
          </>
        }
        subtitle="Team management"
        actions={
          <>
            <AdminButton onClick={() => navigate('/admin/schedule')}>
              <CalendarDays className="h-4 w-4" /> Schedule
            </AdminButton>
            <AdminButton onClick={() => navigate('/')}>
              <ExternalLink className="h-4 w-4" /> View site
            </AdminButton>
            <AdminButton tone="danger" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </AdminButton>
          </>
        }
      />

      <main className="page-container py-8">
        {/* Status tabs double as stat cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {tabs.map((tab) => {
            const active = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  active ? 'border-gold bg-gold/10' : 'border-white/10 bg-ink-800 hover:border-white/25'
                }`}
                aria-pressed={active}
              >
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
                  <span className={`h-2 w-2 rounded-full ${tab.dot}`} /> {tab.label}
                </span>
                <span className="mt-2 block font-display text-4xl leading-none text-white tabular-nums">{tab.count}</span>
              </button>
            )
          })}
        </div>

        {/* Search + actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-dark" />
            <input
              type="text"
              placeholder="Search team, ID, church, captain, phone or player…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white py-3 pl-11 pr-4 text-sm text-ink placeholder:text-muted-dark input-focus"
            />
          </div>
          <AdminButton onClick={fetchAllTeams} disabled={loading} className="!py-3">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </AdminButton>
          <AdminButton
            tone="gold"
            onClick={handleExportAll}
            disabled={exporting || loading || displayedTeams.length === 0}
            title="Download one Excel file with a separate sheet for each team in this view"
            className="!py-3"
          >
            {exporting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-900 border-t-transparent" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {exporting ? 'Exporting…' : `Export ${displayedTeams.length} team${displayedTeams.length === 1 ? '' : 's'}`}
          </AdminButton>
        </div>

        {/* Team list */}
        <div className="mt-6">
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="card-dark h-28 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 rounded-2xl border border-flame/40 bg-flame/10 p-5 text-sm text-flame-light">
              <AlertTriangle className="h-5 w-5 shrink-0" /> {error}
            </div>
          ) : displayedTeams.length === 0 ? (
            <div className="card-dark flex flex-col items-center p-12 text-center">
              <Inbox className="h-10 w-10 text-white/30" />
              <p className="mt-3 font-semibold text-white">No teams here</p>
              <p className="text-sm text-muted">{searchQuery ? 'Try a different search.' : 'Nothing in this tab yet.'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedTeams.map((team, index) => (
                <motion.div
                  key={team.teamId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index, 10) * 0.03 }}
                  onClick={() => navigate(`/admin/team/${team.teamId}`)}
                  className="group card-dark cursor-pointer p-5 transition-colors hover:border-gold/50"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    {/* Identity */}
                    <div className="min-w-0 lg:w-72">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-gold">{team.teamId}</span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE_CLASSES[team.registrationStatus]}`}
                        >
                          {team.registrationStatus}
                        </span>
                      </div>
                      <h3 className="mt-1 truncate text-2xl leading-tight text-white group-hover:text-gold">
                        {team.teamName || 'Unnamed team'}
                      </h3>
                      <p className="truncate text-sm text-muted">{team.churchName || 'Unknown church'}</p>
                    </div>

                    {/* Facts */}
                    <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-4">
                      <Fact label="Captain" value={team.captainName} sub={team.captainPhone} />
                      <Fact label="Vice-captain" value={team.viceCaptainName} sub={team.viceCaptainPhone} />
                      <Fact label="Players" value={`${team.playerCount || 0}`} sub={formatRegistrationDate(team.registrationDate)} />
                      <div>
                        <p className="text-xs font-semibold text-muted">Receipt</p>
                        <div className="mt-1">{getReceiptPreview(team.paymentReceipt)}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {team.registrationStatus === 'pending' && (
                        <>
                          <AdminButton
                            tone="success"
                            onClick={(e) => handleApprove(team.teamId, e)}
                            disabled={actionLoading === team.teamId}
                            className="!px-3"
                          >
                            {actionLoading === team.teamId ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            Approve
                          </AdminButton>
                          <AdminButton
                            tone="danger"
                            onClick={(e) => handleReject(team.teamId, e)}
                            disabled={actionLoading === team.teamId}
                            className="!px-3"
                            aria-label={`Reject ${team.teamName}`}
                          >
                            <X className="h-4 w-4" />
                            <span className="hidden sm:inline">Reject</span>
                          </AdminButton>
                        </>
                      )}
                      <ChevronRight className="hidden h-5 w-5 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-gold lg:block" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {toasts}
    </div>
  )
}

const Fact = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="min-w-0">
    <p className="text-xs font-semibold text-muted">{label}</p>
    <p className="truncate font-semibold text-white">{value || 'N/A'}</p>
    {sub && <p className="truncate text-xs text-white/45">{sub}</p>}
  </div>
)

export default AdminDashboard
