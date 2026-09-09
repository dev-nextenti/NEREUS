import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw,
  Waves, Wind, Thermometer, Shield, AlertTriangle,
  Info, Compass, Activity, Navigation, Radio, MapPin, Eye, RefreshCw
} from 'lucide-react';

export interface CoastalStation {
  id: string;
  name: string;
  state: string;
  sea: string;
  latitude: number;
  longitude: number;
  default_lang?: string;
  species?: string;
  wave_height_m: number;
  swell_height_m?: number;
  wave_period_s?: number;
  wind_speed_kmh: number;
  wind_direction_deg?: number;
  wind_compass?: string;
  temperature_c: number;
  humidity_pct?: number;
  weather_code?: number;
  weather_desc?: string;
  safety_verdict: 'SAFE' | 'CAUTION' | 'DANGER';
  is_live_telemetry?: boolean;
}

interface IndianOceanTacticalMap4KProps {
  stations: CoastalStation[];
  selectedLocationId?: string;
  onSelectStation?: (station: CoastalStation) => void;
  onSendMessage?: (msg: string) => void;
  isOffline?: boolean;
  lastUpdated?: string;
}

// ── 4K Coordinate Projection (4°N to 26°N, 66°E to 96°E) ──────────────────────
const MAP_W = 1600;
const MAP_H = 1200;
const MIN_LON = 65.5;
const MAX_LON = 95.5;
const MIN_LAT = 4.0;
const MAX_LAT = 26.5;

