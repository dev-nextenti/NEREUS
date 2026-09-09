"""
NEREUS Engine Configuration & API Key Management Routes
========================================================
Endpoints to inspect, test, and update API keys at runtime.
"""
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, Dict, Any

from ...services.config_manager import (
    get_gemini_api_key,
    save_gemini_api_key,
    mask_key,
    test_gemini_key,
    DEFAULT_FALLBACK_KEY
)

router = APIRouter(prefix="/api/config", tags=["Configuration & Keys"])


class ApiKeyRequest(BaseModel):
    gemini_api_key: str


class TestKeyRequest(BaseModel):
    gemini_api_key: str


@router.get("/keys")
def get_key_status(x_gemini_api_key: Optional[str] = Header(None)):
    """Returns active API key status (masked for security) and engine health."""
    active_key = get_gemini_api_key(x_gemini_api_key)
    is_default = (active_key == DEFAULT_FALLBACK_KEY)
    
    # Check key status
    test_res = test_gemini_key(active_key)
    
    return {
        "status": "ONLINE",
        "gemini_api_key_masked": mask_key(active_key),
        "is_custom_key": not is_default,
        "key_valid": test_res.get("valid", False),
        "key_status": test_res.get("status", "UNKNOWN"),
        "message": test_res.get("message", ""),
        "model": "models/gemini-3.6-flash",
        "search_engine": "DuckDuckGo Live + Open-Meteo Marine Grounding",
    }


@router.post("/test-key")
def test_key_endpoint(req: TestKeyRequest):
    """Directly tests a user-submitted Gemini API key before saving."""
    if not req.gemini_api_key or not req.gemini_api_key.strip():
        raise HTTPException(status_code=400, detail="API key cannot be empty.")
    
    res = test_gemini_key(req.gemini_api_key.strip())
    return res


@router.post("/keys")
def save_key_endpoint(req: ApiKeyRequest):
    """Saves a verified Gemini API key to persistent configuration."""
    clean_key = req.gemini_api_key.strip()
    if not clean_key:
        raise HTTPException(status_code=400, detail="API key cannot be empty.")
    
    # Validate key
    test_res = test_gemini_key(clean_key)
    
    # Save key
    success = save_gemini_api_key(clean_key)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to persist API key.")
    
    return {
        "status": "SUCCESS",
        "message": "Gemini API key successfully saved and active.",
        "masked_key": mask_key(clean_key),
        "validation": test_res
    }
