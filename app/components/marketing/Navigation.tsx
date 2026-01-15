import {Menu, X} from 'lucide-react'
import {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router'

const navLinks = [
  {name: 'Home', href: '/'},
  {name: 'About', href: '/about'},
  {name: 'Services', href: '/services'},
  {name: 'Properties', href: '/properties'},
  {name: 'Testimonials', href: '/testimonials'},
  {name: 'Contact', href: '/contact'},
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <nav
      className={`transition-all duration-300 bg-[#1a1a1a] ${
        isScrolled ? 'py-4 shadow-lg' : 'py-5'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c9a961] rounded flex items-center justify-center">
              <span className="text-[#1a1a1a] font-display font-bold text-xl">
                G
              </span>
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-display text-lg font-semibold tracking-wide">
                Golden Gate
              </span>
              <span className="block text-[#c9a961] text-xs tracking-[0.2em] uppercase">
                Home Advisors
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#c9a961] ${
                  location.pathname === link.href
                    ? 'text-[#c9a961]'
                    : 'text-white/90'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <Link
              to="/get-started"
              className="btn-gold px-6 py-2.5 rounded text-sm font-semibold hidden sm:block"
            >
              Get Started
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-[#c9a961] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-6 pb-6 border-t border-white/10 pt-6">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-lg font-medium transition-colors hover:text-[#c9a961] ${
                    location.pathname === link.href
                      ? 'text-[#c9a961]'
                      : 'text-white/90'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/get-started"
                className="btn-gold px-6 py-3 rounded text-center font-semibold mt-4"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
