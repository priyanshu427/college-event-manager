import type {
  Announcement,
  CurrentUser,
  EventItem,
  Registration,
  Role,
} from '@/lib/types'


export const COLLEGE_NAME = 'IMS Engineering College'

export const currentUser: CurrentUser = {
  name: 'Aarav Menon',
  email: 'aarav.menon@sit.edu.in',
  college: COLLEGE_NAME,
  department: 'Computer Science',
  year: '3rd Year',
  rollNumber: 'SIT21CS042',
  phone: '98765 43210',
  role: 'student',
}

export const demoUsers: Record<Role, CurrentUser> = {
  student: {
    name: 'Aarav Menon',
    email: 'aarav.menon@sit.edu.in',
    college: COLLEGE_NAME,
    department: 'Computer Science',
    year: '3rd Year',
    rollNumber: 'SIT21CS042',
    phone: '98765 43210',
    role: 'student',
  },
  organizer: {
    name: 'Prof. Meera Sharma',
    email: 'meera.organizer@sit.edu.in',
    college: COLLEGE_NAME,
    department: 'Computer Science & Innovation Cell',
    year: 'Faculty Lead',
    rollNumber: 'ORG-FAC-809',
    phone: '98765 11223',
    role: 'organizer',
  },
  admin: {
    name: 'Dr. Rajesh Varma',
    email: 'admin.dean@sit.edu.in',
    college: COLLEGE_NAME,
    department: 'Office of Dean Academic Affairs',
    year: 'Administration',
    rollNumber: 'ADM-DEAN-001',
    phone: '98765 99000',
    role: 'admin',
  },
}


