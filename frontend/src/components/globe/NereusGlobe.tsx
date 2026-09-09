import React, { useEffect, useRef, useState } from "react";
import { createGlobeScene, GlobeSceneApi, PinpointData } from "../../lib/globeScene";
import { AICoreState, LayerState } from "../../types";
import { INDIAN_COASTS } from "../../lib/indianCoasts";
import {
  Plus, Minus, RotateCcw, Play, Pause, MapPin, Waves, Compass,
  Activity, Shield, Eye, Layers, Sparkles
} from "lucide-react";

interface NereusGlobeProps {
  coreState: AICoreState;
  layers: LayerState;
  selectedLocation?: { lat: number; lon: number } | null;
  pinLocation?: { lat: number; lon: number } | null;
  selectedCoastId?: string;
  onPinpoint?: (data: PinpointData) => void;
  onCoastSelect?: (coastId: string) => void;
  onCalloutSelect?: (type: string) => void;
}

export const NereusGlobe: React.FC<NereusGlobeProps> = ({
  coreState,
  layers,
  selectedLocation,
  pinLocation,
  selectedCoastId = "konkan",
  onPinpoint,
  onCoastSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneApiRef = useRef<GlobeSceneApi | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [activePin, setActivePin] = useState<PinpointData | null>(null);
  const [fps, setFps] = useState(60);

  // FPS monitor
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measureFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measureFps);
    };
    animId = requestAnimationFrame(measureFps);

    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const scene = createGlobeScene(
      containerRef.current,
      (data) => {
        setActivePin(data);
        onPinpoint?.(data);
      },
      (coastId) => onCoastSelect?.(coastId)
    );
    sceneApiRef.current = scene;

    return () => {
      scene.dispose();
      sceneApiRef.current = null;
    };
  }, [onPinpoint, onCoastSelect]);

  useEffect(() => {
    sceneApiRef.current?.setState(coreState);
  }, [coreState]);

  useEffect(() => {
    sceneApiRef.current?.setLayers(layers);
  }, [layers]);

  useEffect(() => {
    if (selectedLocation && sceneApiRef.current) {
      sceneApiRef.current.focusLocation(selectedLocation.lat, selectedLocation.lon);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (pinLocation && sceneApiRef.current) {
      sceneApiRef.current.setPin(pinLocation.lat, pinLocation.lon);
    }
  }, [pinLocation]);

  const handleToggleRotate = () => {
    if (sceneApiRef.current) {
      const next = sceneApiRef.current.toggleAutoRotate();
      setIsAutoRotating(next);
    }
  };

  const handleSelectCoast = (coastId: string) => {
    onCoastSelect?.(coastId);
    sceneApiRef.current?.focusCoast(coastId);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#010712] select-none">
      {/* 3D WebGL Canvas Mount — High Frame-Rate 4K Engine */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      {/* Top Floating All-India Coasts Quick Navigation Strip */}
      <div className="absolute top-3 left-4 right-4 z-20 pointer-events-none flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#020d1f]/90 border border-cyan-400/40 backdrop-blur-xl shadow-[0_0_30px_rgba(0,229,255,0.25)] pointer-events-auto overflow-x-auto max-w-full scrollbar-none">
          <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono text-cyan-300 font-bold shrink-0 border-r border-cyan-500/30">
            <Waves className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="tracking-wider">INDIAN COASTS:</span>
          </div>

          {INDIAN_COASTS.map((coast) => {
            const isSelected = coast.id === selectedCoastId;
            return (
              <button
                key={coast.id}
                onClick={() => handleSelectCoast(coast.id)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-bold shadow-[0_0_18px_rgba(0,229,255,0.7)] scale-105"
                    : "bg-cyan-950/50 hover:bg-cyan-900/80 border border-cyan-500/20 text-cyan-200 hover:border-cyan-400"
                }`}
                title={`${coast.name} (${coast.states})`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    coast.safety_verdict === "SAFE"
                      ? "bg-emerald-400 shadow-[0_0_6px_#34d399]"
                      : "bg-amber-400 animate-ping shadow-[0_0_6px_#fbbf24]"
                  }`}
                />
                {coast.name.split(" ")[0]}
              </button>
            );
          })}
        </div>

        {/* Pinpoint Telemetry Readout */}
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#02132b]/85 border border-cyan-400/30 backdrop-blur-md text-[10px] font-mono text-cyan-200 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
          <MapPin className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          {activePin ? (
            <span>
              LOCKED TARGET: <strong className="text-cyan-100">{activePin.locationName}</strong> [Lat {activePin.latitude}° / Lon {activePin.longitude}°]
            </span>
          ) : (
            <span>Click any Indian coastline point to lock GPS coordinates & live marine climate • Drag to rotate 360°</span>
          )}
        </div>
      </div>

      {/* Floating HUD Controls (Zoom In, Zoom Out, Auto-Rotate, Reset) */}
      <div className="absolute right-5 bottom-24 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={() => sceneApiRef.current?.zoomIn()}
          className="w-10 h-10 rounded-xl bg-[#021126]/90 border border-cyan-500/40 text-cyan-300 flex items-center justify-center hover:bg-cyan-900/80 hover:border-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => sceneApiRef.current?.zoomOut()}
          className="w-10 h-10 rounded-xl bg-[#021126]/90 border border-cyan-500/40 text-cyan-300 flex items-center justify-center hover:bg-cyan-900/80 hover:border-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleToggleRotate}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
            isAutoRotating
              ? "bg-cyan-500 text-black border-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.8)]"
              : "bg-[#021126]/90 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80 hover:border-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          }`}
          title={isAutoRotating ? "Pause Auto-Rotation" : "Enable Auto-Rotation"}
        >
          {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={() => sceneApiRef.current?.resetView()}
          className="w-10 h-10 rounded-xl bg-[#021126]/90 border border-cyan-500/40 text-cyan-300 flex items-center justify-center hover:bg-cyan-900/80 hover:border-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all"
          title="Center India (Reset View)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Sleek Mini Holographic AI Status & FPS Telemetry Orb */}
      <div className="absolute top-20 right-4 z-20 pointer-events-none flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[#020d1f]/90 border border-cyan-400/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.25)]">
          <div className="relative w-6 h-6 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full ${coreState === "WARNING" ? "bg-red-400 animate-ping" : "bg-teal-400 animate-pulse"}`} />
          </div>
          <div className="text-[10px] font-mono leading-none">
            <div className="text-cyan-200 font-bold">NEREUS CORE AI</div>
            <div className="text-cyan-400/70 text-[8px]">{coreState}</div>
          </div>
        </div>

        {/* Live FPS Telemetry Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-teal-500/30 text-[9px] font-mono text-teal-300 backdrop-blur-sm">
          <Activity className="w-3 h-3 text-teal-400 animate-pulse" />
          <span>{fps} FPS</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-300">WebGL 2.0</span>
        </div>
      </div>

      {/* 4K Ultra-HD Satellite Engine HUD Badge */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#021126]/90 border border-cyan-400/50 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.3)]">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00e5ff]" />
        <span className="text-[10px] font-mono text-cyan-200 font-bold tracking-wider">
          4K AI SATELLITE GLOBE
        </span>
        <span className="text-[9px] font-mono text-teal-300 bg-teal-950/90 px-1.5 py-0.5 rounded border border-teal-500/40">
          4096 × 2048 • 60+ FPS
        </span>
      </div>
    </div>
  );
};
