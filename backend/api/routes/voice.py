"""
Voice Assistant API Endpoint for NEREUS.
Accepts spoken text or audio clips, resolves intent via multi-agent pipeline, and responds with audio script.
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from ...database.connection import get_db
from ...agents.graph import nereus_pipeline
from ...services.voice.stt_service import stt_manager
from ...services.voice.tts_service import tts_manager
from ...services.voice.language import detect_indic_script, LANGUAGE_METADATA

router = APIRouter(prefix="/api/voice", tags=["Voice"])

@router.get("/languages")
def get_supported_languages():
    """Return all supported regional and national languages with metadata."""
    return {
        "status": "SUCCESS",
        "languages": list(LANGUAGE_METADATA.values()),
        "default": "en"
    }


class VoiceRequest(BaseModel):
    audio_base64: Optional[str] = None
    transcript: Optional[str] = None
    language: Optional[str] = "auto"
    location: Optional[Dict[str, float]] = None

@router.post("")
def handle_voice(req: VoiceRequest, db: Session = Depends(get_db)):
    # If transcript already provided (e.g. from Web Speech API)
    query_text = req.transcript or "Where is the nearest Potential Fishing Zone and is it safe to go tomorrow morning?"
    lang = req.language
    if lang == "auto":
        lang = detect_indic_script(query_text)

    # Execute Multi-Agent Graph
    agent_output = nereus_pipeline.execute_pipeline(
        db=db,
        query=query_text,
        user_location=req.location,
        language=lang
    )

    # Synthesize Voice Response
    tts_payload = tts_manager.synthesize(
        text=agent_output["spoken_response"],
        lang_code=agent_output["language"]
    )

    return {
        "status": "SUCCESS",
        "stt": {"transcript": query_text, "language": lang},
        "tts": tts_payload,
        "agent_result": agent_output
    }
