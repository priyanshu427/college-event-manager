from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import uuid

router = APIRouter(prefix="/api/events", tags=["events"])


class EventItem(BaseModel):
    id: str
    title: str
    tagline: str
    description: str
    category: str
    status: str
    date: str
    startTime: str
    endTime: str
    venue: str
    department: str
    organizer: str
    capacity: int
    fee: int
    teamEvent: bool
    teamSize: Optional[int] = None
    prize: Optional[str] = None
    image: str
    tags: List[str]


class EventCreate(BaseModel):
    title: str
    tagline: str
    description: str
    category: str
    status: str
    date: str
    startTime: str
    endTime: str
    venue: str
    department: str
    organizer: str
    capacity: int
    fee: int
    teamEvent: bool
    teamSize: Optional[int] = None
    prize: Optional[str] = None
    image: str
    tags: List[str]


class EventUpdate(BaseModel):
    title: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    date: Optional[str] = None
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    venue: Optional[str] = None
    department: Optional[str] = None
    organizer: Optional[str] = None
    capacity: Optional[int] = None
    fee: Optional[int] = None
    teamEvent: Optional[bool] = None
    teamSize: Optional[int] = None
    prize: Optional[str] = None
    image: Optional[str] = None
    tags: Optional[List[str]] = None


INITIAL_SEED_EVENTS = [
    {
        "id": "ev-hackathon",
        "title": "CodeStorm 24-Hour Hackathon",
        "tagline": "Build something that matters, overnight.",
        "description": "A flagship 24-hour build sprint where teams ship a working prototype around open problem statements in health, campus life and climate. Mentors from the industry review progress every six hours, and the final demo runs on the main stage.",
        "category": "Technical",
        "status": "upcoming",
        "date": "2026-08-21",
        "startTime": "09:00",
        "endTime": "10:00",
        "venue": "Innovation Block, Lab 4",
        "department": "Computer Science",
        "organizer": "Coding Club",
        "capacity": 240,
        "fee": 150,
        "teamEvent": True,
        "teamSize": 4,
        "prize": "Rs. 60,000 pool",
        "image": "/events/hackathon.png",
        "tags": ["Hackathon", "Team", "Overnight", "Mentors"],
    },
    {
        "id": "ev-cultural",
        "title": "Rhythmix Cultural Night",
        "tagline": "The night the campus dances.",
        "description": "The headline cultural evening of the annual fest with group dance, solo classical, fashion walk and a celebrity closing act. Slot times are allotted automatically based on registration order and category.",
        "category": "Cultural",
        "status": "upcoming",
        "date": "2026-08-29",
        "startTime": "17:30",
        "endTime": "22:00",
        "venue": "Open Air Amphitheatre",
        "department": "Student Affairs",
        "organizer": "Cultural Committee",
        "capacity": 1200,
        "fee": 0,
        "teamEvent": True,
        "teamSize": 8,
        "prize": "Rolling trophy",
        "image": "/events/cultural-night.png",
        "tags": ["Dance", "Music", "Fashion", "Main Stage"],
    },
    {
        "id": "ev-robotics",
        "title": "RoboSprint Line Follower Challenge",
        "tagline": "Fastest bot on the track takes it all.",
        "description": "Bring your own bot and race it through a timed line-following circuit with three difficulty laps. Scrutiny happens at the pit desk, and the leaderboard updates live after every heat.",
        "category": "Technical",
        "status": "live",
        "date": "2026-08-01",
        "startTime": "10:00",
        "endTime": "16:30",
        "venue": "Mechanical Workshop Arena",
        "department": "Mechatronics",
        "organizer": "Robotics Society",
        "capacity": 120,
        "fee": 200,
        "teamEvent": True,
        "teamSize": 3,
        "prize": "Rs. 25,000 pool",
        "image": "/events/robotics.png",
        "tags": ["Robotics", "Arena", "Live Scoring"],
    },
    {
        "id": "ev-workshop",
        "title": "Applied AI Bootcamp",
        "tagline": "From notebook to deployed model in one day.",
        "description": "A hands-on bootcamp covering data prep, fine-tuning and shipping an inference endpoint. Seats are limited because every participant gets a mentor-reviewed project at the end.",
        "category": "Workshop",
        "status": "upcoming",
        "date": "2026-08-14",
        "startTime": "09:30",
        "endTime": "17:00",
        "venue": "Seminar Hall B, Block C",
        "department": "Artificial Intelligence",
        "organizer": "IEEE Student Chapter",
        "capacity": 90,
        "fee": 250,
        "teamEvent": False,
        "prize": "Certified by IEEE SB",
        "image": "/events/ai-workshop.png",
        "tags": ["AI", "Hands-on", "Certificate"],
    },
    {
        "id": "ev-summit",
        "title": "Founders Summit 2026",
        "tagline": "Nine founders. One stage. Zero fluff.",
        "description": "A half-day summit with founder keynotes, a live pitch clinic and an investor AMA. Selected teams get a ten minute slot to pitch to the panel with feedback recorded on the spot.",
        "category": "Seminar",
        "status": "upcoming",
        "date": "2026-09-05",
        "startTime": "10:00",
        "endTime": "15:30",
        "venue": "Central Auditorium",
        "department": "Management Studies",
        "organizer": "E-Cell",
        "capacity": 500,
        "fee": 100,
        "teamEvent": False,
        "prize": "Incubation shortlist",
        "image": "/events/startup-summit.png",
        "tags": ["Startups", "Keynote", "Pitch"],
    },
    {
        "id": "ev-sports",
        "title": "Annual Athletics Meet",
        "tagline": "Track, field and house pride.",
        "description": "Two days of track and field across sprints, relays, long jump and shot put. Heat sheets and bib numbers are issued automatically from the registration list.",
        "category": "Sports",
        "status": "upcoming",
        "date": "2026-09-12",
        "startTime": "07:00",
        "endTime": "18:00",
        "venue": "University Athletics Track",
        "department": "Physical Education",
        "organizer": "Sports Council",
        "capacity": 600,
        "fee": 0,
        "teamEvent": False,
        "prize": "Medals and house points",
        "image": "/events/sports-meet.png",
        "tags": ["Athletics", "Two Days", "Medals"],
    },
    {
        "id": "ev-bands",
        "title": "Battle of the Bands",
        "tagline": "Eight bands, one encore.",
        "description": "Campus bands go head to head across two rounds judged on originality, tightness and crowd response. Sound check slots are auto-assigned an hour before the show.",
        "category": "Cultural",
        "status": "completed",
        "date": "2026-07-18",
        "startTime": "18:00",
        "endTime": "22:30",
        "venue": "Quadrangle Stage",
        "department": "Student Affairs",
        "organizer": "Music Club",
        "capacity": 800,
        "fee": 50,
        "teamEvent": True,
        "teamSize": 6,
        "prize": "Rs. 20,000 and studio time",
        "image": "/events/battle-of-bands.png",
        "tags": ["Live Music", "Bands", "Finals"],
    },
    {
        "id": "ev-techfest",
        "title": "Aurora Tech Fest Expo",
        "tagline": "Fifty stalls of student engineering.",
        "description": "The open expo day of the fest where every department showcases working projects, with a public voting track for the people-choice award. Walk-in check-in is handled at the gate desk.",
        "category": "Fest",
        "status": "completed",
        "date": "2026-07-04",
        "startTime": "09:00",
        "endTime": "19:00",
        "venue": "Main Campus Grounds",
        "department": "All Departments",
        "organizer": "Fest Core Team",
        "capacity": 2000,
        "fee": 0,
        "teamEvent": False,
        "prize": "People-choice trophy",
        "image": "/events/tech-fest.png",
        "tags": ["Expo", "Open Day", "Voting"],
    },
]

