import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Ticket,
  Sparkles,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { registerForEventApi } from '@/lib/api'
import { categoryStyles, dayOfMonth, monthLabel, formatFee, formatTime } from '@/lib/format'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    getEvent,
    isRegistered,
    register,
    addRegistration,
    registrationsFor,
    user,
    token,
    isLoggedIn,
  } = useStore()

  const event = id ? getEvent(id) : undefined
  const registered = event ? isRegistered(event.id) : false
  const registrations = event ? registrationsFor(event.id) : []
  const seatsTaken = registrations.length
  const seatsLeft = event ? Math.max(0, event.capacity - seatsTaken) : 0

  // 1-Click Registration state
  const [modalOpen, setModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (!event) {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold">Event Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The event you are looking for does not exist or has been removed.
          </p>
          <Button className="mt-4" render={<Link to="/events" />}>
            Browse All Events
          </Button>
        </main>
      </div>
    )
  }

  const handleOneClickRegister = async () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const authToken = token || user.id || 'usr-student-aarav'
      const res = await registerForEventApi(event.id, authToken)
      const ticketId = res.ticket_id || res.registration?.ticket_id || res.registration?.code

      // Add to client store so My Passes renders this dynamic ticket immediately
      addRegistration({
        id: res.registration?.id ? String(res.registration.id) : `reg-${ticketId}`,
        code: ticketId,
        eventId: event.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '98765 43210',
        college: user.college || 'IMS Engineering College',
        department: user.department || 'Computer Science',
        year: user.year || '3rd Year',
        rollNumber: user.rollNumber || 'SIT21CS042',
        registeredAt: new Date().toISOString(),
        checkedIn: false,
        paid: event.fee === 0,
      })

      setModalOpen(false)
      // Redirect student directly to "My Passes" where QR code is rendered
      navigate('/my-passes')
    } catch (err: any) {
      if (err.message && err.message.includes('Already registered')) {
        setModalOpen(false)
        navigate('/my-passes')
        return
      }

      // Offline fallback: register locally and proceed
      const fallbackTicket = register({
        eventId: event.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        department: user.department,
        year: user.year,
        rollNumber: user.rollNumber,
        paid: event.fee === 0,
      })
      setModalOpen(false)
      navigate('/my-passes')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Back to Events
            </Link>
          </div>

          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl border bg-card shadow-sm mb-8">
            <div className="relative aspect-21/9 w-full overflow-hidden bg-muted">
              <img
                src={event.image || '/placeholder.svg'}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="outline" className={cn('backdrop-blur', categoryStyles[event.category])}>
                  {event.category}
                </Badge>
                {event.status === 'live' && (
                  <Badge className="bg-destructive text-destructive-foreground animate-pulse">
                    Live Now
                  </Badge>
                )}
              </div>
            </div>

            <div className="relative p-6 sm:p-8 -mt-16 sm:-mt-20">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    {event.title}
                  </h1>
                  <p className="mt-2 text-base text-muted-foreground">
                    {event.tagline}
                  </p>
                </div>

                <div className="flex flex-col items-start sm:items-end shrink-0">
                  <span className="text-2xl font-bold text-primary">
                    {formatFee(event.fee)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {event.capacity} Capacity · {seatsLeft} seats left
                  </span>
                </div>
              </div>

              {/* Event Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y text-xs text-muted-foreground my-4">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">{dayOfMonth(event.date)} {monthLabel(event.date)}</div>
                    <div>{event.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">{formatTime(event.startTime)}</div>
                    <div>To {formatTime(event.endTime)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">{event.venue}</div>
                    <div>{event.department}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">{event.organizer}</div>
                    <div>{event.teamEvent ? `Team (Max ${event.teamSize})` : 'Individual Entry'}</div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[11px]">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {registered ? (
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="px-3 py-1.5 text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="size-4 mr-1.5 inline" />
                      You Are Registered
                    </Badge>
                    <Button variant="outline" render={<Link to="/my-passes" />}>
                      <Ticket className="size-4 mr-1.5" />
                      View Pass
                    </Button>
                  </div>
                ) : (
                  <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogTrigger render={
                      <Button size="lg" className="w-full sm:w-auto px-8 font-semibold rounded-xl gap-2 shadow-sm">
                        <Sparkles className="size-4" />
                        1-Click Register
                      </Button>
                    } />
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                          <Sparkles className="size-5 text-primary" />
                          1-Click Event Registration
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4 pt-2">
                        {errorMessage && (
                          <div className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20">
                            {errorMessage}
                          </div>
                        )}

                        <div className="rounded-2xl border bg-muted/40 p-4 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b">
                            <span className="text-xs text-muted-foreground">Event:</span>
                            <span className="text-xs font-bold text-foreground truncate max-w-48 text-right">{event.title}</span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b">
                            <span className="text-xs text-muted-foreground">Student Name:</span>
                            <span className="text-xs font-semibold text-foreground">{user.name}</span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b">
                            <span className="text-xs text-muted-foreground">Roll Number:</span>
                            <span className="text-xs font-mono font-medium text-foreground">{user.rollNumber || 'SIT21CS042'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Entry Fee:</span>
                            <span className="text-xs font-bold text-primary">{formatFee(event.fee)}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-muted-foreground text-center">
                          Click below to instantly generate your digital QR entry pass with your student credentials.
                        </p>

                        <Button
                          onClick={handleOneClickRegister}
                          disabled={isSubmitting}
                          size="lg"
                          className="w-full h-12 font-bold text-sm rounded-xl gap-2 shadow-md"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Securing Your Pass...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="size-4" />
                              Confirm 1-Click Registration
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Description Section */}
          <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-foreground">About This Event</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {event.prize && (
              <div className="mt-4 rounded-2xl bg-amber-500/10 p-4 border border-amber-500/20 flex items-center gap-3">
                <Sparkles className="size-6 text-amber-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">Prizes & Recognitions</h4>
                  <p className="text-xs text-amber-800 dark:text-amber-400">{event.prize}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
