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
          {/* Header Banner */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/20 to-primary/5 p-6 border border-primary/20 sm:flex-row sm:items-center sm:p-8">
            <div>
              <Badge className="mb-2 bg-primary/15 text-primary border-primary/30">
                <CalendarDays className="size-3.5 mr-1.5 inline" />
                Campus Event Directory
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Discover & Register for Events
              </h1>
              <p className="mt-1 text-sm text-muted-foreground max-w-xl">
                Explore technical build sprints, cultural fests, sports tournaments, and workshops at Sunrise Institute of Technology.
              </p>
            </div>
          </div>

          {/* Interactive Events Browser with working filters & search */}
          <EventsBrowser />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
