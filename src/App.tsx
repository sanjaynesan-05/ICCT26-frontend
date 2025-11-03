import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CricketLoader from './components/CricketLoader'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Schedule from './pages/Schedule'
import Registration from './pages/Registration'
import Rules from './pages/Rules'
import Contact from './pages/Contact'

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
    <Router>
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
            <Route path="/rules" element={<Rules />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
        
      </motion.div>
    </Router>
  )
}

export default App
