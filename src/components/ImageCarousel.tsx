import { motion } from 'framer-motion'
import type { Announcement } from '../types'

interface ImageCarouselProps {
  announcements: Announcement[]
}

const ImageCarousel = ({ announcements }: ImageCarouselProps) => {
  // Create a much longer continuous strip by repeating images multiple times
  const repeatedImages = Array(15).fill(announcements).flat()

  return (
    <div className="w-full bg-primary overflow-hidden relative">
      {/* Continuous fast scrolling strip of images */}
      <motion.div
        className="flex gap-0 h-36"
        animate={{
          x: [0, -3840], // Full scroll distance
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 20, // Fast speed - 20 seconds for full cycle
            ease: 'linear',
          },
        }}
      >
        {repeatedImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-80 h-36 relative group overflow-hidden"
          >
            <img
              src={image.image}
              alt={image.text}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Text overlay on hover */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ y: 10 }}
              whileHover={{ y: 0 }}
            >
              <div className="flex items-start gap-2">
                <span className="text-2xl flex-shrink-0">{image.emoji}</span>
                <p className="font-subheading text-sm font-semibold line-clamp-3">
                  {image.text}
                </p>
              </div>
            </motion.div>
          </div>
        ))}
      </motion.div>

      {/* Fade overlay on edges for smooth effect */}
      <div className="absolute top-0 left-0 w-16 h-36 bg-gradient-to-r from-primary to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 w-16 h-36 bg-gradient-to-l from-primary to-transparent pointer-events-none z-10" />
    </div>
  )
}

export default ImageCarousel


