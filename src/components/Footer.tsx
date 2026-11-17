import { Link } from 'react-router-dom'
import { Trophy, Phone, MapPin } from 'lucide-react'
import { SOCIAL_LINKS, ORGANIZERS } from '../data/contact'

const footerLinks = [
  { name: 'Home', path: '/' },
  { name: 'Registration', path: '/registration' },
  { name: 'Fixtures', path: '/fixtures' },
  { name: 'Rules', path: '/rules' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
]

const Footer = () => {
  const keyContacts = ORGANIZERS.slice(0, 2)

  return (
    <footer className="border-t-4 border-gold bg-ink-950">
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
              Inter Church Cricket Tournament organised by CSI St. Peter's Church, Rathinapuri Youth Fellowship.
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

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          <p>© CSI St. Peter's Church, Rathinapuri Youth Fellowship. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
