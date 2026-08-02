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
import { categoryStyles, dayOfMonth, monthLabel, formatFee, formatTime } from '@/lib/format'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getEvent, isRegistered, register, registrationsFor, user } = useStore()

  const event = id ? getEvent(id) : undefined
  const registered = event ? isRegistered(event.id) : false
  const registrations = event ? registrationsFor(event.id) : []
  const seatsTaken = registrations.length
  const seatsLeft = event ? Math.max(0, event.capacity - seatsTaken) : 0

  // Registration Form state
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone)
  const [college, setCollege] = useState(user.college)
  const [department, setDepartment] = useState(user.department)
  const [year, setYear] = useState(user.year)
  const [rollNumber, setRollNumber] = useState(user.rollNumber)
  const [teamName, setTeamName] = useState('')
  const [members, setMembers] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successRegistration, setSuccessRegistration] = useState<any>(null)

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
        <SiteFooter />
      </div>
    )
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      const created = register({
        eventId: event.id,
        name,
        email,
        phone,
        college,
        department,
        year,
        rollNumber,
        teamName: event.teamEvent ? teamName : undefined,
        members: event.teamEvent ? members : undefined,
        paid: event.fee === 0,
      })

      setIsSubmitting(false)
      setSuccessRegistration(created)
    }, 600)
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
                      <Button size="lg" className="w-full sm:w-auto px-8 font-semibold rounded-xl">
                        Register Now
                      </Button>
                    } />
                    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                          Register for {event.title}
                        </DialogTitle>
                      </DialogHeader>

                      {successRegistration ? (
                        <div className="py-6 text-center space-y-4">
                          <CheckCircle2 className="size-16 text-emerald-500 mx-auto animate-bounce" />
                          <h3 className="text-lg font-bold text-foreground">
                            Registration Successful!
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Your pass code is <strong className="text-primary font-mono">{successRegistration.code}</strong>. You can view your dynamic QR ticket in My Passes.
                          </p>
                          <div className="flex justify-center gap-3 pt-2">
                            <Button onClick={() => setModalOpen(false)} variant="outline">
                              Close
                            </Button>
                            <Button render={<Link to="/my-passes" />}>
                              View My Pass
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-2">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="regName" className="text-xs">Full Name</Label>
                              <Input
                                id="regName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="regEmail" className="text-xs">Email Address</Label>
                              <Input
                                id="regEmail"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="regRoll" className="text-xs">Roll Number</Label>
                              <Input
                                id="regRoll"
                                value={rollNumber}
                                onChange={(e) => setRollNumber(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="regPhone" className="text-xs">Phone Number</Label>
                              <Input
                                id="regPhone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="regDept" className="text-xs">Department</Label>
                              <Input
                                id="regDept"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="regYear" className="text-xs">Academic Year</Label>
                              <Input
                                id="regYear"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          {event.teamEvent && (
                            <div className="space-y-3 pt-2 border-t">
                              <div className="space-y-1">
                                <Label htmlFor="teamName" className="text-xs font-semibold">Team Name</Label>
                                <Input
                                  id="teamName"
                                  placeholder="e.g. Cyber Knights"
                                  value={teamName}
                                  onChange={(e) => setTeamName(e.target.value)}
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="members" className="text-xs">Team Members (Names & Roll Numbers)</Label>
                                <Input
                                  id="members"
                                  placeholder="e.g. Rahul S. (CS01), Priya M. (CS02)"
                                  value={members}
                                  onChange={(e) => setMembers(e.target.value)}
                                />
                              </div>
                            </div>
                          )}

                          <div className="pt-2">
                            <Button type="submit" disabled={isSubmitting} className="w-full h-11 font-semibold">
                              {isSubmitting ? 'Processing Registration...' : `Confirm Registration (${formatFee(event.fee)})`}
                            </Button>
                          </div>
                        </form>
                      )}
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

      <SiteFooter />
    </div>
  )
}
