import { Link } from 'react-router-dom'
import { Github, Linkedin, Twitter, Globe, MessageSquare } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-base-200 border-t border-base-content/20">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col gap-12">
          <div className="flex-shrink-0 md:mx-0 mx-auto text-center md:text-left max-w-sm">
            <Link className="flex justify-center md:justify-start items-center mb-4" to="/">
<img
  src="/logo-f.svg"
  loading="lazy"
  alt="Omnii logo"
  style={{ width: '200px', height: 'auto' }}
/>

            </Link>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Lightning-fast peer-to-peer file transfers. No limits, complete privacy, instant sharing across all your devices.
            </p>
            <p className="mt-4 text-xs text-base-content/50">© {new Date().getFullYear()} Omnii. All rights reserved.</p>
          </div>

          <div className="flex-grow flex flex-wrap justify-center md:justify-end gap-12 md:gap-16">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-sm tracking-wider mb-4 text-primary">NAVIGATION</h3>
              <div className="flex flex-col gap-3 text-sm">
                <a href="/#features" className="link link-hover text-base-content/70 hover:text-primary transition-colors">Features</a>
                <a href="/#how-it-works" className="link link-hover text-base-content/70 hover:text-primary transition-colors">How it Works</a>
                <a href="/#support" className="link link-hover text-base-content/70 hover:text-primary transition-colors">Support</a>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="font-bold text-sm tracking-wider mb-4 text-primary">LEGAL</h3>
              <div className="flex flex-col gap-3 text-sm">
                <Link to="/tos" className="link link-hover text-base-content/70 hover:text-primary transition-colors">Terms of Service</Link>
                <Link to="/privacy-policy" className="link link-hover text-base-content/70 hover:text-primary transition-colors">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-base-content/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-sm text-base-content/60">
  <a
    href="https://lakshysharma.netlify.app/"
    target="_blank"
    rel="noopener noreferrer"
    className="flex-shrink-0"
    aria-label="Lakshy Sharma Portfolio"
  >
    <img
      src="https://lakshysharma.netlify.app/assets/favicon_portfolio-Bjs1LOnZ.png"
      alt="Lakshy Sharma"
      className="h-9 w-9 rounded-full border border-base-content/20 hover:scale-105 transition-transform"
      loading="lazy"
    />
  </a>

  <span className="italic tracking-wide">
    “Trying to change my destiny”
  </span>
</div>

            <div className="flex items-center gap-4">
              <a
                href="https://discord.gg/fPfaevgm84"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-content/60 hover:text-primary transition-colors"
                aria-label="Discord"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/1lakshy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-content/60 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/lakshy-sharma-bab28424b/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-content/60 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/LakshyS75184003"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-content/60 hover:text-primary transition-colors"
                aria-label="X (Twitter)"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://lakshysharma.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-content/60 hover:text-primary transition-colors"
                aria-label="Portfolio"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
