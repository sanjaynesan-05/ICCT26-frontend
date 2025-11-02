import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Schedule from './pages/Schedule'
import Registration from './pages/Registration'
import Rules from './pages/Rules'
import Contact from './pages/Contact'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-primary">
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
        <Footer />
      </div>
    </Router>
  )
}

export default App
