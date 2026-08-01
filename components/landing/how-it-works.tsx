import {
  CalendarPlusIcon,
  ScanLineIcon,
  TicketIcon,
  TrophyIcon,
} from 'lucide-react'

const steps = [
  {
    icon: CalendarPlusIcon,
    title: 'Publish the event',
    body: 'The organizer adds the schedule, venue, capacity, fee and whether it is a team entry. It goes live on the student calendar immediately.',
  },
  {
    icon: TicketIcon,
    title: 'Students register',
    body: 'One form, validated. Each submission returns a digital pass with a unique QR code that lives in the student profile.',
  },
  {
    icon: ScanLineIcon,
    title: 'Scan at the gate',
    body: 'The check-in desk verifies the code, marks attendance and blocks duplicates. Counts update on the dashboard as people walk in.',
  },
  {
    icon: TrophyIcon,
    title: 'Close the loop',
    body: 'Certificates unlock for attendees, analytics compile the report, and the roster is ready to archive. Nothing left to chase.',
  },
]

export function HowItWorks() {
  return (
    <section className="relative isolate overflow-hidden border-y border-border/60 bg-card/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="text-sm font-medium text-primary">How it works</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Four steps from idea to closing report
          </h2>
        </div>

        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <step.icon className="size-5" />
                </span>
                <span className="font-display text-sm font-semibold text-muted-foreground">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="text-base font-medium">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
