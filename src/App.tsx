import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CricketLoader from './components/CricketLoader'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Registration from './pages/Registration'
import Gallery from './pages/Gallery'
import Rules from './pages/Rules'
import Contact from './pages/Contact'
import { AdminProvider } from './contexts/AdminContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import TeamDetail from './pages/admin/TeamDetail'
import ScheduleManager from './pages/admin/ScheduleManager'
import { warmUpBackend } from './utils/backendWarmup'

// ~6s cinematic intro, skippable, shown once per browser session.
// Set to false to send visitors straight to the site.
const SHOW_INTRO_LOADER = true

function App() {
  // Wake the (possibly sleeping) backend immediately — runs during the intro loader too
  useEffect(() => {
    void warmUpBackend()
  }, [])

  const [loading, setLoading] = useState(() => {
    if (!SHOW_INTRO_LOADER) return false
    // Only show loader on initial page load, not on page refresh or navigation
    const hasShownLoader = sessionStorage.getItem('cricketLoaderShown')
    return !hasShownLoader
  })

  useEffect(() => {
    if (loading) {
      // Mark that loader has been shown
      sessionStorage.setItem('cricketLoaderShown', 'true')
      
      // The loader calls onComplete itself after ~6s (or on Skip);
      // this is only a safety net in case the animation never finishes.
      const timer = setTimeout(() => setLoading(false), 9000)
      return () => clearTimeout(timer)
    }
  }, [loading])

  if (loading) {
    return <CricketLoader onComplete={() => setLoading(false)} />
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
                className="min-h-screen bg-ink-900 flex flex-col"
              >
                <Navbar />
                <main className="flex-1">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/rules" element={<Rules />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </AnimatePresence>
                </main>
                <Footer />
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
