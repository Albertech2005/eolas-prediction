"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import { getMarket, getAIAnalysis } from "@/lib/api";
import { Market } from "@/components/markets/MarketCard";
import { formatVolume, formatPct, confidenceLabel, cn } from "@/lib/utils";
import { Brain, TrendingUp, Droplets, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AIAnalysis {
  eolas_prob: number;
  confidence: number;
  reasoning: string;
  sentiment: string;
  key_factors: string[];
  recommendation: "BUY_YES" | "BUY_NO" | "HOLD" | "AVOID";
  updated_at: string;
}

export default function MarketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [market, setMarket] = useState<Market | null>(null);
  const [ai, setAI] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMarket(id), getAIAnalysis(id)])
      .then(([m, a]) => { setMarket(m.market); setAI(a.analysis); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-4">
        {Array(3).fill(0).map((_, i) => <div key={i} className="shimmer h-24 rounded-2xl" />)}
      </div>
    </PageWrapper>
  );

  if (!market) return (
    <PageWrapper>
      <div className="text-center py-24 text-text-dim">Market not found.</div>
    </PageWrapper>
  );

  const { label: confLabel, color: confColor } = confidenceLabel(ai?.confidence || 0);
  const recColors: Record<string, string> = {
    BUY_YES: "text-success bg-success/10 border-success/30",
    BUY_NO: "text-danger bg-danger/10 border-danger/30",
    HOLD: "text-warning bg-warning/10 border-warning/30",
    AVOID: "text-muted bg-muted/10 border-muted/30",
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/markets" className="flex items-center gap-2 text-text-dim hover:text-primary transition-colors text-sm mb-6">
          <ArrowLeft size={14} /> Back to Markets
        </Link>

        {/* Market header */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-start gap-4">
            {market.image && <img src={market.image} className="w-16 h-16 rounded-xl border border-border object-cover flex-shrink-0" alt="" />}
            <div className="flex-1">
              <span className="text-xs text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full font-mono uppercase">
                {market.category}
              </span>
              <h1 className="text-xl font-bold text-text mt-2 mb-4">{market.question}</h1>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-text-dim mb-1">Volume</div>
                  <div className="font-mono font-semibold text-text">{formatVolume(market.volume)}</div>
                </div>
                <div>
                  <div className="text-xs text-text-dim mb-1">Liquidity</div>
                  <div className="font-mono font-semibold text-text">{formatVolume(market.liquidity)}</div>
                </div>
                <div>
                  <div className="text-xs text-text-dim mb-1">Polymarket</div>
                  <div className="font-mono font-semibold text-text">{formatPct(market.polymarket_prob)}</div>
                </div>
                <div>
                  <div className="text-xs text-text-dim mb-1">24h Change</div>
                  <div className={cn("font-mono font-semibold", market.prob_change_24h >= 0 ? "text-success" : "text-danger")}>
                    {market.prob_change_24h >= 0 ? "+" : ""}{(market.prob_change_24h * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        {ai && (
          <div className="glass-card p-6 mb-6 border-accent/30">
            <div className="flex items-center gap-2 mb-5">
              <Brain size={18} className="text-accent" />
              <h2 className="font-bold text-text">EOLAS AI Analysis</h2>
              <span className={cn("text-xs ml-auto px-2 py-1 rounded border font-mono", confColor, "bg-current/10")}>
                {confLabel} CONFIDENCE
              </span>
            </div>

            {/* Probability comparison */}
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div className="bg-white/5 rounded-xl p-4 border border-border">
                <div className="text-xs text-text-dim mb-2">Polymarket Consensus</div>
                <div className="text-3xl font-bold font-mono text-text">{formatPct(market.polymarket_prob)}</div>
                <div className="h-2 bg-white/5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${market.polymarket_prob * 100}%` }} />
                </div>
              </div>
              <div className="bg-accent/5 rounded-xl p-4 border border-accent/30">
                <div className="text-xs text-accent mb-2">EOLAS AI Estimate</div>
                <div className="text-3xl font-bold font-mono text-accent">{formatPct(ai.eolas_prob)}</div>
                <div className="h-2 bg-white/5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${ai.eolas_prob * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border mb-5", recColors[ai.recommendation])}>
              <span className="font-bold text-sm">EOLAS Recommendation:</span>
              <span className="font-mono font-bold">{ai.recommendation.replace("_", " ")}</span>
            </div>

            {/* Reasoning */}
            <div className="mb-4">
              <div className="text-xs text-text-dim uppercase tracking-wider mb-2">AI Reasoning</div>
              <p className="text-sm text-text leading-relaxed">{ai.reasoning}</p>
            </div>

            {/* Key factors */}
            <div>
              <div className="text-xs text-text-dim uppercase tracking-wider mb-3">Key Factors</div>
              <div className="space-y-2">
                {ai.key_factors.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">◆</span>
                    <span className="text-text-dim">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50 text-xs text-text-dim">
              Sentiment: <span className="text-text">{ai.sentiment}</span> · Updated {new Date(ai.updated_at).toLocaleString()}
            </div>
          </div>
        )}

        {/* Trade CTA */}
        <div className="glass-card p-6 text-center">
          <p className="text-text-dim text-sm mb-4">Trade this market on Polymarket</p>
          <a
            href={`https://polymarket.com/event/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            Open on Polymarket <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </PageWrapper>
  );
}
