"""
Text-to-Speech Service for NEREUS.
Provides audio synthesis interfaces for Bhashini Indic voices and client-side browser synthesis.
"""
from typing import Dict, Any
import os
from .language import LANGUAGE_METADATA

class TTSManager:
    def __init__(self):
        self.bhashini_key = os.getenv("BHASHINI_API_KEY", None)

    def synthesize(self, text: str, lang_code: str = "en") -> Dict[str, Any]:
        meta = LANGUAGE_METADATA.get(lang_code, LANGUAGE_METADATA["en"])
        return {
            "status": "READY",
            "text": text,
            "language_code": lang_code,
            "voice_profile": meta["voice"],
            "tts_provider": "BHASHINI_INDIC" if self.bhashini_key else "BROWSER_SPEECH_SYNTHESIS",
            "client_instruction": {
                "use_browser_speech": True,
                "voice_lang": meta["voice"]
            }
        }

tts_manager = TTSManager()
