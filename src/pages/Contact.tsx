import { motion } from 'framer-motion'
import { Phone, MapPin, MessageCircle } from 'lucide-react'
import { ORGANIZERS, SOCIAL_LINKS, VENUE, DEVELOPER } from '../data/contact'

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-4 lg:px-8 bg-gradient-to-b from-bg-start via-primary to-secondary"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-6xl md:text-7xl text-accent mb-4">
            Contact Us
          </h1>
          <p className="font-subheading text-xl text-gray-300">
            Get in touch with us for any queries or assistance
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Organizers Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="font-heading text-4xl text-accent mb-8 text-center">
              Tournament Organizers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {ORGANIZERS.map((organizer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex flex-col items-start bg-gradient-to-r from-primary/60 to-secondary/60 rounded-xl p-6 shadow-lg border border-accent/30"
                >
                  <h3 className="font-heading text-lg text-accent mb-1">
                    {organizer.role}
                  </h3>
                  <p className="font-subheading font-bold text-white text-base mb-2">
                    {organizer.name}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <a
                      href={`tel:${organizer.phone}`}
                      className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors group"
                    >
                      <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="font-subheading text-sm">{organizer.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${organizer.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors group"
                    >
                      <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="font-subheading text-sm">WhatsApp</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Media & Venue Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row gap-8 mt-16"
          >
            {/* Venue Information - comes first on mobile */}
            <div className="glass-effect rounded-xl p-6 glow-border order-1 md:order-none w-full md:w-1/2 flex flex-col justify-between">
              <h3 className="font-heading text-2xl text-accent mb-4">
                Venue Location
              </h3>
              <div className="flex items-start gap-3 text-gray-300 mb-4">
                <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="font-subheading font-semibold text-white mb-1">
                    {VENUE.name}
                  </p>
                  <p className="font-subheading">
                    {VENUE.address}<br />
                    {VENUE.city}, {VENUE.state} {VENUE.zipCode}<br />
                    {VENUE.country}
                  </p>
                </div>
              </div>

              {/* Google Map Embed */}
              <div className="w-full h-64 rounded-lg overflow-hidden mt-4 border-2 border-accent/30">
                <iframe
                  src={VENUE.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={VENUE.name + ' Location'}
                ></iframe>
              </div>
            </div>

            {/* Social Media Links - comes after map on mobile */}
            <div className="glass-effect rounded-xl p-8 glow-border order-2 md:order-none w-full md:w-1/2 flex flex-col justify-between relative overflow-hidden">
              {/* Animated background effect */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <div className="w-full h-full bg-gradient-to-br from-pink-500/10 via-blue-500/10 to-purple-500/10 animate-pulse"></div>
              </div>
              <motion.h3
                className="font-heading text-3xl text-accent mb-8 text-center relative z-10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120 }}
              >
                <span className="inline-block bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg animate-gradient-x">Follow Us</span>
              </motion.h3>
              <div className="flex justify-center gap-8 mb-8 flex-1 items-center h-64 relative z-10">
                {SOCIAL_LINKS.map((link, idx) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, rotate: 8, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${link.color} flex items-center justify-center shadow-lg hover:shadow-2xl transition-all group border-4 border-accent/30 animate-bounce-slow`}
                    aria-label={link.name}
                    style={{ boxShadow: '0 0 24px 4px rgba(236,72,153,0.15)' }}
                  >
                    <motion.div
                      whileHover={{ y: -6, scale: 1.25 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <link.icon className="w-10 h-10 text-white group-hover:scale-125 transition-transform" />
                    </motion.div>
                  </motion.a>
                ))}
              </div>
              <motion.p
                className="text-center text-gray-300 font-subheading mt-auto relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Connect with us on social media for updates and announcements
              </motion.p>
            </div>
          </motion.div>

          {/* Website Developer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <div className="flex flex-col items-center bg-gradient-to-r from-primary/60 to-secondary/60 rounded-xl p-6 shadow-lg border border-accent/30">
              <h3 className="font-heading text-lg text-accent mb-1">
                {DEVELOPER.role}
              </h3>
              <p className="font-subheading font-bold text-white text-base mb-4">
                {DEVELOPER.name}
              </p>
              <div className="flex items-center gap-4">
                {DEVELOPER.socials.map((social, idx) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors group"
                    aria-label={social.name}
                    title={social.name}
                  >
                    <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Contact
