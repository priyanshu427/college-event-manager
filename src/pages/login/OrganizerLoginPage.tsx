import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, ArrowLeft, QrCode, Users } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { AnimatedGradientBg } from '@/components/ui/animated-gradient-bg'
import { RoleLoginForm } from '@/components/auth/role-login-form'
import { Badge } from '@/components/ui/badge'

export default function OrganizerLoginPage() {
  return (
    <AnimatedGradientBg accentColor="organizer">
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <main className="flex-1 px-4 py-2 sm:py-3 flex items-center justify-center">
          <div className="mx-auto w-full max-w-5xl">
            {/* Back Button */}
            <div className="mb-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors bg-white/60 px-2.5 py-1 rounded-full border border-slate-200/80 backdrop-blur-md"
              >
                <ArrowLeft className="size-3" />
                All Portals
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Organizer Information & Features */}
              <div className="lg:col-span-6 space-y-3">
                <div>
                  <Badge className="bg-purple-500/10 text-purple-700 border-purple-300 dark:text-purple-300 mb-1.5 px-2.5 py-0.5 text-[11px]">
                    <Building2 className="size-3 mr-1 inline" />
                    Event Organizer Portal
                  </Badge>
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    Streamline Campus Event Operations
                  </h1>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Create events, broadcast live announcements, and scan QR passes at the entrance.
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-start gap-2.5 rounded-xl bg-white/70 p-2.5 border border-slate-200/60 backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      <QrCode className="size-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">High-Speed Scanner & Check-in</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Scan student QR tickets for instant check-in.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl bg-white/70 p-2.5 border border-slate-200/60 backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      <Users className="size-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Real-Time Roster & Analytics</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Monitor live attendance numbers and registration lists.
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
      </div>
    </AnimatedGradientBg>
  )
}
