"""
Visualization Agent for NEREUS.
Determines 3D Globe camera focus, layer overlays, glowing contours, and HUD widgets.
"""
from typing import Dict, Any, List

class VisualizationAgent:
    def __init__(self):
        self.agent_name = "VISUALIZATION_AGENT"

    def plan_visuals(
        self,
        intent: str,
        user_loc: Dict[str, float],
        pfz_data: Dict[str, Any] = None,
        weather_data: Dict[str, Any] = None,
        risk_data: Dict[str, Any] = None,
        route_data: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        layers_to_enable = ["PFZ", "WAVES"]
        camera_target = {
            "latitude": user_loc.get("latitude", 16.989),
            "longitude": user_loc.get("longitude", 82.247),
            "zoom": 1.6
        }
        markers = []

        # User marker
        markers.append({
            "type": "VESSEL_USER",
            "latitude": user_loc.get("latitude", 16.989),
            "longitude": user_loc.get("longitude", 82.247),
            "label": "My Position (Kakinada Coast)"
        })

        # Add PFZ target marker if available
        if pfz_data and pfz_data.get("nearest_pfz"):
            npfz = pfz_data["nearest_pfz"]
            markers.append({
                "type": "PFZ_TARGET",
                "latitude": npfz["latitude"],
                "longitude": npfz["longitude"],
                "label": f"{npfz['name']} ({npfz['distance_nm']} NM)",
                "confidence": npfz["confidence_pct"]
            })
            layers_to_enable.append("SST")

        # Weather / Waves visualization
        if weather_data:
            w = weather_data.get("weather", {})
            if w.get("wave_height_m", 0) > 2.0:
                layers_to_enable.append("WAVES")
            if w.get("cyclone_risk") != "NONE":
                layers_to_enable.append("CYCLONE")

        # Route
        if route_data and route_data.get("status") == "SUCCESS":
            layers_to_enable.append("SAFE_ROUTES")

        core_state = "IDLE"
        if risk_data:
            v = risk_data.get("safety_verdict")
            if v == "DANGER":
                core_state = "WARNING"
            elif v == "CAUTION":
                core_state = "ANALYZING"
            else:
                core_state = "RESPONDING"

        return {
            "status": "SUCCESS",
            "camera_target": camera_target,
            "enabled_layers": list(set(layers_to_enable)),
            "markers": markers,
            "core_state": core_state,
            "pulse_rate": "INTENSE" if core_state == "WARNING" else "SMOOTH",
            "hud_display_mode": "SAFETY_AND_PFZ"
        }

visualization_agent = VisualizationAgent()
