import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Maximize2, Camera } from 'lucide-react'
import SEO from '../components/SEO'
import { PageHero } from '../components/ui'

/**
 * Seasons shown as tabs. To publish a season's photos, add its Cloudinary
 * links to `urls` — the tab switches from "coming soon" to the photo grid.
 */
const SEASONS = [
  { id: 's2', label: 'Season 2', edition: "ICCT '25" },
  { id: 's3', label: 'Season 3', edition: "ICCT '26" },
] as const

type SeasonId = (typeof SEASONS)[number]['id']

interface GalleryImage {
  id: string
  season: SeasonId
  filename: string
  src: string
  width: number
  height: number
}

// Load images directly from the Cloudinary links you provided (preserves order).
const loadGalleryImages = (): GalleryImage[] => {
  const CLOUDINARY_URLS = [
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257447/FB_IMG_1764004248243_nchaj5.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257451/FB_IMG_1764004301211_iqeh7i.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257452/FB_IMG_1764004308540_daecqo.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257453/FB_IMG_1764004331596_z3sjto.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257453/FB_IMG_1764004336507_gz1gae.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257453/FB_IMG_1764004341831_ymzl9j.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257453/FB_IMG_1764004327055_his2vj.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257452/FB_IMG_1764004314928_rkce2o.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257452/FB_IMG_1764004305889_p4zk7i.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257452/FB_IMG_1764004295841_dzgnbz.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257447/DSC07329-min_eryezp.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257447/DSC05672-min_gccrmp.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257447/DSC05673-min_cc216i.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257448/FB_IMG_1764004209103_i12pou.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257450/FB_IMG_1764004229577_isw4dd.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257448/FB_IMG_1764004253832_bahvx9.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257451/FB_IMG_1764004298138_zdich5.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257448/FB_IMG_1764004213900_h59pxc.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257448/FB_IMG_1764004257657_zsnnvk.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257449/FB_IMG_1764004216534_xjd28r.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257449/FB_IMG_1764004264240_vrjkut.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257449/FB_IMG_1764004260958_ezcb5w.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257450/FB_IMG_1764004225526_sbk2xr.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257450/FB_IMG_1764004269042_pdsy0f.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257450/FB_IMG_1764004272390_mouhft.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257450/FB_IMG_1764004276157_gjigeq.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257450/FB_IMG_1764004280397_ufphwf.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257451/FB_IMG_1764004283980_rktg28.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257451/FB_IMG_1764004236901_mgjyqa.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257451/FB_IMG_1764004293412_os7eql.jpg',
    'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257451/FB_IMG_1764004286739_vofuif.jpg',
  ]

  // Season 3 (ICCT '26) photos go here when they are ready
  const SEASON_3_URLS: string[] = []

  const toImages = (season: SeasonId, urls: string[]): GalleryImage[] =>
    urls.map((src, idx) => {
      const filename = src.split('/').pop() || `${season}-image-${idx + 1}`
      return { id: `${season}-${idx + 1}`, season, filename, src, width: 800, height: 600 }
    })

  return [...toImages('s2', CLOUDINARY_URLS), ...toImages('s3', SEASON_3_URLS)]
}

// Load images using metaglob
const GALLERY_IMAGES = loadGalleryImages()

const Gallery = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null)
  const [allImages, setAllImages] = useState<GalleryImage[]>(GALLERY_IMAGES)
  const [activeSeason, setActiveSeason] = useState<SeasonId>('s2')
  // Everything below (grid, viewer, swipe, keys) works on the selected season only
  const images = useMemo(() => allImages.filter((img) => img.season === activeSeason), [allImages, activeSeason])
  const seasonCounts = useMemo(
    () => Object.fromEntries(SEASONS.map((s) => [s.id, allImages.filter((img) => img.season === s.id).length])) as Record<SeasonId, number>,
    [allImages]
  )
  const season = SEASONS.find((s) => s.id === activeSeason)!

  const selectSeason = (id: SeasonId) => {
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
        description="Photos from previous ICCT seasons. Pick a season, then tap any photo to view it full screen."
      />

      <section className="py-12 md:py-16">
        <div className="page-container">
          {/* Season tabs */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div role="tablist" aria-label="Gallery seasons" className="inline-flex w-full rounded-2xl border border-white/10 bg-ink-800 p-1.5 sm:w-auto">
              {SEASONS.map((s) => {
                const active = s.id === activeSeason
                const count = seasonCounts[s.id]
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="gallery-panel"
                    onClick={() => selectSeason(s.id)}
                    className={`relative flex flex-1 flex-col items-center rounded-xl px-5 py-2.5 transition-colors sm:flex-none sm:px-8 ${
                      active ? 'text-ink-900' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="gallery-tab"
                        className="absolute inset-0 rounded-xl bg-gold"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative font-display text-2xl leading-none">{s.label}</span>
                    <span className={`relative mt-1 text-[11px] font-bold uppercase tracking-wider ${active ? 'text-ink-900/70' : 'text-white/40'}`}>
                      {s.edition} · {count > 0 ? `${count} photos` : 'Soon'}
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
          {images.length === 0 ? (
            <motion.div
              key={`soon-${activeSeason}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-ink-800 px-6 py-14 text-center md:px-12 md:py-20"
            >
              <div className="pointer-events-none absolute inset-0 bg-stripes opacity-70" />
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
              <div className="relative">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold text-ink-900">
                  <Camera className="h-8 w-8" />
                </span>
                <p className="mt-6 text-eyebrow uppercase text-flame-light">{season.edition}</p>
                <h2 className="mt-2 text-4xl text-white md:text-5xl">{season.label} photos are coming soon</h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-muted md:text-base">
                  We're sorting through the best moments from {season.edition}. Check back soon, or follow us on Instagram for
                  the first look.
                </p>
                {seasonCounts.s2 > 0 && activeSeason !== 's2' && (
                  <button type="button" onClick={() => selectSeason('s2')} className="btn-outline mt-8">
                    Browse Season 2 photos
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
                  <motion.button
                    type="button"
                    key={image.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.35 }}
                    onClick={() => setCurrentImageIndex(index)}
                    className="group relative mb-3 block w-full overflow-hidden rounded-xl bg-ink-800 break-inside-avoid md:mb-4"
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
                  </motion.button>
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
              <button
                type="button"
                onClick={() => setCurrentImageIndex(null)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
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
              alt={`ICCT photo ${currentImageIndex + 1}`}
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
