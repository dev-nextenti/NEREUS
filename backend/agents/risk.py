"""
Deterministic Risk Agent for NEREUS.
Calculates overall marine risk using deterministic safety thresholds.
AI LLM NEVER overrides hard safety constraints.
Cross-verifies PFZ abundance against dangerous sea conditions.
"""
from typing import Dict, Any, List

# Deterministic safety threshold limits for coastal fishing craft
MAX_SAFE_WAVE_HEIGHT_M = 2.0
DANGEROUS_WAVE_HEIGHT_M = 3.2
MAX_SAFE_WIND_SPEED_KMH = 30.0
DANGEROUS_WIND_SPEED_KMH = 45.0
MAX_SAFE_LIGHTNING_PCT = 30.0

class RiskAgent:
    def __init__(self):
        self.agent_name = "RISK_AGENT"

    def assess_risk(
        self,
        weather: Dict[str, Any],
        ocean_state: Dict[str, Any],
        geofence_state: Dict[str, Any],
        pfz_info: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        risk_factors: List[Dict[str, Any]] = []
        hard_stop_reasons: List[str] = []

        wave_m = weather.get("wave_height_m", 1.5)
        wind_kmh = weather.get("wind_speed_kmh", 15.0)
        lightning_pct = weather.get("lightning_prob_pct", 5.0)
        cyclone_risk = weather.get("cyclone_risk", "NONE")
        geofence_verdict = geofence_state.get("geofence_verdict", "SAFE")

        # 1. Wave Height Check
        if wave_m >= DANGEROUS_WAVE_HEIGHT_M:
            hard_stop_reasons.append(f"Wave height ({wave_m} m) exceeds maximum safety limit ({DANGEROUS_WAVE_HEIGHT_M} m). High capsize risk for small craft.")
            risk_factors.append({"factor": "WAVE_HEIGHT", "level": "CRITICAL", "value": f"{wave_m} m", "penalty": 40})
        elif wave_m >= MAX_SAFE_WAVE_HEIGHT_M:
            risk_factors.append({"factor": "WAVE_HEIGHT", "level": "ELEVATED", "value": f"{wave_m} m", "penalty": 25})
        else:
            risk_factors.append({"factor": "WAVE_HEIGHT", "level": "SAFE", "value": f"{wave_m} m", "penalty": 5})

        # 2. Wind Speed Check
        if wind_kmh >= DANGEROUS_WIND_SPEED_KMH:
            hard_stop_reasons.append(f"Wind speed ({wind_kmh} km/h) exceeds gale force limits. Steering control compromised.")
            risk_factors.append({"factor": "WIND_SPEED", "level": "CRITICAL", "value": f"{wind_kmh} km/h", "penalty": 35})
        elif wind_kmh >= MAX_SAFE_WIND_SPEED_KMH:
            risk_factors.append({"factor": "WIND_SPEED", "level": "ELEVATED", "value": f"{wind_kmh} km/h", "penalty": 20})
        else:
            risk_factors.append({"factor": "WIND_SPEED", "level": "SAFE", "value": f"{wind_kmh} km/h", "penalty": 5})

        # 3. Cyclone Risk Check
        if cyclone_risk in ["HIGH", "SEVERE", "CYCLONIC_STORM"]:
            hard_stop_reasons.append("Active cyclonic storm warning in coastal grid sector.")
            risk_factors.append({"factor": "CYCLONE", "level": "CRITICAL", "value": cyclone_risk, "penalty": 50})
        elif cyclone_risk in ["MODERATE", "LOW"]:
            risk_factors.append({"factor": "CYCLONE", "level": "MONITOR", "value": cyclone_risk, "penalty": 15})
        else:
            risk_factors.append({"factor": "CYCLONE", "level": "SAFE", "value": "NONE", "penalty": 0})

        # 4. Lightning Check
        if lightning_pct >= MAX_SAFE_LIGHTNING_PCT:
            risk_factors.append({"factor": "LIGHTNING", "level": "WARNING", "value": f"{lightning_pct}%", "penalty": 20})
        else:
            risk_factors.append({"factor": "LIGHTNING", "level": "SAFE", "value": f"{lightning_pct}%", "penalty": 0})

        # 5. Geofence & Boundary Check
        if geofence_verdict == "DANGER":
            hard_stop_reasons.append("Within critical perimeter (<=2 NM) of International Maritime Boundary Line.")
            risk_factors.append({"factor": "GEOFENCE", "level": "CRITICAL", "value": "DANGER", "penalty": 40})
        elif geofence_verdict in ["RESTRICTED", "CAUTION"]:
            risk_factors.append({"factor": "GEOFENCE", "level": "WARNING", "value": geofence_verdict, "penalty": 20})
        else:
            risk_factors.append({"factor": "GEOFENCE", "level": "SAFE", "value": "CLEAR", "penalty": 0})

        # Compute Total Risk Score (0 to 100)
        total_score = min(100, sum(f["penalty"] for f in risk_factors))

        # Determine Final Safety Status
        if hard_stop_reasons or total_score >= 65:
            verdict = "DANGER"
            safety_summary = "UNSAFE: Venture into sea strictly prohibited."
        elif total_score >= 35:
            verdict = "CAUTION"
            safety_summary = "MODERATE RISK: Small vessels should avoid offshore trips; conditions require continuous monitoring."
        else:
            verdict = "SAFE"
            safety_summary = "SAFE: Favorable sea and weather conditions for marine navigation."

        # Cross-Agent Conflict Resolution (PFZ vs Safety)
        has_pfz = pfz_info and pfz_info.get("status") == "SUCCESS"
        conflict_detected = False
        conflict_resolution = None

        if has_pfz and verdict in ["DANGER", "CAUTION"]:
            conflict_detected = True
            conflict_resolution = (
                f"OVERRIDE ACTIVATED: While PFZ conditions show high pelagic biomass probability, "
                f"sea state ({verdict}) poses unacceptable navigation risks. Safety rules override fishing productivity."
            )

        return {
            "status": "SUCCESS",
            "safety_verdict": verdict,  # SAFE, CAUTION, HIGH_RISK, DANGER
            "risk_score": total_score,
            "safety_summary": safety_summary,
            "hard_stop_reasons": hard_stop_reasons,
            "risk_factors": risk_factors,
            "conflict_detected": conflict_detected,
            "conflict_resolution": conflict_resolution,
            "deterministic_override": len(hard_stop_reasons) > 0,
            "provenance": "Deterministic Marine Safety Engine (IMO / INCOIS Safety Protocols)"
        }

risk_agent = RiskAgent()
