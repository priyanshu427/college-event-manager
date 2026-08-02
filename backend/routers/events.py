import json
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database import get_db
from backend import models

router = APIRouter(prefix="/api/events", tags=["events"])

class EventItemSchema(BaseModel):
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

    class Config:
        from_attributes = True


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
        "venue": "Main Open Air Theatre",
        "department": "Cultural Committee",
        "organizer": "Rhythmix Club",
        "capacity": 1200,
        "fee": 0,
        "teamEvent": False,
        "teamSize": 1,
        "prize": "Trophies + Certificates",
        "image": "/events/cultural-night.png",
        "tags": ["Dance", "Music", "Fashion", "Celebrity Act"],
    },
    {
        "id": "ev-robotics",
        "title": "RoboSprint Line Follower Challenge",
        "tagline": "Fastest bot on the track takes it all.",
        "description": "Custom autonomous bots compete on an obstacle-laden black line track. Precision tuning, sensor calibration and speed decide who advances through knockout rounds to the finals.",
        "category": "Technical",
        "status": "live",
        "date": "2026-08-01",
        "startTime": "10:00",
        "endTime": "16:30",
        "venue": "Mechanical Workshop Arena",
        "department": "Robotics & Automation",
        "organizer": "RoboCell",
        "capacity": 120,
        "fee": 200,
        "teamEvent": True,
        "teamSize": 3,
        "prize": "Rs. 30,000",
        "image": "/events/robotics.png",
        "tags": ["Robotics", "Hardware", "Live", "Track"],
    },
    {
        "id": "ev-uiux",
        "title": "Pixel Craft UI/UX Designathon",
        "tagline": "Design accessible campus solutions in 4 hours.",
        "description": "A focused sprint to redesign one real-world student portal touchpoint. Participants deliver Figma prototypes evaluated on usability, accessibility contrast and design system consistency.",
        "category": "Workshop",
        "status": "upcoming",
        "date": "2026-08-14",
        "startTime": "11:00",
        "endTime": "15:00",
        "venue": "Design Studio 2",
        "department": "Information Technology",
        "organizer": "Design Guild",
        "capacity": 80,
        "fee": 50,
        "teamEvent": False,
        "teamSize": 1,
        "prize": "Figma Subscriptions + Goodies",
        "image": "/events/designathon.png",
        "tags": ["Figma", "UI/UX", "Sprint", "Solo"],
    },
    {
        "id": "ev-battlebands",
        "title": "Battle of the Bands",
        "tagline": "Eight bands, one encore.",
        "description": "Inter-college band championship featuring rock, metal and fusion genres. Each band gets a 20-minute stage slot evaluated on originality, stage presence and crowd engagement.",
        "category": "Cultural",
        "status": "upcoming",
        "date": "2026-08-18",
        "startTime": "18:00",
        "endTime": "22:30",
        "venue": "Quadrangle Stage",
        "department": "Music Society",
        "organizer": "Octave Club",
        "capacity": 800,
        "fee": 50,
        "teamEvent": True,
        "teamSize": 6,
        "prize": "Rs. 40,000 + Studio Recording Time",
        "image": "/events/battle-of-bands.png",
        "tags": ["Music", "Live Band", "Stage", "Competition"],
    },
    {
        "id": "ev-esports",
        "title": "Valorant Campus Championship",
        "tagline": "5v5 tactical shooter tournament.",
        "description": "LAN tournament played on dedicated tournament servers with live shoutcasting in the auditorium. Double elimination bracket with custom lobby settings.",
        "category": "Gaming",
        "status": "upcoming",
        "date": "2026-08-25",
        "startTime": "13:00",
        "endTime": "20:00",
        "venue": "Seminar Hall A",
        "department": "Esports Alliance",
        "organizer": "GG Campus",
        "capacity": 160,
        "fee": 250,
        "teamEvent": True,
        "teamSize": 5,
        "prize": "Rs. 25,000",
        "image": "/events/esports.png",
        "tags": ["Esports", "Valorant", "LAN", "Shoutcast"],
    },
    {
        "id": "ev-sports",
        "title": "Inter-Department Football Cup",
        "tagline": "Pride, passion and 90 minutes on the turf.",
        "description": "Annual 7-a-side football tournament for department teams. Knockout matches played under floodlights with official FIFA-certified student referees.",
        "category": "Sports",
        "status": "completed",
        "date": "2026-07-20",
        "startTime": "16:00",
        "endTime": "20:00",
        "venue": "Sports Complex Turf",
        "department": "Physical Education",
        "organizer": "Sports Council",
        "capacity": 300,
        "fee": 0,
        "teamEvent": True,
        "teamSize": 10,
        "prize": "Championship Trophy",
        "image": "/events/football-cup.png",
        "tags": ["Football", "Turf", "Knockout", "Sports"],
    },
    {
        "id": "ev-ai-workshop",
        "title": "Generative AI & LLM Deployment Workshop",
        "tagline": "From prompt engineering to production APIs.",
        "description": "Hands-on masterclass building RAG pipelines using LangChain, FastHTML and local LLM backends. Laptop with Python 3.10+ required for hands-on labs.",
        "category": "Workshop",
        "status": "completed",
        "date": "2026-07-25",
        "startTime": "10:00",
        "endTime": "16:00",
        "venue": "Central Computing Center",
        "department": "Computer Science",
        "organizer": "AI Research Group",
        "capacity": 100,
        "fee": 100,
        "teamEvent": False,
        "teamSize": 1,
        "prize": "Certificate of Completion",
        "image": "/events/ai-workshop.png",
        "tags": ["AI", "LLMs", "Python", "Hands-on"],
    },
]

