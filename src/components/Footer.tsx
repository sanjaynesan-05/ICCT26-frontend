import { Link } from 'react-router-dom'
import { Trophy, Instagram, Youtube, MessageCircle, ArrowUp } from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Registration', path: '/registration' },
    { name: 'Rules', path: '/rules' },
    { name: 'Contact', path: '/contact' },
  ]

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: MessageCircle, href: 'https://wa.me/1234567890', label: 'WhatsApp' },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-secondary via-primary to-secondary mt-20">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <Link to="/" className="inline-flex items-center space-x-3 group mb-4">
              <Trophy className="w-10 h-10 text-accent group-hover:rotate-12 transition-transform duration-300" />
              <div className="flex flex-col">
                <span className="font-heading text-3xl text-accent tracking-wider">ICCT26</span>
                <span className="text-sm text-gray-300">Cricket Tournament</span>
              </div>
            </Link>
            <p className="text-gray-300 font-subheading mt-4">
              The Spirit. The Skill. The Glory.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="font-heading text-xl text-accent mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-accent transition-colors font-subheading"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-right">
            <h3 className="font-heading text-xl text-accent mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-accent/20 hover:bg-accent flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-6 h-6 text-accent group-hover:text-primary" />
                </a>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-gray-300 text-sm font-subheading">
                CSI St. Peter's Church
              </p>
              <p className="text-gray-400 text-sm">Coimbatore, Tamil Nadu</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-accent/20 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p className="font-subheading mb-4 md:mb-0">
            © 2026 ICCT Tournament | All Rights Reserved
          </p>
          <p className="font-subheading">
            Organized by CSI St. Peter's Church, Coimbatore
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-[0_0_30px_rgba(255,204,41,0.6)] z-40"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6 text-primary" />
      </button>
    </footer>
  )
}

export default Footer
