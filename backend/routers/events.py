import json
import os
import shutil
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Header, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database import get_db
from backend import models
from backend.auth_utils import get_current_user, get_current_user_id

router = APIRouter(prefix="/api/events", tags=["events"])

STATIC_UPLOAD_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "public",
    "uploads",
)
os.makedirs(STATIC_UPLOAD_DIR, exist_ok=True)

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
    image_url: Optional[str] = None
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
    img = event.image_url or event.image or "/events/tech-fest.png"
    return {
        "id": event.id,
        "title": event.title,
        "tagline": event.tagline or "",
        "description": event.description or "",
        "category": event.category,
        "status": event.status or "upcoming",
        "date": event.date,
        "startTime": event.startTime or "",
        "endTime": event.endTime or "",
        "venue": event.venue or "",
        "department": event.department or "",
        "organizer": event.organizer or "Campus Organizer",
        "capacity": event.capacity or 100,
        "fee": event.fee or 0,
        "teamEvent": bool(event.teamEvent),
        "teamSize": event.teamSize,
        "prize": event.prize,
        "image": img,
        "image_url": img,
        "tags": json.loads(event.tags) if event.tags and event.tags.startswith("[") else (event.tags.split(",") if event.tags else ["Campus", event.category]),
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
                image_url=ev["image"],
                tags=json.dumps(ev["tags"]),
            )
            db.add(db_ev)
        db.commit()


@router.get("", response_model=List[EventItemSchema])
def get_all_events(db: Session = Depends(get_db)):
    events = db.query(models.Event).order_by(models.Event.date.asc()).all()
    return [db_event_to_dict(e) for e in events]


@router.get("/{id}", response_model=EventItemSchema)
def get_event(id: str, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id '{id}' not found",
        )
    return db_event_to_dict(event)


