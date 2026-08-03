import React from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Hero } from '@/components/landing/hero'
import { StatsStrip } from '@/components/landing/stats-strip'
import { Features } from '@/components/landing/features'
import { HowItWorks } from '@/components/landing/how-it-works'
import { UpcomingEvents } from '@/components/landing/upcoming-events'
import { CtaBand } from '@/components/landing/cta-band'

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        <Hero />
        <StatsStrip />
        <UpcomingEvents />
        <Features />
        <HowItWorks />
        <CtaBand />
      </main>

      <SiteFooter />
    </div>
  )
}
