"""
Database Connection and Session Factory for NEREUS.
Supports PostgreSQL (with PostGIS) and SQLite local fallback with automatic table initialization.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

# Try PostgreSQL env var, otherwise default to local sqlite database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nereus.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)
    # Test connection
    with engine.connect() as conn:
        pass
except Exception as e:
    print(f"[DB] PostgreSQL unavailable ({e}). Falling back to SQLite local database.")
    DATABASE_URL = "sqlite:///./nereus.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Create all tables in the database."""
    Base.metadata.create_all(bind=engine)
    print(f"[DB] Database initialized successfully: {DATABASE_URL}")

def get_db():
    """FastAPI Dependency for DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
