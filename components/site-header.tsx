import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  BellIcon,
  CalendarDaysIcon,
  LayoutDashboardIcon,
  MenuIcon,
  QrCodeIcon,
  TicketIcon,
  XIcon,
  ZapIcon,
  LogOutIcon,
  LogInIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { formatDateTime } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function SiteHeader() {
  const location = useLocation()
  const pathname = location.pathname
  const { role, user, announcements, markAllAnnouncementsRead, getEvent, isLoggedIn, logout } =
    useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const unread = announcements.filter((a) => !a.read).length

  // Build role-based links dynamically per user requirements:
  // - Home & Events: always visible
  // - My Passes: visible ONLY when logged in as participant (student)
  // - Organizer: visible ONLY when logged in as event organizer / admin
  const links = [
    { href: '/', label: 'Home', icon: ZapIcon },
    { href: '/events', label: 'Events', icon: CalendarDaysIcon },
    ...(isLoggedIn && role === 'student'
      ? [{ href: '/my-passes', label: 'My Passes', icon: TicketIcon }]
      : []),
    ...(isLoggedIn && (role === 'organizer' || role === 'admin')
      ? [{ href: '/dashboard', label: 'Organizer', icon: LayoutDashboardIcon }]
      : []),
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl print-hide">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <QrCodeIcon className="size-5" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            Campus Pulse
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Notifications */}
          <Popover onOpenChange={(open) => open && markAllAnnouncementsRead()}>
            <PopoverTrigger
              render={
                <Button variant="ghost" size="icon" className="relative" />
              }
              aria-label="Notifications"
            >
              <BellIcon />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {unread}
                </span>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-sm font-medium">Notifications</p>
                <Badge variant="secondary">{announcements.length}</Badge>
              </div>
              <Separator />
              <ul className="max-h-80 divide-y divide-border overflow-y-auto">
                {announcements.map((a) => (
                  <li key={a.id} className="flex flex-col gap-1 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{a.title}</p>
                      {a.priority === 'urgent' && (
                        <Badge variant="destructive">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {a.message}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {a.eventId === 'all'
                        ? 'All events'
                        : (getEvent(a.eventId)?.title ?? 'Event')}
                      {' · '}
                      {formatDateTime(a.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>

          {/* Profile Badge / Sign In Action */}
          {isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {user.name
                      .split(' ')
                      .map((p) => p[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <Badge variant="outline" className="capitalize text-[10px] py-0 px-1.5 hidden xl:inline-flex">
                  {role}
                </Badge>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="h-8 text-xs text-muted-foreground hover:text-foreground px-2"
                title="Sign out"
              >
                <LogOutIcon className="size-3.5 mr-1" />
                Sign out
              </Button>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:inline-flex">
              <Button size="sm" variant="default" className="h-8 text-xs px-3">
                <LogInIcon className="size-3.5 mr-1" />
                Sign In
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
