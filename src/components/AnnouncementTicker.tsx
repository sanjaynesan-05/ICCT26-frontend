import { motion } from 'framer-motion'

interface AnnouncementTickerProps {
  announcements: string[]
}

const AnnouncementTicker = ({ announcements }: AnnouncementTickerProps) => {
  const duplicatedAnnouncements = [...announcements, ...announcements]

  return (
    <div className="bg-accent py-3 overflow-hidden">
      <motion.div
        className="flex space-x-12 whitespace-nowrap"
        animate={{
          x: [0, '-50%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 25,
            ease: 'linear',
          },
        }}
      >
        {duplicatedAnnouncements.map((announcement, index) => (
          <span
            key={index}
            className="font-subheading font-semibold text-primary text-lg inline-flex items-center"
          >
            {announcement}
            <span className="mx-6 text-primary">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default AnnouncementTicker
