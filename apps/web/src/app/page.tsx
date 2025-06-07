'use client'

import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Demo } from '@/components/landing/Demo'
import { Pricing } from '@/components/landing/Pricing'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <Demo />
      <Pricing />
      <Footer />
    </main>
  )
}