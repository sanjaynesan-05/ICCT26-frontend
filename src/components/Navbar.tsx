import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Rules', path: '/rules' },
  { name: 'Registration', path: '/registration' },
  { name: 'Fixtures', path: '/fixtures' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
]

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on navigation and lock body scroll while it is open
  useEffect(() => setIsMobileMenuOpen(false), [location.pathname])
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Transparent over the Home hero, solid everywhere else / once scrolled
  const solid = scrolled || location.pathname !== '/' || isMobileMenuOpen

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        solid ? 'bg-ink-900/90 backdrop-blur-md shadow-nav' : 'bg-transparent'
      )}
    >
      <div className="page-container">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Wordmark */}
          <Link to="/" className="flex items-center gap-3" aria-label="ICCT'27 home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-ink-900">
              <Trophy className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-2xl tracking-wide text-white">
                ICCT<span className="text-gold">'27</span>
              </span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                Inter Church Cricket Tournament
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative px-2.5 py-2 text-sm font-semibold transition-colors lg:px-4',
                    active ? 'text-white' : 'text-white/70 hover:text-white'
                  )}
                >
                  {link.name}
                  <span
                    className={cn(
                      'absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-gold transition-opacity lg:inset-x-4',
                      active ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            className="md:hidden -mr-2 p-2 text-white"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-ink-900 bg-stripes"
          >
            <div className="page-container flex min-h-full flex-col py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <div className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'border-b border-white/10 py-3.5 font-display text-4xl tracking-wide transition-colors',
                      location.pathname === link.path ? 'text-gold' : 'text-white'
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
