import { useState } from 'react'

// Sponsor images - Add or remove sponsor logos here by updating the file paths
// Simply add new image paths to the array when you update the sponsors folder
const SPONSOR_IMAGES = [
  '/sponsor/Johnpolimers.jpg',
  '/sponsor/JSInfotech.png',
  '/sponsor/SPORTSLANDLOGO.jpg',
  '/sponsor/dicta.jpeg',
  '/sponsor/StPetersSchool.png',
  '/sponsor/SASHAINC.jpg',
  '/sponsor/NEWSYSTEM.jpg',
  '/sponsor/Alpha.jpg',
  '/sponsor/jesustransports.png',
  '/sponsor/kafeeg.png',
  '/sponsor/msengineers.png',
  '/sponsor/pktraders.png',
  '/sponsor/SKAMBULANCE.jpg',
  '/sponsor/LifeEvents.png',
  '/sponsor/adrievents.webp',
  '/sponsor/agalyapets.webp',
  '/sponsor/galaxylabsolutions.webp',
  '/sponsor/joycatering.jpeg',
  '/sponsor/jvdandkalani.webp',
  '/sponsor/williamconcepts.webp',
  '/sponsor/gbhospital.jpeg',
  '/sponsor/candlelight.webp',
  '/sponsor/jkdental.webp',

]

const ImageCarousel = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [showModal, setShowModal] = useState(false)
  // Create a much longer continuous strip by repeating images multiple times
  const repeatedImages = Array(5).fill(SPONSOR_IMAGES).flat()

  return (
    <div className="w-full bg-primary overflow-hidden relative py-8">
      <div className="container mx-auto px-4 mb-6">
        <h2 className="font-heading text-3xl md:text-4xl text-accent text-center">CO SPONSORS</h2>
      </div>
      {/* Continuous fast scrolling strip of sponsor images */}
      <div className="overflow-hidden relative">
        <div
          className="flex gap-0 h-40"
          style={{
            animation: 'scroll 45s linear infinite',
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
        >
          {repeatedImages.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-40 h-40 relative group overflow-hidden bg-white/5 border border-accent/20 rounded-lg flex items-center justify-center"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={image}
                alt={`Sponsor ${index + 1}`}
                className="w-full h-full object-contain p-3"
              />
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Fade overlay on edges for smooth effect */}
        <div className="absolute top-0 left-0 w-20 h-40 bg-gradient-to-r from-primary to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-20 h-40 bg-gradient-to-l from-primary to-transparent pointer-events-none z-10" />
      </div>

      {/* View More Button */}
      <div className="container mx-auto px-4 mt-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-1 text-xs font-medium text-accent bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded transition-colors duration-200"
        >
          View More
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-primary border border-accent/20 rounded-lg p-8 w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading text-2xl text-accent">All Sponsors</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-accent hover:text-accent/70 text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Grid of Sponsor Logos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {SPONSOR_IMAGES.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square relative group overflow-hidden bg-white/5 border border-accent/20 rounded-lg flex items-center justify-center hover:border-accent/40 transition-colors"
                >
                  <img
                    src={image}
                    alt={`Sponsor ${index + 1}`}
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageCarousel


