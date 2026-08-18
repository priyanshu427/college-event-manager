import { Link } from 'react-router-dom'
import { ArrowRightIcon, Sparkles } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/event-card'

export function UpcomingEvents() {
  const { events, registrationsFor, isRegistered } = useStore()
  const featured = events
    .filter((e) => e.status !== 'completed')
    .slice(0, 3)

  return (
    <section className="relative isolate mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-xl flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Sparkles className="size-3.5" />
            <span>Happening next</span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Registrations open right now
          </h2>
        </div>
        <Button
          variant="outline"
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-all text-slate-700 dark:text-slate-200 shadow-xs"
          render={<Link to="/events" />}
        >
          See all events
          <ArrowRightIcon data-icon="inline-end" className="text-indigo-600 dark:text-indigo-400" />
        </Button>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            registered={isRegistered(event.id)}
            seatsTaken={registrationsFor(event.id).length}
          />
        ))}
      </div>
    </section>
  )
}
