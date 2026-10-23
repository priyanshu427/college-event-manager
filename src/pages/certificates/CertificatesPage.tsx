import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Award,
  Calendar,
  CheckCircle2,
  Printer,
  QrCode,
  ShieldCheck,
  Building,
  RefreshCw,
  Trophy,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format'
import { AnimatedGradientBg } from '@/components/ui/animated-gradient-bg'
import { fetchMyCertificatesApi } from '@/lib/api'
import type { CertificateItem } from '@/lib/types'

export default function CertificatesPage() {
  const { user, token } = useStore()
  const effectiveToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null) || user?.id || ''

  const [certificates, setCertificates] = useState<CertificateItem[]>([])
  const [selectedCertId, setSelectedCertId] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch actual earned certificates for the logged-in student
  useEffect(() => {
    let isMounted = true

    const loadCertificates = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchMyCertificatesApi(effectiveToken)
        if (isMounted) {
          setCertificates(data)
          if (data && data.length > 0) {
            setSelectedCertId(data[0].certificate_id)
          }
        }
      } catch (err: any) {
        console.warn('Could not fetch certificates from API:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load certificates')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCertificates()

    return () => {
      isMounted = false
    }
  }, [effectiveToken])

  const selectedCert =
    certificates.find((c) => c.certificate_id === selectedCertId) || certificates[0]

  const isWinner =
    selectedCert &&
    selectedCert.award_rank &&
    selectedCert.award_rank.toLowerCase() !== 'participation'

  const handlePrint = () => {
    window.print()
  }

  return (
    <AnimatedGradientBg accentColor="neutral">
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <main className="flex-1 px-4 py-6 sm:py-10">
          <div className="mx-auto max-w-5xl space-y-8">
            {/* Header Title & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6 print-hide">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                    <Award className="size-3.5" />
                    Verified Credentials
                  </Badge>
                  {isWinner && (
                    <Badge className="bg-yellow-500/20 text-yellow-500 dark:text-yellow-300 border border-yellow-500/30 gap-1 text-[11px] font-bold">
                      <Trophy className="size-3" />
                      {selectedCert.award_rank} Awarded
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  My Certificates & Achievements
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Official verifiable digital credentials issued for campus events attended by{' '}
                  <span className="font-semibold text-primary">{user.name}</span>.
                </p>
              </div>

              {/* Quick Action: ONLY Print / Download PDF (Copy link button removed as requested) */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handlePrint}
                  disabled={!selectedCert}
                  className="gap-1.5 text-xs h-9 bg-amber-600 hover:bg-amber-700 text-white shadow-md cursor-pointer"
                >
                  <Printer className="size-4" />
                  Print / Download PDF
                </Button>
              </div>
            </div>

            {/* Event Selector Strip */}
            <div className="space-y-2 print-hide">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Select Earned Event Certificate:</span>
                {!isLoading && certificates.length > 0 && (
                  <span className="text-[11px] text-muted-foreground font-normal">
                    {certificates.length} certificate{certificates.length === 1 ? '' : 's'} available
                  </span>
                )}
              </label>

              {isLoading ? (
                <div className="p-8 text-center rounded-2xl border border-dashed bg-card/60 flex items-center justify-center gap-2.5 text-xs text-muted-foreground">
                  <RefreshCw className="size-4 animate-spin text-amber-500" />
                  Fetching your authentic verified certificates from server...
                </div>
              ) : certificates.length === 0 ? (
                /* Dynamic Empty State when no certificates have been issued yet */
                <div className="p-8 sm:p-10 text-center rounded-3xl border border-dashed bg-card/60 space-y-4">
                  <div className="size-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                    <Award className="size-7" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      No Certificates Issued Yet
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Certificates are dynamically awarded once campus organizers officially close completed events after attendance check-in.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5"
                      render={<Link to="/events" />}
                    >
                      <span>Explore Campus Events</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs gap-1.5 bg-primary text-primary-foreground shadow-sm"
                      render={<Link to="/my-passes" />}
                    >
                      <span>View My Passes</span>
                    </Button>
                  </div>
                </div>
              ) : (
                /* Dynamic Event Pills Strip from actual fetched certificates */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {certificates.map((cert) => {
                    const isSelected = cert.certificate_id === selectedCertId
                    const certIsWinner = cert.award_rank && cert.award_rank.toLowerCase() !== 'participation'

                    return (
                      <button
                        key={cert.certificate_id}
                        type="button"
                        onClick={() => setSelectedCertId(cert.certificate_id)}
                        className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all text-xs cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-200 shadow-sm ring-1 ring-amber-500/50'
                            : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 w-full">
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {cert.event_title}
                          </span>
                          {certIsWinner ? (
                            <Badge className="text-[10px] bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 border border-yellow-500/30 shrink-0 font-bold">
                              🏆 {cert.award_rank}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-slate-500 shrink-0">
                              Participation
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar className="size-3" />
                          {formatDate(cert.event_date)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Dynamic Certificate Printable Display */}
            {selectedCert && (
              <div
                className={`relative overflow-hidden rounded-3xl bg-slate-950 p-4 sm:p-8 md:p-10 shadow-2xl border-4 text-slate-100 print:border-0 print:shadow-none print:p-0 print:bg-white print:text-slate-900 ${
                  isWinner
                    ? 'border-amber-500/50 shadow-[0_0_50px_-12px_rgba(245,158,11,0.25)]'
                    : 'border-amber-500/30'
                }`}
              >
                {/* Decorative Inner Border */}
                <div className="relative border-2 border-amber-500/40 p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/90 print:border-2 print:border-amber-600 print:bg-white">
                  
                  {/* Certificate Top Header */}
                  <div className="text-center space-y-2 mb-8">
                    <div className="flex justify-center items-center gap-2 mb-2">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {isWinner ? <Trophy className="size-6 text-yellow-400" /> : <QrCode className="size-6" />}
                      </div>
                      <span className="font-display font-bold text-lg text-amber-400 tracking-wider uppercase">
                        Sunrise Institute of Technology
                      </span>
                    </div>

                    {/* Dynamic Certificate Title Banner */}
                    {isWinner ? (
                      <div className="space-y-1">
                        <h2 className="text-sm sm:text-base uppercase tracking-[0.25em] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 py-0.5 print:text-amber-800">
                          OFFICIAL CERTIFICATE OF ACHIEVEMENT
                        </h2>
                        <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 uppercase tracking-widest text-xs px-3 py-0.5 font-bold">
                          ★ {selectedCert.award_rank.toUpperCase()} ★
                        </Badge>
                      </div>
                    ) : (
                      <h2 className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-500/90">
                        OFFICIAL CERTIFICATE OF PARTICIPATION
                      </h2>
                    )}

                    <div className="mx-auto w-36 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent my-3" />
                  </div>

                  {/* Certificate Body */}
                  <div className="text-center my-8 space-y-4">
                    <p className="text-xs sm:text-sm font-light text-slate-300 italic print:text-slate-600">
                      This is to proudly certify that
                    </p>

                    {/* Recipient Name */}
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 py-1 font-serif print:text-slate-900">
                      {selectedCert.student_name || user.name}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed print:text-slate-700">
                      from the{' '}
                      <span className="font-semibold text-white print:text-slate-900">
                        {selectedCert.student_department || user.department || 'Computer Science'}
                      </span>{' '}
                      department (
                      <span className="font-mono text-amber-300 print:text-slate-800">
                        {selectedCert.student_roll_number || user.rollNumber || 'SIT21CS042'}
                      </span>
                      ) has{' '}
                      {isWinner ? (
                        <>
                          distinguished themselves with outstanding merit, earning{' '}
                          <span className="font-bold text-yellow-300 underline decoration-yellow-500/60 print:text-slate-900">
                            {selectedCert.award_rank}
                          </span>{' '}
                          in
                        </>
                      ) : (
                        'actively participated in and successfully completed'
                      )}{' '}
                      the campus event:
                    </p>

                    {/* Event Name & Tagline */}
                    <div className="py-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white print:text-slate-900 underline decoration-amber-500/50 underline-offset-4">
                        {selectedCert.event_title}
                      </h3>
                      {selectedCert.event_tagline && (
                        <p className="text-xs text-amber-400/90 mt-1 italic">
                          "{selectedCert.event_tagline}"
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 print:text-slate-600">
                      Conducted on{' '}
                      <span className="font-medium text-slate-200 print:text-slate-900">
                        {formatDate(selectedCert.event_date)}
                      </span>{' '}
                      at{' '}
                      <span className="font-medium text-slate-200 print:text-slate-900">
                        {selectedCert.event_venue}
                      </span>{' '}
                      by{' '}
                      <span className="font-medium text-slate-200 print:text-slate-900">
                        {selectedCert.event_organizer || selectedCert.event_department}
                      </span>
                      .
                    </p>
                  </div>

                  {/* Signatures & Seal Section */}
                  <div className="mt-12 pt-6 border-t border-slate-800 print:border-slate-300 grid grid-cols-3 items-center text-center">
                    
                    {/* Left Signature (Dynamic Organizer / Faculty Lead) */}
                    <div className="flex flex-col items-center">
                      <div className="font-serif italic text-amber-300 text-sm sm:text-base print:text-slate-800 font-bold mb-1">
                        {selectedCert.event_organizer || 'Event Cell Coordinator'}
                      </div>
                      <div className="w-28 sm:w-36 h-px bg-slate-700 print:bg-slate-400 my-1" />
                      <p className="text-[10px] text-slate-400 print:text-slate-600 uppercase tracking-wider font-semibold">
                        Faculty Lead, {selectedCert.event_department || 'Event Cell'}
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

                    {/* Right Signature (Dean of Student Affairs) */}
                    <div className="flex flex-col items-center">
                      <div className="font-serif italic text-amber-300 text-sm sm:text-base print:text-slate-800 font-bold mb-1">
                        Dr. K. S. Murthy
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
                      Certificate ID: <span className="text-amber-400 font-bold">{selectedCert.certificate_id}</span>
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
