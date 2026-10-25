import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import QRCode from 'qrcode'
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  Printer,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedGradientBg } from '@/components/ui/animated-gradient-bg'
import { formatTime } from '@/lib/format'

function PassQrCode({ code }: { code: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, code, {
        width: 140,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
    }
  }, [code])

  return <canvas ref={canvasRef} className="rounded-lg shadow-sm border border-slate-200" />
}

export default function MyPassesPage() {
  const { myRegistrations, getEvent, cancelRegistration } = useStore()

  const handleCancelPass = (id: string) => {
    if (confirm('Are you sure you want to cancel this event registration?')) {
      cancelRegistration(id)
    }
  }

  const handlePrintPass = () => {
    window.print()
  }

  return (
    <AnimatedGradientBg accentColor="neutral">
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 print:p-0">
          <div className="mx-auto max-w-5xl">
            {/* Header Banner */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white/30 backdrop-blur-md p-6 border border-white/60 shadow-xs print-hide">
              <div>
                <Badge className="mb-2 bg-primary/10 text-primary border-primary/20 font-semibold">
                  <Ticket className="size-3.5 mr-1.5 inline" />
                  Student Digital Wallet
                </Badge>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  My Event Passes ({myRegistrations.length})
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Digital entry tickets for registered events. Present the QR code at the entrance scanner.
                </p>
              </div>

              {myRegistrations.length > 0 && (
                <Button onClick={handlePrintPass} variant="outline" className="shrink-0 gap-2 bg-white/70 backdrop-blur-md border-white/60 text-slate-800 hover:bg-white/90 shadow-xs cursor-pointer">
                  <Printer className="size-4" />
                  Print / Export Passes
                </Button>
              )}
            </div>

            {myRegistrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/60 bg-white/70 backdrop-blur-md p-12 text-center shadow-xs">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <Ticket className="size-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No Event Passes Found</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-md">
                  You haven't registered for any campus events yet. Explore upcoming hackathons, fests, and workshops!
                </p>
                <Button className="mt-6 rounded-xl font-semibold gap-2 shadow-xs" render={<Link to="/events" />}>
                  Browse Upcoming Events
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {myRegistrations.map((reg) => {
                  const event = getEvent(reg.eventId)
                  if (!event) return null

                  return (
                    <Card
                      key={reg.id}
                      className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 backdrop-blur-md shadow-sm transition-all hover:shadow-md print:break-inside-avoid print:shadow-none"
                    >
                      {/* Top Notch Pattern */}
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-indigo-400 to-primary" />

                      <CardHeader className="flex flex-row items-start justify-between gap-4 p-6 pb-3">
                        <div>
                          <Badge variant="outline" className="mb-1 text-[11px] bg-white/80 text-slate-700 border-white/60">
                            {event.category}
                          </Badge>
                          <CardTitle className="text-xl font-bold text-slate-900 leading-snug">
                            {event.title}
                          </CardTitle>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                          {reg.checkedIn ? (
                            <Badge className="bg-emerald-600 text-white gap-1 font-semibold shadow-xs">
                              <CheckCircle2 className="size-3" />
                              Checked In
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1 bg-indigo-50/90 text-indigo-700 border border-indigo-200/60 font-semibold shadow-xs">
                              <Clock className="size-3" />
                              Pass Active
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="p-6 pt-0 space-y-4">
                        {/* Ticket Spec & QR Row */}
                        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/60 backdrop-blur-sm p-4 border border-white/60">
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center gap-2 text-slate-500">
                              <Calendar className="size-3.5 text-primary shrink-0" />
                              <span className="font-semibold text-slate-900">{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                              <Clock className="size-3.5 text-primary shrink-0" />
                              <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                              <MapPin className="size-3.5 text-primary shrink-0" />
                              <span className="truncate max-w-40">{event.venue}</span>
                            </div>

                            <div className="pt-2">
                              <span className="text-[10px] text-slate-500 font-bold block">TICKET ID</span>
                              <span className="font-mono text-sm font-extrabold text-primary">
                                {reg.code}
                              </span>
                            </div>
                          </div>

                          {/* Dynamic QR Canvas */}
                          <div className="flex flex-col items-center">
                            <PassQrCode code={reg.code} />
                            <span className="text-[9px] text-slate-500 mt-1 font-mono font-medium">
                              Scan for Entry
                            </span>
                          </div>
                        </div>

                        {/* Participant Details */}
                        <div className="text-xs text-slate-500 space-y-1.5 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/60">
                          <div className="flex justify-between">
                            <span>Participant:</span>
                            <span className="font-semibold text-slate-900">{reg.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Roll Number:</span>
                            <span className="font-semibold text-slate-900">{reg.rollNumber}</span>
                          </div>
                          {reg.teamName && (
                            <div className="flex justify-between text-primary font-medium">
                              <span>Team:</span>
                              <span>{reg.teamName}</span>
                            </div>
                          )}
                        </div>

                        {/* Working Action Buttons */}
                        <div className="flex items-center justify-between gap-2 pt-1 print-hide">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelPass(reg.id)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs gap-1.5"
                          >
                            <Trash2 className="size-3.5" />
                            Cancel Pass
                          </Button>

                          <Button variant="outline" size="sm" render={<Link to={`/events/${event.id}`} />} className="text-xs bg-white/70 backdrop-blur-md border-white/60 text-slate-800 hover:bg-white/90 shadow-xs">
                            Event Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </main>

        <SiteFooter />
      </div>
    </AnimatedGradientBg>
  )
}
