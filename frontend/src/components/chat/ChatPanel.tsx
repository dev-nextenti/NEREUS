import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, SafetyVerdict, AICoreState } from "../../types";
import {
  Mic,
  Send,
  ArrowRight,
  ShieldAlert,
  Compass,
  FileText,
  Volume2,
  VolumeX,
  Cpu,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Languages,
  Activity,
} from "lucide-react";
import { VoiceLanguage } from "../../lib/languages";

interface ChatPanelProps {
  className?: string;
  messages: ChatMessage[];
  onSendMessage: (text: string, langCode?: string) => void;
  onVoiceClick: () => void;
  isListening: boolean;
  isSpeaking?: boolean;
  onViewOnGlobe: (lat?: number, lon?: number) => void;
  onShowEvidence: (msg: ChatMessage) => void;
  onShowRoute: () => void;
  onSpeakAgain: (text: string, lang?: string) => void;
  currentLanguage?: VoiceLanguage;
  onOpenVoiceModal?: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  className,
  messages,
  onSendMessage,
  onVoiceClick,
  isListening,
  isSpeaking = false,
  onViewOnGlobe,
  onShowEvidence,
  onShowRoute,
  onSpeakAgain,
  currentLanguage,
  onOpenVoiceModal,
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), currentLanguage?.code);
    setInputText("");
  };

  // Exact 3 Prompts from reference image
  const defaultPrompts = [
    "Where is the nearest Potential Fishing Zone today?",
    "Is it safe to venture into the sea tomorrow morning?",
    "What are the tide, weather, and sea conditions near my location?",
  ];

  const prompts = currentLanguage && currentLanguage.code !== "en"
    ? currentLanguage.sampleQueries.slice(0, 3)
    : defaultPrompts;

  return (
    <div
      className={
        className ||
        "w-[370px] max-h-[calc(100vh-140px)] flex flex-col rounded-2xl bg-[#031329]/80 border border-cyan-500/30 backdrop-blur-xl pointer-events-auto shadow-[0_12px_40px_rgba(0,10,30,0.7)] transition-all overflow-hidden"
      }
    >
      {/* Exact Header: Avatar + NEREUS + AI Marine Assistant */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-cyan-950/30 shrink-0">
        <div className="flex items-center gap-3">
          {/* Glowing Avatar with Trident */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-cyan-950/90 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
            <svg className="w-5 h-5 text-cyan-300" viewBox="0 0 100 100" fill="none">
              <path d="M50 8 L54 28 L52 75 L48 75 L46 28 Z" fill="#00e5ff" />
              <polygon points="50,4 56,16 50,22 44,16" fill="#00f0b5" />
              <path d="M46 38 C32 40 24 28 26 14 L30 18 C28 26 34 34 46 32 Z" fill="#00e5ff" />
              <path d="M54 38 C68 40 76 28 74 14 L70 18 C72 26 66 34 54 32 Z" fill="#00e5ff" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold tracking-wider text-slate-100 font-heading">
              NEREUS
            </div>
            <div className="text-[10px] text-cyan-400 font-mono tracking-wide">
              AI Marine Assistant
            </div>
          </div>
        </div>

        {/* Built-in Language Tag Button */}
        {onOpenVoiceModal && currentLanguage && (
          <button
            onClick={onOpenVoiceModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 hover:text-white hover:border-cyan-300 text-[10px] font-mono transition-all"
            title="Switch Language / Open Voice Assistant"
          >
            <span>{currentLanguage.flag}</span>
            <span className="font-bold">{currentLanguage.nativeName}</span>
            <Languages className="w-3 h-3 text-cyan-400 ml-0.5" />
          </button>
        )}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs font-sans">
        {/* Exact Greeting Card from image */}
        <div className="p-3.5 rounded-xl bg-[#041630]/70 border border-cyan-500/20 text-slate-200 leading-relaxed text-[11px]">
          Hello! I&apos;m Nereus — your AI marine assistant. Ask me anything about fishing zones, weather, tides, or ocean conditions. I&apos;ll get you the latest satellite data and real-time insights.
        </div>

        {/* Try asking section (shown when few messages) */}
        {messages.length === 0 && (
          <div className="space-y-2 pt-1">
            <div className="text-[11px] text-slate-300 font-sans tracking-wide">
              Try asking:
            </div>
            {prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => onSendMessage(prompt, currentLanguage?.code)}
                className="w-full text-left p-3 rounded-xl bg-[#021024]/80 border border-cyan-500/20 hover:border-cyan-400/70 hover:bg-cyan-950/60 text-slate-200 flex items-center justify-between group transition-all"
              >
                <span className="text-[11px] leading-snug text-slate-200 group-hover:text-cyan-100">
                  {prompt}
                </span>
                <ArrowRight className="w-4 h-4 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </button>
            ))}
          </div>
        )}

        {/* Chat History Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            {/* Sender & Timestamp */}
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[9px] font-mono text-cyan-400/60">
              <span>{msg.sender === "user" ? "YOU" : "NEREUS AI"}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
              {msg.language && (
                <>
                  <span>•</span>
                  <span className="uppercase text-teal-400">{msg.language}</span>
                </>
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`p-3 rounded-2xl max-w-[92%] leading-relaxed ${
                msg.sender === "user"
                  ? "bg-cyan-600/25 border border-cyan-400/50 text-cyan-100 rounded-tr-none shadow-cyan-glow"
                  : "bg-[#021124]/90 border border-cyan-500/25 text-slate-200 rounded-tl-none shadow-xl"
              }`}
            >
              {/* Safety Verdict Badge (Nereus Only) */}
              {msg.verdict && (
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider ${
                      msg.verdict === "SAFE"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-500/50"
                        : msg.verdict === "CAUTION"
                        ? "bg-amber-950 text-amber-400 border border-amber-500/50"
                        : "bg-red-950 text-red-400 border border-red-500/50 animate-pulse"
                    }`}
                  >
                    {msg.verdict === "SAFE" && <CheckCircle2 className="w-3 h-3" />}
                    {msg.verdict === "CAUTION" && <AlertTriangle className="w-3 h-3" />}
                    {msg.verdict === "DANGER" && <ShieldAlert className="w-3 h-3" />}
                    VERDICT: {msg.verdict}
                  </span>

                  {msg.riskScore !== undefined && (
                    <span className="text-[10px] font-mono text-slate-400">
                      Risk: {msg.riskScore}/100
                    </span>
                  )}
                </div>
              )}

              {/* Spoken Voice Script in Regional Language */}
              {msg.spokenAudio && msg.spokenAudio !== msg.text && (
                <div className="mb-2 p-2 rounded-lg bg-teal-950/40 border border-teal-500/30 text-teal-200 font-sans text-xs">
                  <div className="flex items-center justify-between text-[9px] font-mono text-teal-400 mb-0.5">
                    <span>REGIONAL VOICE ADVISORY:</span>
                    <button
                      onClick={() => onSpeakAgain(msg.spokenAudio!, msg.language)}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Play</span>
                    </button>
                  </div>
                  {msg.spokenAudio}
                </div>
              )}

              {/* Text Body */}
              <div className="whitespace-pre-line text-xs">{msg.text}</div>
            </div>

            {/* AI Agent Action Bar */}
            {msg.sender === "nereus" && (
              <div className="flex items-center gap-2 mt-1.5 px-1">
                {msg.evidenceChain && (
                  <button
                    onClick={() => onShowEvidence(msg)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-950/70 border border-cyan-400/30 text-[10px] font-mono text-cyan-300 hover:bg-cyan-900/50 transition-all"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Evidence</span>
                  </button>
                )}

                {msg.nearestPfz && (
                  <button
                    onClick={() =>
                      onViewOnGlobe(
                        msg.nearestPfz?.latitude,
                        msg.nearestPfz?.longitude
                      )
                    }
                    className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-950/70 border border-cyan-400/30 text-[10px] font-mono text-cyan-300 hover:bg-cyan-900/50 transition-all"
                  >
                    <Compass className="w-3 h-3" />
                    <span>Globe View</span>
                  </button>
                )}

                <button
                  onClick={() =>
                    onSpeakAgain(
                      msg.spokenAudio || msg.text,
                      msg.language || currentLanguage?.code
                    )
                  }
                  className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-950/70 border border-cyan-400/30 text-[10px] font-mono text-cyan-300 hover:bg-cyan-900/50 transition-all"
                  title="Speak Response Aloud"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Speak</span>
                </button>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Exact Input Capsule from Image: Soundwave on Left + "Type or speak..." + Mic on Right */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-cyan-500/20 bg-[#020b18]/90 shrink-0"
      >
        <div className="relative flex items-center rounded-full bg-[#03142e]/90 border border-cyan-500/30 px-3.5 py-1.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] focus-within:border-cyan-400 transition-all">
          {/* Soundwave Icon on Left */}
          <div className="flex items-center gap-0.5 mr-2.5 shrink-0">
            {[4, 10, 14, 8, 12, 6].map((h, idx) => (
              <span
                key={idx}
                className={`w-0.5 rounded-full transition-all ${
                  isListening
                    ? "bg-red-400 animate-pulse"
                    : isSpeaking
                    ? "bg-teal-300 animate-pulse"
                    : "bg-cyan-400/70"
                }`}
                style={{
                  height: isListening || isSpeaking ? `${h}px` : `${Math.max(4, h * 0.6)}px`,
                  animationDelay: `${idx * 100}ms`,
                }}
              />
            ))}
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? `Listening in ${currentLanguage?.name || "English"}...`
                : "Type or speak..."
            }
            className="flex-1 bg-transparent text-xs text-slate-100 placeholder-cyan-400/50 focus:outline-none font-sans"
          />

          {/* Microphone Trigger Button on Right */}
          <button
            type="button"
            onClick={onVoiceClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ml-1 shrink-0 ${
              isListening
                ? "bg-red-600 text-white animate-pulse shadow-[0_0_15px_rgba(255,51,85,0.8)]"
                : "bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 hover:bg-cyan-900 hover:text-white shadow-cyan-glow"
            }`}
            title={
              isListening
                ? "Listening... Click to stop"
                : `Click to Speak in ${currentLanguage?.nativeName || "English"}`
            }
          >
            <Mic className="w-3.5 h-3.5" />
          </button>

          {/* Send Button if input has text */}
          {inputText.trim() && (
            <button
              type="submit"
              className="ml-1.5 w-7 h-7 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center transition-all shrink-0"
              title="Send query"
            >
              <Send className="w-3 h-3 text-black" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
