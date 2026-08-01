'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  currentUser as defaultCurrentUser,
  demoUsers,
  myseedRegistrations,
  seedAnnouncements,
  seedEvents,
  seedRegistrations,
} from '@/lib/seed-data'
import type {
  Announcement,
  CurrentUser,
  EventItem,
  Registration,
  Role,
} from '@/lib/types'

export type NewRegistrationInput = Omit<
  Registration,
  'id' | 'code' | 'registeredAt' | 'checkedIn' | 'checkedInAt'
>

export type CheckInResult =
  | { status: 'success'; registration: Registration; event: EventItem }
  | { status: 'already'; registration: Registration; event: EventItem }
  | { status: 'not-found' }

type StoreValue = {
  role: Role
  setRole: (role: Role) => void
  user: CurrentUser
  setUser: (user: CurrentUser) => void
  loginAsRole: (targetRole: Role, customUser?: Partial<CurrentUser>) => void
  events: EventItem[]
  registrations: Registration[]
  announcements: Announcement[]
  getEvent: (id: string) => EventItem | undefined
  registrationsFor: (eventId: string) => Registration[]
  myRegistrations: Registration[]
  isRegistered: (eventId: string) => boolean
  createEvent: (event: Omit<EventItem, 'id'>) => EventItem
  updateEvent: (id: string, patch: Partial<EventItem>) => void
  deleteEvent: (id: string) => void
  register: (input: NewRegistrationInput) => Registration
  cancelRegistration: (id: string) => void
  checkInByCode: (code: string) => CheckInResult
  setCheckedIn: (id: string, checkedIn: boolean) => void
  togglePaid: (id: string) => void
  addAnnouncement: (
    input: Omit<Announcement, 'id' | 'createdAt' | 'read'>,
  ) => void
  markAllAnnouncementsRead: () => void
  deleteAnnouncement: (id: string) => void
  resetDatabase: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

const STORAGE_KEY_EVENTS = 'sit_campus_pulse_events'
const STORAGE_KEY_REGISTRATIONS = 'sit_campus_pulse_registrations'
const STORAGE_KEY_ANNOUNCEMENTS = 'sit_campus_pulse_announcements'
const STORAGE_KEY_USER = 'sit_campus_pulse_user'
const STORAGE_KEY_ROLE = 'sit_campus_pulse_role'

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function newCode() {
  let out = ''
  for (let i = 0; i < 6; i++) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  }
  return `SIT-${out}`
}

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>('student')
  const [user, setUserState] = useState<CurrentUser>(defaultCurrentUser)
  const [events, setEvents] = useState<EventItem[]>(seedEvents)
  const [registrations, setRegistrations] = useState<Registration[]>(() => [
    ...myseedRegistrations,
    ...seedRegistrations,
  ])
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(seedAnnouncements)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem(STORAGE_KEY_EVENTS)
      if (storedEvents) setEvents(JSON.parse(storedEvents))

      const storedRegs = localStorage.getItem(STORAGE_KEY_REGISTRATIONS)
      if (storedRegs) setRegistrations(JSON.parse(storedRegs))

      const storedAnns = localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS)
      if (storedAnns) setAnnouncements(JSON.parse(storedAnns))

      const storedRole = localStorage.getItem(STORAGE_KEY_ROLE)
      if (storedRole) setRoleState(storedRole as Role)

      const storedUser = localStorage.getItem(STORAGE_KEY_USER)
      if (storedUser) setUserState(JSON.parse(storedUser))
    } catch (e) {
      console.warn('Could not load persistent store from localStorage:', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Persist events
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events))
    } catch (e) {}
  }, [events, isLoaded])

  // Persist registrations
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(registrations))
    } catch (e) {}
  }, [registrations, isLoaded])

  // Persist announcements
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(announcements))
    } catch (e) {}
  }, [announcements, isLoaded])

  // Persist role & user
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, role)
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user))
    } catch (e) {}
  }, [role, user, isLoaded])

  const setUser = useCallback((newUser: CurrentUser) => {
    setUserState(newUser)
  }, [])

  const setRole = useCallback((newRole: Role) => {
    setRoleState(newRole)
    if (demoUsers[newRole]) {
      setUserState(demoUsers[newRole])
    }
  }, [])

  const loginAsRole = useCallback(
    (targetRole: Role, customUser?: Partial<CurrentUser>) => {
      setRoleState(targetRole)
      const baseUser = demoUsers[targetRole] || defaultCurrentUser
      setUserState({
        ...baseUser,
        ...customUser,
        role: targetRole,
      })
    },
    [],
  )

  const resetDatabase = useCallback(() => {
    setEvents(seedEvents)
    setRegistrations([...myseedRegistrations, ...seedRegistrations])
    setAnnouncements(seedAnnouncements)
    setUserState(defaultCurrentUser)
    setRoleState('student')
    try {
      localStorage.removeItem(STORAGE_KEY_EVENTS)
      localStorage.removeItem(STORAGE_KEY_REGISTRATIONS)
      localStorage.removeItem(STORAGE_KEY_ANNOUNCEMENTS)
      localStorage.removeItem(STORAGE_KEY_USER)
      localStorage.removeItem(STORAGE_KEY_ROLE)
    } catch (e) {}
  }, [])


  const getEvent = useCallback(
    (id: string) => events.find((e) => e.id === id),
    [events],
  )

  const registrationsFor = useCallback(
    (eventId: string) => registrations.filter((r) => r.eventId === eventId),
    [registrations],
  )

  const myRegistrations = useMemo(
    () => registrations.filter((r) => r.email === user.email),
    [registrations, user.email],
  )

  const isRegistered = useCallback(
    (eventId: string) =>
      registrations.some(
        (r) => r.eventId === eventId && r.email === user.email,
      ),
    [registrations, user.email],
  )

  const createEvent = useCallback((event: Omit<EventItem, 'id'>) => {
    const created: EventItem = { ...event, id: newId('ev') }
    setEvents((prev) => [created, ...prev])
    return created
  }, [])

  const updateEvent = useCallback((id: string, patch: Partial<EventItem>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }, [])

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setRegistrations((prev) => prev.filter((r) => r.eventId !== id))
  }, [])

  const register = useCallback((input: NewRegistrationInput) => {
    const created: Registration = {
      ...input,
      id: newId('reg'),
      code: newCode(),
      registeredAt: new Date().toISOString(),
      checkedIn: false,
    }
    setRegistrations((prev) => [created, ...prev])
    return created
  }, [])

  const cancelRegistration = useCallback((id: string) => {
    setRegistrations((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const checkInByCode = useCallback(
    (code: string): CheckInResult => {
      const normalized = code.trim().toUpperCase()
      const match = registrations.find(
        (r) => r.code.toUpperCase() === normalized,
      )
      if (!match) return { status: 'not-found' }
      const event = events.find((e) => e.id === match.eventId)
      if (!event) return { status: 'not-found' }
      if (match.checkedIn) return { status: 'already', registration: match, event }
      const checkedInAt = new Date().toISOString()
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === match.id ? { ...r, checkedIn: true, checkedInAt } : r,
        ),
      )
      return {
        status: 'success',
        registration: { ...match, checkedIn: true, checkedInAt },
        event,
      }
    },
    [events, registrations],
  )

  const setCheckedIn = useCallback((id: string, checkedIn: boolean) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              checkedIn,
              checkedInAt: checkedIn ? new Date().toISOString() : undefined,
            }
          : r,
      ),
    )
  }, [])

  const togglePaid = useCallback((id: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, paid: !r.paid } : r)),
    )
  }, [])

  const addAnnouncement = useCallback(
    (input: Omit<Announcement, 'id' | 'createdAt' | 'read'>) => {
      setAnnouncements((prev) => [
        {
          ...input,
          id: newId('ann'),
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ])
    },
    [],
  )

  const markAllAnnouncementsRead = useCallback(() => {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, read: true })))
  }, [])

  const deleteAnnouncement = useCallback((id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const value = useMemo<StoreValue>(
    () => ({
      role,
      setRole,
      user,
      setUser,
      loginAsRole,
      events,
      registrations,
      announcements,
      getEvent,
      registrationsFor,
      myRegistrations,
      isRegistered,
      createEvent,
      updateEvent,
      deleteEvent,
      register,
      cancelRegistration,
      checkInByCode,
      setCheckedIn,
      togglePaid,
      addAnnouncement,
      markAllAnnouncementsRead,
      deleteAnnouncement,
      resetDatabase,
    }),
    [
      role,
      setRole,
      user,
      loginAsRole,
      events,
      registrations,
      announcements,
      getEvent,
      registrationsFor,
      myRegistrations,
      isRegistered,
      createEvent,
      updateEvent,
      deleteEvent,
      register,
      cancelRegistration,
      checkInByCode,
      setCheckedIn,
      togglePaid,
      addAnnouncement,
      markAllAnnouncementsRead,
      deleteAnnouncement,
      resetDatabase,
    ],
  )



  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
