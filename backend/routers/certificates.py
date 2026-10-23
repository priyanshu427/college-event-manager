from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend import models
from backend.auth_utils import get_current_user

router = APIRouter(prefix="/api/certificates", tags=["certificates"])

@router.get("/me")
def get_my_certificates(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Fetch all issued certificates for the authenticated student.
    Returns registrations where certificate_id is NOT NULL, joined with event details.
    """
    # Fetch all user IDs associated with this user's email or primary ID
    matching_user_ids = [
        u.id for u in db.query(models.User).filter(
            (models.User.id == current_user.id) | (models.User.email == current_user.email)
        ).all()
    ]
    if not matching_user_ids:
        matching_user_ids = [current_user.id]

    results = (
        db.query(models.Registration, models.Event, models.User)
        .join(models.Event, models.Registration.event_id == models.Event.id)
        .join(models.User, models.Registration.user_id == models.User.id)
        .filter(
            models.Registration.user_id.in_(matching_user_ids),
            models.Registration.certificate_id.isnot(None),
        )
        .order_by(models.Registration.id.desc())
        .all()
    )

    certificates = []
    for reg, event, user in results:
        certificates.append({
            "id": reg.id,
            "certificate_id": reg.certificate_id,
            "award_rank": reg.award_rank or "Participation",
            "ticket_id": reg.ticket_id,
            "event_id": event.id,
            "event_title": event.title,
            "event_tagline": event.tagline or "",
            "event_category": event.category,
            "event_date": event.date,
            "event_venue": event.venue or "Campus Auditorium",
            "event_department": event.department or "College Event Cell",
            "event_organizer": event.organizer or "Faculty Coordinator",
            "student_name": user.name or current_user.name,
            "student_email": user.email or current_user.email,
            "student_roll_number": user.rollNumber or current_user.rollNumber or "SIT21CS042",
            "student_department": user.department or current_user.department or "Computer Science",
            "attendance_verified": bool(reg.attendance_verified),
        })

    return certificates


@router.get("/{certificate_id}")
def get_certificate_by_id(certificate_id: str, db: Session = Depends(get_db)):
    """
    Public verification endpoint to verify an authentic certificate by ID.
    """
    result = (
        db.query(models.Registration, models.Event, models.User)
        .join(models.Event, models.Registration.event_id == models.Event.id)
        .join(models.User, models.Registration.user_id == models.User.id)
        .filter(models.Registration.certificate_id == certificate_id.strip())
        .first()
    )

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificate '{certificate_id}' not found or unverified.",
        )

    reg, event, user = result
    return {
        "status": "verified",
        "certificate_id": reg.certificate_id,
        "award_rank": reg.award_rank or "Participation",
        "ticket_id": reg.ticket_id,
        "event_id": event.id,
        "event_title": event.title,
        "event_tagline": event.tagline or "",
        "event_category": event.category,
        "event_date": event.date,
        "event_venue": event.venue or "Campus Auditorium",
        "event_department": event.department or "College Event Cell",
        "event_organizer": event.organizer or "Faculty Coordinator",
        "student_name": user.name,
        "student_roll_number": user.rollNumber or "SIT21CS042",
        "student_department": user.department or "Computer Science",
        "issued_by": "Sunrise Institute of Technology",
    }