export const seedEvents: EventItem[] = [
  {
    id: 'ev-hackathon',
    title: 'CodeStorm 24-Hour Hackathon',
    tagline: 'Build something that matters, overnight.',
    description:
      'A flagship 24-hour build sprint where teams ship a working prototype around open problem statements in health, campus life and climate. Mentors from the industry review progress every six hours, and the final demo runs on the main stage.',
    category: 'Technical',
    status: 'upcoming',
    date: '2026-08-21',
    startTime: '09:00',
    endTime: '10:00',
    venue: 'Innovation Block, Lab 4',
    department: 'Computer Science',
    organizer: 'Coding Club',
    capacity: 240,
    fee: 150,
    teamEvent: true,
    teamSize: 4,
    prize: 'Rs. 60,000 pool',
    image: '/events/hackathon.png',
    tags: ['Hackathon', 'Team', 'Overnight', 'Mentors'],
  },
  {
    id: 'ev-cultural',
    title: 'Rhythmix Cultural Night',
    tagline: 'The night the campus dances.',
    description:
      'The headline cultural evening of the annual fest with group dance, solo classical, fashion walk and a celebrity closing act. Slot times are allotted automatically based on registration order and category.',
    category: 'Cultural',
    status: 'upcoming',
    date: '2026-08-29',
    startTime: '17:30',
    endTime: '22:00',
    venue: 'Open Air Amphitheatre',
    department: 'Student Affairs',
    organizer: 'Cultural Committee',
    capacity: 1200,
    fee: 0,
    teamEvent: true,
    teamSize: 8,
    prize: 'Rolling trophy',
    image: '/events/cultural-night.png',
    tags: ['Dance', 'Music', 'Fashion', 'Main Stage'],
  },
  {
    id: 'ev-robotics',
    title: 'RoboSprint Line Follower Challenge',
    tagline: 'Fastest bot on the track takes it all.',
    description:
      'Bring your own bot and race it through a timed line-following circuit with three difficulty laps. Scrutiny happens at the pit desk, and the leaderboard updates live after every heat.',
    category: 'Technical',
    status: 'live',
    date: '2026-08-01',
    startTime: '10:00',
    endTime: '16:30',
    venue: 'Mechanical Workshop Arena',
    department: 'Mechatronics',
    organizer: 'Robotics Society',
    capacity: 120,
    fee: 200,
    teamEvent: true,
    teamSize: 3,
    prize: 'Rs. 25,000 pool',
    image: '/events/robotics.png',
    tags: ['Robotics', 'Arena', 'Live Scoring'],
  },
  {
    id: 'ev-workshop',
    title: 'Applied AI Bootcamp',
    tagline: 'From notebook to deployed model in one day.',
    description:
      'A hands-on bootcamp covering data prep, fine-tuning and shipping an inference endpoint. Seats are limited because every participant gets a mentor-reviewed project at the end.',
    category: 'Workshop',
    status: 'upcoming',
    date: '2026-08-14',
    startTime: '09:30',
    endTime: '17:00',
    venue: 'Seminar Hall B, Block C',
    department: 'Artificial Intelligence',
    organizer: 'IEEE Student Chapter',
    capacity: 90,
    fee: 250,
    teamEvent: false,
    prize: 'Certified by IEEE SB',
    image: '/events/ai-workshop.png',
    tags: ['AI', 'Hands-on', 'Certificate'],
  },
  {
    id: 'ev-summit',
    title: 'Founders Summit 2026',
    tagline: 'Nine founders. One stage. Zero fluff.',
    description:
      'A half-day summit with founder keynotes, a live pitch clinic and an investor AMA. Selected teams get a ten minute slot to pitch to the panel with feedback recorded on the spot.',
    category: 'Seminar',
    status: 'upcoming',
    date: '2026-09-05',
    startTime: '10:00',
    endTime: '15:30',
    venue: 'Central Auditorium',
    department: 'Management Studies',
    organizer: 'E-Cell',
    capacity: 500,
    fee: 100,
    teamEvent: false,
    prize: 'Incubation shortlist',
    image: '/events/startup-summit.png',
    tags: ['Startups', 'Keynote', 'Pitch'],
  },
  {
    id: 'ev-sports',
    title: 'Annual Athletics Meet',
    tagline: 'Track, field and house pride.',
    description:
      'Two days of track and field across sprints, relays, long jump and shot put. Heat sheets and bib numbers are issued automatically from the registration list.',
    category: 'Sports',
    status: 'upcoming',
    date: '2026-09-12',
    startTime: '07:00',
    endTime: '18:00',
    venue: 'University Athletics Track',
    department: 'Physical Education',
    organizer: 'Sports Council',
    capacity: 600,
    fee: 0,
    teamEvent: false,
    prize: 'Medals and house points',
    image: '/events/sports-meet.png',
    tags: ['Athletics', 'Two Days', 'Medals'],
  },
  {
    id: 'ev-bands',
    title: 'Battle of the Bands',
    tagline: 'Eight bands, one encore.',
    description:
      'Campus bands go head to head across two rounds judged on originality, tightness and crowd response. Sound check slots are auto-assigned an hour before the show.',
    category: 'Cultural',
    status: 'completed',
    date: '2026-07-18',
    startTime: '18:00',
    endTime: '22:30',
    venue: 'Quadrangle Stage',
    department: 'Student Affairs',
    organizer: 'Music Club',
    capacity: 800,
    fee: 50,
    teamEvent: true,
    teamSize: 6,
    prize: 'Rs. 20,000 and studio time',
    image: '/events/battle-of-bands.png',
    tags: ['Live Music', 'Bands', 'Finals'],
  },
  {
    id: 'ev-techfest',
    title: 'Aurora Tech Fest Expo',
    tagline: 'Fifty stalls of student engineering.',
    description:
      'The open expo day of the fest where every department showcases working projects, with a public voting track for the people-choice award. Walk-in check-in is handled at the gate desk.',
    category: 'Fest',
    status: 'completed',
    date: '2026-07-04',
    startTime: '09:00',
    endTime: '19:00',
    venue: 'Main Campus Grounds',
    department: 'All Departments',
    organizer: 'Fest Core Team',
    capacity: 2000,
    fee: 0,
    teamEvent: false,
    prize: 'People-choice trophy',
    image: '/events/tech-fest.png',
    tags: ['Expo', 'Open Day', 'Voting'],
  },
]

const firstNames = [
  'Ishita',
  'Rohan',
  'Meera',
  'Kabir',
  'Ananya',
  'Vikram',
  'Sneha',
  'Arjun',
  'Priya',
  'Dev',
  'Naina',
  'Yash',
  'Tara',
  'Nikhil',
  'Riya',
  'Aditya',
  'Kavya',
  'Manav',
  'Sara',
  'Farhan',
  'Diya',
  'Karthik',
  'Neha',
  'Imran',
]
const lastNames = [
  'Sharma',
  'Iyer',
  'Nair',
  'Verma',
  'Reddy',
  'Bose',
  'Kulkarni',
  'Patel',
  'Rao',
  'Khan',
  'Joshi',
  'Menon',
]
const departments = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Artificial Intelligence',
  'Management Studies',
]
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year']
const teamNames = [
  'Null Pointers',
  'Byte Me',
  'Circuit Breakers',
  'Stack Overflow',
  'Kernel Panic',
  'Team Nova',
  'Hz Collective',
  'The Debuggers',
]

/** Deterministic pseudo-random so server and client render identically. */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export function makeCode(seed: number) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(rand(seed + i * 7.7) * alphabet.length)]
  }
  return `SIT-${out}`
}

