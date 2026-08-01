import {
  BellRingIcon,
  BarChart3Icon,
  ClipboardListIcon,
  FileBadgeIcon,
  ScanLineIcon,
  UsersRoundIcon,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const features = [
  {
    icon: ClipboardListIcon,
    title: 'Smart registration forms',
    body: 'Solo or team entries, department and year capture, fee status and capacity limits — validated before a student can submit.',
  },
  {
    icon: ScanLineIcon,
    title: 'QR pass check-in',
    body: 'Every registration issues a unique pass code. Volunteers verify it at the gate desk and attendance is marked instantly.',
  },
  {
    icon: FileBadgeIcon,
    title: 'Certificates on autopilot',
    body: 'Participation certificates unlock the moment attendance is confirmed. Students print their own copy, you print none.',
  },
  {
    icon: BellRingIcon,
    title: 'Targeted announcements',
    body: 'Push venue changes or urgent updates to one event or the whole fest, and they land in every participant notification tray.',
  },
  {
    icon: BarChart3Icon,
    title: 'Live fest analytics',
    body: 'Registrations by day, attendance rate, category split and department reach — the numbers your report needs, already charted.',
  },
  {
    icon: UsersRoundIcon,
    title: 'One roster, no spreadsheets',
    body: 'Search, filter and export the participant roster for any event instead of merging five volunteer sheets at midnight.',
  },
]

export function Features() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <div className="flex max-w-2xl flex-col gap-3">
        <p className="text-sm font-medium text-primary">
          Everything the core team asks for
        </p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Built to delete the manual work from fest week
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Each module maps to a job volunteers currently do by hand. Turn them
          on and the same fest runs with a fraction of the desk time.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="h-full transition-colors hover:bg-card/60 hover:ring-primary/25"
          >
            <CardHeader>
              <span className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <feature.icon className="size-5" />
              </span>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed">
                {feature.body}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
