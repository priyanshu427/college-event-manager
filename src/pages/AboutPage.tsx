import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  CalendarCheckIcon,
  GraduationCapIcon,
  HeartIcon,
  LightbulbIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  TargetIcon,
  UsersIcon,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'


const values = [
  {
    icon: LightbulbIcon,
    title: 'Innovation First',
    body: 'We believe campus operations deserve the same thoughtful design as consumer apps. Every feature is built to replace a manual process.',
  },
  {
    icon: UsersIcon,
    title: 'Community Driven',
    body: 'Built by students, for students. Every decision is informed by real pain points we faced organising college fests ourselves.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Reliability Matters',
    body: 'When 500 students are queuing at the gate, the check-in system cannot go down. We design for the worst-case crowd.',
  },
  {
    icon: HeartIcon,
    title: 'Open & Accessible',
    body: 'No vendor lock-in, no per-seat pricing. Campus Pulse is a student project built to be used, forked, and improved by anyone.',
  },
]



export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden gradient-hero">
          <div className="pointer-events-none absolute inset-0 gradient-grid" />
          <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:pt-24 lg:pb-28">
            <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
              <div className="flex max-w-xl flex-col gap-6 lg:flex-1">

              <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                The story behind{' '}
                <span className="gradient-text">Campus Pulse</span>
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                Campus Pulse started as a 3rd-year college project to solve a
                problem we lived through every semester — the chaos of managing
                fest registrations, attendance, and certificates with
                spreadsheets, WhatsApp groups, and paper forms.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-11 px-5 text-sm"
                  render={<Link to="/events" />}
                >
                  Explore events
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 bg-background/60 px-5 text-sm backdrop-blur"
                  render={<Link to="/" />}
                >
                  <QrCodeIcon data-icon="inline-start" />
                  Back to home
                </Button>
              </div>
            </div>

              {/* Doodle Illustration */}
              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
                <svg
                  viewBox="0 0 420 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full max-w-md"
                  aria-hidden="true"
                >
                  {/* Floating Calendar Doodle */}
                  <g className="animate-[float_6s_ease-in-out_infinite]">
                    <rect x="60" y="40" width="120" height="110" rx="14" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" className="text-primary/40" />
                    <rect x="60" y="40" width="120" height="30" rx="14" stroke="currentColor" strokeWidth="2" className="text-primary/30" fill="currentColor" fillOpacity="0.06" />
                    <line x1="85" y1="85" x2="155" y2="85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground/30" />
                    <line x1="85" y1="100" x2="140" y2="100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground/30" />
                    <line x1="85" y1="115" x2="150" y2="115" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground/30" />
                    <line x1="85" y1="130" x2="125" y2="130" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground/30" />
                    {/* Calendar pins */}
                    <circle cx="95" cy="40" r="3" fill="currentColor" className="text-primary/50" />
                    <circle cx="145" cy="40" r="3" fill="currentColor" className="text-primary/50" />
                    <text x="90" y="60" fontSize="11" fontWeight="600" fill="currentColor" className="text-primary/60">Events</text>
                  </g>

                  {/* Floating QR Code Doodle */}
                  <g className="animate-[float_5s_ease-in-out_infinite_0.5s]">
                    <rect x="240" y="80" width="100" height="100" rx="12" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" className="text-primary/40" />
                    {/* QR pattern */}
                    <rect x="258" y="98" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1" className="text-primary/40" />
                    <rect x="304" y="98" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1" className="text-primary/40" />
                    <rect x="258" y="144" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1" className="text-primary/40" />
                    <rect x="282" y="122" width="16" height="16" rx="2" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1" className="text-primary/30" />
                    <rect x="304" y="144" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1" className="text-primary/30" />
                    <rect x="265" y="105" width="4" height="4" fill="currentColor" className="text-primary/60" />
                    <rect x="311" y="105" width="4" height="4" fill="currentColor" className="text-primary/60" />
                    <rect x="265" y="151" width="4" height="4" fill="currentColor" className="text-primary/60" />
                  </g>

                  {/* Certificate Doodle */}
                  <g className="animate-[float_7s_ease-in-out_infinite_1s]">
                    <rect x="100" y="210" width="140" height="95" rx="10" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" className="text-primary/35" />
                    <line x1="125" y1="235" x2="215" y2="235" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground/25" />
                    <line x1="125" y1="250" x2="200" y2="250" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground/25" />
                    <line x1="125" y1="265" x2="185" y2="265" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground/25" />
                    {/* Ribbon / seal */}
                    <circle cx="200" cy="280" r="10" stroke="currentColor" strokeWidth="1.5" className="text-primary/40" fill="currentColor" fillOpacity="0.08" />
                    <path d="M196 280l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60" />
                    <text x="130" y="228" fontSize="9" fontWeight="600" fill="currentColor" className="text-primary/50">CERTIFICATE</text>
                  </g>

                  {/* Checkmark badges */}
                  <g className="animate-[float_4s_ease-in-out_infinite_0.3s]">
                    <circle cx="310" cy="240" r="20" stroke="currentColor" strokeWidth="2" strokeDasharray="5 3" className="text-chart-2/40" fill="currentColor" fillOpacity="0.05" />
                    <path d="M300 240l6 6 14-14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-chart-2/60" />
                  </g>

                  <g className="animate-[float_5s_ease-in-out_infinite_1.5s]">
                    <circle cx="50" cy="200" r="14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" className="text-chart-3/40" fill="currentColor" fillOpacity="0.05" />
                    <path d="M44 200l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-chart-3/60" />
                  </g>

                  {/* Decorative stars */}
                  <g className="animate-[pulse_3s_ease-in-out_infinite]">
                    <path d="M30 80l3 6 6 1-4 4 1 7-6-3-6 3 1-7-4-4 6-1z" fill="currentColor" fillOpacity="0.15" className="text-primary" />
                  </g>
                  <g className="animate-[pulse_4s_ease-in-out_infinite_1s]">
                    <path d="M370 40l2 5 5 1-3 3 1 5-5-2-5 2 1-5-3-3 5-1z" fill="currentColor" fillOpacity="0.12" className="text-chart-2" />
                  </g>
                  <g className="animate-[pulse_3.5s_ease-in-out_infinite_0.5s]">
                    <path d="M350 310l3 6 6 1-4 4 1 7-6-3-6 3 1-7-4-4 6-1z" fill="currentColor" fillOpacity="0.12" className="text-primary" />
                  </g>

                  {/* Squiggly connecting lines */}
                  <path d="M180 95 Q200 70 240 110" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" className="text-primary/20" />
                  <path d="M240 180 Q220 200 240 230" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" className="text-primary/20" />
                  <path d="M170 150 Q130 180 140 210" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" className="text-primary/20" />

                  {/* Small floating dots */}
                  <circle cx="200" cy="30" r="3" fill="currentColor" fillOpacity="0.2" className="text-primary animate-[pulse_2s_ease-in-out_infinite]" />
                  <circle cx="380" cy="160" r="3" fill="currentColor" fillOpacity="0.15" className="text-chart-2 animate-[pulse_3s_ease-in-out_infinite_0.5s]" />
                  <circle cx="20" cy="290" r="3" fill="currentColor" fillOpacity="0.15" className="text-chart-3 animate-[pulse_2.5s_ease-in-out_infinite_1s]" />
                  <circle cx="330" cy="280" r="2" fill="currentColor" fillOpacity="0.2" className="text-primary animate-[pulse_3s_ease-in-out_infinite_0.8s]" />

                  {/* Users/people doodle */}
                  <g className="animate-[float_6s_ease-in-out_infinite_2s]">
                    <circle cx="60" cy="330" r="8" stroke="currentColor" strokeWidth="1.5" className="text-primary/35" />
                    <path d="M48 355 Q48 342 60 342 Q72 342 72 355" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary/35" fill="none" />
                    <circle cx="85" cy="325" r="8" stroke="currentColor" strokeWidth="1.5" className="text-primary/25" />
                    <path d="M73 350 Q73 337 85 337 Q97 337 97 350" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary/25" fill="none" />
                  </g>

                  {/* Analytics bar chart doodle */}
                  <g className="animate-[float_5s_ease-in-out_infinite_0.8s]">
                    <rect x="290" y="310" width="14" height="40" rx="3" stroke="currentColor" strokeWidth="1.5" className="text-primary/30" fill="currentColor" fillOpacity="0.06" />
                    <rect x="310" y="325" width="14" height="25" rx="3" stroke="currentColor" strokeWidth="1.5" className="text-chart-2/30" fill="currentColor" fillOpacity="0.06" />
                    <rect x="330" y="300" width="14" height="50" rx="3" stroke="currentColor" strokeWidth="1.5" className="text-chart-3/30" fill="currentColor" fillOpacity="0.06" />
                    <rect x="350" y="318" width="14" height="32" rx="3" stroke="currentColor" strokeWidth="1.5" className="text-primary/30" fill="currentColor" fillOpacity="0.06" />
                    <line x1="285" y1="350" x2="370" y2="350" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/20" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="border-y border-border/60 bg-card/40">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="flex flex-col gap-4">
                <p className="text-sm font-medium text-primary">Our Mission</p>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  Make every campus fest run like clockwork
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  Every semester, student organisers reinvent the wheel —
                  building Google Forms, printing ID cards, manually marking
                  attendance, and staying up until 2 AM generating participation
                  certificates. Campus Pulse replaces all of that with one
                  integrated platform.
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  Our goal is to give every college — not just the ones with
                  big budgets — a professional-grade event management tool
                  that's free, fast, and designed for the way Indian campus
                  fests actually work.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 rounded-2xl bg-background p-5 ring-1 ring-foreground/10">
                  <CalendarCheckIcon className="size-6 text-primary" />
                  <p className="font-display text-2xl font-semibold">8+</p>
                  <p className="text-sm text-muted-foreground">
                    Events managed
                  </p>
                </div>
                <div className="flex flex-col gap-2 rounded-2xl bg-background p-5 ring-1 ring-foreground/10">
                  <UsersIcon className="size-6 text-chart-2" />
                  <p className="font-display text-2xl font-semibold">500+</p>
                  <p className="text-sm text-muted-foreground">
                    Registrations processed
                  </p>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl bg-background p-5 ring-1 ring-foreground/10">
                  <TargetIcon className="size-6 text-chart-4" />
                  <p className="font-display text-2xl font-semibold">0</p>
                  <p className="text-sm text-muted-foreground">
                    Paper forms printed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="text-sm font-medium text-primary">What we believe</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Built on principles that matter
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card
                key={value.title}
                className="h-full transition-colors hover:bg-card/60 hover:ring-primary/25"
              >
                <CardHeader>
                  <span className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <value.icon className="size-5" />
                  </span>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {value.body}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>



        {/* CTA */}
        <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
          <div className="relative isolate overflow-hidden rounded-3xl gradient-hero px-6 py-14 ring-1 ring-foreground/10 sm:px-12">
            <div className="pointer-events-none absolute inset-0 gradient-grid" />
            <div className="relative flex max-w-2xl flex-col gap-5">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Ready to see it in action?
              </h2>
              <p className="leading-relaxed text-pretty text-muted-foreground">
                Explore the full demo — register for events, check in with QR
                passes, and see the analytics dashboard update in real time.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-11 px-5 text-sm"
                  render={<Link to="/events" />}
                >
                  Browse events
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 bg-background/60 px-5 text-sm backdrop-blur"
                  render={<Link to="/login" />}
                >
                  <GraduationCapIcon data-icon="inline-start" />
                  Sign in to get started
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
