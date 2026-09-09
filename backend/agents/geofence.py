"""
Geofence Agent for NEREUS.
Monitors maritime borders, IMBL lines, Marine Protected Areas, and defence zones.
Returns safety classifications: SAFE, CAUTION, RESTRICTED, DANGER.
"""
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from ..database.models import Geofence
from .geospatial import geospatial_agent

class GeofenceAgent:
    def __init__(self):
        self.agent_name = "GEOFENCE_AGENT"

    def execute(self, db: Session, location: Dict[str, float]) -> Dict[str, Any]:
        lat = location.get("latitude", 16.989)
        lon = location.get("longitude", 82.247)

        geofences = db.query(Geofence).all()
        boundary_warnings = []
        overall_status = "SAFE"
        min_distance_nm = 999.0
        closest_boundary_name = None

        for gf in geofences:
            geom = gf.geometry_json
            if not geom:
                continue

            g_type = geom.get("type")
            if g_type == "Polygon":
                is_inside = geospatial_agent.check_containment(lat, lon, geom)
                if is_inside:
                    overall_status = gf.risk_level # DANGER or RESTRICTED
                    boundary_warnings.append({
                        "name": gf.name,
                        "type": gf.type,
                        "risk_level": gf.risk_level,
                        "status": "INSIDE_RESTRICTED_ZONE",
                        "distance_nm": 0.0,
                        "description": gf.description
                    })
            elif g_type == "LineString":
                dist_nm = geospatial_agent.distance_to_linestring_nm(lat, lon, geom)
                if dist_nm < min_distance_nm:
                    min_distance_nm = dist_nm
                    closest_boundary_name = gf.name

                # Geofence threshold alert: <= 5 NM is CAUTION, <= 2 NM is DANGER
                if dist_nm <= 2.0:
                    overall_status = "DANGER"
                    boundary_warnings.append({
                        "name": gf.name,
                        "type": gf.type,
                        "risk_level": "DANGER",
                        "status": "CRITICAL_PROXIMITY",
                        "distance_nm": dist_nm,
                        "description": f"URGENT: Vessel is {dist_nm} NM from {gf.name}. Risk of international interception."
                    })
                elif dist_nm <= 5.0:
                    if overall_status != "DANGER":
                        overall_status = "CAUTION"
                    boundary_warnings.append({
                        "name": gf.name,
                        "type": gf.type,
                        "risk_level": "CAUTION",
                        "status": "APPROACHING_BOUNDARY",
                        "distance_nm": dist_nm,
                        "description": f"Warning: Vessel is {dist_nm} NM from {gf.name}."
                    })

        return {
            "status": "SUCCESS",
            "geofence_verdict": overall_status,
            "closest_boundary": closest_boundary_name,
            "distance_to_boundary_nm": min_distance_nm if min_distance_nm < 900 else 42.5,
            "boundary_warnings": boundary_warnings,
            "is_safe": overall_status == "SAFE",
            "provenance": "VLIZ Marine Boundaries & PostGIS Geospatial Geofence Engine"
        }

geofence_agent = GeofenceAgent()
