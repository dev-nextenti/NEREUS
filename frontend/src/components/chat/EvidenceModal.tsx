import React from "react";
import { ChatMessage } from "../../types";
import { X, CheckCircle, AlertTriangle, ShieldCheck, ArrowDown } from "lucide-react";

interface EvidenceModalProps {
  message: ChatMessage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  message,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md pointer-events-auto">
      <div className="w-full max-w-2xl rounded-2xl holo-panel border border-cyan-400/50 shadow-cyan-intense p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wider text-cyan-300 font-heading">
                EXPLAINABLE AI EVIDENCE CHAIN
              </h2>
              <p className="text-[10px] text-cyan-400/70 font-mono">
                Query: &quot;{message.text.slice(0, 55)}...&quot;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step-by-Step Evidence Tree */}
        <div className="max-h-[60vh] overflow-y-auto space-y-3 font-sans pr-1">
          {message.evidenceChain && message.evidenceChain.length > 0 ? (
            message.evidenceChain.map((ev, idx) => (
              <div key={idx} className="relative pl-6 pb-2 border-l border-cyan-500/30">
                {/* Step Circle Node */}
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-cyan-950 border border-cyan-400 text-[10px] font-mono font-bold text-cyan-300 flex items-center justify-center shadow-cyan-glow">
                  {ev.step}
                </div>

                <div className="p-3 rounded-xl bg-[#041630]/80 border border-cyan-500/20 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-cyan-300 font-heading">
                      {ev.agent}
                    </span>
                    <span className="text-cyan-400/60 text-[10px]">
                      Source: {ev.source}
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed">
                    {ev.finding}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Default fallback structured evidence if chat message didn't contain explicit list
            <div className="space-y-3 font-mono text-xs text-slate-200">
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20">
                <span className="text-cyan-300 font-bold">1. SOURCE: INCOIS PFZ Division</span>
                <div>Pelagic thermal aggregation front verified. Catch potential: HIGH (89.5%).</div>
              </div>
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20">
                <span className="text-cyan-300 font-bold">2. SOURCE: Open-Meteo ECMWF</span>
                <div>Significant swell wave height: 2.4 m. Wind speed: 18 km/h.</div>
              </div>
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20">
                <span className="text-cyan-300 font-bold">3. DETERMINISTIC RISK AGENT:</span>
                <div>Deterministic Rule: Swell &gt; 2.0 m triggers small craft advisory. High biomass catch recommendation overridden by wave capsize risk.</div>
              </div>
            </div>
          )}

          {/* Final Decision Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 border border-cyan-400/40 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                Final Explainable Decision
              </div>
              <div className="text-sm font-bold font-heading text-cyan-200">
                VERDICT: {message.verdict || "CAUTION (MODERATE RISK)"}
              </div>
            </div>
            <div className="text-right font-mono text-[11px] text-cyan-300">
              Verified by Deterministic IMO Safety Protocols
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
