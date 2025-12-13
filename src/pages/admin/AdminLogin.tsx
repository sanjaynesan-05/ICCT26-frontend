import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdmin } from '../../contexts/AdminContext'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAdmin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const success = login(username, password)
    if (success) {
      navigate('/admin/dashboard')
    } else {
      setError('Invalid credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-6xl text-white mb-2 tracking-wider">
            ICCT26
          </h1>
          <p className="font-body text-accent text-lg">
            Admin Panel
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-effect rounded-2xl p-8 shadow-2xl">
          <h2 className="font-heading text-4xl text-white mb-6 text-center tracking-wide">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block font-body text-sm font-medium text-accent mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 input-focus focus:outline-none transition-all"
                placeholder="Enter username"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block font-body text-sm font-medium text-accent mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 input-focus focus:outline-none transition-all"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm font-body"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-gold text-xl py-4 rounded-lg shadow-lg"
            >
              Login
            </button>
          </form>

          {/* Demo Credentials Hint */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm font-body">
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-accent hover:text-white transition-colors font-body text-sm"
          >
            ← Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
