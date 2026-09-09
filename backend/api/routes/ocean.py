"""
Ocean and Tide API Routes for NEREUS.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...database.connection import get_db
from ...database.models import TideData

router = APIRouter(prefix="/api", tags=["Ocean & Tides"])

@router.get("/ocean")
def get_ocean_state(db: Session = Depends(get_db)):
    return {
        "provider": "INCOIS Ocean State Forecast & Copernicus Marine",
        "current_conditions": {
            "surface_current_speed_knots": 1.2,
            "current_direction_deg": 45,
            "thermocline_depth_m": 38.0,
            "sea_surface_salinity_psu": 34.2,
            "dominant_wave_direction": "SE",
            "swell_height_m": 2.1,
            "status": "MODERATE_SEA"
        }
    }

@router.get("/tides")
def get_tides(db: Session = Depends(get_db)):
    tides = db.query(TideData).all()
    return {
        "provider": "Survey of India Geodetic & Research Branch",
        "tides": [
            {
                "id": t.id,
                "location": t.location,
                "high_low": t.high_low,
                "height_m": t.height,
                "trend": t.trend
            }
            for t in tides
        ]
    }
