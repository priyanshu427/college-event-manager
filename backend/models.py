from sqlalchemy import Column, Integer, String, Text, Boolean
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="student", nullable=False)
    rollNumber = Column(String(100), nullable=True)
    department = Column(String(255), nullable=True)


class Event(Base):
    __tablename__ = "events"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    tagline = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)
    status = Column(String(50), default="upcoming", nullable=False)
    date = Column(String(50), nullable=False)
    startTime = Column(String(50), nullable=True)
    endTime = Column(String(50), nullable=True)
    venue = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    organizer = Column(String(255), nullable=True)
    capacity = Column(Integer, default=100)
    fee = Column(Integer, default=0)
    teamEvent = Column(Boolean, default=False)
    teamSize = Column(Integer, nullable=True)
    prize = Column(String(255), nullable=True)
    image = Column(String(500), nullable=True)
    tags = Column(Text, nullable=True)  # Store comma-separated string
    created_by = Column(String(255), nullable=True)
