import React, { useState } from "react";
import {
  MapPin,
  Search,
  CloudSun,
  Waves,
  Wind,
  Droplets,
  Gauge,
  ShieldCheck,
  AlertTriangle,
  X,
  Compass,
  MessageSquare,
} from "lucide-react";

export interface PinpointClimateData {
  pinpoint: {
    latitude: number;
    longitude: number;
    location_name: string;
    region_type: string;
    is_coastal_marine: boolean;
  };
  climate: {
    temperature_c: number;
    weather_condition: string;
    relative_humidity_pct: number;
    wind_speed_kmh: number;
    wind_direction_deg: number;
    wind_compass: string;
    precipitation_mm: number;
    surface_pressure_hpa: number;
    is_live_data: boolean;
  };
  marine: {
    is_marine: boolean;
    wave_height_m: number | null;
    wave_period_s: number | null;
    sea_state: string;
    sst_c: number | null;
    pfz_biomass_suitability: string;
  };
  safety: {
    verdict: string;
    advisory: string;
  };
}

interface PinpointClimateCardProps {
  data: PinpointClimateData | null;
  isEmbedded?: boolean;
  onClose: () => void;
  onAskAI: (locationName: string, lat: number, lon: number) => void;
  onSelectPreset: (lat: number, lon: number, name: string) => void;
}

export const INDIAN_PRESETS = [
  { name: "Mumbai", lat: 18.922, lon: 72.834, tag: "Arabian Sea" },
  { name: "Kakinada", lat: 16.989, lon: 82.247, tag: "Bay of Bengal" },
  { name: "Visakhapatnam", lat: 17.686, lon: 83.218, tag: "Bay of Bengal" },
  { name: "Chennai", lat: 13.082, lon: 80.270, tag: "Coromandel" },
  { name: "Kochi", lat: 9.931, lon: 76.267, tag: "Malabar" },
  { name: "Goa", lat: 15.498, lon: 73.827, tag: "Konkan" },
  { name: "New Delhi", lat: 28.613, lon: 77.209, tag: "Inland" },
  { name: "Bengaluru", lat: 12.971, lon: 77.594, tag: "Inland" },
  { name: "Kolkata", lat: 22.572, lon: 88.363, tag: "Delta" },
  { name: "Port Blair", lat: 11.623, lon: 92.726, tag: "Andaman" },
  { name: "Lakshadweep", lat: 10.566, lon: 72.641, tag: "Islands" },
  { name: "Rameswaram", lat: 9.287, lon: 79.312, tag: "Palk Strait" },
  { name: "Veraval", lat: 20.900, lon: 70.360, tag: "Gujarat" },
  { name: "Paradip", lat: 20.316, lon: 86.611, tag: "Odisha" },
  { name: "Kanyakumari", lat: 8.080, lon: 77.550, tag: "Cape" },
];

