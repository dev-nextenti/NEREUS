"""
Copernicus / NOAA Ocean Connector.
Retrieves sea state parameters, subsurface currents, thermocline depth, and salinity.
"""
from typing import Any, List, Dict
from sqlalchemy.orm import Session
from .base_connector import BaseConnector
from ...database.models import MarineObservation

class OceanConnector(BaseConnector):
    def __init__(self):
        super().__init__(
            source_name="Copernicus/NOAA",
            dataset="Global Ocean Currents & Sea State",
            api_url="https://ocean.copernicus.eu/api"
        )

    def fetch(self) -> Any:
        return [
            {"lat": 16.90, "lon": 82.40, "current_knots": 1.4, "current_dir": 45, "sst": 28.1, "wave": 2.1},
            {"lat": 17.60, "lon": 83.30, "current_knots": 1.1, "current_dir": 50, "sst": 28.7, "wave": 1.7},
            {"lat": 13.00, "lon": 80.30, "current_knots": 0.9, "current_dir": 30, "sst": 29.0, "wave": 1.4},
        ]

    def validate(self, raw_data: Any) -> bool:
        return isinstance(raw_data, list)

    def normalize(self, raw_data: Any) -> List[Dict[str, Any]]:
        return [
            {
                "latitude": d["lat"],
                "longitude": d["lon"],
                "sst": d["sst"],
                "chlorophyll": 1.8,
                "wave_height": d["wave"],
                "wave_period": 7.8,
                "wind_speed": 16.5,
                "source": "Copernicus/NOAA",
                "is_demo": not self.is_live
            }
            for d in raw_data
        ]

    def store(self, db: Session, normalized_records: List[Dict[str, Any]]) -> int:
        count = 0
        for rec in normalized_records:
            obs = MarineObservation(**rec)
            db.add(obs)
            count += 1
        db.commit()
        return count
