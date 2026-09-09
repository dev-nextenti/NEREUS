"""
Alerts and Geofences API Routes for NEREUS.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...database.connection import get_db
from ...database.models import Alert, Geofence

router = APIRouter(prefix="/api", tags=["Alerts & Geofences"])

@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).filter(Alert.active == True).all()
    return {
        "total_active": len(alerts),
        "alerts": [
            {
                "id": a.id,
                "type": a.type,
                "severity": a.severity,
                "location": a.location,
                "latitude": a.latitude,
                "longitude": a.longitude,
                "message": a.message,
                "source": a.source,
                "timestamp": a.timestamp.isoformat() if a.timestamp else None
            }
            for a in alerts
        ]
    }

@router.get("/geofences")
def get_geofences(db: Session = Depends(get_db)):
    geofences = db.query(Geofence).all()
    return {
        "total": len(geofences),
        "geofences": [
            {
                "id": g.id,
                "name": g.name,
                "type": g.type,
                "risk_level": g.risk_level,
                "description": g.description,
                "geometry": g.geometry_json
            }
            for g in geofences
        ]
    }
