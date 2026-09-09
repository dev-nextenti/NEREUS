import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";

interface StartupSequenceProps {
  onComplete: () => void;
}

export const StartupSequence: React.FC<StartupSequenceProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const checks = [
    { label: "POSTGRESQL + POSTGIS DATABASE", ready: step >= 2 },
    { label: "AI MULTI-AGENT PIPELINE (11 AGENTS)", ready: step >= 3 },
    { label: "VOICE ASSISTANT (BHASHINI / WHISPER)", ready: step >= 4 },
    { label: "ISRO MOSDAC SATELLITE FEED", ready: step >= 5 },
    { label: "INCOIS PFZ & HIGH-WAVE ADVISORIES", ready: step >= 6 },
    { label: "VLIZ GEOFENCE & IMBL ENGINE", ready: step >= 7 },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 600); // Logo reveals
    const timer2 = setTimeout(() => setStep(2), 1200); // Check 1
    const timer3 = setTimeout(() => setStep(3), 1600); // Check 2
    const timer4 = setTimeout(() => setStep(4), 2000); // Check 3
    const timer5 = setTimeout(() => setStep(5), 2400); // Check 4
    const timer6 = setTimeout(() => setStep(6), 2800); // Check 5
    const timer7 = setTimeout(() => setStep(7), 3200); // Check 6
    const timer8 = setTimeout(() => setStep(8), 3800); // "How can I assist you?"
    const timer9 = setTimeout(() => onComplete(), 4600); // Complete

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
      clearTimeout(timer8);
      clearTimeout(timer9);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#020713] flex flex-col items-center justify-center p-8 transition-opacity duration-700">
      {/* Background Radial Glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.12)_0%,transparent_70%)] animate-pulse" />

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full space-y-6">
        {/* NEREUS Trident Logo */}
        <div className={`transition-all duration-700 transform ${step >= 1 ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}>
          <div className="w-24 h-24 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400 shadow-cyan-intense flex items-center justify-center">
            <svg className="w-16 h-16 text-cyan-300" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="startupTrident" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00e5ff" />
                  <stop offset="100%" stopColor="#0077ff" />
                </linearGradient>
              </defs>
              <path d="M50 8 L54 28 L52 75 L48 75 L46 28 Z" fill="url(#startupTrident)" />
              <polygon points="50,4 56,16 50,22 44,16" fill="#00f0b5" />
              <path d="M46 38 C32 40 24 28 26 14 L30 18 C28 26 34 34 46 32 Z" fill="url(#startupTrident)" />
              <polygon points="26,12 30,22 25,20 22,18" fill="#00f0b5" />
              <path d="M54 38 C68 40 76 28 74 14 L70 18 C72 26 66 34 54 32 Z" fill="url(#startupTrident)" />
              <polygon points="74,12 78,18 75,20 70,22" fill="#00f0b5" />
              <circle cx="50" cy="80" r="4" fill="url(#startupTrident)" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className={`text-center transition-all duration-700 ${step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <h1 className="text-3xl font-bold tracking-[0.35em] text-cyan-300 font-heading text-glow-cyan">
            N E R E U S
          </h1>
          <p className="text-xs font-mono tracking-[0.25em] text-cyan-400/80 mt-1 uppercase">
            Agentic Marine Intelligence & Safety Platform
          </p>
        </div>

        {/* System Diagnostic Sequence */}
        <div className="w-full rounded-xl bg-[#041630]/70 border border-cyan-500/30 p-4 space-y-2 font-mono text-xs shadow-cyan-glow">
          {checks.map((chk, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className={chk.ready ? "text-slate-200" : "text-slate-600"}>
                {chk.label}
              </span>
              <span className={chk.ready ? "text-emerald-400 font-bold flex items-center gap-1" : "text-slate-700"}>
                {chk.ready ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>ONLINE</span>
                  </>
                ) : (
                  <span>INITIALIZING...</span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Final Prompt */}
        {step >= 8 && (
          <div className="text-center animate-bounce text-sm font-heading font-semibold text-cyan-200 tracking-wider">
            &quot;NEREUS ONLINE. How can I assist you?&quot;
          </div>
        )}

        {/* Skip button */}
        <button
          onClick={onComplete}
          className="text-[10px] font-mono text-cyan-500/60 hover:text-cyan-400 tracking-widest uppercase transition-colors"
        >
          [ Skip Initialization ]
        </button>
      </div>
    </div>
  );
};
