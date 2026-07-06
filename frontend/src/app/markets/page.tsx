"use client";
import { useEffect, useState, useRef } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import MarketCard, { Market } from "@/components/markets/MarketCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { getMarkets, analyzeFromUrl } from "@/lib/api";
import {
  Search, SlidersHorizontal, RefreshCw, TrendingUp,
  Link2, Brain, X, ExternalLink, Loader2, AlertCircle,
  ChevronRight,
} from "lucide-react";
import LiveTime from "@/components/ui/LiveTime";
import Link from "next/link";
import { cn, formatVolume, formatPct, confidenceLabel } from "@/lib/utils";

const CATEGORIES = ["All", "Crypto", "Politics", "Sports", "Finance", "Tech", "Entertainment", "Science", "General"];

const SORTS = [
  { label: "Volume", value: "volume" },
  { label: "Trending", value: "trending" },
  { label: "AI Confidence", value: "confidence" },
  { label: "Divergence", value: "divergence" },
];

const REC_STYLES: Record<string, string> = {
  BUY_YES: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  BUY_NO:  "text-red-400 bg-red-400/10 border-red-400/30",
  HOLD:    "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  AVOID:   "text-zinc-400 bg-zinc-400/10 border-zinc-400/30",
};

function isPolymarketUrl(val: string) {
  return /polymarket\.com\/(?:event|market)\/[^/?#\s]+/i.test(val.trim());
}

interface UrlResult {
  market: Market & { slug?: string; active?: boolean };
  analysis: {
    eolas_prob: number;
    confidence: number;
    reasoning: string;
    sentiment: string;
    key_factors: string[];
    recommendation: "BUY_YES" | "BUY_NO" | "HOLD" | "AVOID";
    updated_at: string;
  };
  slug: string;
}

export default function MarketsPage() {
  const [markets, setMarkets]       = useState<Market[]>([]);
  const [loading, setLoading]       = useState(true);
  const [category, setCategory]     = useState("All");
  const [sort, setSort]             = useState("volume");
  const [search, setSearch]         = useState("");

  // URL-mode state
  const [urlResult, setUrlResult]   = useState<UrlResult | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError]     = useState<string | null>(null);
  const urlDebounce                 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchMarkets = async (cat: string, s: string) => {
    setLoading(true);
    try {
      const r = await getMarkets(cat === "All" ? undefined : cat, s);
      setMarkets(r.markets || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMarkets(category, sort); }, [category, sort]);

  // Detect Polymarket URL in search input
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setUrlError(null);

    if (urlDebounce.current) clearTimeout(urlDebounce.current);

    if (!val.trim() || !isPolymarketUrl(val)) {
      setUrlResult(null);
      return;
    }

    // Debounce URL fetch so it doesn't fire on every keystroke while pasting
    urlDebounce.current = setTimeout(async () => {
      setUrlLoading(true);
      setUrlResult(null);
      try {
        const data = await analyzeFromUrl(val.trim());
        setUrlResult(data);
      } catch (err: any) {
        const msg = err?.response?.data?.error || "Could not analyze that market.";
        setUrlError(msg);
      } finally {
        setUrlLoading(false);
      }
    }, 600);
  };

  const clearUrl = () => {
    setSearch("");
    setUrlResult(null);
    setUrlError(null);
    setUrlLoading(false);
  };

  const isUrlMode = search.trim() !== "" && isPolymarketUrl(search);

  const filtered = markets.filter(m =>
    !isUrlMode && search
      ? m.question.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const getCatCount = (cat: string) =>
    cat === "All" ? markets.length : markets.filter(m => m.category === cat).length;
  const totalVolume = filtered.reduce((a, m) => a + m.volume, 0);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text flex items-center gap-2">
              <TrendingUp size={22} className="text-primary" /> Prediction Markets
            </h1>
            <p className="text-text-dim text-sm mt-1">
              {loading
                ? "Fetching from Polymarket…"
                : <>{filtered.length} markets · {formatVolume(totalVolume)} volume · <LiveTime /></>}
            </p>
          </div>
          <button
            onClick={() => fetchMarkets(category, sort)}
            className="btn-ghost text-sm py-2 px-4 flex items-center gap-2 flex-shrink-0"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Terminal-style filter bar */}
        <div className="glass-card p-4 mb-6 space-y-4">

          {/* Search / URL input */}
          <div className="relative">
            {isUrlMode
              ? <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
              : <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            }
            <input
              type="text"
              placeholder="Search any market… or paste a Polymarket URL"
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              className={cn(
                "w-full bg-white/5 border rounded-xl pl-9 pr-24 py-2.5 text-sm text-text placeholder:text-text-dim focus:outline-none transition-colors font-mono",
                isUrlMode
                  ? "border-cyan-500/60 focus:border-cyan-400"
                  : "border-border focus:border-primary"
              )}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isUrlMode && !urlLoading && !urlResult && !urlError && (
                <span className="text-xs text-cyan-400 font-mono">URL detected</span>
              )}
              {urlLoading && <Loader2 size={13} className="animate-spin text-cyan-400" />}
              {isUrlMode && (
                <button onClick={clearUrl} className="text-text-dim hover:text-text transition-colors">
                  <X size={13} />
                </button>
              )}
              {!isUrlMode && search && (
                <span className="text-xs text-text-dim">{filtered.length} results</span>
              )}
            </div>
          </div>

          {/* URL hint strip */}
          {!isUrlMode && (
            <p className="text-xs text-text-dim flex items-center gap-1.5">
              <Link2 size={11} className="text-cyan-500/60" />
              Tip: paste a <span className="text-cyan-400 font-mono">polymarket.com/event/…</span> link for instant AI analysis
            </p>
          )}

          {/* Category tabs */}
          {!isUrlMode && (
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => {
                const count = getCatCount(cat);
                if (cat !== "All" && count === 0) return null;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      category === cat
                        ? "bg-primary border-primary text-white"
                        : "border-border text-text-dim hover:border-primary/50 hover:text-text"
                    )}
                  >
                    {cat}
                    <span className={cn(
                      "text-xs font-mono px-1 py-0.5 rounded",
                      category === cat ? "bg-white/20" : "bg-white/5"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Sort options */}
          {!isUrlMode && (
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={13} className="text-text-dim flex-shrink-0" />
              <span className="text-xs text-text-dim">Sort:</span>
              <div className="flex gap-2 flex-wrap">
                {SORTS.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setSort(s.value)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs border transition-all font-mono",
                      sort === s.value
                        ? "bg-accent/20 border-accent text-accent"
                        : "border-border text-text-dim hover:border-accent/40"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── URL Mode: Loading skeleton ── */}
        {isUrlMode && urlLoading && (
          <div className="glass-card p-8 mb-6 flex flex-col items-center justify-center gap-3 border border-cyan-500/20">
            <Loader2 size={28} className="animate-spin text-cyan-400" />
            <p className="text-sm text-text font-medium">Fetching market from Polymarket…</p>
            <p className="text-xs text-text-dim">Running EOLAS AI analysis</p>
          </div>
        )}

        {/* ── URL Mode: Error ── */}
        {isUrlMode && urlError && !urlLoading && (
          <div className="glass-card p-6 mb-6 border border-red-500/30 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-text">Could not load market</p>
              <p className="text-xs text-text-dim mt-1">{urlError}</p>
              <p className="text-xs text-text-dim mt-1">Make sure the URL is a valid <span className="font-mono text-cyan-400">polymarket.com/event/…</span> link.</p>
            </div>
          </div>
        )}

        {/* ── URL Mode: Result Panel ── */}
        {isUrlMode && urlResult && !urlLoading && (() => {
          const { market, analysis } = urlResult;
          const { label: confLabel, color: confColor } = confidenceLabel(analysis.confidence);
          return (
            <div className="mb-8 space-y-1">

              {/* Header tag */}
              <div className="flex items-center gap-2 px-1 mb-3">
                <Link2 size={13} className="text-cyan-400" />
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Polymarket URL · EOLAS Analysis</span>
                <div className="flex-1 h-px bg-cyan-500/20" />
              </div>

              <div className="glass-card p-6 border border-cyan-500/20">

                {/* Market header */}
                <div className="flex items-start gap-4 mb-6">
                  {market.image && (
                    <img
                      src={market.image}
                      className="w-14 h-14 rounded-xl border border-border object-cover flex-shrink-0"
                      alt=""
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-xs text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full font-mono uppercase">
                        {market.category}
                      </span>
                      {!market.active && (
                        <span className="text-xs text-zinc-400 bg-zinc-400/10 border border-zinc-400/20 px-2 py-0.5 rounded-full font-mono">
                          CLOSED
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-text leading-snug">{market.question}</h2>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white/5 rounded-xl p-3 border border-border">
                    <div className="text-xs text-text-dim mb-1">Volume</div>
                    <div className="font-mono font-semibold text-text text-sm">{formatVolume(market.volume)}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-border">
                    <div className="text-xs text-text-dim mb-1">Liquidity</div>
                    <div className="font-mono font-semibold text-text text-sm">{formatVolume(market.liquidity)}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-border">
                    <div className="text-xs text-text-dim mb-1">Market Prob</div>
                    <div className="font-mono font-semibold text-text text-sm">{formatPct(market.polymarket_prob)}</div>
                  </div>
                </div>

                {/* AI Analysis section */}
                <div className="border border-cyan-500/20 rounded-2xl p-5 bg-cyan-500/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain size={16} className="text-cyan-400" />
                    <span className="font-bold text-text text-sm">EOLAS AI Prediction</span>
                    <span className={cn(
                      "text-xs ml-auto px-2 py-0.5 rounded border font-mono",
                      confColor, "bg-current/10"
                    )}>
                      {confLabel}
                    </span>
                  </div>

                  {/* Probability bars */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 rounded-xl p-3 border border-border">
                      <div className="text-xs text-text-dim mb-1.5">Polymarket Consensus</div>
                      <div className="text-2xl font-bold font-mono text-text">{formatPct(market.polymarket_prob)}</div>
                      <div className="h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${market.polymarket_prob * 100}%` }} />
                      </div>
                    </div>
                    <div className="bg-cyan-500/5 rounded-xl p-3 border border-cyan-500/30">
                      <div className="text-xs text-cyan-400 mb-1.5">EOLAS AI Estimate</div>
                      <div className="text-2xl font-bold font-mono text-cyan-400">{formatPct(analysis.eolas_prob)}</div>
                      <div className="h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${analysis.eolas_prob * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl border mb-4 text-sm",
                    REC_STYLES[analysis.recommendation]
                  )}>
                    <span className="font-bold">EOLAS Recommendation:</span>
                    <span className="font-mono font-bold">{analysis.recommendation.replace("_", " ")}</span>
                  </div>

                  {/* Reasoning */}
                  <div className="mb-4">
                    <div className="text-xs text-text-dim uppercase tracking-wider mb-2">AI Reasoning</div>
                    <p className="text-sm text-text leading-relaxed">{analysis.reasoning}</p>
                  </div>

                  {/* Key factors */}
                  <div>
                    <div className="text-xs text-text-dim uppercase tracking-wider mb-2">Key Factors</div>
                    <div className="space-y-1.5">
                      {analysis.key_factors.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-0.5">◆</span>
                          <span className="text-text-dim">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50 text-xs text-text-dim">
                    Sentiment: <span className="text-text">{analysis.sentiment}</span>
                  </div>
                </div>

                {/* CTA row */}
                <div className="flex items-center gap-3 mt-5">
                  <Link
                    href={`/markets/${market.id}`}
                    className="btn-primary text-sm flex items-center gap-2"
                  >
                    View Full Analysis <ChevronRight size={14} />
                  </Link>
                  <a
                    href={`https://polymarket.com/event/${urlResult.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-sm flex items-center gap-2"
                  >
                    Open on Polymarket <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Normal Mode: Market grid ── */}
        {!isUrlMode && (
          loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 glass-card">
              <Search size={40} className="mx-auto mb-4 text-text-dim opacity-30" />
              <p className="text-text font-medium">No markets found</p>
              <p className="text-text-dim text-sm mt-2">Try a different category or search term</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(m => <MarketCard key={m.id} market={m} />)}
            </div>
          )
        )}
      </div>
    </PageWrapper>
  );
}
