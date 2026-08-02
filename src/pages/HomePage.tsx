import React from 'react'
import { SiteHeader } from '@/components/site-header'
import { AnimatedGradientBg } from '@/components/ui/animated-gradient-bg'
import { RoleLoginForm } from '@/components/auth/role-login-form'

export default function HomePage() {
  return (
    <AnimatedGradientBg accentColor="neutral">
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <main className="flex-1 px-4 py-2 sm:py-3 flex items-center justify-center">
          <div className="mx-auto w-full max-w-4xl">
            {/* Compact Top Heading */}
            <div className="mb-2 text-center">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Sign In to Campus Pulse
              </h1>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                Select your role below to access the Student, Organizer, or Admin portal.
              </p>
            </div>

            {/* Main Interactive Role Login Form */}
            <RoleLoginForm initialRole="student" showRoleTabs={true} />
          </div>
        </main>
      </div>
    </AnimatedGradientBg>
  )
}
