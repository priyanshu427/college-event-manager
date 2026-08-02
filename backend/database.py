import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables from backend/.env or root .env
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://college_event_user:temp_pass@localhost:3306/college_events"
)

# Test and create engine with fallback support
try:
    if DATABASE_URL.startswith("sqlite"):
        engine = create_engine(
            DATABASE_URL, connect_args={"check_same_thread": False}
        )
    else:
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=3600,
        )
        # Verify connection test
        with engine.connect() as conn:
            pass
        print(f"[Database] Successfully connected to MySQL database: {DATABASE_URL}")
except Exception as e:
    print(f"[Database] Could not connect to MySQL server ({e}). Falling back to SQLite for seamless operation.")
    DATABASE_URL = "sqlite:///./college_events.db"
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
