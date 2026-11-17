import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Maximize2, Camera, Crown, Download, Medal, Sparkles, Clock } from 'lucide-react'
import SEO from '../components/SEO'
import { PageHero } from '../components/ui'
import { SEASONS } from '../data/seasons'

type SeasonNo = number

interface GalleryImage {
  id: string
  season: SeasonNo
  filename: string
  src: string
  width: number
  height: number
}

// Photos per season are managed in src/data/seasons.ts
const GALLERY_IMAGES: GalleryImage[] = SEASONS.flatMap((season) =>
  season.photos.map((src, idx) => ({
    id: `s${season.season}-${idx + 1}`,
    season: season.season,
    filename: src.split('/').pop() || `s${season.season}-image-${idx + 1}`,
    src,
    width: 800,
    height: 600,
  }))
)

// Open on the most recent season that has photos
const DEFAULT_SEASON =
  [...SEASONS].reverse().find((sn) => sn.photos.length > 0)?.season ?? SEASONS[0]?.season ?? 1

/** Cloudinary: ask the CDN to send the file as a download; other hosts fall back to the plain URL. */
const downloadUrl = (src: string) =>
  src.includes('res.cloudinary.com') && src.includes('/upload/') ? src.replace('/upload/', '/upload/fl_attachment/') : src

