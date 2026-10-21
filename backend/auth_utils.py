import base64
import hashlib
import hmac
import json
import time
from typing import Optional
from fastapi import Header, HTTPException, status, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models

SECRET_KEY = "sit-campus-pulse-jwt-auth-secret-key-2026"

def create_access_token(user_id: str, role: str = "student") -> str:
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": int(time.time()) + 86400 * 30, # 30 days
    }
    payload_json = json.dumps(payload, separators=(',', ':')).encode("utf-8")
    b64_payload = base64.urlsafe_b64encode(payload_json).decode("utf-8").rstrip("=")
    signature = hmac.new(SECRET_KEY.encode("utf-8"), b64_payload.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{b64_payload}.{signature}"

def decode_access_token(token: str) -> dict:
    if not token:
        return {}
    token = token.strip()
    if "." in token:
        parts = token.split(".")
        if len(parts) == 2:
            b64_payload, signature = parts
            expected_sig = hmac.new(SECRET_KEY.encode("utf-8"), b64_payload.encode("utf-8"), hashlib.sha256).hexdigest()
            if hmac.compare_digest(signature, expected_sig):
                try:
                    padded = b64_payload + "=" * (-len(b64_payload) % 4)
                    payload_bytes = base64.urlsafe_b64decode(padded.encode("utf-8"))
                    data = json.loads(payload_bytes.decode("utf-8"))
                    return data
                except Exception:
                    pass
    # Fallback: if token is raw user_id (e.g. usr-xxx or email or demo token)
    return {"user_id": token}

def get_current_user_id(
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None),
) -> str:
    token = None
    if authorization:
        parts = authorization.strip().split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1]
        elif len(parts) == 1:
            token = parts[0]
        else:
            token = authorization.strip()
    elif x_user_id:
        token = x_user_id.strip()

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required. Please log in.",
        )

    data = decode_access_token(token)
    user_id = data.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )
    return user_id

def get_current_user(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
) -> models.User:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        # Check by email if user_id happens to be email
        user = db.query(models.User).filter(models.User.email == user_id).first()

    if not user:
        # Auto-provision user record for seamless foreign key resolution
        name_candidate = user_id.split("@")[0].replace(".", " ").title() if "@" in user_id else f"Student {user_id[-4:]}"
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

    return user
