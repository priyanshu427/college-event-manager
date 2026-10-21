import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models

router = APIRouter(prefix="/api/organizer", tags=["organizer"])

SEED_ROSTER_DATA = [
    {
        "user_id": "usr-student-aarav",
        "name": "Aarav Sharma",
        "email": "aarav.sharma@sit.edu.in",
        "rollNumber": "22CS042",
        "department": "Computer Science",
        "event_id": "ev-hackathon",
        "ticket_id": "SIT-A89F2K",
        "attendance_verified": True,
    },
    {
        "user_id": "usr-student-diya",
        "name": "Diya Patel",
        "email": "diya.patel@sit.edu.in",
        "rollNumber": "22EC018",
        "department": "Electronics",
        "event_id": "ev-hackathon",
        "ticket_id": "SIT-B42C9L",
        "attendance_verified": False,
    },
    {
        "user_id": "usr-student-rohan",
        "name": "Rohan Verma",
        "email": "rohan.v@sit.edu.in",
        "rollNumber": "23IT009",
        "department": "Information Tech",
        "event_id": "ev-robotics",
        "ticket_id": "SIT-C71E5N",
        "attendance_verified": False,
    },
    {
        "user_id": "usr-student-ananya",
        "name": "Ananya Iyer",
        "email": "ananya.iyer@sit.edu.in",
        "rollNumber": "22ME031",
        "department": "Mechanical",
        "event_id": "ev-cultural",
        "ticket_id": "SIT-D19M3P",
        "attendance_verified": True,
    },
    {
        "user_id": "usr-student-priya",
        "name": "Priya Nair",
        "email": "priya.nair@sit.edu.in",
        "rollNumber": "23CS088",
        "department": "Computer Science",
        "event_id": "ev-esports",
        "ticket_id": "SIT-E55K7R",
        "attendance_verified": False,
    },
]

def seed_database_registrations(db: Session):
    if db.query(models.Registration).count() == 0:
        for item in SEED_ROSTER_DATA:
            # Check or create user
            user = db.query(models.User).filter(models.User.id == item["user_id"]).first()
            if not user:
                user = models.User(
                    id=item["user_id"],
                    name=item["name"],
                    email=item["email"],
                    password_hash="demo1234",
                    role="student",
                    rollNumber=item["rollNumber"],
                    department=item["department"],
                )
                db.add(user)
                db.commit()
                db.refresh(user)

            # Check if event exists
            event = db.query(models.Event).filter(models.Event.id == item["event_id"]).first()
            if not event:
                continue

            # Create registration
            reg = models.Registration(
                user_id=user.id,
                event_id=event.id,
                ticket_id=item["ticket_id"],
                attendance_verified=item["attendance_verified"],
            )
            db.add(reg)
        db.commit()

@router.get("/events/{event_id}/roster")
def get_event_roster(event_id: str, db: Session = Depends(get_db)):
    seed_database_registrations(db)

    query = (
        db.query(models.Registration, models.User, models.Event)
        .join(models.User, models.Registration.user_id == models.User.id)
        .outerjoin(models.Event, models.Registration.event_id == models.Event.id)
    )

    if event_id != "all":
        query = query.filter(models.Registration.event_id == event_id)

    results = query.order_by(models.Registration.id.desc()).all()

    roster = []
    for reg, user, event in results:
        roster.append({
            "id": reg.id,
            "ticket_id": reg.ticket_id,
            "code": reg.ticket_id,
            "event_id": reg.event_id,
            "event_title": event.title if event else "Campus Event",
            "user_id": reg.user_id,
            "student_name": user.name,
            "name": user.name,
            "rollNumber": user.rollNumber or "N/A",
            "email": user.email,
            "department": user.department or "Campus Member",
            "attendance_verified": bool(reg.attendance_verified),
        })

    return roster
