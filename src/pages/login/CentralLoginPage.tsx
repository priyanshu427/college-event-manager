import React from 'react'
import { SiteHeader } from '@/components/site-header'
import { AnimatedGradientBg } from '@/components/ui/animated-gradient-bg'
import { RoleLoginForm } from '@/components/auth/role-login-form'

export default function CentralLoginPage() {
  return (
    <AnimatedGradientBg accentColor="neutral">
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <main className="flex-1 px-4 py-2 sm:py-3 flex items-center justify-center">
          <div className="mx-auto w-full max-w-4xl">
            {/* Main Interactive Role Login Form with dynamic heading */}
            <RoleLoginForm initialRole="student" showRoleTabs={true} />
          </div>
        </main>
      </div>
    </AnimatedGradientBg>
  )
}
