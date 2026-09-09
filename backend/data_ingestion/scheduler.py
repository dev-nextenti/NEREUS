"""
Ingestion Scheduler for NEREUS.
Coordinates scheduled and on-demand synchronization across all 5 connectors.
"""
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from .connectors.mosdac_connector import MosdacConnector
from .connectors.incois_connector import IncoisConnector
from .connectors.weather_connector import WeatherConnector
from .connectors.ocean_connector import OceanConnector
from .connectors.geofence_connector import GeofenceConnector

class IngestionManager:
    def __init__(self):
        self.connectors = [
            MosdacConnector(),
            IncoisConnector(),
            WeatherConnector(),
            OceanConnector(),
            GeofenceConnector()
        ]

    def sync_all(self, db: Session) -> List[Dict[str, Any]]:
        results = []
        for conn in self.connectors:
            res = conn.run_pipeline(db)
            results.append(res)
        return results

    def sync_source(self, db: Session, source_name: str) -> Dict[str, Any]:
        for conn in self.connectors:
            if conn.source_name.lower() == source_name.lower():
                return conn.run_pipeline(db)
        return {"error": f"Unknown connector source: {source_name}"}

ingestion_manager = IngestionManager()
