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

def get_current_user(
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> models.User:
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
    token_role = data.get("role")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        user = db.query(models.User).filter(models.User.email == user_id).first()

    if not user:
        candidate_role = token_role if token_role in ["organizer", "student"] else ("organizer" if "organizer" in user_id.lower() else "student")
        name_candidate = user_id.split("@")[0].replace(".", " ").title() if "@" in user_id else f"User {user_id[-4:]}"
        user = models.User(
            id=user_id,
            name=name_candidate,
            email=user_id if "@" in user_id else f"{user_id}@sit.edu.in",
            password_hash="demo1234",
            role=candidate_role,
            rollNumber=user_id.upper(),
            department="Sunrise Institute of Technology",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif token_role and token_role.lower() != (user.role or "").lower() and token_role.lower() in ["organizer", "student"]:
        user.role = token_role.lower()
        db.commit()
        db.refresh(user)

    return user

def get_current_user_id(
    current_user: models.User = Depends(get_current_user),
) -> str:
    return current_user.id

def require_organizer(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    role = (current_user.role or "").strip().lower()
    if role != "organizer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Organizer role required.",
        )
    return current_user

