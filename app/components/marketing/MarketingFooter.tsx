import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react'
import {useState} from 'react'
import {Link} from 'react-router'

const footerLinks = {
  services: [
    {name: 'Buy a Home', href: '/services/buyers'},
    {name: 'Sell a Home', href: '/services/sellers'},
    {name: 'Investment Services', href: '/services/investors'},
    {name: 'Property Management', href: '/services'},
  ],
  company: [
    {name: 'About Us', href: '/about'},
    {name: 'Our Team', href: '/about#team'},
    {name: 'Testimonials', href: '/testimonials'},
    {name: 'Contact', href: '/contact'},
  ],
  resources: [
    {name: 'Properties', href: '/properties'},
    {name: 'Our Projects', href: '/projects'},
    {name: 'Market Insights', href: '/blog'},
    {name: 'FAQs', href: '/faq'},
  ],
  legal: [
    {name: 'Privacy Policy', href: '/privacy'},
    {name: 'Terms of Service', href: '/terms'},
    {name: 'Cookie Policy', href: '/cookies'},
  ],
}

const socialLinks = [
  {name: 'Facebook', icon: Facebook, href: '#'},
  {name: 'Instagram', icon: Instagram, href: '#'},
  {name: 'Twitter', icon: Twitter, href: '#'},
  {name: 'LinkedIn', icon: Linkedin, href: '#'},
]

export function MarketingFooter() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <footer className="bg-[#111111] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#c9a961] rounded flex items-center justify-center">
                <span className="text-[#1a1a1a] font-display font-bold text-2xl">
                  G
                </span>
              </div>
              <div>
                <span className="text-white font-display text-xl font-semibold tracking-wide block">
                  Golden Gate
                </span>
                <span className="text-[#c9a961] text-xs tracking-[0.2em] uppercase">
                  Home Advisors
                </span>
              </div>
            </Link>

            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner in San Francisco Bay Area real estate.
              Helping buyers, sellers, and investors achieve their property
              goals since 2010.
            </p>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-4">Stay Updated</h4>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded text-white placeholder:text-gray-500 focus:outline-none focus:border-[#c9a961] transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="btn-gold px-5 py-3 rounded font-semibold whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-gray-500 text-xs mt-2">
                Get market insights and exclusive listings delivered to your
                inbox.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h4 className="font-semibold mb-4 text-[#c9a961]">Services</h4>
                <ul className="space-y-3">
                  {footerLinks.services.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-[#c9a961]">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-[#c9a961]">Resources</h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-[#c9a961]">Contact</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="tel:+14155551234"
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Phone size={16} />
                      (415) 555-1234
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:hello@goldengateadvisors.com"
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Mail size={16} />
                      hello@goldengateadvisors.com
                    </a>
                  </li>
                  <li>
                    <p className="text-gray-400 flex items-start gap-2">
                      <MapPin size={16} className="mt-1 flex-shrink-0" />
                      <span>
                        123 Market Street, Suite 456
                        <br />
                        San Francisco, CA 94102
                      </span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Golden Gate Home Advisors. All
              rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-500 hover:text-white text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#c9a961] hover:border-[#c9a961] transition-colors"
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
