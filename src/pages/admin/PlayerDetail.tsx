import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

interface Player {
  playerId: string
  name: string
  role: string
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

  // ✅ Safely extract player and team with fallbacks
  const player = location.state?.player as Player | undefined
  const team = location.state?.team as Team | undefined

  // Sanitize file URLs to handle legacy data (null, {}, local paths)
  const cleanFileUrl = (url: any): string => {
    if (!url || typeof url !== 'string' || url.trim() === '') return ''
    if (url.startsWith('data:') || url.startsWith('file:') || url.startsWith('C:') || url.startsWith('/')) return ''
    if (!url.startsWith('http://') && !url.startsWith('https://')) return ''
    return url.trim()
  }

  // Unified file preview helper for Cloudinary URLs
  const getFilePreview = (url: string | undefined, altText: string = 'Document') => {
    const cleanUrl = cleanFileUrl(url)
    if (!cleanUrl) return null

    const ext = url.split('.').pop()?.toLowerCase()

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
    role = 'Unknown Role',
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
              <button
                onClick={handleBackToTeam}
                className="text-accent hover:text-white transition-colors flex-shrink-0"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="font-heading text-xl sm:text-2xl md:text-3xl text-white tracking-wide truncate">{name}</h1>
                <p className="font-body text-accent text-xs sm:text-sm truncate">
                  {team ? `${teamName} • ${playerId}` : playerId}
                </p>
              </div>
            </div>
            <button
              onClick={handleBackToTeam}
              className="bg-accent/20 hover:bg-accent/30 text-accent px-4 py-2 rounded-lg font-body text-sm sm:text-base transition-all whitespace-nowrap self-end sm:self-auto"
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
          className="glass-effect rounded-xl p-4 sm:p-6 md:p-8 glow-border mb-6 sm:mb-8"
        >
          <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-8">
            {/* Player Details */}
            <div className="flex-1 w-full">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white mb-4 sm:mb-6 tracking-wide break-words">{name}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-accent text-xs sm:text-sm font-body mb-1">Role</p>
                  <p className="text-white font-body text-base sm:text-lg">{role}</p>
                </div>
                <div>
                  <p className="text-accent text-xs sm:text-sm font-body mb-1">Player ID</p>
                  <p className="text-white font-body text-base sm:text-lg">{playerId}</p>
                </div>
                {team && (
                  <>
                    <div>
                      <p className="text-accent text-xs sm:text-sm font-body mb-1">Team</p>
                      <p className="text-white font-body text-base sm:text-lg break-words">{teamName}</p>
                      <p className="text-white/60 text-xs sm:text-sm font-body break-words">{churchName}</p>
                    </div>
                  </>
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
          className="glass-effect rounded-xl p-4 sm:p-6 md:p-8 glow-border"
        >
          <h3 className="font-heading text-2xl sm:text-3xl text-white mb-4 sm:mb-6 tracking-wide">Submitted Documents</h3>

          <div className="space-y-6 sm:space-y-8">
            {/* Aadhar File */}
            {aadharFile ? (
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="bg-accent/20 p-2 rounded-lg flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-body text-base sm:text-lg font-semibold">Aadhar Card</p>
                    <p className="text-white/60 text-xs sm:text-sm font-body">Identity Proof Document</p>
                  </div>
                </div>
                {getFilePreview(aadharFile, 'Aadhar Card')}
              </div>
            ) : (
              <MissingDocumentCard title="Aadhar Card" subtitle="Identity Proof Document" />
            )}

            {/* Subscription File */}
            {subscriptionFile ? (
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="bg-accent/20 p-2 rounded-lg flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-body text-base sm:text-lg font-semibold">Subscription Card</p>
                    <p className="text-white/60 text-xs sm:text-sm font-body">Church Membership Proof</p>
                  </div>
                </div>
                {getFilePreview(subscriptionFile, 'Subscription Card')}
              </div>
            ) : (
              <MissingDocumentCard title="Subscription Card" subtitle="Church Membership Proof" />
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
    </div>
  )
}

/* ✅ Modular Reusable Subcomponents */

const MissingDocumentCard = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="bg-white/5 rounded-lg p-6 border border-red-500/30">
    <div className="flex items-center gap-4">
      <div className="bg-red-500/20 p-3 rounded-lg">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        <p className="text-white font-body text-lg">{title}</p>
        <p className="text-red-400 text-sm font-body">{subtitle} - Not submitted</p>
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
