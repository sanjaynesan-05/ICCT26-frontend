import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Trash2, Edit2, Play, CheckCircle, Plus, X, Save, AlertCircle, RefreshCw, Home, Clock, Link as LinkIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../../services/api'

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
  toss_winner?: string | null
  toss_choice?: 'bat' | 'bowl' | null
  scheduled_start_time?: string | null
  actual_start_time?: string | null
  match_end_time?: string | null
  team1_first_innings_score?: number | null
  team2_first_innings_score?: number | null
  team1_runs?: number | null
  team1_wickets?: number | null
  team2_runs?: number | null
  team2_wickets?: number | null
  match_score_url?: string | null
  result?: MatchResult
  created_at?: string
  updated_at?: string
}

interface FormData {
  round: string
  round_number: number
  match_number: number
  team1: string
  team2: string
  scheduled_start_time?: string
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
  const [showTossModal, setShowTossModal] = useState(false)
  const [showScoresModal, setShowScoresModal] = useState(false)
  const [showScoreUrlModal, setShowScoreUrlModal] = useState(false)
  const [showTimingModal, setShowTimingModal] = useState(false)
  
  // 4-Stage Workflow Modals
  const [showStartMatchModal, setShowStartMatchModal] = useState(false)
  const [showFirstInningsModal, setShowFirstInningsModal] = useState(false)
  const [showSecondInningsModal, setShowSecondInningsModal] = useState(false)
  const [showFinishMatchModal, setShowFinishMatchModal] = useState(false)
  
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)

  // Form states
  const [formData, setFormData] = useState<FormData>({
    round: 'Round 1',
    round_number: 1,
    match_number: 0,
    team1: '',
    team2: '',
    scheduled_start_time: ''
  })

  const [resultForm, setResultForm] = useState<ResultFormData>({
    winner: '',
    margin: 0,
    marginType: 'runs',
    wonByBattingFirst: true
  })

  const [tossForm, setTossForm] = useState({
    toss_winner: '',
    toss_choice: 'bat' as 'bat' | 'bowl'
  })

  const [scoresForm, setScoresForm] = useState({
    team1_runs: '',
    team1_wickets: '0',
    team2_runs: '',
    team2_wickets: '0'
  })

  const [scoreUrlForm, setScoreUrlForm] = useState({
    match_score_url: ''
  })

  const [timingForm, setTimingForm] = useState({
    scheduled_start_time: '',
    actual_start_time: '',
    match_end_time: ''
  })

  // 4-Stage Workflow Forms
  const [startMatchForm, setStartMatchForm] = useState({
    toss_winner: '',
    toss_choice: 'bat' as 'bat' | 'bowl',
    match_score_url: '',
    actual_start_time: ''
  })

  const [firstInningsForm, setFirstInningsForm] = useState({
    batting_team: '',
    runs: 0,
    wickets: 0
  })

  const [secondInningsForm, setSecondInningsForm] = useState({
    batting_team: '',
    runs: 0,
    wickets: 0
  })

  const [finishMatchForm, setFinishMatchForm] = useState({
    winner: '',
    margin: 0,
    margin_type: 'runs' as 'runs' | 'wickets',
    match_end_time: ''
  })

  // Filter state
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'live' | 'completed'>('all')

  // Fetch matches and teams on mount
  useEffect(() => {
    fetchMatches()
    fetchTeams()
  }, [])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const response = await apiService.getAllMatches()
      const matchesData = response.data || []
      
      // Normalize backend status: convert 'done' to 'completed' for consistent UI
      const normalizedMatches = matchesData.map((match: any) => ({
        ...match,
        status: match.status === 'done' ? 'completed' : match.status
      }))
      
      setMatches(normalizedMatches)
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
      // Try to fetch teams from the API service
      try {
        const response = await apiService.getAllTeams()
        const teamsList = response.data || response.teams || response || []
        console.log('Fetched teams:', teamsList)
        setTeams(teamsList)
      } catch (e) {
        console.warn('Failed to fetch teams:', e)
        setTeams([])
      }
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
      // Clean up empty scheduled_start_time
      const createData = {
        ...formData,
        scheduled_start_time: formData.scheduled_start_time ? formData.scheduled_start_time : undefined
      }
      await apiService.createMatch(createData)
      setSuccess('Match created successfully!')
      setShowCreateModal(false)
      setFormData({
        round: 'Round 1',
        round_number: 1,
        match_number: 0,
        team1: '',
        team2: '',
        scheduled_start_time: ''
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
      // Clean up empty scheduled_start_time
      const updateData = {
        ...formData,
        scheduled_start_time: formData.scheduled_start_time ? formData.scheduled_start_time : undefined
      }
      await apiService.updateMatch(editingMatch.id, updateData)
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
      await apiService.deleteMatch(matchId)
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
      await apiService.updateMatchStatus(matchId, newStatus)
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
      await apiService.setMatchResult(matchId, resultForm)
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

  const handleUpdateToss = async (matchId: number) => {
    if (!tossForm.toss_winner) {
      setError('Please select toss winner')
      return
    }

    try {
      await apiService.updateMatchToss(matchId, tossForm)
      setSuccess('Toss details updated successfully!')
      setShowTossModal(false)
      await fetchMatches()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Error updating toss')
      console.error(err)
    }
  }

  const handleUpdateScores = async (matchId: number) => {
    // Validate and parse runs/wickets
    const validateRuns = (runs: string): number | null => {
      const num = parseInt(runs)
      if (isNaN(num) || num < 0 || num > 999) return null
      return num
    }

    const validateWickets = (wickets: string): number | null => {
      const num = parseInt(wickets)
      if (isNaN(num) || num < 0 || num > 10) return null
      return num
    }

    const team1Runs = validateRuns(scoresForm.team1_runs)
    const team1Wickets = validateWickets(scoresForm.team1_wickets)
    const team2Runs = validateRuns(scoresForm.team2_runs)
    const team2Wickets = validateWickets(scoresForm.team2_wickets)

    if (team1Runs === null || team1Wickets === null || team2Runs === null || team2Wickets === null) {
      setError('Please enter valid scores. Runs: 0-999, Wickets: 0-10')
      return
    }

    try {
      await apiService.updateMatchScores(matchId, {
        team1_runs: team1Runs,
        team1_wickets: team1Wickets,
        team2_runs: team2Runs,
        team2_wickets: team2Wickets
      })
      setSuccess('Innings scores updated successfully!')
      setShowScoresModal(false)
      await fetchMatches()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Error updating scores')
      console.error(err)
    }
  }

  const handleUpdateScoreUrl = async (matchId: number) => {
    const url = scoreUrlForm.match_score_url.trim()
    
    if (!url) {
      setError('Please enter a scorecard URL')
      return
    }

    // Validate URL format
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://')
      return
    }

    try {
      await apiService.updateMatchScoreUrl(matchId, url)
      setSuccess('Scorecard URL updated successfully!')
      setShowScoreUrlModal(false)
      setScoreUrlForm({ match_score_url: '' })
      await fetchMatches()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Error updating scorecard URL')
      console.error(err)
    }
  }

  const handleUpdateTiming = async (matchId: number) => {
    try {
      await apiService.updateMatchTiming(matchId, timingForm)
      setSuccess('Match timing updated successfully!')
      setShowTimingModal(false)
      await fetchMatches()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Error updating timing')
      console.error(err)
    }
  }

  const openTossModal = (match: Match) => {
    setEditingMatch(match)
    setTossForm({
      toss_winner: match.toss_winner || match.team1,
      toss_choice: match.toss_choice || 'bat'
    })
    setShowTossModal(true)
  }

  const openScoresModal = (match: Match) => {
    setEditingMatch(match)
    setScoresForm({
      team1_runs: match.team1_runs?.toString() || '',
      team1_wickets: match.team1_wickets?.toString() || '0',
      team2_runs: match.team2_runs?.toString() || '',
      team2_wickets: match.team2_wickets?.toString() || '0'
    })
    setShowScoresModal(true)
  }

  const openScoreUrlModal = (match: Match) => {
    setEditingMatch(match)
    setScoreUrlForm({
      match_score_url: match.match_score_url || ''
    })
    setShowScoreUrlModal(true)
  }

  const openTimingModal = (match: Match) => {
    setEditingMatch(match)
    setTimingForm({
      scheduled_start_time: match.scheduled_start_time || '',
      actual_start_time: match.actual_start_time || '',
      match_end_time: match.match_end_time || ''
    })
    setShowTimingModal(true)
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

  /**
   * 4-STAGE WORKFLOW HANDLERS
   */

  const openStartMatchModal = (match: Match) => {
    setEditingMatch(match)
    setStartMatchForm({
      toss_winner: match.team1,
      toss_choice: 'bat',
      match_score_url: match.match_score_url || '',
      actual_start_time: new Date().toISOString().slice(0, 16)
    })
    setShowStartMatchModal(true)
  }

  const handleStartMatch = async () => {
    if (!editingMatch) return

    if (!startMatchForm.toss_winner) {
      setError('Please select toss winner')
      return
    }

    if (!startMatchForm.match_score_url) {
      setError('Please enter scorecard URL')
      return
    }

    if (!startMatchForm.match_score_url.startsWith('http://') && !startMatchForm.match_score_url.startsWith('https://')) {
      setError('URL must start with http:// or https://')
      return
    }

    try {
      await apiService.startMatch(editingMatch.id, {
        toss_winner: startMatchForm.toss_winner,
        toss_choice: startMatchForm.toss_choice,
        match_score_url: startMatchForm.match_score_url,
        actual_start_time: new Date(startMatchForm.actual_start_time).toISOString()
      })
      setSuccess('Match started successfully!')
      setShowStartMatchModal(false)
      await fetchMatches()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Error starting match')
      console.error(err)
    }
  }

  const openFirstInningsModal = (match: Match) => {
    setEditingMatch(match)
    setFirstInningsForm({
      batting_team: match.team1,
      runs: 0,
      wickets: 0
    })
    setShowFirstInningsModal(true)
  }

  const handleRecordFirstInnings = async () => {
    if (!editingMatch) return

    if (!firstInningsForm.batting_team) {
      setError('Please select batting team')
      return
    }

    if (firstInningsForm.runs < 1 || firstInningsForm.runs > 999) {
      setError('Runs must be between 1-999')
      return
    }

    if (firstInningsForm.wickets < 0 || firstInningsForm.wickets > 10) {
      setError('Wickets must be between 0-10')
      return
    }

    try {
      await apiService.recordFirstInningsScore(editingMatch.id, {
        batting_team: firstInningsForm.batting_team,
        runs: firstInningsForm.runs,
        wickets: firstInningsForm.wickets
      })
      setSuccess('1st innings score recorded!')
      setShowFirstInningsModal(false)
      await fetchMatches()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Error recording 1st innings')
      console.error(err)
    }
  }

  const openSecondInningsModal = (match: Match) => {
    setEditingMatch(match)
    setSecondInningsForm({
      batting_team: match.team2,
      runs: 0,
      wickets: 0
    })
    setShowSecondInningsModal(true)
  }

  const handleRecordSecondInnings = async () => {
    if (!editingMatch) return

    if (!secondInningsForm.batting_team) {
      setError('Please select batting team')
      return
    }

    if (secondInningsForm.runs < 1 || secondInningsForm.runs > 999) {
      setError('Runs must be between 1-999')
      return
    }

    if (secondInningsForm.wickets < 0 || secondInningsForm.wickets > 10) {
      setError('Wickets must be between 0-10')
      return
    }

    try {
      await apiService.recordSecondInningsScore(editingMatch.id, {
        batting_team: secondInningsForm.batting_team,
        runs: secondInningsForm.runs,
        wickets: secondInningsForm.wickets
      })
      setSuccess('2nd innings score recorded!')
      setShowSecondInningsModal(false)
      await fetchMatches()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Error recording 2nd innings')
      console.error(err)
    }
  }

  const openFinishMatchModal = (match: Match) => {
    setEditingMatch(match)
    setFinishMatchForm({
      winner: match.team1,
      margin: 0,
      margin_type: 'runs',
      match_end_time: new Date().toISOString().slice(0, 16)
    })
    setShowFinishMatchModal(true)
  }

  const handleFinishMatch = async () => {
    if (!editingMatch) return

    if (!finishMatchForm.winner) {
      setError('Please select winning team')
      return
    }

    if (finishMatchForm.margin < 1) {
      setError('Margin must be greater than 0')
      return
    }

    if (finishMatchForm.margin_type === 'wickets' && finishMatchForm.margin > 10) {
      setError('Wickets cannot exceed 10')
      return
    }

    if (finishMatchForm.margin_type === 'runs' && finishMatchForm.margin > 999) {
      setError('Runs cannot exceed 999')
      return
    }

    try {
      const response = await apiService.finishMatch(editingMatch.id, {
        winner: finishMatchForm.winner,
        margin: finishMatchForm.margin,
        margin_type: finishMatchForm.margin_type,
        match_end_time: new Date(finishMatchForm.match_end_time).toISOString()
      })
      console.log('Finish Match Response:', response)
      setSuccess('Match finished successfully!')
      setShowFinishMatchModal(false)
      await fetchMatches()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Error finishing match')
      console.error('Error finishing match:', err)
    }
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
      <style>{`
        /* Global styles for all modals - White text for inputs */
        input, select, textarea {
          color: white !important;
          caret-color: white !important;
        }
        input::placeholder, select::placeholder, textarea::placeholder {
          color: rgb(107, 114, 128) !important;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgba(15, 23, 42, 0.6) inset !important;
          -webkit-text-fill-color: white !important;
          color: white !important;
        }
        input:focus, select:focus, textarea:focus {
          color: white !important;
        }
        select option {
          color: white !important;
          background-color: rgb(30, 41, 59) !important;
        }
      `}</style>
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
                onClick={() => setFilterStatus(status as any)}
                className={`flex-1 px-4 py-2 rounded-lg font-bold transition-all uppercase text-xs tracking-wider ${
                  filterStatus === status
                    ? 'bg-accent text-primary shadow-lg'
                    : 'text-gray-400 hover:text-accent border border-gray-600/30'
                }`}
              >
                {status === 'live' ? '🔴 Live' : status === 'completed' ? '✅ Completed' : status === 'scheduled' ? '⏳ Upcoming' : 'All'}
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
                  {/* Match Info with Timing */}
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
                    
                    {/* Scheduled Time Display */}
                    {match.scheduled_start_time && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-3 p-3 bg-gradient-to-r from-purple-500/30 to-blue-500/20 border-2 border-purple-400/60 rounded-xl"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">⏰</span>
                          <div>
                            <p className="text-xs text-purple-300/70 uppercase tracking-widest font-bold">Scheduled</p>
                            <p className="text-sm font-bold text-purple-100">
                              {new Date(match.scheduled_start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </p>
                            <p className="text-xs text-purple-300/60">
                              {new Date(match.scheduled_start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
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
                  <div className="md:col-span-3">
                    {/* Primary Actions - Workflow & Management */}
                    <div className="flex flex-wrap gap-2">
                      {/* Stage 1 -> Stage 2: Start Match */}
                      {match.status === 'scheduled' && (
                        <button
                          onClick={() => openStartMatchModal(match)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500/30 text-red-300 rounded-lg hover:bg-red-500/50 transition-all font-bold text-xs"
                          title="Start match: Add toss and scorecard URL"
                        >
                          <Play className="w-4 h-4" />
                          Start
                        </button>
                      )}

                      {/* Stage 2 -> Stage 3A: Record Team A Score (1st Innings) - Status stays Live */}
                      {match.status === 'live' && !match.team1_first_innings_runs && (
                        <button
                          onClick={() => openFirstInningsModal(match)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/50 transition-all font-bold text-xs"
                          title="Record Team A score (1st innings)"
                        >
                          <Save className="w-4 h-4" />
                          Team A
                        </button>
                      )}

                      {/* Stage 3A -> Stage 3B: Record Team B Score (2nd Innings) - Status stays Live */}
                      {match.status === 'live' && match.team1_first_innings_runs && !match.team2_first_innings_runs && (
                        <button
                          onClick={() => openSecondInningsModal(match)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/50 transition-all font-bold text-xs"
                          title="Record Team B score (2nd innings)"
                        >
                          <Save className="w-4 h-4" />
                          Team B
                        </button>
                      )}

                      {/* Stage 3B -> Stage 4: Finish Match (Live → Completed) */}
                      {match.status === 'live' && match.team1_first_innings_runs && match.team2_first_innings_runs && (
                        <button
                          onClick={() => openFinishMatchModal(match)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500/30 text-green-300 rounded-lg hover:bg-green-500/50 transition-all font-bold text-xs"
                          title="Finish match and record result"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Finish
                        </button>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowCreateModal(false)
              setShowEditModal(false)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-secondary via-secondary to-primary/30 border-2 border-accent/60 rounded-3xl p-10 max-w-2xl w-full shadow-2xl shadow-accent/30 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
              style={{
                colorScheme: 'dark'
              }}
            >
              <style>{`
                /* Force white text for all inputs in this modal */
                input {
                  color: white !important;
                  caret-color: white !important;
                }
                input::placeholder {
                  color: rgb(107, 114, 128) !important;
                }
                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus,
                input:-webkit-autofill:active {
                  -webkit-box-shadow: 0 0 0 30px rgba(15, 23, 42, 0.6) inset !important;
                  -webkit-text-fill-color: white !important;
                  color: white !important;
                }
                input:focus {
                  color: white !important;
                }
                /* For number inputs */
                input[type="number"] {
                  color: white !important;
                }
                input[type="text"] {
                  color: white !important;
                }
                input[type="url"] {
                  color: white !important;
                }
                input[type="datetime-local"] {
                  color: white !important;
                }
                /* Select dropdowns */
                select {
                  color: white !important;
                }
                select option {
                  color: white !important;
                  background-color: rgb(30, 41, 59) !important;
                }
              `}</style>
              {/* Header with Icon */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-accent to-yellow-500 rounded-full">
                    <Plus className="w-6 h-6 text-primary font-bold" />
                  </div>
                  <div>
                    <h2 className="font-heading text-3xl font-bold bg-gradient-to-r from-accent to-yellow-400 bg-clip-text text-transparent">
                      {showEditModal ? 'Edit Match' : 'Create New Match'}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {showEditModal ? 'Update match details' : 'Add a new cricket match to the tournament'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                  }}
                  className="p-3 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-full transition-all hover:scale-110"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-6">
                {/* Round and Match Number */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-accent mb-3 flex items-center gap-2">
                      <span className="text-lg">🏆</span>
                      Round
                    </label>
                    <input
                      type="text"
                      value={formData.round}
                      onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                      className="w-full bg-primary/60 border-2 border-accent/40 hover:border-accent/60 focus:border-accent rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all font-semibold"
                      placeholder="e.g., Round 1"
                      style={{ color: 'white' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-accent mb-3 flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      Match Number
                    </label>
                    <input
                      type="number"
                      value={formData.match_number}
                      onChange={(e) => setFormData({ ...formData, match_number: parseInt(e.target.value) || 0 })}
                      className="w-full bg-primary/60 border-2 border-accent/40 hover:border-accent/60 focus:border-accent rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all font-semibold"
                      placeholder="e.g., 1"
                      min="1"
                      style={{ color: 'white' }}
                    />
                  </div>
                </div>

                {/* Teams Section */}
                <div className="bg-primary/40 border-2 border-accent/30 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-accent mb-4 flex items-center gap-2">
                    <span className="text-xl">🏏</span>
                    Select Teams
                  </h3>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Team 1 */}
                    <div>
                      <label className="block text-sm font-bold text-blue-300 mb-3">Team 1</label>
                      {teams.length > 0 ? (
                        <select
                          value={formData.team1}
                          onChange={(e) => setFormData({ ...formData, team1: e.target.value })}
                          className="w-full bg-blue-500/20 border-2 border-blue-400/60 hover:border-blue-300 focus:border-blue-300 rounded-xl px-4 py-3 text-white font-semibold focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="" className="bg-primary text-gray-400">Select Team 1</option>
                          {teams.map((team, idx) => {
                            const teamId = team.teamId || team.team_id || team.id || idx
                            const teamName = team.teamName || team.team_name || team.name || `Team ${teamId}`
                            return (
                              <option key={teamId} value={teamName} className="bg-primary text-white">
                                {teamName}
                              </option>
                            )
                          })}
                        </select>
                      ) : teamsLoading ? (
                        <div className="w-full bg-blue-500/20 border-2 border-blue-400/60 rounded-xl px-4 py-3 text-gray-400 flex items-center justify-center">
                          <span className="animate-spin mr-2">⏳</span> Loading teams...
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={formData.team1}
                          onChange={(e) => setFormData({ ...formData, team1: e.target.value })}
                          className="w-full bg-blue-500/20 border-2 border-blue-400/60 hover:border-blue-300 focus:border-blue-300 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all font-semibold"
                          placeholder="Enter Team 1 name"
                          style={{ color: 'white' }}
                        />
                      )}
                    </div>

                    {/* Team 2 */}
                    <div>
                      <label className="block text-sm font-bold text-red-300 mb-3">Team 2</label>
                      {teams.length > 0 ? (
                        <select
                          value={formData.team2}
                          onChange={(e) => setFormData({ ...formData, team2: e.target.value })}
                          className="w-full bg-red-500/20 border-2 border-red-400/60 hover:border-red-300 focus:border-red-300 rounded-xl px-4 py-3 text-white font-semibold focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="" className="bg-primary text-gray-400">Select Team 2</option>
                          {teams.map((team, idx) => {
                            const teamId = team.teamId || team.team_id || team.id || idx
                            const teamName = team.teamName || team.team_name || team.name || `Team ${teamId}`
                            return (
                              <option key={teamId} value={teamName} className="bg-primary text-white">
                                {teamName}
                              </option>
                            )
                          })}
                        </select>
                      ) : teamsLoading ? (
                        <div className="w-full bg-red-500/20 border-2 border-red-400/60 rounded-xl px-4 py-3 text-gray-400 flex items-center justify-center">
                          <span className="animate-spin mr-2">⏳</span> Loading teams...
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={formData.team2}
                          onChange={(e) => setFormData({ ...formData, team2: e.target.value })}
                          className="w-full bg-red-500/20 border-2 border-red-400/60 hover:border-red-300 focus:border-red-300 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all font-semibold"
                          placeholder="Enter Team 2 name"
                          style={{ color: 'white' }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Scheduled Start Time */}
                <div>
                  <label className="block text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                    <span className="text-lg">⏰</span>
                    Scheduled Start Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_start_time || ''}
                    onChange={(e) => setFormData({ ...formData, scheduled_start_time: e.target.value })}
                    className="w-full bg-purple-500/20 border-2 border-purple-400/60 hover:border-purple-300 focus:border-purple-300 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all font-semibold"
                    style={{ color: 'white' }}
                  />
                  <p className="text-xs text-purple-300/60 mt-2">Set when this match should start</p>
                </div>

                {/* Team Match Preview */}
                {formData.team1 && formData.team2 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-red-500/20 border-2 border-accent/50 rounded-2xl p-6 text-center"
                  >
                    <p className="text-gray-300 text-sm mb-2">Match Preview</p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex-1 bg-blue-500/30 rounded-lg py-2 px-3 border border-blue-400/60">
                        <p className="font-bold text-blue-200">{formData.team1}</p>
                      </div>
                      <div className="px-4 py-2 bg-accent/30 rounded-lg border border-accent/60">
                        <p className="font-bold text-accent">VS</p>
                      </div>
                      <div className="flex-1 bg-red-500/30 rounded-lg py-2 px-3 border border-red-400/60">
                        <p className="font-bold text-red-200">{formData.team2}</p>
                      </div>
                    </div>
                    {formData.round && <p className="text-accent text-xs font-bold mt-3">🏆 {formData.round} - Match {formData.match_number}</p>}
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-accent/30">
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      setShowEditModal(false)
                    }}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95"
                  >
                    ✕ Cancel
                  </button>
                  <button
                    onClick={showEditModal ? handleUpdateMatch : handleCreateMatch}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-accent to-yellow-500 hover:from-accent hover:to-yellow-400 text-primary rounded-xl font-bold shadow-lg shadow-accent/50 transition-all transform hover:scale-105 active:scale-95"
                  >
                    {showEditModal ? '✓ Update Match' : '✓ Create Match'}
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

      {/* Toss Modal */}
      <AnimatePresence>
        {showTossModal && editingMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTossModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-secondary border-2 border-blue-400/40 rounded-2xl p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl text-blue-300">🪙 Toss Details</h2>
                <button
                  onClick={() => setShowTossModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-blue-300 mb-2">Toss Winner</label>
                  <select
                    value={tossForm.toss_winner}
                    onChange={(e) => setTossForm({ ...tossForm, toss_winner: e.target.value })}
                    className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-400 outline-none"
                  >
                    <option value="">Select winner</option>
                    <option value={editingMatch.team1}>{editingMatch.team1}</option>
                    <option value={editingMatch.team2}>{editingMatch.team2}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-blue-300 mb-2">Toss Choice</label>
                  <select
                    value={tossForm.toss_choice}
                    onChange={(e) => setTossForm({ ...tossForm, toss_choice: e.target.value as 'bat' | 'bowl' })}
                    className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-400 outline-none"
                  >
                    <option value="bat">Bat</option>
                    <option value="bowl">Bowl</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowTossModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateToss(editingMatch.id)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
                  >
                    Update Toss
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scores Modal */}
      <AnimatePresence>
        {showScoresModal && editingMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowScoresModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-secondary border-2 border-orange-400/40 rounded-2xl p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl text-orange-300">🏏 Innings Scores</h2>
                <button
                  onClick={() => setShowScoresModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-orange-300 mb-2">{editingMatch.team1} - Innings Score</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-orange-300/70 mb-1">Runs</label>
                      <input
                        type="number"
                        value={scoresForm.team1_runs}
                        onChange={(e) => setScoresForm({ ...scoresForm, team1_runs: e.target.value })}
                        className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 outline-none"
                        placeholder="0-999"
                        min="0"
                        max="999"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-orange-300/70 mb-1">Wickets</label>
                      <select
                        value={scoresForm.team1_wickets}
                        onChange={(e) => setScoresForm({ ...scoresForm, team1_wickets: e.target.value })}
                        className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 outline-none"
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {scoresForm.team1_runs && (
                    <p className="text-xs text-orange-300/70 mt-2">Score: <span className="font-bold text-orange-300">{scoresForm.team1_runs}-{scoresForm.team1_wickets}</span></p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-orange-300 mb-2">{editingMatch.team2} - Innings Score</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-orange-300/70 mb-1">Runs</label>
                      <input
                        type="number"
                        value={scoresForm.team2_runs}
                        onChange={(e) => setScoresForm({ ...scoresForm, team2_runs: e.target.value })}
                        className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 outline-none"
                        placeholder="0-999"
                        min="0"
                        max="999"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-orange-300/70 mb-1">Wickets</label>
                      <select
                        value={scoresForm.team2_wickets}
                        onChange={(e) => setScoresForm({ ...scoresForm, team2_wickets: e.target.value })}
                        className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 outline-none"
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {scoresForm.team2_runs && (
                    <p className="text-xs text-orange-300/70 mt-2">Score: <span className="font-bold text-orange-300">{scoresForm.team2_runs}-{scoresForm.team2_wickets}</span></p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowScoresModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateScores(editingMatch.id)}
                    className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-all"
                  >
                    Update Scores
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timing Modal */}
      <AnimatePresence>
        {showTimingModal && editingMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTimingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-secondary border-2 border-purple-400/40 rounded-2xl p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl text-purple-300">
                  <Clock className="w-6 h-6 inline mr-2" />
                  Match Timing
                </h2>
                <button
                  onClick={() => setShowTimingModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-purple-300 mb-2">Scheduled Start Time</label>
                  <input
                    type="datetime-local"
                    value={timingForm.scheduled_start_time}
                    onChange={(e) => setTimingForm({ ...timingForm, scheduled_start_time: e.target.value })}
                    className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-purple-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-300 mb-2">Actual Start Time</label>
                  <input
                    type="datetime-local"
                    value={timingForm.actual_start_time}
                    onChange={(e) => setTimingForm({ ...timingForm, actual_start_time: e.target.value })}
                    className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-purple-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-300 mb-2">Match End Time</label>
                  <input
                    type="datetime-local"
                    value={timingForm.match_end_time}
                    onChange={(e) => setTimingForm({ ...timingForm, match_end_time: e.target.value })}
                    className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-purple-400 outline-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowTimingModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateTiming(editingMatch.id)}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all"
                  >
                    Update Timing
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score URL Modal */}
      <AnimatePresence>
        {showScoreUrlModal && editingMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowScoreUrlModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-secondary border-2 border-cyan-400/40 rounded-2xl p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl text-cyan-300">
                  <LinkIcon className="w-6 h-6 inline mr-2" />
                  Scorecard URL
                </h2>
                <button
                  onClick={() => setShowScoreUrlModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-cyan-300 mb-2">Match Scorecard URL</label>
                  <input
                    type="url"
                    value={scoreUrlForm.match_score_url}
                    onChange={(e) => setScoreUrlForm({ match_score_url: e.target.value })}
                    className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-400 outline-none"
                    placeholder="https://example.com/match/scorecard"
                  />
                  <p className="text-xs text-gray-400 mt-2">Must be a valid HTTP or HTTPS URL</p>
                </div>

                {editingMatch.match_score_url && (
                  <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-3">
                    <p className="text-xs text-cyan-300 font-bold mb-1">Current URL:</p>
                    <a
                      href={editingMatch.match_score_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-200 hover:text-cyan-100 underline break-all"
                    >
                      {editingMatch.match_score_url}
                    </a>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowScoreUrlModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateScoreUrl(editingMatch.id)}
                    className="flex-1 px-6 py-3 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 transition-all"
                  >
                    Update URL
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4-STAGE WORKFLOW MODALS */}

      {/* Stage 2: Start Match Modal */}
      <AnimatePresence>
        {showStartMatchModal && editingMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowStartMatchModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-secondary via-secondary to-primary/30 border-2 border-red-400/60 rounded-3xl p-10 max-w-2xl w-full shadow-2xl shadow-red-500/30"
              onClick={e => e.stopPropagation()}
              style={{ colorScheme: 'dark' }}
            >
              <style>{`
                input, select { color: white !important; caret-color: white !important; }
                input::placeholder { color: rgb(107, 114, 128) !important; }
              `}</style>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    🔴 Start Match
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Match {editingMatch.match_number}: {editingMatch.team1} vs {editingMatch.team2}</p>
                </div>
                <button
                  onClick={() => setShowStartMatchModal(false)}
                  className="p-3 hover:bg-red-500/30 text-red-400 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-red-300 mb-3">Toss Winner</label>
                    <select
                      value={startMatchForm.toss_winner}
                      onChange={(e) => setStartMatchForm({ ...startMatchForm, toss_winner: e.target.value })}
                      className="w-full bg-red-500/20 border-2 border-red-400/60 hover:border-red-300 focus:border-red-300 rounded-xl px-4 py-3 text-white font-semibold focus:outline-none transition-all"
                    >
                      <option value="">Select winner</option>
                      <option value={editingMatch.team1}>{editingMatch.team1}</option>
                      <option value={editingMatch.team2}>{editingMatch.team2}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-red-300 mb-3">Toss Choice</label>
                    <select
                      value={startMatchForm.toss_choice}
                      onChange={(e) => setStartMatchForm({ ...startMatchForm, toss_choice: e.target.value as 'bat' | 'bowl' })}
                      className="w-full bg-red-500/20 border-2 border-red-400/60 hover:border-red-300 focus:border-red-300 rounded-xl px-4 py-3 text-white font-semibold focus:outline-none transition-all"
                    >
                      <option value="bat">Bat</option>
                      <option value="bowl">Bowl</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-red-300 mb-3">📊 Scorecard URL</label>
                  <input
                    type="url"
                    value={startMatchForm.match_score_url}
                    onChange={(e) => setStartMatchForm({ ...startMatchForm, match_score_url: e.target.value })}
                    className="w-full bg-red-500/20 border-2 border-red-400/60 hover:border-red-300 focus:border-red-300 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all"
                    placeholder="https://example.com/scorecard"
                    style={{ color: 'white' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-red-300 mb-3">⏰ Actual Start Time</label>
                  <input
                    type="datetime-local"
                    value={startMatchForm.actual_start_time}
                    onChange={(e) => setStartMatchForm({ ...startMatchForm, actual_start_time: e.target.value })}
                    className="w-full bg-red-500/20 border-2 border-red-400/60 hover:border-red-300 focus:border-red-300 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                    style={{ color: 'white' }}
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-red-400/30">
                  <button
                    onClick={() => setShowStartMatchModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartMatch}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/50 transition-all transform hover:scale-105 active:scale-95"
                  >
                    Start Match
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 3A: First Innings Modal */}
      <AnimatePresence>
        {showFirstInningsModal && editingMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowFirstInningsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-secondary via-secondary to-primary/30 border-2 border-blue-400/60 rounded-3xl p-10 max-w-2xl w-full shadow-2xl shadow-blue-500/30"
              onClick={e => e.stopPropagation()}
              style={{ colorScheme: 'dark' }}
            >
              <style>{`
                input, select { color: white !important; caret-color: white !important; }
                input::placeholder { color: rgb(107, 114, 128) !important; }
              `}</style>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    🏏 1st Innings Score
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Record first innings score</p>
                </div>
                <button
                  onClick={() => setShowFirstInningsModal(false)}
                  className="p-3 hover:bg-blue-500/30 text-blue-400 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-blue-300 mb-3">Batting Team</label>
                  <select
                    value={firstInningsForm.batting_team}
                    onChange={(e) => setFirstInningsForm({ ...firstInningsForm, batting_team: e.target.value })}
                    className="w-full bg-blue-500/20 border-2 border-blue-400/60 hover:border-blue-300 focus:border-blue-300 rounded-xl px-4 py-3 text-white font-semibold focus:outline-none transition-all"
                  >
                    <option value="">Select batting team</option>
                    <option value={editingMatch.team1}>{editingMatch.team1}</option>
                    <option value={editingMatch.team2}>{editingMatch.team2}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-blue-300 mb-3">📈 Runs</label>
                    <input
                      type="number"
                      value={firstInningsForm.runs}
                      onChange={(e) => setFirstInningsForm({ ...firstInningsForm, runs: parseInt(e.target.value) || 0 })}
                      className="w-full bg-blue-500/20 border-2 border-blue-400/60 hover:border-blue-300 focus:border-blue-300 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all"
                      placeholder="0"
                      min="1"
                      max="999"
                      style={{ color: 'white' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-blue-300 mb-3">🎯 Wickets</label>
                    <select
                      value={firstInningsForm.wickets}
                      onChange={(e) => setFirstInningsForm({ ...firstInningsForm, wickets: parseInt(e.target.value) || 0 })}
                      className="w-full bg-blue-500/20 border-2 border-blue-400/60 hover:border-blue-300 focus:border-blue-300 rounded-xl px-4 py-3 text-white font-semibold focus:outline-none transition-all"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {firstInningsForm.runs > 0 && (
                  <div className="p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl">
                    <p className="text-sm text-blue-300">Score Preview: <span className="text-2xl font-bold text-blue-100">{firstInningsForm.runs}-{firstInningsForm.wickets}</span></p>
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-blue-400/30">
                  <button
                    onClick={() => setShowFirstInningsModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRecordFirstInnings}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/50 transition-all transform hover:scale-105 active:scale-95"
                  >
                    Record Score
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 3B: Second Innings Modal */}
      <AnimatePresence>
        {showSecondInningsModal && editingMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowSecondInningsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-secondary via-secondary to-primary/30 border-2 border-purple-400/60 rounded-3xl p-10 max-w-2xl w-full shadow-2xl shadow-purple-500/30"
              onClick={e => e.stopPropagation()}
              style={{ colorScheme: 'dark' }}
            >
              <style>{`
                input, select { color: white !important; caret-color: white !important; }
                input::placeholder { color: rgb(107, 114, 128) !important; }
              `}</style>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    🏏 2nd Innings Score
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Record second innings score</p>
                </div>
                <button
                  onClick={() => setShowSecondInningsModal(false)}
                  className="p-3 hover:bg-purple-500/30 text-purple-400 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-purple-300 mb-3">Batting Team</label>
                  <select
                    value={secondInningsForm.batting_team}
                    onChange={(e) => setSecondInningsForm({ ...secondInningsForm, batting_team: e.target.value })}
                    className="w-full bg-purple-500/20 border-2 border-purple-400/60 hover:border-purple-300 focus:border-purple-300 rounded-xl px-4 py-3 text-white font-semibold focus:outline-none transition-all"
                  >
                    <option value="">Select batting team</option>
                    <option value={editingMatch.team1}>{editingMatch.team1}</option>
                    <option value={editingMatch.team2}>{editingMatch.team2}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-purple-300 mb-3">📈 Runs</label>
                    <input
                      type="number"
                      value={secondInningsForm.runs}
                      onChange={(e) => setSecondInningsForm({ ...secondInningsForm, runs: parseInt(e.target.value) || 0 })}
                      className="w-full bg-purple-500/20 border-2 border-purple-400/60 hover:border-purple-300 focus:border-purple-300 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all"
                      placeholder="0"
                      min="1"
                      max="999"
                      style={{ color: 'white' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-purple-300 mb-3">🎯 Wickets</label>
                    <select
                      value={secondInningsForm.wickets}
                      onChange={(e) => setSecondInningsForm({ ...secondInningsForm, wickets: parseInt(e.target.value) || 0 })}
                      className="w-full bg-purple-500/20 border-2 border-purple-400/60 hover:border-purple-300 focus:border-purple-300 rounded-xl px-4 py-3 text-white font-semibold focus:outline-none transition-all"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {secondInningsForm.runs > 0 && (
                  <div className="p-4 bg-purple-500/20 border border-purple-400/30 rounded-xl">
                    <p className="text-sm text-purple-300">Score Preview: <span className="text-2xl font-bold text-purple-100">{secondInningsForm.runs}-{secondInningsForm.wickets}</span></p>
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-purple-400/30">
                  <button
                    onClick={() => setShowSecondInningsModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRecordSecondInnings}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-500/50 transition-all transform hover:scale-105 active:scale-95"
                  >
                    Record Score
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 4: Finish Match Modal */}
      <AnimatePresence>
        {showFinishMatchModal && editingMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowFinishMatchModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-secondary via-secondary to-primary/30 border-2 border-green-400/60 rounded-3xl p-10 max-w-2xl w-full shadow-2xl shadow-green-500/30"
              onClick={e => e.stopPropagation()}
              style={{ colorScheme: 'dark' }}
            >
              <style>{`
                input, select { color: white !important; caret-color: white !important; }
                input::placeholder { color: rgb(107, 114, 128) !important; }
              `}</style>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    ✅ Finish Match
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Record match result and winner</p>
                </div>
                <button
                  onClick={() => setShowFinishMatchModal(false)}
                  className="p-3 hover:bg-green-500/30 text-green-400 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                  <p className="text-sm text-green-300 mb-2">📊 Current Scores:</p>
                  <div className="flex justify-between text-green-200">
                    <span className="font-bold">{editingMatch.team1}: {editingMatch.team1_first_innings_runs || 0}/{editingMatch.team1_first_innings_wickets || 0}</span>
                    <span className="font-bold">{editingMatch.team2}: {editingMatch.team2_first_innings_runs || 0}/{editingMatch.team2_first_innings_wickets || 0}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-green-300 mb-3">🏆 Winning Team</label>
                  <select
                    value={finishMatchForm.winner}
                    onChange={(e) => setFinishMatchForm({ ...finishMatchForm, winner: e.target.value })}
                    className="w-full bg-green-500/20 border-2 border-green-400/60 hover:border-green-300 focus:border-green-300 rounded-xl px-4 py-3 text-white font-semibold focus:outline-none transition-all"
                  >
                    <option value="">Select winner</option>
                    <option value={editingMatch.team1}>{editingMatch.team1}</option>
                    <option value={editingMatch.team2}>{editingMatch.team2}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-green-300 mb-3">📏 Margin</label>
                    <input
                      type="number"
                      value={finishMatchForm.margin}
                      onChange={(e) => setFinishMatchForm({ ...finishMatchForm, margin: parseInt(e.target.value) || 0 })}
                      className="w-full bg-green-500/20 border-2 border-green-400/60 hover:border-green-300 focus:border-green-300 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all"
                      placeholder="0"
                      min="1"
                      style={{ color: 'white' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-green-300 mb-3">Type</label>
                    <select
                      value={finishMatchForm.margin_type}
                      onChange={(e) => setFinishMatchForm({ ...finishMatchForm, margin_type: e.target.value as 'runs' | 'wickets' })}
                      className="w-full bg-green-500/20 border-2 border-green-400/60 hover:border-green-300 focus:border-green-300 rounded-xl px-4 py-3 text-white font-semibold focus:outline-none transition-all"
                    >
                      <option value="runs">Runs</option>
                      <option value="wickets">Wickets</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-green-300 mb-3">⏰ Match End Time</label>
                  <input
                    type="datetime-local"
                    value={finishMatchForm.match_end_time}
                    onChange={(e) => setFinishMatchForm({ ...finishMatchForm, match_end_time: e.target.value })}
                    className="w-full bg-green-500/20 border-2 border-green-400/60 hover:border-green-300 focus:border-green-300 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                    style={{ color: 'white' }}
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-green-400/30">
                  <button
                    onClick={() => setShowFinishMatchModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFinishMatch}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/50 transition-all transform hover:scale-105 active:scale-95"
                  >
                    Finish Match
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
