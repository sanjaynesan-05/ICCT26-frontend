import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import * as XLSX from 'xlsx'
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

const TeamDetail = () => {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()
  const [team, setTeam] = useState<TeamDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Sanitize file URLs to handle legacy data (null, {}, local paths)
  const cleanFileUrl = (url: any): string => {
    if (!url) return ''
    if (typeof url === 'object') {
      console.warn('⚠️ Group photo is stored as object, not URL:', url)
      return ''
    }
    if (typeof url !== 'string' || url.trim() === '') return ''
    if (url.startsWith('data:') || url.startsWith('file:') || url.startsWith('C:') || url.startsWith('/')) return ''
    if (!url.startsWith('http://') && !url.startsWith('https://')) return ''
    return url.trim()
  }

  // Unified file preview helper for Cloudinary URLs
  const getFilePreview = (url: string | undefined, altText: string = 'Document') => {
    const cleanUrl = cleanFileUrl(url)
    if (!cleanUrl) return null

    const ext = cleanUrl.split('.').pop()?.toLowerCase()

    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) {
      return (
        <img 
          src={cleanUrl} 
          alt={altText}
          className="max-w-full sm:max-w-2xl w-full rounded-lg border-2 border-accent/50 cursor-pointer hover:border-accent transition-colors"
          onClick={() => window.open(cleanUrl, '_blank')}
        />
      )
    }

    if (ext === 'pdf') {
      return (
        <div className="w-full h-[400px] rounded-lg border-2 border-accent/50 bg-white/5 flex flex-col items-center justify-center gap-4">
          <svg className="w-16 h-16 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-6 py-3 rounded-lg"
          >
            View PDF
          </a>
        </div>
      )
    }

    return (
      <div className="w-full h-[400px] rounded-lg border-2 border-accent/50 bg-white/5 flex items-center justify-center">
        <a
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold px-6 py-3 rounded-lg"
        >
          Download File
        </a>
      </div>
    )
  }

  useEffect(() => {
    fetchTeamDetails()
  }, [teamId])

  // Export team data to Excel
  const exportToExcel = () => {
    if (!team) return

    // Sheet 1: Team Information
    const teamInfo = [
      ['ICCT26 Tournament - Team Report'],
      [''],
      ['Team Information'],
      ['Team ID', team.teamId],
      ['Team Name', team.teamName],
      ['Church Name', team.churchName],
      ['Registration Date', team.registrationDate],
      [''],
      ['Captain Information'],
      ['Name', team.captainName],
      ['Phone', team.captainPhone],
      ['WhatsApp', team.captainWhatsapp],
      ['Email', team.captainEmail],
      [''],
      ['Vice Captain Information'],
      ['Name', team.viceCaptainName],
      ['Phone', team.viceCaptainPhone],
      ['WhatsApp', team.viceCaptainWhatsapp],
      ['Email', team.viceCaptainEmail],
      [''],
      ['Submitted Documents'],
      ['Pastor Letter', cleanFileUrl(team.pastorLetter) || 'Not uploaded'],
      ['Payment Receipt', cleanFileUrl(team.paymentReceipt) || 'Not uploaded'],
      ['Group Photo', cleanFileUrl(team.groupPhoto) || 'Not uploaded'],
    ]

    // Sheet 2: Players Information
    const playersHeader = [
      ['Players Squad (' + (team.players?.length || 0) + ' players)'],
      [''],
      ['#', 'Player ID', 'Name', 'Role', 'Aadhar File URL', 'Subscription File URL']
    ]
    
    const playersData = team.players?.map((player, index) => [
      index + 1,
      player.playerId,
      player.name,
      player.role || 'Not specified',
      cleanFileUrl(player.aadharFile) || 'Not uploaded',
      cleanFileUrl(player.subscriptionFile) || 'Not uploaded'
    ]) || []

    const playersSheet = [...playersHeader, ...playersData]

    // Create workbook
    const wb = XLSX.utils.book_new()
    
    // Add Team Info sheet
    const ws1 = XLSX.utils.aoa_to_sheet(teamInfo)
    
    // Set column widths for Team Info
    ws1['!cols'] = [
      { wch: 25 }, // Column A
      { wch: 50 }  // Column B
    ]
    
    XLSX.utils.book_append_sheet(wb, ws1, 'Team Information')

    // Add Players sheet
    const ws2 = XLSX.utils.aoa_to_sheet(playersSheet)
    
    // Set column widths for Players
    ws2['!cols'] = [
      { wch: 5 },  // #
      { wch: 15 }, // Player ID
      { wch: 25 }, // Name
      { wch: 15 }, // Role
      { wch: 60 }, // Aadhar URL
      { wch: 60 }  // Subscription URL
    ]
    
    XLSX.utils.book_append_sheet(wb, ws2, 'Players')

    // Generate filename with team name and date
    const fileName = `ICCT26_${team.teamName.replace(/\s+/g, '_')}_${team.teamId}_${new Date().toISOString().split('T')[0]}.xlsx`

    // Download file
    XLSX.writeFile(wb, fileName)
  }

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
        paymentReceipt: fetchedTeam.paymentReceipt || fetchedTeam.payment_receipt || '',
        pastorLetter: fetchedTeam.pastorLetter || fetchedTeam.pastor_letter || '',
        groupPhoto: fetchedTeam.groupPhoto || fetchedTeam.group_photo || '',
        registrationDate: fetchedTeam.registrationDate || fetchedTeam.registration_date || '',
        players: Array.isArray(fetchedTeam.players)
          ? fetchedTeam.players.map((p: any) => ({
              playerId: p.playerId || 'UNKNOWN',
              name: p.name || 'Unnamed Player',
              role: p.role || 'Unknown Role',
              aadharFile: p.aadharFile || p.aadhar_file || '',
              subscriptionFile: p.subscriptionFile || p.subscription_file || '',
            }))
          : []
      }

      // Debug: Log what we're receiving from backend
      console.log('Backend team data:', fetchedTeam)
      console.log('Processed team data:', safeTeam)
      console.log('Group photo value:', safeTeam.groupPhoto)
      console.log('Cleaned group photo:', cleanFileUrl(safeTeam.groupPhoto))

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
          <div className="flex gap-2 self-end sm:self-auto">
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

          {/* Players Section */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white mb-6 tracking-wide">Squad ({team.players?.length || 0} Players)</h2>
            {team.players?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 mb-8">
                {team.players.map((p, index) => (
                  <motion.div
                    key={p.playerId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/admin/player/${p.playerId}`, { state: { player: p, team } })}
                    className="glass-effect rounded-xl p-4 sm:p-6 hover:border-accent hover:bg-white/20 transition-all cursor-pointer group glow-border"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      <div className="flex-1 w-full">
                        <h3 className="font-heading text-lg sm:text-xl md:text-2xl text-white group-hover:text-accent transition-colors tracking-wide mb-2">{p.name}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-accent text-xs sm:text-sm font-body mb-1">Role</p>
                            <p className="text-white font-body text-sm sm:text-base">{p.role}</p>
                          </div>
                        </div>
                      </div>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-accent group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-effect rounded-xl p-8 sm:p-12 text-center mb-8">
                <p className="text-white font-body text-base sm:text-lg">No players found for this team.</p>
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div className="mt-8">
            <h3 className="font-heading text-xl sm:text-2xl text-white mb-6 tracking-wide">Submitted Documents</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Pastor Letter */}
              {team.pastorLetter && (
                <div className="flex flex-col">
                  <p className="text-accent text-sm font-body mb-3 font-semibold">Pastor Letter</p>
                  {getFilePreview(team.pastorLetter, 'Pastor Letter')}
                </div>
              )}

              {/* Payment Receipt */}
              {team.paymentReceipt && (
                <div className="flex flex-col">
                  <p className="text-accent text-sm font-body mb-3 font-semibold">Payment Receipt</p>
                  {getFilePreview(team.paymentReceipt, 'Payment Receipt')}
                </div>
              )}

              {/* Group Photo */}
              {team.groupPhoto ? (
                <div className="flex flex-col">
                  <p className="text-accent text-sm font-body mb-3 font-semibold">Team Group Photo</p>
                  {getFilePreview(team.groupPhoto, 'Team Group Photo')}
                </div>
              ) : (
                <div className="flex flex-col">
                  <p className="text-accent text-sm font-body mb-3 font-semibold">Team Group Photo</p>
                  <div className="glass-effect rounded-xl p-4 border border-yellow-500/50 bg-yellow-500/10 h-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-yellow-200 font-body text-sm mb-2">⚠️ Group photo not yet uploaded</p>
                      <p className="text-yellow-300/70 font-body text-xs">Raw value: {typeof team.groupPhoto === 'object' ? JSON.stringify(team.groupPhoto) : String(team.groupPhoto)}</p>
                    </div>
                  </div>
                </div>
              )}
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
