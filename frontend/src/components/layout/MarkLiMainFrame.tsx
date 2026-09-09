/**
 * NEREUS × MARK-LI Master Main Frame
 * ====================================
 * Faithful adaptation of the Mark-LI desktop UI framework (from ui.py)
 * blended with NEREUS Indian Marine Intelligence & Safety telemetry.
 *
 * Architecture:
 * - Header: Mark-LI badge, NEREUS title with cyan glow, live precision clock & date
 * - Left Panel: System & Ocean telemetry bars (CPU, MEM, NET, WAVE, SST), uptime, status tags
 * - Center: Mark-LI Arc-Reactor Holographic HUD Canvas with counter-rotating rings,
 *           sweeping radar beams, particle sparks, quick command bar, and collapsible briefing
 * - Right Panel: Cyber activity log, live PFZ pelagic fish cards, and sonar/file drop zone
 * - Top Bar: All-India Coasts quick selector strip (Gujarat to Andaman)
 * - Footer: Hotkeys ([F4] Voice, [Space] Speak, [Esc] Stop), multi-agent engine status
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  AICoreState, ChatMessage, PFZItem, WeatherData, AlertItem, LayerState
} from "../../types";
import { INDIAN_COASTS, IndianCoastInfo } from "../../lib/indianCoasts";
import { VoiceLanguage } from "../../lib/languages";
import { soundEffects } from "../../lib/soundEffects";
import { IndianOceanTacticalMap4K, CoastalStation } from "../map/IndianOceanTacticalMap4K";
import {
  Zap, Activity, Shield, Waves, Radio, MapPin, Send,
  Volume2, VolumeX, Mic, MicOff, Settings, Upload, X,
  ChevronRight, ChevronDown, Sparkles, AlertTriangle, Check, KeyRound
} from "lucide-react";

// ── Mark-LI Color Palette (from ui.py class C) ────────────────────────────────
const C = {
  BG:       "#00060a",
  PANEL:    "#010d14",
  PANEL2:   "#010f18",
  BORDER:   "#0d3347",
  BORDER_B: "#1a5c7a",
  BORDER_A: "#0f4060",
  PRI:      "#00d4ff",
  PRI_DIM:  "#007a99",
  PRI_GHO:  "rgba(0, 31, 46, 0.7)",
  ACC:      "#ff6b00",
  ACC2:     "#ffcc00",
  GREEN:    "#00ff88",
  RED:      "#ff3355",
  TEXT:     "#8ffcff",
  TEXT_DIM: "#3a8a9a",
  TEXT_MED: "#5ab8cc",
  WHITE:    "#d8f8ff",
  DARK:     "#000d14",
  BAR_BG:   "#011520",
};

interface MarkLiMainFrameProps {
  coreState: AICoreState;
  messages: ChatMessage[];
  pfzList: PFZItem[];
  weather: WeatherData;
  alerts: AlertItem[];
  currentLanguage: VoiceLanguage;
  selectedCoastId: string;
  isListening: boolean;
  isSpeaking: boolean;
  onSendMessage: (text: string) => void;
  onVoiceToggle: () => void;
  onOpenVoiceModal: () => void;
  onOpenApiKeyModal?: () => void;
  onSelectCoast: (coastId: string) => void;
  onPinpointLocation: (lat: number, lon: number, name?: string) => void;
  coastalStations?: CoastalStation[];
  isOffline?: boolean;
  lastUpdatedTelemetry?: string;
}

export const MarkLiMainFrame: React.FC<MarkLiMainFrameProps> = ({
  coreState,
  messages,
  pfzList,
  weather,
  alerts,
  currentLanguage,
  selectedCoastId,
  isListening,
  isSpeaking,
  onSendMessage,
  onVoiceToggle,
  onOpenVoiceModal,
  onOpenApiKeyModal,
  onSelectCoast,
  onPinpointLocation,
  coastalStations,
  isOffline = false,
  lastUpdatedTelemetry = "",
}) => {
  // ── View Mode: 4K Map vs Arc Reactor ────────────────────────────────────────
  const [centerViewMode, setCenterViewMode] = useState<"map" | "reactor">("map");

  const stationsData: CoastalStation[] = useMemo(() => {
    if (coastalStations && coastalStations.length > 0) {
      return coastalStations;
    }
    return INDIAN_COASTS.map((c) => ({
      id: c.id,
      name: c.name,
      state: c.states,
      sea: c.sea,
      latitude: c.latitude,
      longitude: c.longitude,
      wave_height_m: c.wave_height_m,
      wind_speed_kmh: c.wind_speed_kmh,
      temperature_c: c.sst_c,
      safety_verdict: c.safety_verdict,
      species: c.target_species,
      is_live_telemetry: !isOffline,
    }));
  }, [coastalStations, isOffline]);

  // ── Coastal Conditions Matrix: Harsh / Moderate / Safe ──────────────────────
  const [conditionsFilter, setConditionsFilter] = useState<"ALL" | "HARSH" | "MODERATE" | "SAFE">("ALL");

  const categorizedStations = useMemo(() => {
    const harsh: CoastalStation[] = [];
    const moderate: CoastalStation[] = [];
    const safe: CoastalStation[] = [];

    stationsData.forEach((st) => {
      if (st.wave_height_m >= 1.8 || st.wind_speed_kmh >= 28.0 || st.safety_verdict === "DANGER") {
        harsh.push(st);
      } else if (
        st.wave_height_m >= 1.1 ||
        st.wind_speed_kmh >= 16.0 ||
        st.safety_verdict === "CAUTION"
      ) {
        moderate.push(st);
      } else {
        safe.push(st);
      }
    });

    return { harsh, moderate, safe };
  }, [stationsData]);

  const filteredMatrixStations = useMemo(() => {
    if (conditionsFilter === "HARSH") return categorizedStations.harsh;
    if (conditionsFilter === "MODERATE") return categorizedStations.moderate;
    if (conditionsFilter === "SAFE") return categorizedStations.safe;
    return stationsData;
  }, [conditionsFilter, categorizedStations, stationsData]);

  // ── Telemetry Clock & System States ─────────────────────────────────────────
  const [clockStr, setClockStr] = useState("00:00:00");
  const [dateStr, setDateStr] = useState("");
  const [uptimeSeconds, setUptimeSeconds] = useState(15740);
  const [commandInput, setCommandInput] = useState("");
  const [contentBriefing, setContentBriefing] = useState<{ title: string; text: string } | null>({
    title: "OPERATIONAL MARITIME BRIEFING",
    text: "NEREUS Multi-Agent Maritime Intelligence System initialized.\nINCOIS satellite telemetry synced. Real-time Potential Fishing Zones (PFZ) active across Arabian Sea and Bay of Bengal. All 10 regional Indian languages ready for real-time voice consultation.",
  });
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 28,
    mem: 44,
    net: 76,
    wave: 38,
    sst: 65,
  });

  // Terminal log stream
  const [activityLogs, setActivityLogs] = useState<Array<{ time: string; text: string; type?: string }>>([
    { time: "14:12:02", text: "INCOIS MOSDAC satellite composite downloaded", type: "sys" },
    { time: "14:12:15", text: "PFZ algorithms detected 7 active pelagic schools", type: "pfz" },
    { time: "14:12:30", text: "IMD weather radar synced: Wave height 2.2m off Visakhapatnam", type: "wave" },
    { time: "14:12:44", text: "Gemini 3.6 Flash neural voice agent online (10 languages)", type: "ai" },
    { time: "14:13:00", text: "VHF Channel 16 coast guard monitoring active", type: "sys" },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Clock timer
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockStr(now.toLocaleTimeString("en-GB", { hour12: false }));
      setDateStr(now.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  // System uptime & simulated dynamic metrics
  useEffect(() => {
    const t = setInterval(() => {
      setUptimeSeconds(s => s + 2);
      setSystemMetrics({
        cpu: Math.floor(22 + Math.random() * 18),
        mem: Math.floor(42 + Math.random() * 5),
        net: Math.floor(70 + Math.random() * 25),
        wave: Math.floor((weather.wave_height_m / 4.0) * 100),
        sst: Math.floor((weather.temperature / 40.0) * 100),
      });
    }, 2000);
    return () => clearInterval(t);
  }, [weather]);

  // Log incoming chat messages
  useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      const now = new Date().toLocaleTimeString("en-GB", { hour12: false });
      if (last.sender === "user") {
        setActivityLogs(prev => [...prev.slice(-15), { time: now, text: `QUERY: "${last.text.slice(0, 48)}"`, type: "user" }]);
      } else {
        setActivityLogs(prev => [...prev.slice(-15), { time: now, text: `ADVISORY: Verdict [${last.verdict || "SAFE"}]`, type: "ai" }]);
        setContentBriefing({
          title: `NEREUS MARITIME INTELLIGENCE — ${last.verdict || "ADVISORY"}`,
          text: last.text,
        });
      }
    }
  }, [messages]);

  // ── Mark-LI Arc-Reactor Hologram Canvas Engine (from ui.py HudCanvas) ────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let tick = 0;
    let scanAngle = 0;
    let scanAngle2 = 180;
    let rings = [0, 120, 240];
    let pulses = [0, 60, 120];
    let scale = 1.0;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; alpha: number }> = [];

    const renderHud = () => {
      tick++;
      animId = requestAnimationFrame(renderHud);

      const W = canvas.width = canvas.clientWidth;
      const H = canvas.height = canvas.clientHeight;
      const cx = W / 2;
      const cy = H / 2;
      const fw = Math.min(W, H);

      ctx.clearRect(0, 0, W, H);

      // Dynamic scaling
      const targetScale = isSpeaking ? 1.08 : isListening ? 1.05 : 1.0;
      scale += (targetScale - scale) * 0.12;

      // Rotation speeds
      const spd1 = isSpeaking ? 1.8 : 0.6;
      const spd2 = isSpeaking ? -1.4 : -0.4;
      const spd3 = isSpeaking ? 2.2 : 0.9;
      rings[0] = (rings[0] + spd1) % 360;
      rings[1] = (rings[1] + spd2) % 360;
      rings[2] = (rings[2] + spd3) % 360;

      scanAngle = (scanAngle + (isSpeaking ? 3.5 : 1.5)) % 360;
      scanAngle2 = (scanAngle2 + (isSpeaking ? -2.5 : -1.0)) % 360;

      // Pulse waves
      const pulseLimit = fw * 0.46;
      pulses = pulses.map(p => p + (isSpeaking ? 3.5 : 1.5)).filter(p => p < pulseLimit);
      if (pulses.length < 3 && Math.random() < 0.04) {
        pulses.push(fw * 0.12);
      }

      // ── 1. Expanding Pulse Wave Rings ────────────────────────────────────
      pulses.forEach(pr => {
        const alpha = Math.max(0, 1.0 - (pr / pulseLimit));
        ctx.strokeStyle = isListening ? `rgba(255, 51, 85, ${alpha * 0.5})` : isSpeaking ? `rgba(0, 240, 181, ${alpha * 0.5})` : `rgba(0, 212, 255, ${alpha * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, pr, 0, Math.PI * 2);
        ctx.stroke();
      });

      // ── 2. Radar Sweep Beam ──────────────────────────────────────────────
      const radSweep = (scanAngle * Math.PI) / 180;
      const sweepLen = fw * 0.42;
      const sweepX = cx + Math.cos(radSweep) * sweepLen;
      const sweepY = cy + Math.sin(radSweep) * sweepLen;

      const sweepGrad = ctx.createLinearGradient(cx, cy, sweepX, sweepY);
      sweepGrad.addColorStop(0, "rgba(0, 212, 255, 0.4)");
      sweepGrad.addColorStop(1, "rgba(0, 212, 255, 0)");
      ctx.strokeStyle = sweepGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      // ── 3. Counter-Rotating Segmented Telemetry Rings ────────────────────
      // Outer segmented ring
      const rOuter = (fw * 0.38) * scale;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rings[0] * Math.PI) / 180);
      ctx.strokeStyle = isListening ? "#ff3355" : C.PRI;
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const start = (i * 30 * Math.PI) / 180;
        const end = ((i * 30 + 18) * Math.PI) / 180;
        ctx.beginPath();
        ctx.arc(0, 0, rOuter, start, end);
        ctx.stroke();
      }
      ctx.restore();

      // Mid counter-rotating ring with tick marks
      const rMid = (fw * 0.28) * scale;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rings[1] * Math.PI) / 180);
      ctx.strokeStyle = C.PRI_DIM;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, rMid, 0, Math.PI * 2);
      ctx.stroke();

      // 6 radial bolts / spokes
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 * Math.PI) / 180;
        ctx.strokeStyle = "rgba(0, 212, 255, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * (rMid * 0.6), Math.sin(angle) * (rMid * 0.6));
        ctx.lineTo(Math.cos(angle) * rMid, Math.sin(angle) * rMid);
        ctx.stroke();
      }
      ctx.restore();

      // Inner tactical ring
      const rInner = (fw * 0.18) * scale;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rings[2] * Math.PI) / 180);
      ctx.strokeStyle = isSpeaking ? C.GREEN : C.PRI;
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 4; i++) {
        const start = (i * 90 * Math.PI) / 180;
        const end = ((i * 90 + 55) * Math.PI) / 180;
        ctx.beginPath();
        ctx.arc(0, 0, rInner, start, end);
        ctx.stroke();
      }
      ctx.restore();

      // ── 4. Central Glowing Arc Core ──────────────────────────────────────
      const rCore = (fw * 0.11) * scale;
      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, rCore * 1.8);
      const coreColor = isListening ? "#ff3355" : isSpeaking ? "#00f0b5" : coreState === "WARNING" ? "#ff3355" : C.PRI;
      coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      coreGrad.addColorStop(0.3, coreColor);
      coreGrad.addColorStop(0.7, "rgba(0, 212, 255, 0.3)");
      coreGrad.addColorStop(1, "rgba(0, 6, 10, 0)");

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, rCore * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Core white center
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, rCore * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // ── 5. Particle Sparks When Speaking ─────────────────────────────────
      if (isSpeaking && Math.random() < 0.4) {
        const ang = Math.random() * Math.PI * 2;
        const dist = rCore * 1.2;
        particles.push({
          x: cx + Math.cos(ang) * dist,
          y: cy + Math.sin(ang) * dist,
          vx: Math.cos(ang) * (1.2 + Math.random() * 2.0),
          vy: Math.sin(ang) * (1.2 + Math.random() * 2.0),
          alpha: 1.0,
        });
      }

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        ctx.fillStyle = `rgba(0, 240, 181, ${Math.max(0, p.alpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
      particles = particles.filter(p => p.alpha > 0);
    };

    renderHud();
    return () => cancelAnimationFrame(animId);
  }, [isListening, isSpeaking, coreState]);

  // Format uptime
  const formatUptime = (sec: number) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, "0");
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    const q = commandInput.trim();
    setCommandInput("");
    onSendMessage(q);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col select-none font-mono"
      style={{ background: C.BG, color: C.TEXT }}
    >
      {/* ─── 1. MARK-LI HEADER BAR (_build_header) ─── */}
      <header
        className="h-14 shrink-0 flex items-center justify-between px-5 border-b z-30"
        style={{ background: C.DARK, borderColor: C.BORDER_B }}
      >
        {/* Left: Badge & Quick Settings Button */}
        <div className="flex items-center gap-3">
          <span
            className="px-2.5 py-1 rounded text-[11px] font-bold tracking-widest uppercase border"
            style={{ color: C.PRI, borderColor: C.BORDER_B, background: C.PANEL }}
          >
            NEREUS • MARK LI
          </span>
          <button
            onClick={onVoiceToggle}
            className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer border hover:scale-105"
            style={{
              background: isListening ? "#ff3355" : isSpeaking ? C.GREEN : C.PANEL2,
              color: isListening ? "#ffffff" : isSpeaking ? "#000000" : C.PRI,
              borderColor: isListening ? "#ff3355" : C.PRI_DIM
            }}
            title="Toggle Voice Assistant"
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isListening ? "LISTENING" : isSpeaking ? "SPEAKING" : "VOICE ASSISTANT"}</span>
          </button>
          {onOpenApiKeyModal && (
            <button
              onClick={onOpenApiKeyModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer border hover:scale-105"
              style={{ background: C.PANEL2, color: C.ACC2, borderColor: C.BORDER_B }}
              title="Configure API Keys & Engine Settings"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>API KEYS</span>
            </button>
          )}
        </div>

        {/* Center: Title & Subtitle */}
        <div className="flex flex-col items-center">
          <h1
            className="text-lg font-bold tracking-[0.3em] font-heading"
            style={{ color: C.PRI, textShadow: "0 0 15px rgba(0,212,255,0.6)" }}
          >
            N E R E U S
          </h1>
          <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: C.TEXT_DIM }}>
            Ocean Intelligence • Autonomous Marine AI System
          </span>
        </div>

        {/* Right: Real-time Precision Clock & Date */}
        <div className="flex flex-col items-end">
          <span
            className="text-base font-bold tracking-wider"
            style={{ color: C.PRI, textShadow: "0 0 10px rgba(0,212,255,0.5)" }}
          >
            {clockStr}
          </span>
          <span className="text-[10px]" style={{ color: C.TEXT_DIM }}>
            {dateStr}
          </span>
        </div>
      </header>

      {/* ─── 2. ALL-INDIA COASTS HORIZONTAL STRIP ─── */}
      <div
        className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 border-b overflow-x-auto scrollbar-none z-20"
        style={{ background: C.PANEL, borderColor: C.BORDER }}
      >
        <div className="flex items-center gap-1.5 pr-2 border-r text-[10px] font-bold shrink-0" style={{ color: C.PRI, borderColor: C.BORDER }}>
          <Waves className="w-3.5 h-3.5" />
          <span>COASTAL RADAR:</span>
        </div>
        {INDIAN_COASTS.map((coast) => {
          const isSelected = coast.id === selectedCoastId;
          return (
            <button
              key={coast.id}
              onClick={() => onSelectCoast(coast.id)}
              className="px-2.5 py-1 rounded text-[10px] whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border"
              style={{
                background: isSelected ? C.PRI : C.PANEL2,
                color: isSelected ? "#000000" : C.TEXT,
                borderColor: isSelected ? C.PRI : C.BORDER,
                fontWeight: isSelected ? "bold" : "normal",
                boxShadow: isSelected ? "0 0 12px rgba(0,212,255,0.7)" : "none",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: coast.safety_verdict === "SAFE" ? C.GREEN : C.ACC2,
                }}
              />
              <span>{coast.name.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* ─── 3. BODY: 3-COLUMN SPLIT (Left Sys, Center HUD, Right Activity) ─── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* ─── LEFT PANEL: System & Ocean Telemetry (_build_left_panel) ─── */}
        <div
          className="w-56 shrink-0 flex flex-col p-3 border-r overflow-y-auto space-y-4"
          style={{ background: C.DARK, borderColor: C.BORDER }}
        >
          {/* Header */}
          <div className="pb-2 border-b text-[10px] font-bold tracking-wider flex items-center gap-1.5" style={{ color: C.PRI, borderColor: C.BORDER }}>
            <Activity className="w-3.5 h-3.5" />
            <span>◈ SYS & OCEAN MONITOR</span>
          </div>

          {/* Telemetry Metric Bars */}
          <div className="space-y-2.5">
            {[
              { label: "CPU CORE", val: systemMetrics.cpu, color: C.PRI, unit: "%" },
              { label: "MEMORY", val: systemMetrics.mem, color: C.ACC2, unit: "%" },
              { label: "NET UPLINK", val: systemMetrics.net, color: C.GREEN, unit: "%" },
              { label: "SWELL WAVE", val: systemMetrics.wave, color: "#ff6688", unit: "%" },
              { label: "OCEAN SST", val: systemMetrics.sst, color: C.ACC, unit: "%" },
            ].map(m => (
              <div key={m.label} className="space-y-1">
                <div className="flex justify-between text-[9px]">
                  <span style={{ color: C.TEXT_MED }}>{m.label}</span>
                  <span style={{ color: m.color }} className="font-bold">{m.val}{m.unit}</span>
                </div>
                <div className="h-1.5 w-full rounded-sm overflow-hidden" style={{ background: C.BAR_BG }}>
                  <div
                    className="h-full transition-all duration-700 rounded-sm"
                    style={{ width: `${m.val}%`, background: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* System Info Card */}
          <div className="p-2.5 rounded border space-y-1 text-[10px]" style={{ background: C.PANEL2, borderColor: C.BORDER }}>
            <div className="flex justify-between">
              <span style={{ color: C.TEXT_DIM }}>UPTIME</span>
              <span style={{ color: C.GREEN }} className="font-bold">{formatUptime(uptimeSeconds)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: C.TEXT_DIM }}>PROCESS</span>
              <span style={{ color: C.TEXT_MED }}>AUTONOMOUS</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: C.TEXT_DIM }}>OS PROTOCOL</span>
              <span style={{ color: C.ACC2 }}>WIN-X64</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: C.TEXT_DIM }}>LANGUAGE</span>
              <span style={{ color: C.PRI }}>{currentLanguage.name}</span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="space-y-1.5 pt-1">
            {[
              { text: "AI CORE ACTIVE", color: C.GREEN },
              { text: "SECURITY CLEARED", color: C.PRI },
              { text: "PROTOCOL INCOIS-XL", color: C.TEXT_DIM },
            ].map(b => (
              <div
                key={b.text}
                className="py-1 px-2 rounded text-[9px] font-bold text-center border"
                style={{ color: b.color, borderColor: C.BORDER_A, background: C.PANEL2 }}
              >
                {b.text}
              </div>
            ))}
          </div>

          {/* Coast Verdict Snapshot */}
          <div className="p-2.5 rounded border space-y-1 text-[10px]" style={{ background: C.PANEL, borderColor: C.BORDER_B }}>
            <div className="font-bold" style={{ color: C.PRI }}>ACTIVE COAST STATE</div>
            <div className="text-[11px] font-bold text-white capitalize">{selectedCoastId} Coast</div>
            <div className="text-[9px]" style={{ color: C.TEXT_MED }}>
              Wave: {weather.wave_height_m}m • SST: {weather.temperature}°C
            </div>
            <div className="text-[9px] font-bold" style={{ color: C.GREEN }}>
              STATUS: {coreState}
            </div>
          </div>
        </div>

        {/* ─── CENTER COLUMN: 4K Tactical Ocean Map & Arc-Reactor HUD ─── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0" style={{ background: C.BG }}>

          {/* View Switcher Header Bar */}
          <div
            className="h-9 px-4 shrink-0 border-b flex items-center justify-between text-xs"
            style={{ background: C.PANEL, borderColor: C.BORDER }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCenterViewMode("map")}
                className={`px-3 py-1 rounded font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  centerViewMode === "map"
                    ? "bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_12px_rgba(0,212,255,0.3)]"
                    : "bg-transparent text-slate-400 border-transparent hover:text-white"
                }`}
              >
                <span>🗺️</span>
                <span>4K INDIAN OCEAN MAP</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 font-mono">LIVE CLIMATE</span>
              </button>

              <button
                onClick={() => setCenterViewMode("reactor")}
                className={`px-3 py-1 rounded font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  centerViewMode === "reactor"
                    ? "bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_12px_rgba(0,212,255,0.3)]"
                    : "bg-transparent text-slate-400 border-transparent hover:text-white"
                }`}
              >
                <span>⚛️</span>
                <span>ARC REACTOR HUD</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-[10px]" style={{ color: C.TEXT_DIM }}>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: isOffline ? "#ffaa00" : C.GREEN }} />
                <span>{isOffline ? "OFFLINE CACHED" : "1-MIN CONTINUOUS SYNC"}</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="text-cyan-400 hidden sm:inline">{stationsData.length} COASTAL LOCATIONS PINNED</span>
            </div>
          </div>

          {/* Main Stage: 4K Map or Arc Reactor Canvas */}
          {centerViewMode === "map" ? (
            <div className="relative flex-1 min-h-[340px] overflow-hidden">
              <IndianOceanTacticalMap4K
                stations={stationsData}
                selectedLocationId={selectedCoastId}
                onSelectStation={(st) => {
                  onSelectCoast(st.id);
                  onPinpointLocation(st.latitude, st.longitude, st.name);
                }}
                onSendMessage={onSendMessage}
                isOffline={isOffline}
                lastUpdated={lastUpdatedTelemetry}
              />
            </div>
          ) : (
            <div className="relative flex-1 min-h-[320px] flex items-center justify-center overflow-hidden">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

              {/* Overlaid Center Telemetry Badges */}
              <div className="relative z-10 flex flex-col items-center pointer-events-auto">
                <div
                  className="px-3 py-1 rounded-full text-[11px] font-bold tracking-widest border mb-2 uppercase"
                  style={{
                    color: isListening ? "#ff3355" : isSpeaking ? C.GREEN : C.PRI,
                    borderColor: isListening ? "#ff3355" : C.PRI_DIM,
                    background: C.PANEL2,
                    boxShadow: "0 0 20px rgba(0,212,255,0.3)",
                  }}
                >
                  {isListening ? "LISTENING..." : isSpeaking ? "NEREUS SPEAKING" : "AUTONOMOUS CORE READY"}
                </div>

                {/* Central Audio Trigger Orb */}
                <button
                  onClick={onVoiceToggle}
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer border-2 hover:scale-110 shadow-lg"
                  style={{
                    background: isListening ? "#ff3355" : isSpeaking ? C.GREEN : "rgba(0, 31, 46, 0.8)",
                    borderColor: isListening ? "#ff3355" : C.PRI,
                    boxShadow: "0 0 30px rgba(0,212,255,0.5)",
                  }}
                  title="Click to Speak"
                >
                  {isSpeaking ? (
                    <Volume2 className="w-7 h-7 text-black animate-bounce" />
                  ) : isListening ? (
                    <MicOff className="w-7 h-7 text-white" />
                  ) : (
                    <Mic className="w-7 h-7" style={{ color: C.PRI }} />
                  )}
                </button>

                <span className="text-[9px] mt-2 tracking-widest uppercase" style={{ color: C.TEXT_DIM }}>
                  CLICK CORE OR PRESS [SPACE] TO SPEAK
                </span>
              </div>

              {/* Floating Top Radar Status Badge */}
              <div className="absolute top-4 left-6 pointer-events-none">
                <div className="text-[10px] font-bold" style={{ color: C.PRI }}>◈ SATELLITE TELEMETRY</div>
                <div className="text-[9px]" style={{ color: C.TEXT_DIM }}>MOSDAC OCEANSAT-3 LINKED</div>
              </div>

              <div className="absolute top-4 right-6 pointer-events-none text-right">
                <div className="text-[10px] font-bold" style={{ color: C.ACC2 }}>INCOIS PFZ GRID</div>
                <div className="text-[9px]" style={{ color: C.TEXT_DIM }}>7 ZONES DETECTED</div>
              </div>
            </div>
          )}

          {/* Quick Preset Queries Bar */}
          <div
            className="px-4 py-2 border-t flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0"
            style={{ background: C.PANEL, borderColor: C.BORDER }}
          >
            <span className="text-[9px] font-bold shrink-0" style={{ color: C.TEXT_DIM }}>PRESETS:</span>
            {[
              "Is it safe to fish off Kochi tomorrow?",
              "PFZ zone kahan hai?",
              "நாளை கடலில் வானிலை எப்படி?",
              "Visakhapatnam wave height & cyclone risk?",
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => onSendMessage(q)}
                className="px-2.5 py-1 rounded text-[10px] whitespace-nowrap transition-all border hover:border-cyan-400 hover:text-white cursor-pointer shrink-0"
                style={{ background: C.PANEL2, color: C.TEXT_MED, borderColor: C.BORDER }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Command Input Row (_build_input_row) */}
          <div
            className="p-3 border-t shrink-0"
            style={{ background: C.DARK, borderColor: C.BORDER_B }}
          >
            <form onSubmit={handleCommandSubmit} className="flex gap-2">
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Type a maritime command or question (English, Hindi, Tamil, Telugu...)"
                className="flex-1 px-3.5 py-2 rounded text-xs focus:outline-none transition-all border"
                style={{
                  background: "#000d14",
                  color: C.WHITE,
                  borderColor: C.BORDER,
                }}
              />
              <button
                type="submit"
                disabled={!commandInput.trim()}
                className="px-4 py-2 rounded font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border disabled:opacity-40"
                style={{
                  background: C.PANEL,
                  color: C.PRI,
                  borderColor: C.PRI_DIM,
                }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>EXECUTE ▸</span>
              </button>
            </form>
          </div>

          {/* Collapsible Content Briefing Panel (_build_content_panel) */}
          {contentBriefing && (
            <div
              className="p-3.5 border-t shrink-0 max-h-48 overflow-y-auto"
              style={{ background: C.PANEL, borderColor: C.BORDER_B }}
            >
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b" style={{ borderColor: C.BORDER }}>
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider" style={{ color: C.PRI }}>
                  <span>◈</span>
                  <span>{contentBriefing.title}</span>
                </div>
                <button
                  onClick={() => setContentBriefing(null)}
                  className="text-[9px] px-2 py-0.5 rounded border hover:text-white cursor-pointer"
                  style={{ color: C.TEXT_DIM, borderColor: C.BORDER }}
                >
                  DISMISS ✕
                </button>
              </div>
              <div className="text-xs leading-relaxed whitespace-pre-line" style={{ color: C.TEXT }}>
                {contentBriefing.text}
              </div>
            </div>
          )}
        </div>

        {/* ─── RIGHT PANEL: Mark-LI Activity Log & PFZ Feeds (_build_right_panel) ─── */}
        <div
          className="w-80 shrink-0 flex flex-col p-3 border-l overflow-y-auto space-y-4"
          style={{ background: C.DARK, borderColor: C.BORDER }}
        >
          {/* Header */}
          <div className="pb-2 border-b text-[10px] font-bold tracking-wider flex items-center gap-1.5" style={{ color: C.PRI, borderColor: C.BORDER }}>
            <span>▸</span>
            <span>ACTIVITY LOG & FEEDS</span>
          </div>

          {/* Retro Cyber Activity Log Stream (from LogWidget in ui.py) */}
          <div
            className="flex-1 p-2.5 rounded border overflow-y-auto min-h-[140px] max-h-[220px] space-y-1 text-[10px]"
            style={{ background: C.PANEL2, borderColor: C.BORDER }}
          >
            {activityLogs.map((log, i) => (
              <div key={i} className="leading-snug">
                <span style={{ color: C.TEXT_DIM }}>[{log.time}]</span>{" "}
                <span
                  style={{
                    color: log.type === "ai" ? C.GREEN : log.type === "user" ? C.PRI : log.type === "wave" ? C.ACC : C.TEXT_MED
                  }}
                >
                  {log.text}
                </span>
              </div>
            ))}
          </div>

          {/* Potential Fishing Zones (PFZ) Feed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold" style={{ color: C.TEXT_MED }}>
              <span>▸ LIVE PFZ CORRIDORS</span>
              <span className="text-[9px]" style={{ color: C.GREEN }}>{pfzList.length} Active</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {pfzList.slice(0, 3).map((pfz) => (
                <div
                  key={pfz.id}
                  onClick={() => onPinpointLocation(pfz.latitude, pfz.longitude, pfz.name)}
                  className="p-2 rounded border cursor-pointer hover:border-cyan-400 transition-all"
                  style={{ background: C.PANEL, borderColor: C.BORDER }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white line-clamp-1">{pfz.name}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(0,255,136,0.15)", color: C.GREEN }}>
                      {pfz.confidence_pct}%
                    </span>
                  </div>
                  <div className="text-[9px] mt-1 flex justify-between" style={{ color: C.TEXT_DIM }}>
                    <span>Dist: {pfz.distance_nm} NM</span>
                    <span>SST: {pfz.sst_c}°C</span>
                    <span>Depth: {pfz.depth_m}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── COASTAL CONDITIONS MATRIX: HARSH / MODERATE / SAFE (Live Triage) ─── */}
          <div className="space-y-2 flex-1 flex flex-col min-h-0 pt-1 border-t" style={{ borderColor: C.BORDER }}>
            <div className="flex items-center justify-between text-[10px] font-bold" style={{ color: C.TEXT_MED }}>
              <div className="flex items-center gap-1.5" style={{ color: C.PRI }}>
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>LIVE CONDITIONS MATRIX</span>
              </div>
              <span className="text-[9px] font-mono" style={{ color: C.GREEN }}>
                {stationsData.length} Stations
              </span>
            </div>

            {/* Filter Buttons */}
            <div className="grid grid-cols-4 gap-1 text-[9px] font-bold font-mono">
              <button
                onClick={() => setConditionsFilter("ALL")}
                className={`py-1 rounded border text-center transition-all cursor-pointer ${
                  conditionsFilter === "ALL"
                    ? "bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_8px_rgba(0,212,255,0.3)]"
                    : "bg-black/40 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                ALL ({stationsData.length})
              </button>
              <button
                onClick={() => setConditionsFilter("HARSH")}
                className={`py-1 rounded border text-center transition-all cursor-pointer ${
                  conditionsFilter === "HARSH"
                    ? "bg-red-950/90 border-red-400 text-red-300 shadow-[0_0_8px_rgba(255,51,85,0.4)]"
                    : "bg-black/40 border-slate-800 text-red-400/80 hover:text-red-300"
                }`}
                title="Harsh Conditions: High swell or gale force winds"
              >
                🔴 HARSH ({categorizedStations.harsh.length})
              </button>
              <button
                onClick={() => setConditionsFilter("MODERATE")}
                className={`py-1 rounded border text-center transition-all cursor-pointer ${
                  conditionsFilter === "MODERATE"
                    ? "bg-amber-950/90 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(255,204,0,0.4)]"
                    : "bg-black/40 border-slate-800 text-amber-400/80 hover:text-amber-300"
                }`}
                title="Moderate Conditions: Moderate chop, small craft advisory"
              >
                🟡 MOD ({categorizedStations.moderate.length})
              </button>
              <button
                onClick={() => setConditionsFilter("SAFE")}
                className={`py-1 rounded border text-center transition-all cursor-pointer ${
                  conditionsFilter === "SAFE"
                    ? "bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_8px_rgba(0,255,136,0.4)]"
                    : "bg-black/40 border-slate-800 text-emerald-400/80 hover:text-emerald-300"
                }`}
                title="Safe Conditions: Calm seas and light winds"
              >
                🟢 SAFE ({categorizedStations.safe.length})
              </button>
            </div>

            {/* List of Stations */}
            <div className="space-y-1.5 overflow-y-auto max-h-56 pr-1 scrollbar-thin">
              {filteredMatrixStations.length === 0 ? (
                <div className="p-3 text-center text-[10px] text-slate-500 font-mono border rounded" style={{ borderColor: C.BORDER }}>
                  No stations in this category currently.
                </div>
              ) : (
                filteredMatrixStations.map((st) => {
                  const isHarsh = categorizedStations.harsh.some((h) => h.id === st.id);
                  const isMod = categorizedStations.moderate.some((m) => m.id === st.id);
                  const verdictColor = isHarsh ? C.RED : isMod ? C.ACC2 : C.GREEN;
                  const verdictLabel = isHarsh ? "HARSH" : isMod ? "MODERATE" : "SAFE";
                  const borderClass = isHarsh
                    ? "border-red-900/60 bg-red-950/25 hover:border-red-400"
                    : isMod
                    ? "border-amber-900/60 bg-amber-950/25 hover:border-amber-400"
                    : "border-emerald-900/50 bg-emerald-950/20 hover:border-emerald-400";

                  return (
                    <div
                      key={st.id}
                      onClick={() => {
                        onPinpointLocation(st.latitude, st.longitude, st.name);
                        onSelectCoast(st.id);
                        soundEffects.playButtonClick();
                      }}
                      className={`p-2 rounded border transition-all cursor-pointer ${borderClass}`}
                      title={`Click to focus ${st.name} on 4K map`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-white line-clamp-1">
                          {st.name}
                        </span>
                        <span
                          className="text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wider shrink-0"
                          style={{
                            background: isHarsh
                              ? "rgba(255,51,85,0.2)"
                              : isMod
                              ? "rgba(255,204,0,0.2)"
                              : "rgba(0,255,136,0.2)",
                            color: verdictColor,
                            border: `1px solid ${verdictColor}`,
                          }}
                        >
                          {verdictLabel}
                        </span>
                      </div>

                      <div className="text-[9px] flex items-center justify-between" style={{ color: C.TEXT_DIM }}>
                        <span className="line-clamp-1">{st.state} • {st.sea}</span>
                        <div className="flex items-center gap-1.5 font-mono shrink-0 ml-1" style={{ color: C.WHITE }}>
                          <span>🌊 {st.wave_height_m}m</span>
                          <span>💨 {st.wind_speed_kmh}km/h</span>
                          <span>🌡️ {st.temperature_c}°C</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. MARK-LI FOOTER BAR (_build_footer) ─── */}
      <footer
        className="h-6 shrink-0 flex items-center justify-between px-4 border-t text-[9px] z-30"
        style={{ background: C.DARK, borderColor: C.BORDER, color: C.TEXT_DIM }}
      >
        <div className="flex items-center gap-4">
          <span>[F4] Mute Voice</span>
          <span>·</span>
          <span>[Space] Push To Talk</span>
          <span>·</span>
          <span>[Esc] Interrupt AI</span>
        </div>

        <div style={{ color: C.PRI_DIM }} className="font-bold">
          NEREUS × MARK LI ARCHITECTURE • 10 INDIAN LANGUAGES
        </div>

        <div className="flex items-center gap-2" style={{ color: C.TEXT_MED }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.GREEN }} />
          <span>INCOIS / MOSDAC / NAVTEX LINKED</span>
        </div>
      </footer>
    </div>
  );
};

export default MarkLiMainFrame;
