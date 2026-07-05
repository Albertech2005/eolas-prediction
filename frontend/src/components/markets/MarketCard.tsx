"use client";
import { formatVolume, formatPct, confidenceLabel, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Brain, Droplets, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export interface Market {
  id: string;
  question: string;
  category: string;
  polymarket_prob: number;
  eolas_prob: number;
  confidence: number;
  volume: number;
  volume24h?: number;
  liquidity: number;
  prob_change_24h: number;
  image?: string;
  end_date?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Crypto: "badge-blue",
  Politics: "badge-purple",
  Sports: "badge-green",
  Finance: "badge-yellow",
  Tech: "badge-cyan",
  Entertainment: "badge-red",
  Science: "badge-cyan",
  General: "badge-blue",
};

const CATEGORY_ICONS: Record<string, string> = {
  Crypto: "₿", Politics: "🏛️", Sports: "⚽", Finance: "📈",
  Tech: "🤖", Entertainment: "🎬", Science: "🔬", General: "🌐",
};

function AnimatedBar({ value, color, delay = 0 }: { value: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value * 100), 100 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div className="prob-bar">
      <div className={`prob-bar-fill ${color}`} style={{ width: `${width}%` }} />
    </div>
  );
}

export default function MarketCard({ market }: { market: Market }) {
  const { label: confLabel, color: confColor } = confidenceLabel(market.confidence);
  const divergence = ((market.eolas_prob - market.polymarket_prob) * 100).toFixed(1);
  const isUndervalued = market.eolas_prob > market.polymarket_prob + 0.05;
  const isOvervalued = market.eolas_prob < market.polymarket_prob - 0.05;
  const up = market.prob_change_24h >= 0;
  const catColor = CATEGORY_COLORS[market.category] || "badge-blue";
  const catIcon = CATEGORY_ICONS[market.category] || "🌐";

  return (
    <Link href={`/markets/${market.id}`}>
      <div className="glass-card p-5 h-full flex flex-col group cursor-pointer">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge ${catColor}`}>{catIcon} {market.category}</span>
              <span className={cn(
                "badge text-xs",
                up ? "badge-green" : "badge-red"
              )}>
                {up ? "▲" : "▼"} {Math.abs(market.prob_change_24h * 100).toFixed(1)}%
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-primary-light transition-colors">
              {market.question}
            </h3>
          </div>
          {market.image && (
            <img
              src={market.image}
              alt=""
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-white/10"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
        </div>

        {/* Probability section */}
        <div className="space-y-3 mb-4 flex-1">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-text-dim font-medium">Polymarket</span>
              <span className="text-sm font-bold text-white font-mono">{formatPct(market.polymarket_prob)}</span>
            </div>
            <AnimatedBar value={market.polymarket_prob} color="bg-gradient-to-r from-blue-600 to-blue-400" delay={0} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-1.5">
                <Brain size={11} className="text-cyan-400" />
                <span className="text-xs text-cyan-400 font-semibold">EOLAS AI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-cyan-400 font-mono">{formatPct(market.eolas_prob)}</span>
                <span className={cn("badge text-xs", confLabel === "HIGH" ? "badge-green" : confLabel === "MED" ? "badge-yellow" : "badge-red")}>
                  {confLabel}
                </span>
              </div>
            </div>
            <AnimatedBar value={market.eolas_prob} color="bg-gradient-to-r from-cyan-500 to-cyan-300" delay={150} />
          </div>

          {/* Divergence signal */}
          {(isUndervalued || isOvervalued) && (
            <div className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border",
              isUndervalued
                ? "bg-green-500/10 border-green-500/25 text-green-400"
                : "bg-red-500/10 border-red-500/25 text-red-400"
            )}>
              <span>{isUndervalued ? "🟢" : "🔴"}</span>
              <span>{isUndervalued ? "Undervalued" : "Overvalued"} by EOLAS</span>
              <span className="ml-auto font-mono">{divergence}%</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-text-dim">
              <TrendingUp size={11} className="text-text-muted" />
              <span className="font-mono">{formatVolume(market.volume24h || market.volume)}</span>
              <span className="text-text-muted">24h</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-text-dim">
              <Droplets size={11} className="text-text-muted" />
              <span className="font-mono">{formatVolume(market.liquidity)}</span>
            </div>
          </div>
          <ExternalLink size={12} className="text-text-muted opacity-0 group-hover:opacity-100 transition-all" />
        </div>
      </div>
    </Link>
  );
}
