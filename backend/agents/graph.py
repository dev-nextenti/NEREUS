"""
Multi-Agent Orchestration Graph for NEREUS.
Coordinates the state transitions, agent execution sequences, deterministic safety gating, and evidence generation.
"""
import time
import uuid
import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from .planner import planner_agent
from .marine import marine_data_agent
from .weather import weather_agent
from .ocean import ocean_analytics_agent
from .pfz import pfz_agent
from .geofence import geofence_agent
from .navigation import navigation_agent
from .risk import risk_agent
from .visualization import visualization_agent
from .explanation import explanation_agent
from .reporting import reporting_agent
from ..database.models import Conversation, AgentLog

class NereusAgentPipeline:
    def __init__(self):
        pass

    def execute_pipeline(
        self,
        db: Session,
        query: str,
        user_id: str = "guest_mariner",
        user_location: Dict[str, float] = None,
        language: str = "en"
    ) -> Dict[str, Any]:
        conv_id = f"conv_{uuid.uuid4().hex[:12]}"
        start_overall = time.time()
        agent_execution_trace = []

        # 1. PLANNER
        t0 = time.time()
        plan = planner_agent.plan(query, user_location)
        t_plan = round((time.time() - t0) * 1000, 2)
        agent_execution_trace.append({"agent": "PLANNER", "status": "COMPLETED", "duration_ms": t_plan})

        loc = plan["target_location"]
        time_frame = plan["time_frame"]

        # 2. MARINE DATA AGENT
        t0 = time.time()
        marine_res = marine_data_agent.execute(db, loc)
        agent_execution_trace.append({"agent": "MARINE_DATA_AGENT", "status": "COMPLETED", "duration_ms": round((time.time() - t0) * 1000, 2)})

        # 3. PFZ AGENT
        t0 = time.time()
        pfz_res = pfz_agent.execute(db, loc)
        agent_execution_trace.append({"agent": "PFZ_AGENT", "status": "COMPLETED", "duration_ms": round((time.time() - t0) * 1000, 2)})

        # 4. WEATHER AGENT
        t0 = time.time()
        weather_res = weather_agent.execute(db, loc, time_frame)
        agent_execution_trace.append({"agent": "WEATHER_AGENT", "status": "COMPLETED", "duration_ms": round((time.time() - t0) * 1000, 2)})

        # 5. OCEAN ANALYTICS AGENT
        t0 = time.time()
        w_data = weather_res.get("weather", {})
        ocean_res = ocean_analytics_agent.execute(
            wave_height_m=w_data.get("wave_height_m", 2.1),
            wave_period_s=w_data.get("wave_period_s", 7.8),
            wind_speed_kmh=w_data.get("wind_speed_kmh", 18.0)
        )
        agent_execution_trace.append({"agent": "OCEAN_ANALYTICS_AGENT", "status": "COMPLETED", "duration_ms": round((time.time() - t0) * 1000, 2)})

        # 6. GEOFENCE AGENT
        t0 = time.time()
        geofence_res = geofence_agent.execute(db, loc)
        agent_execution_trace.append({"agent": "GEOFENCE_AGENT", "status": "COMPLETED", "duration_ms": round((time.time() - t0) * 1000, 2)})

        # 7. NAVIGATION AGENT
        t0 = time.time()
        nearest_pfz = pfz_res.get("nearest_pfz")
        dest_coord = {"latitude": nearest_pfz["latitude"], "longitude": nearest_pfz["longitude"], "name": nearest_pfz["name"]} if nearest_pfz else {"latitude": loc["latitude"] + 0.1, "longitude": loc["longitude"] + 0.1}
        nav_res = navigation_agent.calculate_safe_route(loc, dest_coord)
        agent_execution_trace.append({"agent": "NAVIGATION_AGENT", "status": "COMPLETED", "duration_ms": round((time.time() - t0) * 1000, 2)})

        # 8. RISK AGENT (Deterministic Safety Gate)
        t0 = time.time()
        risk_res = risk_agent.assess_risk(
            weather=w_data,
            ocean_state=ocean_res,
            geofence_state=geofence_res,
            pfz_info=pfz_res
        )
        agent_execution_trace.append({"agent": "RISK_AGENT", "status": "COMPLETED", "duration_ms": round((time.time() - t0) * 1000, 2)})

        # 9. EXPLANATION AGENT
        t0 = time.time()
        expl_res = explanation_agent.synthesize(
            query=query,
            user_lang=language,
            pfz_data=pfz_res,
            weather_data=weather_res,
            ocean_data=ocean_res,
            geofence_data=geofence_res,
            risk_data=risk_res,
            route_data=nav_res
        )
        agent_execution_trace.append({"agent": "EXPLANATION_AGENT", "status": "COMPLETED", "duration_ms": round((time.time() - t0) * 1000, 2)})

        # 10. VISUALIZATION AGENT
        t0 = time.time()
        vis_res = visualization_agent.plan_visuals(
            intent=plan["detected_intent"],
            user_loc=loc,
            pfz_data=pfz_res,
            weather_data=weather_res,
            risk_data=risk_res,
            route_data=nav_res
        )
        agent_execution_trace.append({"agent": "VISUALIZATION_AGENT", "status": "COMPLETED", "duration_ms": round((time.time() - t0) * 1000, 2)})

        # 11. REPORTING AGENT
        rep_res = reporting_agent.generate_voyage_report({
            "risk": risk_res, "pfz": pfz_res, "weather": weather_res,
            "ocean": ocean_res, "geofence": geofence_res, "navigation": nav_res,
            "explanation": expl_res
        })
        agent_execution_trace.append({"agent": "REPORTING_AGENT", "status": "COMPLETED", "duration_ms": 5.0})

        total_ms = round((time.time() - start_overall) * 1000, 2)

        # Log conversation to database
        try:
            conv = Conversation(
                id=conv_id,
                user_id=user_id,
                query=query,
                language=language,
                response=expl_res["display_response"],
                response_language=expl_res["language"],
                safety_verdict=risk_res["safety_verdict"],
                agents_involved=[t["agent"] for t in agent_execution_trace],
                evidence_json=expl_res["evidence_chain"]
            )
            db.add(conv)
            db.commit()
        except Exception:
            pass

        return {
            "conversation_id": conv_id,
            "query": query,
            "plan": plan,
            "agents_trace": agent_execution_trace,
            "total_execution_ms": total_ms,
            "safety_verdict": risk_res["safety_verdict"],
            "risk_score": risk_res["risk_score"],
            "safety_summary": risk_res["safety_summary"],
            "spoken_response": expl_res["spoken_response"],
            "display_response": expl_res["display_response"],
            "language": expl_res["language"],
            "evidence_chain": expl_res["evidence_chain"],
            "visualization": vis_res,
            "nearest_pfz": pfz_res.get("nearest_pfz"),
            "all_pfzs": pfz_res.get("all_zones", []),
            "weather": weather_res.get("weather", {}),
            "ocean_state": ocean_res,
            "geofence": geofence_res,
            "navigation_route": nav_res,
            "report": rep_res
        }

nereus_pipeline = NereusAgentPipeline()
