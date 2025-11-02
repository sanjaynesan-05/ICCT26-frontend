import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, MessageCircle, Instagram, Facebook } from 'lucide-react'

const Contact = () => {
  const organizers = [
    {
      role: 'Tournament Convenor',
      name: 'Mr. John Samuel',
      phone: '+91 98765 43210',
      whatsapp: '919876543210',
      email: 'convenor@icct26.org',
    },
    {
      role: 'Secretary',
      name: 'Mr. David Kumar',
      phone: '+91 98765 43211',
      whatsapp: '919876543211',
      email: 'secretary@icct26.org',
    },
    {
      role: 'Treasurer',
      name: 'Mr. Joseph Raj',
      phone: '+91 98765 43212',
      whatsapp: '919876543212',
      email: 'treasurer@icct26.org',
    },
  ]

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/icct26',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/icct26',
      color: 'from-blue-600 to-blue-400',
    },
  ]

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
          {/* Organizers Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="font-heading text-4xl text-accent mb-8 text-center">
              Tournament Organizers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {organizers.map((organizer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="glass-effect rounded-xl p-6 glow-border"
                >
                  <h3 className="font-heading text-xl text-accent mb-3">
                    {organizer.role}
                  </h3>
                  <p className="font-subheading font-bold text-white text-lg mb-4">
                    {organizer.name}
                  </p>
                  <div className="space-y-3">
                    <a
                      href={`tel:${organizer.phone}`}
                      className="flex items-center gap-3 text-gray-300 hover:text-accent transition-colors group"
                    >
                      <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-subheading">{organizer.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${organizer.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition-colors group"
                    >
                      <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-subheading">WhatsApp</span>
                    </a>
                    <a
                      href={`mailto:${organizer.email}`}
                      className="flex items-center gap-3 text-gray-300 hover:text-accent transition-colors group"
                    >
                      <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-subheading text-sm">{organizer.email}</span>
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
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16"
          >
            {/* Social Media Links */}
            <div className="glass-effect rounded-xl p-8 glow-border h-full">
              <h3 className="font-heading text-3xl text-accent mb-8 text-center">
                Follow Us
              </h3>
              <div className="flex justify-center gap-8 mb-8">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${link.color} flex items-center justify-center shadow-lg hover:shadow-2xl transition-all group`}
                    aria-label={link.name}
                  >
                    <link.icon className="w-10 h-10 text-white group-hover:scale-125 transition-transform" />
                  </motion.a>
                ))}
              </div>
              <p className="text-center text-gray-300 font-subheading">
                Connect with us on social media for updates and announcements
              </p>
            </div>

            {/* Venue Information */}
            <div className="glass-effect rounded-xl p-6 glow-border">
              <h3 className="font-heading text-2xl text-accent mb-4">
                Venue Location
              </h3>
              <div className="flex items-start gap-3 text-gray-300 mb-4">
                <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="font-subheading font-semibold text-white mb-1">
                    CSI St. Peter's Church
                  </p>
                  <p className="font-subheading">
                    1234 Church Street, R.S. Puram<br />
                    Coimbatore, Tamil Nadu 641002<br />
                    India
                  </p>
                </div>
              </div>

              {/* Google Map Embed */}
              <div className="w-full h-64 rounded-lg overflow-hidden mt-4 border-2 border-accent/30">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.3384789234567!2d76.9558!3d11.0168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAxJzAwLjUiTiA3NsKwNTcnMjAuOSJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="CSI St. Peter's Church Location"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Contact
