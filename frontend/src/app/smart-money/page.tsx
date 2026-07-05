"use client";
import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { api } from "@/lib/api";
import { shortAddress, formatVolume, cn } from "@/lib/utils";
import { Eye, Search, ExternalLink, TrendingUp, TrendingDown, Loader2, AlertCircle, Wallet, Info } from "lucide-react";
import { useAccount } from "wagmi";

interface Position {
  market: string;
  outcome: string;
  size: number;
  avg_price: number;
  current_price: number;
  current_value: number;
  total_bought: number;
  cash_pnl: number;
  percent_pnl: number;
  redeemable: boolean;
  icon?: string;
  event_slug?: string;
}

interface WalletData {
  address: string;
  stats: {
    total_positions: number;
    active_positions: number;
    total_invested: number;
    current_value: number;
    cash_pnl: number;
    realized_pnl: number;
    win_rate: number;
    wins: number;
  };
  positions: Position[];
  raw_count: number;
  source: string;
  fetched_at: string;
}

export default function SmartMoneyPage() {
  const { address: connectedAddress } = useAccount();
  const [input, setInput] = useState("");
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async (addr: string) => {
    const clean = addr.trim();
    if (!clean.startsWith("0x") || clean.length !== 42) {
      setError("Please enter a valid Ethereum address (0x...)");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await api.get(`/api/smart-money/lookup/${clean}`);
      setData(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to fetch wallet data. Check the address and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Eye size={22} className="text-green-400" /> Smart Money Tracker
          </h1>
          <p className="text-text-dim text-sm mt-1">
            Real Polymarket position data for any wallet — fetched live from the blockchain
          </p>
        </div>

        {/* How it works note */}
        <div className="glass-card p-4 mb-6 border-blue-500/20 flex items-start gap-3">
          <Info size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-text-dim">
            Enter any wallet address to see their <span className="text-white font-medium">real, live Polymarket positions</span> — pulled directly from Polymarket's data API. 
            No guesswork, no fake data. Every position shown is verified on-chain.
          </p>
        </div>

        {/* Search bar */}
        <div className="glass-card p-5 mb-6">
          <label className="text-xs text-text-dim uppercase tracking-wider font-semibold mb-3 block">Wallet Address</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Wallet size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && lookup(input)}
                placeholder="0x742d35Cc6634C0532925a3b844Bc454..."
                className="w-full bg-white/5 border border-border rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors font-mono"
              />
            </div>
            <button
              onClick={() => lookup(input)}
              disabled={loading}
              className="btn-primary px-5 py-3 text-sm gap-2 flex-shrink-0"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
              {loading ? "Looking up..." : "Look Up"}
            </button>
          </div>

          {/* Quick actions */}
          {connectedAddress && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-text-dim">Quick:</span>
              <button
                onClick={() => { setInput(connectedAddress); lookup(connectedAddress); }}
                className="text-xs text-primary hover:text-primary-light transition-colors border border-primary/20 hover:border-primary/40 px-3 py-1 rounded-lg bg-primary/5"
              >
                My Wallet ({shortAddress(connectedAddress)})
              </button>
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="glass-card p-12 text-center">
            <Loader2 size={32} className="text-primary animate-spin mx-auto mb-4" />
            <p className="text-white font-medium mb-1">Fetching positions from Polymarket...</p>
            <p className="text-text-dim text-sm">Reading live data from the blockchain</p>
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          <div className="animate-fade-in space-y-6">
            {/* Wallet header */}
            <div className="glass-card p-5 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center">
                  <Wallet size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-mono text-white font-semibold">{shortAddress(data.address)}</div>
                  <div className="text-xs text-text-dim mt-0.5">
                    {data.raw_count} total positions · Live from Polymarket
                  </div>
                </div>
              </div>
              <a
                href={`https://polymarket.com/profile/${data.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs py-2 px-4 flex items-center gap-2"
              >
                View on Polymarket <ExternalLink size={12} />
              </a>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Active Positions", value: data.stats.active_positions, color: "text-blue-400" },
                { label: "Total Invested", value: formatVolume(data.stats.total_invested), color: "text-white" },
                { label: "Current Value", value: formatVolume(data.stats.current_value), color: "text-white" },
                {
                  label: "Total P&L",
                  value: `${data.stats.cash_pnl >= 0 ? "+" : ""}${formatVolume(data.stats.cash_pnl)}`,
                  color: data.stats.cash_pnl >= 0 ? "text-green-400" : "text-red-400"
                },
              ].map(s => (
                <div key={s.label} className="glass-card p-4 text-center">
                  <div className="text-xs text-text-dim mb-2">{s.label}</div>
                  <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Positions table */}
            {data.positions.length > 0 ? (
              <div className="glass-card overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                  <h2 className="font-bold text-white flex items-center gap-2">
                    <Eye size={16} className="text-green-400" />
                    Active Positions
                    <span className="badge badge-green">{data.positions.length}</span>
                  </h2>
                  <span className="text-xs text-text-dim">Fetched {new Date(data.fetched_at).toLocaleTimeString()}</span>
                </div>

                {/* Header row */}
                <div className="grid grid-cols-12 px-5 py-2 text-xs text-text-dim uppercase tracking-wider border-b border-white/5 font-medium">
                  <span className="col-span-5">Market</span>
                  <span className="col-span-2 text-center">Outcome</span>
                  <span className="col-span-2 text-right">Value</span>
                  <span className="col-span-2 text-right">P&L</span>
                  <span className="col-span-1 text-right">%</span>
                </div>

                <div className="divide-y divide-white/5">
                  {data.positions.map((pos, i) => {
                    const pnlUp = pos.cash_pnl >= 0;
                    const pctUp = pos.percent_pnl >= 0;
                    return (
                      <div key={i} className="grid grid-cols-12 px-5 py-3 hover:bg-white/3 transition-colors items-center">
                        {/* Market */}
                        <div className="col-span-5 flex items-center gap-2 min-w-0">
                          {pos.icon && (
                            <img src={pos.icon} alt="" className="w-7 h-7 rounded-lg object-cover flex-shrink-0 border border-white/10"
                              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          )}
                          <div className="min-w-0">
                            <div className="text-xs text-white font-medium truncate">{pos.market}</div>
                            {pos.event_slug && (
                              <a
                                href={`https://polymarket.com/event/${pos.event_slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:text-primary-light flex items-center gap-1 mt-0.5"
                              >
                                View <ExternalLink size={9} />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Outcome */}
                        <div className="col-span-2 text-center">
                          <span className={cn(
                            "badge text-xs",
                            pos.outcome?.toLowerCase() === "yes" || pos.outcome?.toLowerCase() === "up"
                              ? "badge-green"
                              : pos.outcome?.toLowerCase() === "no" || pos.outcome?.toLowerCase() === "down"
                              ? "badge-red"
                              : "badge-blue"
                          )}>
                            {pos.outcome}
                          </span>
                        </div>

                        {/* Current value */}
                        <div className="col-span-2 text-right font-mono text-sm text-white">
                          {formatVolume(pos.current_value)}
                        </div>

                        {/* P&L */}
                        <div className={cn("col-span-2 text-right font-mono text-sm font-semibold", pnlUp ? "text-green-400" : "text-red-400")}>
                          <div className="flex items-center justify-end gap-1">
                            {pnlUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                            {pnlUp ? "+" : ""}{formatVolume(pos.cash_pnl)}
                          </div>
                        </div>

                        {/* % PnL */}
                        <div className={cn("col-span-1 text-right font-mono text-xs", pctUp ? "text-green-400" : "text-red-400")}>
                          {pctUp ? "+" : ""}{(pos.percent_pnl * 100).toFixed(1)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <Eye size={32} className="text-text-dim mx-auto mb-4 opacity-30" />
                <p className="text-white font-medium">No active Polymarket positions found</p>
                <p className="text-text-dim text-sm mt-2">This wallet hasn't traded on Polymarket recently.</p>
              </div>
            )}

            {/* Source attribution */}
            <p className="text-xs text-text-dim text-center">
              Data sourced directly from <a href="https://polymarket.com" target="_blank" className="text-primary hover:underline">Polymarket's data API</a> · 100% real on-chain data
            </p>
          </div>
        )}

        {/* Empty state */}
        {!data && !loading && (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
              <Eye size={28} className="text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Track Any Polymarket Wallet</h2>
            <p className="text-text-dim text-sm max-w-md mx-auto mb-6">
              Enter any wallet address above to see their live Polymarket positions, P&L, and trading history — pulled directly from Polymarket's API.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm text-text-dim">
              <div className="flex items-center gap-2 badge badge-blue">🔍 Real positions only</div>
              <div className="flex items-center gap-2 badge badge-green">✅ Live blockchain data</div>
              <div className="flex items-center gap-2 badge badge-purple">🔒 Read-only</div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
