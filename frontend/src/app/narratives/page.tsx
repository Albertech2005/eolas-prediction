"use client";
import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import NarrativeCard, { Narrative } from "@/components/narratives/NarrativeCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { getNarratives } from "@/lib/api";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NarrativesPage() {
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"score" | "change" | "volume">("score");

  useEffect(() => {
    getNarratives()
      .then(r => setNarratives(r.narratives || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...narratives].sort((a, b) => {
    if (sort === "score") return b.score - a.score;
    if (sort === "change") return b.change_7d - a.change_7d;
    return b.social_volume - a.social_volume;
  });

  const top = sorted[0];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text flex items-center gap-2">
            <Activity size={22} className="text-warning" /> Narrative Heatmap
          </h1>
          <p className="text-text-dim text-sm mt-1">AI-tracked narrative strength across crypto markets</p>
        </div>

        {/* Top narrative spotlight */}
        {top && !loading && (
          <div className="glass-card p-6 mb-6 border-warning/30 bg-gradient-to-r from-warning/5 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-warning bg-warning/10 border border-warning/30 px-2 py-0.5 rounded-full font-mono">🔥 HOTTEST NARRATIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{top.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold text-text">{top.name}</h2>
                  <p className="text-text-dim text-sm mt-1">{top.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold font-mono text-warning">{top.score}%</div>
                <div className="text-success text-sm font-mono mt-1">+{top.change_7d.toFixed(1)}% 7d</div>
              </div>
            </div>
          </div>
        )}

        {/* Sort controls */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs text-text-dim">Sort by:</span>
          {(["score", "change", "volume"] as const).map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs border capitalize transition-all",
                sort === s ? "bg-warning/20 border-warning text-warning" : "border-border text-text-dim hover:border-warning/40"
              )}
            >
              {s === "change" ? "7d Change" : s === "volume" ? "Social Volume" : "AI Score"}
            </button>
          ))}
        </div>

        {/* Narratives grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : sorted.map(n => <NarrativeCard key={n.name} narrative={n} />)
          }
        </div>
      </div>
    </PageWrapper>
  );
}
