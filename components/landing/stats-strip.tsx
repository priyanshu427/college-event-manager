'use client'

import { useStore } from '@/lib/store'

export function StatsStrip() {
  const { events, registrations } = useStore()
  const checkedIn = registrations.filter((r) => r.checkedIn).length
  const attendanceRate = registrations.length
    ? Math.round((checkedIn / registrations.length) * 100)
    : 0

  const stats = [
    { value: String(events.length), label: 'Events on the calendar' },
    {
      value: registrations.length.toLocaleString('en-IN'),
      label: 'Registrations processed',
    },
    { value: `${attendanceRate}%`, label: 'Verified attendance rate' },
    { value: '0', label: 'Paper forms printed' },
  ]

  return (
    <section className="border-y border-border/60 bg-card/40">
      <dl className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <dd className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {stat.value}
            </dd>
            <dt className="text-sm text-muted-foreground">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
