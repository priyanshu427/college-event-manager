import React from 'react'
import { Sparkles } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AnimatedGradientBg } from '@/components/ui/animated-gradient-bg'
import { RoleLoginForm } from '@/components/auth/role-login-form'

export default function HomePage() {
  return (
    <AnimatedGradientBg accentColor="neutral">
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <main className="flex-1 px-4 py-8 sm:py-12 lg:py-16">
          <div className="mx-auto max-w-6xl">
            {/* Top Heading */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur-md border border-slate-200/80 dark:bg-slate-900/80 dark:border-slate-800 mb-3">
                <Sparkles className="size-3.5 text-amber-500" />
                <span>Campus Operations & Event Portals</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
                Sign In to Campus Pulse
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                Select your role below to access the Student, Organizer, or Admin portal.
              </p>
            </div>

            {/* Main Interactive Role Login Form */}
            <RoleLoginForm initialRole="student" showRoleTabs={true} />
          </div>
        </main>

        <SiteFooter />
      </div>
    </AnimatedGradientBg>
  )
}
