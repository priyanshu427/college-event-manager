'use client'

import { useMemo, useState } from 'react'
import { SearchIcon, SlidersHorizontalIcon } from 'lucide-react'
import { useStore } from '@/lib/store'
import { EVENT_CATEGORIES } from '@/lib/format'
import type { EventStatus } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EventCard } from '@/components/event-card'
import { cn } from '@/lib/utils'

const statusTabs: { value: EventStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'live', label: 'Live' },
  { value: 'completed', label: 'Completed' },
]

export function EventsBrowser() {
  const { events, registrationsFor, isRegistered } = useStore()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [status, setStatus] = useState<EventStatus | 'all'>('all')
  const [sort, setSort] = useState('date')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = events.filter((event) => {
      const matchesQuery =
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.tagline.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q) ||
        event.department.toLowerCase().includes(q) ||
        event.organizer.toLowerCase().includes(q) ||
        event.tags.some((t) => t.toLowerCase().includes(q))
      const matchesCategory = category === 'all' || event.category === category
      const matchesStatus = status === 'all' || event.status === status
      return matchesQuery && matchesCategory && matchesStatus
    })

    return [...list].sort((a, b) => {
      if (sort === 'popular') {
        return registrationsFor(b.id).length - registrationsFor(a.id).length
      }
      if (sort === 'fee') return a.fee - b.fee
      return a.date.localeCompare(b.date)
    })
  }, [events, query, category, status, sort, registrationsFor])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-white/30 backdrop-blur-md p-4 border border-white/60 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by event, venue, club or tag"
              className="h-10 pl-9 bg-white/70 backdrop-blur-md border border-white/60 text-slate-900 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-primary shadow-none"
              aria-label="Search events"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              items={[
                { value: 'all', label: 'All categories' },
                ...EVENT_CATEGORIES.map((c) => ({ value: c, label: c })),
              ]}
              value={category}
              onValueChange={(value) => setCategory(String(value))}
            >
              <SelectTrigger className="h-10 min-w-40 bg-white/70 backdrop-blur-md border border-white/60 text-slate-900 shadow-none" aria-label="Category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-xl">
                <SelectGroup>
                  <SelectItem value="all" className="text-slate-900 hover:bg-slate-100 cursor-pointer">All categories</SelectItem>
                  {EVENT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="text-slate-900 hover:bg-slate-100 cursor-pointer">
                      {c}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              items={[
                { value: 'date', label: 'Soonest first' },
                { value: 'popular', label: 'Most registered' },
                { value: 'fee', label: 'Lowest fee' },
              ]}
              value={sort}
              onValueChange={(value) => setSort(String(value))}
            >
              <SelectTrigger className="h-10 min-w-40 bg-white/70 backdrop-blur-md border border-white/60 text-slate-900 shadow-none" aria-label="Sort by">
                <SlidersHorizontalIcon className="text-slate-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-xl">
                <SelectGroup>
                  <SelectItem value="date" className="text-slate-900 hover:bg-slate-100 cursor-pointer">Soonest first</SelectItem>
                  <SelectItem value="popular" className="text-slate-900 hover:bg-slate-100 cursor-pointer">Most registered</SelectItem>
                  <SelectItem value="fee" className="text-slate-900 hover:bg-slate-100 cursor-pointer">Lowest fee</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {statusTabs.map((tab) => (
            <Button
              key={tab.value}
              size="sm"
              variant={status === tab.value ? 'default' : 'outline'}
              className={cn(
                status === tab.value
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-white/70 backdrop-blur-md border border-white/60 text-slate-700 hover:bg-white/90 hover:text-slate-900'
              )}
              onClick={() => setStatus(tab.value)}
            >
              {tab.label}
              <Badge
                variant="secondary"
                className={cn(
                  'ml-1',
                  status === tab.value ? 'bg-primary-foreground/20 text-white' : 'bg-slate-100 text-slate-700'
                )}
              >
                {tab.value === 'all'
                  ? events.length
                  : events.filter((e) => e.status === tab.value).length}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500 font-medium">
        Showing {filtered.length} of {events.length} events
      </p>

      {filtered.length === 0 ? (
        <Empty className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md shadow-sm">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-primary/10 text-primary">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle className="text-slate-900 font-bold">No events matched</EmptyTitle>
            <EmptyDescription className="text-slate-600">
              Try a different keyword, or clear the category and status filters.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-8 lg:gap-10 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              registered={isRegistered(event.id)}
              seatsTaken={registrationsFor(event.id).length}
            />
          ))}
        </div>
      )}
    </div>
  )
}
