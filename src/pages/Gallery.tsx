import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  id: string
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

  return CLOUDINARY_URLS.map((src, idx) => {
    const filename = src.split('/').pop() || `image-${idx + 1}`
    return { id: String(idx + 1), filename, src, width: 800, height: 600 }
  })
}

// Load images using metaglob
const GALLERY_IMAGES = loadGalleryImages()

const Gallery = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null)
  const [images, setImages] = useState<GalleryImage[]>(GALLERY_IMAGES)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Function to get actual image dimensions
  const updateImageDimensions = (filename: string, width: number, height: number) => {
    setImages(prevImages =>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-bg-start via-primary to-bg-end py-20 px-4"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12 text-center"
        >
          <h1 className="font-heading text-5xl md:text-6xl text-accent mb-4">
            Gallery
          </h1>
          <p className="font-subheading text-lg text-gray-300">
            Tournament Photo Gallery
          </p>
        </motion.div>

        {/* Error Message */}
        {false && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect border-2 border-red-500/30 rounded-xl p-6 mb-8 text-center"
          >
            <p className="text-red-400 font-semibold mb-4">Error loading gallery</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-accent hover:bg-yellow-500 text-black rounded-lg transition-colors font-semibold"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {false && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-300 font-subheading">Loading gallery...</p>
          </div>
        )}

        {/* Empty State */}
        {images.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-400 font-subheading text-lg mb-4">No images found in gallery folder</p>
            <p className="text-gray-500 text-sm mb-4">Add images to /public/gallery/ folder</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-accent hover:bg-yellow-500 text-black rounded-lg transition-colors font-semibold"
            >
              Refresh Gallery
            </button>
          </div>
        )}

        {/* Image Grid */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-max"
          >
            {images.map((image, index) => {
                const isLoaded = loadedImages.has(image.filename)

                return (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="relative overflow-hidden rounded-lg cursor-pointer group"
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900">
                      <div className="aspect-video w-full flex items-center justify-center overflow-hidden relative">
                        {!isLoaded && (
                          <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        <img
                          src={image.src}
                          alt={`Gallery image ${index + 1}`}
                          className={`max-w-full max-h-full object-contain transition-all duration-300 ${
                            isLoaded ? 'opacity-100' : 'opacity-0'
                          }`}
                          loading="lazy"
                          onLoad={() => markImageLoaded(image.filename)}
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Click to view
                      </div>
                    </div>
                    {/* Image counter badge */}
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {index + 1}
                    </div>
                  </motion.div>
                )
              })}
          </motion.div>
        )}
      </div>

      {/* Fullscreen Image Viewer */}
      <AnimatePresence>
        {currentImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setCurrentImageIndex(null)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close Button */}
            <button
              onClick={() => setCurrentImageIndex(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close gallery"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/10 rounded-lg">
              <p className="text-white font-semibold">
                {currentImageIndex + 1} / {images.length}
              </p>
            </div>

            {/* Navigation Buttons */}
            {currentImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
            )}

            {currentImageIndex < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            )}

            {/* Main Image */}
            <motion.div
              className="relative p-6 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div className="bg-black/0 rounded-md flex items-center justify-center">
                <motion.img
                  key={currentImageIndex}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  src={images[currentImageIndex].src}
                  alt={`Gallery image ${currentImageIndex + 1}`}
                  draggable={false}
                  className="w-auto h-auto object-contain"
                  style={{
                    maxWidth: 'calc(100vw - 160px)',
                    maxHeight: 'calc(100vh - 160px)'
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Gallery
