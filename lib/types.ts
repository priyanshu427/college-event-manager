export type EventCategory =
  | 'Technical'
  | 'Cultural'
  | 'Sports'
  | 'Workshop'
  | 'Seminar'
  | 'Fest'

export type EventStatus = 'upcoming' | 'live' | 'completed'

export type EventItem = {
  id: string
  title: string
  tagline: string
  description: string
  category: EventCategory
  status: EventStatus
  date: string // YYYY-MM-DD
  startTime: string
  endTime: string
  venue: string
  department: string
  organizer: string
  capacity: number
  fee: number
  teamEvent: boolean
  teamSize?: number
  prize?: string
  image: string
  tags: string[]
}

export type Registration = {
  id: string
  code: string
  eventId: string
  name: string
  email: string
  phone: string
  college: string
  department: string
  year: string
  rollNumber: string
  teamName?: string
  members?: string
  notes?: string
  registeredAt: string
  checkedIn: boolean
  checkedInAt?: string
  paid: boolean
}

export type Announcement = {
  id: string
  eventId: string | 'all'
  title: string
  message: string
  priority: 'normal' | 'urgent'
  createdAt: string
  read: boolean
}

export type Role = 'student' | 'organizer' | 'admin'

export type CurrentUser = {
  name: string
  email: string
  college: string
  department: string
  year: string
  rollNumber: string
  phone: string
  role?: Role
}

