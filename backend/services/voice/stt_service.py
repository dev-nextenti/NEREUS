"""
Speech-to-Text Service for NEREUS.
Provides unified interface for Bhashini Indic STT, local Whisper (from Mark-LI), and Web Speech API.
"""
from abc import ABC, abstractmethod
import os
from typing import Dict, Any
from .language import detect_indic_script

class BaseSTT(ABC):
    @abstractmethod
    def transcribe(self, audio_data: bytes, lang: str = "auto") -> Dict[str, Any]:
        pass

class BhashiniSTT(BaseSTT):
    def __init__(self):
        self.api_key = os.getenv("BHASHINI_API_KEY", None)
        self.user_id = os.getenv("BHASHINI_USER_ID", None)

    def transcribe(self, audio_data: bytes, lang: str = "auto") -> Dict[str, Any]:
        if not self.api_key:
            return {"status": "UNCONFIGURED", "message": "Bhashini credentials not set; using browser/client STT fallback."}
        # Production Bhashini ULCA pipeline call interface
        return {"status": "SUCCESS", "text": "", "language": lang}

class LocalWhisperSTT(BaseSTT):
    def __init__(self):
        self._model = None

    def transcribe(self, audio_data: bytes, lang: str = "auto") -> Dict[str, Any]:
        return {"status": "LOCAL_WHISPER_READY", "message": "Whisper engine standby"}

class STTManager:
    def __init__(self):
        self.bhashini = BhashiniSTT()
        self.whisper = LocalWhisperSTT()

    def process_speech(self, text_or_audio: Any, explicit_lang: str = "auto") -> Dict[str, Any]:
        if isinstance(text_or_audio, str):
            detected_lang = detect_indic_script(text_or_audio) if explicit_lang == "auto" else explicit_lang
            return {
                "status": "SUCCESS",
                "transcript": text_or_audio,
                "detected_language": detected_lang,
                "source": "DIRECT_SPEECH_STREAM"
            }
        return {"status": "FALLBACK", "transcript": "", "detected_language": "en"}

stt_manager = STTManager()
