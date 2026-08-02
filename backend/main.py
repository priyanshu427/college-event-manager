from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import events

app = FastAPI(
    title="College Event Manager API",
    version="1.0.0",
    description="Standalone FastAPI backend for College Event Manager",
)

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


@app.get("/")
def read_root():
    return {"message": "College Event Manager FastAPI Backend"}
