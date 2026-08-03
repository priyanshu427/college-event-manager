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
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 print:p-0">
        <div className="mx-auto max-w-5xl">
          {/* Header Banner */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/20 to-primary/5 p-6 border border-primary/20 print-hide">
            <div>
              <Badge className="mb-2 bg-primary/15 text-primary border-primary/30">
                <Ticket className="size-3.5 mr-1.5 inline" />
                Student Digital Wallet
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                My Event Passes ({myRegistrations.length})
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Digital entry tickets for registered events. Present the QR code at the entrance scanner.
              </p>
            </div>

            {myRegistrations.length > 0 && (
              <Button onClick={handlePrintPass} variant="outline" className="shrink-0 gap-2">
                <Printer className="size-4" />
                Print / Export Passes
              </Button>
            )}
          </div>

          {myRegistrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed bg-card/50 p-12 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                <Ticket className="size-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No Event Passes Found</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                You haven't registered for any campus events yet. Explore upcoming hackathons, fests, and workshops!
              </p>
              <Button className="mt-6 rounded-xl font-semibold gap-2" render={<Link to="/events" />}>
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
                    className="relative overflow-hidden rounded-3xl border bg-card shadow-sm transition-all hover:shadow-md print:break-inside-avoid print:shadow-none"
                  >
                    {/* Top Notch Pattern */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-chart-2 to-primary" />

                    <CardHeader className="flex flex-row items-start justify-between gap-4 p-5 pb-3">
                      <div>
                        <Badge variant="outline" className="mb-1 text-[11px]">
                          {event.category}
                        </Badge>
                        <CardTitle className="text-lg font-bold text-foreground leading-snug">
                          {event.title}
                        </CardTitle>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        {reg.checkedIn ? (
                          <Badge className="bg-emerald-600 text-white gap-1">
                            <CheckCircle2 className="size-3" />
                            Checked In
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="size-3" />
                            Pass Active
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-0 space-y-4">
                      {/* Ticket Spec & QR Row */}
                      <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/60 p-4 border border-border/60">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="size-3.5 text-primary" />
                            <span className="font-semibold text-foreground">{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="size-3.5 text-primary" />
                            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="size-3.5 text-primary" />
                            <span className="truncate max-w-40">{event.venue}</span>
                          </div>

                          <div className="pt-2">
                            <span className="text-[10px] text-muted-foreground block">TICKET ID</span>
                            <span className="font-mono text-sm font-extrabold text-primary">
                              {reg.code}
                            </span>
                          </div>
                        </div>

                        {/* Dynamic QR Canvas */}
                        <div className="flex flex-col items-center">
                          <PassQrCode code={reg.code} />
                          <span className="text-[9px] text-muted-foreground mt-1 font-mono">
                            Scan for Entry
                          </span>
                        </div>
                      </div>

                      {/* Participant Details */}
                      <div className="text-xs text-muted-foreground space-y-1 bg-card p-3 rounded-xl border">
                        <div className="flex justify-between">
                          <span>Participant:</span>
                          <span className="font-semibold text-foreground">{reg.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Roll Number:</span>
                          <span className="font-semibold text-foreground">{reg.rollNumber}</span>
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

                        <Button variant="outline" size="sm" render={<Link to={`/events/${event.id}`} />} className="text-xs">
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
    </div>
  )
}
