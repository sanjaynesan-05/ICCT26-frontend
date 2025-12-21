import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rules', path: '/rules' },
    { name: 'Registration', path: '/registration' },
    { name: 'Teams', path: '/teams' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <nav
      className="w-full transition-all duration-300 bg-primary shadow-lg"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <Trophy className="w-8 h-8 text-accent group-hover:rotate-12 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="font-heading text-2xl text-accent tracking-wider">ICCT26</span>
              <span className="text-xs text-gray-300 -mt-1">Cricket Tournament</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-subheading font-semibold transition-all duration-300 relative group ${
                  location.pathname === link.path
                    ? 'text-accent'
                    : 'text-white hover:text-accent'
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            to="/registration"
            className="hidden md:block btn-gold text-sm transition-shadow"
            style={{ boxShadow: '0 0 18px rgba(255,214,92,0.32)' }}
          >
            Register Now
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 hover:text-accent transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-primary overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block font-subheading font-semibold text-lg py-2 transition-colors ${
                    location.pathname === link.path
                      ? 'text-accent'
                      : 'text-white hover:text-accent'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/registration"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block btn-gold text-center text-sm mt-4 transition-shadow"
                style={{ boxShadow: '0 0 14px rgba(255,214,92,0.28)' }}
              >
                Register Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
