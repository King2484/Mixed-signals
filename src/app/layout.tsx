import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import FaviconAnimator from '@/components/FaviconAnimator'
import '../styles/globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mixed Signals',
  description: 'A menswear narrative guided by a curiosity to intertwine nuanced perspectives with an essence of familiarity.',
  icons: {
    icon: '/favicon-white.png',
    apple: '/favicon-white.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable}`}>
      <head>
        <link rel="preload" href="/hero-video.mp4" as="video" type="video/mp4" crossOrigin="anonymous" />
        <link rel="preload" href="/preview-transparent.png" as="image" />
        <link rel="preload" href="/IMG-20260309-WA0006-opt.jpg" as="image" />
      </head>
      <body>
        <FaviconAnimator />
        {children}
      </body>
    </html>
  )
}
