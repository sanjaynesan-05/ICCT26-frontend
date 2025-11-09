import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdmin } from '../../contexts/AdminContext'
import { apiService } from '../../services/api'

interface Team {
  teamId: string
  teamName: string
  churchName: string
  captainName: string
  captainPhone: string
  captainEmail: string
  viceCaptainName: string
  playerCount: number
  registrationDate: string
  paymentReceipt: string
}

const AdminDashboard = () => {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { logout } = useAdmin()

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      setError('')
      
      try {
        // Try admin endpoint first
        const response = await apiService.getAllTeams()
        const teamsList = response.teams || response.data || response
        setTeams(Array.isArray(teamsList) ? teamsList : [])
      } catch (adminError: any) {
        console.warn('Admin teams endpoint not available, trying alternative endpoint:', adminError.message)
        
        // Try alternative endpoints
        try {
          const response = await apiService.getTeamsFromDatabase()
          const teamsList = response.teams || response.data || response
          setTeams(Array.isArray(teamsList) ? teamsList : [])
        } catch (databaseError: any) {
          console.warn('Teams endpoint not available, using demo data:', databaseError.message)
          // If both fail, show demo data
          setTeams(generateDummyTeams())
        }
      }
    } catch (err) {
      console.error('Error fetching teams:', err)
      setError('Failed to load teams. Using demo data.')
      setTeams(generateDummyTeams())
    } finally {
      setLoading(false)
    }
  }

  const generateDummyTeams = (): Team[] => {
    return [
      {
        teamId: 'ICCT26-0001',
        teamName: 'Thunder Strikers',
        churchName: 'CSI St. Peter\'s Church',
        captainName: 'John Doe',
        captainPhone: '+919876543210',
        captainEmail: 'john@example.com',
        viceCaptainName: 'Jane Smith',
        playerCount: 11,
        registrationDate: '2026-01-15 10:30:45',
        paymentReceipt: 'TXN123456789'
      },
      {
        teamId: 'ICCT26-0002',
        teamName: 'Royal Champions',
        churchName: 'CSI Emmanuel Church',
        captainName: 'Mike Johnson',
        captainPhone: '+919876543211',
        captainEmail: 'mike@example.com',
        viceCaptainName: 'Sarah Williams',
        playerCount: 13,
        registrationDate: '2026-01-15 11:20:30',
        paymentReceipt: 'TXN987654321'
      },
      {
        teamId: 'ICCT26-0003',
        teamName: 'Eagles XI',
        churchName: 'CSI Grace Church',
        captainName: 'David Brown',
        captainPhone: '+919876543212',
        captainEmail: 'david@example.com',
        viceCaptainName: 'Emily Davis',
        playerCount: 12,
        registrationDate: '2026-01-15 14:45:15',
        paymentReceipt: 'TXN555777999'
      }
    ]
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const filteredTeams = teams.filter(team =>
    team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.churchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.teamId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.captainName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Admin Header */}
      <header className="bg-primary/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-4xl text-white tracking-wider">ICCT'26 ADMIN</h1>
              <p className="font-body text-accent text-sm">Team Management Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="font-body text-white/80 hover:text-accent transition-colors"
              >
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500/80 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-body transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-xl p-6 glow-border"
          >
            <div className="text-accent font-body text-sm mb-2">Total Teams</div>
            <div className="text-white font-heading text-5xl tracking-wide">{teams.length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-6 glow-border"
          >
            <div className="text-accent font-body text-sm mb-2">Total Players</div>
            <div className="text-white font-heading text-5xl tracking-wide">
              {teams.reduce((sum, team) => sum + team.playerCount, 0)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-xl p-6 glow-border"
          >
            <div className="text-accent font-body text-sm mb-2">Churches</div>
            <div className="text-white font-heading text-5xl tracking-wide">
              {new Set(teams.map(t => t.churchName)).size}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-xl p-6 glow-border"
          >
            <div className="text-accent font-body text-sm mb-2">Avg Team Size</div>
            <div className="text-white font-heading text-5xl tracking-wide">
              {teams.length > 0 ? Math.round(teams.reduce((sum, team) => sum + team.playerCount, 0) / teams.length) : 0}
            </div>
          </motion.div>
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search teams by name, church, ID, or captain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 input-focus focus:outline-none font-body"
            />
            <button
              onClick={fetchTeams}
              className="btn-gold px-8 py-3 rounded-lg font-body"
            >
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Teams List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="font-heading text-4xl text-white mb-6 tracking-wide">
            Registered Teams ({filteredTeams.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
              <p className="text-white font-body mt-4">Loading teams...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-red-200 font-body">
              {error}
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="glass-effect rounded-xl p-12 text-center">
              <p className="text-white font-body text-lg">No teams found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredTeams.map((team, index) => (
                <motion.div
                  key={team.teamId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/admin/team/${team.teamId}`)}
                  className="glass-effect rounded-xl p-6 hover:border-accent hover:bg-white/20 transition-all cursor-pointer group glow-border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-body font-semibold">
                          {team.teamId}
                        </span>
                        <h3 className="font-heading text-3xl text-white group-hover:text-accent transition-colors tracking-wide">
                          {team.teamName}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-accent text-sm font-body mb-1">Church</p>
                          <p className="text-white font-body">{team.churchName}</p>
                        </div>
                        <div>
                          <p className="text-accent text-sm font-body mb-1">Captain</p>
                          <p className="text-white font-body">{team.captainName}</p>
                          <p className="text-white/60 text-sm font-body">{team.captainPhone}</p>
                        </div>
                        <div>
                          <p className="text-accent text-sm font-body mb-1">Vice Captain</p>
                          <p className="text-white font-body">{team.viceCaptainName}</p>
                        </div>
                        <div>
                          <p className="text-accent text-sm font-body mb-1">Players</p>
                          <p className="text-white font-body">{team.playerCount} players</p>
                          <p className="text-white/60 text-sm font-body">{team.registrationDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <svg
                        className="w-6 h-6 text-accent group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
