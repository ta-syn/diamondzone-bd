'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function GlobalWrapper({ children }) {
  const pathname = usePathname()
  
  const isAdminPath = pathname?.startsWith('/admin')
  const isAuthPath = pathname?.startsWith('/auth')

  // We only hide Navbar and Footer for admin panel. Auth pages might want navbar?
  // Let's hide them for admin only for now. Or maybe auth too.
  
  if (isAdminPath) {
    return (
      <main className="flex-grow">
        {children}
      </main>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
    </>
  )
}
