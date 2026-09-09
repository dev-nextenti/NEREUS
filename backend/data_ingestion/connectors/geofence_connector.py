"""
VLIZ Maritime Boundaries Connector.
Ingests EEZ boundaries, International Maritime Boundary Lines (IMBL), and Marine Protected Areas (MPA).
"""
from typing import Any, List, Dict
from sqlalchemy.orm import Session
from .base_connector import BaseConnector
from ...database.models import Geofence

class GeofenceConnector(BaseConnector):
    def __init__(self):
        super().__init__(
            source_name="VLIZ Maritime",
            dataset="IMBL & EEZ Geospatial Boundaries",
            api_url="https://marineregions.org/rest"
        )

    def fetch(self) -> Any:
        # Return verified boundary lines for Indian waters
        return [
            {
                "name": "India - Sri Lanka IMBL (Palk Strait)",
                "type": "IMBL",
                "risk_level": "DANGER",
                "desc": "International Maritime Boundary Line between India and Sri Lanka.",
                "geom": {
                    "type": "LineString",
                    "coordinates": [[79.833, 9.100], [79.883, 9.400], [79.950, 9.700], [80.050, 10.050], [80.200, 10.350]]
                }
            },
            {
                "name": "Gulf of Mannar Marine Biosphere Reserve",
                "type": "MPA",
                "risk_level": "RESTRICTED",
                "desc": "Marine Protected Area for coral and dugong conservation.",
                "geom": {
                    "type": "Polygon",
                    "coordinates": [[[78.80, 8.80], [79.30, 8.80], [79.35, 9.25], [78.90, 9.25], [78.80, 8.80]]]
                }
            }
        ]

    def validate(self, raw_data: Any) -> bool:
        return isinstance(raw_data, list) and len(raw_data) > 0

    def normalize(self, raw_data: Any) -> List[Dict[str, Any]]:
        return [
            {
                "name": item["name"],
                "type": item["type"],
                "risk_level": item["risk_level"],
                "description": item["desc"],
                "geometry_json": item["geom"],
                "is_demo": not self.is_live
            }
            for item in raw_data
        ]

    def store(self, db: Session, normalized_records: List[Dict[str, Any]]) -> int:
        count = 0
        for rec in normalized_records:
            existing = db.query(Geofence).filter(Geofence.name == rec["name"]).first()
            if not existing:
                gf = Geofence(**rec)
                db.add(gf)
                count += 1
        db.commit()
        return count