@router.post("", response_model=EventItemSchema, status_code=status.HTTP_201_CREATED)
async def create_event(
    request: Request,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_role = (current_user.role or "").strip().lower()
    if user_role not in ["organizer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Only organizers or administrators can create events.",
        )

    content_type = request.headers.get("content-type", "")
    data = {}
    image_file = None
    if "application/json" in content_type:
        try:
            data = await request.json()
        except Exception:
            data = {}
    else:
        form = await request.form()
        data = dict(form)
        image_obj = form.get("image")
        if isinstance(image_obj, UploadFile):
            image_file = image_obj

    title = data.get("title")
    if not title:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title is required",
        )

    capacity_val = data.get("capacity") if data.get("capacity") is not None else data.get("max_capacity")
    if capacity_val is None:
        capacity_val = 100
    try:
        capacity_int = int(capacity_val)
    except (ValueError, TypeError):
        capacity_int = 100

    fee_val = data.get("fee") or 0
    try:
        fee_int = int(fee_val)
    except (ValueError, TypeError):
        fee_int = 0

    upload_dir = STATIC_UPLOAD_DIR
    os.makedirs(upload_dir, exist_ok=True)
    
    image_url = data.get("image_url") or data.get("image") or "/events/tech-fest.png"
    if image_file and image_file.filename:
        ext = os.path.splitext(image_file.filename)[1] or ".png"
        clean_filename = f"event_{uuid.uuid4().hex[:12]}{ext}"
        target_path = os.path.join(upload_dir, clean_filename)
        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(image_file.file, buffer)
        image_url = f"/uploads/{clean_filename}"

    new_id = f"ev-{uuid.uuid4().hex[:8]}"

    category = str(data.get("category", "Technical"))
    tags_val = data.get("tags")
    parsed_tags = ["Campus", category]
    if tags_val:
        if isinstance(tags_val, list):
            parsed_tags = tags_val
        elif isinstance(tags_val, str):
            try:
                parsed_tags = json.loads(tags_val) if tags_val.startswith("[") else [t.strip() for t in tags_val.split(",") if t.strip()]
            except Exception:
                parsed_tags = [tags_val]

    team_size_val = data.get("teamSize")
    try:
        parsed_team_size = int(team_size_val) if team_size_val is not None else None
    except (ValueError, TypeError):
        parsed_team_size = None

    team_event_val = data.get("teamEvent")
    parsed_team_event = str(team_event_val).lower() in ["true", "1", "yes"] if team_event_val is not None else False

    db_event = models.Event(
        id=new_id,
        title=str(title).strip(),
        tagline=str(data.get("tagline", "")).strip(),
        description=str(data.get("description", "")).strip(),
        category=category.strip(),
        status=str(data.get("status", "upcoming")).strip(),
        date=str(data.get("date", "2026-11-15")).strip(),
        startTime=str(data.get("startTime", "10:00")).strip(),
        endTime=str(data.get("endTime", "17:00")).strip(),
        venue=str(data.get("venue", "Campus Main Auditorium")).strip(),
        department=str(data.get("department", "Computer Science")).strip(),
        organizer=str(data.get("organizer", current_user.name or "Campus Organizer")).strip(),
        capacity=capacity_int,
        fee=fee_int,
        teamEvent=parsed_team_event,
        teamSize=parsed_team_size,
        prize=str(data.get("prize")) if data.get("prize") else None,
        image=image_url,
        image_url=image_url,
        tags=json.dumps(parsed_tags),
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
def delete_event(
    id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_role = (current_user.role or "").strip().lower()
    if user_role not in ["organizer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Only organizers or administrators can delete events.",
        )

    db_event = db.query(models.Event).filter(models.Event.id == id).first()
    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id '{id}' not found",
        )

    # Cascade delete registrations
    db.query(models.Registration).filter(models.Registration.event_id == id).delete()

    db.delete(db_event)
    db.commit()
    return None


@router.post("/reset", response_model=List[EventItemSchema])
def reset_events(db: Session = Depends(get_db)):
    db.query(models.Event).delete()
    db.commit()
    seed_database_events(db)
    events = db.query(models.Event).all()
    return [db_event_to_dict(e) for e in events]


@router.post("/{event_id}/register")
def register_for_event(
    event_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    seed_database_events(db)

    # 1. Find event
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id '{event_id}' not found",
        )

    # 2. Ensure user exists in database to satisfy foreign key constraint
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        user = db.query(models.User).filter(models.User.email == user_id).first()
    if not user:
        name_candidate = (
            user_id.split("@")[0].replace(".", " ").title()
            if "@" in user_id
            else f"Student {user_id[-4:]}"
        )
        user = models.User(
            id=user_id,
            name=name_candidate,
            email=user_id if "@" in user_id else f"{user_id}@sit.edu.in",
            password_hash="demo1234",
            role="student",
            rollNumber=user_id.upper(),
            department="Sunrise Institute of Technology",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 3. Check for existing registration
    existing_reg = (
        db.query(models.Registration)
        .filter(
            models.Registration.event_id == event_id,
            models.Registration.user_id == user.id,
        )
        .first()
    )
    if existing_reg:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student is already registered for this event.",
        )

    # 4. Check capacity limit
    current_count = (
        db.query(models.Registration)
        .filter(models.Registration.event_id == event_id)
        .count()
    )
    if event.capacity is not None and event.capacity > 0 and current_count >= event.capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Event is at full capacity ({event.capacity}/{event.capacity}). No more registrations allowed.",
        )

    # 4. Generate unique ticket_id and insert new Registration
    ticket_id = f"SIT-{uuid.uuid4().hex[:6].upper()}"

    new_reg = models.Registration(
        user_id=user.id,
        event_id=event.id,
        ticket_id=ticket_id,
        attendance_verified=False,
    )
    db.add(new_reg)
    db.commit()
    db.refresh(new_reg)

    return {
        "status": "success",
        "message": "1-Click Registration successful!",
        "ticket_id": new_reg.ticket_id,
        "registration": {
            "id": str(new_reg.id),
            "ticket_id": new_reg.ticket_id,
            "code": new_reg.ticket_id,
            "event_id": new_reg.event_id,
            "eventId": new_reg.event_id,
            "user_id": new_reg.user_id,
            "student_name": user.name,
            "name": user.name,
            "rollNumber": user.rollNumber,
            "email": user.email,
            "attendance_verified": new_reg.attendance_verified,
            "checkedIn": new_reg.attendance_verified,
        },
    }

