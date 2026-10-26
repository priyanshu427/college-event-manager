import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CalendarCheckIcon,
  ScanLineIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const highlights = [
  { icon: ScanLineIcon, label: '6 sec QR check-in', color: 'text-cyan-600 dark:text-cyan-400' },
  { icon: CalendarCheckIcon, label: 'Zero paper forms', color: 'text-emerald-600 dark:text-emerald-400' },
  { icon: BadgeCheckIcon, label: 'Auto certificates', color: 'text-amber-600 dark:text-amber-400' },
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-4 pt-12 pb-16 sm:px-6 lg:pt-16 lg:pb-22">
        <h1 className="font-display text-4xl leading-[1.08] font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl max-w-4xl">
          Run every campus event{' '}
          <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            without the paperwork
          </span>
        </h1>

        <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg max-w-3xl">
          Campus Pulse replaces registration desks, attendance sheets, WhatsApp
          spam and last-minute certificate printing with one dashboard.
          Publish an event, collect registrations, scan QR passes at the gate
          and watch the numbers update live.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row pt-1">
          <Button
            size="lg"
            className="h-11 px-5 text-sm bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/20 border-0 transition-all hover:shadow-indigo-500/30"
            render={<Link to="/events" />}
          >
            Explore events
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
          {highlights.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium"
            >
              <item.icon className={`size-4 ${item.color}`} />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
