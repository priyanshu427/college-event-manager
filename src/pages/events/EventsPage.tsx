import React from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { EventsBrowser } from '@/components/events-browser'
import { CalendarDays } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AnimatedGradientBg } from '@/components/ui/animated-gradient-bg'

export default function EventsPage() {
  return (
    <AnimatedGradientBg accentColor="neutral">
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-7xl">
            {/* Compact One-Liner Header Banner */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/30 backdrop-blur-md px-5 py-3.5 border border-white/60 shadow-xs">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                  <CalendarDays className="size-3.5 mr-1.5 inline" />
                  Event Directory
                </Badge>
                <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                  Discover & Register for Events
                </h1>
              </div>
              <p className="text-xs text-slate-600 hidden md:block">
                Explore technical build sprints, cultural fests, sports tournaments, and workshops.
              </p>
            </div>

            {/* Interactive Events Browser with working filters & search */}
            <EventsBrowser />
          </div>
        </main>

        <SiteFooter />
      </div>
    </AnimatedGradientBg>
  )
}
