"""
NEREUS — Agentic Marine Intelligence & Safety Platform
Master FastAPI Backend Application.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

import asyncio
from .database.connection import init_db, SessionLocal
from .database.seeds.demo_data import seed_all_demo_data

from .api.routes import chat, voice, marine, weather, ocean, alerts, navigation, status
from .api.routes import voice_agent, config, coastal
from .services.coastal_updater import start_1min_background_loop

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    print("[NEREUS BACKEND] Initializing tables and PostGIS spatial engine...")
    init_db()
    # Seed realistic Indian coastal data
    db = SessionLocal()
    try:
        seed_all_demo_data(db)
    finally:
        db.close()
    print("[NEREUS BACKEND] Multi-Agent Marine Intelligence Core is ONLINE!")

    # Launch 1-minute continuous coastal telemetry background updater
    updater_task = asyncio.create_task(start_1min_background_loop())
    yield
    updater_task.cancel()
    print("[NEREUS BACKEND] Shutting down...")

app = FastAPI(
    title="NEREUS — Marine Intelligence & Safety AI",
    description="Agentic ocean safety, potential fishing zone discovery, geofencing, and risk analysis for Indian waters.",
    version="2.4.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(chat.router)
app.include_router(voice.router)
app.include_router(marine.router)
app.include_router(weather.router)
app.include_router(ocean.router)
app.include_router(alerts.router)
app.include_router(navigation.router)
app.include_router(status.router)
app.include_router(voice_agent.router)  # Gemini Live AI Voice Agent
app.include_router(config.router)       # API Key & Engine Config
app.include_router(coastal.router)      # 1-Min Coastal Telemetry & Offline Cache

@app.get("/api/info")
def root():
    return {
        "platform": "NEREUS",
        "tagline": "Ask the Ocean. Understand the Ocean. Navigate Safely.",
        "status": "ONLINE",
        "agents": 11,
        "coastal_coverage": "Indian Subcontinent (Bay of Bengal, Arabian Sea, Indian Ocean)",
        "docs": "/docs"
    }

@app.get("/health")
@app.get("/api/health")
def health():
    return {"status": "HEALTHY", "system": "NEREUS_CORE"}

# Mount Compiled Production Frontend (SPA)
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Don't intercept API routes or documentation
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return None
        target_file = os.path.join(frontend_dist, full_path)
        if full_path and os.path.exists(target_file) and os.path.isfile(target_file):
            return FileResponse(target_file)
        index_file = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"platform": "NEREUS", "status": "ONLINE"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

