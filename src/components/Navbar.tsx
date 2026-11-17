import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Trophy } from 'lucide-react'
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

const DESKTOP_QUERY = '(min-width: 768px)' // Tailwind `md`

/** Three bars that morph into an X. */
const MenuIcon = ({ open }: { open: boolean }) => (
  <span className="relative block h-4 w-5" aria-hidden>
    <span
      className={cn(
        'absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300',
        open ? 'top-[7px] rotate-45' : 'top-0'
      )}
    />
    <span
      className={cn(
        'absolute left-0 top-[7px] block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200',
        open ? 'opacity-0' : 'opacity-100'
      )}
    />
    <span
      className={cn(
        'absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300',
        open ? 'top-[7px] -rotate-45' : 'top-[14px]'
      )}
    />
  </span>
)

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on any navigation (path or hash change)
  useEffect(() => close(), [location.pathname, location.hash, close])

  // While open: lock page scroll, close on Esc, close when the screen becomes desktop-wide
  useEffect(() => {
    if (!open) return

    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const mq = window.matchMedia(DESKTOP_QUERY)
    const onWide = (e: MediaQueryListEvent) => e.matches && setOpen(false)

    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onWide)
    // Move focus into the menu for keyboard / screen-reader users
    const t = window.setTimeout(() => firstLinkRef.current?.focus({ preventScroll: true }), 50)

    return () => {
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onWide)
      window.clearTimeout(t)
    }
  }, [open])

  // Transparent over the Home hero, solid everywhere else / once scrolled / while the menu is open
  const solid = scrolled || location.pathname !== '/' || open

  return (
    <>
      <nav
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
          solid ? 'bg-ink-900/95 shadow-nav md:bg-ink-900/90 md:backdrop-blur-md' : 'bg-transparent'
        )}
      >
        <div className="page-container">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Wordmark */}
            <Link to="/" onClick={close} className="flex min-w-0 items-center gap-3" aria-label="ICCT'27 home">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold text-ink-900">
                <Trophy className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="flex min-w-0 flex-col leading-none">
                <span className="font-display text-2xl tracking-wide text-white">
                  ICCT<span className="text-gold">'27</span>
                </span>
                <span className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Inter Church Cricket Tournament
                </span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const active = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={active ? 'page' : undefined}
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

            {/* Mobile menu button — always visible, large touch target */}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              className={cn(
                'relative -mr-1 flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl border text-white transition-colors md:hidden',
                open ? 'border-gold/60 bg-gold/15 text-gold' : 'border-white/20 bg-ink-900/50 hover:bg-ink-900/70'
              )}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu panel — a sibling of <nav>, NOT inside it.
          (A backdrop-filter on an ancestor turns `position: fixed` into "fixed to that ancestor",
          which squashed the old panel to the navbar's height.) */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-ink-900 pt-16 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="pointer-events-none absolute inset-0 bg-stripes" aria-hidden />
            <nav className="page-container relative flex min-h-full flex-col py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]" aria-label="Mobile">
              <ul className="flex flex-col">
                {navLinks.map((link, i) => {
                  const active = location.pathname === link.path
                  return (
                    <motion.li
                      key={link.path}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.03 * i }}
                    >
                      <Link
                        ref={i === 0 ? firstLinkRef : undefined}
                        to={link.path}
                        onClick={close}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex items-center justify-between border-b border-white/10 py-3.5 font-display text-4xl tracking-wide transition-colors active:text-gold',
                          active ? 'text-gold' : 'text-white'
                        )}
                      >
                        {link.name}
                        {active && <span className="h-2 w-2 rounded-full bg-gold" aria-hidden />}
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
              <p className="mt-auto pt-8 text-xs text-white/40">Inter Church Cricket Tournament · Season 4</p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
