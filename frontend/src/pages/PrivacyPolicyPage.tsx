import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Omnii P2P File Transfer | Secure File Sharing</title>
        <meta name="description" content="Read Omnii's privacy policy for P2P file transfer. Learn how we protect your privacy with end-to-end encryption and zero data storage on our servers." />
        <meta name="keywords" content="omnii privacy policy, file sharing privacy, p2p privacy, secure file transfer, data protection" />
        <link rel="canonical" href="https://omnii.app/privacy-policy" />
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
        <h1 className="text-3xl font-extrabold pb-6 text-primary">Privacy Policy</h1>
        <pre className="leading-relaxed whitespace-pre-wrap text-base-content/80">
        {`Privacy Policy for Omnii

Last updated: December 18, 2025

Omnii ("we," "our," or "us") operates the Omnii file transfer service (the "Service").

1. Data We DON'T Collect
 - We do NOT collect or store your files
 - We do NOT collect personal information
 - We do NOT track your transfers
 - We do NOT require user registration or accounts

2. How the Service Works
 - All file transfers occur directly between user devices using peer-to-peer technology
 - Files are end-to-end encrypted and do not pass through our servers
 - Our servers are only used to facilitate the initial connection between devices
 - Once connected, data flows directly between peers

3. Technical Information
 - We may temporarily process minimal technical metadata (such as connection signaling data)
 - This data is not linked to user identity and is not stored permanently
 - No personally identifiable information is associated with this data

4. Cookies
 - We may use essential cookies strictly required for core service functionality
 - We do NOT use analytics, tracking, or advertising cookies

5. Third-Party Services
 - We do NOT sell, share, or disclose data to third parties
 - We do NOT integrate third-party analytics or tracking tools

6. Children's Privacy
 - Omnii does not knowingly collect information from children under the age of 13
 - The Service does not require personal information from any user

7. Changes to This Privacy Policy
 - This Privacy Policy may be updated periodically
 - Any changes will be reflected on this page with a revised update date
 - Continued use of the Service implies acceptance of the updated policy

8. Intellectual Property & Source Code
 - Omnii is a proprietary project
 - It is NOT an open-source project
 - It is NOT a modified or derived version of any open-source software
 - All source code, architecture, and implementation are original and owned by the creator

If you have any questions regarding this Privacy Policy, you may contact us:
- GitHub: https://github.com/1lakshy
- Email: lakshy18sharma@gmail.com
- Portfolio: https://lakshysharma.netlify.app`}

        </pre>
      </div>
    </section>
    </>
  )
}