const projectCoords = (lat: number, lon: number): { x: number; y: number } => {
  const x = ((lon - MIN_LON) / (MAX_LON - MIN_LON)) * MAP_W;
  const y = MAP_H - ((lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * MAP_H;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
};

export const IndianOceanTacticalMap4K: React.FC<IndianOceanTacticalMap4KProps> = ({
  stations,
  selectedLocationId,
  onSelectStation,
  onSendMessage,
  isOffline = false,
  lastUpdated = ''
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredStation, setHoveredStation] = useState<CoastalStation | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Layer filter toggles
  const [showWaves, setShowWaves] = useState(true);
  const [showWind, setShowWind] = useState(true);
  const [showTemp, setShowTemp] = useState(true);
  const [showBathymetry, setShowBathymetry] = useState(true);
  const [showCurrents, setShowCurrents] = useState(true);
  const [showEez, setShowEez] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // High-DPI Coastline Vector Paths
  const mainlandPath = useMemo(() => {
    const pts = [
      { lat: 23.7, lon: 68.2 }, { lat: 23.3, lon: 68.6 }, { lat: 22.8, lon: 69.1 },
      { lat: 22.5, lon: 69.1 }, { lat: 22.3, lon: 69.0 }, { lat: 21.6, lon: 69.6 },
      { lat: 20.9, lon: 70.4 }, { lat: 20.7, lon: 71.0 }, { lat: 21.0, lon: 71.9 },
      { lat: 21.6, lon: 72.3 }, { lat: 22.2, lon: 72.6 }, { lat: 21.7, lon: 72.8 },
      { lat: 21.2, lon: 72.8 }, { lat: 20.5, lon: 72.8 },
      { lat: 19.8, lon: 72.7 }, { lat: 18.9, lon: 72.8 }, { lat: 18.2, lon: 72.9 },
      { lat: 17.0, lon: 73.3 }, { lat: 16.1, lon: 73.5 }, { lat: 15.4, lon: 73.8 },
      { lat: 15.0, lon: 74.0 },
      { lat: 14.8, lon: 74.1 }, { lat: 14.3, lon: 74.4 }, { lat: 13.4, lon: 74.7 },
      { lat: 12.9, lon: 74.8 }, { lat: 11.9, lon: 75.3 }, { lat: 11.2, lon: 75.8 },
      { lat: 10.5, lon: 76.0 }, { lat: 10.0, lon: 76.2 }, { lat: 9.5, lon: 76.3 },
      { lat: 8.9, lon: 76.5 }, { lat: 8.4, lon: 77.0 },
      { lat: 8.08, lon: 77.55 },
      { lat: 8.4, lon: 78.1 }, { lat: 8.8, lon: 78.2 }, { lat: 9.3, lon: 79.1 },
      { lat: 9.3, lon: 79.3 }, { lat: 10.0, lon: 79.2 }, { lat: 10.4, lon: 79.8 },
      { lat: 10.8, lon: 79.8 }, { lat: 11.4, lon: 79.8 }, { lat: 11.9, lon: 79.8 },
      { lat: 12.5, lon: 80.2 }, { lat: 13.1, lon: 80.3 }, { lat: 13.6, lon: 80.2 },
      { lat: 14.3, lon: 80.1 }, { lat: 15.1, lon: 80.1 }, { lat: 15.9, lon: 80.6 },
      { lat: 16.2, lon: 81.1 }, { lat: 16.5, lon: 81.7 }, { lat: 17.0, lon: 82.3 },
      { lat: 17.7, lon: 83.3 }, { lat: 18.3, lon: 84.0 }, { lat: 19.0, lon: 84.8 },
      { lat: 19.3, lon: 85.0 }, { lat: 19.8, lon: 85.8 }, { lat: 20.3, lon: 86.6 },
      { lat: 20.8, lon: 86.9 }, { lat: 21.4, lon: 87.1 },
      { lat: 21.6, lon: 87.5 }, { lat: 21.8, lon: 88.1 }, { lat: 21.7, lon: 88.7 },
      { lat: 22.0, lon: 89.1 }
    ];
    return pts.map((p, i) => {
      const { x, y } = projectCoords(p.lat, p.lon);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, []);

  const sriLankaPath = useMemo(() => {
    const pts = [
      { lat: 9.8, lon: 80.2 }, { lat: 9.2, lon: 80.8 }, { lat: 8.6, lon: 81.2 },
      { lat: 7.7, lon: 81.7 }, { lat: 6.9, lon: 81.9 }, { lat: 6.0, lon: 80.9 },
      { lat: 6.0, lon: 80.2 }, { lat: 6.9, lon: 79.9 }, { lat: 7.9, lon: 79.8 },
      { lat: 8.8, lon: 79.8 }, { lat: 9.8, lon: 80.2 }
    ];
    return pts.map((p, i) => {
      const { x, y } = projectCoords(p.lat, p.lon);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, []);

  const eezPath = useMemo(() => {
    const pts = [
      { lat: 23.5, lon: 66.0 }, { lat: 20.5, lon: 66.5 }, { lat: 18.0, lon: 68.5 },
      { lat: 15.0, lon: 70.0 }, { lat: 12.0, lon: 71.0 }, { lat: 8.0, lon: 73.0 },
      { lat: 5.5, lon: 76.5 }, { lat: 5.5, lon: 78.5 }, { lat: 8.0, lon: 82.5 },
      { lat: 11.0, lon: 84.5 }, { lat: 14.0, lon: 84.5 }, { lat: 17.5, lon: 86.5 },
      { lat: 19.5, lon: 89.0 }, { lat: 21.0, lon: 90.0 }
    ];
    return pts.map((p, i) => {
      const { x, y } = projectCoords(p.lat, p.lon);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom(z => Math.max(0.7, Math.min(3.5, z + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col bg-[#010814] overflow-hidden select-none font-mono ${
        isFullscreen ? 'fixed inset-0 z-[300] bg-[#00060d]' : ''
      }`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* ── Top Floating Tactical HUD Bar ── */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-[#001020]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-cyan-500/40 shadow-[0_0_20px_rgba(0,212,255,0.25)]">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-bold text-cyan-200 tracking-widest font-heading">
            4K INDIAN OCEAN TACTICAL MARITIME MAP
          </span>
          <span className="text-[10px] text-cyan-400/60 hidden sm:inline">|</span>
          <span className="text-[10px] font-bold text-teal-300 hidden sm:inline flex items-center gap-1">
            <Radio className="w-3 h-3 text-teal-400 animate-pulse" />
            {isOffline ? 'OFFLINE CACHED' : '1-MIN CONTINUOUS SYNC'}
          </span>
          {lastUpdated && (
            <span className="text-[9px] text-slate-400 hidden md:inline">
              ({lastUpdated})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#001020]/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-cyan-500/40 shadow-lg">
          <button
            onClick={() => setShowWaves(!showWaves)}
            className={`px-2 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
              showWaves ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400' : 'bg-transparent text-slate-500 border-slate-700'
            }`}
            title="Toggle Wave Height Chips"
          >
            <Waves className="w-3 h-3" />
            <span className="hidden md:inline">WAVES</span>
          </button>

          <button
            onClick={() => setShowWind(!showWind)}
            className={`px-2 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
              showWind ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400' : 'bg-transparent text-slate-500 border-slate-700'
            }`}
            title="Toggle Wind Speed Chips"
          >
            <Wind className="w-3 h-3" />
            <span className="hidden md:inline">WIND</span>
          </button>

          <button
            onClick={() => setShowTemp(!showTemp)}
            className={`px-2 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
              showTemp ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400' : 'bg-transparent text-slate-500 border-slate-700'
            }`}
            title="Toggle Temperature Chips"
          >
            <Thermometer className="w-3 h-3" />
            <span className="hidden md:inline">TEMP</span>
          </button>

          <button
            onClick={() => setShowCurrents(!showCurrents)}
            className={`px-2 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
              showCurrents ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400' : 'bg-transparent text-slate-500 border-slate-700'
            }`}
            title="Toggle Ocean Currents"
          >
            <Navigation className="w-3 h-3" />
            <span className="hidden lg:inline">CURRENTS</span>
          </button>

          <div className="w-[1px] h-4 bg-cyan-500/30 mx-0.5" />

          <button
            onClick={() => setZoom(z => Math.min(3.5, z + 0.25))}
            className="p-1 rounded text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.7, z - 0.25))}
            className="p-1 rounded text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetView}
            className="p-1 rounded text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 4K'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── 4K Master SVG Canvas ── */}
      <div className="flex-1 w-full h-full relative overflow-hidden">
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          <defs>
            <radialGradient id="oceanGlow" cx="50%" cy="60%" r="70%">
              <stop offset="0%" stopColor="#041a38" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#020d20" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#010610" stopOpacity="1" />
            </radialGradient>

            <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#051c2c" />
              <stop offset="50%" stopColor="#031622" />
              <stop offset="100%" stopColor="#020e18" />
            </linearGradient>

            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ocean Background */}
          <rect width={MAP_W} height={MAP_H} fill="url(#oceanGlow)" />

          {/* Lat/Lon Grid */}
          {[6, 8, 10, 12, 14, 16, 18, 20, 22, 24].map(lat => {
            const y = projectCoords(lat, 70).y;
            return (
              <g key={`lat-${lat}`}>
                <line x1={0} y1={y} x2={MAP_W} y2={y} stroke="rgba(0,212,255,0.06)" strokeDasharray="3 6" />
                <text x={20} y={y - 4} fill="rgba(0,212,255,0.3)" fontSize="10" fontFamily="monospace">{lat}°N</text>
              </g>
            );
          })}
          {[68, 72, 76, 80, 84, 88, 92].map(lon => {
            const x = projectCoords(10, lon).x;
            return (
              <g key={`lon-${lon}`}>
                <line x1={x} y1={0} x2={x} y2={MAP_H} stroke="rgba(0,212,255,0.06)" strokeDasharray="3 6" />
                <text x={x + 4} y={MAP_H - 20} fill="rgba(0,212,255,0.3)" fontSize="10" fontFamily="monospace">{lon}°E</text>
              </g>
            );
          })}

          {/* Prominent Ocean Names in 4K clarity */}
          <g opacity="0.4" pointerEvents="none">
            <text x={projectCoords(15, 68).x} y={projectCoords(15, 68).y} fill="#00d4ff" fontSize="32" fontWeight="bold" letterSpacing="0.4em" fontFamily="monospace" textAnchor="middle">
              ARABIAN SEA
            </text>
            <text x={projectCoords(15, 68).x} y={projectCoords(15, 68).y + 24} fill="#00ffff" fontSize="12" letterSpacing="0.2em" fontFamily="monospace" textAnchor="middle">
              DEPTH: 2,500m - 4,650m • NORTH INDIAN BASIN
            </text>

            <text x={projectCoords(14, 88).x} y={projectCoords(14, 88).y} fill="#00d4ff" fontSize="32" fontWeight="bold" letterSpacing="0.4em" fontFamily="monospace" textAnchor="middle">
              BAY OF BENGAL
            </text>
            <text x={projectCoords(14, 88).x} y={projectCoords(14, 88).y + 24} fill="#00ffff" fontSize="12" letterSpacing="0.2em" fontFamily="monospace" textAnchor="middle">
              DEPTH: 2,000m - 4,500m • GANGETIC FAN BASIN
            </text>

            <text x={projectCoords(5.2, 79).x} y={projectCoords(5.2, 79).y} fill="#00f0b5" fontSize="36" fontWeight="bold" letterSpacing="0.5em" fontFamily="monospace" textAnchor="middle">
              INDIAN OCEAN
            </text>
            <text x={projectCoords(5.2, 79).x} y={projectCoords(5.2, 79).y + 24} fill="#00f0b5" fontSize="13" letterSpacing="0.2em" fontFamily="monospace" textAnchor="middle">
              EQUATORIAL OCEAN CONFLUENCE & MONSOON DRIFT
            </text>

            <text x={projectCoords(10, 73.5).x} y={projectCoords(10, 73.5).y} fill="#00d4ff" fontSize="14" letterSpacing="0.2em" fontFamily="monospace">
              LAKSHADWEEP SEA
            </text>

            <text x={projectCoords(11.5, 93.8).x} y={projectCoords(11.5, 93.8).y} fill="#00d4ff" fontSize="14" letterSpacing="0.2em" fontFamily="monospace">
              ANDAMAN SEA
            </text>

            <text x={projectCoords(9.0, 79.8).x} y={projectCoords(9.0, 79.8).y} fill="#00ffff" fontSize="11" letterSpacing="0.1em" fontFamily="monospace">
              GULF OF MANNAR
            </text>
          </g>

          {/* Bathymetry Contours */}
          {showBathymetry && (
            <g opacity="0.3" pointerEvents="none">
              <path
                d="M 140 280 Q 220 400 320 600 T 480 900 T 580 1020 Q 640 1080 720 1050 T 820 900 T 960 650 T 1150 420"
                fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="4 8"
              />
              <text x={260} y={480} fill="#00d4ff" fontSize="9" fontFamily="monospace">-200m Shelf</text>
              <text x={950} y={750} fill="#00d4ff" fontSize="9" fontFamily="monospace">-200m Shelf</text>

              <path
                d="M 100 320 Q 180 440 260 660 T 400 940 T 540 1100 Q 640 1150 780 1100 T 940 950 T 1080 680 T 1200 480"
                fill="none" stroke="#0088cc" strokeWidth="1.2" strokeDasharray="2 6"
              />
              <text x={180} y={550} fill="#0088cc" fontSize="9" fontFamily="monospace">-2000m Slope</text>
            </g>
          )}

          {/* Ocean Currents */}
          {showCurrents && (
            <g opacity="0.45" pointerEvents="none">
              <path
                d="M 260 380 C 310 520 380 700 480 920 C 520 1000 580 1050 630 1060"
                fill="none" stroke="#00f0b5" strokeWidth="2.5" strokeDasharray="8 12"
              >
                <animate attributeName="stroke-dashoffset" from="200" to="0" dur="4s" repeatCount="indefinite" />
              </path>
              <text x={380} y={680} fill="#00f0b5" fontSize="10" fontFamily="monospace" transform="rotate(60 380 680)">
                ▸ WICC CURRENT (0.8 kt)
              </text>

              <path
                d="M 650 1050 C 720 980 780 850 820 720 C 880 560 980 440 1080 380"
                fill="none" stroke="#00f0b5" strokeWidth="2.5" strokeDasharray="8 12"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="200" dur="4s" repeatCount="indefinite" />
              </path>
              <text x={840} y={750} fill="#00f0b5" fontSize="10" fontFamily="monospace" transform="rotate(-60 840 750)">
                ▸ EICC CURRENT (1.1 kt)
              </text>

              <path
                d="M 100 1140 L 1500 1140"
                fill="none" stroke="#ffbb00" strokeWidth="2" strokeDasharray="10 15"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="250" dur="5s" repeatCount="indefinite" />
              </path>
              <text x={700} y={1130} fill="#ffbb00" fontSize="11" fontFamily="monospace" letterSpacing="0.2em">
                EQUATORIAL MONSOON DRIFT JET (1.4 kt Eastward) ▸▸▸
              </text>
            </g>
          )}

          {/* 200 NM EEZ Line */}
          {showEez && (
            <g opacity="0.5" pointerEvents="none">
              <path d={eezPath} fill="none" stroke="#00d4ff" strokeWidth="1.8" strokeDasharray="6 8" />
              <text x={projectCoords(16, 69.5).x} y={projectCoords(16, 69.5).y} fill="#00d4ff" fontSize="10" fontFamily="monospace">
                200 NM INDIAN EEZ MARITIME BOUNDARY
              </text>
            </g>
          )}

          {/* Mainland India */}
          <path
            d={mainlandPath}
            fill="url(#landGrad)"
            stroke="#00d4ff"
            strokeWidth="2.5"
            filter="url(#cyanGlow)"
          />

          {/* Sri Lanka */}
          <path
            d={sriLankaPath}
            fill="#031726"
            stroke="#00a2cc"
            strokeWidth="1.5"
          />
          <text
            x={projectCoords(7.5, 80.8).x}
            y={projectCoords(7.5, 80.8).y}
            fill="#66b2cc"
            fontSize="11"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            SRI LANKA
          </text>

          {/* Andaman & Nicobar Chain */}
          <g>
            {[
              { name: 'North Andaman', lat: 13.5, lon: 92.9 },
              { name: 'Middle Andaman', lat: 12.5, lon: 92.8 },
              { name: 'Port Blair', lat: 11.66, lon: 92.74 },
              { name: 'Car Nicobar', lat: 9.2, lon: 92.8 },
              { name: 'Great Nicobar', lat: 7.0, lon: 93.8 }
            ].map(isl => {
              const { x, y } = projectCoords(isl.lat, isl.lon);
              return (
                <g key={isl.name}>
                  <ellipse cx={x} cy={y} rx="6" ry="14" fill="#05253b" stroke="#00d4ff" strokeWidth="1.5" />
                  <text x={x + 10} y={y + 3} fill="#80dfff" fontSize="9" fontFamily="monospace">{isl.name}</text>
                </g>
              );
            })}
          </g>

          {/* Lakshadweep Coral Atolls Chain */}
          <g>
            {[
              { name: 'Kavaratti', lat: 10.56, lon: 72.64 },
              { name: 'Agatti', lat: 10.85, lon: 72.19 },
              { name: 'Amini', lat: 11.12, lon: 72.73 },
              { name: 'Minicoy', lat: 8.28, lon: 73.05 }
            ].map(isl => {
              const { x, y } = projectCoords(isl.lat, isl.lon);
              return (
                <g key={isl.name}>
                  <circle cx={x} cy={y} r="5" fill="#05253b" stroke="#00f0b5" strokeWidth="1.5" />
                  <text x={x + 8} y={y + 3} fill="#70e2be" fontSize="9" fontFamily="monospace">{isl.name}</text>
                </g>
              );
            })}
          </g>

          {/* ── Coastal Location Pins with LIVE CLIMATE BADGES IN THE MAP ── */}
          {stations.map(st => {
            const { x, y } = projectCoords(st.latitude, st.longitude);
            const isSelected = selectedLocationId === st.id;
            const isHovered = hoveredStation?.id === st.id;
            const verdictColor = st.safety_verdict === 'DANGER' ? '#ff3355' : st.safety_verdict === 'CAUTION' ? '#ffaa00' : '#00f0b5';

            return (
              <g
                key={st.id}
                className="cursor-pointer transition-transform duration-150"
                onMouseEnter={() => setHoveredStation(st)}
                onMouseLeave={() => setHoveredStation(null)}
                onClick={() => {
                  onSelectStation?.(st);
                  onSendMessage?.(`What are live sea conditions and fishing safety at ${st.name}?`);
                }}
              >
                {(isSelected || isHovered) && (
                  <circle
                    cx={x}
                    cy={y}
                    r="24"
                    fill="none"
                    stroke={verdictColor}
                    strokeWidth="2"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}

                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? '8' : isHovered ? '7' : '5.5'}
                  fill={verdictColor}
                  stroke="#00060d"
                  strokeWidth="2"
                  filter="url(#cyanGlow)"
                />

                <circle cx={x} cy={y} r="2.5" fill="#ffffff" />

                <text
                  x={x + 10}
                  y={y - 8}
                  fill="#ffffff"
                  fontSize={isSelected ? '13' : '11'}
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="start"
                  style={{ textShadow: '0 0 8px rgba(0,0,0,0.9), 0 0 12px rgba(0,212,255,0.8)' }}
                >
                  {st.name}
                </text>

                {/* Direct in-map Climate Chip */}
                <g transform={`translate(${x + 10}, ${y + 4})`}>
                  <rect
                    width="130"
                    height="22"
                    rx="6"
                    fill="rgba(0, 16, 32, 0.92)"
                    stroke={isSelected ? '#00d4ff' : 'rgba(0, 212, 255, 0.4)'}
                    strokeWidth={isSelected ? '1.5' : '1'}
                  />

                  {showWaves && (
                    <text x="8" y="15" fill="#00d4ff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      🌊{st.wave_height_m}m
                    </text>
                  )}

                  {showWind && (
                    <text x="54" y="15" fill="#00f0b5" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      💨{st.wind_speed_kmh}k
                    </text>
                  )}

                  {showTemp && (
                    <text x="98" y="15" fill="#ffaa33" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      🌡️{st.temperature_c}°
                    </text>
                  )}

                  <circle cx="124" cy="11" r="3" fill={verdictColor} />
                </g>
              </g>
            );
          })}
        </svg>

        {/* Hovered Expanded Inspection Card */}
        {hoveredStation && (
          <div
            className="absolute z-40 pointer-events-none p-3.5 rounded-2xl bg-[#001020]/95 border border-cyan-400/80 shadow-[0_0_30px_rgba(0,212,255,0.4)] text-xs font-mono space-y-2 max-w-sm"
            style={{ bottom: '24px', left: '24px' }}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-cyan-500/30">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: hoveredStation.safety_verdict === 'DANGER' ? '#ff3355' : hoveredStation.safety_verdict === 'CAUTION' ? '#ffaa00' : '#00f0b5'
                  }}
                />
                <span className="font-bold text-white text-sm">{hoveredStation.name}</span>
              </div>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider"
                style={{
                  backgroundColor: hoveredStation.safety_verdict === 'DANGER' ? 'rgba(255,51,85,0.2)' : hoveredStation.safety_verdict === 'CAUTION' ? 'rgba(255,170,0,0.2)' : 'rgba(0,240,181,0.2)',
                  color: hoveredStation.safety_verdict === 'DANGER' ? '#ff3355' : hoveredStation.safety_verdict === 'CAUTION' ? '#ffaa00' : '#00f0b5'
                }}
              >
                {hoveredStation.safety_verdict}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <div>
                <span className="text-slate-400">REGION:</span>{' '}
                <span className="text-cyan-200">{hoveredStation.state}</span>
              </div>
              <div>
                <span className="text-slate-400">BASIN:</span>{' '}
                <span className="text-cyan-200">{hoveredStation.sea}</span>
              </div>
              <div>
                <span className="text-slate-400">SIGNIFICANT WAVE:</span>{' '}
                <span className="text-cyan-300 font-bold">{hoveredStation.wave_height_m} m</span>
              </div>
              <div>
                <span className="text-slate-400">SWELL:</span>{' '}
                <span className="text-cyan-300">{hoveredStation.swell_height_m || (hoveredStation.wave_height_m * 0.7).toFixed(1)} m</span>
              </div>
              <div>
                <span className="text-slate-400">WIND SPEED:</span>{' '}
                <span className="text-teal-300 font-bold">{hoveredStation.wind_speed_kmh} km/h ({hoveredStation.wind_compass || 'W'})</span>
              </div>
              <div>
                <span className="text-slate-400">SURFACE TEMP:</span>{' '}
                <span className="text-amber-300 font-bold">{hoveredStation.temperature_c} °C</span>
              </div>
              <div>
                <span className="text-slate-400">WEATHER:</span>{' '}
                <span className="text-white">{hoveredStation.weather_desc || 'Mainly Clear'}</span>
              </div>
              <div>
                <span className="text-slate-400">PERIOD:</span>{' '}
                <span className="text-slate-200">{hoveredStation.wave_period_s || 7.0} s</span>
              </div>
            </div>

            {hoveredStation.species && (
              <div className="pt-1 text-[10px] text-cyan-400/80 border-t border-cyan-500/20">
                <strong>TARGET SPECIES:</strong> {hoveredStation.species}
              </div>
            )}

            <div className="text-[9px] text-slate-400 flex justify-between items-center pt-0.5">
              <span>Click to query NEREUS AI Voice Agent</span>
              <span className="text-teal-300">VHF CH 16 / CG 1554</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Legend ── */}
      <div className="h-7 shrink-0 px-4 flex items-center justify-between border-t border-cyan-500/20 bg-[#000d1a] text-[10px] text-slate-400 z-30">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00f0b5]" />
            <span>SAFE (&lt;1.8m)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ffaa00]" />
            <span>CAUTION (1.8m-2.8m)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff3355]" />
            <span>DANGER (&gt;2.8m)</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <span>9 MARITIME STATES + 2 ARCHIPELAGOS</span>
          <span>•</span>
          <span className="text-cyan-400 font-bold">4K VECTOR PROJECTION (HIGH CLARITY)</span>
        </div>

        <div className="flex items-center gap-2 text-cyan-400/80">
          <span>ZOOM: {(zoom * 100).toFixed(0)}%</span>
          <span>•</span>
          <span>SCROLL TO ZOOM</span>
        </div>
      </div>
    </div>
  );
};

export default IndianOceanTacticalMap4K;
