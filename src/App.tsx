import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import { AdminProvider } from './contexts/AdminContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { warmUpBackend } from './utils/backendWarmup'

// Code-split: each page (and the whole admin area) downloads only when visited.
// Home stays in the main bundle so the landing page renders immediately.
const CricketLoader = lazy(() => import('./components/CricketLoader'))
const Registration = lazy(() => import('./pages/Registration'))
const Fixtures = lazy(() => import('./pages/Fixtures'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Rules = lazy(() => import('./pages/Rules'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const TeamDetail = lazy(() => import('./pages/admin/TeamDetail'))
const ScheduleManager = lazy(() => import('./pages/admin/ScheduleManager'))

// ~6s cinematic intro, skippable, shown once per browser session.
// Set to false to send visitors straight to the site.
const SHOW_INTRO_LOADER = true

/** Shown briefly while a page's code downloads. */
const PageFallback = () => (
  <div className="flex min-h-[60svh] items-center justify-center bg-ink-900" role="status" aria-label="Loading">
    <span className="h-9 w-9 animate-spin rounded-full border-4 border-gold border-t-transparent" />
  </div>
)

/** New page → start at the top (hash links like /rules#bowling are left alone). */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function App() {
  // Wake the (possibly sleeping) backend immediately — runs during the intro loader too
  useEffect(() => {
    void warmUpBackend()
  }, [])

  const [loading, setLoading] = useState(() => {
    if (!SHOW_INTRO_LOADER) return false
    try {
      // Only show loader on the first visit in this browser session
      return !sessionStorage.getItem('cricketLoaderShown')
    } catch {
      return false // storage blocked (private mode etc.) — skip the intro
    }
  })

  useEffect(() => {
    if (loading) {
      try {
        sessionStorage.setItem('cricketLoaderShown', 'true')
      } catch {
        /* ignore */
      }
      // The loader calls onComplete itself after ~6s (or on Skip);
      // this is only a safety net in case the animation never finishes.
      const timer = setTimeout(() => setLoading(false), 9000)
      return () => clearTimeout(timer)
    }
  }, [loading])

  if (loading) {
    return (
      <Suspense fallback={<div className="fixed inset-0 bg-ink-950" />}>
        <CricketLoader onComplete={() => setLoading(false)} />
      </Suspense>
    )
  }

  return (
    <ErrorBoundary>
      <AdminProvider>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Admin Routes (No Navbar/Footer) */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
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
              />

              {/* Public Routes (With Navbar/Footer) */}
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
                      <Suspense fallback={<PageFallback />}>
                        <AnimatePresence mode="wait">
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/registration" element={<Registration />} />
                            <Route path="/fixtures" element={<Fixtures />} />
                            <Route path="/gallery" element={<Gallery />} />
                            <Route path="/rules" element={<Rules />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </AnimatePresence>
                      </Suspense>
                    </main>
                    <Footer />
                  </motion.div>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </AdminProvider>
    </ErrorBoundary>
  )
}

export default App
