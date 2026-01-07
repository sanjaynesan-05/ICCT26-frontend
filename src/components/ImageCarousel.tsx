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

]

const ImageCarousel = () => {
  const [isHovered, setIsHovered] = useState(false)
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
    </div>
  )
}

export default ImageCarousel


