import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  X,
  Radio,
  Sparkles,
  Send,
  RotateCcw,
  Check,
  ChevronRight,
  Shield,
  Compass,
  Waves,
  Zap,
} from "lucide-react";
import { BUILTIN_LANGUAGES, VoiceLanguage, getLanguageByCode } from "../../lib/languages";

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: VoiceLanguage;
  onSelectLanguage: (lang: VoiceLanguage) => void;
  isListening: boolean;
  isSpeaking: boolean;
  onToggleMic: () => void;
  lastTranscript?: string;
  lastResponse?: string;
  onSendQuery: (query: string, langCode?: string) => void;
  onSpeakText: (text: string, langCode?: string) => void;
  onStopSpeaking: () => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
  isListening,
  isSpeaking,
  onToggleMic,
  lastTranscript,
  lastResponse,
  onSendQuery,
  onSpeakText,
  onStopSpeaking,
  autoSpeak,
  onToggleAutoSpeak,
}) => {
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [customPrompt, setCustomPrompt] = useState<string>("");

  if (!isOpen) return null;

  const handlePromptClick = (prompt: string) => {
    onSendQuery(prompt, currentLanguage.code);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    onSendQuery(customPrompt.trim(), currentLanguage.code);
    setCustomPrompt("");
  };

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#020b18]/95 border border-cyan-400/40 shadow-[0_0_80px_rgba(0,229,255,0.25)] overflow-hidden">
        {/* Holographic Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-cyan-500/30 bg-cyan-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <Mic className="w-4 h-4 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-cyan-200 font-heading tracking-widest uppercase">
                  NEREUS MULTILINGUAL VOICE ASSISTANT
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  {currentLanguage.flag} {currentLanguage.nativeName} ({currentLanguage.name})
                </span>
              </div>
              <p className="text-[10px] font-mono text-cyan-400/70">
                Marine Intelligence & Safety Voice Agent • In-Built Indian Coastal Languages
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-300 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Split into Left (Language Deck) and Right (Voice Visualizer & Interaction) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-cyan-500/20">
          {/* LEFT: In-Built Languages Selection (5 cols) */}
          <div className="md:col-span-5 p-4 flex flex-col bg-black/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 tracking-wider">
                <Languages className="w-4 h-4 text-cyan-400" />
                <span>SELECT IN-BUILT LANGUAGE</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                10 Indian Languages
              </span>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[420px] pr-1 scrollbar-thin">
              {BUILTIN_LANGUAGES.map((lang) => {
                const isSelected = currentLanguage.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => onSelectLanguage(lang)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-cyan-950/80 border-cyan-400 text-cyan-100 shadow-[0_0_20px_rgba(0,229,255,0.25)]"
                        : "bg-[#041428]/50 border-cyan-500/20 text-slate-300 hover:bg-[#061e3d]/70 hover:border-cyan-400/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{lang.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono tracking-wide text-cyan-200">
                            {lang.nativeName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            • {lang.name}
                          </span>
                        </div>
                        <div className="text-[10px] text-cyan-400/60 font-mono line-clamp-1">
                          {lang.region}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-cyan-300 border border-cyan-500/20">
                        {lang.speechLang}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center text-black">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Language Territory Advisory */}
            <div className="mt-auto pt-3 border-t border-cyan-500/20 text-[10px] font-mono text-cyan-400/70 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
              <span>
                Active Coast:{" "}
                <strong className="text-cyan-200">{currentLanguage.region}</strong>
              </span>
            </div>
          </div>

          {/* RIGHT: Voice Visualizer, Hologram & Response Deck (7 cols) */}
          <div className="md:col-span-7 p-5 flex flex-col justify-between space-y-4 bg-gradient-to-b from-[#020b18] to-[#010814]">
            {/* Holographic Voice Visualizer Orb */}
            <div className="relative flex flex-col items-center justify-center py-6">
              {/* Concentric Pulse Rings */}
              <div
                className={`absolute w-36 h-36 rounded-full border border-cyan-400/20 transition-all duration-700 ${
                  isListening
                    ? "scale-125 border-red-500/40 animate-ping"
                    : isSpeaking
                    ? "scale-110 border-teal-400/40 animate-pulse"
                    : "scale-100"
                }`}
              />
              <div
                className={`absolute w-28 h-28 rounded-full border border-cyan-400/30 transition-all duration-500 ${
                  isListening
                    ? "border-red-500/60"
                    : isSpeaking
                    ? "border-teal-300/60"
                    : ""
                }`}
              />

              {/* Central Mic Interactive Orb */}
              <button
                onClick={onToggleMic}
                title={isListening ? "Stop Listening" : "Click to Speak"}
                className={`relative z-10 flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 transition-all cursor-pointer ${
                  isListening
                    ? "bg-red-950 border-red-400 text-red-300 shadow-[0_0_35px_rgba(255,51,85,0.6)] scale-105"
                    : isSpeaking
                    ? "bg-teal-950 border-teal-300 text-teal-200 shadow-[0_0_35px_rgba(0,240,181,0.5)] animate-pulse"
                    : "bg-[#041d3d] border-cyan-400 text-cyan-200 shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:scale-105 hover:bg-cyan-900/60"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>

              {/* Status Readout */}
              <div className="mt-3 text-center">
                <div className="text-xs font-bold font-mono tracking-widest uppercase text-cyan-200">
                  {isListening
                    ? `LISTENING IN ${currentLanguage.name.toUpperCase()}...`
                    : isSpeaking
                    ? `SPEAKING IN ${currentLanguage.nativeName.toUpperCase()}...`
                    : `TAP MIC TO SPEAK IN ${currentLanguage.nativeName}`}
                </div>
                <div className="text-[10px] font-mono text-cyan-400/60">
                  Speech Tag: {currentLanguage.speechLang} • High-Res AI Engine
                </div>
              </div>

              {/* Live Audio Equalizer Waveform */}
              <div className="flex items-center gap-1 mt-3 h-5">
                {[12, 24, 38, 18, 44, 28, 50, 32, 20, 42, 16, 30, 48, 22, 14].map(
                  (h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full transition-all ${
                        isListening
                          ? "bg-red-400 animate-pulse"
                          : isSpeaking
                          ? "bg-teal-300 animate-pulse"
                          : "bg-cyan-500/40"
                      }`}
                      style={{
                        height: isListening || isSpeaking ? `${h}px` : "4px",
                        animationDelay: `${i * 60}ms`,
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Spoken Response & Transcript Feedback Card */}
            {(lastTranscript || lastResponse) && (
              <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-500/30 space-y-2">
                {lastTranscript && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>YOU SPOKE ({currentLanguage.nativeName}):</span>
                    </div>
                    <div className="text-xs font-mono text-cyan-100 bg-cyan-950/40 p-2 rounded-lg border border-cyan-500/20">
                      "{lastTranscript}"
                    </div>
                  </div>
                )}

                {lastResponse && (
                  <div className="space-y-1 pt-1 border-t border-cyan-500/10">
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300">
                      <span>NEREUS ADVISORY ({currentLanguage.nativeName}):</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSpeakText(lastResponse, currentLanguage.code)}
                          className="flex items-center gap-1 text-[10px] font-mono text-cyan-300 hover:text-white"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Listen</span>
                        </button>
                        {isSpeaking && (
                          <button
                            onClick={onStopSpeaking}
                            className="flex items-center gap-1 text-[10px] font-mono text-red-400 hover:text-red-200"
                          >
                            <VolumeX className="w-3 h-3" />
                            <span>Stop</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-sans text-teal-200 leading-relaxed bg-[#021528]/80 p-2.5 rounded-lg border border-teal-500/30">
                      {lastResponse}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sample Native Voice Queries for this Language */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  PRESET VOICE QUERIES IN {currentLanguage.nativeName} ({currentLanguage.name}):
                </span>
                <span className="text-cyan-400/60">Click to ask</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {currentLanguage.sampleQueries.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(query)}
                    className="flex items-start gap-2 p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-900/40 text-left transition-all group"
                  >
                    <Radio className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0 group-hover:scale-110" />
                    <span className="text-[11px] font-mono text-slate-200 group-hover:text-cyan-100 line-clamp-2">
                      {query}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Text Input for Selected Language */}
            <form onSubmit={handleCustomSubmit} className="flex gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={`Ask in ${currentLanguage.name} or type in ${currentLanguage.nativeName}...`}
                className="flex-1 bg-black/40 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs font-mono text-cyan-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-bold font-mono text-xs hover:from-cyan-400 hover:to-teal-300 transition-all flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>Ask</span>
              </button>
            </form>

            {/* Voice Audio Settings Footnote */}
            <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20 text-[10px] font-mono text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSpeak}
                  onChange={onToggleAutoSpeak}
                  className="rounded border-cyan-500/40 bg-black accent-cyan-400 cursor-pointer"
                />
                <span className="text-cyan-300">Auto-read responses aloud</span>
              </label>

              <div className="flex items-center gap-2">
                <span>Speech Engine:</span>
                <span className="text-cyan-200">WebSpeech + Bhashini</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
