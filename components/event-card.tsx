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
    <Card className="group flex flex-col gap-0 overflow-hidden p-0 transition-all hover:-translate-y-0.5 hover:shadow-md rounded-2xl border">
      <div className="relative aspect-[16/7.5] overflow-hidden">
        <img
          src={event.image || '/events/tech-fest.png'}
          alt={`${event.title} at the campus`}
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = '/events/tech-fest.png'
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
        <div className="absolute top-2 left-2 flex flex-col items-center rounded-lg bg-background/90 px-2 py-0.5 text-center backdrop-blur">
          <span className="font-display text-sm leading-none font-bold">
            {dayOfMonth(event.date)}
          </span>
          <span className="text-[8px] font-medium tracking-wide text-muted-foreground uppercase">
            {monthLabel(event.date)}
          </span>
        </div>
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          <Badge
            variant="outline"
            className={cn('backdrop-blur text-[9px] py-0 px-1.5 h-5', categoryStyles[event.category])}
          >
            {event.category}
          </Badge>
          {event.status === 'live' && (
            <Badge className="bg-destructive/90 text-background text-[9px] py-0 px-1.5 h-5">
              Live now
            </Badge>
          )}
          {registered && (
            <Badge variant="secondary" className="backdrop-blur text-[9px] py-0 px-1.5 h-5">
              <CheckCircle2Icon className="size-2.5" />
              Registered
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="gap-0.5 px-3.5 pt-2.5 pb-0.5">
        <CardTitle className="text-balance text-xs sm:text-sm font-bold leading-tight truncate">
          {event.title}
        </CardTitle>
        <CardDescription className="line-clamp-1 text-[11px] leading-normal text-muted-foreground">
          {event.tagline}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-1.5 px-3.5 pt-1.5 pb-2.5">
        <dl className="flex flex-col gap-0.5 text-[10px] sm:text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ClockIcon className="size-3 shrink-0 text-primary/70" />
            <dd>
              {formatTime(event.startTime)} — {formatTime(event.endTime)}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="size-3 shrink-0 text-primary/70" />
            <dd className="truncate">{event.venue}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <UsersIcon className="size-3 shrink-0 text-primary/70" />
            <dd>
              {seatsTaken} registered
              {event.status === 'upcoming' ? ` · ${seatsLeft} seats left` : ''}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-0.5 mt-auto pt-1">
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${fillRate}%` }}
            />
          </div>
          <p className="text-[9px] text-muted-foreground">
            {fillRate}% of {event.capacity} seats filled
          </p>
        </div>
      </CardContent>

      <CardFooter className="mt-auto items-center justify-between gap-2 px-3.5 py-2 border-t border-border/40">
        <span className="text-[11px] sm:text-xs font-bold text-foreground">{formatFee(event.fee)}</span>
        <Button
          size="sm"
          variant={registered ? 'outline' : 'default'}
          render={<Link to={`/events/${event.id}`} />}
          className="h-7 px-2.5 text-[11px] rounded-lg font-medium"
        >
          {registered ? 'View pass' : 'Register'}
          <ArrowRightIcon className="size-3 ml-0.5" data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}
