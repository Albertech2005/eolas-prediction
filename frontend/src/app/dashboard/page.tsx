"use client";
import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import StatCard from "@/components/ui/StatCard";
import MarketCard, { Market } from "@/components/markets/MarketCard";
import NarrativeCard, { Narrative } from "@/components/narratives/NarrativeCard";
import WalletCard, { SmartWallet } from "@/components/smart-money/WalletCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { getMarkets, getNarratives, getSmartMoney } from "@/lib/api";
import { formatVolume } from "@/lib/utils";
import { TrendingUp, Eye, Activity, Brain, RefreshCw } from "lucide-react";
import LiveTime from "@/components/ui/LiveTime";
import Link from "next/link";

export default function DashboardPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [wallets, setWallets] = useState<SmartWallet[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchAll = async () => {
    setLoading(true);
    try {
      const [m, n, w] = await Promise.all([getMarkets(), getNarratives(), getSmartMoney()]);
      setMarkets(m.markets || []);
      setNarratives(n.narratives || []);
      setWallets(w.wallets || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const totalVolume = markets.reduce((a, m) => a + m.volume, 0);
  const avgConf = markets.length ? markets.reduce((a, m) => a + m.confidence, 0) / markets.length : 0;
  const undervalued = markets.filter(m => (m.eolas_prob - m.polymarket_prob) > 0.05).length;

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text">Intelligence Dashboard</h1>
            <p className="text-text-dim text-sm mt-1">
              <LiveTime /> · {markets.length} markets tracked
            </p>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 btn-ghost text-sm py-2 px-4"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Volume" value={formatVolume(totalVolume)} sub="across all markets" icon={TrendingUp} trend="up" />
          <StatCard label="AI Confidence" value={`${avgConf.toFixed(0)}%`} sub="avg score" icon={Brain} color="text-accent" />
          <StatCard label="Undervalued" value={`${undervalued}`} sub="opportunities found" icon={Activity} color="text-success" trend="up" />
          <StatCard label="Smart Wallets" value={`${wallets.length}`} sub="being tracked" icon={Eye} color="text-warning" />
        </div>

        {/* Trending Markets */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> Trending Markets
            </h2>
            <Link href="/markets" className="text-sm text-primary hover:text-primary-glow transition-colors">View all →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              markets.slice(0, 6).map(m => <MarketCard key={m.id} market={m} />)
            )}
          </div>
        </div>

        {/* Bottom row: Narratives + Smart Money */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Narratives */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text flex items-center gap-2">
                <Activity size={18} className="text-warning" /> Narrative Heatmap
              </h2>
              <Link href="/narratives" className="text-sm text-primary hover:text-primary-glow transition-colors">View all →</Link>
            </div>
            <div className="space-y-3">
              {loading ? (
                Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                narratives.slice(0, 4).map(n => <NarrativeCard key={n.name} narrative={n} />)
              )}
            </div>
          </div>

          {/* Smart Money */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text flex items-center gap-2">
                <Eye size={18} className="text-success" /> Smart Money
              </h2>
              <Link href="/smart-money" className="text-sm text-primary hover:text-primary-glow transition-colors">View all →</Link>
            </div>
            <div className="space-y-3">
              {loading ? (
                Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                wallets.slice(0, 3).map((w, i) => <WalletCard key={w.address} wallet={w} rank={i + 1} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
