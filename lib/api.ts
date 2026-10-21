import type { EventItem } from '@/lib/types'

export const API_BASE_URL = 'http://127.0.0.1:8000/api'

export async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch(`${API_BASE_URL}/events`, {
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.statusText}`)
  }
  return res.json()
}

export async function fetchEventById(id: string): Promise<EventItem> {
  const res = await fetch(`${API_BASE_URL}/events/${id}`, {
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch event ${id}: ${res.statusText}`)
  }
  return res.json()
}

export async function createEventApi(
  event: FormData | Omit<EventItem, 'id'>,
  token?: string,
): Promise<EventItem> {
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let body: any
  if (event instanceof FormData) {
    body = event
  } else {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(event)
  }

  const res = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers,
    body,
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.detail || `Failed to create event: ${res.statusText}`)
  }
  return res.json()
}

export async function updateEventApi(
  id: string,
  patch: Partial<EventItem>,
): Promise<EventItem> {
  const res = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
  if (!res.ok) {
    throw new Error(`Failed to update event ${id}: ${res.statusText}`)
  }
  return res.json()
}

export async function deleteEventApi(id: string, token?: string): Promise<void> {
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'DELETE',
    headers,
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.detail || `Failed to delete event ${id}: ${res.statusText}`)
  }
}

export async function resetEventsApi(): Promise<EventItem[]> {
  const res = await fetch(`${API_BASE_URL}/events/reset`, {
    method: 'POST',
  })
  if (!res.ok) {
    throw new Error(`Failed to reset events: ${res.statusText}`)
  }
  return res.json()
}

export async function registerApi(data: {
  name: string
  email: string
  password?: string
  role?: string
  deptCode?: string
  securityKey?: string
}): Promise<{ status: string; message: string; user: any; token?: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(`Registration failed: ${res.statusText}`)
  }
  return res.json()
}

export async function loginApi(data: {
  identifier: string
  password?: string
  role?: string
  deptCode?: string
  securityKey?: string
}): Promise<{ status: string; message: string; user: any; token?: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(`Login failed: ${res.statusText}`)
  }
  return res.json()
}

export async function registerForEventApi(
  eventId: string,
  token: string,
): Promise<{ status: string; message: string; ticket_id: string; registration: any }> {
  const res = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.detail || `Registration failed: ${res.statusText}`)
  }
  return res.json()
}

export async function verifyAttendanceApi(
  ticketId: string,
  token?: string,
): Promise<{ status: string; message: string; already_verified?: boolean; registration: any }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${API_BASE_URL}/attendance/verify`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ticket_id: ticketId }),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.detail || `Attendance verification failed: ${res.statusText}`)
  }
  return res.json()
}

export async function fetchOrganizerEventsApi(): Promise<EventItem[]> {
  const res = await fetch(`${API_BASE_URL}/organizer/events`, {
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch organizer events: ${res.statusText}`)
  }
  return res.json()
}

export async function fetchEventRosterApi(
  eventId: string = 'all',
): Promise<Array<{
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
}>> {
  const res = await fetch(`${API_BASE_URL}/organizer/events/${eventId}/roster`, {
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch roster: ${res.statusText}`)
  }
  return res.json()
}

