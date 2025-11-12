import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

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

interface Team {
  teamId: string
  teamName: string
  churchName: string
}

const PlayerDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [viewingDocument, setViewingDocument] = useState<{ type: string; url: string } | null>(null)

  // ✅ Safely extract player and team with fallbacks
  const player = location.state?.player as Player | undefined
  const team = location.state?.team as Team | undefined

  // ✅ Handle missing player (e.g., direct URL visit or reload)
  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-red-200 font-body text-center max-w-md">
          <p className="mb-2 text-lg font-semibold">Player Not Found</p>
          <p className="text-sm opacity-80 mb-4">
            Please navigate to this page through a valid team player link.
          </p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="btn-gold px-6 py-2 rounded-lg font-body"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const handleBackToTeam = () => {
    if (team?.teamId) navigate(`/admin/team/${team.teamId}`)
    else navigate('/admin/dashboard')
  }

  // ✅ Safe destructuring with fallbacks
  const {
    playerId = 'N/A',
    name = 'Unnamed Player',
    age = 0,
    phone = 'Not Provided',
    email = '',
    role = 'Unknown Role',
    jerseyNumber = '--',
    aadharFile = '',
    subscriptionFile = ''
  } = player

  const teamName = team?.teamName || 'Unknown Team'
  const churchName = team?.churchName || 'Unknown Church'

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Header */}
      <header className="bg-primary/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToTeam}
                className="text-accent hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="font-heading text-3xl text-white tracking-wide">{name}</h1>
                <p className="font-body text-accent text-sm">
                  {team ? `${teamName} • ${playerId}` : playerId}
                </p>
              </div>
            </div>
            <button
              onClick={handleBackToTeam}
              className="bg-accent/20 hover:bg-accent/30 text-accent px-4 py-2 rounded-lg font-body transition-all"
            >
              Back to Team
            </button>
          </div>
        </div>
      </header>

      {/* Player Info */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Player Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-8 glow-border mb-8"
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Jersey Number Display */}
            <div className="bg-gradient-to-br from-accent/30 to-accent/10 rounded-2xl p-8 border-2 border-accent/50 min-w-[150px]">
              <div className="text-center">
                <p className="text-accent text-sm font-body mb-2">Jersey No.</p>
                <p className="font-heading text-7xl text-white tracking-wide">{jerseyNumber}</p>
              </div>
            </div>

            {/* Player Details */}
            <div className="flex-1">
              <h2 className="font-heading text-5xl text-white mb-6 tracking-wide">{name}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-accent text-sm font-body mb-1">Role</p>
                  <p className="text-white font-body text-lg">{role}</p>
                </div>
                <div>
                  <p className="text-accent text-sm font-body mb-1">Age</p>
                  <p className="text-white font-body text-lg">{age} years</p>
                </div>
                <div>
                  <p className="text-accent text-sm font-body mb-1">Phone</p>
                  <p className="text-white font-body text-lg">{phone}</p>
                </div>
                {email && (
                  <div>
                    <p className="text-accent text-sm font-body mb-1">Email</p>
                    <p className="text-white font-body text-lg break-all">{email}</p>
                  </div>
                )}
                <div>
                  <p className="text-accent text-sm font-body mb-1">Player ID</p>
                  <p className="text-white font-body text-lg">{playerId}</p>
                </div>
                {team && (
                  <div>
                    <p className="text-accent text-sm font-body mb-1">Team</p>
                    <p className="text-white font-body text-lg">{teamName}</p>
                    <p className="text-white/60 text-sm font-body">{churchName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Submitted Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-xl p-8 glow-border"
        >
          <h3 className="font-heading text-3xl text-white mb-6 tracking-wide">Submitted Documents</h3>

          <div className="space-y-4">
            {/* Aadhar File */}
            {aadharFile ? (
              <DocumentCard
                title="Aadhar Card"
                subtitle="Identity Proof Document"
                onClick={() => setViewingDocument({ type: 'Aadhar Card', url: aadharFile })}
              />
            ) : (
              <MissingDocumentCard title="Aadhar Card" />
            )}

            {/* Subscription File */}
            {subscriptionFile ? (
              <DocumentCard
                title="Subscription Card"
                subtitle="Church Membership Proof"
                onClick={() => setViewingDocument({ type: 'Subscription Card', url: subscriptionFile })}
              />
            ) : (
              <MissingDocumentCard title="Subscription Card" />
            )}
          </div>

          {/* Document Status */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center justify-between">
              <p className="text-accent font-body">Document Verification Status</p>
              {aadharFile && subscriptionFile ? (
                <StatusBadge status="complete" />
              ) : (
                <StatusBadge status="incomplete" />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden glass-effect"
          >
            <div className="bg-primary/80 border-b border-white/10 p-4 flex items-center justify-between">
              <h3 className="font-heading text-2xl text-white">{viewingDocument.type}</h3>
              <button
                onClick={() => setViewingDocument(null)}
                className="text-white hover:text-accent transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              {viewingDocument.url.startsWith('data:image') ? (
                <img
                  src={viewingDocument.url}
                  alt={viewingDocument.type}
                  className="w-full h-auto rounded-lg"
                />
              ) : viewingDocument.url.startsWith('data:application/pdf') ? (
                <iframe
                  src={viewingDocument.url}
                  className="w-full h-[70vh] rounded-lg"
                  title={viewingDocument.type}
                />
              ) : (
                <div className="text-center text-white font-body">
                  <p className="mb-4">Unable to preview this file type</p>
                  <a
                    href={viewingDocument.url}
                    download
                    className="btn-gold px-6 py-3 rounded-lg inline-block"
                  >
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

/* ✅ Modular Reusable Subcomponents */

const DocumentCard = ({ title, subtitle, onClick }: { title: string; subtitle: string; onClick: () => void }) => (
  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="bg-accent/20 p-3 rounded-lg">
          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <p className="text-white font-body text-lg">{title}</p>
          <p className="text-white/60 text-sm font-body">{subtitle}</p>
        </div>
      </div>
      <button
        onClick={onClick}
        className="btn-gold px-6 py-3 rounded-lg font-body inline-flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View Document
      </button>
    </div>
  </div>
)

const MissingDocumentCard = ({ title }: { title: string }) => (
  <div className="bg-white/5 rounded-lg p-6 border border-red-500/30">
    <div className="flex items-center gap-4">
      <div className="bg-red-500/20 p-3 rounded-lg">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        <p className="text-white font-body text-lg">{title}</p>
        <p className="text-red-400 text-sm font-body">Not submitted</p>
      </div>
    </div>
  </div>
)

const StatusBadge = ({ status }: { status: 'complete' | 'incomplete' }) => {
  return status === 'complete' ? (
    <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-body flex items-center gap-2">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Complete
    </div>
  ) : (
    <div className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-body flex items-center gap-2">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      Incomplete
    </div>
  )
}

export default PlayerDetail
