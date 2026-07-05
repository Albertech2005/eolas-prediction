"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Brain, TrendingUp, Eye, Activity, Swords, Trophy, ArrowRight, Zap, Shield, BarChart3, Sparkles, ChevronRight, Send } from "lucide-react";
import CASection from "@/components/ui/CASection";

const XIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const TICKER_ITEMS = [
  { label: "ETH → $15K", val: "47%", up: true },
  { label: "BTC → $200K", val: "28%", up: false },
  { label: "France Win WC", val: "35.6%", up: true },
  { label: "OpenAI IPO", val: "41%", up: true },
  { label: "Fed Rate Cut", val: "45%", up: false },
  { label: "Trump 2028", val: "38%", up: false },
  { label: "AI Jobs 20%", val: "67%", up: true },
  { label: "Morocco WC", val: "2.4%", up: false },
  { label: "Solana $1K", val: "23%", up: false },
  { label: "Argentina WC", val: "16.2%", up: true },
];

const FEATURES = [
  { icon: TrendingUp, title: "Trending Markets", desc: "Real-time Polymarket data ranked by 24h volume, momentum, and EOLAS confidence.", href: "/markets", color: "from-blue-500 to-cyan-500", glow: "shadow-glow-blue", badge: "LIVE" },
  { icon: Brain, title: "AI Probability Engine", desc: "GPT-4 powered probability estimates that disagree with the crowd — and profit from it.", href: "/markets", color: "from-purple-500 to-blue-500", glow: "shadow-glow-purple", badge: "AI" },
  { icon: Eye, title: "Smart Money Tracker", desc: "Follow wallets with 70%+ win rates. See exactly what the best predictors are betting.", href: "/smart-money", color: "from-green-500 to-cyan-500", glow: "shadow-glow-cyan", badge: "ALPHA" },
  { icon: Activity, title: "Narrative Heatmap", desc: "AI-scored narrative strength across 10 categories. Know what's hot before CT does.", href: "/narratives", color: "from-orange-500 to-yellow-500", glow: "", badge: "AI" },
  { icon: Swords, title: "Prediction Battles", desc: "Vote on viral prediction battles. Build your on-chain reputation. Climb the rankings.", href: "/battles", color: "from-red-500 to-pink-500", glow: "shadow-glow-red", badge: "HOT 🔥" },
  { icon: Trophy, title: "Leaderboard", desc: "Real Polymarket traders ranked by accuracy and PnL. See who's actually winning.", href: "/leaderboard", color: "from-yellow-500 to-orange-500", glow: "", badge: "REAL" },
];

const STATS = [
  { label: "Markets Tracked", value: "2,400+", icon: "📊" },
  { label: "Volume Analyzed", value: "$1.2B", icon: "💰" },
  { label: "AI Accuracy", value: "73%", icon: "🧠" },
  { label: "Active Traders", value: "18K+", icon: "👥" },
];

function FloatingCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-card p-4 rounded-2xl animate-float ${className}`}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-background noise">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] bg-cyan-600/08 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-2xl" style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)" }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-blue-500/30">
              <Image src="/eolas-logo.png" alt="EOLAS" width={36} height={36} className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">EOLAS</span>
            <span className="badge badge-blue">AI BETA</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-text-dim">
            {["Markets", "Smart Money", "Narratives", "Battles"].map(l => (
              <Link key={l} href={`/${l.toLowerCase().replace(" ", "-")}`} className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 badge badge-live">
              <span className="live-dot w-1.5 h-1.5" />
              Live
            </div>
            <Link href="/dashboard" className="btn-primary text-sm gap-2 py-2 px-4">
              <Zap size={14} />
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Ticker tape */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-surface/50 backdrop-blur-xl border-b border-white/5 py-2 overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker-track flex gap-8">
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs whitespace-nowrap">
                <span className="text-text-dim">{item.label}</span>
                <span className={`font-mono font-bold ${item.up ? "text-success" : "text-danger"}`}>
                  {item.val} {item.up ? "▲" : "▼"}
                </span>
                <span className="text-border">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative pt-44 pb-24 px-6 overflow-hidden grid-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">

            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm px-5 py-2 rounded-full mb-8 font-medium backdrop-blur-sm">
              <Sparkles size={14} className="text-blue-400" />
              The AI Intelligence Layer for Prediction Markets
              <ChevronRight size={14} />
            </div>

            {/* Headline */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-8">
              <span className="text-white block">Before the market</span>
              <span className="gradient-text block">decides,</span>
              <span className="text-white block">EOLAS predicts.</span>
            </h1>

            <p className="text-xl text-text-dim max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Real-time AI analysis on top of Polymarket. Smart money tracking, narrative forecasting,
              and probability engines built for serious predictors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn-primary text-base gap-3 py-3.5 px-8">
                <BarChart3 size={18} />
                Open Intelligence Terminal
                <ArrowRight size={16} />
              </Link>
              <Link href="/markets" className="btn-ghost text-base gap-2 py-3.5 px-8">
                View Live Markets
              </Link>
            </div>
          </div>

          {/* Floating preview cards */}
          <div className="relative h-[320px] hidden lg:block">
            {/* Center: main market card */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 z-20">
              <div className="glass-card p-5" style={{ animationDelay: "0s" }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge badge-blue">CRYPTO</span>
                  <span className="live-dot" />
                </div>
                <p className="text-sm font-semibold text-white mb-4">Will Ethereum reach $15,000 in 2026?</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-dim">Polymarket</span>
                    <span className="font-mono text-white font-bold">34.0%</span>
                  </div>
                  <div className="prob-bar">
                    <div className="prob-bar-fill bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: "34%" }} />
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <div className="flex items-center gap-1"><Brain size={10} className="text-cyan-400" /><span className="text-cyan-400 font-medium">EOLAS AI</span></div>
                    <span className="font-mono text-cyan-400 font-bold">47.0%</span>
                  </div>
                  <div className="prob-bar">
                    <div className="prob-bar-fill bg-gradient-to-r from-cyan-500 to-cyan-400" style={{ width: "47%" }} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="badge badge-green">🟢 Undervalued +13%</span>
                </div>
              </div>
            </div>

            {/* Left: smart money card */}
            <div className="absolute left-[5%] top-[10%] w-56 animate-float" style={{ animationDelay: "1s" }}>
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={13} className="text-green-400" />
                  <span className="text-xs text-green-400 font-medium">Smart Money Alert</span>
                </div>
                <div className="font-mono text-xs text-text-dim mb-1">0x742d…E021</div>
                <div className="text-xs text-text-dim">78.4% win rate · <span className="text-success">$85K YES</span></div>
                <div className="text-xs text-white mt-1 truncate">ETH → $15K 2026</div>
              </div>
            </div>

            {/* Right: narrative card */}
            <div className="absolute right-[5%] top-[10%] w-56 animate-float" style={{ animationDelay: "2s" }}>
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">🔮</span>
                  <span className="badge badge-yellow">🔥 SURGING</span>
                </div>
                <div className="font-semibold text-white text-sm mb-1">Prediction Markets</div>
                <div className="prob-bar mb-1">
                  <div className="prob-bar-fill bg-gradient-to-r from-yellow-500 to-orange-500" style={{ width: "91%" }} />
                </div>
                <div className="text-xs text-yellow-400 font-mono font-bold">91% · +12.4% 7d</div>
              </div>
            </div>

            {/* Bottom left: battle card */}
            <div className="absolute left-[20%] bottom-[0%] w-60 animate-float" style={{ animationDelay: "0.5s" }}>
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Swords size={13} className="text-red-400" />
                  <span className="badge badge-red">⚡ LIVE BATTLE</span>
                </div>
                <div className="text-xs text-white mb-3">Will BTC hit $200K before 2028?</div>
                <div className="h-4 rounded-full overflow-hidden flex">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center text-xs font-bold text-white" style={{ width: "67%" }}>67%</div>
                  <div className="bg-gradient-to-l from-red-500 to-rose-400 flex-1" />
                </div>
                <div className="flex justify-between text-xs mt-1 text-text-dim">
                  <span>✅ 847 YES</span><span>❌ 423 NO</span>
                </div>
              </div>
            </div>

            {/* Bottom right: leaderboard snippet */}
            <div className="absolute right-[20%] bottom-[0%] w-52 animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy size={13} className="text-yellow-400" />
                  <span className="text-xs text-yellow-400 font-medium">Top Predictor</span>
                </div>
                {["🥇 CryptoOracle", "🥈 NarrativeHunter", "🥉 BaseMaxi"].map((name, i) => (
                  <div key={i} className="flex justify-between text-xs py-1 border-b border-white/5 last:border-0">
                    <span className="text-text-dim">{name}</span>
                    <span className="text-success font-mono">{[81, 78, 74][i]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live stats bar */}
      <section className="border-y border-white/5 bg-surface/40 backdrop-blur-xl py-6">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={s.label} className="text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black gradient-text font-mono">{s.value}</div>
              <div className="text-xs text-text-dim mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge badge-purple mb-4 inline-flex">6 INTELLIGENCE MODULES</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 tracking-tight">
              Built for predictors<br />
              <span className="gradient-text">who want to win.</span>
            </h2>
            <p className="text-text-dim text-lg max-w-xl mx-auto">Every tool you need to find edge in prediction markets — all in one terminal.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <Link key={f.title} href={f.href}>
                <div className="glass-card p-6 h-full cursor-pointer group" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg`}>
                      <f.icon size={22} className="text-white" />
                    </div>
                    <span className="badge badge-blue text-xs">{f.badge}</span>
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2 group-hover:gradient-text transition-all">{f.title}</h3>
                  <p className="text-text-dim text-sm leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-all">
                    Explore <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contract Address */}
      <CASection />

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-glow pointer-events-none" />
            <div className="relative z-10">
              <div className="text-5xl mb-6">🧠</div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
                Ready to get the <span className="gradient-text">edge?</span>
              </h2>
              <p className="text-text-dim text-lg mb-8 max-w-md mx-auto">
                Join thousands of traders using EOLAS AI to stay ahead of prediction markets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard" className="btn-primary text-base gap-2 py-3.5 px-8">
                  <Zap size={16} /> Start for Free <ArrowRight size={16} />
                </Link>
                <Link href="/battles" className="btn-ghost text-base py-3.5 px-8">
                  🔥 Join a Battle
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-text-dim">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg overflow-hidden ring-1 ring-white/10">
              <Image src="/eolas-logo.png" alt="EOLAS" width={28} height={28} />
            </div>
            <span>EOLAS © 2026 · AI Prediction Intelligence · Built on Base</span>
          </div>
          <div className="flex items-center gap-5">
            {["Markets", "Battles", "Leaderboard"].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} className="hover:text-white transition-colors">{l}</Link>
            ))}
            <div className="w-px h-4 bg-white/10" />
            <a
              href="https://x.com/eolas_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
              title="Follow on X"
            >
              <XIcon size={13} /> X
            </a>
            <a
              href="https://t.me/c/eolastg/1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
              title="Join Telegram"
            >
              <Send size={13} /> Telegram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
