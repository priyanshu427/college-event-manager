import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models
from backend.auth_utils import get_current_user

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


@router.get("/events")
def get_organizer_events(db: Session = Depends(get_db)):
    from backend.routers.events import db_event_to_dict
    events = db.query(models.Event).order_by(models.Event.date.asc()).all()
    return [db_event_to_dict(e) for e in events]


class CloseEventRequest(BaseModel):
    first_place_ticket_id: Optional[str] = None
    second_place_ticket_id: Optional[str] = None
    third_place_ticket_id: Optional[str] = None


@router.post("/events/{event_id}/close")
def close_event(
    event_id: str,
    req: CloseEventRequest = CloseEventRequest(),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Closes a campus event and dynamically generates certificates for all verified attendees.
    Optionally assigns podium placement ranks (1st Place, 2nd Place, 3rd Place) based on ticket IDs.
    """
    # Enforce strict RBAC: ONLY Organizer can close events
    user_role = (current_user.role or "").strip().lower()
    if user_role != "organizer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Only organizers can close events and issue certificates.",
        )

    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id '{event_id}' not found",
        )

    # 1. Update event status to completed
    event.status = "completed"

    # 2. Query all verified registrations for this event
    verified_regs = (
        db.query(models.Registration)
        .filter(
            models.Registration.event_id == event.id,
            models.Registration.attendance_verified == True,
        )
        .all()
    )

    first_t = (req.first_place_ticket_id or "").strip().upper()
    second_t = (req.second_place_ticket_id or "").strip().upper()
    third_t = (req.third_place_ticket_id or "").strip().upper()

    issued_count = 0
    winners_summary = {}

    for reg in verified_regs:
        # Generate unique certificate_id if not already assigned
        if not reg.certificate_id:
            reg.certificate_id = f"CERT-2026-{event.id.upper()}-{uuid.uuid4().hex[:8].upper()}"

        reg_ticket_upper = (reg.ticket_id or "").strip().upper()

        if first_t and reg_ticket_upper == first_t:
            reg.award_rank = "1st Place"
            winners_summary["1st Place"] = reg.ticket_id
        elif second_t and reg_ticket_upper == second_t:
            reg.award_rank = "2nd Place"
            winners_summary["2nd Place"] = reg.ticket_id
        elif third_t and reg_ticket_upper == third_t:
            reg.award_rank = "3rd Place"
            winners_summary["3rd Place"] = reg.ticket_id
        else:
            if not reg.award_rank or reg.award_rank not in ["1st Place", "2nd Place", "3rd Place"]:
                reg.award_rank = "Participation"

        issued_count += 1

    db.commit()
    db.refresh(event)

    return {
        "status": "success",
        "message": f"Event '{event.title}' successfully closed. {issued_count} certificates issued to verified attendees.",
        "event_id": event.id,
        "event_status": event.status,
        "certificates_issued": issued_count,
        "winners": winners_summary,
    }

