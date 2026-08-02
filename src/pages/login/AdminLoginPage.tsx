import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowLeft, BarChart3, ShieldAlert } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { AnimatedGradientBg } from '@/components/ui/animated-gradient-bg'
import { RoleLoginForm } from '@/components/auth/role-login-form'
import { Badge } from '@/components/ui/badge'

export default function AdminLoginPage() {
  return (
    <AnimatedGradientBg accentColor="admin">
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
              {/* Left Column: Admin Information & Governance Controls */}
              <div className="lg:col-span-6 space-y-3">
                <div>
                  <Badge className="bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-300 mb-1.5 px-2.5 py-0.5 text-[11px]">
                    <ShieldCheck className="size-3 mr-1 inline" />
                    Campus Administration Portal
                  </Badge>
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    Central Governance & Analytics
                  </h1>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Audit campus-wide events, manage organizer permissions, and review analytics.
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-start gap-2.5 rounded-xl bg-white/70 p-2.5 border border-slate-200/60 backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      <BarChart3 className="size-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Campus-Wide Metrics</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        View total registrations, ticket revenue, and turnout.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl bg-white/70 p-2.5 border border-slate-200/60 backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      <ShieldAlert className="size-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Approval & Governance</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Review submitted proposals and manage organizer privileges.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dedicated Admin Login Form */}
              <div className="lg:col-span-6">
                <RoleLoginForm initialRole="admin" showRoleTabs={false} redirectUrl="/dashboard" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </AnimatedGradientBg>
  )
}
