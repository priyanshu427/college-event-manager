import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from 'lucide-react'
import type { EventItem } from '@/lib/types'
import {
  categoryStyles,
  dayOfMonth,
  formatFee,
  formatTime,
  monthLabel,
} from '@/lib/format'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function EventCard({
  event,
  registered,
  seatsTaken,
}: {
  event: EventItem
  registered: boolean
  seatsTaken: number
}) {
  const fillRate = Math.min(
    100,
    Math.round((seatsTaken / Math.max(1, event.capacity)) * 100),
  )
  const seatsLeft = Math.max(0, event.capacity - seatsTaken)

  return (
    <Card className="group flex flex-col gap-0 overflow-hidden p-0 transition-all hover:-translate-y-0.5 rounded-2xl border border-white/60 bg-white/70 shadow-sm backdrop-blur-md">
      <div className="relative aspect-[16/7.5] overflow-hidden">
        <img
          src={event.image || '/events/tech-fest.png'}
          alt={`${event.title} at the campus`}
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = '/events/tech-fest.png'
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        <div className="absolute top-2.5 left-2.5 flex flex-col items-center rounded-lg bg-white/80 border border-white/60 px-2 py-0.5 text-center backdrop-blur shadow-xs">
          <span className="font-display text-sm leading-none font-bold text-slate-900">
            {dayOfMonth(event.date)}
          </span>
          <span className="text-[8px] font-semibold tracking-wide text-slate-600 uppercase">
            {monthLabel(event.date)}
          </span>
        </div>
        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
          <Badge
            variant="outline"
            className={cn('backdrop-blur text-[9px] py-0 px-1.5 h-5 bg-white/80 border-white/60', categoryStyles[event.category])}
          >
            {event.category}
          </Badge>
          {event.status === 'live' && (
            <Badge className="bg-destructive/90 text-white text-[9px] py-0 px-1.5 h-5 shadow-xs">
              Live now
            </Badge>
          )}
          {registered && (
            <Badge variant="secondary" className="backdrop-blur text-[9px] py-0 px-1.5 h-5 bg-emerald-100/90 text-emerald-800 border-emerald-200 shadow-xs">
              <CheckCircle2Icon className="size-2.5" />
              Registered
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="gap-1 px-5 pt-4 pb-1">
        <CardTitle className="text-balance text-sm sm:text-base font-bold leading-tight truncate text-slate-900">
          {event.title}
        </CardTitle>
        <CardDescription className="line-clamp-1 text-xs leading-normal text-slate-500">
          {event.tagline}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-2.5 px-5 pt-2 pb-4">
        <dl className="flex flex-col gap-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ClockIcon className="size-3.5 shrink-0 text-slate-400" />
            <dd>
              {formatTime(event.startTime)} — {formatTime(event.endTime)}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="size-3.5 shrink-0 text-slate-400" />
            <dd className="truncate">{event.venue}</dd>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="size-3.5 shrink-0 text-slate-400" />
            <dd>
              {seatsTaken} registered
              {event.status === 'upcoming' ? ` · ${seatsLeft} seats left` : ''}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-1 mt-auto pt-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/60">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${fillRate}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            {fillRate}% of {event.capacity} seats filled
          </p>
        </div>
      </CardContent>

      <CardFooter className="mt-auto items-center justify-between gap-2 px-5 py-3 border-t border-slate-100/70">
        <span className="text-xs sm:text-sm font-bold text-slate-900">{formatFee(event.fee)}</span>
        <Button
          size="sm"
          variant={registered ? 'outline' : 'default'}
          render={<Link to={`/events/${event.id}`} />}
          className="h-8 px-3 text-xs rounded-xl font-semibold shadow-xs"
        >
          {registered ? 'View pass' : 'Register'}
          <ArrowRightIcon className="size-3.5 ml-1" data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}
