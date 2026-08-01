import React from 'react'
import Link from 'next/link'
import { Building2, ArrowLeft, QrCode, Users, Layers, Sparkles } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AnimatedGradientBg } from '@/components/ui/animated-gradient-bg'
import { RoleLoginForm } from '@/components/auth/role-login-form'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Organizer Portal Login | Campus Pulse',
  description: 'Sign in to the Organizer Portal to publish events, scan participant QR codes, and view registration analytics.',
}

export default function OrganizerLoginPage() {
  return (
    <AnimatedGradientBg accentColor="organizer">
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <main className="flex-1 px-4 py-8 sm:py-12">
          <div className="mx-auto max-w-5xl">
            {/* Back Button */}
            <div className="mb-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors bg-white/60 px-3 py-1.5 rounded-full border border-slate-200/80 backdrop-blur-md"
              >
                <ArrowLeft className="size-3.5" />
                All Portals
              </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Organizer Information & Features */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <Badge className="bg-purple-500/10 text-purple-700 border-purple-300 dark:text-purple-300 mb-3 px-3 py-1 text-xs">
                    <Building2 className="size-3.5 mr-1.5 inline" />
                    Event Organizer Portal
                  </Badge>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Streamline Campus Event Operations
                  </h1>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Log in with your Faculty or Club Organizer ID to create new events, broadcast live announcements, and scan QR passes at the entrance.
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-3.5 border border-slate-200/60 backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      <QrCode className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">High-Speed Scanner & Check-in</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Scan student QR tickets using any device camera or enter code manually for instant check-in.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-3.5 border border-slate-200/60 backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      <Users className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Real-Time Registration Roster</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Monitor live attendance numbers, paid/unpaid status, and download participant lists.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-3.5 border border-slate-200/60 backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                      <Layers className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Broadcast Alerts & Announcements</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Send instant notification updates to all registered attendees for venue changes or schedule shifts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dedicated Organizer Login Form */}
              <div className="lg:col-span-6">
                <RoleLoginForm initialRole="organizer" showRoleTabs={false} redirectUrl="/dashboard" />
              </div>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </AnimatedGradientBg>
  )
}
