import React from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, ArrowLeft, Ticket, CalendarDays, Sparkles } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AnimatedGradientBg } from '@/components/ui/animated-gradient-bg'
import { RoleLoginForm } from '@/components/auth/role-login-form'
import { Badge } from '@/components/ui/badge'

export default function StudentLoginPage() {
  return (
    <AnimatedGradientBg accentColor="student">
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <main className="flex-1 px-4 py-8 sm:py-12">
          <div className="mx-auto max-w-5xl">
            {/* Back Button */}
            <div className="mb-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors bg-white/60 px-3 py-1.5 rounded-full border border-slate-200/80 backdrop-blur-md"
              >
                <ArrowLeft className="size-3.5" />
                All Portals
              </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Student Information & Highlights */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:text-emerald-300 mb-3 px-3 py-1 text-xs">
                    <GraduationCap className="size-3.5 mr-1.5 inline" />
                    Student Access Portal
                  </Badge>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Experience Campus Events at Your Fingertips
                  </h1>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Log in with your Roll Number or Student Email to discover upcoming hackathons, fests, workshops, and manage your QR event passes.
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-3.5 border border-slate-200/60 backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      <Ticket className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Instant QR Entry Passes</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Get your digital ticket code instantly after event registration for fast venue check-ins.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-3.5 border border-slate-200/60 backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                      <CalendarDays className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Live Event Schedule & Alerts</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Stay updated on venue changes, schedule updates, and urgent announcement notifications.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-3.5 border border-slate-200/60 backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                      <Sparkles className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Team Formation & Certificates</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Form hackathon teams with classmates and collect digital participation badges.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dedicated Student Login Form */}
              <div className="lg:col-span-6">
                <RoleLoginForm initialRole="student" showRoleTabs={false} redirectUrl="/events" />
              </div>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </AnimatedGradientBg>
  )
}
