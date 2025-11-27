import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Trash2, Edit2, Play, CheckCircle, Plus, X, Save, AlertCircle, RefreshCw, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface MatchResult {
  winner: string
  margin: number
  marginType: 'runs' | 'wickets'
  wonByBattingFirst: boolean
}

interface Match {
  id: number
  round: string
  round_number: number
  match_number: number
  team1: string
  team2: string
  status: 'scheduled' | 'live' | 'completed'
  result?: MatchResult
}

interface FormData {
  round: string
  round_number: number
  match_number: number
  team1: string
  team2: string
}

interface ResultFormData {
  winner: string
  margin: number
  marginType: 'runs' | 'wickets'
  wonByBattingFirst: boolean
}

interface Team {
  teamId?: string
  team_id?: string
  teamName?: string
  team_name?: string
}

const ScheduleManager = () => {
  const navigate = useNavigate()
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [teamsLoading, setTeamsLoading] = useState(false)

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)

  // Form states
  const [formData, setFormData] = useState<FormData>({
    round: 'Round 1',
    round_number: 1,
    match_number: 0,
    team1: '',
    team2: ''
  })

  const [resultForm, setResultForm] = useState<ResultFormData>({
    winner: '',
    margin: 0,
    marginType: 'runs',
    wonByBattingFirst: true
  })

  // Filter state
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'live' | 'completed'>('all')

  // Fetch matches and teams on mount
  useEffect(() => {
    fetchMatches()
    fetchTeams()
  }, [])

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/schedule/matches`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to fetch matches')
      }

      const data = await response.json()
      setMatches(data.data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch matches')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeams = async () => {
    try {
      setTeamsLoading(true)
      // Try multiple endpoints to get teams
      let teamsList = []
      
      // Try endpoint 1: /api/teams
      try {
        const response = await fetch(`${API_URL}/api/teams`)
        if (response.ok) {
          const data = await response.json()
          teamsList = data.data || data.teams || data || []
        }
      } catch (e) {
        console.warn('Endpoint /api/teams failed:', e)
      }
      
      // Try endpoint 2: /api/registration/teams (fallback)
      if (teamsList.length === 0) {
        try {
          const response = await fetch(`${API_URL}/api/registration/teams`)
          if (response.ok) {
            const data = await response.json()
            teamsList = data.data || data.teams || data || []
          }
        } catch (e) {
          console.warn('Endpoint /api/registration/teams failed:', e)
        }
      }
      
      // Try endpoint 3: /admin/teams (fallback)
      if (teamsList.length === 0) {
        try {
          const response = await fetch(`${API_URL}/admin/teams`)
          if (response.ok) {
            const data = await response.json()
            teamsList = data.data || data.teams || data || []
          }
        } catch (e) {
          console.warn('Endpoint /admin/teams failed:', e)
        }
      }
      
      console.log('Fetched teams:', teamsList)
      setTeams(teamsList)
    } catch (err: any) {
      console.error('Failed to fetch teams:', err)
    } finally {
      setTeamsLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchMatches()
    fetchTeams()
  }

  const handleGoToDashboard = () => {
    navigate('/admin/dashboard')
  }

  const handleCreateMatch = async () => {
    if (!formData.team1 || !formData.team2) {
      setError('Please fill all fields')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/schedule/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create match')
      }

      setSuccess('Match created successfully!')
      setShowCreateModal(false)
      setFormData({
        round: 'Round 1',
        round_number: 1,
        match_number: 0,
        team1: '',
        team2: ''
      })
      await fetchMatches()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Error creating match')
      console.error(err)
    }
  }

  const handleUpdateMatch = async () => {
    if (!editingMatch) return

    try {
      const response = await fetch(`${API_URL}/api/schedule/matches/${editingMatch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to update match')
      }

      setSuccess('Match updated successfully!')
      setShowEditModal(false)
      setEditingMatch(null)
      await fetchMatches()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Error updating match')
      console.error(err)
    }
  }

  const handleDeleteMatch = async (matchId: number) => {
    if (!window.confirm('Are you sure you want to delete this match?')) return

    try {
      const response = await fetch(`${API_URL}/api/schedule/matches/${matchId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to delete match')
      }

      setSuccess('Match deleted successfully!')
      await fetchMatches()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Error deleting match')
      console.error(err)
    }
  }

  const handleUpdateStatus = async (matchId: number, newStatus: 'scheduled' | 'live' | 'completed') => {
    try {
      const response = await fetch(`${API_URL}/api/schedule/matches/${matchId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to update status')
      }

      setSuccess(`Match status updated to ${newStatus}!`)
      await fetchMatches()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Error updating status')
      console.error(err)
    }
  }

  const handleSetResult = async (matchId: number) => {
    // Validation
    if (!resultForm.winner) {
      setError('Please select the winning team')
      return
    }
    
    if (resultForm.margin <= 0) {
      setError(`Please enter ${resultForm.wonByBattingFirst ? 'runs difference' : 'wickets remaining'} (must be greater than 0)`)
      return
    }

    if (resultForm.wonByBattingFirst && resultForm.margin > 999) {
      setError('Runs difference cannot exceed 999')
      return
    }

    if (!resultForm.wonByBattingFirst && resultForm.margin > 10) {
      setError('Wickets remaining cannot exceed 10')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/schedule/matches/${matchId}/result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultForm)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to set result')
      }

      setSuccess('Match result saved successfully!')
      setShowResultModal(false)
      setResultForm({ winner: '', margin: 0, marginType: 'runs', wonByBattingFirst: true })
      await fetchMatches()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Error setting result')
      console.error(err)
    }
  }

  const openEditModal = (match: Match) => {
    setEditingMatch(match)
    setFormData({
      round: match.round,
      round_number: match.round_number,
      match_number: match.match_number,
      team1: match.team1,
      team2: match.team2
    })
    setShowEditModal(true)
  }

  const openResultModal = (match: Match) => {
    setEditingMatch(match)
    if (match.result) {
      setResultForm(match.result)
    } else {
      setResultForm({ winner: match.team1, margin: 0, marginType: 'runs', wonByBattingFirst: true })
    }
    setShowResultModal(true)
  }

  const filteredMatches = matches.filter(match => {
    if (filterStatus === 'all') return true
    return match.status === filterStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-500/30 border-red-400 text-red-300'
      case 'completed':
        return 'bg-green-500/30 border-green-400 text-green-300'
      default:
        return 'bg-accent/20 border-accent/50 text-accent'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>LIVE</span>
      case 'completed':
        return <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" />COMPLETED</span>
      default:
        return <span>SCHEDULED</span>
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-primary pt-32 pb-20 px-4 lg:px-8"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header with Navigation */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12"
        >
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-heading text-5xl md:text-7xl text-accent mb-4 tracking-wider">
              SCHEDULE MANAGER
            </h1>
            <p className="font-body text-lg text-gray-300 mb-4">
              Manage tournament matches, results, and status
            </p>
            <div className="w-20 h-1 bg-gradient-gold rounded-full"></div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 flex-wrap justify-center md:justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-3 bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 border border-blue-400/50 rounded-xl font-bold transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="hidden sm:inline">Refresh</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoToDashboard}
              className="flex items-center gap-2 px-4 py-3 bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 border border-purple-400/50 rounded-xl font-bold transition-all"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-400 text-red-300 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-400 text-green-300 rounded-xl flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5" />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-gold text-primary font-bold rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Create New Match
          </button>

          <div className="flex gap-2 bg-secondary border-2 border-accent/40 rounded-xl p-2">
            {(['all', 'scheduled', 'live', 'completed'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-1 px-4 py-2 rounded-lg font-bold transition-all uppercase text-xs tracking-wider ${
                  filterStatus === status
                    ? 'bg-accent text-primary shadow-lg'
                    : 'text-gray-400 hover:text-accent border border-gray-600/30'
                }`}
              >
                {status === 'live' ? '🔴 Live' : status === 'completed' ? '✅ Done' : status === 'scheduled' ? '⏳ Upcoming' : 'All'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Matches List */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading matches...</div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-400">No matches found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="backdrop-blur-xl rounded-2xl p-6 border-2 border-accent/20 bg-secondary/80 hover:border-accent/50 transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Match Info */}
                  <div className="md:col-span-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center font-bold text-accent">
                        {match.match_number}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-accent">Match {match.match_number}</h3>
                        <p className="text-gray-400 text-sm">{match.round}</p>
                      </div>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="md:col-span-4">
                    <div className="flex items-center gap-3 justify-center">
                      <div className="flex-1">
                        <p className="text-center text-sm md:text-base font-bold text-gray-200">{match.team1}</p>
                      </div>
                      <div className="px-3 py-1 bg-accent/30 text-accent font-bold text-xs rounded-lg">VS</div>
                      <div className="flex-1">
                        <p className="text-center text-sm md:text-base font-bold text-gray-200">{match.team2}</p>
                      </div>
                    </div>
                    {match.result && (
                      <p className="text-xs text-green-300 text-center mt-2 font-bold">
                        🏆 {match.result.winner} won by {match.result.margin} {match.result.marginType}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="md:col-span-2">
                    <div className={`px-4 py-2 rounded-lg border text-xs font-bold text-center ${getStatusColor(match.status)}`}>
                      {getStatusBadge(match.status)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-3 flex flex-wrap gap-2">
                    {match.status === 'scheduled' && (
                      <button
                        onClick={() => handleUpdateStatus(match.id, 'live')}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500/30 text-red-300 rounded-lg hover:bg-red-500/50 transition-all font-bold text-xs"
                      >
                        <Play className="w-4 h-4" />
                        Start
                      </button>
                    )}

                    {match.status === 'live' && (
                      <>
                        <button
                          onClick={() => openResultModal(match)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500/30 text-green-300 rounded-lg hover:bg-green-500/50 transition-all font-bold text-xs"
                        >
                          <Save className="w-4 h-4" />
                          Result
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(match.id, 'completed')}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500/30 text-green-300 rounded-lg hover:bg-green-500/50 transition-all font-bold text-xs"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Done
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => openEditModal(match)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-accent/30 text-accent rounded-lg hover:bg-accent/50 transition-all font-bold text-xs"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteMatch(match.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500/30 text-red-400 rounded-lg hover:bg-red-500/50 transition-all font-bold text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Match Modal */}
      <AnimatePresence>
        {(showCreateModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowCreateModal(false)
              setShowEditModal(false)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-secondary border-2 border-accent/40 rounded-2xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl text-accent">
                  {showEditModal ? 'Edit Match' : 'Create New Match'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Round</label>
                    <input
                      type="text"
                      value={formData.round}
                      onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                      className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                      placeholder="Round 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Match #</label>
                    <input
                      type="number"
                      value={formData.match_number}
                      onChange={(e) => setFormData({ ...formData, match_number: parseInt(e.target.value) })}
                      className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Team 1</label>
                    {teams.length > 0 ? (
                      <select
                        value={formData.team1}
                        onChange={(e) => setFormData({ ...formData, team1: e.target.value })}
                        className="w-full bg-primary/50 border border-accent/50 rounded-lg px-4 py-2 text-white focus:border-accent outline-none font-semibold"
                      >
                        <option value="">Select Team 1</option>
                        {teams.map((team, idx) => {
                          // Handle multiple possible field names for team data
                          const teamId = team.teamId || team.team_id || team.id || idx
                          const teamName = team.teamName || team.team_name || team.name || `Team ${teamId}`
                          return (
                            <option key={teamId} value={teamName}>
                              {teamName}
                            </option>
                          )
                        })}
                      </select>
                    ) : teamsLoading ? (
                      <div className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-400 flex items-center">
                        <span className="animate-spin mr-2">⏳</span> Loading teams...
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={formData.team1}
                        onChange={(e) => setFormData({ ...formData, team1: e.target.value })}
                        className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                        placeholder="Enter Team 1 name"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Team 2</label>
                    {teams.length > 0 ? (
                      <select
                        value={formData.team2}
                        onChange={(e) => setFormData({ ...formData, team2: e.target.value })}
                        className="w-full bg-primary/50 border border-accent/50 rounded-lg px-4 py-2 text-white focus:border-accent outline-none font-semibold"
                      >
                        <option value="">Select Team 2</option>
                        {teams.map((team, idx) => {
                          // Handle multiple possible field names for team data
                          const teamId = team.teamId || team.team_id || team.id || idx
                          const teamName = team.teamName || team.team_name || team.name || `Team ${teamId}`
                          return (
                            <option key={teamId} value={teamName}>
                              {teamName}
                            </option>
                          )
                        })}
                      </select>
                    ) : teamsLoading ? (
                      <div className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-400 flex items-center">
                        <span className="animate-spin mr-2">⏳</span> Loading teams...
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={formData.team2}
                        onChange={(e) => setFormData({ ...formData, team2: e.target.value })}
                        className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                        placeholder="Enter Team 2 name"
                      />
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      setShowEditModal(false)
                    }}
                    className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={showEditModal ? handleUpdateMatch : handleCreateMatch}
                    className="flex-1 px-6 py-3 bg-gradient-gold text-primary rounded-lg font-bold hover:shadow-lg hover:shadow-accent/50 transition-all"
                  >
                    {showEditModal ? 'Update Match' : 'Create Match'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Modal */}
      <AnimatePresence>
        {showResultModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowResultModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-secondary border-2 border-green-400/40 rounded-2xl p-8 max-w-2xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl text-green-300">Set Match Result</h2>
                <button
                  onClick={() => setShowResultModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Cricket Rules Guide */}
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 text-xs text-blue-200">
                  <p className="font-bold mb-2">📋 Cricket Result Rules:</p>
                  <ul className="space-y-1 text-blue-100">
                    <li>• <span className="font-semibold">Batting First (Defense):</span> Team sets target, wins if opposition doesn't reach their score</li>
                    <li>• <span className="font-semibold">Chasing (Offense):</span> Team chases opposition's score, wins by reaching or exceeding it</li>
                    <li>• <span className="font-semibold">Win by Runs:</span> Opposition falls short by X runs (margin = runs difference)</li>
                    <li>• <span className="font-semibold">Win by Wickets:</span> Chasing team wins with X wickets remaining (margin = wickets left)</li>
                  </ul>
                </div>

                {/* Winning Team */}
                <div>
                  <label className="block text-sm font-bold text-green-300 mb-2">🏆 Which Team Won?</label>
                  <select
                    value={resultForm.winner}
                    onChange={(e) => setResultForm({ ...resultForm, winner: e.target.value })}
                    className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-green-400 outline-none font-semibold"
                  >
                    <option value="">Select winning team</option>
                    {editingMatch && (
                      <>
                        <option value={editingMatch.team1}>{editingMatch.team1}</option>
                        <option value={editingMatch.team2}>{editingMatch.team2}</option>
                      </>
                    )}
                  </select>
                </div>

                {/* How They Won */}
                <div>
                  <label className="block text-sm font-bold text-green-300 mb-2">⚡ How They Won?</label>
                  <select
                    value={resultForm.wonByBattingFirst ? 'batting' : 'chasing'}
                    onChange={(e) => {
                      const isBatting = e.target.value === 'batting'
                      setResultForm({ 
                        ...resultForm, 
                        wonByBattingFirst: isBatting,
                        marginType: isBatting ? 'runs' : 'wickets' // Auto-set margin type
                      })
                    }}
                    className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-green-400 outline-none"
                  >
                    <option value="batting">Batting First (Opposition fell short)</option>
                    <option value="chasing">Chasing (Completed the target)</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-2">
                    {resultForm.wonByBattingFirst 
                      ? "Opposition couldn't reach your score. Enter the runs difference below."
                      : "You chased opposition's total. Enter remaining wickets below."}
                  </p>
                </div>

                {/* Margin Input */}
                <div>
                  <label className="block text-sm font-bold text-green-300 mb-2">
                    {resultForm.wonByBattingFirst 
                      ? '🏃 Runs Difference' 
                      : '🎯 Wickets Remaining'}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={resultForm.margin}
                      onChange={(e) => setResultForm({ ...resultForm, margin: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="flex-1 bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-green-400 outline-none"
                      placeholder={resultForm.wonByBattingFirst ? 'e.g., 45 (runs)' : 'e.g., 3 (wickets)'}
                      min="0"
                      max={resultForm.wonByBattingFirst ? 999 : 10}
                    />
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-400/50 rounded-lg">
                      <span className="text-green-300 font-bold text-lg">
                        {resultForm.wonByBattingFirst ? '▼' : '◆'}
                      </span>
                      <span className="text-green-200 font-semibold">
                        {resultForm.wonByBattingFirst ? 'Runs' : 'Wickets'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Result Preview */}
                {resultForm.winner && resultForm.margin > 0 && (
                  <div className="bg-green-500/10 border border-green-400/40 rounded-lg p-4">
                    <p className="text-sm font-bold text-green-300 mb-2">✅ Result Preview:</p>
                    <div className="text-green-200 space-y-1 text-sm">
                      <p>
                        <span className="font-bold">{resultForm.winner}</span>
                        {resultForm.wonByBattingFirst 
                          ? ` won by ${resultForm.margin} runs (batting first)`
                          : ` won by ${resultForm.margin} wicket${resultForm.margin !== 1 ? 's' : ''} (chasing)`}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowResultModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => editingMatch && handleSetResult(editingMatch.id)}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all"
                  >
                    Save Result
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ScheduleManager
