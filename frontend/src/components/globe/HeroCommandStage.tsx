import React from "react";
import { AICoreState } from "../../types";
import { Satellite, Waves, CloudSun, Fish, Ship, Compass } from "lucide-react";

interface HeroCommandStageProps {
  coreState: AICoreState;
  onCalloutClick?: (type: string) => void;
  isListening?: boolean;
  isSpeaking?: boolean;
}

export const HeroCommandStage: React.FC<HeroCommandStageProps> = ({
  coreState,
  onCalloutClick,
  isListening = false,
  isSpeaking = false,
}) => {
  const isWarning = coreState === "WARNING";
  const isProcessing = coreState === "PROCESSING" || coreState === "ANALYZING";

  const coreGlow = isWarning
    ? "#ff3355"
    : isListening
    ? "#ff4466"
    : isSpeaking
    ? "#00f0b5"
    : isProcessing
    ? "#ffaa00"
    : "#00e5ff";

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* ─── 1. REALISTIC EARTH HORIZON & OCEAN BACKGROUND ─── */}
      <div className="absolute inset-0 bg-[#010612]">
        {/* Curved Stratosphere & Atmospheric Glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 130% 90% at 50% 115%, #062b66 0%, #031535 38%, #020b1f 65%, #010612 100%)",
          }}
        />

        {/* Photorealistic Ocean Curvature Arc */}
        <div
          className="absolute -bottom-[28%] left-1/2 -translate-x-1/2 w-[170vw] h-[100vh] rounded-[100%] overflow-hidden border-t-2 border-cyan-400/40"
          style={{
            background:
              "radial-gradient(ellipse at 50% 15%, #023668 0%, #032048 35%, #01142e 70%, #010918 100%)",
            boxShadow:
              "0 -25px 80px rgba(0, 180, 255, 0.35), inset 0 30px 90px rgba(0, 229, 255, 0.2)",
          }}
        >
          {/* Subtle Ocean Wave Grid & Bathymetric Lines */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 45% 30%, rgba(0, 229, 255, 0.3) 1px, transparent 1px), radial-gradient(circle at 55% 45%, rgba(0, 240, 180, 0.25) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />

          {/* Coastal Landmass Silhouette with City Night Lights (Indian Coast) */}
          <svg
            className="absolute top-4 right-[12%] w-[580px] h-[360px] opacity-90 pointer-events-none"
            viewBox="0 0 600 400"
            fill="none"
          >
            <defs>
              <linearGradient id="coastLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#081e3a" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#041226" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#020a16" stopOpacity="0.9" />
              </linearGradient>
              <filter id="cityGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Coastline Polygon */}
            <path
              d="M 50 180 Q 120 160 180 210 T 290 230 T 400 210 T 520 280 L 600 400 L 0 400 Z"
              fill="url(#coastLandGrad)"
              stroke="rgba(0, 229, 255, 0.3)"
              strokeWidth="1.5"
            />

            {/* Golden & Cyan Coastal City Lights Clusters (Mumbai, Goa, Kochi, Chennai) */}
            <g filter="url(#cityGlow)">
              {/* Mumbai Urban Light Hub */}
              <circle cx="160" cy="195" r="4" fill="#ffdd66" opacity="0.9" />
              <circle cx="170" cy="200" r="3" fill="#00e5ff" opacity="0.8" />
              <circle cx="152" cy="202" r="2.5" fill="#ffcc44" opacity="0.85" />
              <circle cx="180" cy="208" r="2" fill="#ffffff" opacity="0.95" />

              {/* Goa / Konkan Coastal Arc */}
              <circle cx="230" cy="218" r="3" fill="#ffbb33" opacity="0.85" />
              <circle cx="242" cy="222" r="2" fill="#00f0b5" opacity="0.9" />
              <circle cx="255" cy="226" r="2.5" fill="#ffdd77" opacity="0.75" />

              {/* Kochi / Malabar Light Cluster */}
              <circle cx="310" cy="228" r="3.5" fill="#ffcc44" opacity="0.9" />
              <circle cx="325" cy="235" r="2" fill="#00e5ff" opacity="0.85" />
              <circle cx="340" cy="230" r="3" fill="#ffffff" opacity="0.9" />

              {/* Southern Ports & Archipelago */}
              <circle cx="420" cy="225" r="3" fill="#ffaa33" opacity="0.8" />
              <circle cx="445" cy="240" r="2" fill="#00f0b5" opacity="0.85" />
              <circle cx="480" cy="260" r="2.5" fill="#ffdd55" opacity="0.75" />
            </g>
          </svg>

          {/* Glowing Thermal SST / Chlorophyll PFZ Heatmap Plumes */}
          <div
            className="absolute top-16 left-[22%] w-52 h-44 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 45% 55%, rgba(255, 60, 0, 0.75) 0%, rgba(255, 180, 0, 0.65) 28%, rgba(0, 255, 120, 0.55) 55%, rgba(0, 200, 255, 0.4) 75%, transparent 100%)",
              filter: "blur(14px)",
              opacity: 0.85,
            }}
          />

          <div
            className="absolute top-28 left-[42%] w-64 h-48 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255, 70, 20, 0.7) 0%, rgba(255, 200, 0, 0.6) 30%, rgba(0, 240, 160, 0.5) 58%, rgba(0, 150, 255, 0.3) 78%, transparent 100%)",
              filter: "blur(16px)",
              opacity: 0.9,
            }}
          />

          {/* Animated Coastal Fishing Vessels with Sonar Ripple Rings */}
          {/* Ship 1 */}
          <div className="absolute top-24 left-[34%] flex flex-col items-center group pointer-events-auto cursor-pointer">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-12 h-12 rounded-full border border-cyan-400/40 animate-ping" />
              <span className="absolute w-8 h-8 rounded-full border border-teal-400/50 animate-pulse" />
              <Ship className="w-4 h-4 text-cyan-200 drop-shadow-[0_0_8px_#00e5ff]" />
            </div>
            <span className="mt-1 text-[8px] font-mono text-cyan-300 bg-black/60 px-1 rounded border border-cyan-500/20">
              KA-04 • 21.4km
            </span>
          </div>

          {/* Ship 2 */}
          <div className="absolute top-36 left-[48%] flex flex-col items-center group pointer-events-auto cursor-pointer">
            <div className="relative flex items-center justify-center">
              <span
                className="absolute w-14 h-14 rounded-full border border-cyan-400/30 animate-ping"
                style={{ animationDuration: "2.4s" }}
              />
              <Ship className="w-4 h-4 text-teal-200 drop-shadow-[0_0_8px_#00f0b5]" />
            </div>
            <span className="mt-1 text-[8px] font-mono text-teal-300 bg-black/60 px-1 rounded border border-teal-500/20">
              MH-12 • Active PFZ
            </span>
          </div>

          {/* Ship 3 */}
          <div className="absolute top-44 left-[38%] flex flex-col items-center group pointer-events-auto cursor-pointer">
            <div className="relative flex items-center justify-center">
              <span
                className="absolute w-10 h-10 rounded-full border border-emerald-400/40 animate-ping"
                style={{ animationDuration: "3s" }}
              />
              <Ship className="w-3.5 h-3.5 text-emerald-200 drop-shadow-[0_0_8px_#00ff99]" />
            </div>
            <span className="mt-0.5 text-[8px] font-mono text-emerald-300 bg-black/60 px-1 rounded border border-emerald-500/20">
              TN-08 • 48.7km
            </span>
          </div>

          {/* Bathymetry Depth Reticle */}
          <div className="absolute top-48 left-[45%] flex items-center gap-1.5 text-[9px] font-mono text-cyan-400/70 pointer-events-none">
            <Compass className="w-3.5 h-3.5 text-cyan-300" />
            <span>DEPTH: -42.8m • SST 28.4°C</span>
          </div>
        </div>
      </div>

      {/* ─── 2. CENTER FLOATING HOLOGRAPHIC NEREUS AI CORE & PEDESTAL ─── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="relative flex items-center justify-center -translate-y-6">
          {/* Vertical Grounding Light Rays down to the sea horizon */}
          <div
            className="absolute top-28 left-1/2 -translate-x-1/2 w-48 h-56 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 229, 255, 0.35) 0%, rgba(0, 150, 255, 0.15) 60%, transparent 100%)",
              clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
              filter: "blur(6px)",
            }}
          />

          {/* Outer Layered Rotating Orbit Rings */}
          <div
            className={`absolute w-[360px] h-[360px] rounded-full border border-dashed border-cyan-400/30 ${
              isProcessing ? "animate-spin" : "animate-spin-slow"
            }`}
            style={{ animationDuration: isProcessing ? "6s" : "28s" }}
          />

          <div
            className="absolute w-[310px] h-[310px] rounded-full border border-dotted border-teal-400/40 animate-spin-reverse-slow"
            style={{ animationDuration: isProcessing ? "8s" : "34s" }}
          />

          {/* High-Tech Glowing Base Pedestal */}
          <div className="absolute -bottom-14 flex flex-col items-center">
            {/* Top Glowing Edge */}
            <div
              className="w-60 h-4 rounded-full border border-cyan-300/60 shadow-[0_0_30px_rgba(0,229,255,0.7)]"
              style={{
                background: "radial-gradient(ellipse at center, #00e5ff 0%, #031c3b 70%)",
              }}
            />
            {/* Tier 2 Disc */}
            <div className="w-72 h-4 -mt-1 rounded-full border border-cyan-400/40 bg-cyan-950/80 shadow-[0_4px_25px_rgba(0,229,255,0.4)]" />
            {/* Tier 3 Wide Disc */}
            <div className="w-80 h-5 -mt-1 rounded-full border border-cyan-500/30 bg-[#020b18]/90 shadow-[0_8px_35px_rgba(0,10,30,0.8)]" />
          </div>

          {/* Central Holographic Sphere Core */}
          <div
            className={`relative w-52 h-52 rounded-full flex flex-col items-center justify-center backdrop-blur-md bg-[#020c22]/80 border-2 transition-all duration-500`}
            style={{
              borderColor: isWarning ? "#ff3355" : isListening ? "#ff4466" : isSpeaking ? "#00f0b5" : "#00e5ff",
              boxShadow: `0 0 45px ${coreGlow}55, inset 0 0 25px ${coreGlow}33`,
            }}
          >
            {/* Internal Pulsing Energy Core Grid */}
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background: `radial-gradient(circle at center, ${coreGlow}30 0%, transparent 70%)`,
              }}
            />

            {/* Glowing Trident Emblem Logo */}
            <div className="relative z-10 flex flex-col items-center">
              <svg
                className="w-16 h-16 transition-transform duration-300 transform hover:scale-110"
                viewBox="0 0 100 100"
                fill="none"
                style={{ filter: `drop-shadow(0 0 16px ${coreGlow})` }}
              >
                <defs>
                  <linearGradient id="heroCoreTrident" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={coreGlow} />
                    <stop offset="100%" stopColor="#0077ff" />
                  </linearGradient>
                </defs>
                <path d="M50 8 L54 28 L52 75 L48 75 L46 28 Z" fill="url(#heroCoreTrident)" />
                <polygon points="50,4 56,16 50,22 44,16" fill="#00f0b5" />
                <path d="M46 38 C32 40 24 28 26 14 L30 18 C28 26 34 34 46 32 Z" fill="url(#heroCoreTrident)" />
                <polygon points="26,12 30,22 25,20 22,18" fill="#00f0b5" />
                <path d="M54 38 C68 40 76 28 74 14 L70 18 C72 26 66 34 54 32 Z" fill="url(#heroCoreTrident)" />
                <polygon points="74,12 78,18 75,20 70,22" fill="#00f0b5" />
                <circle cx="50" cy="80" r="4" fill="url(#heroCoreTrident)" />
                <path d="M50 84 L53 96 L47 96 Z" fill="url(#heroCoreTrident)" />
              </svg>

              {/* Exact Text: NEREUS AI CORE */}
              <div className="text-center mt-1">
                <span className="text-sm font-bold tracking-[0.25em] text-cyan-200 block font-heading drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]">
                  N E R E U S
                </span>
                <span className="text-[10px] tracking-[0.2em] text-cyan-400 font-mono font-semibold block">
                  {isListening ? "LISTENING..." : isSpeaking ? "SPEAKING..." : isProcessing ? "ANALYZING..." : "AI CORE"}
                </span>
              </div>
            </div>
          </div>

          {/* ─── 4 FLOATING HOLOGRAPHIC SATELLITE/MARINE CALLOUT BADGES ─── */}
          {/* 1. TOP-LEFT: SATELLITE DATA */}
          <div
            onClick={() => onCalloutClick?.("sst")}
            className="absolute -top-36 -left-72 pointer-events-auto cursor-pointer group flex items-center gap-3 transition-transform hover:scale-105"
          >
            <div className="w-11 h-11 rounded-full bg-cyan-950/90 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.4)] group-hover:border-cyan-300 group-hover:scale-110 transition-all">
              <Satellite className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider text-cyan-200 font-heading group-hover:text-white">
                SATELLITE DATA
              </div>
              <div className="text-[9px] text-cyan-400/70 font-mono tracking-wider">
                SST / CHL / OCEAN COLOR
              </div>
            </div>
            {/* Connecting HUD circuit line to core */}
            <div className="absolute top-1/2 left-full w-28 h-px bg-gradient-to-r from-cyan-400/60 to-transparent pointer-events-none transform translate-y-4 rotate-12" />
          </div>

          {/* 2. TOP-RIGHT: OCEAN CONDITIONS */}
          <div
            onClick={() => onCalloutClick?.("ocean")}
            className="absolute -top-36 -right-72 pointer-events-auto cursor-pointer group flex items-center gap-3 transition-transform hover:scale-105"
          >
            {/* Connecting HUD circuit line to core */}
            <div className="absolute top-1/2 right-full w-28 h-px bg-gradient-to-l from-cyan-400/60 to-transparent pointer-events-none transform translate-y-4 -rotate-12" />
            <div className="text-right">
              <div className="text-xs font-bold tracking-wider text-cyan-200 font-heading group-hover:text-white">
                OCEAN CONDITIONS
              </div>
              <div className="text-[9px] text-cyan-400/70 font-mono tracking-wider">
                TIDE / CURRENT / WAVES
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-cyan-950/90 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.4)] group-hover:border-cyan-300 group-hover:scale-110 transition-all">
              <Waves className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          {/* 3. BOTTOM-LEFT: WEATHER FORECAST */}
          <div
            onClick={() => onCalloutClick?.("weather")}
            className="absolute top-16 -left-80 pointer-events-auto cursor-pointer group flex items-center gap-3 transition-transform hover:scale-105"
          >
            <div className="w-11 h-11 rounded-full bg-cyan-950/90 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.4)] group-hover:border-cyan-300 group-hover:scale-110 transition-all">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider text-cyan-200 font-heading group-hover:text-white">
                WEATHER FORECAST
              </div>
              <div className="text-[9px] text-cyan-400/70 font-mono tracking-wider">
                WIND / RAIN / STORMS
              </div>
            </div>
            {/* Connecting HUD line */}
            <div className="absolute top-1/2 left-full w-24 h-px bg-gradient-to-r from-cyan-400/50 to-transparent pointer-events-none transform -translate-y-2 -rotate-6" />
          </div>

          {/* 4. BOTTOM-RIGHT: FISHING ZONES */}
          <div
            onClick={() => onCalloutClick?.("pfz")}
            className="absolute top-16 -right-80 pointer-events-auto cursor-pointer group flex items-center gap-3 transition-transform hover:scale-105"
          >
            {/* Connecting HUD line */}
            <div className="absolute top-1/2 right-full w-24 h-px bg-gradient-to-l from-cyan-400/50 to-transparent pointer-events-none transform -translate-y-2 rotate-6" />
            <div className="text-right">
              <div className="text-xs font-bold tracking-wider text-cyan-200 font-heading group-hover:text-white">
                FISHING ZONES
              </div>
              <div className="text-[9px] text-cyan-400/70 font-mono tracking-wider">
                POTENTIAL ZONES / BIOMASS
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-cyan-950/90 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.4)] group-hover:border-cyan-300 group-hover:scale-110 transition-all">
              <Fish className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
