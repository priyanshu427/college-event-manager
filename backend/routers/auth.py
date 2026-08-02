from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any

router = APIRouter(prefix="/api/auth", tags=["auth"])

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

# In-memory auth user database initialized with defaults
users_db: Dict[str, Dict[str, Any]] = {
    "student@sit.edu.in": {
        "id": "usr-student-01",
        "name": "Aarav Menon",
        "email": "aarav.menon@sit.edu.in",
        "role": "student",
        "rollNumber": "SIT21CS042",
        "department": "Computer Science & Engineering",
        "year": "3rd Year",
    },
    "organizer@sit.edu.in": {
        "id": "usr-org-01",
        "name": "Prof. Meera Sharma",
        "email": "meera.organizer@sit.edu.in",
        "role": "organizer",
        "rollNumber": "ORG-FAC-809",
        "department": "Faculty Advisor, Technical Club",
        "year": "Faculty",
    },
    "admin@sit.edu.in": {
        "id": "usr-admin-01",
        "name": "Dr. Rajesh K. Varma",
        "email": "admin.dean@sit.edu.in",
        "role": "admin",
        "rollNumber": "DEAN-ADMIN-01",
        "department": "Dean of Student Affairs",
        "year": "Administration",
    },
}

@router.post("/register", response_model=AuthResponse)
def register_user(req: RegisterRequest):
    email_key = req.email.strip().lower()
    
    # Format email if only roll number / handle entered
    if "@" not in email_key:
        email_key = f"{email_key}@sit.edu.in"
    
    roll_number = req.email.strip().upper()
    
    new_user = {
        "id": f"usr-{len(users_db) + 1:03d}",
        "name": req.name.strip(),
        "email": email_key,
        "role": req.role or "student",
        "rollNumber": roll_number,
        "department": req.deptCode or "Campus Member",
        "year": "Enrolled",
    }
    
    users_db[email_key] = new_user
    
    return AuthResponse(
        status="success",
        message="Account created successfully!",
        user=new_user
    )

@router.post("/login", response_model=AuthResponse)
def login_user(req: LoginRequest):
    identifier = req.identifier.strip().lower()
    if "@" not in identifier:
        identifier = f"{identifier}@sit.edu.in"
        
    user = users_db.get(identifier)
    
    if not user:
        # Fallback dynamic user for demo flexibility
        user = {
            "id": "usr-custom",
            "name": req.identifier.split("@")[0].replace(".", " ").title() if "@" in req.identifier else "Campus User",
            "email": identifier,
            "role": req.role or "student",
            "rollNumber": req.identifier.upper(),
            "department": "Sunrise Institute of Technology",
            "year": "Active",
        }
        users_db[identifier] = user

    return AuthResponse(
        status="success",
        message="Logged in successfully!",
        user=user
    )
