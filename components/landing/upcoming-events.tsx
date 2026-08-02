import { Link } from 'react-router-dom'
import { ArrowRightIcon } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/event-card'

export function UpcomingEvents() {
  const { events, registrationsFor, isRegistered } = useStore()
  const featured = events
    .filter((e) => e.status !== 'completed')
    .slice(0, 3)

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-xl flex-col gap-3">
          <p className="text-sm font-medium text-primary">Happening next</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Registrations open right now
          </h2>
        </div>
        <Button variant="outline" render={<Link to="/events" />}>
          See all events
          <ArrowRightIcon data-icon="inline-end" />
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
