import React from "react";
import { AlertItem } from "../../types";
import { AlertTriangle, ShieldAlert, Zap, Wind, Waves, X } from "lucide-react";

interface AlertCenterProps {
  alerts: AlertItem[];
  isOpen: boolean;
  onClose: () => void;
  onAlertClick: (alert: AlertItem) => void;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({
  alerts,
  isOpen,
  onClose,
  onAlertClick,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "CYCLONE":
        return <Wind className="w-4 h-4 text-red-400 animate-spin-slow" />;
      case "HIGH_WAVE":
        return <Waves className="w-4 h-4 text-amber-400" />;
      case "GEOFENCE":
        return <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />;
      case "LIGHTNING":
        return <Zap className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="w-full max-w-xl rounded-2xl holo-panel border border-amber-500/40 shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h2 className="text-base font-bold tracking-wider text-amber-300 font-heading">
              MARITIME ALERT CENTER
            </h2>
            <span className="text-xs font-mono text-slate-400">
              ({alerts.length} Active Bulletins)
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts Stream */}
        <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1 font-sans">
          {alerts.map((a) => {
            const isCritical = a.severity === "CRITICAL";
            return (
              <div
                key={a.id}
                onClick={() => onAlertClick(a)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isCritical
                    ? "bg-red-950/40 border-red-500/60 hover:bg-red-900/50 shadow-danger-glow"
                    : "bg-[#041630]/70 border-amber-500/30 hover:bg-cyan-950/60"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {getIcon(a.type)}
                    <span className="font-heading font-bold text-xs tracking-wider text-slate-100">
                      {a.type.replace("_", " ")}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isCritical
                        ? "bg-red-500/30 text-red-300 border border-red-500/50"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {a.severity}
                  </span>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed">
                  {a.message}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 font-mono text-[10px] text-cyan-400/70">
                  <span>Sector: {a.location}</span>
                  <span>Source: {a.source}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
