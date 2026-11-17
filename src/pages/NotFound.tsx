import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'

const NotFound = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <SEO title="Page not found" description="This page does not exist." />
    <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-ink-900 bg-stripes pt-24 pb-16">
      <div className="page-container text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 font-display text-[7rem] leading-[0.85] text-white md:text-[10rem]">
          Out of <span className="text-gold">bounds</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-muted">That page doesn't exist or has moved. Let's get you back to the middle.</p>
        <Link to="/" className="btn-gold mt-8">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    </section>
  </motion.div>
)

export default NotFound
