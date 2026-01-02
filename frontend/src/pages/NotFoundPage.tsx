import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Omnii P2P File Transfer</title>
        <meta name="description" content="Page not found. Return to Omnii to share large files instantly with our free P2P file transfer platform." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <section className="flex min-h-svh flex-col items-center justify-center bg-base-100">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-extrabold">404</h1>
        <h2 className="text-4xl font-bold">Page Not Found</h2>
        <p className="text-xl text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary mt-8">
          <Home className="h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </section>
    </>
  )
}
