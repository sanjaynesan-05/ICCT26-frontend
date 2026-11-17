import { motion } from 'framer-motion'
import { Phone, MapPin, MessageCircle, Navigation } from 'lucide-react'
import { ORGANIZERS, SOCIAL_LINKS, VENUE, DEVELOPER } from '../data/contact'
import SEO from '../components/SEO'
import { PageHero } from '../components/ui'

const initials = (name: string) =>
  name
    .replace(/^(Mr|Mrs|Ms|Dr|Rev)\.?\s+/i, '')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.35 },
}

const Contact = () => {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${VENUE.name}, ${VENUE.address}, ${VENUE.city}`
  )}`

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SEO title="Contact Us" description="Get in touch with the ICCT'27 organizing committee." />

      <PageHero eyebrow="Contact" title="Talk to the organisers" description="Questions about registration, payment or fixtures? Call or WhatsApp any of us." />

      <section className="bg-surface py-14 text-ink md:py-20">
        <div className="page-container space-y-14">
          {/* Organisers */}
          <div>
            <p className="mb-5 text-eyebrow uppercase text-flame">Tournament organisers</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ORGANIZERS.map((person, i) => (
                <motion.div key={person.phone} {...fadeUp} transition={{ duration: 0.35, delay: i * 0.05 }} className="card-light flex flex-col p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xl text-gold">
                      {initials(person.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-ink">{person.name}</p>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-dark">{person.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-ink">{person.phone}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${person.phone.replace(/\s/g, '')}`}
                      className="btn !px-3 !py-2.5 bg-ink text-white hover:bg-ink-700"
                      aria-label={`Call ${person.name}`}
                    >
                      <Phone className="h-4 w-4" /> Call
                    </a>
                    <a
                      href={`https://wa.me/${person.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn !px-3 !py-2.5 bg-pitch text-white hover:bg-pitch-dark"
                      aria-label={`WhatsApp ${person.name}`}
                    >
                      <MessageCircle className="h-4 w-4" /> Chat
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Venue + social */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
            <motion.div {...fadeUp} className="card-light overflow-hidden">
              <div className="aspect-[16/10] w-full bg-surface">
                <iframe
                  src={VENUE.mapEmbedUrl}
                  className="h-full w-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${VENUE.name} location`}
                />
              </div>
              <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-flame" />
                  <div>
                    <p className="text-eyebrow uppercase text-muted-dark">Venue</p>
                    <p className="font-bold text-ink">{VENUE.name}</p>
                    <p className="text-sm text-muted-dark">
                      {VENUE.address}, {VENUE.city}, {VENUE.state} {VENUE.zipCode}
                    </p>
                  </div>
                </div>
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-gold shrink-0">
                  <Navigation className="h-4 w-4" /> Directions
                </a>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.05 }} className="card-light flex flex-col p-6">
              <p className="text-eyebrow uppercase text-flame">Follow us</p>
              <h2 className="mt-1 text-3xl text-ink">Fixtures, results &amp; photos</h2>
              <p className="mt-1 text-sm text-muted-dark">Announcements go out on our social channels first.</p>
              <div className="mt-6 space-y-2">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-surface-line px-4 py-3 transition-colors hover:border-ink"
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${link.color}`}>
                      <link.icon className="h-5 w-5 text-white" />
                    </span>
                    <span className="font-semibold text-ink">{link.name}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Developer credit */}
          <div className="flex flex-col items-center justify-center gap-3 border-t border-surface-line pt-8 text-sm text-muted-dark sm:flex-row">
            <span>
              {DEVELOPER.role}: <strong className="text-ink">{DEVELOPER.name}</strong>
            </span>
            <span className="flex items-center gap-1">
              {DEVELOPER.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-dark hover:bg-white hover:text-ink"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </span>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Contact
