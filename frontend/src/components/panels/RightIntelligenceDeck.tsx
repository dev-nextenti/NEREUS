import React from "react";
import { PFZItem, WeatherData } from "../../types";
import { CloudSun, Waves, Compass, ArrowRight, ExternalLink } from "lucide-react";

interface RightIntelligenceDeckProps {
  className?: string;
  pfzList: PFZItem[];
  weather: WeatherData;
  onSelectPFZ: (pfz: PFZItem) => void;
  onOpenSST: () => void;
}

export const RightIntelligenceDeck: React.FC<RightIntelligenceDeckProps> = ({
  className,
  pfzList,
  weather,
  onSelectPFZ,
  onOpenSST,
}) => {
  return (
    <div
      className={
        className ||
        "w-[340px] max-h-[calc(100vh-140px)] flex flex-col gap-2.5 overflow-y-auto pointer-events-auto pr-0.5 select-none"
      }
    >
      {/* ─── 1. POTENTIAL FISHING ZONES CARD ─── */}
      <div className="p-3.5 rounded-2xl bg-[#031329]/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,10,30,0.7)] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold tracking-wider text-slate-100 font-heading">
            POTENTIAL FISHING ZONES
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[10px] font-mono text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live</span>
          </div>
        </div>

        {/* Satellite Radar Heatmap Thumbnail */}
        <div className="relative w-full h-24 rounded-xl overflow-hidden border border-cyan-500/25 bg-gradient-to-br from-blue-950 via-teal-900 to-amber-900 flex items-center justify-center">
          {/* Detailed Thermal Plume Visual */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,80,0,0.85)_0%,rgba(0,240,160,0.65)_35%,rgba(0,60,180,0.85)_75%)] opacity-90" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(rgba(0, 229, 255, 0.4) 1px, transparent 1px)",
              backgroundSize: "12px 12px",
            }}
          />
          <div className="relative z-10 text-center text-[10px] font-mono text-white/95 drop-shadow">
            <div className="font-bold tracking-wide">INCOIS PFZ RADAR MAP</div>
            <div className="text-[9px] text-cyan-200">Sector 12 • Offshore High Biomass</div>
          </div>
        </div>

        {/* Exact Probability Rows from Image: High 21.4 km, Moderate 48.7 km, Low 102.3 km */}
        <div className="space-y-1.5 font-sans">
          {/* Row 1: High Probability */}
          <div
            onClick={() => pfzList[0] && onSelectPFZ(pfzList[0])}
            className="flex items-center justify-between p-2 rounded-xl bg-[#021024]/70 hover:bg-cyan-950/50 border border-cyan-500/20 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00ff99]" />
              <span className="text-[11px] font-semibold text-emerald-300">
                High Probability
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-slate-200 group-hover:text-cyan-300">
              <span>21.4 km</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          {/* Row 2: Moderate */}
          <div
            onClick={() => pfzList[1] && onSelectPFZ(pfzList[1])}
            className="flex items-center justify-between p-2 rounded-xl bg-[#021024]/70 hover:bg-cyan-950/50 border border-cyan-500/20 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#ffaa00]" />
              <span className="text-[11px] font-semibold text-amber-300">
                Moderate
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-slate-200 group-hover:text-cyan-300">
              <span>48.7 km</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          {/* Row 3: Low */}
          <div
            onClick={() => pfzList[2] && onSelectPFZ(pfzList[2])}
            className="flex items-center justify-between p-2 rounded-xl bg-[#021024]/70 hover:bg-cyan-950/50 border border-cyan-500/20 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="text-[11px] font-semibold text-slate-300">
                Low
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-slate-200 group-hover:text-cyan-300">
              <span>102.3 km</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. WEATHER & SEA CONDITIONS CARD ─── */}
      <div className="p-3.5 rounded-2xl bg-[#031329]/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,10,30,0.7)]">
        <div className="text-xs font-bold tracking-wider text-slate-100 font-heading mb-2">
          WEATHER & SEA CONDITIONS
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CloudSun className="w-9 h-9 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
            <div>
              <div className="text-2xl font-bold font-mono text-slate-100 leading-none">
                28°C
              </div>
              <div className="text-[10px] text-cyan-400/80 font-sans mt-0.5">
                Partly Cloudy
              </div>
            </div>
          </div>

          <div className="space-y-1 font-mono text-[11px] text-right">
            <div>
              <span className="text-cyan-400/70 mr-2 text-[10px]">Wind Speed</span>
              <span className="text-slate-100 font-semibold">12 km/h</span>
            </div>
            <div>
              <span className="text-cyan-400/70 mr-2 text-[10px]">Wave Height</span>
              <span className="text-cyan-300 font-semibold">1.2 m</span>
            </div>
            <div>
              <span className="text-cyan-400/70 mr-2 text-[10px]">Visibility</span>
              <span className="text-slate-100 font-semibold">8 km</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. TIDE INFORMATION CARD ─── */}
      <div className="p-3.5 rounded-2xl bg-[#031329]/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,10,30,0.7)]">
        <div className="text-xs font-bold tracking-wider text-slate-100 font-heading mb-2">
          TIDE INFORMATION
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.3)]">
              <Waves className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[9px] text-cyan-400/70 font-mono uppercase">
                Current Tide
              </div>
              <div className="text-sm font-bold text-cyan-200 font-heading">
                Rising
              </div>
            </div>
          </div>

          <div className="space-y-1 font-mono text-[11px] text-right">
            <div>
              <span className="text-cyan-400/70 mr-2 text-[10px]">Next High Tide</span>
              <span className="text-slate-100 font-semibold">04:32 AM</span>
            </div>
            <div>
              <span className="text-cyan-400/70 mr-2 text-[10px]">Next Low Tide</span>
              <span className="text-slate-100 font-semibold">10:21 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. SATELLITE VIEW (SST) CARD ─── */}
      <div className="p-3.5 rounded-2xl bg-[#031329]/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,10,30,0.7)] space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold tracking-wider text-slate-100 font-heading">
            SATELLITE VIEW (SST)
          </div>
          <button
            onClick={onOpenSST}
            className="text-[10px] font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1"
          >
            <span>Expand</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* SST Thermal Image Thumbnail matching the image */}
        <div className="relative w-full h-20 rounded-xl overflow-hidden border border-cyan-500/30">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #022066 0%, #00b4d8 25%, #90e0ef 45%, #ffd166 65%, #ef476f 90%)",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,rgba(255,255,255,0.4)_0%,transparent_55%)] mix-blend-overlay" />
          <div className="absolute bottom-1 right-2 text-[8px] font-mono text-white/90 bg-black/50 px-1.5 py-0.5 rounded border border-cyan-500/20">
            MOSDAC Oceansat-3
          </div>
        </div>

        {/* Exact Color Gradient Spectrum Bar: 23°C to 32°C */}
        <div className="space-y-1 pt-0.5">
          <div
            className="w-full h-2.5 rounded-full border border-white/20"
            style={{
              background:
                "linear-gradient(to right, #0033cc 0%, #00ccff 25%, #33ff33 50%, #ffff00 75%, #ff0000 100%)",
            }}
          />
          <div className="flex items-center justify-between font-mono text-[10px] text-cyan-300">
            <span>23°C</span>
            <span className="text-slate-300 text-[9px]">Mean 28.2°C</span>
            <span>32°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};
