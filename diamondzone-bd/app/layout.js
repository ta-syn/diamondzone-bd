import { Orbitron, Rajdhani } from 'next/font/google'
import './globals.css'
import GlobalWrapper from '@/components/layout/GlobalWrapper'
import FloatingElements from '@/components/layout/FloatingElements'
import ToastContainer from '@/components/ui/Toast'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '700', '900']
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: ['400', '500', '600', '700']
})

export const metadata = {
  title: {
    default: 'DiamondZoneBD — #1 Gaming Top-Up Bangladesh',
    template: '%s | DiamondZoneBD'
  },
  description: 'Buy Free Fire Diamonds, PUBG UC, Mobile Legends Diamonds instantly in Bangladesh. Pay with bKash, Nagad, Rocket. Best price guaranteed.',
  keywords: ['free fire diamond bangladesh', 'pubg uc bd', 'gaming recharge bangladesh', 'mobile legends diamond buy', 'ফ্রি ফায়ার ডায়মন্ড'],
  openGraph: { type: 'website', siteName: 'DiamondZoneBD', locale: 'en_BD' },
}

import AuthInitializer from '@/components/auth/AuthInitializer'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <AuthInitializer />
        <div className="animate-fade-in flex flex-col min-h-screen">
          <GlobalWrapper>{children}</GlobalWrapper>
        </div>
        <FloatingElements />
        <ToastContainer />
      </body>
    </html>
  )
}
