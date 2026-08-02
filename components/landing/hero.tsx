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
  { icon: ScanLineIcon, label: '6 sec QR check-in' },
  { icon: CalendarCheckIcon, label: 'Zero paper forms' },
  { icon: BadgeCheckIcon, label: 'Auto certificates' },
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden gradient-hero">
      <div className="pointer-events-none absolute inset-0 gradient-grid" />
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-4 pt-16 pb-20 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:pt-24 lg:pb-28">
        <div className="flex max-w-xl flex-col items-start gap-6">
          <Badge
            variant="outline"
            className="h-7 border-primary/30 bg-background/70 px-3 text-primary backdrop-blur"
          >
            <SparklesIcon />
            Fest season 2026 · {COLLEGE_NAME}
          </Badge>

          <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Run every campus event{' '}
            <span className="gradient-text">without the paperwork</span>
          </h1>

          <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            Campus Pulse replaces registration desks, attendance sheets, WhatsApp
            spam and last-minute certificate printing with one dashboard.
            Publish an event, collect registrations, scan QR passes at the gate
            and watch the numbers update live.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-11 px-5 text-sm"
              render={<Link to="/events" />}
            >
              Explore events
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 bg-background/60 px-5 text-sm backdrop-blur"
              render={<Link to="/dashboard" />}
            >
              <QrCodeIcon data-icon="inline-start" />
              Open organizer dashboard
            </Button>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
            {highlights.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <item.icon className="size-4 text-primary" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative w-full max-w-xl lg:max-w-none lg:flex-1">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl ring-1 ring-foreground/10 shadow-2xl">
            <img
              src="/events/tech-fest.png"
              alt="Students walking between exhibition stalls at the campus tech fest"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 -left-3 w-56 rounded-2xl bg-card/95 p-4 ring-1 ring-foreground/10 shadow-xl backdrop-blur sm:left-6">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <ScanLineIcon className="size-4" />
              </span>
              <div className="flex flex-col">
                <p className="text-xs text-muted-foreground">Gate check-in</p>
                <p className="text-sm font-medium">SIT-7KQ4MZ verified</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-4/5 rounded-full bg-primary" />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              412 of 520 passes scanned
            </p>
          </div>

          <div className="absolute -top-4 right-0 flex items-center gap-2 rounded-2xl bg-card/95 px-4 py-3 ring-1 ring-foreground/10 shadow-xl backdrop-blur sm:right-4">
            <span className="flex size-8 items-center justify-center rounded-lg bg-chart-2/15 text-chart-2">
              <TrendingUpIcon className="size-4" />
            </span>
            <div className="flex flex-col leading-tight">
              <p className="font-display text-lg font-semibold">+38%</p>
              <p className="text-[11px] text-muted-foreground">
                registrations vs last fest
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
