import type { Metadata } from 'next'
import '../styles/globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'LTB Audio - Superior Music Production Platform',
  description: 'The future of music production. Professional audio editing, AI-powered mastering, and real-time collaboration.',
  keywords: ['music production', 'audio editing', 'AI mastering', 'collaboration', 'DAW'],
  authors: [{ name: 'LTB Audio Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#8B5CF6',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'LTB Audio - Superior Music Production Platform',
    description: 'Professional music production platform with AI-powered features',
    url: 'https://ltb-audio.com',
    siteName: 'LTB Audio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LTB Audio Platform',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LTB Audio - Superior Music Production Platform',
    description: 'Professional music production platform with AI-powered features',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}