const Gallery = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null)
  const [allImages, setAllImages] = useState<GalleryImage[]>(GALLERY_IMAGES)
  const [activeSeason, setActiveSeason] = useState<SeasonNo>(DEFAULT_SEASON)
  // Everything below (grid, viewer, swipe, keys) works on the selected season only
  const images = useMemo(() => allImages.filter((img) => img.season === activeSeason), [allImages, activeSeason])
  const seasonCounts = useMemo(
    () => Object.fromEntries(SEASONS.map((sn) => [sn.season, allImages.filter((img) => img.season === sn.season).length])) as Record<SeasonNo, number>,
    [allImages]
  )
  const season = SEASONS.find((sn) => sn.season === activeSeason)!
  const seasonLabel = `Season ${season.season}`

  const selectSeason = (id: SeasonNo) => {
    setCurrentImageIndex(null)
    setActiveSeason(id)
  }
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Function to get actual image dimensions
  const updateImageDimensions = (filename: string, width: number, height: number) => {
    setAllImages(prevImages =>
      prevImages.map(img =>
        img.filename === filename ? { ...img, width, height } : img
      )
    )
  }

  // Mark image as loaded
  const markImageLoaded = useCallback((filename: string) => {
    setLoadedImages(prev => new Set(prev).add(filename))
  }, [])

  // Preload images and get their dimensions
  useEffect(() => {
    GALLERY_IMAGES.forEach(image => {
      const img = new Image()
      img.onload = () => {
        updateImageDimensions(image.filename, img.naturalWidth, img.naturalHeight)
        markImageLoaded(image.filename)
      }
      img.src = image.src
    })
  }, [markImageLoaded])

  // Preload adjacent images for better navigation
  useEffect(() => {
    if (currentImageIndex !== null) {
      const preloadIndices = [
        currentImageIndex - 1,
        currentImageIndex + 1,
        currentImageIndex - 2,
        currentImageIndex + 2
      ].filter(i => i >= 0 && i < images.length)

      preloadIndices.forEach(index => {
        const img = new Image()
        img.src = images[index].src
      })
    }
  }, [currentImageIndex, images])

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentImageIndex !== null && currentImageIndex < images.length - 1) {
      nextImage()
    }
    if (isRightSwipe && currentImageIndex !== null && currentImageIndex > 0) {
      prevImage()
    }
  }

  // Navigate to next image
  const nextImage = () => {
    if (currentImageIndex !== null && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  // Navigate to previous image
  const prevImage = () => {
    if (currentImageIndex !== null && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (currentImageIndex === null) return
      
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          nextImage()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prevImage()
          break
        case 'Escape':
          e.preventDefault()
          setCurrentImageIndex(null)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentImageIndex, images])

  // Organize images into columns for masonry layout
  // For a clean, uniform gallery we render a simple responsive grid.

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SEO title="Tournament Gallery" description="View photos and highlights from previous ICCT tournaments." />

      <PageHero
        eyebrow="Gallery"
        title="Moments from the middle"
        description="Season-by-season photos, champions and highlights. Tap any photo to view it full screen or download it."
      />

      <section className="py-12 md:py-16">
        <div className="page-container">
          {/* Season tabs */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div
              role="tablist"
              aria-label="Gallery seasons"
              className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:inline-flex sm:rounded-2xl sm:border sm:border-white/10 sm:bg-ink-800 sm:p-1.5"
            >
              {SEASONS.map((sn) => {
                const active = sn.season === activeSeason
                const count = seasonCounts[sn.season] ?? 0
                const sub = count > 0 ? `${count} photos` : sn.status === 'upcoming' ? 'Coming soon' : 'Photos soon'
                return (
                  <button
                    key={sn.season}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="gallery-panel"
                    onClick={() => selectSeason(sn.season)}
                    className={`relative flex shrink-0 flex-col items-center rounded-xl border px-5 py-2.5 transition-colors sm:border-0 sm:px-7 ${
                      active ? 'border-gold text-ink-900' : 'border-white/10 bg-ink-800 text-white/70 hover:text-white sm:bg-transparent'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="gallery-tab"
                        className="absolute inset-0 rounded-xl bg-gold"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative font-display text-2xl leading-none">Season {sn.season}</span>
                    <span className={`relative mt-1 whitespace-nowrap text-[11px] font-bold uppercase tracking-wider ${active ? 'text-ink-900/70' : 'text-white/40'}`}>
                      {sn.edition} · {sub}
                    </span>
                  </button>
                )
              })}
            </div>
            {images.length > 0 && (
              <p className="text-sm text-muted">
                Showing <strong className="text-white">{images.length}</strong> photos from {season.edition}
              </p>
            )}
          </div>

          <div id="gallery-panel" role="tabpanel">
          {/* Season summary — only shows details that have been verified (see src/data/seasons.ts) */}
          {(season.champion || season.runnerUp || season.highlights.length > 0) && (
            <motion.div
              key={`summary-${activeSeason}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 grid gap-3 rounded-2xl border border-white/10 bg-ink-800 p-4 sm:grid-cols-2 lg:grid-cols-[1fr,1fr,1.4fr] md:p-5"
            >
              {season.champion && (
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold text-ink-900">
                    <Crown className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gold">Champions · {season.year}</p>
                    <p className="truncate font-display text-xl leading-tight text-white">{season.champion.team}</p>
                    {season.champion.place && <p className="truncate text-xs text-muted">{season.champion.place}</p>}
                  </div>
                </div>
              )}
              {season.runnerUp && (
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/80">
                    <Medal className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Runners-up</p>
                    <p className="truncate font-display text-xl leading-tight text-white">{season.runnerUp.team}</p>
                    {season.runnerUp.place && <p className="truncate text-xs text-muted">{season.runnerUp.place}</p>}
                  </div>
                </div>
              )}
              {season.highlights.length > 0 && (
                <ul className="space-y-1.5 text-sm text-white/80 sm:col-span-2 lg:col-span-1">
                  {season.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {h}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}

          {images.length === 0 ? (
            <motion.div
              key={`soon-${activeSeason}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-ink-800 px-6 py-12 text-center md:px-12 md:py-16"
            >
              <div className="pointer-events-none absolute inset-0 bg-stripes opacity-70" />
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
              <div className="relative">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold text-ink-900">
                  {season.status === 'upcoming' ? <Clock className="h-8 w-8" /> : <Camera className="h-8 w-8" />}
                </span>
                <p className="mt-6 text-eyebrow uppercase text-flame-light">{seasonLabel} · {season.edition}</p>
                {season.status === 'upcoming' ? (
                  <>
                    <h2 className="mt-2 text-4xl text-white md:text-5xl">Coming soon</h2>
                    <p className="mx-auto mt-3 max-w-md text-sm text-muted md:text-base">
                      Photos from {season.edition} will appear here after the tournament. Follow us on Instagram for the first look.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="mt-2 text-4xl text-white md:text-5xl">Photos being collected</h2>
                    <p className="mx-auto mt-3 max-w-md text-sm text-muted md:text-base">
                      {seasonLabel} photographs will be added here as soon as they are received by the organising team.
                    </p>
                  </>
                )}
                {DEFAULT_SEASON !== activeSeason && (seasonCounts[DEFAULT_SEASON] ?? 0) > 0 && (
                  <button type="button" onClick={() => selectSeason(DEFAULT_SEASON)} className="btn-outline mt-8">
                    Browse Season {DEFAULT_SEASON} photos
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            // Masonry: CSS columns keep each photo's real aspect ratio
            <div key={activeSeason} className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
              {images.map((image, index) => {
                const isLoaded = loadedImages.has(image.filename)
                return (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.35 }}
                    className="group relative mb-3 break-inside-avoid md:mb-4"
                  >
                  <button
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className="relative block w-full overflow-hidden rounded-xl bg-ink-800"
                    style={{ aspectRatio: `${image.width} / ${image.height}` }}
                    aria-label={`Open photo ${index + 1}`}
                  >
                    {!isLoaded && <div className="absolute inset-0 animate-pulse bg-ink-700" />}
                    <img
                      src={image.src}
                      alt={`${season.edition} photo ${index + 1}`}
                      loading="lazy"
                      onLoad={() => markImageLoaded(image.filename)}
                      className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity group-hover:opacity-100">
                      <Maximize2 className="h-4 w-4" />
                    </span>
                  </button>
                  <a
                    href={downloadUrl(image.src)}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity hover:bg-gold focus-visible:opacity-100 group-hover:opacity-100"
                    aria-label={`Download photo ${index + 1}`}
                    title="Download photo"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  </motion.div>
                )
              })}
            </div>
          )}
          </div>
        </div>
      </section>

      {/* Full-screen viewer */}
      <AnimatePresence>
        {currentImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/95"
            onClick={() => setCurrentImageIndex(null)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
          >
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white tabular-nums">
                {currentImageIndex + 1} / {images.length}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={downloadUrl(images[currentImageIndex].src)}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-gold px-4 text-sm font-bold text-ink-900 transition-colors hover:bg-gold-light"
                  aria-label="Download this photo"
                >
                  <Download className="h-4 w-4" /> <span className="hidden sm:inline">Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex(null)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {currentImageIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-3 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:flex"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
            )}
            {currentImageIndex < images.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-3 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:flex"
                aria-label="Next photo"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            )}

            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={images[currentImageIndex].src}
              alt={`${season.edition} photo ${currentImageIndex + 1}`}
              draggable={false}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[calc(100svh-140px)] max-w-[calc(100vw-32px)] rounded-lg object-contain sm:max-w-[calc(100vw-160px)]"
            />

            <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/50 sm:hidden">Swipe to browse</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Gallery
