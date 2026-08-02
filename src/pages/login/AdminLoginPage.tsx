import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowLeft, BarChart3, ShieldAlert, Lock } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AnimatedGradientBg } from '@/components/ui/animated-gradient-bg'
import { RoleLoginForm } from '@/components/auth/role-login-form'
import { Badge } from '@/components/ui/badge'

export default function AdminLoginPage() {
  return (
    <AnimatedGradientBg accentColor="admin">
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
              {/* Left Column: Admin Information & Governance Controls */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <Badge className="bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-300 mb-3 px-3 py-1 text-xs">
                    <ShieldCheck className="size-3.5 mr-1.5 inline" />
                    Campus Administration Portal
                  </Badge>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Central Governance & Campus Analytics
                  </h1>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Log in with your Administrator credentials or Security Passcode to audit campus-wide events, manage organizer permissions, and review analytics.
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-3.5 border border-slate-200/60 backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      <BarChart3 className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Campus-Wide Participation Metrics</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        View total registrations, ticket revenue, department turnout, and capacity utilization across all clubs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-3.5 border border-slate-200/60 backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      <ShieldAlert className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Event Approval & Compliance</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Review submitted event proposals, venue allocation requests, and grant approval badges.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-3.5 border border-slate-200/60 backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                      <Lock className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Role Management & System Logs</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Manage organizer privileges, inspect security audit logs, and maintain system data integrity.
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

        <SiteFooter />
      </div>
    </AnimatedGradientBg>
  )
}
