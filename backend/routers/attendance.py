from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models
from backend.auth_utils import get_current_user

router = APIRouter(prefix="/api/attendance", tags=["attendance"])

class VerifyAttendanceRequest(BaseModel):
    ticket_id: str

@router.post("/verify")
def verify_attendance(
    req: VerifyAttendanceRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Enforce strict RBAC: ONLY Organizer or Admin can verify attendance
    user_role = (current_user.role or "").strip().lower()
    if user_role not in ["organizer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Only organizers or administrators can verify attendance.",
        )
    ticket_code = req.ticket_id.strip()
    if not ticket_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ticket ID is required",
        )

    registration = (
        db.query(models.Registration)
        .filter(models.Registration.ticket_id.ilike(ticket_code))
        .first()
    )

    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket '{ticket_code}' not found in database",
        )

    already_verified = bool(registration.attendance_verified)
    registration.attendance_verified = True
    db.commit()
    db.refresh(registration)

    user = db.query(models.User).filter(models.User.id == registration.user_id).first()
    event = db.query(models.Event).filter(models.Event.id == registration.event_id).first()

    return {
        "status": "success",
        "message": "Attendance verified successfully" if not already_verified else "Attendee already verified previously",
        "already_verified": already_verified,
        "registration": {
            "id": registration.id,
            "ticket_id": registration.ticket_id,
            "code": registration.ticket_id,
            "event_id": registration.event_id,
            "event_title": event.title if event else "Campus Event",
            "user_id": registration.user_id,
            "student_name": user.name if user else "Student Attendee",
            "name": user.name if user else "Student Attendee",
            "rollNumber": user.rollNumber if user else "",
            "attendance_verified": registration.attendance_verified,
        }
    }