def db_event_to_dict(event: models.Event) -> dict:
    return {
        "id": event.id,
        "title": event.title,
        "tagline": event.tagline or "",
        "description": event.description or "",
        "category": event.category,
        "status": event.status,
        "date": event.date,
        "startTime": event.startTime or "",
        "endTime": event.endTime or "",
        "venue": event.venue or "",
        "department": event.department or "",
        "organizer": event.organizer or "",
        "capacity": event.capacity,
        "fee": event.fee,
        "teamEvent": event.teamEvent,
        "teamSize": event.teamSize,
        "prize": event.prize,
        "image": event.image or "/events/hackathon.png",
        "tags": json.loads(event.tags) if event.tags and event.tags.startswith("[") else (event.tags.split(",") if event.tags else []),
    }


def seed_database_events(db: Session):
    if db.query(models.Event).count() == 0:
        for ev in INITIAL_SEED_EVENTS:
            db_ev = models.Event(
                id=ev["id"],
                title=ev["title"],
                tagline=ev["tagline"],
                description=ev["description"],
                category=ev["category"],
                status=ev["status"],
                date=ev["date"],
                startTime=ev["startTime"],
                endTime=ev["endTime"],
                venue=ev["venue"],
                department=ev["department"],
                organizer=ev["organizer"],
                capacity=ev["capacity"],
                fee=ev["fee"],
                teamEvent=ev["teamEvent"],
                teamSize=ev.get("teamSize"),
                prize=ev.get("prize"),
                image=ev["image"],
                tags=json.dumps(ev["tags"]),
            )
            db.add(db_ev)
        db.commit()


@router.get("", response_model=List[EventItemSchema])
def get_all_events(db: Session = Depends(get_db)):
    seed_database_events(db)
    events = db.query(models.Event).all()
    return [db_event_to_dict(e) for e in events]


@router.get("/{id}", response_model=EventItemSchema)
def get_event(id: str, db: Session = Depends(get_db)):
    seed_database_events(db)
    event = db.query(models.Event).filter(models.Event.id == id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id '{id}' not found",
        )
    return db_event_to_dict(event)


@router.post("", response_model=EventItemSchema, status_code=status.HTTP_201_CREATED)
def create_event(event_in: EventCreate, db: Session = Depends(get_db)):
    new_id = f"ev-{uuid.uuid4().hex[:8]}"
    db_event = models.Event(
        id=new_id,
        title=event_in.title,
        tagline=event_in.tagline,
        description=event_in.description,
        category=event_in.category,
        status=event_in.status,
        date=event_in.date,
        startTime=event_in.startTime,
        endTime=event_in.endTime,
        venue=event_in.venue,
        department=event_in.department,
        organizer=event_in.organizer,
        capacity=event_in.capacity,
        fee=event_in.fee,
        teamEvent=event_in.teamEvent,
        teamSize=event_in.teamSize,
        prize=event_in.prize,
        image=event_in.image,
        tags=json.dumps(event_in.tags),
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event_to_dict(db_event)


@router.put("/{id}", response_model=EventItemSchema)
def update_event(id: str, patch: EventUpdate, db: Session = Depends(get_db)):
    db_event = db.query(models.Event).filter(models.Event.id == id).first()
    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id '{id}' not found",
        )

    update_data = patch.dict(exclude_unset=True)
    for field, val in update_data.items():
        if field == "tags" and val is not None:
            setattr(db_event, field, json.dumps(val))
        else:
            setattr(db_event, field, val)

    db.commit()
    db.refresh(db_event)
    return db_event_to_dict(db_event)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(id: str, db: Session = Depends(get_db)):
    db_event = db.query(models.Event).filter(models.Event.id == id).first()
    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id '{id}' not found",
        )
    db.delete(db_event)
    db.commit()


@router.post("/reset", response_model=List[EventItemSchema])
def reset_events(db: Session = Depends(get_db)):
    db.query(models.Event).delete()
    db.commit()
    seed_database_events(db)
    events = db.query(models.Event).all()
    return [db_event_to_dict(e) for e in events]
