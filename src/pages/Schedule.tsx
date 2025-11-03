import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

const Schedule = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-4 lg:px-8"
    >
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Calendar className="w-12 h-12 text-accent" />
          </div>
          <h1 className="font-heading text-6xl md:text-7xl text-accent mb-6">
            Match Schedule
          </h1>
          <p className="font-subheading text-xl text-gray-300">
            Tournament Schedule & Updates
          </p>
        </motion.div>

        {/* Coming Soon Content */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-12 md:p-16 text-center border-2 border-primary/40 shadow-2xl shadow-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-xl glass-effect"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-8"
          >
            <div className="inline-block">
              <div className="text-6xl md:text-8xl font-heading text-accent mb-6">
                ⏳
              </div>
            </div>
          </motion.div>

          <h2 className="font-heading text-4xl md:text-5xl bg-gradient-to-r from-accent via-accent to-primary bg-clip-text text-transparent mb-6">
            Schedule Coming Soon
          </h2>
          <p className="font-body text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
            The detailed match schedule for ICCT26 Cricket Tournament will be released soon. Stay tuned for updates on match dates, times, venues, and team matchups!
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <div className="rounded-xl px-8 py-4 border-2 border-accent/60 bg-gradient-to-r from-accent/30 to-primary/30 backdrop-blur-lg shadow-lg shadow-accent/50 glass-effect hover:shadow-xl hover:shadow-accent/60 transition-all">
              <p className="font-subheading font-bold bg-gradient-to-r from-accent via-accent to-primary bg-clip-text text-transparent">
                🏏 Tournament Start: January 24, 2026
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-body text-gray-400 text-sm md:text-base mt-12"
          >
            Follow us on social media for latest announcements and updates
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Schedule
