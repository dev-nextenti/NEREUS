import React, { useState } from "react";
import { LayerState } from "../../types";
import { Layers, Mic, MicOff, Volume2, Globe2, ChevronUp, Radio } from "lucide-react";
import { VoiceLanguage } from "../../lib/languages";

interface BottomControlBarProps {
  layers: LayerState;
  onToggleLayer: (layerName: keyof LayerState) => void;
  isListening: boolean;
  isSpeaking: boolean;
  currentLanguage: VoiceLanguage;
  onMicClick: () => void;
  onOpenVoiceModal: () => void;
  onOpenAlerts?: () => void;
  activeAlertCount?: number;
}

export const BottomControlBar: React.FC<BottomControlBarProps> = ({
  layers,
  onToggleLayer,
  isListening,
  isSpeaking,
  currentLanguage,
  onMicClick,
  onOpenVoiceModal,
}) => {
  const [isLayersMenuOpen, setIsLayersMenuOpen] = useState(false);

  const layerButtons: Array<{ key: keyof LayerState; label: string }> = [
    { key: "sst", label: "SST" },
    { key: "chlorophyll", label: "CHL" },
    { key: "pfz", label: "PFZ" },
    { key: "weather", label: "WEATHER" },
    { key: "waves", label: "WAVES" },
    { key: "geofence", label: "GEOFENCE" },
    { key: "routes", label: "SAFE ROUTE" },
  ];

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-3.5 bg-gradient-to-t from-[#010614]/95 via-[#010614]/80 to-transparent pointer-events-auto select-none">
      {/* ─── Left: Integrated Data Layers Trigger ─── */}
      <div className="relative flex items-center gap-3">
        <button
          onClick={() => setIsLayersMenuOpen(!isLayersMenuOpen)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#031329]/90 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950 text-cyan-200 text-xs font-mono tracking-wider transition-all group shadow-cyan-glow"
        >
          <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-[11px] tracking-widest text-slate-200">
            INTEGRATED DATA LAYERS
          </span>
          <ChevronUp
            className={`w-3.5 h-3.5 text-cyan-400 transition-transform ${
              isLayersMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Popout Layers Menu */}
        {isLayersMenuOpen && (
          <div className="absolute bottom-12 left-0 flex items-center gap-1.5 p-2 rounded-2xl bg-[#020d1f]/95 border border-cyan-400/40 backdrop-blur-xl shadow-[0_0_30px_rgba(0,229,255,0.3)] animate-in fade-in slide-in-from-bottom-2 z-50">
            {layerButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => onToggleLayer(btn.key)}
                className={`px-3 py-1 rounded-xl text-[11px] font-mono tracking-wider transition-all ${
                  layers[btn.key]
                    ? "bg-cyan-500/25 border border-cyan-400 text-cyan-200 shadow-cyan-glow"
                    : "text-slate-400 hover:text-slate-200 border border-transparent hover:bg-cyan-950/40"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Center: Futuristic Voice Capsule Cockpit (Matches Exact Reference Image) ─── */}
      <div className="flex items-center justify-center">
        <div className="relative flex items-center">
          {/* Sci-Fi Angular Outer Accent Brackets */}
          <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-3 h-5 border-l-2 border-y-2 border-cyan-400/60 rounded-l pointer-events-none" />
          <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-3 h-5 border-r-2 border-y-2 border-cyan-400/60 rounded-r pointer-events-none" />

          {/* Center Command Pill Capsule */}
          <div
            onClick={onMicClick}
            className={`flex items-center gap-3 px-6 py-2 rounded-full border cursor-pointer transition-all ${
              isListening
                ? "bg-red-950/90 border-red-500 text-red-200 shadow-[0_0_35px_rgba(255,51,85,0.7)] animate-pulse"
                : isSpeaking
                ? "bg-teal-950/90 border-teal-400 text-teal-200 shadow-[0_0_35px_rgba(0,240,181,0.6)] animate-pulse"
                : "bg-[#031530]/90 border-cyan-400/60 text-cyan-200 hover:border-cyan-300 hover:bg-[#06244d] shadow-[0_0_20px_rgba(0,229,255,0.35)]"
            }`}
            title={isListening ? "Listening... Click to stop" : "Click to speak with NEREUS"}
          >
            {/* Live Animated Equalizer Soundwave |||||| */}
            <div className="flex items-center gap-0.5 h-3.5">
              {[4, 12, 16, 8, 14, 18, 10, 6].map((h, idx) => (
                <span
                  key={idx}
                  className={`w-0.5 rounded-full transition-all ${
                    isListening
                      ? "bg-red-400 animate-pulse"
                      : isSpeaking
                      ? "bg-teal-300 animate-pulse"
                      : "bg-cyan-400"
                  }`}
                  style={{
                    height: isListening || isSpeaking ? `${h}px` : `${Math.max(4, h * 0.6)}px`,
                    animationDelay: `${idx * 80}ms`,
                  }}
                />
              ))}
            </div>

            {/* Status Text: Listening... / Speaking... / Standby */}
            <span className="text-xs font-mono tracking-widest font-semibold">
              {isListening
                ? `Listening (${currentLanguage.nativeName})...`
                : isSpeaking
                ? `Speaking (${currentLanguage.nativeName})...`
                : "Listening..."}
            </span>

            {/* Quick In-Built Language Pill inside capsule */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenVoiceModal();
              }}
              className="flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400/40 text-cyan-300 hover:border-cyan-300 text-[10px] font-mono transition-all"
              title="Change In-Built Language"
            >
              <span>{currentLanguage.flag}</span>
              <span className="font-bold">{currentLanguage.nativeName}</span>
              <ChevronUp className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Right: Exact Attribution from Image ─── */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400/75 tracking-wider">
        <span>Powered by ISRO</span>
        <span className="text-cyan-600">|</span>
        <span>Open Data</span>
        <span className="text-cyan-600">|</span>
        <span>AI Agents</span>
      </div>
    </footer>
  );
};
