export type EventCategory =
  | 'Technical'
  | 'Cultural'
  | 'Sports'
  | 'Workshop'
  | 'Seminar'
  | 'Fest'
  | 'Gaming'

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
  image_url?: string
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

export type Role = 'student' | 'organizer'

export type CurrentUser = {
  id?: string
  token?: string
  name: string
  email: string
  college: string
  department: string
  year: string
  rollNumber: string
  phone: string
  role?: Role
}

export interface CertificateItem {
  id: number | string
  certificate_id: string
  award_rank: string // "Participation" | "1st Place" | "2nd Place" | "3rd Place"
  ticket_id: string
  event_id: string
  event_title: string
  event_tagline: string
  event_category: string
  event_date: string
  event_venue: string
  event_department: string
  event_organizer: string
  student_name: string
  student_email: string
  student_roll_number: string
  student_department: string
  attendance_verified: boolean
}


