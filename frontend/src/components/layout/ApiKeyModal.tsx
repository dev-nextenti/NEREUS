import React, { useState, useEffect } from "react";
import {
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  X,
  Server
} from "lucide-react";
import { soundEffects } from "../../lib/soundEffects";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: (newKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<{
    valid: boolean;
    status: string;
    message: string;
  } | null>(null);
  const [currentConfig, setCurrentConfig] = useState<{
    gemini_api_key_masked: string;
    is_custom_key: boolean;
    key_status: string;
    message: string;
  }>({
    gemini_api_key_masked: "Loading...",
    is_custom_key: false,
    key_status: "CHECKING",
    message: "",
  });

  // Fetch current status on open
  useEffect(() => {
    if (!isOpen) return;

    // Load from localStorage if present
    const savedLocal = localStorage.getItem("nereus_gemini_api_key") || "";
    if (savedLocal) {
      setApiKeyInput(savedLocal);
    }

    fetchKeyStatus();
  }, [isOpen]);

  const fetchKeyStatus = async () => {
    try {
      const savedLocal = localStorage.getItem("nereus_gemini_api_key") || "";
      const headers: Record<string, string> = {};
      if (savedLocal) {
        headers["x-gemini-api-key"] = savedLocal;
      }
      const resp = await fetch("/api/config/keys", { headers });
      if (resp.ok) {
        const data = await resp.json();
        setCurrentConfig({
          gemini_api_key_masked: data.gemini_api_key_masked || "Active",
          is_custom_key: data.is_custom_key,
          key_status: data.key_status || "ACTIVE",
          message: data.message || "",
        });
      }
    } catch (e) {
      console.log("Config fetch note:", e);
    }
  };

  const handleTestKey = async () => {
    const keyToTest = apiKeyInput.trim();
    if (!keyToTest) {
      setTestResult({
        valid: false,
        status: "EMPTY",
        message: "Please enter an API key to test.",
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    soundEffects.playAssistantSpeak();

    try {
      const resp = await fetch("/api/config/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gemini_api_key: keyToTest }),
      });
      const data = await resp.json();
      setIsTesting(false);
      setTestResult({
        valid: !!data.valid,
        status: data.status || (data.valid ? "ACTIVE" : "ERROR"),
        message: data.message || (data.valid ? "Key verified successfully!" : "Verification failed."),
      });
    } catch (err: any) {
      setIsTesting(false);
      setTestResult({
        valid: false,
        status: "NETWORK_ERROR",
        message: `Failed to reach test endpoint: ${err.message || err}`,
      });
    }
  };

  const handleSaveKey = async () => {
    const keyToSave = apiKeyInput.trim();
    if (!keyToSave) return;

    setIsSaving(true);
    soundEffects.playAssistantSpeak();

    try {
      // 1. Save to backend
      const resp = await fetch("/api/config/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gemini_api_key: keyToSave }),
      });

      // 2. Save to localStorage
      localStorage.setItem("nereus_gemini_api_key", keyToSave);

      setIsSaving(false);
      if (onKeyUpdated) onKeyUpdated(keyToSave);

      // Refresh status
      await fetchKeyStatus();
      setTestResult({
        valid: true,
        status: "ACTIVE",
        message: "Key saved and activated across all agents!",
      });
    } catch (err: any) {
      setIsSaving(false);
      // Still save to localStorage as client fallback
      localStorage.setItem("nereus_gemini_api_key", keyToSave);
      if (onKeyUpdated) onKeyUpdated(keyToSave);
      setTestResult({
        valid: true,
        status: "LOCAL_ONLY",
        message: "Saved to browser storage. Will be used for direct queries.",
      });
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem("nereus_gemini_api_key");
    setApiKeyInput("");
    setTestResult(null);
    fetchKeyStatus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl border p-6 flex flex-col gap-5 shadow-2xl font-mono text-cyan-100"
        style={{
          background: "#010f18",
          borderColor: "#0d3347",
          boxShadow: "0 0 35px rgba(0, 212, 255, 0.25)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-[#0d3347] bg-[#00060a] text-cyan-400 hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-cyan-300">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-wider text-cyan-300 flex items-center gap-2">
              AI ENGINE & API KEY SETTINGS
            </h2>
            <p className="text-xs text-cyan-500/80">
              Configure Google Gemini 3.6 Flash & Real-Time Online Research
            </p>
          </div>
        </div>

        {/* Active Engine Diagnostics */}
        <div className="rounded-xl border border-[#0d3347] bg-[#000a12] p-3 flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400/80 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              Active LLM Model:
            </span>
            <span className="font-bold text-cyan-300">Google Gemini 3.6 Flash</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-cyan-400/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Online Web Research:
            </span>
            <span className="text-teal-400 font-bold">DuckDuckGo + Open-Meteo (Live)</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#0d3347]">
            <span className="text-cyan-400/80">Active Key:</span>
            <span className="font-bold font-mono text-[11px] text-cyan-200">
              {currentConfig.gemini_api_key_masked}
              {currentConfig.is_custom_key && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  CUSTOM
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Key Input Field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-cyan-300 flex items-center justify-between">
            <span>Enter Your Gemini API Key:</span>
            <button
              onClick={() => setShowKey(!showKey)}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-200 cursor-pointer"
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showKey ? "Hide" : "Show"}
            </button>
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste AIzaSy... or custom Gemini API key"
              className="w-full px-3 py-2.5 rounded-xl border border-[#0d3347] bg-[#00060a] text-cyan-200 text-xs focus:outline-none focus:border-cyan-400 transition-all font-mono"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTestKey}
            disabled={isTesting || !apiKeyInput.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-cyan-500/50 bg-[#001f2e] text-cyan-300 text-xs font-bold hover:border-cyan-300 hover:bg-[#002f47] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
            <span>{isTesting ? "TESTING..." : "TEST CONNECTION"}</span>
          </button>

          <button
            onClick={handleSaveKey}
            disabled={isSaving || !apiKeyInput.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-teal-400/60 bg-teal-950/60 text-teal-200 text-xs font-bold hover:border-teal-300 hover:bg-teal-900/70 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isSaving ? "SAVING..." : "SAVE & ACTIVATE"}</span>
          </button>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`rounded-xl border p-3 flex items-start gap-2.5 text-xs animate-in fade-in duration-200 ${
              testResult.valid
                ? "border-teal-500/40 bg-teal-950/30 text-teal-300"
                : testResult.status === "QUOTA_EXHAUSTED"
                ? "border-amber-500/40 bg-amber-950/30 text-amber-300"
                : "border-red-500/40 bg-red-950/30 text-red-300"
            }`}
          >
            {testResult.valid ? (
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            ) : testResult.status === "QUOTA_EXHAUSTED" ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{testResult.status}</p>
              <p className="text-[11px] opacity-90 mt-0.5">{testResult.message}</p>
            </div>
          </div>
        )}

        {/* Free API Key Guide */}
        <div className="rounded-xl border border-[#0d3347] bg-[#000810] p-3 flex items-center justify-between text-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-cyan-300 font-bold">Need a free Gemini API key?</span>
            <span className="text-[10px] text-cyan-500/80">
              Get an instant free key from Google AI Studio (no credit card required).
            </span>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-[#001824] text-cyan-300 hover:text-white hover:border-cyan-300 text-[11px] font-bold transition-all shrink-0 ml-2"
          >
            <span>GET KEY</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Clear Key option */}
        {apiKeyInput && (
          <div className="flex justify-end">
            <button
              onClick={handleClearKey}
              className="text-[10px] text-red-400/80 hover:text-red-300 underline cursor-pointer"
            >
              Reset to default key
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
