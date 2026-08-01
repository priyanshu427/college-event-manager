import Link from 'next/link'
import { ArrowRightIcon, ScanLineIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaBand() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
      <div className="relative isolate overflow-hidden rounded-3xl gradient-hero px-6 py-14 ring-1 ring-foreground/10 sm:px-12">
        <div className="pointer-events-none absolute inset-0 gradient-grid" />
        <div className="relative flex max-w-2xl flex-col gap-5">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Your next fest can run with half the volunteers
          </h2>
          <p className="leading-relaxed text-pretty text-muted-foreground">
            Try the full flow in this demo: register for an event as a student,
            switch to the organizer view, scan the pass code at the check-in
            desk and watch the analytics move.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-11 px-5 text-sm"
              render={<Link href="/events" />}
            >
              Register for an event
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 bg-background/60 px-5 text-sm backdrop-blur"
              render={<Link href="/dashboard" />}
            >
              <ScanLineIcon data-icon="inline-start" />
              Try the check-in desk
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
