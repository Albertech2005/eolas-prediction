"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import { Trophy, ExternalLink, Users, BarChart3, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import { shortAddress, formatVolume, cn } from "@/lib/utils";
import { useAccount } from "wagmi";

export default function LeaderboardPage() {
  const { address: connectedAddress } = useAccount();
  const [input, setInput] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async (addr: string) => {
    const clean = addr.trim();
    if (!clean.startsWith("0x") || clean.length !== 42) {
      setError("Please enter a valid Ethereum address");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/smart-money/lookup/${clean}`);
      setData(res.data);
    } catch {
      setError("Wallet not found or no Polymarket activity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-white flex items-center justify-center gap-3 mb-2">
            <Trophy size={28} className="text-yellow-400" /> Prediction Leaderboard
          </h1>
          <p className="text-text-dim text-sm">Track any trader's real performance on Polymarket</p>
        </div>

        {/* Polymarket Official Leaderboard CTA */}
        <a
          href="https://polymarket.com/leaderboard"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card p-5 mb-6 border-yellow-500/20 flex items-center justify-between hover:border-yellow-500/40 transition-all group block"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-glow-blue">
              <Trophy size={22} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                Official Polymarket Leaderboard
                <span className="badge badge-yellow">LIVE</span>
              </div>
              <div className="text-sm text-text-dim mt-0.5">
                Real top traders ranked by profit, volume and accuracy on Polymarket
              </div>
            </div>
          </div>
          <ExternalLink size={18} className="text-text-dim group-hover:text-yellow-400 transition-colors flex-shrink-0" />
        </a>

        {/* My Stats quick lookup */}
        <div className="glass-card p-5 mb-6">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Search size={16} className="text-primary" />
            Look Up Any Trader's Stats
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && lookup(input)}
              placeholder="0x... wallet address"
              className="flex-1 bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-text-dim focus:outline-none focus:border-primary font-mono"
            />
            <button onClick={() => lookup(input)} disabled={loading} className="btn-primary text-sm py-2.5 px-5">
              {loading ? "Loading..." : "Look Up"}
            </button>
          </div>
          {connectedAddress && (
            <button
              onClick={() => { setInput(connectedAddress); lookup(connectedAddress); }}
              className="mt-3 text-xs text-primary hover:text-primary-light border border-primary/20 px-3 py-1.5 rounded-lg bg-primary/5 transition-all"
            >
              My Stats ({shortAddress(connectedAddress)})
            </button>
          )}
          {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
        </div>

        {/* Wallet stats result */}
        {data && (
          <div className="glass-card overflow-hidden mb-6 animate-fade-in">
            <div className="px-5 py-4 border-b border-white/5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">
                  {shortAddress(data.address)} — Polymarket Stats
                </span>
                <a href={`https://polymarket.com/profile/${data.address}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-primary flex items-center gap-1 hover:underline">
                  View Profile <ExternalLink size={11} />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-y divide-white/5">
              {[
                { label: "Positions", value: data.raw_count },
                { label: "Active", value: data.stats.active_positions },
                { label: "Total P&L", value: `${data.stats.cash_pnl >= 0 ? "+" : ""}${formatVolume(data.stats.cash_pnl)}`, color: data.stats.cash_pnl >= 0 ? "text-green-400" : "text-red-400" },
                { label: "Invested", value: formatVolume(data.stats.total_invested) },
              ].map(s => (
                <div key={s.label} className="p-4 text-center">
                  <div className="text-xs text-text-dim mb-1">{s.label}</div>
                  <div className={cn("font-bold font-mono", s.color || "text-white")}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Trophy,
              color: "from-yellow-400 to-orange-500",
              title: "Top Profits",
              desc: "See who made the most profit on Polymarket this month",
              href: "https://polymarket.com/leaderboard/overall/monthly/profit",
              label: "View →",
            },
            {
              icon: BarChart3,
              color: "from-blue-500 to-purple-500",
              title: "Top Volume",
              desc: "Highest trading volume across all markets",
              href: "https://polymarket.com/leaderboard/overall/monthly/volume",
              label: "View →",
            },
            {
              icon: Users,
              color: "from-green-500 to-cyan-500",
              title: "Most Accurate",
              desc: "Best win rate among all active traders",
              href: "https://polymarket.com/leaderboard",
              label: "View →",
            },
          ].map(c => (
            <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer">
              <div className="glass-card p-5 hover:border-primary/40 transition-all group h-full">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3`}>
                  <c.icon size={18} className="text-white" />
                </div>
                <div className="font-bold text-white mb-1 group-hover:text-primary transition-colors">{c.title}</div>
                <div className="text-xs text-text-dim mb-3">{c.desc}</div>
                <div className="text-xs text-primary font-medium">{c.label}</div>
              </div>
            </a>
          ))}
        </div>

        <p className="text-center text-xs text-text-dim mt-6">
          Leaderboard data is sourced from{" "}
          <a href="https://polymarket.com/leaderboard" target="_blank" className="text-primary hover:underline">
            polymarket.com/leaderboard
          </a>{" "}
          — we show the official data, not approximations.
        </p>
      </div>
    </PageWrapper>
  );
}