const registrationCounts: Record<string, number> = {
  'ev-hackathon': 34,
  'ev-cultural': 52,
  'ev-robotics': 26,
  'ev-workshop': 41,
  'ev-summit': 38,
  'ev-sports': 45,
  'ev-bands': 29,
  'ev-techfest': 61,
}

function buildSeedRegistrations(): Registration[] {
  const out: Registration[] = []
  let n = 0
  for (const event of seedEvents) {
    const total = registrationCounts[event.id] ?? 20
    for (let i = 0; i < total; i++) {
      n += 1
      const r = (offset: number) => rand(n * 3.31 + offset)
      const first = firstNames[Math.floor(r(1) * firstNames.length)]
      const last = lastNames[Math.floor(r(2) * lastNames.length)]
      const dept = departments[Math.floor(r(3) * departments.length)]
      const year = years[Math.floor(r(4) * years.length)]
      const checkedIn =
        event.status === 'completed'
          ? r(5) > 0.18
          : event.status === 'live'
            ? r(5) > 0.45
            : false
      out.push({
        id: `reg-${n}`,
        code: makeCode(n * 5 + 11),
        eventId: event.id,
        name: `${first} ${last}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}@sit.edu.in`,
        phone: `9${Math.floor(r(6) * 900000000 + 100000000)}`,
        college: COLLEGE_NAME,
        department: dept,
        year,
        rollNumber: `SIT2${Math.floor(r(7) * 4)}${dept.slice(0, 2).toUpperCase()}${String(
          Math.floor(r(8) * 900 + 100),
        )}`,
        teamName: event.teamEvent
          ? teamNames[Math.floor(r(9) * teamNames.length)]
          : undefined,
        registeredAt: `2026-0${event.status === 'completed' ? 6 : 7}-${String(
          Math.floor(r(10) * 27 + 1),
        ).padStart(2, '0')}T10:${String(Math.floor(r(11) * 59)).padStart(2, '0')}:00`,
        checkedIn,
        checkedInAt: checkedIn ? `${event.date}T09:45:00` : undefined,
        paid: event.fee === 0 ? true : r(12) > 0.12,
      })
    }
  }
  return out
}

export const seedRegistrations: Registration[] = buildSeedRegistrations()

/** Registrations that belong to the signed-in demo student. */
export const myseedRegistrations: Registration[] = [
  {
    id: 'reg-me-1',
    code: 'SIT-7KQ4MZ',
    eventId: 'ev-hackathon',
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    college: currentUser.college,
    department: currentUser.department,
    year: currentUser.year,
    rollNumber: currentUser.rollNumber,
    teamName: 'Null Pointers',
    members: 'Aarav Menon, Ishita Sharma, Dev Patel, Riya Nair',
    registeredAt: '2026-07-22T18:24:00',
    checkedIn: false,
    paid: true,
  },
  {
    id: 'reg-me-2',
    code: 'SIT-P3XB9T',
    eventId: 'ev-bands',
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    college: currentUser.college,
    department: currentUser.department,
    year: currentUser.year,
    rollNumber: currentUser.rollNumber,
    teamName: 'Hz Collective',
    registeredAt: '2026-06-30T12:05:00',
    checkedIn: true,
    checkedInAt: '2026-07-18T17:52:00',
    paid: true,
  },
  {
    id: 'reg-me-3',
    code: 'SIT-J8VN5C',
    eventId: 'ev-techfest',
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    college: currentUser.college,
    department: currentUser.department,
    year: currentUser.year,
    rollNumber: currentUser.rollNumber,
    registeredAt: '2026-06-18T09:41:00',
    checkedIn: true,
    checkedInAt: '2026-07-04T09:18:00',
    paid: true,
  },
]

export const seedAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    eventId: 'ev-hackathon',
    title: 'Problem statements are live',
    message:
      'All eight problem statements for CodeStorm are now published. Pick your track before the 19th so we can assign mentors.',
    priority: 'normal',
    createdAt: '2026-07-30T11:00:00',
    read: false,
  },
  {
    id: 'ann-2',
    eventId: 'ev-robotics',
    title: 'Pit scrutiny starts at 9:30 AM',
    message:
      'Bring your bot to the pit desk 30 minutes before your heat. Battery limits will be enforced strictly this year.',
    priority: 'urgent',
    createdAt: '2026-08-01T07:15:00',
    read: false,
  },
  {
    id: 'ann-3',
    eventId: 'all',
    title: 'Digital passes replace paper slips',
    message:
      'Every registration now issues a QR pass. Volunteers will scan it at the gate, so no printed forms are needed.',
    priority: 'normal',
    createdAt: '2026-07-26T16:40:00',
    read: true,
  },
]
