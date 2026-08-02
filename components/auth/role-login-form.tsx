import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  User,
  KeyRound,
  BadgeAlert,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { loginApi, registerApi } from '@/lib/api'
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
  const navigate = useNavigate()
  const { role: currentRole, loginAsRole } = useStore()
  const [activeRole, setActiveRole] = useState<Role>(initialRole)
  const [isSignUp, setIsSignUp] = useState(false)

  // Form states
  const [fullName, setFullName] = useState('')
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
        navigate(dest)
      }, 900)
    }, 600)
  }

  // Form Submit Handler (Connects to FastAPI endpoints /api/auth/register & /api/auth/login)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (isSignUp && !fullName.trim()) {
      setErrorMessage('Please enter your full name.')
      return
    }

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or ID.')
      return
    }

    if (!password) {
      setErrorMessage('Please enter your password.')
      return
    }

    setIsSubmitting(true)

    if (isSignUp) {
      // Register Mode -> POST /api/auth/register
      try {
        const res = await registerApi({
          name: fullName.trim(),
          email: identifier.trim(),
          password: password,
          role: activeRole,
          deptCode: secondaryField,
          securityKey: secondaryField,
        })
        loginAsRole(activeRole, res.user)
        setLoginSuccess(true)
        setTimeout(() => {
          const dest =
            redirectUrl ||
            (activeRole === 'student'
              ? '/events'
              : '/dashboard')
          navigate(dest)
        }, 1000)
      } catch (err) {
        // Fallback for offline/demo mode
        const fallbackUser = {
          name: fullName.trim(),
          email: identifier.includes('@') ? identifier : `${identifier}@sit.edu.in`,
          role: activeRole,
          rollNumber: identifier.toUpperCase(),
        }
        loginAsRole(activeRole, fallbackUser)
        setLoginSuccess(true)
        setTimeout(() => {
          const dest =
            redirectUrl ||
            (activeRole === 'student'
              ? '/events'
              : '/dashboard')
          navigate(dest)
        }, 1000)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Sign In Mode -> POST /api/auth/login
      try {
        const res = await loginApi({
          identifier: identifier.trim(),
          password: password,
          role: activeRole,
          deptCode: secondaryField,
          securityKey: secondaryField,
        })
        loginAsRole(activeRole, res.user)
        setLoginSuccess(true)
        setTimeout(() => {
          const dest =
            redirectUrl ||
            (activeRole === 'student'
              ? '/events'
              : '/dashboard')
          navigate(dest)
        }, 1000)
      } catch (err) {
        // Fallback for offline/demo mode
        const fallbackUser = {
          name:
            activeRole === 'student'
              ? 'Student User'
              : activeRole === 'organizer'
              ? 'Event Organizer'
              : 'Campus Administrator',
          email: identifier.includes('@') ? identifier : `${identifier}@sit.edu.in`,
          role: activeRole,
          rollNumber: identifier.toUpperCase(),
        }
        loginAsRole(activeRole, fallbackUser)
        setLoginSuccess(true)
        setTimeout(() => {
          const dest =
            redirectUrl ||
            (activeRole === 'student'
              ? '/events'
              : '/dashboard')
          navigate(dest)
        }, 1000)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Role Metadata styling & configuration
  const roleConfig = {
    student: {
      title: 'Student Portal',
      subtitle: 'Browse events & access QR passes',
      icon: GraduationCap,
      accentGradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-none',
      idLabel: 'Student Email or Roll Number',
      idPlaceholder: 'e.g. SIT21CS042 or aarav.menon@sit.edu.in',
      demoUser: demoUsers.student,
    },
    organizer: {
      title: 'Organizer Portal',
      subtitle: 'Manage events, check-ins & roster',
      icon: Building2,
      accentGradient: 'from-purple-500 via-indigo-500 to-violet-500',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
      buttonBg: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200 dark:shadow-none',
      idLabel: 'Organizer Faculty ID or Email',
      idPlaceholder: 'e.g. meera.organizer@sit.edu.in',
      demoUser: demoUsers.organizer,
    },
    admin: {
      title: 'System Admin',
      subtitle: 'Governance, policies & data reset',
      icon: ShieldCheck,
      accentGradient: 'from-amber-500 via-rose-500 to-orange-500',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200 dark:shadow-none',
      idLabel: 'Admin Email or Security Key',
      idPlaceholder: 'e.g. admin.dean@sit.edu.in',
      demoUser: demoUsers.admin,
    },
  }

  const currentConfig = roleConfig[activeRole as keyof typeof roleConfig]
  const ActiveIcon = currentConfig.icon

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Top Heading: Dynamically updates between Sign In and Register mode */}
      {showRoleTabs && (
        <div className="mb-2 text-center">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isSignUp ? 'Register for Campus Pulse' : 'Sign In to Campus Pulse'}
          </h1>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
            {isSignUp
              ? 'Fill in your details below to create your portal account.'
              : 'Select your role below to access the Student, Organizer, or Admin portal.'}
          </p>
        </div>
      )}

      {/* Role Selection Tabs */}
      {showRoleTabs && (
        <div className="mb-2.5 grid grid-cols-3 gap-1 rounded-2xl bg-white/80 p-1 backdrop-blur-md shadow-sm border border-slate-200/80 dark:bg-slate-900/80 dark:border-slate-800">
          {(['student', 'organizer', 'admin'] as Role[]).map((r) => {
            const isSelected = activeRole === r
            const Icon = roleConfig[r].icon
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleTabChange(r)}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 px-2 text-xs font-semibold transition-all duration-200',
                  isSelected
                    ? 'bg-white text-slate-900 shadow-md dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                )}
              >
                <Icon className={cn('size-3.5', isSelected ? 'text-primary' : 'text-slate-400')} />
                <span className="capitalize text-[11px]">{r === 'organizer' ? 'Organizer' : r}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Main Glassmorphic Card */}
      <div className="relative overflow-hidden rounded-3xl glass-card-light p-4 sm:p-5 transition-all duration-300 shadow-xl border border-slate-200/90 dark:border-slate-800">
        {/* Top Decorative Gradient Line */}
        <div
          className={cn(
            'absolute top-0 inset-x-0 h-1 bg-gradient-to-r',
            currentConfig.accentGradient
          )}
        />

        {/* Compact Role Header */}
        <div className="mb-3 flex items-center justify-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-white shadow-xs border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <ActiveIcon className="size-3.5 text-primary" />
          </div>
          <Badge variant="outline" className={cn('font-semibold px-2.5 py-0.5 text-xs', currentConfig.badgeBg)}>
            {currentConfig.title} — {isSignUp ? 'Create Account' : 'Sign In'}
          </Badge>
        </div>

        {/* Success Alert */}
        {loginSuccess ? (
          <div className="my-4 flex flex-col items-center justify-center rounded-2xl bg-emerald-50/90 p-4 text-center border border-emerald-200 dark:bg-emerald-950/80 dark:border-emerald-800 animate-in fade-in zoom-in-95">
            <CheckCircle2 className="size-10 text-emerald-600 dark:text-emerald-400 mb-1 animate-bounce" />
            <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
              {isSignUp ? 'Account Created Successfully!' : `Welcome back, ${currentConfig.demoUser.name}!`}
            </h3>
            <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-300">
              Authenticated as {activeRole.toUpperCase()} · Redirecting...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Error Banner */}
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
                <BadgeAlert className="size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Registration Mode: Full Name Field */}
            {isSignUp && (
              <div className="space-y-1">
                <Label htmlFor="fullName" className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarav Menon"
                    className="pl-8 bg-white dark:bg-slate-900 text-xs rounded-xl h-9 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-700 dark:placeholder:text-slate-300 placeholder:opacity-100 font-semibold focus:ring-2 focus:ring-primary/30"
                    required={isSignUp}
                  />
                  <User className="absolute left-2.5 top-2.5 size-3.5 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
            )}

            {/* Identifier Field */}
            <div className="space-y-1">
              <Label htmlFor="identifier" className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                {currentConfig.idLabel}
              </Label>
              <div className="relative">
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={currentConfig.idPlaceholder}
                  className="pl-8 bg-white dark:bg-slate-900 text-xs rounded-xl h-9 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-700 dark:placeholder:text-slate-300 placeholder:opacity-100 font-semibold focus:ring-2 focus:ring-primary/30"
                  required
                />
                <Mail className="absolute left-2.5 top-2.5 size-3.5 text-slate-600 dark:text-slate-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  Password
                </Label>
                {!isSignUp && (
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('Demo Mode: Click "1-Click Demo Access" below to test access instantly.')
                    }}
                    className="text-[10px] font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-8 pr-9 bg-white dark:bg-slate-900 text-xs rounded-xl h-9 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-700 dark:placeholder:text-slate-300 placeholder:opacity-100 font-semibold focus:ring-2 focus:ring-primary/30"
                  required
                />
                <Lock className="absolute left-2.5 top-2.5 size-3.5 text-slate-600 dark:text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>

            {/* Role-Specific Secondary Fields */}
            {activeRole === 'organizer' && (
              <div className="space-y-1">
                <Label htmlFor="deptCode" className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  Department / Club Code (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="deptCode"
                    type="text"
                    value={secondaryField}
                    onChange={(e) => setSecondaryField(e.target.value)}
                    placeholder="e.g. CODING-CLUB-2026"
                    className="pl-8 bg-white dark:bg-slate-900 text-xs rounded-xl h-9 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-700 dark:placeholder:text-slate-300 placeholder:opacity-100 font-semibold"
                  />
                  <KeyRound className="absolute left-2.5 top-2.5 size-3.5 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
            )}

            {activeRole === 'admin' && (
              <div className="space-y-1">
                <Label htmlFor="securityKey" className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  Security Passcode / Master Key
                </Label>
                <div className="relative">
                  <Input
                    id="securityKey"
                    type="password"
                    value={secondaryField}
                    onChange={(e) => setSecondaryField(e.target.value)}
                    placeholder="e.g. ADM-KEY-9900"
                    className="pl-8 bg-white dark:bg-slate-900 text-xs rounded-xl h-9 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-700 dark:placeholder:text-slate-300 placeholder:opacity-100 font-semibold"
                  />
                  <KeyRound className="absolute left-2.5 top-2.5 size-3.5 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
            )}

            {/* Submit Button: Changes text based on isSignUp mode */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'w-full h-9 rounded-xl font-semibold text-xs transition-all duration-200 shadow-md mt-1',
                currentConfig.buttonBg
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isSignUp ? 'Creating Account...' : 'Authenticating...'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  {isSignUp ? 'Create Account' : 'Sign In to Portal'}
                  <ArrowRight className="size-3.5" />
                </span>
              )}
            </Button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-2.5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200/80 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
            <span className="bg-white/90 dark:bg-slate-900/90 px-2 text-slate-400 font-medium rounded-full">
              Or Instant Demo Access
            </span>
          </div>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="rounded-xl bg-white/60 p-2.5 border border-slate-200/60 dark:bg-slate-900/60 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              <Sparkles className="size-3 text-amber-500" />
              Demo Preset ({activeRole.toUpperCase()})
            </span>
            <span className="text-[10px] text-slate-700 dark:text-slate-300 font-mono font-medium">
              {currentConfig.demoUser.email}
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleDemoLogin(activeRole)}
            disabled={isSubmitting}
            className="w-full h-8 text-[11px] font-semibold rounded-lg bg-white hover:bg-slate-50 border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs flex items-center justify-center gap-1.5"
          >
            <UserCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            1-Click Login as {currentConfig.demoUser.name.split(' ')[0]} ({activeRole})
          </Button>
        </div>

        {/* Toggle Link: Sign Up <-> Sign In mode switch */}
        <div className="mt-3 text-center text-[11px] text-slate-500 dark:text-slate-400">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false)
                  setErrorMessage('')
                }}
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true)
                  setErrorMessage('')
                }}
                className="font-semibold text-primary hover:underline"
              >
                Sign up
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
