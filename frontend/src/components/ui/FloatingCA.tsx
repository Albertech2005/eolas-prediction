"use client";
import { useEffect, useState } from "react";
import { Copy, Check, X, Zap } from "lucide-react";

const CA = "0xF878e27aFB649744EEC3c5c0d03bc9335703CFE3";
const SHORT_CA = `${CA.slice(0, 6)}...${CA.slice(-4)}`;

// First appearance: 12s after page load
// Then every 75s after dismissal
const FIRST_DELAY = 12_000;
const REPEAT_DELAY = 75_000;
const AUTO_HIDE_AFTER = 10_000;

export default function FloatingCA() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let show: ReturnType<typeof setTimeout>;
    let hide: ReturnType<typeof setTimeout>;
    let repeat: ReturnType<typeof setTimeout>;

    const schedule = (delay: number) => {
      show = setTimeout(() => {
        setVisible(true);
        setDismissed(false);
        hide = setTimeout(() => setVisible(false), AUTO_HIDE_AFTER);
        // schedule next
        repeat = setTimeout(() => schedule(REPEAT_DELAY), AUTO_HIDE_AFTER + REPEAT_DELAY);
      }, delay);
    };

    schedule(FIRST_DELAY);
    return () => { clearTimeout(show); clearTimeout(hide); clearTimeout(repeat); };
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 animate-slide-up"
      style={{ filter: "drop-shadow(0 8px 32px rgba(59,130,246,0.35))" }}
    >
      <div className="glass-card p-4 max-w-xs w-full border border-blue-500/30"
        style={{ background: "linear-gradient(135deg, rgba(17,24,39,0.97) 0%, rgba(15,23,42,0.95) 100%)" }}>
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Zap size={11} className="text-white" />
            </div>
            <span className="text-xs font-bold text-white">$EOLAS Contract</span>
            <span className="badge badge-blue text-[10px] py-0.5 px-1.5">Base</span>
          </div>
          <button onClick={dismiss} className="text-text-dim hover:text-white transition-colors p-1">
            <X size={13} />
          </button>
        </div>

        {/* CA */}
        <div className="bg-white/5 rounded-xl px-3 py-2.5 mb-3 flex items-center justify-between gap-2 border border-white/5">
          <span className="font-mono text-xs text-blue-300 tracking-wider truncate">{SHORT_CA}</span>
          <button
            onClick={copy}
            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold transition-all px-2.5 py-1 rounded-lg"
            style={{
              background: copied ? "rgba(16,185,129,0.15)" : "rgba(59,130,246,0.15)",
              color: copied ? "#34D399" : "#60A5FA",
              border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(59,130,246,0.3)"}`,
            }}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <p className="text-[10px] text-text-dim text-center">
          Minimum 10,000 $EOLAS for terminal access
        </p>
      </div>
    </div>
  );
}
