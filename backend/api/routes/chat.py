"""
Chat and Agent Execution API Routes for NEREUS.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from ...database.connection import get_db
from ...agents.graph import nereus_pipeline
from ...services.voice.language import detect_indic_script

router = APIRouter(prefix="/api", tags=["Chat & Agents"])

class ChatRequest(BaseModel):
    query: str
    user_id: Optional[str] = "guest_mariner"
    location: Optional[Dict[str, Any]] = None
    language: Optional[str] = "auto"

@router.post("/chat")
def handle_chat(req: ChatRequest, db: Session = Depends(get_db)):
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="Query text cannot be empty.")

    detected_lang = req.language
    if detected_lang == "auto":
        detected_lang = detect_indic_script(req.query)

    result = nereus_pipeline.execute_pipeline(
        db=db,
        query=req.query,
        user_id=req.user_id,
        user_location=req.location,
        language=detected_lang
    )
    return result

@router.post("/agents/execute")
def execute_specific_agent(req: ChatRequest, db: Session = Depends(get_db)):
    """Direct agent pipeline execution."""
    return handle_chat(req, db)
