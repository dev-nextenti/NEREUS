"""
Safe Route Navigation Route for NEREUS.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional
from ...agents.navigation import navigation_agent

router = APIRouter(prefix="/api/navigation", tags=["Navigation"])

class RouteRequest(BaseModel):
    start: Optional[Dict[str, float]] = None
    destination: Optional[Dict[str, float]] = None

@router.post("/safe-route")
def calculate_route(req: RouteRequest):
    start = req.start or {"latitude": 16.989, "longitude": 82.247, "name": "Kakinada Coast"}
    dest = req.destination or {"latitude": 16.942, "longitude": 82.385, "name": "PFZ Alpha"}
    return navigation_agent.calculate_safe_route(start, dest)
