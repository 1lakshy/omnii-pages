import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Github, Linkedin, Globe, Twitter, Mail, MessageSquare, Bug } from 'lucide-react'

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact Omnii - Get Support for P2P File Transfer | Lakshy Sharma</title>
        <meta name="description" content="Contact Omnii developer Lakshy Sharma for support, feedback, or questions about P2P file sharing. Connect on GitHub, LinkedIn, Twitter, or Discord for file transfer help." />
        <meta name="keywords" content="omnii contact, file sharing support, p2p file transfer help, lakshy sharma, developer contact, file transfer support, omnii feedback" />
        <link rel="canonical" href="https://omnii.app/contact" />

        <meta property="og:title" content="Contact Omnii - Get Support for P2P File Transfer" />
        <meta property="og:description" content="Connect with Omnii developer Lakshy Sharma for support and feedback on peer-to-peer file sharing." />
        <meta property="og:url" content="https://omnii.app/contact" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Contact Omnii - Get Support for P2P File Transfer" />
        <meta name="twitter:description" content="Connect with Omnii developer Lakshy Sharma for support and feedback on peer-to-peer file sharing." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "mainEntity": {
              "@type": "Person",
              "name": "Lakshy Sharma",
              "jobTitle": "Full-stack Developer",
              "description": "Developer & Creator of Omnii - P2P File Transfer Platform",
              "url": "https://lakshysharma.netlify.app/",
              "image": "https://omnii.app/profile.jpeg",
              "sameAs": [
                "https://github.com/1lakshy",
                "https://www.linkedin.com/in/lakshy-sharma-bab28424b/",
                "https://x.com/LakshyS75184003",
                "https://lakshysharma.netlify.app/",
                "https://discord.gg/fPfaevgm84"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Developer Support",
                "url": "https://omnii.app/contact",
                "availableLanguage": "English"
              }
            }
          })}
        </script>
      </Helmet>

      <section className="max-w-4xl mx-auto">
      <div className="mt-5">
        <Link className="btn btn-ghost btn-lg" to="/">
          <ArrowLeft />
          Go Back
        </Link>
      </div>
      <div className="p-10">
        <h1 className="text-4xl font-extrabold pb-6 text-primary text-center">Get in Touch</h1>
        <p className="text-center text-base-content/70 text-lg mb-12">
          Have questions, feedback, or just want to connect? Reach out through any of these channels.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Developer Info Card */}
          <div className="card card-bordered border-base-content/10 bg-base-200/50 col-span-full">
            <div className="card-body items-center text-center">
              <div className="avatar mb-4">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src="/profile.jpeg"
                    alt="Lakshy Sharma"
                    loading="lazy"
                  />
                </div>
              </div>
              <h2 className="text-2xl font-bold">Lakshy Sharma</h2>
              <p className="text-base-content/70 text-lg">Developer & Creator of Omnii</p>
              <div className="divider"></div>
              <p className="text-base-content/80 max-w-2xl">
                Full-stack developer passionate about building fast, privacy-focused tools.
                Omnii is my contribution to making file sharing better for everyone -
                especially power users who need to move large files without compromise.
              </p>
            </div>
          </div>

          {/* Social Links */}
          <a
            href="https://github.com/1lakshy"
            target="_blank"
            rel="noopener noreferrer"
            className="card card-bordered border-base-content/10 bg-base-200/50 hover:border-primary/50 hover:bg-base-200 transition-all cursor-pointer"
          >
            <div className="card-body items-center">
              <Github className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">GitHub</h3>
              <p className="text-base-content/70 text-center">@1lakshy</p>
              <p className="text-sm text-base-content/60 text-center">Check out my projects and contributions</p>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/lakshy-sharma-bab28424b/"
            target="_blank"
            rel="noopener noreferrer"
            className="card card-bordered border-base-content/10 bg-base-200/50 hover:border-primary/50 hover:bg-base-200 transition-all cursor-pointer"
          >
            <div className="card-body items-center">
              <Linkedin className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">LinkedIn</h3>
              <p className="text-base-content/70 text-center">Lakshy Sharma</p>
              <p className="text-sm text-base-content/60 text-center">Connect professionally</p>
            </div>
          </a>

          <a
            href="https://lakshysharma.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="card card-bordered border-base-content/10 bg-base-200/50 hover:border-primary/50 hover:bg-base-200 transition-all cursor-pointer"
          >
            <div className="card-body items-center">
              <Globe className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Portfolio</h3>
              <p className="text-base-content/70 text-center">lakshysharma.netlify.app</p>
              <p className="text-sm text-base-content/60 text-center">View my work and experience</p>
            </div>
          </a>

          <a
            href="https://x.com/LakshyS75184003"
            target="_blank"
            rel="noopener noreferrer"
            className="card card-bordered border-base-content/10 bg-base-200/50 hover:border-primary/50 hover:bg-base-200 transition-all cursor-pointer"
          >
            <div className="card-body items-center">
              <Twitter className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">X (Twitter)</h3>
              <p className="text-base-content/70 text-center">@LakshyS75184003</p>
              <p className="text-sm text-base-content/60 text-center">Follow for updates</p>
            </div>
          </a>
        </div>

        {/* Additional Info */}
        <div className="mt-12 card card-bordered border-base-content/10 bg-base-200/50">
          <div className="card-body">
            <h3 className="text-2xl font-bold text-center mb-6">Support & Feedback</h3>
            <div className="space-y-4 text-base-content/80">
              <div className="flex items-start gap-3">
                <Bug className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Bug Reports & Feature Requests</p>
                  <p className="text-sm text-base-content/70">
                    Found a bug or have a feature request? Join our Discord community to report issues and suggest improvements.
                  </p>
                  <a
                    href="https://discord.gg/fPfaevgm84"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm mt-2 gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Join Discord
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">General Feedback</p>
                  <p className="text-sm text-base-content/70">
                    Have questions or feedback? Connect with me on any social platform above or join our Discord community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
