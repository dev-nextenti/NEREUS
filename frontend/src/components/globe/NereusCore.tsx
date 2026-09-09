import React from "react";
import { AICoreState } from "../../types";
import { Satellite, Waves, CloudSun, Fish } from "lucide-react";

interface NereusCoreProps {
  state: AICoreState;
  onCalloutClick?: (type: string) => void;
}

export const NereusCore: React.FC<NereusCoreProps> = ({ state, onCalloutClick }) => {
  const isWarning = state === "WARNING";
  const isListening = state === "LISTENING";
  const isProcessing = state === "PROCESSING" || state === "ANALYZING";
  const isResponding = state === "RESPONDING";

  // Dynamic status color
  const coreBorderColor = isWarning
    ? "border-red-500 shadow-danger-glow"
    : isListening
    ? "border-cyan-300 shadow-cyan-intense"
    : isProcessing
    ? "border-amber-400 shadow-[0_0_30px_rgba(255,170,0,0.5)]"
    : "border-cyan-500/60 shadow-cyan-glow";

  const glowColor = isWarning ? "#ff3355" : isProcessing ? "#ffaa00" : "#00e5ff";

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* Central Holographic NEREUS AI Core */}
      <div className="relative flex items-center justify-center">
        {/* Outer Rotating Energy Ring 1 */}
        <div
          className={`absolute w-72 h-72 rounded-full border border-dashed ${
            isWarning ? "border-red-500/40" : "border-cyan-400/30"
          } ${isProcessing ? "animate-spin" : "animate-spin-slow"}`}
          style={{ animationDuration: isProcessing ? "6s" : "24s" }}
        />

        {/* Counter-Rotating Ring 2 with Radar Tick Marks */}
        <div
          className={`absolute w-60 h-60 rounded-full border border-dotted ${
            isWarning ? "border-red-400/50" : "border-teal-400/40"
          } animate-spin-reverse-slow`}
          style={{ animationDuration: isProcessing ? "8s" : "30s" }}
        />

        {/* Pulsing Energy Spherical Core */}
        <div
          className={`relative w-44 h-44 rounded-full flex flex-col items-center justify-center backdrop-blur-md bg-[#020b1c]/70 border-2 ${coreBorderColor} transition-all duration-500`}
        >
          {/* Internal Holographic Wave Grid */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.18)_0%,transparent_70%)] animate-pulse" />

          {/* Trident Crest Logo */}
          <div className="relative z-10 flex flex-col items-center">
            <svg
              className="w-14 h-14 transition-transform duration-300 transform hover:scale-110"
              viewBox="0 0 100 100"
              fill="none"
              style={{ filter: `drop-shadow(0 0 12px ${glowColor})` }}
            >
              <defs>
                <linearGradient id="coreTridentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={glowColor} />
                  <stop offset="100%" stopColor="#0077ff" />
                </linearGradient>
              </defs>
              <path d="M50 8 L54 28 L52 75 L48 75 L46 28 Z" fill="url(#coreTridentGrad)" />
              <polygon points="50,4 56,16 50,22 44,16" fill="#00f0b5" />
              <path d="M46 38 C32 40 24 28 26 14 L30 18 C28 26 34 34 46 32 Z" fill="url(#coreTridentGrad)" />
              <polygon points="26,12 30,22 25,20 22,18" fill="#00f0b5" />
              <path d="M54 38 C68 40 76 28 74 14 L70 18 C72 26 66 34 54 32 Z" fill="url(#coreTridentGrad)" />
              <polygon points="74,12 78,18 75,20 70,22" fill="#00f0b5" />
              <circle cx="50" cy="80" r="4" fill="url(#coreTridentGrad)" />
              <path d="M50 84 L53 96 L47 96 Z" fill="url(#coreTridentGrad)" />
            </svg>

            {/* Core Label */}
            <div className="text-center mt-1">
              <span className="text-xs font-bold tracking-[0.25em] text-cyan-200 block font-heading">
                NEREUS
              </span>
              <span className="text-[9px] tracking-[0.18em] text-cyan-400/80 font-mono">
                {isListening ? "LISTENING..." : isProcessing ? "ANALYZING..." : isWarning ? "ALERT ACTIVE" : "AI CORE"}
              </span>
            </div>
          </div>

          {/* Concentric Base Pedestal Rings */}
          <div className="absolute -bottom-6 w-52 h-4 border border-cyan-400/30 rounded-full bg-cyan-950/40 shadow-[0_4px_20px_rgba(0,229,255,0.2)]" />
          <div className="absolute -bottom-9 w-64 h-5 border border-cyan-500/20 rounded-full bg-cyan-950/20" />
        </div>

        {/* Interactive Holographic Callout Badges with Connecting Lines */}
        {/* TOP LEFT: SATELLITE DATA */}
        <div
          onClick={() => onCalloutClick?.("sst")}
          className="absolute -top-36 -left-64 pointer-events-auto cursor-pointer group flex items-center gap-3 transition-transform hover:scale-105"
        >
          <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-cyan-glow group-hover:border-cyan-300">
            <Satellite className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-wider text-cyan-300 font-heading">
              SATELLITE DATA
            </div>
            <div className="text-[9px] text-cyan-400/70 font-mono">SST / CHL / OCEAN COLOR</div>
          </div>
          {/* Subtle connecting HUD line */}
          <div className="absolute top-1/2 left-full w-24 h-px bg-gradient-to-r from-cyan-400/50 to-transparent pointer-events-none transform translate-y-4 rotate-12" />
        </div>

        {/* TOP RIGHT: OCEAN CONDITIONS */}
        <div
          onClick={() => onCalloutClick?.("ocean")}
          className="absolute -top-36 -right-64 pointer-events-auto cursor-pointer group flex items-center gap-3 transition-transform hover:scale-105"
        >
          {/* Subtle connecting HUD line */}
          <div className="absolute top-1/2 right-full w-24 h-px bg-gradient-to-l from-cyan-400/50 to-transparent pointer-events-none transform translate-y-4 -rotate-12" />
          <div className="text-right">
            <div className="text-[11px] font-bold tracking-wider text-cyan-300 font-heading">
              OCEAN CONDITIONS
            </div>
            <div className="text-[9px] text-cyan-400/70 font-mono">TIDE / CURRENT / WAVES</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-cyan-glow group-hover:border-cyan-300">
            <Waves className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* BOTTOM LEFT: WEATHER FORECAST */}
        <div
          onClick={() => onCalloutClick?.("weather")}
          className="absolute top-16 -left-72 pointer-events-auto cursor-pointer group flex items-center gap-3 transition-transform hover:scale-105"
        >
          <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-cyan-glow group-hover:border-cyan-300">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-wider text-cyan-300 font-heading">
              WEATHER FORECAST
            </div>
            <div className="text-[9px] text-cyan-400/70 font-mono">WIND / RAIN / STORMS</div>
          </div>
        </div>

        {/* BOTTOM RIGHT: FISHING ZONES */}
        <div
          onClick={() => onCalloutClick?.("pfz")}
          className="absolute top-16 -right-72 pointer-events-auto cursor-pointer group flex items-center gap-3 transition-transform hover:scale-105"
        >
          <div className="text-right">
            <div className="text-[11px] font-bold tracking-wider text-cyan-300 font-heading">
              FISHING ZONES
            </div>
            <div className="text-[9px] text-cyan-400/70 font-mono">POTENTIAL ZONES / BIOMASS</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-cyan-glow group-hover:border-cyan-300">
            <Fish className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
