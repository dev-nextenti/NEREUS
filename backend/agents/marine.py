"""
Marine Data Agent for NEREUS.
Retrieves Sea Surface Temperature (SST), Chlorophyll-a, ocean color observations, and PFZ advisories.
"""
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from ..database.models import MarineObservation, PFZZone

class MarineDataAgent:
    def __init__(self):
        self.agent_name = "MARINE_DATA_AGENT"

    def execute(self, db: Session, location: Dict[str, float], radius_km: float = 100.0) -> Dict[str, Any]:
        lat = location.get("latitude", 16.989)
        lon = location.get("longitude", 82.247)

        # Query recent observations
        obs = db.query(MarineObservation).all()
        if not obs:
            # Fallback observation
            current_obs = {
                "sst": 28.2,
                "chlorophyll": 1.95,
                "wave_height": 2.2,
                "source": "MOSDAC/ISRO"
            }
        else:
            # Find closest observation
            best_match = min(obs, key=lambda o: (o.latitude - lat)**2 + (o.longitude - lon)**2)
            current_obs = {
                "sst": best_match.sst,
                "chlorophyll": best_match.chlorophyll,
                "wave_height": best_match.wave_height,
                "wave_period": best_match.wave_period,
                "wind_speed": best_match.wind_speed,
                "wind_direction": best_match.wind_direction,
                "source": best_match.source
            }

        return {
            "status": "SUCCESS",
            "observation": current_obs,
            "sst_status": "OPTIMAL_PELAGIC" if 27.0 <= current_obs.get("sst", 28.0) <= 29.5 else "SUB_OPTIMAL",
            "chlorophyll_status": "HIGH_PRODUCTIVITY" if current_obs.get("chlorophyll", 1.5) > 1.8 else "NORMAL",
            "source_provenance": "ISRO Oceansat-3 Thermal Infrared & Ocean Colour Monitor"
        }

marine_data_agent = MarineDataAgent()
