"use client";
import { shortAddress, formatVolume, cn } from "@/lib/utils";
import { TrendingUp, AlertCircle, ExternalLink } from "lucide-react";

export interface SmartWallet {
  address: string;
  win_rate: number;
  total_volume: number;
  current_positions: { market: string; side: "YES" | "NO"; amount: number }[];
  accuracy_7d: number;
  pnl_30d: number;
  trades_30d: number;
  tags: string[];
}

export default function WalletCard({ wallet, rank }: { wallet: SmartWallet; rank: number }) {
  const isWinner = wallet.win_rate >= 70;

  return (
    <div className="glass-card p-5 hover:border-primary/40 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-mono",
            rank === 1 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40" :
            rank === 2 ? "bg-slate-400/20 text-slate-300 border border-slate-400/40" :
            rank === 3 ? "bg-amber-700/20 text-amber-600 border border-amber-700/40" :
            "bg-primary/10 text-primary border border-primary/20"
          )}>
            #{rank}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-text font-medium">{shortAddress(wallet.address)}</span>
              <a href={`https://basescan.org/address/${wallet.address}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={12} className="text-text-dim hover:text-primary transition-colors" />
              </a>
            </div>
            <div className="flex gap-1.5 mt-1 flex-wrap">
              {wallet.tags.map(tag => (
                <span key={tag} className="text-xs bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={cn(
          "text-lg font-bold font-mono",
          wallet.win_rate >= 70 ? "text-success" : wallet.win_rate >= 55 ? "text-warning" : "text-danger"
        )}>
          {wallet.win_rate.toFixed(0)}%
          <div className="text-xs text-text-dim font-sans text-right">win rate</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-xs text-text-dim mb-1">Volume</div>
          <div className="text-sm font-mono font-semibold text-text">{formatVolume(wallet.total_volume)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-text-dim mb-1">Trades/30d</div>
          <div className="text-sm font-mono font-semibold text-text">{wallet.trades_30d}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-text-dim mb-1">PnL/30d</div>
          <div className={cn(
            "text-sm font-mono font-semibold",
            wallet.pnl_30d >= 0 ? "text-success" : "text-danger"
          )}>
            {wallet.pnl_30d >= 0 ? "+" : ""}{formatVolume(wallet.pnl_30d)}
          </div>
        </div>
      </div>

      {/* Current positions */}
      {wallet.current_positions.length > 0 && (
        <div className="border-t border-border/50 pt-3">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertCircle size={11} className="text-warning" />
            <span className="text-xs text-warning font-medium">Active Positions</span>
          </div>
          <div className="space-y-2">
            {wallet.current_positions.slice(0, 2).map((pos, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-text-dim truncate flex-1 pr-2">{pos.market}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn(
                    "font-mono font-bold px-1.5 py-0.5 rounded",
                    pos.side === "YES" ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
                  )}>
                    {pos.side}
                  </span>
                  <span className="font-mono text-text">{formatVolume(pos.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
