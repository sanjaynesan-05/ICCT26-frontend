import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  id: string
  filename: string
  src: string
  width: number
  height: number
}

// Metaglob function - automatically discovers all images in gallery folder
const loadGalleryImages = (): GalleryImage[] => {
  // Use Vite's import.meta.glob to automatically discover all images
  const imageModules = import.meta.glob('/gallery/*.{jpg,jpeg,png,gif,webp}', {
    eager: true,
    query: '?url',
    import: 'default'
  })

  const images: GalleryImage[] = []

  // Process each discovered image
  Object.entries(imageModules).forEach(([path, src], index) => {
    // Extract filename from path
    const filename = path.split('/').pop() || `image-${index}.jpg`

    // Create image object with default dimensions (will be updated when loaded)
    images.push({
      id: String(index + 1),
      filename,
      src: src as string,
      width: 800, // Default width
      height: 600, // Default height
    })
  })

  return images
}

// Load images using metaglob
const GALLERY_IMAGES = loadGalleryImages()

const Gallery = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null)
  const [downloading, setDownloading] = useState(false)
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

  // Download image
  const downloadImage = (image: GalleryImage) => {
    setDownloading(true)
    const a = document.createElement('a')
    a.href = image.src
    a.download = image.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => setDownloading(false), 1000)
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
        case 'd':
        case 'D':
          e.preventDefault()
          if (currentImageIndex !== null) {
            downloadImage(images[currentImageIndex])
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentImageIndex, images])

  // Organize images into columns for masonry layout
  const getColumnLayout = () => {
    const columns = window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 3 : 4
    const cols: GalleryImage[][] = Array.from({ length: columns }, () => [])
    
    // Sort images by aspect ratio and distribute them
    const sortedImages = [...images].sort((a, b) => {
      const aRatio = a.width / a.height
      const bRatio = b.width / b.height
      return bRatio - aRatio
    })

    sortedImages.forEach((image, index) => {
      cols[index % columns].push(image)
    })

    return cols
  }

  const masonryColumns = getColumnLayout()
  
  // Use masonryColumns to avoid unused variable warning
  masonryColumns

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
              const aspectRatio = image.width / image.height
              let sizeClass = 'col-span-1 row-span-1'
              
              // Large items for wider images
              if (aspectRatio > 1.4 && index % 5 === 0) {
                sizeClass = 'md:col-span-2 md:row-span-1 col-span-2 row-span-1'
              }
              // Tall items for taller images
              else if (aspectRatio < 0.8 && index % 6 === 0) {
                sizeClass = 'md:row-span-2 md:col-span-1 row-span-2 col-span-1'
              }

              const isLoaded = loadedImages.has(image.filename)

              return (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className={`relative overflow-hidden rounded-lg cursor-pointer group ${sizeClass}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
                    {!isLoaded && (
                      <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <img
                      src={image.src}
                      alt={`Gallery image ${index + 1}`}
                      className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading="lazy"
                      onLoad={() => markImageLoaded(image.filename)}
                    />
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

            {/* Download Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                downloadImage(images[currentImageIndex])
              }}
              disabled={downloading}
              className="absolute top-4 right-20 z-10 w-12 h-12 flex items-center justify-center bg-accent hover:bg-yellow-500 text-black rounded-full transition-colors disabled:opacity-50"
              aria-label="Download image"
            >
              <Download className="w-5 h-5" />
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
              className="relative max-w-[90vw] max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={currentImageIndex}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={images[currentImageIndex].src}
                alt={`Gallery image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Gallery
