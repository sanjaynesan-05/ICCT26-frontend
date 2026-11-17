import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, LayoutGrid } from 'lucide-react'
import { CO_SPONSORS, type Sponsor } from '../data/sponsors'

const LogoTile = ({ sponsor, className = '' }: { sponsor: Sponsor; className?: string }) => {
  const img = <img src={sponsor.logo} alt={sponsor.name} className="h-full w-full object-contain" loading="lazy" />
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-surface-line bg-white p-4 shadow-card transition-colors hover:border-gold ${className}`}
      title={sponsor.name}
    >
      {sponsor.url ? (
        <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="h-full w-full">
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  )
}

/** Co-sponsor logo strip: continuous scroll, pauses on hover, "View all" opens a grid. */
const ImageCarousel = () => {
  const [showAll, setShowAll] = useState(false)

  // Two copies back-to-back make the -50% marquee loop seamless
  const strip = [...CO_SPONSORS, ...CO_SPONSORS]
  const duration = Math.max(30, CO_SPONSORS.length * 4)

  useEffect(() => {
    if (!showAll) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowAll(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [showAll])

  return (
    <div>
      <div className="group relative overflow-hidden">
        <div
          className="flex w-max gap-4 py-2 group-hover:[animation-play-state:paused]"
          style={{ animation: `marquee ${duration}s linear infinite` }}
        >
          {strip.map((sponsor, index) => (
            <LogoTile key={index} sponsor={sponsor} className="h-28 w-44 shrink-0 !p-3 md:h-36 md:w-56" />
          ))}
        </div>
        {/* Soft edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface to-transparent" />
      </div>

      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-dark transition-colors hover:text-ink"
        >
          <LayoutGrid className="h-4 w-4" /> View all sponsors
        </button>
      </div>

      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm"
            onClick={() => setShowAll(false)}
          >
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-surface p-6 text-ink md:p-8"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="All sponsors"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-3xl text-ink">All Co-Sponsors</h3>
                <button
                  type="button"
                  onClick={() => setShowAll(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/10"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {CO_SPONSORS.map((sponsor, index) => (
                  <LogoTile key={index} sponsor={sponsor} className="aspect-square" />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ImageCarousel
