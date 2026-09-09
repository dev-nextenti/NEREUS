"""
Language Detection and Indian Language Mapping for NEREUS.
Supports: English, Hindi, Telugu, Tamil, Malayalam, Odia, Gujarati, Bengali, Marathi, Kannada.
"""
from typing import Dict, Any

LANGUAGE_METADATA: Dict[str, Dict[str, str]] = {
    "en": {"code": "en", "name": "English", "native": "English", "bhashini_code": "en", "voice": "en-IN", "flag": "🇮🇳", "sample": "Is it safe to go fishing tomorrow morning?"},
    "hi": {"code": "hi", "name": "Hindi", "native": "हिन्दी", "bhashini_code": "hi", "voice": "hi-IN", "flag": "🇮🇳", "sample": "क्या कल सुबह मछली पकड़ने जाना सुरक्षित है?"},
    "te": {"code": "te", "name": "Telugu", "native": "తెలుగు", "bhashini_code": "te", "voice": "te-IN", "flag": "🇮🇳", "sample": "రేపు ఉదయం వేటకు వెళ్లడం సురక్షితమేనా?"},
    "ta": {"code": "ta", "name": "Tamil", "native": "தமிழ்", "bhashini_code": "ta", "voice": "ta-IN", "flag": "🇮🇳", "sample": "நாளை காலை கடலுக்கு மீன்பிடிக்க செல்லலாமா?"},
    "ml": {"code": "ml", "name": "Malayalam", "native": "മലയാളം", "bhashini_code": "ml", "voice": "ml-IN", "flag": "🇮🇳", "sample": "നാളെ രാവിലെ കടലിൽ പോകുന്നത് സുരക്ഷിതമാണോ?"},
    "bn": {"code": "bn", "name": "Bengali", "native": "বাংলা", "bhashini_code": "bn", "voice": "bn-IN", "flag": "🇮🇳", "sample": "আগামীকাল সকালে সমুদ্রে মাছ ধরতে যাওয়া কি নিরাপদ?"},
    "gu": {"code": "gu", "name": "Gujarati", "native": "ગુજરાતી", "bhashini_code": "gu", "voice": "gu-IN", "flag": "🇮🇳", "sample": "શું કાલે સવારે દરિયામાં માછીમારી કરવા જવું સલામત છે?"},
    "mr": {"code": "mr", "name": "Marathi", "native": "मराठी", "bhashini_code": "mr", "voice": "mr-IN", "flag": "🇮🇳", "sample": "उद्या सकाळी समुद्रात मासेमारीसाठी जाणे सुरक्षित आहे का?"},
    "kn": {"code": "kn", "name": "Kannada", "native": "ಕನ್ನಡ", "bhashini_code": "kn", "voice": "kn-IN", "flag": "🇮🇳", "sample": "ನಾಳೆ ಬೆಳಿಗ್ಗೆ ಸಮುದ್ರಕ್ಕೆ ಮೀನುಗಾರಿಕೆಗೆ ಹೋಗುವುದು ಸುರಕ್ಷಿತವೇ?"},
    "or": {"code": "or", "name": "Odia", "native": "ଓଡ଼ିଆ", "bhashini_code": "or", "voice": "or-IN", "flag": "🇮🇳", "sample": "ଆସନ୍ତାକାଲି ସକାଳେ ସମୁଦ୍ରକୁ ମାଛ ଧରିବାକୁ ଯିବା ନିରାପଦ କି?"},
}

def detect_indic_script(text: str) -> str:
    """Identify language script from Unicode block ranges."""
    for char in text:
        code = ord(char)
        if 0x0C00 <= code <= 0x0C7F:
            return "te"  # Telugu
        if 0x0B80 <= code <= 0x0BFF:
            return "ta"  # Tamil
        if 0x0D00 <= code <= 0x0D7F:
            return "ml"  # Malayalam
        if 0x0C80 <= code <= 0x0CFF:
            return "kn"  # Kannada
        if 0x0B00 <= code <= 0x0B7F:
            return "or"  # Odia
        if 0x0A80 <= code <= 0x0AFF:
            return "gu"  # Gujarati
        if 0x0980 <= code <= 0x09FF:
            return "bn"  # Bengali
        if 0x0900 <= code <= 0x097F:
            return "hi"  # Hindi / Devanagari (could also be Marathi, default Hindi)
    return "en"  # Default to English
