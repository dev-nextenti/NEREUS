export type AICoreState =
  | "IDLE"
  | "LISTENING"
  | "PROCESSING"
  | "ANALYZING"
  | "WARNING"
  | "RESPONDING"
  | "OFFLINE";

export type UserMode = "FISHERMAN" | "RESEARCHER" | "AUTHORITY" | "MARITIME";

export type SafetyVerdict = "SAFE" | "CAUTION" | "HIGH_RISK" | "DANGER";

export interface PFZItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  distance_nm: number;
  bearing_deg: number;
  confidence_pct: number;
  sst_c: number;
  chlorophyll_mg_m3: number;
  depth_m: number;
  target_species: string;
  source: string;
}

export interface WeatherData {
  temperature: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  rain_prob_pct: number;
  wave_height_m: number;
  wave_period_s: number;
  visibility_km: number;
  lightning_prob_pct: number;
  cyclone_risk: string;
  source?: string;
}

export interface AlertItem {
  id: number;
  type: "CYCLONE" | "HIGH_WAVE" | "GEOFENCE" | "LIGHTNING" | "WIND";
  severity: "INFO" | "WARNING" | "CRITICAL";
  location: string;
  latitude?: number;
  longitude?: number;
  message: string;
  source: string;
  timestamp?: string;
}

export interface EvidenceStep {
  step: number;
  agent: string;
  source: string;
  finding: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "nereus";
  text: string;
  timestamp: string;
  verdict?: SafetyVerdict;
  riskScore?: number;
  weather?: Partial<WeatherData>;
  nearestPfz?: PFZItem;
  evidenceChain?: EvidenceStep[];
  agentsTrace?: Array<{ agent: string; status: string; duration_ms: number }>;
  spokenAudio?: string;
  language?: string;
}

export interface LayerState {
  sst: boolean;
  chlorophyll: boolean;
  pfz: boolean;
  waves: boolean;
  weather: boolean;
  cyclone: boolean;
  geofence: boolean;
  routes: boolean;
}
