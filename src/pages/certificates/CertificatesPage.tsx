import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Award,
  Calendar,
  CheckCircle2,
  Copy,
  Download,
  FileCheck,
  GraduationCap,
  MapPin,
  Printer,
  QrCode,
  Share2,
  Sparkles,
  ShieldCheck,
  Building,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format'
import { AnimatedGradientBg } from '@/components/ui/animated-gradient-bg'

export default function CertificatesPage() {
  const { user, events, registrations, myRegistrations } = useStore()
  
  // Get registered events or default to first 3 events if no registration yet
  const userRegisteredEventIds = new Set(
    myRegistrations.map((r) => r.eventId)
  )
  
  const registeredEvents = events.filter((e) =>
    userRegisteredEventIds.has(e.id)
  )

  // Fallback to all events if user hasn't registered for any yet
  const selectableEvents = registeredEvents.length > 0 ? registeredEvents : events

  const [selectedEventId, setSelectedEventId] = useState<string>(
    selectableEvents[0]?.id || ''
  )
  const [copied, setCopied] = useState(false)

  const selectedEvent =
    events.find((e) => e.id === selectedEventId) || selectableEvents[0]

  const certificateId = `CERT-2026-${selectedEvent?.id.toUpperCase() || 'SIT'}-${(
    user?.name || 'USER'
  )
    .replace(/\s+/g, '')
    .slice(0, 5)
    .toUpperCase()}`

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/certificates?cert=${certificateId}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatedGradientBg accentColor="neutral">
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <main className="flex-1 px-4 py-6 sm:py-10">
          <div className="mx-auto max-w-5xl space-y-8">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6 print-hide">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="gap-1 bg-amber-500/10 text-amber-600 border-amber-500/20">
                    <Award className="size-3.5" />
                    Verified Credentials
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  My Certificates & Achievements
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  On-the-fly official certificate generation for registered campus events under <span className="font-semibold text-primary">{user.name}</span>.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="gap-1.5 text-xs h-9 bg-white dark:bg-slate-900"
                >
                  {copied ? (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
                <Button
                  size="sm"
                  onClick={handlePrint}
                  className="gap-1.5 text-xs h-9 bg-amber-600 hover:bg-amber-700 text-white shadow-md"
                >
                  <Printer className="size-4" />
                  Print / Download PDF
                </Button>
              </div>
            </div>

            {/* Event Selector Strip */}
            <div className="space-y-2 print-hide">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Registered Event to Issue Certificate:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {selectableEvents.map((evt) => {
                  const isSelected = evt.id === selectedEventId
                  return (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={() => setSelectedEventId(evt.id)}
                      className={`flex flex-col text-left p-3 rounded-xl border transition-all text-xs font-medium ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-200 shadow-sm ring-1 ring-amber-500/50'
                          : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {evt.title}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(evt.date)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Dynamic Certificate Printable Display */}
            {selectedEvent && (
              <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-4 sm:p-8 md:p-10 shadow-2xl border-4 border-amber-500/30 text-slate-100 print:border-0 print:shadow-none print:p-0 print:bg-white print:text-slate-900">
                {/* Decorative Inner Border */}
                <div className="relative border-2 border-amber-500/40 p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/90 print:border-2 print:border-amber-600 print:bg-white">
                  
                  {/* Certificate Top Header */}
                  <div className="text-center space-y-2 mb-8">
                    <div className="flex justify-center items-center gap-2 mb-2">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <QrCode className="size-6" />
                      </div>
                      <span className="font-display font-bold text-lg text-amber-400 tracking-wider uppercase">
                        Sunrise Institute of Technology
                      </span>
                    </div>
                    <h2 className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-500/90">
                      OFFICIAL CERTIFICATE OF PARTICIPATION & ACHIEVEMENT
                    </h2>
                    <div className="mx-auto w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent my-3" />
                  </div>

                  {/* Certificate Body */}
                  <div className="text-center my-8 space-y-4">
                    <p className="text-xs sm:text-sm font-light text-slate-300 italic print:text-slate-600">
                      This is to proudly certify that
                    </p>

                    {/* Recipient Name */}
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 py-1 font-serif print:text-slate-900">
                      {user.name}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed print:text-slate-700">
                      from the <span className="font-semibold text-white print:text-slate-900">{user.department || 'Computer Science'}</span> department (<span className="font-mono text-amber-300 print:text-slate-800">{user.rollNumber || 'SIT21CS042'}</span>) has actively participated in and successfully completed the campus event:
                    </p>

                    {/* Event Name */}
                    <div className="py-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white print:text-slate-900 underline decoration-amber-500/50 underline-offset-4">
                        {selectedEvent.title}
                      </h3>
                      <p className="text-xs text-amber-400/90 mt-1 italic">
                        "{selectedEvent.tagline}"
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 print:text-slate-600">
                      Conducted on <span className="font-medium text-slate-200 print:text-slate-900">{formatDate(selectedEvent.date)}</span> at <span className="font-medium text-slate-200 print:text-slate-900">{selectedEvent.venue}</span> by <span className="font-medium text-slate-200 print:text-slate-900">{selectedEvent.organizer}</span>.
                    </p>
                  </div>

                  {/* Signatures & Seal Section */}
                  <div className="mt-12 pt-6 border-t border-slate-800 print:border-slate-300 grid grid-cols-3 items-center text-center">
                    
                    {/* Left Signature */}
                    <div className="flex flex-col items-center">
                      <div className="font-serif italic text-amber-300 text-sm sm:text-base print:text-slate-800 font-bold mb-1">
                        Prof. Meera Sharma
                      </div>
                      <div className="w-28 sm:w-36 h-px bg-slate-700 print:bg-slate-400 my-1" />
                      <p className="text-[10px] text-slate-400 print:text-slate-600 uppercase tracking-wider font-semibold">
                        Faculty Lead, Event Cell
                      </p>
                    </div>

                    {/* Center Official Crest Seal */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="size-14 sm:size-16 rounded-full border-2 border-amber-500/60 bg-amber-500/10 flex items-center justify-center shadow-lg relative print:bg-amber-100">
                        <ShieldCheck className="size-8 text-amber-400 print:text-amber-700" />
                        <div className="absolute inset-0 rounded-full border border-dashed border-amber-400/40 animate-spin-slow" />
                      </div>
                      <span className="text-[9px] font-mono text-amber-400 mt-1 uppercase tracking-widest print:text-slate-700 font-bold">
                        Official Verification
                      </span>
                    </div>

                    {/* Right Signature */}
                    <div className="flex flex-col items-center">
                      <div className="font-serif italic text-amber-300 text-sm sm:text-base print:text-slate-800 font-bold mb-1">
                        Dr. Rajesh K. Varma
                      </div>
                      <div className="w-28 sm:w-36 h-px bg-slate-700 print:bg-slate-400 my-1" />
                      <p className="text-[10px] text-slate-400 print:text-slate-600 uppercase tracking-wider font-semibold">
                        Dean of Student Affairs
                      </p>
                    </div>

                  </div>

                  {/* Footer Certificate Verification Bar */}
                  <div className="mt-8 pt-4 border-t border-slate-800/80 print:border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-500 gap-2">
                    <div>
                      Certificate ID: <span className="text-amber-400 font-bold">{certificateId}</span>
                    </div>
                    <div>
                      Issued by Sunrise Institute of Technology · Authenticity Verified
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </AnimatedGradientBg>
  )
}
