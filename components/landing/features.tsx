import {
  BellRingIcon,
  BarChart3Icon,
  ClipboardListIcon,
  FileBadgeIcon,
  ScanLineIcon,
  UsersRoundIcon,
  Layers,
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
    colorBg: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800/60',
    colorBorderHover: 'hover:border-violet-400 dark:hover:border-violet-600',
  },
  {
    icon: ScanLineIcon,
    title: 'QR pass check-in',
    body: 'Every registration issues a unique pass code. Volunteers verify it at the gate desk and attendance is marked instantly.',
    colorBg: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/60',
    colorBorderHover: 'hover:border-sky-400 dark:hover:border-sky-600',
  },
  {
    icon: FileBadgeIcon,
    title: 'Certificates on autopilot',
    body: 'Participation certificates unlock the moment attendance is confirmed. Students print their own copy, you print none.',
    colorBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60',
    colorBorderHover: 'hover:border-emerald-400 dark:hover:border-emerald-600',
  },
  {
    icon: BellRingIcon,
    title: 'Targeted announcements',
    body: 'Push venue changes or urgent updates to one event or the whole fest, and they land in every participant notification tray.',
    colorBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60',
    colorBorderHover: 'hover:border-amber-400 dark:hover:border-amber-600',
  },
  {
    icon: BarChart3Icon,
    title: 'Live fest analytics',
    body: 'Registrations by day, attendance rate, category split and department reach — the numbers your report needs, already charted.',
    colorBg: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60',
    colorBorderHover: 'hover:border-orange-400 dark:hover:border-orange-600',
  },
  {
    icon: UsersRoundIcon,
    title: 'One roster, no spreadsheets',
    body: 'Search, filter and export the participant roster for any event instead of merging five volunteer sheets at midnight.',
    colorBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60',
    colorBorderHover: 'hover:border-rose-400 dark:hover:border-rose-600',
  },
]

export function Features() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 sm:px-6">
      <div className="flex max-w-2xl flex-col gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <Layers className="size-3.5" />
          <span>Everything the core team asks for</span>
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Built to delete the manual work from fest week
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Each module maps to a job volunteers currently do by hand. Turn them
          on and the same fest runs with a fraction of the desk time.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className={`h-full transition-all duration-300 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-xs hover:shadow-lg ${feature.colorBorderHover} hover:-translate-y-0.5`}
          >
            <CardHeader>
              <span
                className={`mb-3 flex size-11 items-center justify-center rounded-xl shadow-xs ${feature.colorBg}`}
              >
                <feature.icon className="size-5" />
              </span>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-sm text-slate-600 dark:text-slate-400">
                {feature.body}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
