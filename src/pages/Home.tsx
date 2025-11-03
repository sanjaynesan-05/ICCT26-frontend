import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube } from 'lucide-react'
import Countdown from '../components/Countdown'
import RegistrationCountdown from '../components/RegistrationCountdown'
import AnnouncementTicker from '../components/AnnouncementTicker'
import { ANNOUNCEMENTS, HERO_SECTION, TOURNAMENT_HIGHLIGHTS } from '../data/home'

const Home = () => {
  // Convert ANNOUNCEMENTS to array of strings for ticker
  const announcementTexts = ANNOUNCEMENTS.map(a => a.text)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-start via-primary to-bg-end">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1920')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        </div>

        {/* Floating Cricket Ball */}
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 rounded-full bg-red-600 opacity-30 blur-xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute bottom-20 left-10 w-24 h-24 rounded-full bg-accent opacity-20 blur-xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-20 pb-16 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-accent tracking-wider mb-6">
              {HERO_SECTION.mainTitle}
            </h1>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-white mb-4">
              {HERO_SECTION.subTitle}
            </h2>
            <p className="font-subheading text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12">
              {HERO_SECTION.tagline}
            </p>
            <p className="font-body text-lg md:text-xl text-gray-300 mb-8">
              {HERO_SECTION.description}
            </p>
          </motion.div>

          {/* Countdowns */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
              {/* Match Countdown */}
              <div className="flex flex-col items-center">
                <h3 className="font-subheading text-lg md:text-xl text-accent mb-6 uppercase tracking-wider">
                  Match Countdown
                </h3>
                <Countdown />
              </div>
              
              {/* Registration Countdown */}
              <div className="flex flex-col items-center">
                <h3 className="font-subheading text-lg md:text-xl text-blue-400 mb-6 uppercase tracking-wider">
                  Registration Countdown
                </h3>
                <RegistrationCountdown />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Announcement Ticker */}
      <AnnouncementTicker announcements={announcementTexts} />

      {/* Highlights Section */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-5xl md:text-6xl text-center text-accent mb-16"
          >
            Tournament Highlights
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TOURNAMENT_HIGHLIGHTS.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass-effect glow-border rounded-2xl p-8 text-center group cursor-pointer"
                >
                  <Icon className={`mb-6 block w-12 h-12 mx-auto ${highlight.color}`} />
                  <h3 className="font-subheading text-lg text-gray-300 mb-3">
                    {highlight.title}
                  </h3>
                  <p className="font-body text-xl text-white font-bold">
                    {highlight.value}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-b from-transparent to-secondary/50">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-5xl md:text-6xl text-accent mb-8"
          >
            About ICCT26
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg md:text-xl text-gray-300 leading-relaxed mb-6"
          >
            Welcome to the ICCT26 Cricket Tournament, the most thrilling Red Tennis Ball cricket championship 
            organized by CSI St. Peter's Church, Coimbatore. Join us for an unforgettable experience of sportsmanship, 
            competition, and glory.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="font-body text-lg md:text-xl text-gray-300 leading-relaxed"
          >
            With exciting matches, talented teams, and amazing prizes, ICCT26 promises to be the cricket event of the year!
          </motion.p>
        </div>
      </section>

      {/* Follow Us Section */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-5xl md:text-6xl text-accent mb-12"
          >
            Follow Us
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-8 md:gap-12"
          >
            {/* Facebook */}
            <motion.a
              href="https://facebook.com/icct26"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center group"
            >
              <div className="glass-effect glow-border rounded-2xl p-6 group-hover:shadow-lg transition-all duration-300">
                <Facebook className="w-12 h-12 text-blue-500 group-hover:text-blue-400 transition-colors" />
              </div>
              <span className="text-gray-300 font-subheading text-sm mt-4 group-hover:text-accent transition-colors">
                Facebook
              </span>
            </motion.a>
            {/* Instagram */}
            <motion.a
              href="https://www.instagram.com/st_peters_youth_fellowship?igsh=MWZtZDd3MWc3ZHYxOQ=="
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center group"
            >
              <div className="glass-effect glow-border rounded-2xl p-6 group-hover:shadow-lg transition-all duration-300">
                <Instagram className="w-12 h-12 text-pink-500 group-hover:text-pink-400 transition-colors" />
              </div>
              <span className="text-gray-300 font-subheading text-sm mt-4 group-hover:text-accent transition-colors">
                Instagram
              </span>
            </motion.a>
            {/* YouTube */}
            <motion.a
              href="https://youtube.com/icct26"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center group"
            >
              <div className="glass-effect glow-border rounded-2xl p-6 group-hover:shadow-lg transition-all duration-300">
                <Youtube className="w-12 h-12 text-red-500 group-hover:text-red-400 transition-colors" />
              </div>
              <span className="text-gray-300 font-subheading text-sm mt-4 group-hover:text-accent transition-colors">
                YouTube
              </span>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Home
