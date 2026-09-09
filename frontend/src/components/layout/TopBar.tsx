import React from "react";
import { UserMode } from "../../types";
import { Activity, ShieldCheck, Database, Volume2, Mic, Languages } from "lucide-react";
import { VoiceLanguage } from "../../lib/languages";

export type NavTab = "OBSERVE" | "ANALYZE" | "ADVISE" | "PROTECT";

interface TopBarProps {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  onOpenAdmin: () => void;
  isAudioActive?: boolean;
  currentLanguage?: VoiceLanguage;
  onOpenVoiceModal?: () => void;
  activeNavTab?: NavTab;
  onNavTabChange?: (tab: NavTab) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  userMode,
  setUserMode,
  onOpenAdmin,
  isAudioActive,
  currentLanguage,
  onOpenVoiceModal,
  activeNavTab = "OBSERVE",
  onNavTabChange,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-4 bg-gradient-to-b from-[#010614]/95 via-[#010614]/65 to-transparent pointer-events-auto select-none">
      {/* ─── Left: Brand & Identity (Exact Match) ─── */}
      <div className="flex items-center gap-3">
        {/* Trident Glowing Logo */}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-400/40 shadow-cyan-glow">
          <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="topTrident" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="100%" stopColor="#0077ff" />
              </linearGradient>
            </defs>
            <path d="M50 8 L54 28 L52 75 L48 75 L46 28 Z" fill="url(#topTrident)" />
            <polygon points="50,4 56,16 50,22 44,16" fill="#00f0b5" />
            <path d="M46 38 C32 40 24 28 26 14 L30 18 C28 26 34 34 46 32 Z" fill="url(#topTrident)" />
            <path d="M54 38 C68 40 76 28 74 14 L70 18 C72 26 66 34 54 32 Z" fill="url(#topTrident)" />
            <circle cx="50" cy="80" r="4" fill="url(#topTrident)" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-[0.25em] text-cyan-300 font-heading">
            N E R E U S
          </h1>
          <p className="text-[9px] tracking-[0.22em] text-cyan-400/80 uppercase font-mono">
            Ocean Intelligence. Real Impact.
          </p>
        </div>
      </div>

      {/* ─── Center: Nav Modes (OBSERVE / ANALYZE / ADVISE / PROTECT) ─── */}
      <nav className="flex items-center gap-5 px-6 py-1.5 rounded-full bg-[#03142e]/80 border border-cyan-500/30 backdrop-blur-md shadow-cyan-glow">
        {(["OBSERVE", "ANALYZE", "ADVISE", "PROTECT"] as NavTab[]).map((tab, idx) => {
          const isActive = activeNavTab === tab;
          return (
            <React.Fragment key={tab}>
              <button
                onClick={() => onNavTabChange?.(tab)}
                className={`text-xs font-semibold tracking-widest font-heading transition-all ${
                  isActive
                    ? "text-cyan-200 border-b-2 border-cyan-400 pb-0.5 drop-shadow-[0_0_8px_#00e5ff]"
                    : "text-slate-400 hover:text-cyan-300"
                }`}
              >
                {tab}
              </button>
              {idx < 3 && <span className="text-cyan-800 text-xs">/</span>}
            </React.Fragment>
          );
        })}
      </nav>

      {/* ─── Right: Telemetry & Status Indicators (Exact Match) ─── */}
      <div className="flex items-center gap-4">
        {/* Online Status Badge with Green Dot */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#021815]/90 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00ff99] animate-pulse" />
          <span className="font-semibold">Online</span>
        </div>

        {/* Audio Waveform Graphic Capsule */}
        <div
          onClick={onOpenVoiceModal}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#031530]/80 border border-cyan-500/30 cursor-pointer hover:border-cyan-300 transition-all"
          title="Voice Activity Status"
        >
          <Volume2 className={`w-3.5 h-3.5 ${isAudioActive ? "text-cyan-300 animate-pulse" : "text-cyan-500"}`} />
          <div className="flex items-center gap-0.5 h-3">
            {[4, 8, 12, 6, 14, 8, 4].map((h, i) => (
              <span
                key={i}
                className={`w-0.5 rounded-full transition-all ${
                  isAudioActive ? "bg-cyan-400 animate-pulse" : "bg-cyan-700/60"
                }`}
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        </div>

        {/* Real-time Clock & Coordinates */}
        <div className="text-right font-mono text-xs text-slate-300 leading-tight">
          <div className="text-slate-200 font-semibold">Sep 8, 2025 20:42</div>
          <div className="text-[10px] text-cyan-400 tracking-wide">12.9716° N 77.5946° E</div>
        </div>
      </div>
    </header>
  );
};
