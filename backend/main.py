import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.database import engine, Base
from backend.routers import events, auth, attendance, organizer
from backend import models

# Automatically create all database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="College Event Manager API",
    version="1.0.0",
    description="Standalone FastAPI backend with MySQL & SQLAlchemy ORM",
)

# Ensure uploads static directory exists
STATIC_UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "uploads")
os.makedirs(STATIC_UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=STATIC_UPLOAD_DIR), name="uploads")

# CORS middleware configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(events.router)
app.include_router(auth.router)
app.include_router(attendance.router)
app.include_router(organizer.router)



@app.get("/")
def read_root():
    return {
        "message": "College Event Manager FastAPI Backend with MySQL & SQLAlchemy",
        "status": "online"
    }
