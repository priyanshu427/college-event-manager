import hashlib
import uuid
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database import get_db
from backend import models

router = APIRouter(prefix="/api/auth", tags=["auth"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: Optional[str] = "demo1234"
    role: Optional[str] = "student"
    deptCode: Optional[str] = None
    securityKey: Optional[str] = None

class LoginRequest(BaseModel):
    identifier: str
    password: Optional[str] = "demo1234"
    role: Optional[str] = "student"
    deptCode: Optional[str] = None
    securityKey: Optional[str] = None

class AuthResponse(BaseModel):
    status: str
    message: str
    user: Dict[str, Any]

@router.post("/register", response_model=AuthResponse)
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    email_key = req.email.strip().lower()
    if "@" not in email_key:
        email_key = f"{email_key}@sit.edu.in"

    roll_number = req.email.strip().upper()
    
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == email_key).first()
    if existing_user:
        # Return existing user for smooth auth experience
        user_dict = {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email,
            "role": existing_user.role,
            "rollNumber": existing_user.rollNumber or roll_number,
            "department": existing_user.department or "Campus Member",
        }
        return AuthResponse(
            status="success",
            message="User already registered. Logged in successfully!",
            user=user_dict
        )

    pwd_hash = hash_password(req.password or "demo1234")
    user_id = f"usr-{uuid.uuid4().hex[:8]}"

    new_user = models.User(
        id=user_id,
        name=req.name.strip(),
        email=email_key,
        password_hash=pwd_hash,
        role=req.role or "student",
        rollNumber=roll_number,
        department=req.deptCode or "Campus Member",
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    user_dict = {
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
        "role": new_user.role,
        "rollNumber": new_user.rollNumber,
        "department": new_user.department,
    }

    return AuthResponse(
        status="success",
        message="Account created successfully in MySQL!",
        user=user_dict
    )

@router.post("/login", response_model=AuthResponse)
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    identifier = req.identifier.strip().lower()
    if "@" not in identifier:
        identifier = f"{identifier}@sit.edu.in"

    db_user = db.query(models.User).filter(models.User.email == identifier).first()

    if not db_user:
        # Create user record in DB for new logins
        user_id = f"usr-{uuid.uuid4().hex[:8]}"
        pwd_hash = hash_password(req.password or "demo1234")
        name = req.identifier.split("@")[0].replace(".", " ").title() if "@" in req.identifier else "Campus User"
        
        db_user = models.User(
            id=user_id,
            name=name,
            email=identifier,
            password_hash=pwd_hash,
            role=req.role or "student",
            rollNumber=req.identifier.upper(),
            department="Sunrise Institute of Technology",
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    user_dict = {
        "id": db_user.id,
        "name": db_user.name,
        "email": db_user.email,
        "role": db_user.role,
        "rollNumber": db_user.rollNumber or req.identifier.upper(),
        "department": db_user.department or "Sunrise Institute of Technology",
    }

    return AuthResponse(
        status="success",
        message="Logged in successfully via MySQL!",
        user=user_dict
    )
