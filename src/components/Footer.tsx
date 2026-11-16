import { Link } from 'react-router-dom'
import { Trophy, Phone, MapPin, ArrowRight } from 'lucide-react'
import { SOCIAL_LINKS, ORGANIZERS } from '../data/contact'

const footerLinks = [
  { name: 'Home', path: '/' },
  { name: 'Registration', path: '/registration' },
  { name: 'Rules', path: '/rules' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
]

const Footer = () => {
  const year = new Date().getFullYear()
  const keyContacts = ORGANIZERS.slice(0, 2)

  return (
    <footer className="mt-20 border-t border-white/10 bg-ink-950">
      {/* Call-to-action band */}
      <div className="bg-gold text-ink-900">
        <div className="page-container flex flex-col items-center justify-between gap-4 py-8 text-center md:flex-row md:text-left">
          <div>
            <p className="font-display text-3xl md:text-4xl leading-none">Ready to take the field?</p>
            <p className="mt-1 text-sm font-semibold text-ink-900/70">Register your church team for ICCT'27.</p>
          </div>
          <Link
            to="/registration"
            className="btn bg-ink-900 text-white hover:bg-ink-700 !px-8 !py-4"
          >
            Register Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="page-container py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-ink-900">
                <Trophy className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-3xl tracking-wide text-white">
                ICCT<span className="text-gold">'27</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Inter Church Cricket Tournament — organised by CSI St. Peter's Church Youth Fellowship, Coimbatore.
              The Spirit. The Skill. The Glory.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white/80 transition-colors hover:border-gold hover:text-gold"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h3 className="text-eyebrow uppercase text-white/50 font-body">Explore</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm font-medium text-muted transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h3 className="text-eyebrow uppercase text-white/50 font-body">Contact</h3>
            <ul className="mt-4 space-y-4">
              {keyContacts.map((person) => (
                <li key={person.phone} className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <a href={`tel:${person.phone.replace(/\s/g, '')}`} className="text-sm font-semibold text-white hover:text-gold">
                      {person.phone}
                    </a>
                    <p className="text-xs text-muted">
                      {person.name} · {person.role}
                    </p>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <p className="text-sm text-muted">CSI St. Peter's Church, Rathinapuri, Coimbatore</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row">
          <p>© {year} ICCT · All rights reserved</p>
          <p>Organised by CSI St. Peter's Church Youth Fellowship, Coimbatore</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
