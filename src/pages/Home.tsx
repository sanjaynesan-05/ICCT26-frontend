import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Countdown from '../components/Countdown'
import RegistrationCountdown from '../components/RegistrationCountdown'
import ImageCarousel from '../components/ImageCarousel'
import { ANNOUNCEMENTS, HERO_SECTION, TOURNAMENT_HIGHLIGHTS } from '../data/home'
import { SOCIAL_LINKS } from '../data/contact'
import { apiService } from '../services/api'

const Home = () => {
  // State for teams count
  const [teamsCount, setTeamsCount] = useState<number>(0)
  const [loadingCount, setLoadingCount] = useState<boolean>(true)

  // Fetch teams count from backend
  useEffect(() => {
    const fetchTeamsCount = async () => {
      try {
        setLoadingCount(true)
        const response = await apiService.getAllTeams()
        const teams = response.teams || response.data || response
        const count = Array.isArray(teams) ? teams.length : 0
        setTeamsCount(count)
      } catch (error) {
        console.error('Failed to fetch teams count:', error)
        // Keep default value of 0 on error
      } finally {
        setLoadingCount(false)
      }
    }

    fetchTeamsCount()
  }, [])

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
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-heading text-2xl md:text-3xl lg:text-4xl text-white mb-4 tracking-wider"
            >
              CSI St. Peter's Church,Youth Fellowship
            </motion.h2>
            <div className="flex items-center justify-center mb-6">
              <motion.img
                src="/churchlogo.png"
                alt="Church Logo"
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mr-4 md:mr-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
              <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-accent tracking-wider">
                {HERO_SECTION.mainTitle}
              </h1>
              <motion.img
                src="/adonailogo.png"
                alt="Adonai Logo"
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 ml-4 md:ml-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </div>
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

      {/* Image Carousel - Full Width Continuous Loop */}
      <ImageCarousel announcements={ANNOUNCEMENTS} />

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
              // Use dynamic count for Teams Registered
              const displayValue = highlight.title === 'Teams Registered' 
                ? (loadingCount ? 'Loading...' : `${teamsCount} TEAMS`)
                : highlight.value;
              
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
                    {displayValue}
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
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-b from-bg-start via-primary to-secondary">
        <div className="container mx-auto max-w-4xl">
          {/* Glass effect card container */}
          <div className="glass-effect rounded-2xl p-12 glow-border relative overflow-hidden">
            {/* Animated background effect */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="w-full h-full bg-gradient-to-br from-pink-500/10 via-blue-500/10 to-purple-500/10 animate-pulse"></div>
            </div>
            
            {/* Content */}
            <motion.h2
              className="font-heading text-4xl md:text-5xl mb-12 text-center relative z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 120 }}
            >
              <span className="inline-block bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg animate-gradient-x">
                Follow Us
              </span>
            </motion.h2>
            
            <div className="flex justify-center gap-8 md:gap-12 mb-12 flex-wrap relative z-10">
              {SOCIAL_LINKS.map((social, idx) => {
                const IconComponent = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, rotate: 8, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${social.color} flex items-center justify-center shadow-lg hover:shadow-2xl transition-all group border-4 border-accent/30 animate-bounce-slow`}
                    aria-label={social.name}
                    style={{ boxShadow: '0 0 24px 4px rgba(236,72,153,0.15)' }}
                  >
                    <motion.div
                      whileHover={{ y: -6, scale: 1.25 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <IconComponent className="w-10 h-10 text-white group-hover:scale-125 transition-transform" />
                    </motion.div>
                  </motion.a>
                )
              })}
            </div>
            
            <motion.p
              className="text-center text-gray-300 font-subheading relative z-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Connect with us on social media for updates and announcements
            </motion.p>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Home
