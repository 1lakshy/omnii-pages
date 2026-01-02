import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Toaster from './toast/Toaster'

export default function Layout() {
  return (
    <main className="min-h-svh">
      <Toaster />
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  )
}
