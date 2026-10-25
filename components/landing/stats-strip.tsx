'use client'

import { useStore } from '@/lib/store'

export function StatsStrip() {
  const { events, registrations } = useStore()
  const checkedIn = registrations.filter((r) => r.checkedIn).length
  const attendanceRate = registrations.length
    ? Math.round((checkedIn / registrations.length) * 100)
    : 0

  const stats = [
    {
      value: String(events.length),
      label: 'Events on the calendar',
      gradient: 'from-violet-600 to-indigo-600',
    },
    {
      value: registrations.length.toLocaleString('en-IN'),
      label: 'Registrations processed',
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      value: `${attendanceRate}%`,
      label: 'Verified attendance rate',
      gradient: 'from-emerald-600 to-teal-600',
    },
    {
      value: '0',
      label: 'Paper forms printed',
      gradient: 'from-amber-600 to-orange-600',
    },
  ]

  return (
    <section className="border-y border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
      <dl className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 sm:gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1.5 p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-xs hover:border-slate-300 transition-all"
          >
            <dd
              className={`font-display text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
            >
              {stat.value}
            </dd>
            <dt className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
