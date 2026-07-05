"use client";
import { useState } from "react";
import { Copy, Check, ExternalLink, Zap } from "lucide-react";

const CA = "0xF878e27aFB649744EEC3c5c0d03bc9335703CFE3";
const BUY_LINK = "https://og.creator.bid/agents/67386d539ae05044ee676a5e";

export default function CASection() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-20 px-6" id="token">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 badge badge-blue mb-4 py-1.5 px-4 text-xs">
            <Zap size={11} /> $EOLAS Token · Base Chain
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
            Get the <span className="gradient-text">Contract Address</span>
          </h2>
          <p className="text-text-dim text-base max-w-md mx-auto">
            Hold 10,000+ $EOLAS to unlock the full terminal. One address. One chain. No middlemen.
          </p>
        </div>

        {/* CA card */}
        <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 right-0 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Chain badge */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-white">Base Network</span>
                <span className="badge badge-cyan text-[10px]">ERC-20</span>
              </div>
            </div>

            {/* CA display */}
            <div className="bg-white/5 border border-white/8 rounded-2xl p-5 mb-5">
              <div className="text-xs text-text-dim uppercase tracking-widest font-semibold mb-3 text-center">
                Contract Address
              </div>
              <p className="font-mono text-sm sm:text-base text-blue-300 text-center break-all leading-relaxed tracking-wide select-all">
                {CA}
              </p>
            </div>

            {/* Copy button */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={copy}
                className="btn-primary gap-3 py-3.5 px-8 text-sm justify-center"
                style={{
                  background: copied
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : undefined,
                  boxShadow: copied
                    ? "0 0 20px rgba(16,185,129,0.4)"
                    : undefined,
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Address Copied!" : "Copy Contract Address"}
              </button>

              <a
                href={BUY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost gap-2 py-3.5 px-8 text-sm justify-center"
              >
                Buy $EOLAS <ExternalLink size={14} />
              </a>
            </div>

            {/* Minimum notice */}
            <p className="text-center text-xs text-text-dim mt-5 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Minimum 10,000 $EOLAS required for terminal access
            </p>
          </div>
        </div>

        {/* Dex links */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          {[
            { label: "View on BaseScan", href: `https://basescan.org/token/${CA}` },
            { label: "DexScreener", href: `https://dexscreener.com/base/${CA}` },
          ].map(l => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-text-dim hover:text-primary transition-colors border border-white/5 hover:border-primary/30 rounded-xl px-4 py-2 bg-white/3"
            >
              {l.label} <ExternalLink size={11} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
