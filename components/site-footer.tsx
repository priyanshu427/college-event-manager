import { Link } from 'react-router-dom'
import { QrCodeIcon } from 'lucide-react'
import { COLLEGE_NAME } from '@/lib/seed-data'

const columns = [
  {
    title: 'Platform',
    items: [
      { label: 'Browse events', href: '/events' },
      { label: 'My passes', href: '/my-passes' },
      { label: 'Organizer dashboard', href: '/dashboard' },
      { label: 'About us', href: '/about' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'QR registration forms', href: '/dashboard' },
      { label: 'Certificates', href: '/my-passes' },
      { label: 'Announcements', href: '/dashboard' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40 print-hide">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:justify-between">
        <div className="flex max-w-sm flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <QrCodeIcon className="size-5" />
            </span>
            <span className="font-display text-base font-semibold">
              Campus Pulse
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The event operations layer for {COLLEGE_NAME}. Registrations,
            passes, check-ins, certificates and analytics in a single place, so
            volunteers can stop chasing spreadsheets.
          </p>
        </div>

        <div className="flex flex-wrap gap-12">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <p className="text-sm font-medium">{column.title}</p>
              <ul className="flex flex-col gap-2">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Campus Pulse — a student project demo. Data resets on reload.</p>
          <p>Built for the campus fest core team.</p>
        </div>
      </div>
    </footer>
  )
}
