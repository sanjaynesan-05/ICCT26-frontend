import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Trophy, AlertCircle } from 'lucide-react'
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
      setError('Invalid username or password.')
    }
  }

  const inputClass =
    'w-full rounded-xl border border-surface-line bg-white px-4 py-3 text-ink placeholder:text-muted-dark/70 input-focus'

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 bg-stripes px-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold text-ink-900">
            <Trophy className="h-7 w-7" strokeWidth={2.5} />
          </span>
          <p className="mt-4 font-display text-4xl leading-none text-white">
            ICCT<span className="text-gold">'27</span>
          </p>
          <p className="mt-1 text-eyebrow uppercase text-muted">Admin panel</p>
        </div>

        <div className="card-light p-7">
          <div className="mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5 text-ink" />
            <h2 className="text-3xl text-ink">Sign in</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-ink">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl bg-flame/10 px-3 py-2.5 text-sm font-semibold text-flame-dark"
                role="alert"
              >
                <AlertCircle className="h-4 w-4" /> {error}
              </motion.p>
            )}

            <button type="submit" className="btn-gold w-full !py-3.5">
              Sign in
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
