"""
Planner Agent for NEREUS.
Decomposes user queries into structured execution plans across specialized marine agents.
"""
from typing import Dict, Any, List
import re

class PlannerAgent:
    def __init__(self):
        self.agent_name = "PLANNER"

    def plan(self, query: str, user_location: Dict[str, float] = None) -> Dict[str, Any]:
        """Decompose user query into sub-agent execution tasks."""
        q_lower = query.lower()
        
        # Target location resolution: parse query for Indian regions first, fallback to user location
        from ..services.online_research import detect_region_from_text
        user_lat = user_location.get("latitude") or user_location.get("lat") if user_location else None
        user_lon = user_location.get("longitude") or user_location.get("lon") if user_location else None
        detected = detect_region_from_text(query, fallback_lat=user_lat, fallback_lon=user_lon)
        loc = {
            "latitude": detected["lat"],
            "longitude": detected["lon"],
            "name": detected["primary_name"]
        }
        
        # Intent detection
        is_pfz_query = any(k in q_lower for k in ["fishing", "pfz", "fish", "catch", "zone", "species", "tuna", "mackerel"])
        is_safety_query = any(k in q_lower for k in ["safe", "safety", "hazard", "risk", "cyclone", "storm", "wave", "venture", "go out", "tomorrow"])
        is_weather_query = any(k in q_lower for k in ["weather", "wind", "rain", "temperature", "forecast", "lightning", "storm", "condition"])
        is_ocean_query = any(k in q_lower for k in ["sst", "sea surface", "temperature", "chlorophyll", "chl", "current", "tide", "swell"])
        is_route_query = any(k in q_lower for k in ["route", "navigate", "navigation", "waypoint", "path", "safest route", "direction"])
        is_geofence_query = any(k in q_lower for k in ["boundary", "imbl", "border", "restricted", "sri lanka", "eez", "protected", "geofence"])

        # Detect temporal horizon
        time_frame = "TODAY"
        if "tomorrow morning" in q_lower or "morning" in q_lower:
            time_frame = "TOMORROW_MORNING"
        elif "tomorrow" in q_lower:
            time_frame = "TOMORROW"
        elif "afternoon" in q_lower:
            time_frame = "AFTERNOON"

        # Construct task plan
        tasks: List[str] = []
        agents_required: List[str] = []

        if is_pfz_query or not (is_weather_query or is_safety_query or is_geofence_query or is_route_query):
            tasks.append("QUERY_PFZ_ZONES")
            agents_required.append("PFZ_AGENT")
            tasks.append("QUERY_OCEAN_SST_CHLOROPHYLL")
            agents_required.append("MARINE_DATA_AGENT")

        if is_safety_query or is_weather_query or is_pfz_query:
            tasks.append("FETCH_WEATHER_FORECAST")
            agents_required.append("WEATHER_AGENT")
            tasks.append("ANALYZE_WAVE_SEA_STATE")
            agents_required.append("OCEAN_ANALYTICS_AGENT")
            tasks.append("CHECK_GEOFENCES_AND_IMBL")
            agents_required.append("GEOFENCE_AGENT")
            tasks.append("CALCULATE_DETERMINISTIC_RISK")
            agents_required.append("RISK_AGENT")

        if is_route_query or is_pfz_query:
            tasks.append("GENERATE_SAFE_NAVIGATION_CORRIDOR")
            agents_required.append("NAVIGATION_AGENT")

        if is_ocean_query:
            tasks.append("FETCH_SST_CHLOROPHYLL_LAYER")
            agents_required.append("MARINE_DATA_AGENT")

        # Always synthesize explanation and visualization
        tasks.append("COMPILE_EXPLANATION_AND_EVIDENCE")
        agents_required.append("EXPLANATION_AGENT")
        tasks.append("PREPARE_GLOBE_VISUALIZATION")
        agents_required.append("VISUALIZATION_AGENT")

        # Deduplicate agents while preserving order
        unique_agents = []
        for a in agents_required:
            if a not in unique_agents:
                unique_agents.append(a)

        return {
            "query": query,
            "detected_intent": "PFZ_AND_SAFETY" if (is_pfz_query and is_safety_query) else "PFZ_DISCOVERY" if is_pfz_query else "SAFETY_CHECK" if is_safety_query else "MARINE_INSIGHT",
            "time_frame": time_frame,
            "target_location": loc,
            "tasks": tasks,
            "required_agents": unique_agents
        }

planner_agent = PlannerAgent()
