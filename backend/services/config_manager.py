"""
NEREUS Configuration & API Key Manager
======================================
Manages runtime configuration, persistent API keys (Gemini, OpenWeather, etc.),
and provides live connection verification.
"""
from __future__ import annotations

import json
import os
import re
from pathlib import Path
from typing import Optional, Dict, Any

from google import genai

CONFIG_DIR = Path(__file__).resolve().parent.parent / "config"
CONFIG_PATH = CONFIG_DIR / "api_keys.json"
MARK_LI_CONFIG_PATH = Path("d:/laptop/batch 8/Mark-LI-main/Mark-LI-main/config/api_keys.json")

DEFAULT_FALLBACK_KEY = "AQ.Ab8RN6KLkdnfWRnhBOYqSnts_NSN_l7Ro46I-FvlnA4lw6Vu_Q"


def _read_config_file() -> Dict[str, Any]:
    if CONFIG_PATH.exists():
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    if MARK_LI_CONFIG_PATH.exists():
        try:
            with open(MARK_LI_CONFIG_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def get_gemini_api_key(client_override: Optional[str] = None) -> str:
    """
    Resolves the active Gemini API key in order of precedence:
    1. Direct client header / parameter override (if non-empty)
    2. nereus/backend/config/api_keys.json
    3. Environment variable GEMINI_API_KEY
    4. Mark-LI config/api_keys.json
    5. Hardcoded default fallback key
    """
    if client_override and client_override.strip() and len(client_override.strip()) > 8:
        return client_override.strip()

    cfg = _read_config_file()
    key = cfg.get("gemini_api_key", "").strip()
    if key and len(key) > 8 and key != DEFAULT_FALLBACK_KEY:
        return key

    env_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if env_key and len(env_key) > 8:
        return env_key

    if key:
        return key

    return DEFAULT_FALLBACK_KEY


def save_gemini_api_key(new_key: str) -> bool:
    """Persists a new Gemini API key into backend/config/api_keys.json."""
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    current = _read_config_file()
    current["gemini_api_key"] = new_key.strip()
    try:
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(current, f, indent=2)
        # Also sync to Mark-LI if directory exists
        if MARK_LI_CONFIG_PATH.parent.exists():
            with open(MARK_LI_CONFIG_PATH, "w", encoding="utf-8") as f:
                json.dump(current, f, indent=2)
        return True
    except Exception as e:
        print(f"[ConfigManager] Failed to save api_keys.json: {e}")
        return False


def mask_key(key: str) -> str:
    """Returns a masked representation of the API key for safe UI display."""
    if not key:
        return "Not Configured"
    clean = key.strip()
    if len(clean) <= 8:
        return "****"
    return f"{clean[:6]}...{clean[-4:]}"


def test_gemini_key(api_key: str) -> Dict[str, Any]:
    """
    Performs a live test of the provided Gemini API key with gemini-3.6-flash.
    Returns validation status, quota health, and diagnostics.
    """
    if not api_key or not api_key.strip():
        return {
            "valid": False,
            "status": "MISSING",
            "message": "API Key is empty. Please enter a valid Google Gemini API key.",
        }

    clean_key = api_key.strip()
    try:
        client = genai.Client(api_key=clean_key)
        # 1-token test prompt to verify key validity and quota
        res = client.models.generate_content(
            model="gemini-3.6-flash",
            contents="ping",
        )
        return {
            "valid": True,
            "status": "ACTIVE",
            "model": "models/gemini-3.6-flash",
            "message": "API key successfully verified. Google Gemini 3.6 Flash is ONLINE with active quota.",
        }
    except Exception as e:
        err_msg = str(e)
        if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
            return {
                "valid": False,
                "status": "QUOTA_EXHAUSTED",
                "message": "API Key quota exceeded (HTTP 429 Resource Exhausted). Please use a key with available credits.",
            }
        elif "400" in err_msg or "INVALID_ARGUMENT" in err_msg or "API_KEY_INVALID" in err_msg or "not valid" in err_msg.lower():
            return {
                "valid": False,
                "status": "INVALID_KEY",
                "message": "API Key is invalid or malformed. Verify your key in Google AI Studio.",
            }
        else:
            return {
                "valid": False,
                "status": "ERROR",
                "message": f"Verification failed: {err_msg[:160]}",
            }
