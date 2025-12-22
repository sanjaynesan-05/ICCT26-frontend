import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Countdown from '../components/Countdown'
import RegistrationCountdown from '../components/RegistrationCountdown'
import ImageCarousel from '../components/ImageCarousel'
import { HERO_SECTION, TOURNAMENT_HIGHLIGHTS } from '../data/home'
import { SOCIAL_LINKS } from '../data/contact'
import { apiService } from '../services/api'
import titleSponsorLogo from '../assets/sponsor/0 Title_Sponsors.png'

const Home = () => {
  // State for teams count
  const [approvedTeamsCount, setApprovedTeamsCount] = useState<number>(0)
  const [loadingCount, setLoadingCount] = useState<boolean>(true)
  const MAX_TEAMS = 24

  // Fetch teams count from backend (same as Teams page)
  useEffect(() => {
    const fetchTeamsCount = async () => {
      try {
        setLoadingCount(true)
        // Fetch confirmed teams (same as Teams page)
        const response = await apiService.getAdminTeams('confirmed')
        const teamsData = response.data || response.teams || response
        const count = Array.isArray(teamsData) ? teamsData.length : 0
        setApprovedTeamsCount(count)
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
          <div className="absolute inset-0 bg-[url('/stadium.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
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

          {/* Register Now Button - Mobile Only */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="md:hidden mb-8"
          >
            <Link
              to="/registration"
              className="inline-block btn-gold text-sm transition-shadow"
              style={{ boxShadow: '0 0 18px rgba(255,214,92,0.32)' }}
            >
              Register Now
            </Link>
          </motion.div>

          {/* Countdowns with Title Sponsor - Reorganized for Mobile */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            {/* Title Sponsor - Appears first on mobile */}
            <div className="lg:hidden mb-8">
              <div className="flex flex-col items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex flex-col items-center"
                >
                  <motion.h3 
                    className="font-heading text-4xl md:text-5xl text-accent mb-4 tracking-wider uppercase font-bold"
                    animate={{ 
                      textShadow: [
                        '0 0 10px rgba(255, 204, 41, 0.5)',
                        '0 0 20px rgba(255, 204, 41, 0.8)',
                        '0 0 30px rgba(255, 204, 41, 0.6)',
                        '0 0 10px rgba(255, 204, 41, 0.5)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Title Sponsor
                  </motion.h3>
                  <div className="bg-white/10 border-2 border-accent/30 rounded-xl p-4 max-w-xs hover:border-accent/60 transition-all duration-300 scale-90">
                    <img
                      src={titleSponsorLogo}
                      alt="Title Sponsors"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 items-center">
              {/* Match Countdown - Left */}
              <div className="flex flex-col items-center">
                <h3 className="font-subheading text-lg md:text-xl text-blue-400 mb-6 uppercase tracking-wider">
                  Match Countdown
                </h3>
                <Countdown />
              </div>
              
              {/* Title Sponsor - Middle (Desktop only) */}
              <div className="hidden lg:flex flex-col items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex flex-col items-center"
                >
                  <motion.h3 
                    className="font-heading text-4xl md:text-5xl text-accent mb-4 tracking-wider uppercase font-bold"
                    animate={{ 
                      textShadow: [
                        '0 0 10px rgba(255, 204, 41, 0.5)',
                        '0 0 20px rgba(255, 204, 41, 0.8)',
                        '0 0 30px rgba(255, 204, 41, 0.6)',
                        '0 0 10px rgba(255, 204, 41, 0.5)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Title Sponsor
                  </motion.h3>
                  <div className="bg-white/10 border-2 border-accent/30 rounded-xl p-4 max-w-xs hover:border-accent/60 transition-all duration-300 scale-90">
                    <img
                      src={titleSponsorLogo}
                      alt="Title Sponsors"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </motion.div>
              </div>
              
              {/* Registration Countdown - Right */}
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

      {/* Image Carousel - Sponsor Logos */}
      <ImageCarousel />

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
                ? (loadingCount ? 'Loading...' : `${approvedTeamsCount}/ ${MAX_TEAMS}`)
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
                  <p className="font-body text-xl text-white font-bold whitespace-pre-wrap">
                    {displayValue}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-20 px-4 lg:px-8 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: "url('/about.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
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
            <strong className="text-accent">ICCT '26</strong> – Inter Church Cricket Tournament is more than a sporting event; it is a celebration of unity, faith, and fellowships among our youths. 
            Organized by CSI St. Peter's Church, Coimbatore – Youth Fellowship, ICCT has grown into a powerful platform that brings together 
            churches and young hearts through the spirit of cricket, fostering brotherhood, sportsmanship, and shared values.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="font-body text-lg md:text-xl text-gray-300 leading-relaxed"
          >
            After the successful editions of <strong className="text-accent">ICCT '17</strong> and <strong className="text-accent">ICCT '25</strong>, we proudly return with <strong className="text-accent">ICCT '26</strong> — our <strong className="text-accent">3<sup>rd</sup> Season</strong>, bigger and more impactful 
            than ever. Played in the electrifying Red Tennis Ball cricket format, <strong className="text-accent">ICCT '26</strong> goes beyond matches and prizes, nurturing leadership, 
            discipline, and lasting connections—making it not just a tournament, but a proud continuation of a growing legacy.
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
              {SOCIAL_LINKS.map((social) => {
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
