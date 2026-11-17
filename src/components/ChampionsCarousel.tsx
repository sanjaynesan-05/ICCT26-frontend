import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Crown, ImageIcon, Medal, Trophy, X } from 'lucide-react'
import { CHAMPIONS, NEXT_SEASON, type Champion } from '../data/champions'
import { cn } from '../lib/utils'

/**
 * Hall of Champions — a compact strip under the highlights.
 * Hover a season (desktop) → floating preview card.
 * Tap / click a season (any device) → centred modal with the full details.
 */

type Entry = { kind: 'past'; c: Champion } | { kind: 'next' }

const ENTRIES: Entry[] = [...CHAMPIONS.map((c) => ({ kind: 'past' as const, c })), { kind: 'next' as const }]

const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/* ------------------------------------------------------------------ */
/* Shared detail content (used by hover card and modal)                */
/* ------------------------------------------------------------------ */

const Photo = ({ c, large }: { c: Champion; large?: boolean }) =>
  c.image ? (
    <img src={c.image} alt={`${c.team || 'Champions'} — ${c.edition}`} className="h-full w-full object-cover" />
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-ink bg-stripes text-center">
      <ImageIcon className={cn('text-white/35', large ? 'h-10 w-10' : 'h-7 w-7')} />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Winners' photo coming soon</span>
    </div>
  )

const ChampionDetails = ({ c, large }: { c: Champion; large?: boolean }) => (
  <>
    <div className={cn('relative w-full overflow-hidden bg-ink', large ? 'aspect-[16/10]' : 'aspect-[16/9]')}>
      <Photo c={c} large={large} />
      <span className="absolute left-3 top-3 rounded-md bg-gold px-2 py-0.5 font-display text-lg leading-tight text-ink-900">{c.year}</span>
    </div>
    <div className={large ? 'p-6' : 'p-4'}>
      <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-flame">
        <Crown className="h-3.5 w-3.5" /> Champions · Season {c.season}
      </p>
      <p className={cn('mt-1 leading-tight', large ? 'font-display text-4xl' : 'font-display text-2xl', c.team ? 'text-ink' : 'text-ink/35')}>
        {c.team || 'Team to be updated'}
      </p>
      <p className={cn('mt-0.5 text-sm', c.church ? 'text-muted-dark' : 'text-muted-dark/60')}>{c.church || 'Church to be updated'}</p>
      {c.runnerUp && (
        <p className="mt-3 flex items-center gap-2 border-t border-surface-line pt-3 text-sm text-muted-dark">
          <Medal className="h-4 w-4 shrink-0 text-ink/40" /> Runner-up: <span className="font-semibold text-ink">{c.runnerUp}</span>
        </p>
      )}
    </div>
  </>
)

const NextDetails = ({ large }: { large?: boolean }) => (
  <>
    <div className={cn('relative flex w-full items-center justify-center bg-ink bg-stripes', large ? 'aspect-[16/10]' : 'aspect-[16/9]')}>
      <span className={cn('font-display leading-none text-gold', large ? 'text-9xl' : 'text-7xl')}>?</span>
      <span className="absolute left-3 top-3 rounded-md border border-gold/50 px-2 py-0.5 font-display text-lg leading-tight text-gold">
        {NEXT_SEASON.year}
      </span>
    </div>
    <div className={large ? 'p-6' : 'p-4'}>
      <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-flame">
        <Trophy className="h-3.5 w-3.5" /> Season {NEXT_SEASON.season}
      </p>
      <p className={cn('mt-1 font-display leading-tight text-ink', large ? 'text-4xl' : 'text-2xl')}>Who lifts the trophy?</p>
      <p className="mt-0.5 text-sm text-muted-dark">The {NEXT_SEASON.year} champions will be crowned on match day. Could it be your church?</p>
    </div>
  </>
)

const Details = ({ entry, large }: { entry: Entry; large?: boolean }) =>
  entry.kind === 'past' ? <ChampionDetails c={entry.c} large={large} /> : <NextDetails large={large} />

/* ------------------------------------------------------------------ */
/* Strip                                                               */
/* ------------------------------------------------------------------ */

