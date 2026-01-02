import {
  Users,
  Zap,
  Shield,
  MonitorSmartphone,
  Image as ImageIcon,
  Handshake,
  HandMetal,
  Plus,
  Minus,
  Twitter,
  Info,
  Wifi,
} from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import GradientBackdrop from '@/components/GradientBackdrop'
import LandingFileZone from '@/components/LandingFileZone'

export default function HomePage() {
  const tweet = "I just discovered Omnii - lightning-fast P2P file transfers with zero size limits and complete privacy. No registration needed! Check it out at https://omnii.app"

  return (
    <>
      <Helmet>
        <title>Omnii - Free P2P File Transfer | Share Large Files Online | Send Big Files Fast</title>
        <meta name="description" content="Send large files free with Omnii - the fastest peer-to-peer file sharing platform. Transfer unlimited files, videos, photos instantly. No size limits, no registration. Secure P2P file transfer with end-to-end encryption. Share files between devices seamlessly." />
        <link rel="canonical" href="https://omnii.app/" />
      </Helmet>
      <section className="md:min-h-[100vh] bg-base-100 relative overflow-hidden">
        <GradientBackdrop />
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center justify-center gap-16 lg:gap-20 px-8 py-4 lg:py-24">
          <div className="relative z-10 mx-auto flex flex-col items-center justify-center gap-16 lg:gap-20 px-8 py-4 lg:py-24">
            <div className="relative flex flex-col lg:flex-row gap-10 lg:gap-12 items-center justify-center text-center">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <p className="text-center lg:text-left text-primary text-sm md:text-base font-semibold tracking-wide uppercase">
                    Built for Power Users
                  </p>
                  <h1 className="font-extrabold m-0 text-5xl md:text-6xl text-center lg:text-left leading-tight">
                    Transfer Files at{' '}
                    <span className="bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                      Lightning Speed
                    </span>
                  </h1>
                </div>
                <div>
                  <p className="text-center lg:text-left text-base-content/100 text-lg md:text-xl leading-relaxed">
                    Experience the future of file sharing. Send photos, videos, documents instantly between any device.{' '}
                    <span className="text-primary font-semibold">Zero size limits.</span>{' '}
                    <span className="text-white font-semibold">Complete privacy.</span>{' '}
                    <span className="text-base-content/90">Blazing fast.</span>
                  </p>
                  <p className="text-center lg:text-left text-base-content/60 text-base md:text-md mt-3 ">
                    Perfect for video editors, game developers, and developers who need to move massive files without compromise.
                  </p>
                </div>
                <div className="mx-auto lg:mx-0">
                  <ul className="flex flex-wrap gap-x-6 gap-y-3 text-base-content/90">
                    <li className="flex items-center gap-2">
                      <Zap className="h-5 text-primary" />
                      <span className="font-medium">Lightning Fast</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <MonitorSmartphone className="h-5 text-primary" />
                      <span className="font-medium">Cross-Platform</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-5 text-primary" />
                      <span className="font-medium">End-to-End Encrypted</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Handshake className="h-5 text-primary" />
                      <span className="font-medium">100% Free</span>
                    </li>
                  </ul>
                </div>
              </div>
              <LandingFileZone />
            </div>
          </div>
        </div>
      </section>

      {/* Network Compatibility Notice */}
      <section className="bg-base-100 text-base-content">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <div className="alert bg-base-200/50 border border-base-content/10 shadow-lg">
            <div className="flex items-start gap-4">
              <Info className="h-6 w-6 text-info flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-info" />
                  Network Compatibility Notice
                </h3>
                <p className="text-base-content/80 leading-relaxed">
                  Omnii uses peer-to-peer (P2P) WebRTC technology for direct device-to-device transfers.
                  <span className="font-semibold text-base-content"> Please note that P2P connections may not work on networks with strict NAT restrictions</span>, including:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-1 text-base-content/70 ml-2">
                  <li>Corporate/enterprise networks with restrictive firewalls</li>
                  <li>Educational institutions (schools, colleges, universities)</li>
                  <li>Public WiFi with strict security policies</li>
                  <li>Some mobile carrier networks with NAT filtering</li>
                </ul>
                <p className="text-base-content/80 mt-3">
                  <span className="font-semibold">For best results:</span> Use Omnii on home networks, personal mobile data, or unrestricted WiFi connections.
                  If you experience connection issues, try switching to a different network or using mobile data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-base-100 text-base-content" id="features">
        <div className="max-w-5xl mx-auto px-8 py-8 md:py-24">
          <h2 className="text-center font-extrabold text-4xl md:text-5xl tracking-tight mb-12 md:mb-20">
            Why Choose <span className="text-primary">Omnii</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card card-bordered border-base-content/10 bg-base-200/50 hover:border-primary/50 transition-colors">
              <div className="card-body items-center">
                <div className="space-y-3">
                  <Zap className="h-16 w-16 text-primary" />
                </div>
                <p className="text-2xl font-bold">Lightning Fast</p>
                <p className="text-center text-base-content/70">
                  Peer-to-peer technology means your files transfer as fast as your network allows. No server bottlenecks, no waiting.
                </p>
              </div>
            </div>
            <div className="card card-bordered border-base-content/10 bg-base-200/50 hover:border-primary/50 transition-colors">
              <div className="card-body items-center">
                <div className="space-y-3">
                  <Shield className="h-16 w-16 text-primary" />
                </div>
                <p className="text-2xl font-bold">Secure & Private</p>
                <p className="text-center text-base-content/70">
                  Full end-to-end encryption ensures your files go directly from device to device. We never see or store your data.
                </p>
              </div>
            </div>
            <div className="card card-bordered border-base-content/10 bg-base-200/50 hover:border-primary/50 transition-colors">
              <div className="card-body items-center">
                <div className="space-y-3">
                  <MonitorSmartphone className="h-16 w-16 text-primary" />
                </div>
                <p className="text-2xl font-bold">Cross-Platform</p>
                <p className="text-center text-base-content/70">
                  Share between any devices - iPhone to Windows, Android to Mac. Works seamlessly across all platforms.
                </p>
              </div>
            </div>
            <div className="card card-bordered border-base-content/10 bg-base-200/50 hover:border-primary/50 transition-colors">
              <div className="card-body items-center">
                <div className="space-y-3">
                  <Handshake className="h-16 w-16 text-primary" />
                </div>
                <p className="text-2xl font-bold">100% Free For Now</p>
                <p className="text-center text-base-content/70">
                  No subscriptions, no premium tiers, no hidden costs. Unlimited transfers, unlimited file sizes - completely free.
                </p>
              </div>
            </div>
            <div className="card card-bordered border-base-content/10 bg-base-200/50 hover:border-primary/50 transition-colors">
              <div className="card-body items-center">
                <div className="space-y-3">
                  <HandMetal className="h-16 w-16 text-primary" />
                </div>
                <p className="text-2xl font-bold">Simple & Intuitive</p>
                <p className="text-center text-base-content/70">
                  Drop files, share link, done. No accounts, no complicated setup. File sharing made effortless.
                </p>
              </div>
            </div>
            <div className="card card-bordered border-base-content/10 bg-base-200/50 hover:border-primary/50 transition-colors">
              <div className="card-body items-center">
                <div className="space-y-3">
                  <ImageIcon className="h-16 w-16 text-primary" />
                </div>
                <p className="text-2xl font-bold">Original Quality</p>
                <p className="text-center text-base-content/70">
                  Photos and videos arrive exactly as sent - no compression, no quality loss. Every pixel preserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-base-100 text-base-content" id="how-it-works">
        <div className="flow-root max-w-5xl mx-auto px-8 py-8 md:py-24">
          <h2 className="text-center font-extrabold text-4xl md:text-5xl tracking-tight mb-12 md:mb-20">
            How <span className="text-primary">Omnii</span> Works
          </h2>
          <div className="-my-8 divide-y divide-base-content/10">
            <details className="group py-8 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-base-content hover:text-primary transition-colors">
                <h3 className="text-xl font-semibold">1. File Selection & Chunking</h3>
                <span className="relative size-5 shrink-0">
                  <Plus className="absolute inset-0 size-5 opacity-100 group-open:opacity-0 text-primary" />
                  <Minus className="absolute inset-0 size-5 opacity-0 group-open:opacity-100 text-primary" />
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-base-content/70">
                When you drop files into Omnii, they're processed using the <span className="text-primary font-semibold">File API</span> and prepared for transfer. Large files are automatically chunked into smaller segments for efficient streaming. The system supports unlimited file sizes by leveraging browser-based <span className="text-primary font-semibold">ArrayBuffer</span> and <span className="text-primary font-semibold">Blob</span> handling, eliminating server-side storage requirements entirely.
              </p>
            </details>
          </div>
          <div className="-my-8 divide-y divide-base-content/10">
            <details className="group py-8 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-base-content hover:text-primary transition-colors">
                <h3 className="text-xl font-semibold">2. WebSocket Signaling</h3>
                <span className="relative size-5 shrink-0">
                  <Plus className="absolute inset-0 size-5 opacity-100 group-open:opacity-0 text-primary" />
                  <Minus className="absolute inset-0 size-5 opacity-0 group-open:opacity-100 text-primary" />
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-base-content/70">
                A unique room ID is generated and shared via link or QR code. Both devices connect to our lightweight <span className="text-primary font-semibold">WebSocket signaling server</span>, which only facilitates the initial handshake. The server exchanges <span className="text-primary font-semibold">ICE candidates</span> and <span className="text-primary font-semibold">SDP (Session Description Protocol)</span> offers between peers to establish the optimal connection path through NAT traversal.
              </p>
            </details>
          </div>
          <div className="-my-8 divide-y divide-base-content/10">
            <details className="group py-8 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-base-content hover:text-primary transition-colors">
                <h3 className="text-xl font-semibold">3. WebRTC P2P Connection</h3>
                <span className="relative size-5 shrink-0">
                  <Plus className="absolute inset-0 size-5 opacity-100 group-open:opacity-0 text-primary" />
                  <Minus className="absolute inset-0 size-5 opacity-0 group-open:opacity-100 text-primary" />
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-base-content/70">
                Omnii establishes a direct <span className="text-primary font-semibold">WebRTC peer-to-peer connection</span> using <span className="text-primary font-semibold">RTCPeerConnection</span> and <span className="text-primary font-semibold">RTCDataChannel</span>. Files transfer directly between devices using <span className="text-primary font-semibold">DTLS-SRTP encryption</span>, bypassing our servers completely. This ensures maximum speed (limited only by your network bandwidth) and complete privacy - your data never touches our infrastructure.
              </p>
            </details>
          </div>
          <div className="-my-8 divide-y divide-base-content/10">
            <details className="group py-8 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-base-content hover:text-primary transition-colors">
                <h3 className="text-xl font-semibold">4. Streaming & Progressive Download</h3>
                <span className="relative size-5 shrink-0">
                  <Plus className="absolute inset-0 size-5 opacity-100 group-open:opacity-0 text-primary" />
                  <Minus className="absolute inset-0 size-5 opacity-0 group-open:opacity-100 text-primary" />
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-base-content/70">
                Files are streamed in real-time using <span className="text-primary font-semibold">StreamSaver.js</span> for progressive downloads, allowing you to save multi-gigabyte files without memory constraints. The receiver gets files with <span className="text-primary font-semibold">zero quality loss</span> - every byte arrives exactly as sent. Once transfer completes, the P2P connection closes automatically, leaving no trace on any server.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="bg-base-100 text-base-content" id="support">
        <div className="max-w-5xl mx-auto px-8 py-8 md:py-24">
          <h2 className="text-center font-extrabold text-4xl md:text-5xl tracking-tight mb-12 md:mb-20">
            Love <span className="text-primary">Omnii</span>?
          </h2>
          <div className="flex justify-center">
            <div className="card card-bordered border-base-content/10 bg-base-200/50 max-w-md">
              <div className="card-body items-center">
                <div className="space-y-3">
                  <Users className="h-16 w-16 text-primary" />
                </div>
                <p className="text-2xl font-bold">Spread the Word</p>
                <p className="text-center text-base-content/70">
                  Help others discover fast, private file sharing. Share Omnii with your network and make file transfers easier for everyone!
                </p>
                <a
                  aria-label="Share on X (Twitter)"
                  className="btn btn-primary mt-3"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://x.com/intent/tweet?text=${encodeURIComponent(tweet)}`}
                >
                  <Twitter className="h-5 w-5" />
                  Share on X
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
