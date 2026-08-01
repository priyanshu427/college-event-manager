'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Mail,
  UserCheck,
  QrCode,
  KeyRound,
  BadgeAlert,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import type { Role } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { demoUsers } from '@/lib/seed-data'
import { cn } from '@/lib/utils'

interface RoleLoginFormProps {
  initialRole?: Role
  showRoleTabs?: boolean
  redirectUrl?: string
}

export function RoleLoginForm({
  initialRole = 'student',
  showRoleTabs = true,
  redirectUrl,
}: RoleLoginFormProps) {
  const router = useRouter()
  const { role: currentRole, loginAsRole } = useStore()
  const [activeRole, setActiveRole] = useState<Role>(initialRole)

  // Form states
  const [identifier, setIdentifier] = useState(
    demoUsers[initialRole]?.email || ''
  )
  const [password, setPassword] = useState('demo1234')
  const [secondaryField, setSecondaryField] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Handle role tab change
  const handleTabChange = (role: Role) => {
    setActiveRole(role)
    setErrorMessage('')
    setIdentifier(demoUsers[role]?.email || '')
    setPassword('demo1234')
    setSecondaryField('')
  }

  // Quick 1-Click Demo Login
  const handleDemoLogin = (targetRole: Role) => {
    setIsSubmitting(true)
    setErrorMessage('')
    setTimeout(() => {
      loginAsRole(targetRole)
      setLoginSuccess(true)
      setIsSubmitting(false)

      setTimeout(() => {
        const dest =
          redirectUrl ||
          (targetRole === 'student'
            ? '/events'
            : targetRole === 'organizer'
            ? '/dashboard'
            : '/dashboard')
        router.push(dest)
      }, 900)
    }, 600)
  }

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or ID.')
      return
    }

    if (!password) {
      setErrorMessage('Please enter your password.')
      return
    }

    setIsSubmitting(true)

    // Simulate authentication process
    setTimeout(() => {
      setIsSubmitting(false)

      // Create login user based on input or demo fallback
      const customUser = {
        email: identifier.includes('@') ? identifier : `${identifier}@sit.edu.in`,
        name:
          activeRole === 'student'
            ? 'Student User'
            : activeRole === 'organizer'
            ? 'Event Organizer'
            : 'Campus Administrator',
        rollNumber: identifier.toUpperCase(),
      }

      loginAsRole(activeRole, customUser)
      setLoginSuccess(true)

      setTimeout(() => {
        const dest =
          redirectUrl ||
          (activeRole === 'student'
            ? '/events'
            : activeRole === 'organizer'
            ? '/dashboard'
            : '/dashboard')
        router.push(dest)
      }, 1000)
    }, 700)
  }

  // Role Metadata styling & configuration
  const roleConfig = {
    student: {
      title: 'Student Portal',
      subtitle: 'Access campus events, register for passes & view tickets',
      icon: GraduationCap,
      accentGradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-none',
      idLabel: 'Roll Number or Student Email',
      idPlaceholder: 'e.g. SIT21CS042 or student@sit.edu.in',
      demoUser: demoUsers.student,
    },
    organizer: {
      title: 'Organizer Portal',
      subtitle: 'Manage events, scan QR passes, & track attendance',
      icon: Building2,
      accentGradient: 'from-indigo-500 via-purple-500 to-pink-500',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
      buttonBg: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200 dark:shadow-none',
      idLabel: 'Organizer ID or Faculty Email',
      idPlaceholder: 'e.g. ORG-FAC-809 or meera.organizer@sit.edu.in',
      demoUser: demoUsers.organizer,
    },
    admin: {
      title: 'Admin Portal',
      subtitle: 'System governance, role approvals, & campus analytics',
      icon: ShieldCheck,
      accentGradient: 'from-amber-500 via-rose-500 to-orange-500',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200 dark:shadow-none',
      idLabel: 'Admin Email or Security Key',
      idPlaceholder: 'e.g. admin.dean@sit.edu.in',
      demoUser: demoUsers.admin,
    },
  }

  const currentConfig = roleConfig[activeRole]
  const ActiveIcon = currentConfig.icon

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Role Selection Tabs */}
      {showRoleTabs && (
        <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-2xl bg-white/80 p-1.5 backdrop-blur-md shadow-sm border border-slate-200/80 dark:bg-slate-900/80 dark:border-slate-800">
          {(['student', 'organizer', 'admin'] as Role[]).map((r) => {
            const isSelected = activeRole === r
            const Icon = roleConfig[r].icon
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleTabChange(r)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-xl py-2.5 px-2 text-xs font-semibold transition-all duration-200',
                  isSelected
                    ? 'bg-white text-slate-900 shadow-md dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                )}
              >
                <Icon className={cn('size-4', isSelected ? 'text-primary' : 'text-slate-400')} />
                <span className="capitalize">{r === 'organizer' ? 'Organizer' : r}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Main Glassmorphic Card */}
      <div className="relative overflow-hidden rounded-3xl glass-card-light p-6 sm:p-8 transition-all duration-300">
        {/* Top Decorative Gradient Line */}
        <div
          className={cn(
            'absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r',
            currentConfig.accentGradient
          )}
        />

        {/* Role Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-white shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <ActiveIcon className="size-7 text-primary" />
          </div>

          <Badge variant="outline" className={cn('mb-2 font-medium px-3 py-0.5', currentConfig.badgeBg)}>
            {currentConfig.title}
          </Badge>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sign in to Campus Pulse
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {currentConfig.subtitle}
          </p>
        </div>

        {/* Success Alert */}
        {loginSuccess ? (
          <div className="my-6 flex flex-col items-center justify-center rounded-2xl bg-emerald-50/90 p-6 text-center border border-emerald-200 dark:bg-emerald-950/80 dark:border-emerald-800 animate-in fade-in zoom-in-95">
            <CheckCircle2 className="size-12 text-emerald-600 dark:text-emerald-400 mb-2 animate-bounce" />
            <h3 className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
              Welcome back, {currentConfig.demoUser.name}!
            </h3>
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
              Authenticated as {activeRole.toUpperCase()} · Redirecting...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Banner */}
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
                <BadgeAlert className="size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Identifier Field */}
            <div className="space-y-1.5">
              <Label htmlFor="identifier" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {currentConfig.idLabel}
              </Label>
              <div className="relative">
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={currentConfig.idPlaceholder}
                  className="pl-9 bg-white/90 dark:bg-slate-900/90 text-sm rounded-xl h-11 border-slate-200 focus:ring-2 focus:ring-primary/30"
                  required
                />
                <Mail className="absolute left-3 top-3.5 size-4 text-slate-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </Label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Demo Mode: Click "1-Click Demo Login" below to test access instantly.')
                  }}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-10 bg-white/90 dark:bg-slate-900/90 text-sm rounded-xl h-11 border-slate-200 focus:ring-2 focus:ring-primary/30"
                  required
                />
                <Lock className="absolute left-3 top-3.5 size-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Role-Specific Secondary Fields */}
            {activeRole === 'organizer' && (
              <div className="space-y-1.5">
                <Label htmlFor="deptCode" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Department / Club Code (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="deptCode"
                    type="text"
                    value={secondaryField}
                    onChange={(e) => setSecondaryField(e.target.value)}
                    placeholder="e.g. CODING-CLUB-2026"
                    className="pl-9 bg-white/90 dark:bg-slate-900/90 text-sm rounded-xl h-11 border-slate-200"
                  />
                  <KeyRound className="absolute left-3 top-3.5 size-4 text-slate-400" />
                </div>
              </div>
            )}

            {activeRole === 'admin' && (
              <div className="space-y-1.5">
                <Label htmlFor="securityKey" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Security Passcode / Master Key
                </Label>
                <div className="relative">
                  <Input
                    id="securityKey"
                    type="password"
                    value={secondaryField}
                    onChange={(e) => setSecondaryField(e.target.value)}
                    placeholder="e.g. ADM-KEY-9900"
                    className="pl-9 bg-white/90 dark:bg-slate-900/90 text-sm rounded-xl h-11 border-slate-200"
                  />
                  <KeyRound className="absolute left-3 top-3.5 size-4 text-slate-400" />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'w-full h-11 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg mt-2',
                currentConfig.buttonBg
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In to Portal
                  <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200/80 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-white/80 dark:bg-slate-900/80 px-2 text-slate-400 font-medium rounded-full">
              Or Instant Demo Access
            </span>
          </div>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="rounded-2xl bg-white/60 p-4 border border-slate-200/60 dark:bg-slate-900/60 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Sparkles className="size-3.5 text-amber-500" />
              Demo Preset ({activeRole.toUpperCase()})
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {currentConfig.demoUser.email}
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleDemoLogin(activeRole)}
            disabled={isSubmitting}
            className="w-full h-9 text-xs rounded-xl bg-white hover:bg-slate-50 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 shadow-sm flex items-center justify-center gap-2"
          >
            <UserCheck className="size-3.5 text-emerald-600" />
            1-Click Login as {currentConfig.demoUser.name.split(' ')[0]} ({activeRole})
          </Button>
        </div>

        {/* Switch Portal Links Footer */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Need a different login?{' '}
          <Link
            href={
              activeRole === 'student'
                ? '/login/organizer'
                : activeRole === 'organizer'
                ? '/login/admin'
                : '/login/student'
            }
            className="font-medium text-primary hover:underline"
          >
            Switch to{' '}
            {activeRole === 'student'
              ? 'Organizer Portal'
              : activeRole === 'organizer'
              ? 'Admin Portal'
              : 'Student Portal'}
          </Link>
        </div>
      </div>
    </div>
  )
}
