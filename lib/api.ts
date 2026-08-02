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
  event: Omit<EventItem, 'id'>,
): Promise<EventItem> {
  const res = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  })
  if (!res.ok) {
    throw new Error(`Failed to create event: ${res.statusText}`)
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

export async function deleteEventApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    throw new Error(`Failed to delete event ${id}: ${res.statusText}`)
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
}): Promise<{ status: string; message: string; user: any }> {
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
}): Promise<{ status: string; message: string; user: any }> {
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
