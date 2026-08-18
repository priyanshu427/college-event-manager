import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CalendarCheckIcon,
  QrCodeIcon,
  ScanLineIcon,
  SparklesIcon,
  TrendingUpIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { COLLEGE_NAME } from '@/lib/seed-data'

const highlights = [
  { icon: ScanLineIcon, label: '6 sec QR check-in', color: 'text-cyan-600 dark:text-cyan-400' },
  { icon: CalendarCheckIcon, label: 'Zero paper forms', color: 'text-emerald-600 dark:text-emerald-400' },
  { icon: BadgeCheckIcon, label: 'Auto certificates', color: 'text-amber-600 dark:text-amber-400' },
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-4 pt-16 pb-20 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:pt-24 lg:pb-28">
        <div className="flex max-w-xl flex-col items-start gap-6">
          <Badge
            variant="outline"
            className="h-7.5 border-violet-500/20 bg-white/80 dark:bg-slate-900/80 px-3.5 text-violet-700 dark:text-violet-300 backdrop-blur-md shadow-xs shadow-violet-500/5 font-medium"
          >
            <SparklesIcon className="size-3.5 text-violet-500 mr-1.5" />
            Fest season 2026 · {COLLEGE_NAME}
          </Badge>

          <h1 className="font-display text-4xl leading-[1.08] font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Run every campus event{' '}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              without the paperwork
            </span>
          </h1>

          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            Campus Pulse replaces registration desks, attendance sheets, WhatsApp
            spam and last-minute certificate printing with one dashboard.
            Publish an event, collect registrations, scan QR passes at the gate
            and watch the numbers update live.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-11 px-5 text-sm bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/20 border-0 transition-all hover:shadow-indigo-500/30"
              render={<Link to="/events" />}
            >
              Explore events
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 bg-white/80 dark:bg-slate-900/80 px-5 text-sm backdrop-blur-md border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-all text-slate-700 dark:text-slate-200"
              render={<Link to="/dashboard" />}
            >
              <QrCodeIcon data-icon="inline-start" className="text-indigo-600 dark:text-indigo-400" />
              Open organizer dashboard
            </Button>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
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

        <div className="relative w-full max-w-xl lg:max-w-none lg:flex-1">
          {/* Subtle Ambient Light Backdrop */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-violet-400/20 via-sky-300/20 to-emerald-300/20 rounded-3xl blur-2xl opacity-70 -z-10" />

          <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl ring-1 ring-slate-900/10 dark:ring-white/10 shadow-2xl bg-white dark:bg-slate-900">
            <img
              src="/events/tech-fest.png"
              alt="Students walking between exhibition stalls at the campus tech fest"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          </div>

          <div className="absolute -top-4 right-0 flex items-center gap-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 px-4 py-3 ring-1 ring-slate-200/80 dark:ring-slate-800 shadow-xl backdrop-blur-xl sm:right-4 border border-emerald-500/20">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <TrendingUpIcon className="size-4.5" />
            </span>
            <div className="flex flex-col leading-tight">
              <p className="font-display text-lg font-bold text-emerald-600 dark:text-emerald-400">+38%</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                registrations vs last fest
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
