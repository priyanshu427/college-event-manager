import type { EventCategory, EventStatus } from '@/lib/types'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Formats a YYYY-MM-DD string without timezone drift. */
export function formatDate(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  if (!y || !m || !d) return date
  const js = new Date(Date.UTC(y, m - 1, d))
  return `${DAYS[js.getUTCDay()]}, ${d} ${MONTHS[m - 1]} ${y}`
}

export function formatDateShort(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  if (!y || !m || !d) return date
  return `${d} ${MONTHS[m - 1]}`
}

export function dayOfMonth(date: string) {
  return date.split('-')[2] ?? '--'
}

export function monthLabel(date: string) {
  const m = Number(date.split('-')[1])
  return MONTHS[m - 1] ?? ''
}

export function formatTime(time: string) {
  const [hStr, mStr] = time.split(':')
  let h = Number(hStr)
  const suffix = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${mStr} ${suffix}`
}

export function formatDateTime(iso: string) {
  const js = new Date(iso)
  if (Number.isNaN(js.getTime())) return iso
  const day = js.getDate()
  const month = MONTHS[js.getMonth()]
  let h = js.getHours()
  const min = String(js.getMinutes()).padStart(2, '0')
  const suffix = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${day} ${month}, ${h}:${min} ${suffix}`
}

export function formatFee(fee: number) {
  return fee === 0 ? 'Free entry' : `Rs. ${fee.toLocaleString('en-IN')}`
}

export const categoryStyles: Record<EventCategory, string> = {
  Technical: 'bg-chart-1/15 text-chart-1 border-chart-1/25',
  Cultural: 'bg-chart-2/15 text-chart-2 border-chart-2/25',
  Sports: 'bg-chart-4/15 text-chart-4 border-chart-4/25',
  Workshop: 'bg-chart-3/15 text-chart-3 border-chart-3/25',
  Seminar: 'bg-chart-5/15 text-chart-5 border-chart-5/30',
  Fest: 'bg-primary/15 text-primary border-primary/25',
}

export const statusLabels: Record<EventStatus, string> = {
  upcoming: 'Registrations open',
  live: 'Happening now',
  completed: 'Completed',
}

export const EVENT_CATEGORIES: EventCategory[] = [
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Fest',
]
