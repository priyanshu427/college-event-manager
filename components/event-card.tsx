'use client'

import Image from 'next/image'
import Link from 'next/link'
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
    <Card className="group flex flex-col gap-0 overflow-hidden p-0 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-16/9 overflow-hidden">
        <Image
          src={event.image || '/placeholder.svg'}
          alt={`${event.title} at the campus`}
          fill
          sizes="(min-width: 1024px) 400px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-col items-center rounded-xl bg-background/90 px-2.5 py-1.5 text-center backdrop-blur">
          <span className="font-display text-lg leading-none font-semibold">
            {dayOfMonth(event.date)}
          </span>
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {monthLabel(event.date)}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <Badge
            variant="outline"
            className={cn('backdrop-blur', categoryStyles[event.category])}
          >
            {event.category}
          </Badge>
          {event.status === 'live' && (
            <Badge className="bg-destructive/90 text-background">
              Live now
            </Badge>
          )}
          {registered && (
            <Badge variant="secondary" className="backdrop-blur">
              <CheckCircle2Icon />
              Registered
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="gap-1.5 px-4 pt-4">
        <CardTitle className="text-balance text-base leading-snug">
          {event.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 leading-relaxed">
          {event.tagline}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 px-4 pt-3 pb-4">
        <dl className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ClockIcon className="size-3.5 shrink-0" />
            <dd>
              {formatTime(event.startTime)} — {formatTime(event.endTime)}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="size-3.5 shrink-0" />
            <dd className="truncate">{event.venue}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <UsersIcon className="size-3.5 shrink-0" />
            <dd>
              {seatsTaken} registered
              {event.status === 'upcoming' ? ` · ${seatsLeft} seats left` : ''}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${fillRate}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            {fillRate}% of {event.capacity} seats filled
          </p>
        </div>
      </CardContent>

      <CardFooter className="mt-auto items-center justify-between gap-2 px-4 py-3">
        <span className="text-sm font-medium">{formatFee(event.fee)}</span>
        <Button
          size="sm"
          variant={registered ? 'outline' : 'default'}
          render={<Link href={`/events/${event.id}`} />}
        >
          {registered ? 'View pass' : 'Register'}
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}
