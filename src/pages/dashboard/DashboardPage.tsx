import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Plus,
  QrCode,
  Users,
  CheckCircle2,
  Trash2,
  Search,
  RefreshCw,
  Shield,
  Calendar,
  DollarSign,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { fetchEventRosterApi, verifyAttendanceApi } from '@/lib/api'
import type { EventCategory } from '@/lib/types'
import { EVENT_CATEGORIES, formatFee } from '@/lib/format'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const {
    role,
    user,
    events,
    registrations,
    announcements,
    createEvent,
    deleteEvent,
    checkInByCode,
    setCheckedIn,
    togglePaid,
    addAnnouncement,
    deleteAnnouncement,
    resetDatabase,
  } = useStore()

  // Tabs state
  const [activeTab, setActiveTab] = useState('events')

  // Create Event Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newTagline, setNewTagline] = useState('')
  const [newCategory, setNewCategory] = useState<EventCategory>('Technical')
  const [newDate, setNewDate] = useState('2026-08-25')
  const [newStartTime, setNewStartTime] = useState('10:00')
  const [newEndTime, setNewEndTime] = useState('16:00')
  const [newVenue, setNewVenue] = useState('Main Auditorium')
  const [newDepartment, setNewDepartment] = useState('Computer Science')
  const [newOrganizer, setNewOrganizer] = useState('Tech Council')
  const [newCapacity, setNewCapacity] = useState('150')
  const [newFee, setNewFee] = useState('0')
  const [newTeamEvent, setNewTeamEvent] = useState(false)
  const [newDescription, setNewDescription] = useState('')
  const [newImage, setNewImage] = useState('/events/tech-fest.png')

  // Scanner Check In State
  const [scanCode, setScanCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)

  // Roster State
  const [rosterData, setRosterData] = useState<Array<{
    id: number | string
    ticket_id: string
    code: string
    event_id: string
    event_title?: string
    user_id: string
    student_name: string
    name: string
    rollNumber: string
    email: string
    department?: string
    attendance_verified: boolean
  }>>([])
  const [isLoadingRoster, setIsLoadingRoster] = useState(false)
  const [rosterSearch, setRosterSearch] = useState('')
  const [selectedEventIdFilter, setSelectedEventIdFilter] = useState('all')

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('')
  const [annMessage, setAnnMessage] = useState('')
  const [annEventId, setAnnEventId] = useState('all')
  const [annPriority, setAnnPriority] = useState<'normal' | 'urgent'>('normal')


  const loadRoster = async (eventId: string = selectedEventIdFilter) => {
    setIsLoadingRoster(true)
    try {
      const data = await fetchEventRosterApi(eventId)
      if (Array.isArray(data)) {
        setRosterData(data)
      }
    } catch (err) {
      console.warn('Could not fetch roster from API, falling back to store:', err)
      // Fallback from store registrations
      const mapped = registrations
        .filter((r) => eventId === 'all' || r.eventId === eventId)
        .map((r) => ({
          id: r.id,
          ticket_id: r.code,
          code: r.code,
          event_id: r.eventId,
          event_title: events.find((e) => e.id === r.eventId)?.title || 'Campus Event',
          user_id: r.id,
          student_name: r.name,
          name: r.name,
          rollNumber: r.rollNumber,
          email: r.email,
          department: r.department,
          attendance_verified: r.checkedIn,
        }))
      setRosterData(mapped)
    } finally {
      setIsLoadingRoster(false)
    }
  }

  useEffect(() => {
    loadRoster(selectedEventIdFilter)
  }, [selectedEventIdFilter, registrations])

  // Create Event Handler
  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createEvent({
      title: newTitle,
      tagline: newTagline,
      category: newCategory,
      status: 'upcoming',
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      venue: newVenue,
      department: newDepartment,
      organizer: newOrganizer,
      capacity: parseInt(newCapacity) || 100,
      fee: parseInt(newFee) || 0,
      teamEvent: newTeamEvent,
      image: newImage,
      description: newDescription || 'Full campus event details.',
      tags: ['Campus', newCategory],
    })

    setCreateModalOpen(false)
    setNewTitle('')
    setNewTagline('')
    setNewDescription('')
  }

  const handleMarkAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = scanCode.trim().toUpperCase()
    if (!code) return

    setIsVerifying(true)
    setScanResult(null)

    try {
      const res = await verifyAttendanceApi(code)
      setScanResult({
        status: 'success',
        already: res.already_verified,
        registration: res.registration,
        message: res.message,
      })

      // Update local roster list immediately
      setRosterData((prev) =>
        prev.map((item) =>
          item.ticket_id.toUpperCase() === code || item.code.toUpperCase() === code
            ? { ...item, attendance_verified: true }
            : item,
        ),
      )

      // Also update store if this ticket exists in registrations
      checkInByCode(code)
      setScanCode('')
      loadRoster(selectedEventIdFilter)
    } catch (err: any) {
      // Offline fallback: try local store check in
      const storeRes = checkInByCode(code)
      if (storeRes.status === 'success') {
        setScanResult({
          status: 'success',
          registration: {
            ticket_id: storeRes.registration.code,
            student_name: storeRes.registration.name,
            rollNumber: storeRes.registration.rollNumber,
            event_title: storeRes.event.title,
          },
          message: 'Attendance verified successfully!',
        })
        loadRoster(selectedEventIdFilter)
        setScanCode('')
      } else if (storeRes.status === 'already') {
        setScanResult({
          status: 'already',
          registration: {
            ticket_id: storeRes.registration.code,
            student_name: storeRes.registration.name,
            rollNumber: storeRes.registration.rollNumber,
            event_title: storeRes.event.title,
          },
          message: 'Attendee was already marked present.',
        })
      } else {
        setScanResult({
          status: 'not-found',
          message: err.message || `Ticket '${code}' not found in database.`,
        })
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleAddAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!annTitle.trim() || !annMessage.trim()) return
    addAnnouncement({
      eventId: annEventId,
      title: annTitle,
      message: annMessage,
      priority: annPriority,
    })
    setAnnTitle('')
    setAnnMessage('')
    alert('Announcement posted to persistent database!')
  }

  // Calculated Stats
  const totalRegistrations = rosterData.length || registrations.length
  const checkedInCount =
    rosterData.filter((r) => r.attendance_verified).length ||
    registrations.filter((r) => r.checkedIn).length
  const totalRevenue = registrations.reduce((acc, r) => {
    const ev = events.find((e) => e.id === r.eventId)
    return acc + (ev ? ev.fee : 0)
  }, 0)

  // Filtered Roster
  const filteredRoster = rosterData.filter((r) => {
    const q = rosterSearch.trim().toLowerCase()
    return (
      !q ||
      (r.student_name && r.student_name.toLowerCase().includes(q)) ||
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      (r.rollNumber && r.rollNumber.toLowerCase().includes(q)) ||
      (r.ticket_id && r.ticket_id.toLowerCase().includes(q)) ||
      (r.code && r.code.toLowerCase().includes(q))
    )
  })

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-purple-500/10 via-primary/10 to-indigo-500/10 p-6 border border-purple-500/20">
            <div>
              <Badge className="mb-2 bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300">
                <LayoutDashboard className="size-3.5 mr-1.5 inline" />
                {role === 'admin' ? 'Campus System Admin Portal' : 'Event Organizer Operations'}
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                Dashboard & Management Suite
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Logged in as <strong className="text-foreground">{user.name}</strong> ({role.toUpperCase()})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogTrigger render={
                  <Button className="rounded-xl font-semibold gap-2 shadow-sm">
                    <Plus className="size-4" />
                    Create New Event
                  </Button>
                } />
                <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Create Campus Event</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateEventSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <Label htmlFor="eventTitle" className="text-xs">Event Title</Label>
                      <Input
                        id="eventTitle"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. AI & Robotics Buildathon 2026"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="eventTagline" className="text-xs">Tagline</Label>
                      <Input
                        id="eventTagline"
                        value={newTagline}
                        onChange={(e) => setNewTagline(e.target.value)}
                        placeholder="e.g. Build the future with autonomous AI agents"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Category</Label>
                        <Select
                          items={EVENT_CATEGORIES.map((c) => ({ value: c, label: c }))}
                          value={newCategory}
                          onValueChange={(val) => setNewCategory(val as EventCategory)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {EVENT_CATEGORIES.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="eventDate" className="text-xs">Date</Label>
                        <Input
                          id="eventDate"
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="startTime" className="text-xs">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={newStartTime}
                          onChange={(e) => setNewStartTime(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="endTime" className="text-xs">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={newEndTime}
                          onChange={(e) => setNewEndTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="venue" className="text-xs">Venue</Label>
                        <Input
                          id="venue"
                          value={newVenue}
                          onChange={(e) => setNewVenue(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="dept" className="text-xs">Department</Label>
                        <Input
                          id="dept"
                          value={newDepartment}
                          onChange={(e) => setNewDepartment(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="capacity" className="text-xs">Max Capacity</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={newCapacity}
                          onChange={(e) => setNewCapacity(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="fee" className="text-xs">Registration Fee (Rs.)</Label>
                        <Input
                          id="fee"
                          type="number"
                          value={newFee}
                          onChange={(e) => setNewFee(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="desc" className="text-xs">Description</Label>
                      <Textarea
                        id="desc"
                        rows={3}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Detailed schedule and guidelines..."
                      />
                    </div>

                    <Button type="submit" className="w-full h-11 font-semibold rounded-xl mt-2">
                      Publish Event to Database
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border bg-card">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Events</p>
                  <h3 className="text-2xl font-bold text-foreground mt-1">{events.length}</h3>
                </div>
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Calendar className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border bg-card">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Registrations</p>
                  <h3 className="text-2xl font-bold text-foreground mt-1">{totalRegistrations}</h3>
                </div>
                <div className="size-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Users className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border bg-card">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Attendance Verified</p>
                  <h3 className="text-2xl font-bold text-foreground mt-1">{checkedInCount}</h3>
                </div>
                <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border bg-card">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Revenue Collected</p>
                  <h3 className="text-2xl font-bold text-foreground mt-1">Rs. {totalRevenue.toLocaleString()}</h3>
                </div>
                <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <DollarSign className="size-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 sm:grid-cols-5 rounded-2xl bg-muted/80 p-1.5 border">
              <TabsTrigger value="events" className="rounded-xl text-xs font-semibold">
                Event Directory ({events.length})
              </TabsTrigger>
              <TabsTrigger value="scanner" className="rounded-xl text-xs font-semibold">
                QR Scanner & Check-in
              </TabsTrigger>
              <TabsTrigger value="roster" className="rounded-xl text-xs font-semibold">
                Participant Roster ({registrations.length})
              </TabsTrigger>
              <TabsTrigger value="announcements" className="rounded-xl text-xs font-semibold">
                Announcements ({announcements.length})
              </TabsTrigger>
              <TabsTrigger value="admin" className="rounded-xl text-xs font-semibold">
                System Governance
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: EVENT DIRECTORY & MANAGEMENT */}
            <TabsContent value="events" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => {
                  const eventRegs = registrations.filter((r) => r.eventId === event.id)
                  return (
                    <Card key={event.id} className="overflow-hidden rounded-2xl border bg-card">
                      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between gap-2">
                        <div>
                          <Badge variant="outline" className="text-[10px] mb-1">
                            {event.category}
                          </Badge>
                          <CardTitle className="text-base font-bold leading-tight">{event.title}</CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm(`Delete event "${event.title}"?`)) deleteEvent(event.id)
                          }}
                          className="text-destructive hover:bg-destructive/10 shrink-0 size-8"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-3 text-xs text-muted-foreground">
                        <p className="line-clamp-2">{event.tagline}</p>
                        <div className="flex justify-between border-t pt-2 font-medium text-foreground">
                          <span>Registrations: {eventRegs.length} / {event.capacity}</span>
                          <span>Fee: {formatFee(event.fee)}</span>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button variant="outline" size="sm" className="w-full text-xs" render={<Link to={`/events/${event.id}`} />}>
                            View Event Page
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* TAB 2: QR SCANNER & MANUAL CODE CHECK-IN */}
            <TabsContent value="scanner" className="space-y-4">
              <Card className="rounded-3xl border max-w-xl mx-auto shadow-sm">
                <CardHeader className="text-center pb-2">
                  <div className="size-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-2">
                    <QrCode className="size-7" />
                  </div>
                  <CardTitle className="text-xl font-bold">QR Scanner & Check-in</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Enter the participant's <span className="font-mono text-primary font-semibold">Ticket ID</span> (e.g. SIT-A89F2K) to verify attendance.
                  </p>
                </CardHeader>
                <CardContent className="p-6 pt-2 space-y-4">
                  <form onSubmit={handleMarkAttendanceSubmit} className="flex gap-2">
                    <Input
                      value={scanCode}
                      onChange={(e) => setScanCode(e.target.value)}
                      placeholder="Enter Ticket ID (e.g. SIT-A89F2K)"
                      className="font-mono uppercase text-sm h-11"
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isVerifying}
                      className="h-11 px-6 font-semibold rounded-xl shrink-0 gap-2"
                    >
                      {isVerifying ? (
                        <>
                          <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Marking...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-4" />
                          Mark Attendance
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Scan Result Feedback */}
                  {scanResult && (
                    <div className={cn(
                      'p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in zoom-in-95',
                      scanResult.status === 'success' && 'bg-emerald-50/90 border-emerald-300 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200',
                      scanResult.status === 'already' && 'bg-amber-50/90 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200',
                      scanResult.status === 'not-found' && 'bg-rose-50/90 border-rose-300 text-rose-900 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-200'
                    )}>
                      {scanResult.status === 'success' && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="size-4" />
                            ATTENDANCE VERIFIED!
                          </div>
                          <p>Student Name: <strong>{scanResult.registration.student_name || scanResult.registration.name}</strong></p>
                          <p>Roll Number: <strong>{scanResult.registration.rollNumber || 'N/A'}</strong></p>
                          <p>Ticket ID: <span className="font-mono font-bold">{scanResult.registration.ticket_id || scanResult.registration.code}</span></p>
                          {scanResult.registration.event_title && (
                            <p>Event: <strong>{scanResult.registration.event_title}</strong></p>
                          )}
                        </div>
                      )}

                      {scanResult.status === 'already' && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-sm text-amber-700 dark:text-amber-400">
                            <AlertTriangle className="size-4" />
                            ALREADY CHECKED IN
                          </div>
                          <p>Attendee: <strong>{scanResult.registration.student_name || scanResult.registration.name}</strong> was previously verified.</p>
                        </div>
                      )}

                      {scanResult.status === 'not-found' && (
                        <div className="flex items-center gap-1.5 font-bold text-sm text-rose-700 dark:text-rose-400">
                          <AlertTriangle className="size-4" />
                          {scanResult.message || 'Ticket ID not found in database.'}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: PARTICIPANT ROSTER & ATTENDANCE */}
            <TabsContent value="roster" className="space-y-4">
              <Card className="rounded-3xl border shadow-sm">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 pb-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      value={rosterSearch}
                      onChange={(e) => setRosterSearch(e.target.value)}
                      placeholder="Search student name, roll # or ticket ID..."
                      className="pl-9 h-10 text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Select
                      items={[
                        { value: 'all', label: 'All Events' },
                        ...events.map((e) => ({ value: e.id, label: e.title })),
                      ]}
                      value={selectedEventIdFilter}
                      onValueChange={(val) => setSelectedEventIdFilter(val || 'all')}
                    >
                      <SelectTrigger className="h-10 text-xs min-w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">All Events</SelectItem>
                          {events.map((e) => (
                            <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadRoster(selectedEventIdFilter)}
                      className="h-10 text-xs gap-1.5"
                    >
                      <RefreshCw className={cn("size-3.5", isLoadingRoster && "animate-spin")} />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-left text-xs border-t">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold">
                      <tr>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Roll Number</th>
                        <th className="p-3">Ticket ID</th>
                        <th className="p-3">Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredRoster.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-muted-foreground text-xs">
                            {isLoadingRoster ? 'Loading participant roster...' : 'No participant registrations found.'}
                          </td>
                        </tr>
                      ) : (
                        filteredRoster.map((r) => {
                          const ticketId = r.ticket_id || r.code
                          return (
                            <tr key={r.id || ticketId} className="hover:bg-muted/40 transition-colors">
                              <td className="p-3">
                                <div className="font-semibold text-foreground">{r.student_name || r.name}</div>
                                <div className="text-[10px] text-muted-foreground">{r.email}</div>
                              </td>
                              <td className="p-3 font-mono font-medium">{r.rollNumber || 'N/A'}</td>
                              <td className="p-3 font-mono font-bold text-primary">{ticketId}</td>
                              <td className="p-3">
                                {r.attendance_verified ? (
                                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold gap-1">
                                    <CheckCircle2 className="size-3" />
                                    Checked-In
                                  </Badge>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 font-semibold gap-1">
                                      <Clock className="size-3" />
                                      Pending
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={async () => {
                                        try {
                                          await verifyAttendanceApi(ticketId)
                                          loadRoster(selectedEventIdFilter)
                                        } catch {
                                          setCheckedIn(String(r.id), true)
                                        }
                                      }}
                                      className="h-6 text-[10px] px-2 text-primary hover:bg-primary/10"
                                    >
                                      Mark Present
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4: BROADCAST ANNOUNCEMENTS */}
            <TabsContent value="announcements" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-12">
                {/* Form */}
                <Card className="md:col-span-5 rounded-3xl border">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Broadcast Announcement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleAddAnnouncementSubmit} className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="annTitle" className="text-xs">Announcement Title</Label>
                        <Input
                          id="annTitle"
                          value={annTitle}
                          onChange={(e) => setAnnTitle(e.target.value)}
                          placeholder="e.g. Venue Change for CodeStorm"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="annMsg" className="text-xs">Message Content</Label>
                        <Textarea
                          id="annMsg"
                          rows={3}
                          value={annMessage}
                          onChange={(e) => setAnnMessage(e.target.value)}
                          placeholder="Broadcast details to attendee notifications..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Priority</Label>
                          <Select value={annPriority} onValueChange={(v) => setAnnPriority((v as any) || 'normal')}>
                            <SelectTrigger className="text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Target Event</Label>
                          <Select value={annEventId} onValueChange={(val) => setAnnEventId(val || 'all')}>
                            <SelectTrigger className="text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="all">All Events</SelectItem>
                                {events.map((e) => (
                                  <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button type="submit" className="w-full h-10 text-xs font-semibold rounded-xl mt-2">
                        Post Announcement
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Feed */}
                <Card className="md:col-span-7 rounded-3xl border">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Active Broadcast Stream</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="flex items-start justify-between p-4 rounded-2xl border bg-card gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-foreground">{ann.title}</h4>
                            {ann.priority === 'urgent' && (
                              <Badge variant="destructive" className="text-[10px]">Urgent</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{ann.message}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteAnnouncement(ann.id)}
                          className="text-destructive hover:bg-destructive/10 shrink-0 size-8"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TAB 5: ADMIN SYSTEM GOVERNANCE */}
            <TabsContent value="admin" className="space-y-6">
              <Card className="rounded-3xl border p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Shield className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">System Governance & Database Control</h3>
                    <p className="text-xs text-muted-foreground">Manage campus event policies and database resets.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold">Reset Database to Initial Seed Data</h4>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300">
                      Wipes all custom events, student registrations, and restored demo datasets.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (confirm('Reset entire database to initial seed data?')) {
                        resetDatabase()
                        alert('Database reset to initial demo seeds!')
                      }
                    }}
                    className="border-amber-500/40 text-amber-900 dark:text-amber-100 hover:bg-amber-500/20 shrink-0"
                  >
                    <RefreshCw className="size-4 mr-1.5" />
                    Reset Data Store
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
