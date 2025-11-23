import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  public_id: string
  url: string
  secure_url: string
  filename: string
  width: number
  height: number
  bytes: number
  uploaded_at: string
  format: string
}

interface ApiResponse {
  success: boolean
  count: number
  images: GalleryImage[]
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null)
  const [downloading, setDownloading] = useState(false)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  // Fetch images from API
  const fetchImages = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery/collection/images?limit=100`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: ApiResponse = await response.json()
      
      if (data.success && data.images) {
        setImages(data.images)
      } else {
        throw new Error('Invalid API response format')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch images')
      console.error('Error fetching images:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  // Download image
  const downloadImage = (image: GalleryImage) => {
    setDownloading(true)
    const a = document.createElement('a')
    a.href = image.secure_url
    a.download = image.filename
    a.target = '_blank'
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
      
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'Escape') setCurrentImageIndex(null)
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentImageIndex, images.length])

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

        {/* Refresh Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={fetchImages}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-yellow-500 text-black rounded-lg transition-colors disabled:opacity-50 font-semibold"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Gallery
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect border-2 border-red-500/30 rounded-xl p-6 mb-8 text-center"
          >
            <p className="text-red-400 font-semibold mb-4">Error: {error}</p>
            <button
              onClick={fetchImages}
              className="px-6 py-2 bg-accent hover:bg-yellow-500 text-black rounded-lg transition-colors font-semibold"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-12 h-12 text-accent animate-spin mb-4" />
            <p className="text-gray-300 font-subheading">Loading gallery...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && images.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-400 font-subheading text-lg mb-4">No images found</p>
            <button
              onClick={fetchImages}
              className="px-6 py-2 bg-accent hover:bg-yellow-500 text-black rounded-lg transition-colors font-semibold"
            >
              Reload
            </button>
          </div>
        )}

        {/* Image Grid */}
        {!loading && images.length > 0 && (
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

              return (
                <motion.div
                  key={image.public_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className={`relative overflow-hidden rounded-lg cursor-pointer group ${sizeClass}`}
                  onClick={() => setCurrentImageIndex(images.indexOf(image))}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
                    <img
                      src={image.secure_url}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
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
          >
            {/* Close Button */}
            <button
              onClick={() => setCurrentImageIndex(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
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
              className="absolute top-4 right-20 z-10 flex items-center gap-2 px-4 py-2 bg-accent hover:bg-yellow-500 text-black rounded-lg transition-colors disabled:opacity-50 font-semibold"
            >
              <Download className="w-5 h-5" />
              Download
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/10 rounded-lg">
              <p className="text-white font-semibold">
                {currentImageIndex + 1} / {images.length}
              </p>
            </div>

            {/* Previous Button */}
            {currentImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
            )}

            {/* Next Button */}
            {currentImageIndex < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={currentImageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={images[currentImageIndex].secure_url}
              alt={`Gallery image ${currentImageIndex + 1}`}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Gallery
