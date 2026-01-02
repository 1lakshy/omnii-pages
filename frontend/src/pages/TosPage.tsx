import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'

export default function TosPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Omnii P2P File Transfer Platform</title>
        <meta name="description" content="Read Omnii's terms of service for using our free peer-to-peer file transfer platform. Understand your rights and responsibilities when sharing files." />
        <meta name="keywords" content="omnii terms of service, file sharing terms, p2p terms, file transfer agreement" />
        <link rel="canonical" href="https://omnii.app/tos" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <section className="max-w-2xl mx-auto">
      <div className="mt-5">
        <Link className="btn btn-ghost btn-lg" to="/">
          <ArrowLeft />
          Go Back
        </Link>
      </div>
      <div className="p-10">
        <h1 className="text-3xl font-extrabold pb-6 text-primary">Terms of Service</h1>
        <pre className="leading-relaxed whitespace-pre-wrap text-base-content/80">
{`Terms of Service for Omnii

Last updated: December 18, 2025

Omnii ("we," "our," or "us") operates the Omnii file transfer service (the "Service").

By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.

1. Service Description
 - Omnii provides a free, peer-to-peer file transfer service with no file size limits.
 - The Service is provided "as is" without any warranties or guarantees.
 - Files are transferred directly between devices and are not stored on our servers.

2. User Responsibilities
 - You are responsible for the content you choose to transfer using the Service.
 - You must not use the Service to transmit illegal, harmful, or infringing content.
 - You must comply with all applicable laws when using the Service.

3. Privacy and Data
 - Omnii does not store or access the files you transfer.
 - All file transfers are peer-to-peer and end-to-end encrypted.
 - For more information, please refer to our Privacy Policy.

4. Limitation of Liability
 - The Service is provided free of charge without any warranties.
 - We are not liable for any data loss, interruptions, or issues arising from use of the Service.
 - You use the Service at your own risk.

5. Modifications
 - We reserve the right to modify or discontinue the Service at any time.
 - We may update these Terms from time to time. Continued use constitutes acceptance.

If you have any questions about these Terms of Service, please contact us:
- GitHub: https://github.com/1lakshy
- Email: lakshy18sharma@gmail.com
- Portfolio: https://lakshysharma.netlify.app`}
        </pre>
      </div>
    </section>
    </>
  )
}
