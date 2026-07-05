"use client";
import { useTokenGate, EOLAS_BUY_LINK, MINIMUM_TOKENS } from "@/lib/tokenGate";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ShoppingCart, Shield, Lock, ExternalLink, CheckCircle, Loader2, Wallet } from "lucide-react";
import Image from "next/image";

function GateScreen() {
  const { isConnected, balance, hasAccess, isLoading } = useTokenGate();

  // ── NOT CONNECTED ──────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 text-center max-w-md w-full animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-blue-500/40">
              <Image src="/eolas-logo.png" alt="EOLAS" width={48} height={48} className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-2xl text-white tracking-tight">EOLAS</span>
            <span className="badge badge-blue">AI</span>
          </div>

          <div className="glass-card p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-glow-blue">
              <Wallet size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white mb-3">Connect Your Wallet</h1>
            <p className="text-text-dim mb-8 leading-relaxed">
              Connect your wallet to verify your{" "}
              <span className="text-white font-semibold">$EOLAS token</span> holdings and access the Intelligence Terminal.
            </p>
            <div className="flex justify-center mb-6">
              <ConnectButton label="Connect Wallet to Enter" chainStatus="none" showBalance={false} />
            </div>
            <div className="flex items-center gap-2 text-xs text-text-dim justify-center bg-white/3 rounded-xl px-4 py-3 border border-white/5">
              <Shield size={12} className="text-green-400" />
              <span>Read-only check. Your funds are <span className="text-white font-semibold">100% safe.</span></span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {[{ icon: "🧠", label: "AI Engine" }, { icon: "👁️", label: "Smart Money" }, { icon: "⚔️", label: "Battles" }].map(f => (
              <div key={f.label} className="glass-card p-3 text-center">
                <div className="text-xl mb-1">{f.icon}</div>
                <div className="text-xs text-text-dim">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── CHECKING BALANCE ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
            <Loader2 size={28} className="text-blue-400 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Verifying $EOLAS Balance</h2>
          <p className="text-text-dim text-sm">Checking your wallet on Base…</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {[0, 150, 300].map(d => (
              <div key={d} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── INSUFFICIENT BALANCE ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-md w-full animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-blue-500/40">
            <Image src="/eolas-logo.png" alt="EOLAS" width={48} height={48} className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-2xl text-white tracking-tight">EOLAS</span>
          <span className="badge badge-blue">AI</span>
        </div>

        <div className="glass-card p-8 border-orange-500/20">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6 shadow-glow-red">
            <Lock size={28} className="text-white" />
          </div>

          <h1 className="text-2xl font-black text-white mb-3">$EOLAS Token Required</h1>
          <p className="text-text-dim leading-relaxed mb-6">
            You need to hold a minimum of{" "}
            <span className="text-orange-400 font-bold">{MINIMUM_TOKENS.toLocaleString()} $EOLAS tokens</span>{" "}
            in your connected wallet to access the Intelligence Terminal.
          </p>

          {/* Balance display */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-5 text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-dim">Your $EOLAS Balance</span>
              <span className="font-mono font-bold text-white text-lg">
                {balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-dim">Required</span>
              <span className="font-mono font-bold text-white text-lg">{MINIMUM_TOKENS.toLocaleString()}</span>
            </div>

            {/* Progress bar */}
            <div className="h-px bg-white/5 my-1" />
            <div>
              <div className="prob-bar">
                <div
                  className="prob-bar-fill bg-gradient-to-r from-orange-500 to-red-500"
                  style={{ width: `${Math.min(100, (balance / MINIMUM_TOKENS) * 100)}%`, transition: "width 1s ease" }}
                />
              </div>
              <div className="text-xs text-text-dim mt-1.5 text-right font-mono">
                {Math.min(100, (balance / MINIMUM_TOKENS) * 100).toFixed(1)}% of required
              </div>
            </div>
          </div>

          {/* Safety note */}
          <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl px-4 py-3 mb-6 text-left">
            <p className="text-sm text-blue-300 leading-relaxed">
              🔒 <span className="font-semibold">Tokens stay in your wallet.</span> This is a read-only balance check — nothing is sent to us. Your funds are completely safe.
            </p>
          </div>

          {/* Buy CTA */}
          <a
            href={EOLAS_BUY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center gap-3 py-4 text-base mb-4"
            style={{ display: "flex" }}
          >
            <ShoppingCart size={18} />
            Buy $EOLAS to Enter
            <ExternalLink size={14} />
          </a>

          <div className="flex justify-center">
            <ConnectButton label="Switch Wallet" chainStatus="icon" showBalance={false} />
          </div>
        </div>

        {/* Unlock list */}
        <div className="glass-card p-5 mt-4 text-left">
          <p className="text-xs text-text-dim font-semibold uppercase tracking-wider mb-3">What you unlock</p>
          <div className="space-y-2.5">
            {[
              "🧠 AI Probability Engine (GPT-4 powered)",
              "👁️ Smart Money Wallet Tracker",
              "📊 Full Trending Markets Terminal",
              "🌊 Narrative Heatmap",
              "⚔️ Prediction Battles & Leaderboard",
              "🔔 Live Market Alerts",
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-text-dim">
                <CheckCircle size={13} className="text-green-400 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TokenGate({ children }: { children: React.ReactNode }) {
  const { isConnected, hasAccess, isLoading } = useTokenGate();

  if (!isConnected || isLoading || !hasAccess) {
    return <GateScreen />;
  }

  return <>{children}</>;
}
