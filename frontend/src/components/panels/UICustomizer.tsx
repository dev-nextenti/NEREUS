import React, { useState, useRef } from "react";
import {
  Palette,
  Image,
  Sliders,
  X,
  Check,
  Upload,
  Monitor,
  Sun,
  Moon,
  Zap,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Globe,
  Waves,
  Sparkles,
  LayoutDashboard,
  Type,
  Layers,
  Wind,
  Film,
  Star,
  Paintbrush,
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface UITheme {
  name: string;
  id: string;
  // Background
  bgColor: string;
  bgGradient: string;
  bgCustomImage: string | null;
  bgParticles: boolean;
  bgStarfield: boolean;
  bgAnimatedWaves: boolean;
  bgScanlines: boolean;
  bgScanlineOpacity: number;
  bgVignette: boolean;
  bgVignetteStrength: number;
  bgBlur: number;
  // Accent Colors
  accentCyan: string;
  accentTeal: string;
  accentAmber: string;
  accentDanger: string;
  // Panel Glass
  panelBgOpacity: number;
  panelBlur: number;
  panelBorderOpacity: number;
  panelBorderColor: string;
  // Text
  textPrimary: string;
  textSecondary: string;
  textMono: string;
  // Globe
  globeAtmoColor: string;
  globeGridColor: string;
  globeLandColor: string;
  globeOceanColor: string;
  // Fonts
  fontHeading: "chakra" | "jetbrains" | "inter" | "orbitron" | "exo";
  fontBody: "inter" | "roboto" | "nunito" | "source-sans";
  fontMono: "jetbrains" | "fira" | "ibm-plex" | "roboto-mono";
  // UI Layout
  consoleSide: "left" | "right";
  consoleWidth: number;
  hudScale: number;
  // Misc Effects
  glowIntensity: number;
  animationSpeed: "slow" | "normal" | "fast" | "off";
  showCornerHuds: boolean;
  showDataTicker: boolean;
}

const DEFAULT_THEME: UITheme = {
  name: "NEREUS OCEAN NIGHT",
  id: "default",
  bgColor: "#020713",
  bgGradient: "radial-gradient(ellipse at 20% 50%, #010d1f 0%, #020713 50%, #020a18 100%)",
  bgCustomImage: null,
  bgParticles: false,
  bgStarfield: true,
  bgAnimatedWaves: false,
  bgScanlines: true,
  bgScanlineOpacity: 40,
  bgVignette: true,
  bgVignetteStrength: 82,
  bgBlur: 0,
  accentCyan: "#00e5ff",
  accentTeal: "#00f0b5",
  accentAmber: "#ffaa00",
  accentDanger: "#ff3355",
  panelBgOpacity: 72,
  panelBlur: 16,
  panelBorderOpacity: 22,
  panelBorderColor: "#00e5ff",
  textPrimary: "#e2f1ff",
  textSecondary: "#7ec8e3",
  textMono: "#00e5ff",
  globeAtmoColor: "#00aaff",
  globeGridColor: "#005588",
  globeLandColor: "#003264",
  globeOceanColor: "#010714",
  fontHeading: "chakra",
  fontBody: "inter",
  fontMono: "jetbrains",
  consoleSide: "left",
  consoleWidth: 460,
  hudScale: 100,
  glowIntensity: 100,
  animationSpeed: "normal",
  showCornerHuds: true,
  showDataTicker: true,
};

const PRESET_THEMES: Array<{ name: string; id: string; preview: string[]; theme: Partial<UITheme> }> = [
  {
    name: "OCEAN NIGHT",
    id: "default",
    preview: ["#020713", "#00e5ff", "#00f0b5"],
    theme: {},
  },
  {
    name: "DEEP SEA RED",
    id: "red",
    preview: ["#0d0208", "#ff3355", "#ff6600"],
    theme: {
      bgColor: "#0d0208",
      bgGradient: "radial-gradient(ellipse at 20% 50%, #1a0208 0%, #0d0208 50%, #0d050a 100%)",
      accentCyan: "#ff3355",
      accentTeal: "#ff6600",
      accentAmber: "#ffcc00",
      panelBorderColor: "#ff3355",
      textMono: "#ff3355",
      globeAtmoColor: "#ff3300",
      globeGridColor: "#550011",
      globeLandColor: "#330011",
    },
  },
  {
    name: "MILITARY GREEN",
    id: "military",
    preview: ["#040d05", "#00ff41", "#aaff00"],
    theme: {
      bgColor: "#040d05",
      bgGradient: "radial-gradient(ellipse at 20% 50%, #071409 0%, #040d05 100%)",
      accentCyan: "#00ff41",
      accentTeal: "#aaff00",
      accentAmber: "#ffdd00",
      panelBorderColor: "#00ff41",
      textMono: "#00ff41",
      textSecondary: "#88bb88",
      globeAtmoColor: "#00aa22",
      globeGridColor: "#114400",
      globeLandColor: "#0a3300",
    },
  },
  {
    name: "GOLD COMMAND",
    id: "gold",
    preview: ["#0d0a01", "#ffcc00", "#ff8800"],
    theme: {
      bgColor: "#0d0a01",
      bgGradient: "radial-gradient(ellipse at 20% 50%, #1a1201 0%, #0d0a01 100%)",
      accentCyan: "#ffcc00",
      accentTeal: "#ff8800",
      accentAmber: "#ffeeaa",
      panelBorderColor: "#ffcc00",
      textMono: "#ffcc00",
      textSecondary: "#ccaa44",
      globeAtmoColor: "#ffaa00",
      globeGridColor: "#553300",
      globeLandColor: "#332200",
    },
  },
  {
    name: "ARCTIC BLUE",
    id: "arctic",
    preview: ["#010c18", "#66d9ff", "#ffffff"],
    theme: {
      bgColor: "#010c18",
      bgGradient: "radial-gradient(ellipse at 20% 70%, #011428 0%, #010c18 100%)",
      accentCyan: "#66d9ff",
      accentTeal: "#ffffff",
      accentAmber: "#88eeff",
      panelBorderColor: "#66d9ff",
      textMono: "#aaddff",
      textPrimary: "#ddf4ff",
      globeAtmoColor: "#4499cc",
      globeGridColor: "#113355",
      globeLandColor: "#0a2240",
    },
  },
  {
    name: "NEON PURPLE",
    id: "purple",
    preview: ["#08020d", "#cc44ff", "#6600ff"],
    theme: {
      bgColor: "#08020d",
      bgGradient: "radial-gradient(ellipse at 30% 40%, #150220 0%, #08020d 100%)",
      accentCyan: "#cc44ff",
      accentTeal: "#6600ff",
      accentAmber: "#ff44cc",
      panelBorderColor: "#cc44ff",
      textMono: "#cc44ff",
      textSecondary: "#aa66cc",
      globeAtmoColor: "#8800cc",
      globeGridColor: "#330066",
      globeLandColor: "#220044",
    },
  },
  {
    name: "SUNRISE ORANGE",
    id: "sunrise",
    preview: ["#0d0500", "#ff6600", "#ffcc00"],
    theme: {
      bgColor: "#0d0500",
      bgGradient: "radial-gradient(ellipse at 50% 80%, #1a0d00 0%, #0d0500 100%)",
      accentCyan: "#ff6600",
      accentTeal: "#ffcc00",
      accentAmber: "#ff3300",
      panelBorderColor: "#ff6600",
      textMono: "#ff8833",
      textSecondary: "#cc7722",
      globeAtmoColor: "#ff4400",
      globeGridColor: "#552200",
      globeLandColor: "#331500",
    },
  },
  {
    name: "WHITE ROOM",
    id: "white",
    preview: ["#f0f4f8", "#0077ff", "#00aaff"],
    theme: {
      bgColor: "#f0f4f8",
      bgGradient: "radial-gradient(ellipse at 30% 30%, #e0eeff 0%, #f0f4f8 100%)",
      accentCyan: "#0077ff",
      accentTeal: "#00aacc",
      accentAmber: "#ff8800",
      panelBorderColor: "#0077ff",
      panelBgOpacity: 85,
      textPrimary: "#0d1a2e",
      textSecondary: "#1a4a8a",
      textMono: "#0044cc",
      globeAtmoColor: "#0066cc",
      globeGridColor: "#aaccee",
      globeLandColor: "#ddeeff",
      bgScanlines: false,
      bgVignette: false,
    },
  },
];

const GRADIENT_PRESETS = [
  { name: "Ocean Deep", value: "radial-gradient(ellipse at 20% 50%, #010d1f 0%, #020713 50%, #020a18 100%)" },
  { name: "Abyss", value: "linear-gradient(135deg, #010714 0%, #020a18 50%, #010d1a 100%)" },
  { name: "Twilight Sea", value: "radial-gradient(ellipse at top, #0a1530 0%, #020713 60%)" },
  { name: "Volcanic Red", value: "radial-gradient(ellipse at bottom, #1a0508 0%, #0d020a 100%)" },
  { name: "Northern Lights", value: "linear-gradient(180deg, #010714 0%, #001a0d 50%, #0a001a 100%)" },
  { name: "Sunrise Coast", value: "linear-gradient(180deg, #1a0a00 0%, #0d0714 80%)" },
  { name: "Storm Front", value: "linear-gradient(135deg, #08081a 0%, #020a0a 100%)" },
  { name: "Blank Black", value: "none" },
];
// ─── ACCORDION SECTION ───────────────────────────────────────────────────────
function Section({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-cyan-500/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-cyan-950/40 hover:bg-cyan-900/50 transition-all"
      >
        <span className="flex items-center gap-2 text-xs font-bold font-heading text-cyan-200 uppercase tracking-wider">
          {icon}
          {title}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-cyan-400" />}
      </button>
      {open && <div className="p-3.5 space-y-3 bg-black/20">{children}</div>}
    </div>
  );
}

// ─── COLOR SWATCH ────────────────────────────────────────────────────────────
function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] text-slate-300 font-mono">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-cyan-400/70 font-mono">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded-md border border-cyan-500/40 bg-transparent cursor-pointer"
          style={{ padding: "2px" }}
        />
      </div>
    </div>
  );
}

