import React, { useState, useEffect, useRef } from 'react'
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
  Calendar,
  DollarSign,
  AlertTriangle,
  Clock,
  Zap,
  Upload,
  ArrowRight,
  Award,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import {
  fetchEventRosterApi,
  verifyAttendanceApi,
  fetchOrganizerEventsApi,
  createEventApi,
  deleteEventApi,
  closeEventApi,
} from '@/lib/api'
import type { EventCategory, EventItem } from '@/lib/types'
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
import { AnimatedGradientBg } from '@/components/ui/animated-gradient-bg'

export default function DashboardPage() {
  const {
    role,
    user,
    token,
    deleteEvent: storeDeleteEvent,
    refreshEvents: storeRefreshEvents,
    checkInByCode,
    setCheckedIn,
  } = useStore()

  // Effective token ensuring organizer role if currently viewed under organizer portal
  const effectiveToken =
    token || (role === 'organizer' ? 'usr-organizer-meera' : 'usr-student-aarav')

  // Tabs state: ONLY 'events', 'scanner', and 'roster' (announcements & admin removed)
  const [activeTab, setActiveTab] = useState<'events' | 'scanner' | 'roster'>('events')

  // Live Events state directly from MySQL database
  const [eventsList, setEventsList] = useState<EventItem[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)

  // Create Event Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newTagline, setNewTagline] = useState('')
  const [newCategory, setNewCategory] = useState<EventCategory>('Technical')
  const [newDate, setNewDate] = useState('2026-08-25')
  const [newStartTime, setNewStartTime] = useState('10:00')
  const [newEndTime, setNewEndTime] = useState('16:00')
  const [newVenue, setNewVenue] = useState('Main Auditorium')
  const [newDepartment, setNewDepartment] = useState('Computer Science')
  const [newCapacity, setNewCapacity] = useState('150')
  const [newFee, setNewFee] = useState('0')
  const [newDescription, setNewDescription] = useState('')
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Scanner Check In State
  const [scanCode, setScanCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [scanResult, setScanResult] = useState<{
    status: 'success' | 'already' | 'not-found' | 'forbidden'
    registration?: any
    message?: string
    already?: boolean
  } | null>(null)

  // Auto-scanner debounce ref to avoid duplicate rapid triggers
  const lastScannedCodeRef = useRef<string>('')
  const autoScanDebounceTimerRef = useRef<any>(null)

  // Roster State
  const [rosterData, setRosterData] = useState<
    Array<{
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
    }>
  >([])
  const [isLoadingRoster, setIsLoadingRoster] = useState(false)
  const [rosterSearch, setRosterSearch] = useState('')
  const [selectedEventIdFilter, setSelectedEventIdFilter] = useState('all')

  // Close Event & Issue Certificates State
  const [closingEvent, setClosingEvent] = useState<EventItem | null>(null)
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)
  const [closeRoster, setCloseRoster] = useState<
    Array<{
      id: number | string
      ticket_id: string
      code: string
      event_id: string
      student_name: string
      name: string
      rollNumber: string
      email: string
      department?: string
      attendance_verified: boolean
    }>
  >([])
  const [isLoadingCloseRoster, setIsLoadingCloseRoster] = useState(false)
  const [firstPlaceTicket, setFirstPlaceTicket] = useState<string>('')
  const [secondPlaceTicket, setSecondPlaceTicket] = useState<string>('')
  const [thirdPlaceTicket, setThirdPlaceTicket] = useState<string>('')
  const [isSubmittingClose, setIsSubmittingClose] = useState(false)
  const [closeSuccessMessage, setCloseSuccessMessage] = useState<string | null>(null)

  const handleOpenCloseModal = async (event: EventItem) => {
    setClosingEvent(event)
    setFirstPlaceTicket('')
    setSecondPlaceTicket('')
    setThirdPlaceTicket('')
    setCloseSuccessMessage(null)
    setIsCloseModalOpen(true)
    setIsLoadingCloseRoster(true)
    try {
      const roster = await fetchEventRosterApi(event.id)
      setCloseRoster(roster)
    } catch (err) {
      console.error('Error fetching roster for close modal:', err)
      setCloseRoster([])
    } finally {
      setIsLoadingCloseRoster(false)
    }
  }

  const handleConfirmCloseEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!closingEvent) return
    setIsSubmittingClose(true)
    try {
      const res = await closeEventApi(
        closingEvent.id,
        {
          first_place_ticket_id: firstPlaceTicket || undefined,
          second_place_ticket_id: secondPlaceTicket || undefined,
          third_place_ticket_id: thirdPlaceTicket || undefined,
        },
        effectiveToken,
      )
      setCloseSuccessMessage(res.message)
      setEventsList((prev) =>
        prev.map((ev) => (ev.id === closingEvent.id ? { ...ev, status: 'completed' as const } : ev))
      )
      loadEvents()
      loadRoster(selectedEventIdFilter)
      setTimeout(() => {
        setIsCloseModalOpen(false)
        setClosingEvent(null)
      }, 1800)
    } catch (err: any) {
      console.error('Error closing event:', err)
      alert(err.message || 'Failed to close event and issue certificates')
    } finally {
      setIsSubmittingClose(false)
    }
  }

  // Load live events directly from MySQL API
  const loadEvents = async () => {
    setIsLoadingEvents(true)
    try {
      const data = await fetchOrganizerEventsApi()
      if (Array.isArray(data)) {
        setEventsList(data)
      }
    } catch (err) {
      console.error('Failed to fetch live events from API:', err)
    } finally {
      setIsLoadingEvents(false)
    }
  }

  // Load participant roster directly from API
  const loadRoster = async (eventId: string = selectedEventIdFilter) => {
    setIsLoadingRoster(true)
    try {
      const data = await fetchEventRosterApi(eventId)
      if (Array.isArray(data)) {
        setRosterData(data)
      }
    } catch (err) {
      console.warn('Could not fetch roster from API:', err)
    } finally {
      setIsLoadingRoster(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    loadRoster(selectedEventIdFilter)
  }, [selectedEventIdFilter])

  // Handle Create Event with multipart/form-data
  const handleCreateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingEvent(true)

    try {
      const formData = new FormData()
      formData.append('title', newTitle.trim())
      formData.append('tagline', newTagline.trim())
      formData.append('category', newCategory)
      formData.append('date', newDate.trim())
      formData.append('startTime', newStartTime.trim())
      formData.append('endTime', newEndTime.trim())
      formData.append('venue', newVenue.trim())
      formData.append('department', newDepartment.trim())
      formData.append('organizer', user.name || 'Campus Organizer')
      formData.append('capacity', String(parseInt(newCapacity) || 100))
      formData.append('fee', String(parseInt(newFee) || 0))
      formData.append(
        'description',
        newDescription.trim() || 'Comprehensive campus event details and schedule.',
      )

      if (newImageFile) {
        formData.append('image', newImageFile)
      }

      await createEventApi(formData, effectiveToken)

      // Refresh live events and store
      await loadEvents()
      storeRefreshEvents?.()

      // Reset form
      setCreateModalOpen(false)
      setNewTitle('')
      setNewTagline('')
      setNewDescription('')
      setNewImageFile(null)
      setImagePreview(null)
    } catch (err: any) {
      console.error('Error creating event:', err)
      alert(err.message || 'Failed to publish event to database.')
    } finally {
      setIsSubmittingEvent(false)
    }
  }

  // Handle Delete Event (Restricted to Organizer)
  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${eventTitle}"? This will also remove associated attendee registrations.`)) {
      return
    }

    try {
      await deleteEventApi(eventId, effectiveToken)
      storeDeleteEvent(eventId)
      await loadEvents()
      await loadRoster(selectedEventIdFilter)
    } catch (err: any) {
      console.error('Failed to delete event:', err)
      alert(err.message || 'Failed to delete event. Organizer credentials required.')
    }
  }

  // Core Attendance Verification Logic (Calls POST /api/attendance/verify with Organizer token)
  const executeVerify = async (codeToVerify: string) => {
    const code = codeToVerify.trim().toUpperCase()
    if (!code) return

    setIsVerifying(true)
    setScanResult(null)

    try {
      const res = await verifyAttendanceApi(code, effectiveToken)
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

      checkInByCode(code)
      loadRoster(selectedEventIdFilter)
      lastScannedCodeRef.current = code
    } catch (err: any) {
      console.warn('Verification error:', err)
      const isForbidden =
        err.message?.includes('403') ||
        err.message?.toLowerCase().includes('forbidden') ||
        err.message?.toLowerCase().includes('only organizers')

      setScanResult({
        status: isForbidden ? 'forbidden' : 'not-found',
        message: err.message || `Ticket '${code}' not found in database.`,
      })
    } finally {
      setIsVerifying(false)
    }
  }

  // Auto-Scanner Logic: triggers POST /api/attendance/verify automatically when valid QR string recognized
  const handleScanInputChange = (val: string) => {
    setScanCode(val)
    const cleaned = val.trim().toUpperCase()

    // Clear any existing pending auto-scan timer
    if (autoScanDebounceTimerRef.current) {
      clearTimeout(autoScanDebounceTimerRef.current)
    }

    // Check if input matches valid ticket string format (e.g., SIT-4308AD, SIT-A89F2K)
    const isTicketPattern = /^SIT-[A-Z0-9]{4,10}$/i.test(cleaned)

    if (isTicketPattern && cleaned !== lastScannedCodeRef.current) {
      // Auto-trigger API call immediately upon recognizing valid QR ticket string
      autoScanDebounceTimerRef.current = setTimeout(() => {
        executeVerify(cleaned)
      }, 150)
    }
  }

  const handleManualScanSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeVerify(scanCode)
  }

  // Metrics
  const totalRegistrations = rosterData.length
  const checkedInCount = rosterData.filter((r) => r.attendance_verified).length
  const totalRevenue = eventsList.reduce((acc, ev) => {
    const regs = rosterData.filter((r) => r.event_id === ev.id)
    return acc + regs.length * (ev.fee || 0)
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

  // Pending tickets for interactive quick-scan simulation
  const pendingTickets = rosterData
    .filter((r) => !r.attendance_verified)
    .slice(0, 5)

  return (
    <AnimatedGradientBg accentColor="neutral">
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-white/30 backdrop-blur-md p-6 border border-white/60 shadow-xs">
              <div>
                <Badge className="mb-2 bg-purple-100 text-purple-800 border-purple-200/60 font-semibold shadow-xs">
                  <LayoutDashboard className="size-3.5 mr-1.5 inline" />
                  Event Organizer Operations
                </Badge>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Dashboard & Management Suite
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Logged in as <strong className="text-slate-900">{user.name}</strong> (ORGANIZER) — Connected to live MySQL database
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Create Campus Event Modal */}
                <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                  <DialogTrigger render={
                    <Button className="rounded-xl font-semibold gap-2 shadow-sm cursor-pointer">
                      <Plus className="size-4" />
                      Create New Event
                    </Button>
                  } />
                  <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 text-slate-900 shadow-2xl rounded-3xl p-6">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-slate-900">Create Campus Event</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateEventSubmit} className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <Label htmlFor="eventTitle" className="text-xs font-semibold text-slate-700">Event Title</Label>
                        <Input
                          id="eventTitle"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="e.g. AI & Robotics Buildathon 2026"
                          className="bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="eventTagline" className="text-xs font-semibold text-slate-700">Tagline</Label>
                        <Input
                          id="eventTagline"
                          value={newTagline}
                          onChange={(e) => setNewTagline(e.target.value)}
                          placeholder="e.g. Build the future with autonomous AI agents"
                          className="bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-700">Category</Label>
                          <Select
                            items={EVENT_CATEGORIES.map((c) => ({ value: c, label: c }))}
                            value={newCategory}
                            onValueChange={(val) => setNewCategory(val as EventCategory)}
                          >
                            <SelectTrigger className="h-10 text-xs w-full bg-slate-50 border border-slate-300 text-slate-900 data-placeholder:text-slate-400 focus:border-primary focus:bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200 text-slate-900 shadow-xl">
                              <SelectGroup>
                                {EVENT_CATEGORIES.map((c) => (
                                  <SelectItem key={c} value={c} className="text-slate-900 hover:bg-slate-100 cursor-pointer">
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="eventDate" className="text-xs font-semibold text-slate-700">Date</Label>
                          <Input
                            id="eventDate"
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white cursor-pointer"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="startTime" className="text-xs font-semibold text-slate-700">Start Time</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={newStartTime}
                            onChange={(e) => setNewStartTime(e.target.value)}
                            className="bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white cursor-pointer"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="endTime" className="text-xs font-semibold text-slate-700">End Time</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={newEndTime}
                            onChange={(e) => setNewEndTime(e.target.value)}
                            className="bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white cursor-pointer"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="venue" className="text-xs font-semibold text-slate-700">Venue</Label>
                          <Input
                            id="venue"
                            value={newVenue}
                            onChange={(e) => setNewVenue(e.target.value)}
                            placeholder="e.g. Innovation Block, Lab 4"
                            className="bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="dept" className="text-xs font-semibold text-slate-700">Department</Label>
                          <Input
                            id="dept"
                            value={newDepartment}
                            onChange={(e) => setNewDepartment(e.target.value)}
                            placeholder="e.g. Computer Science"
                            className="bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="capacity" className="text-xs font-semibold text-slate-700">Max Capacity</Label>
                          <Input
                            id="capacity"
                            type="number"
                            min="1"
                            value={newCapacity}
                            onChange={(e) => setNewCapacity(e.target.value)}
                            className="bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="fee" className="text-xs font-semibold text-slate-700">Registration Fee (Rs.)</Label>
                          <Input
                            id="fee"
                            type="number"
                            min="0"
                            value={newFee}
                            onChange={(e) => setNewFee(e.target.value)}
                            className="bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="desc" className="text-xs font-semibold text-slate-700">Description</Label>
                        <Textarea
                          id="desc"
                          rows={3}
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          placeholder="Detailed schedule, rules, evaluation criteria, and guidelines..."
                          className="bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white text-xs leading-relaxed"
                        />
                      </div>

                      {/* Image / Poster File Upload Input */}
                      <div className="space-y-1.5">
                        <Label htmlFor="eventImageFile" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <Upload className="size-3.5 text-primary" />
                          Event Poster / Cover Image
                        </Label>
                        <Input
                          id="eventImageFile"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setNewImageFile(file)
                              setImagePreview(URL.createObjectURL(file))
                            }
                          }}
                          className="bg-slate-50 border border-slate-300 text-slate-900 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 text-xs cursor-pointer focus:border-primary"
                        />
                        {imagePreview && (
                          <div className="mt-2 relative rounded-xl overflow-hidden aspect-[16/6] border border-slate-200 shadow-sm">
                            <img
                              src={imagePreview}
                              alt="Selected Event Cover"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmittingEvent}
                        className="w-full h-11 font-semibold rounded-xl mt-3 shadow-md gap-2 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                      >
                        {isSubmittingEvent ? (
                          <>
                            <RefreshCw className="size-4 animate-spin" />
                            Publishing to MySQL...
                          </>
                        ) : (
                          'Publish Event to Database'
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Close Event & Issue Certificates Modal */}
                <Dialog open={isCloseModalOpen} onOpenChange={setIsCloseModalOpen}>
                  <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 text-slate-900 rounded-3xl p-6 shadow-2xl">
                    <DialogHeader className="space-y-1.5 pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="size-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                          <Award className="size-5" />
                        </div>
                        <div>
                          <DialogTitle className="text-xl font-bold text-slate-900">
                            Close Event & Issue Certificates
                          </DialogTitle>
                          <p className="text-xs text-slate-500">
                            {closingEvent?.title}
                          </p>
                        </div>
                      </div>
                    </DialogHeader>

                    {isLoadingCloseRoster ? (
                      <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="size-6 animate-spin text-amber-500" />
                        <p className="text-xs font-medium">Fetching verified attendees from roster...</p>
                      </div>
                    ) : (
                      <form onSubmit={handleConfirmCloseEvent} className="space-y-5 pt-3">
                        {closeSuccessMessage && (
                          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                            <span>{closeSuccessMessage}</span>
                          </div>
                        )}

                        {/* Verified Attendees Summary Box */}
                        {(() => {
                          const verifiedList = closeRoster.filter((r) => r.attendance_verified)
                          return (
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-700">Verified Attendees Eligible for Certificates</span>
                                <Badge className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs">
                                  {verifiedList.length} Checked In
                                </Badge>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                {verifiedList.length > 0
                                  ? 'All verified attendees will automatically receive an official Certificate of Participation. Select podium winners below for special Achievement Certificates.'
                                  : '⚠️ No attendees have verified check-in attendance yet for this event. Attendees must be scanned at the venue via the QR Scanner tab before certificates can be generated.'}
                              </p>
                            </div>
                          )
                        })()}

                        {/* Podium Selection Dropdowns */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                            Select Podium Award Winners (Optional)
                          </h4>

                          {/* 1st Place */}
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                              <span>🥇 1st Place Winner</span>
                            </Label>
                            <select
                              value={firstPlaceTicket}
                              onChange={(e) => setFirstPlaceTicket(e.target.value)}
                              className="w-full h-10 px-3 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
                            >
                              <option value="" className="bg-white text-slate-500">-- None (Participation Only) --</option>
                              {closeRoster
                                .filter((r) => r.attendance_verified)
                                .map((att) => (
                                  <option key={att.ticket_id} value={att.ticket_id} className="bg-white text-slate-900">
                                    {att.student_name} ({att.rollNumber || att.ticket_id})
                                  </option>
                                ))}
                            </select>
                          </div>

                          {/* 2nd Place */}
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                              <span>🥈 2nd Place Winner</span>
                            </Label>
                            <select
                              value={secondPlaceTicket}
                              onChange={(e) => setSecondPlaceTicket(e.target.value)}
                              className="w-full h-10 px-3 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-500 cursor-pointer"
                            >
                              <option value="" className="bg-white text-slate-500">-- None (Participation Only) --</option>
                              {closeRoster
                                .filter((r) => r.attendance_verified && r.ticket_id !== firstPlaceTicket)
                                .map((att) => (
                                  <option key={att.ticket_id} value={att.ticket_id} className="bg-white text-slate-900">
                                    {att.student_name} ({att.rollNumber || att.ticket_id})
                                  </option>
                                ))}
                            </select>
                          </div>

                          {/* 3rd Place */}
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                              <span>🥉 3rd Place Winner</span>
                            </Label>
                            <select
                              value={thirdPlaceTicket}
                              onChange={(e) => setThirdPlaceTicket(e.target.value)}
                              className="w-full h-10 px-3 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-600 cursor-pointer"
                            >
                              <option value="" className="bg-white text-slate-500">-- None (Participation Only) --</option>
                              {closeRoster
                                .filter(
                                  (r) =>
                                    r.attendance_verified &&
                                    r.ticket_id !== firstPlaceTicket &&
                                    r.ticket_id !== secondPlaceTicket,
                                )
                                .map((att) => (
                                  <option key={att.ticket_id} value={att.ticket_id} className="bg-white text-slate-900">
                                    {att.student_name} ({att.rollNumber || att.ticket_id})
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button
                            type="submit"
                            disabled={isSubmittingClose}
                            className="w-full h-11 font-semibold rounded-xl shadow-md gap-2 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white cursor-pointer"
                          >
                            {isSubmittingClose ? (
                              <>
                                <RefreshCw className="size-4 animate-spin" />
                                Closing Event & Generating Certificates...
                              </>
                            ) : (
                              <>
                                <Award className="size-4" />
                                Issue Dynamic Certificates & Complete Event
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md shadow-xs">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Live Events (MySQL)</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{eventsList.length}</h3>
                </div>
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                  <Calendar className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md shadow-xs">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Registrations</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalRegistrations}</h3>
                </div>
                <div className="size-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shadow-xs">
                  <Users className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md shadow-xs">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Attendance Verified</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{checkedInCount}</h3>
                </div>
                <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md shadow-xs">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Revenue Collected</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Rs. {totalRevenue.toLocaleString()}</h3>
                </div>
                <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-xs">
                  <DollarSign className="size-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cleaned Dashboard Tabs: ONLY Event Directory, QR Scanner, Participant Roster */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
            <TabsList className="grid grid-cols-3 rounded-2xl bg-white/30 p-1.5 border border-white/60 shadow-xs backdrop-blur-md">
              <TabsTrigger value="events" className="rounded-xl text-xs font-semibold text-slate-700 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Event Directory ({eventsList.length})
              </TabsTrigger>
              <TabsTrigger value="scanner" className="rounded-xl text-xs font-semibold text-slate-700 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                QR Scanner & Check-in
              </TabsTrigger>
              <TabsTrigger value="roster" className="rounded-xl text-xs font-semibold text-slate-700 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Participant Roster ({rosterData.length})
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: LIVE EVENT DIRECTORY & MANAGEMENT */}
            <TabsContent value="events" className="space-y-4">
              {isLoadingEvents ? (
                <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
                  <RefreshCw className="size-4 animate-spin text-primary" />
                  Loading live events from MySQL database...
                </div>
              ) : eventsList.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white/80 text-slate-600 shadow-sm">
                  No events found in the database. Click "Create New Event" above to publish one.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {eventsList.map((event) => {
                    const eventRegs = rosterData.filter((r) => r.event_id === event.id)
                    const displayImage = event.image_url || event.image || '/events/tech-fest.png'

                    return (
                      <Card key={event.id} className="overflow-hidden rounded-2xl border border-white/60 bg-white/70 hover:shadow-md transition-all backdrop-blur-md shadow-xs">
                        {/* Event Card Image */}
                        <div className="relative aspect-[16/7.5] overflow-hidden bg-muted">
                          <img
                            src={displayImage}
                            alt={event.title}
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = '/events/tech-fest.png'
                            }}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                            {event.status === 'completed' && (
                              <Badge className="text-[10px] bg-emerald-600/90 text-white font-semibold backdrop-blur shadow-xs">
                                Completed
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-[10px] bg-white/80 backdrop-blur font-semibold text-slate-800 border-white/60 shadow-xs">
                              {event.category}
                            </Badge>
                          </div>
                          <div className="absolute bottom-2.5 left-2.5">
                            <Badge className="text-[10px] bg-black/60 backdrop-blur text-white font-medium">
                              {event.date}
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="p-5 pb-2 flex flex-row items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base font-bold leading-tight truncate text-slate-900" title={event.title}>
                              {event.title}
                            </CardTitle>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{event.tagline || event.department}</p>
                          </div>
                          {/* Trash can delete button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEvent(event.id, event.title)}
                            className="text-destructive hover:bg-destructive/10 shrink-0 size-8 rounded-lg"
                            title="Delete Event"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </CardHeader>

                        <CardContent className="p-5 pt-0 space-y-3 text-xs text-slate-500">
                          <div className="flex justify-between border-t border-slate-100/70 pt-2 font-medium text-slate-600">
                            <span>Registrations: <strong className="text-slate-900">{eventRegs.length} / {event.capacity}</strong></span>
                            <span>Fee: <strong className="text-slate-900">{formatFee(event.fee)}</strong></span>
                          </div>
                          <div className="flex flex-col gap-2 pt-1">
                            {/* Close Event & Issue Certificates Button */}
                            {event.status === 'completed' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenCloseModal(event)}
                                className="w-full text-xs font-semibold gap-1.5 border-emerald-500/40 text-emerald-700 bg-white/50 hover:bg-emerald-500/10 shadow-xs"
                              >
                                <Award className="size-3.5 text-emerald-600" />
                                <span>Event Closed · Re-issue / View Awards</span>
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleOpenCloseModal(event)}
                                className="w-full text-xs font-semibold gap-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-xs"
                              >
                                <Award className="size-3.5" />
                                <span>Close Event & Issue Certificates</span>
                              </Button>
                            )}

                            {/* Live event page link */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs font-semibold gap-1.5 border-white/60 bg-white/70 backdrop-blur-md text-slate-700 hover:bg-white/90 hover:text-slate-900 shadow-xs"
                              render={<Link to={`/events/${event.id}`} />}
                            >
                              <span>View Live Event Page</span>
                              <ArrowRight className="size-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* TAB 2: QR SCANNER & AUTO-ATTENDANCE CHECK-IN */}
            <TabsContent value="scanner" className="space-y-4">
              <Card className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-md max-w-xl mx-auto shadow-sm">
                <CardHeader className="text-center pb-2">
                  <div className="size-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-2 shadow-xs">
                    <QrCode className="size-7" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">QR Scanner & Check-in</CardTitle>
                  <p className="text-xs text-slate-500">
                    Auto-attendance recognition active. Type, paste, or scan the participant's{' '}
                    <span className="font-mono text-primary font-semibold">Ticket ID</span> (e.g.{' '}
                    <span className="underline cursor-pointer" onClick={() => handleScanInputChange('SIT-4308AD')}>
                      SIT-4308AD
                    </span>
                    ) to verify entry.
                  </p>
                  <div className="pt-2 flex justify-center">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-[11px] font-semibold gap-1.5 shadow-xs">
                      <Zap className="size-3 text-emerald-600 animate-pulse" />
                      Auto-Scanner Ready (Organizer RBAC Token Protected)
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-2 space-y-4">
                  {/* Scanner Input Form */}
                  <form onSubmit={handleManualScanSubmit} className="flex gap-2">
                    <Input
                      value={scanCode}
                      onChange={(e) => handleScanInputChange(e.target.value)}
                      placeholder="Scan QR or Enter Ticket ID (e.g. SIT-4308AD)"
                      className="font-mono uppercase text-sm h-11 bg-white/70 backdrop-blur-md border border-white/60 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/50 shadow-none"
                      required
                      autoFocus
                    />
                    <Button
                      type="submit"
                      disabled={isVerifying}
                      className="h-11 px-6 font-semibold rounded-xl shrink-0 gap-2 shadow-xs"
                    >
                      {isVerifying ? (
                        <>
                          <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-4" />
                          Mark Attendance
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Interactive Quick Scan Simulator for Live Tickets */}
                  {pendingTickets.length > 0 && (
                    <div className="rounded-xl bg-white/60 backdrop-blur-sm p-3.5 border border-white/60 text-xs space-y-2">
                      <span className="text-[11px] font-medium text-slate-500 block">
                        Quick-Simulate Barcode / QR Scan with Pending Ticket:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {pendingTickets.map((t) => (
                          <button
                            key={t.ticket_id}
                            type="button"
                            onClick={() => handleScanInputChange(t.ticket_id)}
                            className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/80 border border-white/60 hover:bg-primary/10 hover:border-primary transition-colors text-primary shadow-xs"
                          >
                            ⚡ {t.ticket_id} ({t.student_name.split(' ')[0]})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scan Result Feedback */}
                  {scanResult && (
                    <div
                      className={cn(
                        'p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in zoom-in-95',
                        scanResult.status === 'success' &&
                          'bg-emerald-50/90 border-emerald-300 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200',
                        scanResult.status === 'already' &&
                          'bg-amber-50/90 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200',
                        scanResult.status === 'forbidden' &&
                          'bg-rose-50/90 border-rose-300 text-rose-900 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-200',
                        scanResult.status === 'not-found' &&
                          'bg-rose-50/90 border-rose-300 text-rose-900 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-200',
                      )}
                    >
                      {scanResult.status === 'success' && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="size-4" />
                            ATTENDANCE VERIFIED BY ORGANIZER!
                          </div>
                          <p>
                            Student Name:{' '}
                            <strong>
                              {scanResult.registration.student_name || scanResult.registration.name}
                            </strong>
                          </p>
                          <p>
                            Roll Number:{' '}
                            <strong>{scanResult.registration.rollNumber || 'N/A'}</strong>
                          </p>
                          <p>
                            Ticket ID:{' '}
                            <span className="font-mono font-bold">
                              {scanResult.registration.ticket_id || scanResult.registration.code}
                            </span>
                          </p>
                          {scanResult.registration.event_title && (
                            <p>
                              Event: <strong>{scanResult.registration.event_title}</strong>
                            </p>
                          )}
                        </div>
                      )}

                      {scanResult.status === 'already' && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-sm text-amber-700 dark:text-amber-400">
                            <AlertTriangle className="size-4" />
                            ALREADY CHECKED IN
                          </div>
                          <p>
                            Attendee:{' '}
                            <strong>
                              {scanResult.registration.student_name || scanResult.registration.name}
                            </strong>{' '}
                            was previously verified.
                          </p>
                        </div>
                      )}

                      {scanResult.status === 'forbidden' && (
                        <div className="flex items-center gap-1.5 font-bold text-sm text-rose-700 dark:text-rose-400">
                          <AlertTriangle className="size-4" />
                          403 Forbidden: Only users with the ORGANIZER role can verify attendance!
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
              <Card className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-md shadow-sm">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 pb-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 size-4 text-slate-400" />
                    <Input
                      value={rosterSearch}
                      onChange={(e) => setRosterSearch(e.target.value)}
                      placeholder="Search student name, roll # or ticket ID..."
                      className="pl-9 h-10 text-xs bg-white/70 backdrop-blur-md border border-white/60 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/50 shadow-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Select
                      items={[
                        { value: 'all', label: 'All Events' },
                        ...eventsList.map((e) => ({ value: e.id, label: e.title })),
                      ]}
                      value={selectedEventIdFilter}
                      onValueChange={(val) => setSelectedEventIdFilter(val || 'all')}
                    >
                      <SelectTrigger className="h-10 text-xs min-w-44 bg-white/70 backdrop-blur-md border border-white/60 text-slate-900 data-placeholder:text-slate-400 focus:border-indigo-500 focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/50 shadow-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-xl">
                        <SelectGroup>
                          <SelectItem value="all" className="text-slate-900 hover:bg-slate-100 focus:bg-indigo-600 focus:text-white cursor-pointer">All Events</SelectItem>
                          {eventsList.map((e) => (
                            <SelectItem key={e.id} value={e.id} className="text-slate-900 hover:bg-slate-100 focus:bg-indigo-600 focus:text-white cursor-pointer">{e.title}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadRoster(selectedEventIdFilter)}
                      className="h-10 text-xs gap-1.5 border-white/60 bg-white/70 backdrop-blur-md text-slate-700 hover:bg-white/90 hover:text-slate-900 shadow-xs"
                    >
                      <RefreshCw className={cn('size-3.5', isLoadingRoster && 'animate-spin')} />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-left text-xs border-t border-slate-200/60">
                    <thead className="bg-white/40 text-slate-600 uppercase text-[10px] font-semibold border-b border-slate-200/60">
                      <tr>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Roll Number</th>
                        <th className="p-3">Ticket ID</th>
                        <th className="p-3">Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRoster.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500 text-xs">
                            {isLoadingRoster ? 'Loading participant roster...' : 'No participant registrations found in MySQL.'}
                          </td>
                        </tr>
                      ) : (
                        filteredRoster.map((r) => {
                          const ticketId = r.ticket_id || r.code
                          return (
                            <tr key={r.id || ticketId} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3">
                                <div className="font-semibold text-slate-900">{r.student_name || r.name}</div>
                                <div className="text-[10px] text-slate-500">{r.email}</div>
                              </td>
                              <td className="p-3 font-mono font-medium text-slate-700">{r.rollNumber || 'N/A'}</td>
                              <td className="p-3 font-mono font-bold text-primary">{ticketId}</td>
                              <td className="p-3">
                                {r.attendance_verified ? (
                                  <Badge className="bg-emerald-100 text-emerald-800 font-semibold gap-1">
                                    <CheckCircle2 className="size-3" />
                                    Checked-In
                                  </Badge>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-300 font-semibold gap-1">
                                      <Clock className="size-3" />
                                      Pending
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => executeVerify(ticketId)}
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
          </Tabs>
        </div>
      </main>

      <SiteFooter />
    </div>
  </AnimatedGradientBg>
)
}
