"""
Geospatial Agent for NEREUS.
Performs coordinate transformations, point-in-polygon containment, spatial queries, and geographic bounds.
"""
from typing import Dict, Any, List
import math
from shapely.geometry import Point, shape, LineString

class GeospatialAgent:
    def __init__(self):
        self.agent_name = "GEOSPATIAL_AGENT"

    def calculate_distance_nm(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        R_nm = 3440.065 # Earth radius in nautical miles
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R_nm * c, 2)

    def check_containment(self, lat: float, lon: float, geojson_geom: Dict[str, Any]) -> bool:
        """Check if point is inside a polygon geometry."""
        try:
            pt = Point(lon, lat)
            poly = shape(geojson_geom)
            return poly.contains(pt)
        except Exception:
            return False

    def distance_to_linestring_nm(self, lat: float, lon: float, geojson_geom: Dict[str, Any]) -> float:
        """Calculate minimum nautical distance from point to a LineString geometry."""
        try:
            pt = Point(lon, lat)
            line = shape(geojson_geom)
            # Degree distance converted to approximate NM (1 deg lat ~= 60 nm)
            deg_dist = line.distance(pt)
            return round(deg_dist * 60.0, 2)
        except Exception:
            return 999.0

geospatial_agent = GeospatialAgent()
