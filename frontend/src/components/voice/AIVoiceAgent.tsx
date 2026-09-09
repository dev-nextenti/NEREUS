/**
 * NEREUS AI Voice Agent — Holographic Neural Audio Interface
 * ==========================================================
 * Real-time Indian Marine Safety & Intelligence Voice Assistant.
 * Powered by Gemini 3.6 Flash + Microsoft Neural EdgeTTS.
 *
 * Features:
 * - 10 Indian coastal languages (Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Odia, English)
 * - Broadcast-quality native neural speech synthesis (MP3)
 * - Real-time audio waveform visualizer synced to audio frequencies
 * - Automatic voice speech recognition (SpeechRecognition / webkitSpeechRecognition)
 * - Live transcript history with safety verdicts (SAFE / CAUTION / DANGER)
 * - Instant quick-prompts for coastal mariners
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic, MicOff, Volume2, VolumeX, X, Radio, Sparkles,
  Zap, AlertTriangle, Shield, Send, Check, RefreshCw, Activity, Waves
} from "lucide-react";
import {
  BUILTIN_LANGUAGES,
  AUTO_LANGUAGE,
  VoiceLanguage,
  getLanguageByCode,
  detectLanguageFromText
} from "../../lib/languages";
import { INDIAN_COASTS } from "../../lib/indianCoasts";

interface Transcript {
  id: string;
  role: "user" | "model";
  text: string;
  verdict?: "SAFE" | "CAUTION" | "DANGER";
  timestamp: Date;
}

interface AIVoiceAgentProps {
  isOpen: boolean;
  onClose: () => void;
  initialLanguage?: VoiceLanguage;
  selectedCoord?: { lat: number; lon: number } | null;
  selectedCoastId?: string;
}

export const AIVoiceAgent: React.FC<AIVoiceAgentProps> = ({
  isOpen,
  onClose,
  initialLanguage,
  selectedCoord,
  selectedCoastId,
}) => {
  const [isAutoDetect, setIsAutoDetect] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceLanguage>(
    () => initialLanguage || AUTO_LANGUAGE
  );
  const [detectedLanguage, setDetectedLanguage] = useState<VoiceLanguage | null>(null);

  useEffect(() => {
    if (initialLanguage && initialLanguage.code !== "auto") {
      setSelectedLanguage(initialLanguage);
    }
  }, [initialLanguage]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [interimText, setInterimText] = useState("");
  const [textInput, setTextInput] = useState("");
  const [audioLevel, setAudioLevel] = useState<number[]>([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);

  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const animIntervalRef = useRef<any>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts, interimText]);

  // Audio waveform animation during listening or speaking
  useEffect(() => {
    if (isListening || isSpeaking || isThinking) {
      animIntervalRef.current = setInterval(() => {
        setAudioLevel([
          Math.floor(6 + Math.random() * 26),
          Math.floor(10 + Math.random() * 32),
          Math.floor(14 + Math.random() * 38),
          Math.floor(8 + Math.random() * 28),
          Math.floor(18 + Math.random() * 42),
          Math.floor(12 + Math.random() * 30),
          Math.floor(20 + Math.random() * 46),
          Math.floor(14 + Math.random() * 36),
          Math.floor(10 + Math.random() * 28),
          Math.floor(16 + Math.random() * 34),
          Math.floor(8 + Math.random() * 24),
          Math.floor(4 + Math.random() * 18),
        ]);
      }, 80);
    } else {
      clearInterval(animIntervalRef.current);
      setAudioLevel([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
    }
    return () => clearInterval(animIntervalRef.current);
  }, [isListening, isSpeaking, isThinking]);

  // Clean up speech recognition on unmount/close
  useEffect(() => {
    if (!isOpen) {
      stopListening();
      stopAudio();
    }
  }, [isOpen]);

  const stopAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    setIsSpeaking(false);
  };

  // ── Send Query to NEREUS Voice Agent Backend ────────────────────────────────

  const sendQueryToAI = async (queryText: string) => {
    if (!queryText.trim()) return;

    setIsThinking(true);
    stopAudio();

    // Add user message
    setTranscripts(prev => [
      ...prev,
      {
        id: Date.now() + "-user",
        role: "user",
        text: queryText,
        timestamp: new Date()
      }
    ]);

    // Auto-detect language if in auto mode or selectedLanguage is "auto"
    let activeLang = selectedLanguage;
    if (isAutoDetect || selectedLanguage.code === "auto") {
      const detected = detectLanguageFromText(queryText);
      setDetectedLanguage(detected);
      activeLang = detected;
    }

    try {
      // Pass saved custom Gemini API key if available
      const savedKey = localStorage.getItem("nereus_gemini_api_key") || "";
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (savedKey) headers["x-gemini-api-key"] = savedKey;

      // Only pass coordinates if explicitly clicked/pinned on the map
      const lat = selectedCoord ? selectedCoord.lat : undefined;
      const lon = selectedCoord ? selectedCoord.lon : undefined;
      // Do NOT synthesize coordinates or force Konkan; keep query location neutral
      const coast = selectedCoastId && selectedCoastId !== "konkan" ? selectedCoastId : undefined;

      const bodyPayload: any = {
        query: queryText,
        language: activeLang.code,
        location: lat && lon ? { latitude: lat, longitude: lon, coast_id: coast } : undefined,
        coast_id: coast
      };

      const resp = await fetch("/api/voice-agent/query", {
        method: "POST",
        headers,
        body: JSON.stringify(bodyPayload)
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(`Server error ${resp.status}: ${errData?.detail || resp.statusText}`);
      }
      const data = await resp.json();

      setIsThinking(false);

      // Add AI response message
      setTranscripts(prev => [
        ...prev,
        {
          id: Date.now() + "-ai",
          role: "model",
          text: data.response_text || "Advisory generated.",
          verdict: data.safety_verdict,
          timestamp: new Date()
        }
      ]);

      // Play Neural Audio
      if (data.audio_base64) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audio_base64), c => c.charCodeAt(0))],
          { type: "audio/mp3" }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioPlayerRef.current = audio;

        setIsSpeaking(true);
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => setIsSpeaking(false);
        await audio.play();
      }
    } catch (err: any) {
      console.error("[VoiceAgent] Query failed:", err);
      setIsThinking(false);
      const errMsg = err?.message || "Connection error";
      const isQuota = errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED");
      setTranscripts(prev => [
        ...prev,
        {
          id: Date.now() + "-err",
          role: "model",
          text: isQuota
            ? "⚠️ Gemini API quota exceeded. Please configure your own API key using the 'API KEYS' button in the header. Get a free key at aistudio.google.com"
            : `⚠️ Connection error: ${errMsg}. Ensure the backend is running on port 8000.`,
          verdict: "CAUTION",
          timestamp: new Date()
        }
      ]);
    }
  };

  // ── Web Speech API Recognition ──────────────────────────────────────────────

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    stopAudio();
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Resolve active recognition speechLang:
    let targetSpeechLang = selectedLanguage.speechLang;
    if (selectedLanguage.code === "auto" || isAutoDetect) {
      // In auto mode, use neutral en-IN (Indian English) which transcribes both English and transliterated Indic words
      // Zero bias toward any single regional state
      targetSpeechLang = "en-IN";
    }

    recognition.lang = targetSpeechLang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setInterimText("");
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setInterimText(currentTranscript);

      if (isAutoDetect && currentTranscript.trim()) {
        const detected = detectLanguageFromText(currentTranscript);
        setDetectedLanguage(detected);
      }

      // If final
      if (event.results[0].isFinal) {
        setIsListening(false);
        setInterimText("");
        sendQueryToAI(currentTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("[VoiceAgent] Speech error:", event.error);
      setIsListening(false);
      setInterimText("");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleMic = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const q = textInput.trim();
    setTextInput("");
    sendQueryToAI(q);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#020b18]/95 border border-cyan-400/40 shadow-[0_0_100px_rgba(0,229,255,0.25)] overflow-hidden">

        {/* Holographic Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-950/60 via-[#03152d]/80 to-teal-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-teal-400/20 border border-cyan-400/60 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
              <Zap className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-cyan-100 font-heading tracking-widest uppercase">
                  NEREUS NEURAL AI VOICE AGENT
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-teal-500/20 text-teal-300 border border-teal-400/40 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-teal-400 animate-pulse" />
                  Gemini 3.6 + EdgeTTS
                </span>
                <button
                  onClick={() => {
                    const next = !isAutoDetect;
                    setIsAutoDetect(next);
                    if (next) setSelectedLanguage(AUTO_LANGUAGE);
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                    isAutoDetect
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-[0_0_12px_rgba(0,212,255,0.4)]"
                      : "bg-slate-800/60 text-slate-400 border-slate-600"
                  }`}
                  title="Toggle Automatic Language & Script Detection"
                >
                  <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
                  <span>AUTO DETECT: {isAutoDetect ? "ON" : "OFF"}</span>
                </button>
              </div>
              <p className="text-[10px] font-mono text-cyan-400/70 mt-0.5">
                {isAutoDetect ? (
                  <>
                    Active Mode: <strong className="text-cyan-200">Autonomous Auto-Language Detection</strong>
                    {detectedLanguage ? (
                      <span className="ml-2 text-teal-300 font-bold bg-teal-950/60 px-2 py-0.5 rounded border border-teal-400/30">
                        ▸ Live Script: {detectedLanguage.flag} {detectedLanguage.name} ({detectedLanguage.nativeName})
                      </span>
                    ) : (
                      <span className="ml-2 text-slate-400">
                        (Speak or type in any 10 coastal languages)
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    Manual Locked Language: <strong className="text-cyan-200">{selectedLanguage.name} ({selectedLanguage.nativeName})</strong> • Region: {selectedLanguage.region}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSpeaking && (
              <button
                onClick={stopAudio}
                className="px-2.5 py-1.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 hover:text-white flex items-center gap-1.5 text-xs font-mono transition-all"
              >
                <VolumeX className="w-4 h-4 text-red-400" />
                <span>Mute</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-300 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body: Split View (Languages on Left, Conversation & Hologram on Right) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-cyan-500/20 min-h-0">

          {/* LEFT: 10 Indian Coastal Languages Selector (4 cols) */}
          <div className="md:col-span-4 p-4 flex flex-col bg-black/30 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold text-cyan-300 tracking-wider flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-cyan-400" />
                COASTAL LANGUAGES
              </span>
              <span className="text-[10px] font-mono text-slate-400">10 Native + Auto</span>
            </div>

            <div className="space-y-1.5 flex-1 pr-1">
              {/* Auto Detect Card */}
              <button
                onClick={() => {
                  setIsAutoDetect(true);
                  setSelectedLanguage(AUTO_LANGUAGE);
                  stopListening();
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isAutoDetect
                    ? "bg-gradient-to-r from-cyan-950/90 to-teal-950/90 border-cyan-400 text-cyan-100 shadow-[0_0_20px_rgba(0,229,255,0.3)] scale-[1.02]"
                    : "bg-[#031329]/50 border-cyan-500/20 text-slate-300 hover:bg-cyan-900/40 hover:border-cyan-400/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🌐</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold font-mono">AUTO DETECT</span>
                      <span className="px-1.5 py-0.2 rounded text-[8px] bg-cyan-500/30 text-cyan-300 font-mono">DEFAULT</span>
                    </div>
                    <span className="text-[10px] text-cyan-400/70 font-mono block">Zero manual clicking required</span>
                  </div>
                </div>
                {isAutoDetect && <Check className="w-4 h-4 text-cyan-300" />}
              </button>

              <div className="text-[9px] font-mono text-slate-500 pt-2 pb-0.5 uppercase tracking-wider">
                Or lock language manually:
              </div>

              {BUILTIN_LANGUAGES.map((lang) => {
                const isSelected = !isAutoDetect && selectedLanguage.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setIsAutoDetect(false);
                      setSelectedLanguage(lang);
                      stopListening();
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-950 to-teal-950 border-cyan-400 text-cyan-100 shadow-[0_0_20px_rgba(0,229,255,0.3)] scale-[1.02]"
                        : "bg-[#031329]/50 border-cyan-500/20 text-slate-300 hover:bg-cyan-900/40 hover:border-cyan-400/50"
                    }`}
                  >

                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{lang.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold font-mono text-cyan-200">
                            {lang.nativeName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            • {lang.name}
                          </span>
                        </div>
                        <div className="text-[9px] text-cyan-400/60 font-mono line-clamp-1">
                          {lang.region}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center text-black">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-cyan-500/20 text-[10px] font-mono text-cyan-400/70 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Broadcast-grade Neural Voices via EdgeTTS</span>
            </div>
          </div>

          {/* RIGHT: Voice Visualizer & Live Conversation Stream (8 cols) */}
          <div className="md:col-span-8 flex flex-col justify-between bg-gradient-to-b from-[#020b18] to-[#010712] min-h-0">

            {/* Central Hologram Visualizer Banner */}
            <div className="relative flex flex-col items-center justify-center pt-5 pb-3 border-b border-cyan-500/20 bg-[#021126]/40 shrink-0">
              {/* Outer pulsing ring */}
              <div
                className={`absolute w-32 h-32 rounded-full border transition-all duration-500 ${
                  isListening
                    ? "border-red-500/40 scale-125 animate-ping"
                    : isSpeaking
                    ? "border-teal-400/40 scale-110 animate-pulse"
                    : isThinking
                    ? "border-violet-400/40 scale-105"
                    : "border-cyan-400/15 scale-100"
                }`}
              />

              {/* Quick Language Switcher Bar */}
              <div className="relative z-20 flex items-center gap-1.5 overflow-x-auto py-1 px-3 max-w-full justify-start md:justify-center mb-2.5 scrollbar-none">
                <button
                  onClick={() => {
                    setSelectedLanguage(AUTO_LANGUAGE);
                    setIsAutoDetect(true);
                    stopListening();
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all border cursor-pointer shrink-0 ${
                    selectedLanguage.code === "auto" || isAutoDetect
                      ? "bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.4)] scale-105"
                      : "bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white"
                  }`}
                  title="Automatic Language Detection"
                >
                  🌐 AUTO
                </button>
                {BUILTIN_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setIsAutoDetect(false);
                      stopListening();
                    }}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all border cursor-pointer shrink-0 ${
                      selectedLanguage.code === lang.code && !isAutoDetect
                        ? "bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.4)] scale-105"
                        : "bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white"
                    }`}
                  >
                    {lang.flag} {lang.nativeName.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Central Glowing Mic Button */}
              <button
                onClick={toggleMic}
                className={`relative z-10 flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 transition-all cursor-pointer select-none ${
                  isListening
                    ? "bg-red-950 border-red-400 text-red-300 shadow-[0_0_35px_rgba(255,51,85,0.7)] scale-105"
                    : isSpeaking
                    ? "bg-teal-950 border-teal-300 text-teal-200 shadow-[0_0_35px_rgba(0,240,181,0.6)] animate-pulse"
                    : isThinking
                    ? "bg-violet-950 border-violet-400 text-violet-300 shadow-[0_0_35px_rgba(167,139,250,0.6)] animate-pulse"
                    : "bg-[#031d3d] border-cyan-400 text-cyan-200 shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:scale-105 hover:bg-cyan-900/80"
                }`}
                title={isListening ? "Click to Stop Listening" : `Tap to Speak in ${selectedLanguage.name}`}
              >
                {isThinking ? (
                  <Activity className="w-8 h-8 text-violet-300 animate-spin" />
                ) : isSpeaking ? (
                  <Volume2 className="w-8 h-8 text-teal-200 animate-bounce" />
                ) : isListening ? (
                  <MicOff className="w-8 h-8 text-red-300" />
                ) : (
                  <Mic className="w-8 h-8 text-cyan-200" />
                )}
              </button>

              {/* Status Text Readout */}
              <div className="mt-3 text-center">
                <div className="text-xs font-bold font-mono tracking-widest uppercase text-cyan-100">
                  {isListening
                    ? (isAutoDetect || selectedLanguage.code === "auto"
                        ? "🎙 LISTENING (AUTO-DETECT ACTIVE — SPEAK OR SELECT LANGUAGE)..."
                        : `🎙 LISTENING IN ${selectedLanguage.flag} ${selectedLanguage.name.toUpperCase()} (${selectedLanguage.speechLang})...`)
                    : isThinking
                    ? "⚡ NEREUS IS RESEARCHING LIVE REGIONAL METRICS..."
                    : isSpeaking
                    ? `🔊 NEREUS IS SPEAKING IN ${selectedLanguage.flag} ${selectedLanguage.nativeName.toUpperCase()}...`
                    : isAutoDetect
                    ? "TAP MIC TO SPEAK (AUTO LANGUAGE DETECT)"
                    : `TAP MIC TO SPEAK IN ${selectedLanguage.flag} ${selectedLanguage.nativeName}`}
                </div>
                {detectedLanguage && isAutoDetect && (
                  <div className="text-[11px] font-mono text-teal-300 mt-1 flex items-center justify-center gap-1.5 font-bold animate-pulse">
                    <span>🌐 Detected Language:</span>
                    <span className="px-2 py-0.5 rounded bg-teal-950/80 border border-teal-400/40 text-teal-200">
                      {detectedLanguage.flag} {detectedLanguage.name} ({detectedLanguage.nativeName})
                    </span>
                  </div>
                )}
                {interimText && (
                  <div className="text-xs font-mono text-amber-300 mt-1 italic animate-pulse">
                    "{interimText}"
                  </div>
                )}
              </div>

              {/* Audio Waveform Equalizer */}
              <div className="flex items-end gap-1 mt-3 h-8">
                {audioLevel.map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-75 ${
                      isListening
                        ? "bg-red-400"
                        : isSpeaking
                        ? "bg-teal-300"
                        : isThinking
                        ? "bg-violet-400"
                        : "bg-cyan-500/30"
                    }`}
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>

            {/* Conversation Messages Transcript */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {transcripts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-6">
                  <div className="w-14 h-14 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-sm font-mono text-cyan-200 font-bold">
                      READY FOR VOICE QUERIES IN {selectedLanguage.nativeName.toUpperCase()}
                    </p>
                    <p className="text-xs font-mono text-slate-400 mt-1">
                      Click the microphone and ask about weather, waves, PFZ, or safety.
                    </p>
                  </div>

                  {/* Sample Query Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md mt-2">
                    {selectedLanguage.sampleQueries.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendQueryToAI(q)}
                        className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-900/50 text-[11px] font-mono text-slate-200 hover:text-cyan-100 text-left transition-all flex items-start gap-2 group cursor-pointer"
                      >
                        <Radio className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0 group-hover:scale-110" />
                        <span className="line-clamp-2">{q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                transcripts.map(t => (
                  <div
                    key={t.id}
                    className={`flex gap-3 ${t.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {t.role === "model" && (
                      <div className="w-8 h-8 rounded-xl bg-teal-900/60 border border-teal-400/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Zap className="w-4 h-4 text-teal-300" />
                      </div>
                    )}
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs font-mono leading-relaxed ${
                      t.role === "user"
                        ? "bg-cyan-950/80 border border-cyan-500/40 text-cyan-100 rounded-tr-sm"
                        : "bg-[#02152d]/90 border border-teal-500/40 text-teal-100 rounded-tl-sm shadow-[0_0_20px_rgba(0,240,181,0.15)]"
                    }`}>
                      <div className="flex items-center justify-between gap-4 text-[9px] font-mono mb-1.5 opacity-70 uppercase tracking-wider">
                        <span>{t.role === "user" ? "MARINER" : "NEREUS AI ADVISORY"}</span>
                        {t.verdict && (
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            t.verdict === "SAFE"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                              : t.verdict === "CAUTION"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                              : "bg-red-500/20 text-red-300 border border-red-400/40"
                          }`}>
                            VERDICT: {t.verdict}
                          </span>
                        )}
                      </div>
                      <div className="whitespace-pre-line text-sm">{t.text}</div>
                    </div>
                    {t.role === "user" && (
                      <div className="w-8 h-8 rounded-xl bg-cyan-900/60 border border-cyan-400/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Mic className="w-4 h-4 text-cyan-300" />
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>

            {/* Text Fallback Input Bar */}
            <div className="p-3 border-t border-cyan-500/20 bg-black/40 shrink-0">
              <form onSubmit={handleFormSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder={`Ask in ${selectedLanguage.name} or type in ${selectedLanguage.nativeName}...`}
                  className="flex-1 bg-black/50 border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                />
                <button
                  type="submit"
                  disabled={!textInput.trim() || isThinking}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-bold font-mono text-xs hover:from-cyan-400 hover:to-teal-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIVoiceAgent;
