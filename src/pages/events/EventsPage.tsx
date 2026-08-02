import React from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { EventsBrowser } from '@/components/events-browser'
import { CalendarDays } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function EventsPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          {/* Compact One-Liner Header Banner */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/15 to-primary/5 px-4 py-3 border border-primary/20">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">
                <CalendarDays className="size-3.5 mr-1.5 inline" />
                Event Directory
              </Badge>
              <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Discover & Register for Events
              </h1>
            </div>
            <p className="text-xs text-muted-foreground hidden md:block">
              Explore technical build sprints, cultural fests, sports tournaments, and workshops.
            </p>
          </div>

          {/* Interactive Events Browser with working filters & search */}
          <EventsBrowser />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
