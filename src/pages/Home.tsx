import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Trophy, MapPin, Calendar, Users } from 'lucide-react'
import Countdown from '../components/Countdown'
import AnnouncementTicker from '../components/AnnouncementTicker'

const Home = () => {
  const highlights = [
    {
      icon: Trophy,
      title: 'Prize Money',
      value: '₹50,000',
      color: 'text-accent',
    },
    {
      icon: MapPin,
      title: 'Venue',
      value: 'CSI St. Peter\'s Church',
      color: 'text-blue-400',
    },
    {
      icon: Calendar,
      title: 'Start Date',
      value: 'January 24, 2026',
      color: 'text-green-400',
    },
    {
      icon: Users,
      title: 'Teams Registered',
      value: '15',
      color: 'text-purple-400',
    },
  ]

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
              ICCT'26
            </h1>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-white mb-4">
              CRICKET TOURNAMENT
            </h2>
            <p className="font-subheading text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12">
              The Spirit. The Skill. The Glory.
            </p>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Countdown />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link to="/registration" className="btn-gold">
              Register Now
            </Link>
            <Link to="/schedule" className="btn-outline">
              View Schedule
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-accent rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Announcement Ticker */}
      <AnnouncementTicker />

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
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-effect glow-border rounded-2xl p-8 text-center group cursor-pointer"
              >
                <highlight.icon className={`w-16 h-16 mx-auto mb-6 ${highlight.color} group-hover:scale-110 transition-transform duration-300`} />
                <h3 className="font-subheading text-lg text-gray-300 mb-3">
                  {highlight.title}
                </h3>
                <p className="font-heading text-3xl text-white">
                  {highlight.value}
                </p>
              </motion.div>
            ))}
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
    </motion.div>
  )
}

export default Home
