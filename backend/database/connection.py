"""
Database Connection and Session Factory for NEREUS.
Supports PostgreSQL (with PostGIS) and SQLite local fallback with automatic table initialization.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

# Try PostgreSQL env var, otherwise default to local sqlite database
RAW_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nereus.db")
# Fix legacy postgres:// scheme to postgresql:// for SQLAlchemy 2.0 compatibility
if RAW_DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = RAW_DATABASE_URL.replace("postgres://", "postgresql://", 1)
else:
    DATABASE_URL = RAW_DATABASE_URL

connect_args = {}
engine_kwargs = {"echo": False}

if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine_kwargs["connect_args"] = connect_args
else:
    # Cloud PostgreSQL connection resilience (Neon, Supabase, Render PostgreSQL)
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

try:
    engine = create_engine(DATABASE_URL, **engine_kwargs)
    with engine.connect() as conn:
        pass
    print(f"[DB] Connected successfully to: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else 'sqlite'}")
except Exception as e:
    print(f"[DB] Primary database unavailable ({e}). Falling back to SQLite local database.")
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
