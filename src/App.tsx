import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CricketLoader from './components/CricketLoader'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Schedule from './pages/Schedule'
import Registration from './pages/Registration'
import Teams from './pages/Teams'
import Gallery from './pages/Gallery'
import Rules from './pages/Rules'
import Contact from './pages/Contact'
import { AdminProvider } from './contexts/AdminContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import TeamDetail from './pages/admin/TeamDetail'
import PlayerDetail from './pages/admin/PlayerDetail'
import ScheduleManager from './pages/admin/ScheduleManager'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Loader duration: ~5.5 seconds (4.5s progress + 1s fade out)
    const timer = setTimeout(() => setLoading(false), 5500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <CricketLoader />
  }

  return (
    <ErrorBoundary>
      <AdminProvider>
        <Router>
          <Routes>
            {/* Admin Routes (No Navbar/Footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/team/:teamId"
              element={
                <ProtectedRoute>
                  <TeamDetail />
              </ProtectedRoute>
            }
          />
            <Route
              path="/admin/player/:playerId"
              element={
                <ProtectedRoute>
                  <PlayerDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/schedule"
              element={
                <ProtectedRoute>
                  <ScheduleManager />
                </ProtectedRoute>
              }
            />          {/* Public Routes (With Navbar/Footer) */}
          <Route
            path="/*"
            element={
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="min-h-screen bg-gradient-primary"
              >
                <Navbar />
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/rules" element={<Rules />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </AnimatePresence>
                
              </motion.div>
            }
          />
        </Routes>
      </Router>
    </AdminProvider>
    </ErrorBoundary>
  )
}

export default App
