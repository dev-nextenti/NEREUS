"""
INCOIS Marine Connector.
Retrieves Potential Fishing Zones (PFZ) advisory coordinates and Ocean State Forecasts (OSF).
"""
from typing import Any, List, Dict
import requests
from sqlalchemy.orm import Session
from .base_connector import BaseConnector
from ...database.models import PFZZone, Alert

class IncoisConnector(BaseConnector):
    def __init__(self):
        super().__init__(
            source_name="INCOIS",
            dataset="PFZ Multilingual Advisory & High Wave Alerts",
            api_url="https://incois.gov.in/marine/pfz-advisory"
        )

    def fetch(self) -> Any:
        if self.is_live and self.api_url:
            try:
                resp = requests.get(self.api_url, timeout=10)
                if resp.status_code == 200:
                    return resp.json()
            except Exception:
                pass
        return [
            {
                "name": "Kakinada Sector Zone 1",
                "lat": 16.942, "lon": 82.385,
                "confidence": 89.5, "sst": 28.2, "chl": 1.95,
                "species": "Yellowfin Tuna, Ribbonfish",
                "depth": 42.0
            },
            {
                "name": "Godavari Offshore Zone 2",
                "lat": 16.680, "lon": 82.520,
                "confidence": 92.0, "sst": 27.8, "chl": 2.40,
                "species": "Mackerel, Seer Fish",
                "depth": 55.0
            }
        ]

    def validate(self, raw_data: Any) -> bool:
        return isinstance(raw_data, list)

    def normalize(self, raw_data: Any) -> List[Dict[str, Any]]:
        normalized = []
        for item in raw_data:
            normalized.append({
                "zone_name": item["name"],
                "latitude": item["lat"],
                "longitude": item["lon"],
                "confidence": item["confidence"],
                "sst": item["sst"],
                "chlorophyll": item["chl"],
                "depth_m": item.get("depth", 50.0),
                "target_species": item.get("species", "Pelagic Fish"),
                "source": "INCOIS",
                "is_demo": not self.is_live,
                "geometry_json": {"type": "Point", "coordinates": [item["lon"], item["lat"]]}
            })
        return normalized

    def store(self, db: Session, normalized_records: List[Dict[str, Any]]) -> int:
        count = 0
        for rec in normalized_records:
            pfz = PFZZone(**rec)
            db.add(pfz)
            count += 1
        db.commit()
        return count
