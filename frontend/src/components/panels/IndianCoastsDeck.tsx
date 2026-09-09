import React from "react";
import { INDIAN_COASTS, IndianCoastInfo } from "../../lib/indianCoasts";
import {
  Waves,
  Wind,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Anchor,
  Compass,
  Fish,
  Eye,
  MessageSquare,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface IndianCoastsDeckProps {
  selectedCoastId: string;
  onSelectCoast: (coastId: string) => void;
  onFlyToCoast: (coast: IndianCoastInfo) => void;
  onAskAI: (coast: IndianCoastInfo) => void;
}

export const IndianCoastsDeck: React.FC<IndianCoastsDeckProps> = ({
  selectedCoastId,
  onSelectCoast,
  onFlyToCoast,
  onAskAI,
}) => {
  const currentCoast =
    INDIAN_COASTS.find((c) => c.id === selectedCoastId) || INDIAN_COASTS[0];

  const getVerdictBadge = (verdict: "SAFE" | "CAUTION" | "DANGER") => {
    switch (verdict) {
      case "SAFE":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            SAFE TO OPERATE
          </span>
        );
      case "CAUTION":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-400/50 text-amber-300 font-mono text-[11px] animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            CAUTION ADVISED
          </span>
        );
      case "DANGER":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/60 text-red-300 font-mono text-[11px] animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            DANGER / RESTRICTED
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden font-sans space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-cyan-glow">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-200 font-heading">
              Indian Coasts Intelligence
            </h2>
            <div className="text-[10px] text-cyan-400/70 font-mono">
              10 Coastal Zones Across India • Real-Time Marine Safety
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
          INCOIS LIVE
        </span>
      </div>

      {/* Selected Coast Deep-Dive Hero Card */}
      <div className="p-3.5 rounded-2xl holo-panel border border-cyan-400/40 shadow-cyan-glow space-y-3 shrink-0">
        {/* Title & Verdict */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-bold text-white font-heading">
              {currentCoast.name}
            </div>
            <div className="text-[11px] text-cyan-300/80 font-mono">
              {currentCoast.states} • {currentCoast.sea}
            </div>
            <div className="text-[10px] text-cyan-400/60 font-mono mt-0.5">
              Coordinates: {currentCoast.latitude}°N, {currentCoast.longitude}°E
            </div>
          </div>
          {getVerdictBadge(currentCoast.safety_verdict)}
        </div>

        {/* 4 Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-xl bg-black/40 border border-cyan-500/20 flex items-center gap-2.5">
            <Waves className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                Wave Height
              </div>
              <div className="text-sm font-bold font-mono text-cyan-200">
                {currentCoast.wave_height_m} m{" "}
                <span className="text-[10px] font-normal text-cyan-400/70">
                  ({currentCoast.wave_period_s}s)
                </span>
              </div>
              <div className="text-[9px] text-teal-400 font-mono">
                State: {currentCoast.sea_state}
              </div>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-black/40 border border-cyan-500/20 flex items-center gap-2.5">
            <Thermometer className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                Sea Temp (SST)
              </div>
              <div className="text-sm font-bold font-mono text-amber-300">
                {currentCoast.sst_c}°C
              </div>
              <div className="text-[9px] text-amber-400/80 font-mono">
                Oceansat-3 MOSDAC
              </div>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-black/40 border border-cyan-500/20 flex items-center gap-2.5">
            <Wind className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                Surface Wind
              </div>
              <div className="text-sm font-bold font-mono text-teal-200">
                {currentCoast.wind_speed_kmh} km/h
              </div>
              <div className="text-[9px] text-teal-400/80 font-mono">
                Dir: {currentCoast.wind_direction}
              </div>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-black/40 border border-cyan-500/20 flex items-center gap-2.5">
            <Fish className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                Biomass / PFZ
              </div>
              <div className="text-sm font-bold font-mono text-emerald-300">
                HIGH
              </div>
              <div className="text-[9px] text-emerald-400/80 font-mono">
                Pelagic Active
              </div>
            </div>
          </div>
        </div>

        {/* Coastal Marine Advisory */}
        <div className="p-2.5 rounded-xl bg-[#03152c]/80 border border-cyan-500/30 text-[11px] text-cyan-200 font-sans leading-relaxed">
          <span className="font-semibold text-cyan-300">Official Advisory: </span>
          {currentCoast.advisory}
        </div>

        {/* Target Commercial Species */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-cyan-400/70 shrink-0">Catch Species:</span>
          <span className="text-emerald-300 truncate">{currentCoast.target_species}</span>
        </div>

        {/* Major Ports */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-cyan-400/70 font-mono mb-1.5 flex items-center gap-1">
            <Anchor className="w-3 h-3 text-cyan-400" />
            Active Major Ports & Harbors:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentCoast.ports.map((port) => (
              <span
                key={port}
                className="px-2 py-0.5 rounded-md bg-cyan-950/70 border border-cyan-500/30 text-[10px] font-mono text-cyan-300"
              >
                {port}
              </span>
            ))}
          </div>
        </div>

        {/* Geofence Status */}
        <div className="p-2 rounded-lg bg-black/30 border border-cyan-500/20 flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-400">Maritime Security / Geofence:</span>
          <span
            className={
              currentCoast.geofence_status.includes("WARNING") ||
              currentCoast.geofence_status.includes("RESTRICTED")
                ? "text-amber-400 font-bold"
                : "text-emerald-400"
            }
          >
            {currentCoast.geofence_status}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onFlyToCoast(currentCoast)}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-black font-bold font-heading text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-cyan-glow transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            FLY TO COAST ON GLOBE
          </button>
          <button
            onClick={() => onAskAI(currentCoast)}
            className="px-3 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/40 hover:border-cyan-300 text-cyan-200 text-xs font-mono flex items-center gap-1.5 transition-all"
            title="Ask NEREUS Multi-Agent AI about this coast"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-300" />
            ASK AI
          </button>
        </div>
      </div>

      {/* Coastal Zone Switcher List */}
      <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
        <div className="text-[10px] uppercase tracking-wider text-cyan-400/60 font-mono px-1">
          Select Another Indian Coast:
        </div>
        {INDIAN_COASTS.map((coast) => {
          const isSelected = coast.id === currentCoast.id;
          return (
            <div
              key={coast.id}
              onClick={() => {
                onSelectCoast(coast.id);
                onFlyToCoast(coast);
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? "bg-cyan-950/70 border-cyan-400 shadow-cyan-glow"
                  : "bg-black/30 border-cyan-500/20 hover:bg-cyan-950/40 hover:border-cyan-400/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    coast.safety_verdict === "SAFE"
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                      : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                  }`}
                />
                <div>
                  <div className="text-xs font-bold text-slate-100 font-heading">
                    {coast.name}
                  </div>
                  <div className="text-[10px] text-cyan-400/70 font-mono">
                    {coast.states} • Wave: {coast.wave_height_m}m • SST: {coast.sst_c}°C
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-cyan-400/60" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
