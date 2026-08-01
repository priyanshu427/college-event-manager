'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AnimatedGradientBgProps {
  children?: React.ReactNode
  className?: string
  accentColor?: 'student' | 'organizer' | 'admin' | 'neutral'
}

export function AnimatedGradientBg({
  children,
  className,
  accentColor = 'neutral',
}: AnimatedGradientBgProps) {
  // Role-specific gradient orb highlights
  const getOrb1Color = () => {
    switch (accentColor) {
      case 'student':
        return 'bg-gradient-to-tr from-emerald-300 via-teal-300 to-cyan-300 opacity-60'
      case 'organizer':
        return 'bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-400 opacity-60'
      case 'admin':
        return 'bg-gradient-to-tr from-amber-300 via-rose-300 to-orange-400 opacity-60'
      default:
        return 'bg-gradient-to-tr from-blue-300 via-indigo-200 to-sky-300 opacity-60'
    }
  }

  const getOrb2Color = () => {
    switch (accentColor) {
      case 'student':
        return 'bg-gradient-to-br from-cyan-200 via-sky-300 to-blue-300 opacity-60'
      case 'organizer':
        return 'bg-gradient-to-br from-fuchsia-300 via-pink-300 to-purple-300 opacity-60'
      case 'admin':
        return 'bg-gradient-to-br from-rose-300 via-amber-200 to-red-300 opacity-60'
      default:
        return 'bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 opacity-60'
    }
  }

  return (
    <div className={cn('relative min-h-screen w-full overflow-hidden light-gradient-bg', className)}>
      {/* Animated Floating Gradient Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Orb 1 - Top Left / Dynamic */}
        <div
          className={cn(
            'animate-orb-1 absolute -top-24 -left-20 size-[480px] rounded-full filter blur-[70px] sm:size-[600px]',
            getOrb1Color()
          )}
        />

        {/* Orb 2 - Top Right */}
        <div
          className={cn(
            'animate-orb-2 absolute -top-16 -right-20 size-[450px] rounded-full filter blur-[75px] sm:size-[550px]',
            getOrb2Color()
          )}
        />

        {/* Orb 3 - Bottom Left */}
        <div className="animate-orb-3 absolute -bottom-32 -left-16 size-[400px] rounded-full bg-gradient-to-tr from-violet-300 via-sky-200 to-emerald-200 opacity-50 filter blur-[80px] sm:size-[500px]" />

        {/* Orb 4 - Bottom Right */}
        <div className="animate-orb-4 absolute -bottom-24 -right-24 size-[450px] rounded-full bg-gradient-to-br from-amber-200 via-pink-200 to-rose-300 opacity-55 filter blur-[75px] sm:size-[520px]" />

        {/* Floating Accent Sparkles Glow */}
        <div className="animate-pulse absolute top-1/2 left-1/2 size-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-teal-200/40 via-purple-200/40 to-amber-200/40 filter blur-[90px]" />

        {/* Geometric Soft Grid Mesh Overlay for depth */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
