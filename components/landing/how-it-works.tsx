import {
  CalendarPlusIcon,
  ScanLineIcon,
  TicketIcon,
  TrophyIcon,
  Compass,
} from 'lucide-react'

const steps = [
  {
    icon: CalendarPlusIcon,
    title: 'Publish the event',
    body: 'The organizer adds the schedule, venue, capacity, fee and whether it is a team entry. It goes live on the student calendar immediately.',
    badgeGradient: 'from-violet-500 to-indigo-600 text-white shadow-violet-500/20',
    stepNumberColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    icon: TicketIcon,
    title: 'Students register',
    body: 'One form, validated. Each submission returns a digital pass with a unique QR code that lives in the student profile.',
    badgeGradient: 'from-sky-500 to-blue-600 text-white shadow-sky-500/20',
    stepNumberColor: 'text-sky-600 dark:text-sky-400',
  },
  {
    icon: ScanLineIcon,
    title: 'Scan at the gate',
    body: 'The check-in desk verifies the code, marks attendance and blocks duplicates. Counts update on the dashboard as people walk in.',
    badgeGradient: 'from-emerald-500 to-teal-600 text-white shadow-emerald-500/20',
    stepNumberColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: TrophyIcon,
    title: 'Close the loop',
    body: 'Certificates unlock for attendees, analytics compile the report, and the roster is ready to archive. Nothing left to chase.',
    badgeGradient: 'from-amber-500 to-rose-600 text-white shadow-amber-500/20',
    stepNumberColor: 'text-amber-600 dark:text-amber-400',
  },
]

export function HowItWorks() {
  return (
    <section className="relative isolate overflow-hidden border-y border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 sm:px-6">
        <div className="flex max-w-2xl flex-col gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Compass className="size-3.5" />
            <span>How it works</span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Four steps from idea to closing report
          </h2>
        </div>

        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative flex flex-col gap-3.5 p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-md ${step.badgeGradient}`}
                >
                  <step.icon className="size-5" />
                </span>
                <span
                  className={`font-display text-xs font-bold uppercase tracking-wider ${step.stepNumberColor}`}
                >
                  Step {index + 1}
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mt-1">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
