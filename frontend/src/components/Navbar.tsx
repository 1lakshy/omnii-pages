import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="z-50 relative bg-transparent">
      <nav className="container max-w-5xl flex items-center justify-between px-4 md:px-8 py-4 mx-auto" aria-label="Global">
        {/* Logo */}
        <div className="flex flex-1">
          <Link className="flex items-center" to="/" onClick={closeMobileMenu}>
            <img
              src="/logo-f.svg"
              loading="lazy"
              alt="Omnii logo"
              className="w-32 sm:w-40 md:w-48 lg:w-[200px] h-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:justify-center lg:gap-8 lg:items-center">
          <a className="link link-hover text-primary hover:text-red-600 transition-colors font-medium" title="Features" href="/#features">Features</a>
          <a className="link link-hover text-primary hover:text-red-600 transition-colors font-medium" title="How it works" href="/#how-it-works">How it works</a>
          <Link className="link link-hover text-primary hover:text-red-600 transition-colors font-medium" title="Contact" to="/contact">Contact</Link>
          <Link className="link link-hover text-primary hover:text-red-600 transition-colors font-medium" title="Terms of Service" to="/tos">Terms</Link>
          <Link className="link link-hover text-primary hover:text-red-600 transition-colors font-medium" title="Privacy Policy" to="/privacy-policy">Privacy</Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="btn btn-ghost btn-circle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-primary" />
            ) : (
              <Menu className="h-6 w-6 text-primary" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer - Slides from Right */}
      <div
        className={`fixed top-0 right-0 h-full w-64 sm:w-80 bg-base-100 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-content/10">
          <h2 className="text-xl font-bold text-primary">Menu</h2>
          <button
            type="button"
            className="btn btn-ghost btn-circle btn-sm"
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
          >
            <X className="h-5 w-5 text-primary" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <nav className="flex flex-col p-6 space-y-4">
          <a
            className="link link-hover text-lg text-base-content hover:text-primary transition-colors font-medium py-2"
            title="Features"
            href="/#features"
            onClick={closeMobileMenu}
          >
            Features
          </a>
          <a
            className="link link-hover text-lg text-base-content hover:text-primary transition-colors font-medium py-2"
            title="How it works"
            href="/#how-it-works"
            onClick={closeMobileMenu}
          >
            How it works
          </a>
          <Link
            className="link link-hover text-lg text-base-content hover:text-primary transition-colors font-medium py-2"
            title="Contact"
            to="/contact"
            onClick={closeMobileMenu}
          >
            Contact
          </Link>
          <Link
            className="link link-hover text-lg text-base-content hover:text-primary transition-colors font-medium py-2"
            title="Terms of Service"
            to="/tos"
            onClick={closeMobileMenu}
          >
            Terms of Service
          </Link>
          <Link
            className="link link-hover text-lg text-base-content hover:text-primary transition-colors font-medium py-2"
            title="Privacy Policy"
            to="/privacy-policy"
            onClick={closeMobileMenu}
          >
            Privacy Policy
          </Link>
        </nav>

        {/* Drawer Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-base-content/10">
          <p className="text-sm text-base-content/60 text-center">
            Omnii - P2P File Transfer
          </p>
        </div>
      </div>
    </header>
  )
}