export const PinpointClimateCard: React.FC<PinpointClimateCardProps> = ({
  data,
  isEmbedded = false,
  onClose,
  onAskAI,
  onSelectPreset,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredPresets = INDIAN_PRESETS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => (
    <div className="flex flex-col h-full overflow-y-auto space-y-3 font-sans pr-1">
      {/* Search Input */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 p-1.5 bg-[#020b18] rounded-xl border border-cyan-500/30">
          <Search className="w-4 h-4 text-cyan-400 shrink-0 ml-1" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search any Indian city, port or coastal spot..."
            className="w-full bg-transparent text-xs text-slate-100 placeholder-cyan-500/40 focus:outline-none font-sans"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-slate-400 hover:text-white mr-1">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchTerm && (
          <div className="rounded-xl bg-[#031126]/95 border border-cyan-400/40 backdrop-blur-md shadow-2xl p-2 max-h-48 overflow-y-auto space-y-1 font-mono text-xs z-40">
            {filteredPresets.length > 0 ? (
              filteredPresets.map((p) => (
                <div
                  key={p.name}
                  onClick={() => {
                    onSelectPreset(p.lat, p.lon, p.name);
                    setIsSearchOpen(false);
                    setSearchTerm("");
                  }}
                  className="p-2 rounded-lg hover:bg-cyan-900/40 border border-transparent hover:border-cyan-500/30 cursor-pointer flex items-center justify-between text-cyan-200"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-slate-100">{p.name}</span>
                    <span className="text-[10px] text-cyan-400/60">({p.tag})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {p.lat}°N, {p.lon}°E
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-[11px] text-slate-400">
                No preset found. You can click anywhere directly on the 3D globe to pinpoint any coordinate across India!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preset Quick Chips */}
      <div className="space-y-1">
        <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/70">
          Quick Preset Locations:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {INDIAN_PRESETS.slice(0, 10).map((p) => (
            <button
              key={p.name}
              onClick={() => onSelectPreset(p.lat, p.lon, p.name)}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 hover:border-cyan-300 transition-all flex items-center gap-1"
            >
              <MapPin className="w-2.5 h-2.5 text-amber-400" />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pinpointed Location Details */}
      {data ? (
        <div className="rounded-2xl holo-panel border border-amber-400/60 shadow-[0_0_25px_rgba(255,170,0,0.25)] p-3.5 space-y-3 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex items-start justify-between pb-2 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-[0_0_10px_rgba(255,170,0,0.4)]">
                <MapPin className="w-3.5 h-3.5 animate-bounce" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-wider text-amber-300 font-heading">
                  {data.pinpoint.location_name}
                </div>
                <div className="text-[10px] text-cyan-400/80 font-mono">
                  {data.pinpoint.latitude}°N, {data.pinpoint.longitude}°E •{" "}
                  {data.pinpoint.is_coastal_marine ? "Coastal / Marine Waters" : "Mainland Territory"}
                </div>
              </div>
            </div>

            {!isEmbedded && (
              <button
                onClick={onClose}
                className="w-6 h-6 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-slate-300 hover:text-white flex items-center justify-center"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Temperature & Weather */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-cyan-500/20">
            <div className="flex items-center gap-2.5">
              <CloudSun className="w-8 h-8 text-cyan-300 animate-pulse" />
              <div>
                <div className="text-xl font-bold font-mono text-white leading-none">
                  {data.climate.temperature_c}°C
                </div>
                <div className="text-[11px] text-cyan-200 mt-0.5">
                  {data.climate.weather_condition}
                </div>
              </div>
            </div>

            <div className="text-right font-mono text-[10px] space-y-0.5">
              <div className="text-slate-300">
                <span className="text-cyan-400/60 mr-1">Humidity:</span>
                <span className="font-semibold">{data.climate.relative_humidity_pct}%</span>
              </div>
              <div className="text-slate-300">
                <span className="text-cyan-400/60 mr-1">Wind:</span>
                <span className="font-semibold">{data.climate.wind_speed_kmh} km/h {data.climate.wind_compass}</span>
              </div>
              <div className="text-slate-300">
                <span className="text-cyan-400/60 mr-1">Pressure:</span>
                <span>{data.climate.surface_pressure_hpa} hPa</span>
              </div>
            </div>
          </div>

          {/* Marine Telemetry */}
          {data.marine.is_marine && (
            <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="flex items-center gap-1 text-cyan-300 font-bold">
                  <Waves className="w-3 h-3" />
                  <span>SEA STATE TELEMETRY</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-900/60 text-[9px] text-cyan-200">
                  {data.marine.sea_state}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px] text-center">
                <div className="p-1.5 rounded bg-black/30 border border-cyan-500/10">
                  <div className="text-cyan-400/60">WAVE HEIGHT</div>
                  <div className="text-cyan-200 font-bold text-xs">{data.marine.wave_height_m ?? 1.4} m</div>
                </div>
                <div className="p-1.5 rounded bg-black/30 border border-cyan-500/10">
                  <div className="text-cyan-400/60">SWELL PERIOD</div>
                  <div className="text-cyan-200 font-bold text-xs">{data.marine.wave_period_s ?? 7.5} s</div>
                </div>
                <div className="p-1.5 rounded bg-black/30 border border-cyan-500/10">
                  <div className="text-cyan-400/60">PFZ BIOMASS</div>
                  <div className="text-emerald-400 font-bold text-xs">{data.marine.pfz_biomass_suitability}</div>
                </div>
              </div>
            </div>
          )}

          {/* Safety Verdict */}
          <div
            className={`p-2 rounded-xl border flex items-start gap-2 text-[11px] leading-snug ${
              data.safety.verdict === "DANGER"
                ? "bg-red-950/50 border-red-500 text-red-200"
                : data.safety.verdict === "CAUTION"
                ? "bg-amber-950/50 border-amber-500 text-amber-200"
                : "bg-emerald-950/40 border-emerald-500 text-emerald-200"
            }`}
          >
            {data.safety.verdict === "DANGER" ? (
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0 animate-pulse" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <span className="font-bold font-mono tracking-wider mr-1">
                STATUS: {data.safety.verdict} —
              </span>
              <span>{data.safety.advisory}</span>
            </div>
          </div>

          {/* Ask AI Button */}
          <button
            onClick={() =>
              onAskAI(
                data.pinpoint.location_name,
                data.pinpoint.latitude,
                data.pinpoint.longitude
              )
            }
            className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono tracking-wider flex items-center justify-center gap-2 shadow-cyan-glow transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>ASK NEREUS AI ABOUT THIS LOCATION</span>
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-center space-y-2">
          <MapPin className="w-6 h-6 text-amber-400 mx-auto animate-bounce" />
          <div className="text-xs text-cyan-200 font-semibold">
            No Location Pinpoint Active
          </div>
          <div className="text-[10px] text-cyan-400/60 leading-relaxed font-mono">
            Click anywhere on the 3D marine globe or choose an Indian city above to inspect real-time climate, atmospheric pressure, and marine sea-state telemetry.
          </div>
        </div>
      )}
    </div>
  );

  if (isEmbedded) {
    return renderContent();
  }

  // Floating docked card on the side (when invoked while another tab is active)
  if (!data) return null;

  return (
    <div className="absolute top-20 left-6 z-30 w-[420px] rounded-2xl holo-panel border border-amber-400/60 shadow-[0_0_35px_rgba(255,170,0,0.3)] p-4 space-y-3 pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
      {renderContent()}
    </div>
  );
};
