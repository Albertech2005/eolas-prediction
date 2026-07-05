"use client";
import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import MarketCard, { Market } from "@/components/markets/MarketCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { getMarkets } from "@/lib/api";
import { Search, SlidersHorizontal, RefreshCw, TrendingUp } from "lucide-react";
import LiveTime from "@/components/ui/LiveTime";
import { cn, formatVolume } from "@/lib/utils";

const CATEGORIES = ["All", "Crypto", "Politics", "Sports", "Finance", "Tech", "Entertainment", "Science", "General"];

const SORTS = [
  { label: "Volume", value: "volume" },
  { label: "Trending", value: "trending" },
  { label: "AI Confidence", value: "confidence" },
  { label: "Divergence", value: "divergence" },
];

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("volume");
  const [search, setSearch] = useState("");


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

  const filtered = markets.filter(m =>
    search ? m.question.toLowerCase().includes(search.toLowerCase()) : true
  );

  // Category counts
  const allMarkets = markets;
  const getCatCount = (cat: string) =>
    cat === "All" ? allMarkets.length : allMarkets.filter(m => m.category === cat).length;

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
              {loading ? "Fetching from Polymarket…" : <>{filtered.length} markets · {formatVolume(totalVolume)} volume · <LiveTime /></>}
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
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input
              type="text"
              placeholder="Search any market..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors font-mono"
            />
            {search && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-dim">
                {filtered.length} results
              </span>
            )}
          </div>

          {/* Category tabs with live counts */}
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

          {/* Sort options */}
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
        </div>

        {/* Market grid */}
        {loading ? (
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
        )}
      </div>
    </PageWrapper>
  );
}
