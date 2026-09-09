"""
PFZ Agent for NEREUS.
Identifies Potential Fishing Zones, calculates geodesic nautical distances, assesses pelagic suitability.
"""
import math
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from ..database.models import PFZZone

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class PFZAgent:
    def __init__(self):
        self.agent_name = "PFZ_AGENT"

    def execute(self, db: Session, user_location: Dict[str, float]) -> Dict[str, Any]:
        u_lat = user_location.get("latitude", 16.989)
        u_lon = user_location.get("longitude", 82.247)

        zones = db.query(PFZZone).all()
        if not zones:
            return {"status": "NO_ZONES_FOUND", "zones": []}

        annotated_zones = []
        for z in zones:
            dist_km = haversine_km(u_lat, u_lon, z.latitude, z.longitude)
            dist_nm = dist_km / 1.852 # 1 Nautical Mile = 1.852 km
            
            # Bearing calculation
            dlon = math.radians(z.longitude - u_lon)
            y = math.sin(dlon) * math.cos(math.radians(z.latitude))
            x = math.cos(math.radians(u_lat)) * math.sin(math.radians(z.latitude)) - math.sin(math.radians(u_lat)) * math.cos(math.radians(z.latitude)) * math.cos(dlon)
            bearing = (math.degrees(math.atan2(y, x)) + 360) % 360

            annotated_zones.append({
                "id": z.id,
                "name": z.zone_name,
                "latitude": z.latitude,
                "longitude": z.longitude,
                "distance_km": round(dist_km, 1),
                "distance_nm": round(dist_nm, 1),
                "bearing_deg": round(bearing, 0),
                "confidence_pct": z.confidence,
                "sst_c": z.sst,
                "chlorophyll_mg_m3": z.chlorophyll,
                "depth_m": z.depth_m,
                "target_species": z.target_species,
                "source": z.source
            })

        # Sort by distance from user
        annotated_zones.sort(key=lambda item: item["distance_km"])
        nearest = annotated_zones[0] if annotated_zones else None

        return {
            "status": "SUCCESS",
            "total_zones": len(annotated_zones),
            "nearest_pfz": nearest,
            "all_zones": annotated_zones,
            "provenance": "INCOIS Multilingual PFZ Advisory & Oceansat Ocean Color"
        }

pfz_agent = PFZAgent()