const ChampionsCarousel = () => {
  const [hovered, setHovered] = useState<number | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const hideTimer = useRef<number>()

  // Modal: Esc to close, lock page scroll
  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const showHover = (i: number) => {
    if (!canHover()) return
    window.clearTimeout(hideTimer.current)
    setHovered(i)
  }
  const hideHover = () => {
    hideTimer.current = window.setTimeout(() => setHovered(null), 80)
  }

  return (
    <section className="relative z-30 pb-12 md:pb-16" aria-label="Hall of champions">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="mx-auto flex max-w-6xl flex-col rounded-2xl border border-white/10 bg-ink-800 shadow-card-dark lg:flex-row"
        >
          {/* Label */}
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3 lg:w-52 lg:shrink-0 lg:flex-col lg:items-start lg:justify-center lg:border-b-0 lg:border-r lg:py-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <Crown className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Previous seasons</p>
              <p className="font-display text-2xl leading-none text-white">
                {CHAMPIONS.some((c) => c.runnerUp) ? 'Champions & runners-up' : 'Title winners'}
              </p>
            </div>
          </div>

          {/* Seasons */}
          <div className="no-scrollbar flex flex-1 snap-x overflow-x-auto lg:grid lg:grid-cols-4 lg:overflow-visible">
            {ENTRIES.map((entry, i) => {
              const isNext = entry.kind === 'next'
              const year = isNext ? NEXT_SEASON.year : entry.c.year
              const season = isNext ? NEXT_SEASON.season : entry.c.season
              const team = isNext ? 'Your church?' : entry.c.team || 'To be updated'
              return (
                <div
                  key={year}
                  className={cn('relative min-w-[11.5rem] shrink-0 snap-start lg:min-w-0', i > 0 && 'border-l border-white/10')}
                  onMouseEnter={() => showHover(i)}
                  onMouseLeave={hideHover}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setHovered(null)
                      setOpen(i)
                    }}
                    onFocus={() => showHover(i)}
                    onBlur={hideHover}
                    className={cn(
                      'group flex h-full w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-white/[0.04] focus-visible:bg-white/[0.04] lg:rounded-none',
                      i === ENTRIES.length - 1 && 'lg:rounded-r-2xl'
                    )}
                    aria-haspopup="dialog"
                    aria-label={`${year} ${isNext ? '— champion to be decided' : `champions: ${team}`}. Show details`}
                  >
                    <span
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-xl',
                        isNext ? 'border border-dashed border-gold/50 text-gold' : 'bg-gold text-ink-900'
                      )}
                    >
                      {isNext ? '?' : String(year).slice(2)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                        {year} · S{season}
                      </span>
                      <span className={cn('block truncate font-display text-xl leading-tight', isNext ? 'text-gold' : entry.c.team ? 'text-white' : 'text-white/40')}>
                        {team}
                      </span>
                      {!isNext && entry.c.runnerUp && (
                        <span className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-white/50">
                          <Medal className="h-3 w-3 shrink-0" /> Runner-up: {entry.c.runnerUp}
                        </span>
                      )}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
                  </button>

                  {/* Hover preview (desktop) */}
                  <AnimatePresence>
                    {hovered === i && open === null && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-3 hidden w-72 rounded-2xl bg-white text-ink shadow-[0_20px_50px_rgba(0,0,0,0.45)] lg:block"
                        style={{ x: '-50%' }}
                        role="tooltip"
                      >
                        <div className="overflow-hidden rounded-2xl">
                          <Details entry={entry} />
                        </div>
                        <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </motion.div>
        <p className="mt-2 text-center text-[11px] text-white/35 lg:hidden">Tap a season for details · swipe for more</p>
      </div>

      {/* Modal (tap / click) */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[90svh] w-full max-w-md overflow-y-auto rounded-2xl bg-white text-ink shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Champion details"
            >
              <Details entry={ENTRIES[open]} large />
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink-950/60 text-white backdrop-blur hover:bg-ink-950/80"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              {/* Season switcher */}
              <div className="flex items-center justify-center gap-1.5 border-t border-surface-line p-3">
                {ENTRIES.map((e, i) => {
                  const y = e.kind === 'past' ? e.c.year : NEXT_SEASON.year
                  return (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setOpen(i)}
                      className={cn(
                        'rounded-lg px-3 py-1.5 font-display text-lg leading-none transition-colors',
                        i === open ? 'bg-ink text-gold' : 'text-ink/50 hover:bg-surface hover:text-ink'
                      )}
                      aria-current={i === open}
                    >
                      {y}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ChampionsCarousel
