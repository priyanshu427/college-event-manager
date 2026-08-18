import { Link } from 'react-router-dom'
import { ArrowRightIcon, ScanLineIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaBand() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
      <div className="relative isolate overflow-hidden rounded-3xl bg-white/75 dark:bg-slate-900/75 px-6 py-14 ring-1 ring-slate-200/80 dark:ring-slate-800 backdrop-blur-xl border border-indigo-200/50 dark:border-indigo-800/40 shadow-xl sm:px-12">
        {/* Soft Pastel Ambient Glows */}
        <div className="absolute -top-24 -right-24 size-72 bg-gradient-to-br from-violet-300/30 via-pink-200/30 to-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-72 bg-gradient-to-tr from-cyan-300/30 via-emerald-200/30 to-sky-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex max-w-2xl flex-col gap-5">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Your next fest can run with half the volunteers
          </h2>
          <p className="leading-relaxed text-pretty text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Try the full flow in this demo: register for an event as a student,
            switch to the organizer view, scan the pass code at the check-in
            desk and watch the analytics move.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <Button
              size="lg"
              className="h-11 px-5 text-sm bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/20 border-0 transition-all hover:shadow-indigo-500/30"
              render={<Link to="/events" />}
            >
              Register for an event
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 bg-white/80 dark:bg-slate-900/80 px-5 text-sm backdrop-blur-md border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-all text-slate-700 dark:text-slate-200"
              render={<Link to="/dashboard" />}
            >
              <ScanLineIcon data-icon="inline-start" className="text-indigo-600 dark:text-indigo-400" />
              Try the check-in desk
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