// ─── SLIDER ──────────────────────────────────────────────────────────────────
function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-mono">
        <span className="text-slate-300">{label}</span>
        <span className="text-cyan-300">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 accent-cyan-400 cursor-pointer"
      />
    </div>
  );
}

// ─── TOGGLE ──────────────────────────────────────────────────────────────────
function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-slate-300 font-mono">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-all ${value ? "bg-cyan-500" : "bg-slate-700"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all ${value ? "translate-x-5" : ""}`}
        />
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
interface UICustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: UITheme;
  onThemeChange: (t: UITheme) => void;
}

export const UICustomizer: React.FC<UICustomizerProps> = ({ isOpen, onClose, theme, onThemeChange }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const update = (partial: Partial<UITheme>) => onThemeChange({ ...theme, ...partial });

  const applyPreset = (preset: typeof PRESET_THEMES[number]) => {
    onThemeChange({ ...DEFAULT_THEME, ...preset.theme, name: preset.name, id: preset.id });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      update({ bgCustomImage: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const resetAll = () => onThemeChange({ ...DEFAULT_THEME });

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-end p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-[420px] max-h-[calc(100vh-32px)] flex flex-col rounded-2xl bg-[#02091a]/98 border border-cyan-400/50 shadow-[0_0_60px_rgba(0,229,255,0.25)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/30 bg-cyan-950/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <Paintbrush className="w-5 h-5 text-cyan-300" />
            <div>
              <div className="text-sm font-bold text-cyan-200 font-heading tracking-wider">UI CUSTOMIZER</div>
              <div className="text-[10px] text-cyan-400/60 font-mono">Visual & Interface Settings</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetAll}
              title="Reset to Default"
              className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-300 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-red-950/80 border border-red-500/30 text-red-300 hover:text-white hover:border-red-400 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 font-sans">
          {/* ─── PRESET THEMES ─── */}
          <Section title="Preset Themes" icon={<Sparkles className="w-3.5 h-3.5" />} defaultOpen>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_THEMES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  title={p.name}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                    theme.id === p.id
                      ? "border-cyan-300 bg-cyan-950/60 shadow-[0_0_12px_rgba(0,229,255,0.4)]"
                      : "border-cyan-500/20 hover:border-cyan-400/50 bg-black/30"
                  }`}
                >
                  <div className="flex gap-0.5">
                    {p.preview.map((c, i) => (
                      <div
                        key={i}
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-center leading-tight text-slate-300 break-words">
                    {p.name}
                  </span>
                  {theme.id === p.id && <Check className="w-3 h-3 text-cyan-300" />}
                </button>
              ))}
            </div>
          </Section>

          {/* ─── BACKGROUND ─── */}
          <Section title="Background" icon={<Image className="w-3.5 h-3.5" />} defaultOpen>
            {/* Base Color */}
            <ColorPicker
              label="Base Background Color"
              value={theme.bgColor}
              onChange={(v) => update({ bgColor: v, id: "custom", name: "Custom" })}
            />

            {/* Gradient Presets */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400">Background Gradient</div>
              <div className="grid grid-cols-2 gap-1.5">
                {GRADIENT_PRESETS.map((g) => (
                  <button
                    key={g.name}
                    onClick={() => update({ bgGradient: g.value, id: "custom", name: "Custom" })}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono border transition-all ${
                      theme.bgGradient === g.value
                        ? "border-cyan-300 text-cyan-200 bg-cyan-950/60"
                        : "border-cyan-500/20 text-slate-300 hover:border-cyan-500/50"
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Background Image */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-slate-400">Custom Background Image</div>
              <div className="flex gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/50 text-[11px] font-mono text-cyan-200 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {theme.bgCustomImage ? "Change Image" : "Upload Image"}
                </button>
                {theme.bgCustomImage && (
                  <button
                    onClick={() => update({ bgCustomImage: null })}
                    className="px-3 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-950/40 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              {theme.bgCustomImage && (
                <div
                  className="w-full h-20 rounded-xl border border-cyan-500/30 bg-cover bg-center relative overflow-hidden"
                  style={{ backgroundImage: `url(${theme.bgCustomImage})` }}
                >
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-white/80">Custom BG Active</span>
                  </div>
                </div>
              )}
              {theme.bgCustomImage && (
                <SliderRow
                  label="Image Blur"
                  value={theme.bgBlur}
                  min={0}
                  max={20}
                  unit="px"
                  onChange={(v) => update({ bgBlur: v })}
                />
              )}
            </div>

            {/* Effects */}
            <div className="space-y-2 pt-1 border-t border-cyan-500/10">
              <div className="text-[10px] font-mono text-slate-400">Visual Effects</div>
              <Toggle label="Scanline Overlay" value={theme.bgScanlines} onChange={(v) => update({ bgScanlines: v })} />
              {theme.bgScanlines && (
                <SliderRow
                  label="Scanline Opacity"
                  value={theme.bgScanlineOpacity}
                  min={5}
                  max={80}
                  unit="%"
                  onChange={(v) => update({ bgScanlineOpacity: v })}
                />
              )}
              <Toggle label="Vignette Dark Edge" value={theme.bgVignette} onChange={(v) => update({ bgVignette: v })} />
              {theme.bgVignette && (
                <SliderRow
                  label="Vignette Strength"
                  value={theme.bgVignetteStrength}
                  min={10}
                  max={100}
                  unit="%"
                  onChange={(v) => update({ bgVignetteStrength: v })}
                />
              )}
              <Toggle label="Starfield Particles" value={theme.bgStarfield} onChange={(v) => update({ bgStarfield: v })} />
              <Toggle label="Animated Wave Noise" value={theme.bgAnimatedWaves} onChange={(v) => update({ bgAnimatedWaves: v })} />
            </div>
          </Section>

          {/* ─── ACCENT COLORS ─── */}
          <Section title="Accent & Glow Colors" icon={<Palette className="w-3.5 h-3.5" />}>
            <ColorPicker label="Primary Accent (Cyan)" value={theme.accentCyan} onChange={(v) => update({ accentCyan: v, id: "custom", name: "Custom" })} />
            <ColorPicker label="Secondary Accent (Teal)" value={theme.accentTeal} onChange={(v) => update({ accentTeal: v, id: "custom", name: "Custom" })} />
            <ColorPicker label="Warning Accent (Amber)" value={theme.accentAmber} onChange={(v) => update({ accentAmber: v, id: "custom", name: "Custom" })} />
            <ColorPicker label="Danger Accent (Red)" value={theme.accentDanger} onChange={(v) => update({ accentDanger: v, id: "custom", name: "Custom" })} />
            <SliderRow
              label="Glow Intensity"
              value={theme.glowIntensity}
              min={0}
              max={200}
              unit="%"
              onChange={(v) => update({ glowIntensity: v })}
            />
          </Section>

          {/* ─── PANEL GLASS ─── */}
          <Section title="Glass Panel Appearance" icon={<Layers className="w-3.5 h-3.5" />}>
            <SliderRow
              label="Panel Background Opacity"
              value={theme.panelBgOpacity}
              min={10}
              max={98}
              unit="%"
              onChange={(v) => update({ panelBgOpacity: v })}
            />
            <SliderRow
              label="Panel Blur (Glassmorphism)"
              value={theme.panelBlur}
              min={0}
              max={40}
              unit="px"
              onChange={(v) => update({ panelBlur: v })}
            />
            <SliderRow
              label="Border Opacity"
              value={theme.panelBorderOpacity}
              min={5}
              max={80}
              unit="%"
              onChange={(v) => update({ panelBorderOpacity: v })}
            />
            <ColorPicker
              label="Panel Border Color"
              value={theme.panelBorderColor}
              onChange={(v) => update({ panelBorderColor: v, id: "custom", name: "Custom" })}
            />
            <ColorPicker
              label="Primary Text Color"
              value={theme.textPrimary}
              onChange={(v) => update({ textPrimary: v })}
            />
            <ColorPicker
              label="Secondary Text Color"
              value={theme.textSecondary}
              onChange={(v) => update({ textSecondary: v })}
            />
            <ColorPicker
              label="Monospace / Data Text"
              value={theme.textMono}
              onChange={(v) => update({ textMono: v })}
            />
          </Section>

          {/* ─── GLOBE COLORS ─── */}
          <Section title="3D Globe Appearance" icon={<Globe className="w-3.5 h-3.5" />}>
            <ColorPicker label="Atmosphere Glow" value={theme.globeAtmoColor} onChange={(v) => update({ globeAtmoColor: v })} />
            <ColorPicker label="Grid / Lat-Long Lines" value={theme.globeGridColor} onChange={(v) => update({ globeGridColor: v })} />
            <ColorPicker label="Landmass Fill Color" value={theme.globeLandColor} onChange={(v) => update({ globeLandColor: v })} />
            <ColorPicker label="Ocean Base Color" value={theme.globeOceanColor} onChange={(v) => update({ globeOceanColor: v })} />
            <div className="text-[10px] text-slate-400 font-mono italic pt-1">
              Note: Globe colors take effect on next app reload (refresh browser)
            </div>
          </Section>

          {/* ─── FONTS ─── */}
          <Section title="Typography & Fonts" icon={<Type className="w-3.5 h-3.5" />}>
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-slate-400">Heading Font</div>
              <div className="grid grid-cols-2 gap-1.5">
                {(["chakra", "jetbrains", "inter", "orbitron", "exo"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => update({ fontHeading: f })}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] border transition-all capitalize ${
                      theme.fontHeading === f
                        ? "border-cyan-300 text-cyan-200 bg-cyan-950/60"
                        : "border-cyan-500/20 text-slate-300 hover:border-cyan-500/50"
                    }`}
                    style={{
                      fontFamily:
                        f === "chakra" ? "'Chakra Petch'" :
                        f === "jetbrains" ? "'JetBrains Mono'" :
                        f === "inter" ? "'Inter'" :
                        f === "orbitron" ? "'Orbitron'" :
                        "'Exo 2'",
                    }}
                  >
                    {f === "chakra" ? "Chakra Petch" : f === "jetbrains" ? "JetBrains" : f === "orbitron" ? "Orbitron" : f === "exo" ? "Exo 2" : "Inter"}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* ─── LAYOUT ─── */}
          <Section title="Layout & Scale" icon={<LayoutDashboard className="w-3.5 h-3.5" />}>
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-slate-400">Console Side</div>
              <div className="flex gap-2">
                <button
                  onClick={() => update({ consoleSide: "left" })}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-mono border transition-all ${
                    theme.consoleSide === "left"
                      ? "border-cyan-300 text-cyan-200 bg-cyan-950/60"
                      : "border-cyan-500/20 text-slate-300 hover:border-cyan-500/50"
                  }`}
                >
                  ← Left Side
                </button>
                <button
                  onClick={() => update({ consoleSide: "right" })}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-mono border transition-all ${
                    theme.consoleSide === "right"
                      ? "border-cyan-300 text-cyan-200 bg-cyan-950/60"
                      : "border-cyan-500/20 text-slate-300 hover:border-cyan-500/50"
                  }`}
                >
                  Right Side →
                </button>
              </div>
            </div>
            <SliderRow
              label="Console Width"
              value={theme.consoleWidth}
              min={300}
              max={650}
              unit="px"
              onChange={(v) => update({ consoleWidth: v })}
            />
            <SliderRow
              label="HUD Scale"
              value={theme.hudScale}
              min={75}
              max={130}
              unit="%"
              onChange={(v) => update({ hudScale: v })}
            />
            <Toggle label="HUD Corner Brackets" value={theme.showCornerHuds} onChange={(v) => update({ showCornerHuds: v })} />
            <Toggle label="Data Ticker Bar" value={theme.showDataTicker} onChange={(v) => update({ showDataTicker: v })} />
          </Section>

          {/* ─── ANIMATION ─── */}
          <Section title="Animation & Performance" icon={<Film className="w-3.5 h-3.5" />}>
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-slate-400">Animation Speed</div>
              <div className="grid grid-cols-4 gap-1.5">
                {(["off", "slow", "normal", "fast"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => update({ animationSpeed: s })}
                    className={`py-1.5 rounded-lg text-[10px] font-mono border transition-all capitalize ${
                      theme.animationSpeed === s
                        ? "border-cyan-300 text-cyan-200 bg-cyan-950/60"
                        : "border-cyan-500/20 text-slate-300 hover:border-cyan-500/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </Section>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 border-t border-cyan-500/20 bg-cyan-950/30 flex items-center justify-between gap-2 shrink-0">
          <div className="text-[10px] font-mono text-cyan-400/60">
            Theme: <span className="text-cyan-300">{theme.name}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const data = JSON.stringify(theme, null, 2);
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `nereus-theme-${theme.id}.json`;
                a.click();
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 hover:border-cyan-300 transition-all"
            >
              Export Theme
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-bold text-[11px] font-mono transition-all hover:from-cyan-400 hover:to-teal-300"
            >
              Apply & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { DEFAULT_THEME };
export type { UITheme as UIThemeType };