# In-memory storage for events
events_db: List[dict] = [dict(e) for e in INITIAL_SEED_EVENTS]


@router.get("", response_model=List[EventItem])
@router.get("/", response_model=List[EventItem])
def get_events():
    return events_db


@router.get("/{event_id}", response_model=EventItem)
def get_event(event_id: str):
    for event in events_db:
        if event["id"] == event_id:
            return event
    raise HTTPException(status_code=404, detail="Event not found")


@router.post("", response_model=EventItem, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=EventItem, status_code=status.HTTP_201_CREATED)
def create_event(event: EventCreate):
    new_id = f"ev-{uuid.uuid4().hex[:7]}"
    new_event = {"id": new_id, **event.model_dump()}
    events_db.insert(0, new_event)
    return new_event


@router.put("/{event_id}", response_model=EventItem)
def update_event(event_id: str, patch: EventUpdate):
    for index, existing_event in enumerate(events_db):
        if existing_event["id"] == event_id:
            update_data = patch.model_dump(exclude_unset=True)
            updated_event = {**existing_event, **update_data}
            events_db[index] = updated_event
            return updated_event
    raise HTTPException(status_code=404, detail="Event not found")


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: str):
    global events_db
    for index, existing_event in enumerate(events_db):
        if existing_event["id"] == event_id:
            events_db.pop(index)
            return None
    raise HTTPException(status_code=404, detail="Event not found")


@router.post("/reset", response_model=List[EventItem])
def reset_events():
    global events_db
    events_db = [dict(e) for e in INITIAL_SEED_EVENTS]
    return events_db
