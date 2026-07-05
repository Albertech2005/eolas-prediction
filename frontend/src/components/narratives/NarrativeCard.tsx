"use client";
import { narrativeTrend, cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface Narrative {
  name: string;
  score: number;
  change_7d: number;
  social_volume: number;
  markets_count: number;
  emoji: string;
  description: string;
}

function AnimatedScore({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const step = score / 30;
    let current = 0;
    const t = setInterval(() => {
      current = Math.min(score, current + step);
      setDisplayed(Math.floor(current));
      if (current >= score) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [score]);
  return <>{displayed}%</>;
}

export default function NarrativeCard({ narrative }: { narrative: Narrative }) {
  const [barWidth, setBarWidth] = useState(0);
  const up = narrative.change_7d >= 0;

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(narrative.score), 200);
    return () => clearTimeout(t);
  }, [narrative.score]);

  const scoreColor =
    narrative.score >= 80 ? "text-green-400" :
    narrative.score >= 60 ? "text-blue-400" :
    narrative.score >= 40 ? "text-yellow-400" : "text-red-400";

  const barGradient =
    narrative.score >= 80 ? "from-green-500 to-emerald-400" :
    narrative.score >= 60 ? "from-blue-500 to-cyan-400" :
    narrative.score >= 40 ? "from-yellow-500 to-orange-400" : "from-red-500 to-rose-400";

  const heatLevel =
    narrative.score >= 85 ? "🔥🔥🔥" :
    narrative.score >= 70 ? "🔥🔥" :
    narrative.score >= 55 ? "🔥" :
    narrative.score >= 40 ? "📉" : "❄️";

  return (
    <div className="glass-card p-5 group hover:border-primary/30">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{narrative.emoji}</span>
          <div>
            <h3 className="font-bold text-white group-hover:text-primary-light transition-colors">{narrative.name}</h3>
            <p className="text-xs text-text-dim mt-0.5 max-w-[180px] truncate">{narrative.description}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className={cn("text-2xl font-black font-mono", scoreColor)}>
            <AnimatedScore score={narrative.score} />
          </span>
          <div className="text-lg">{heatLevel}</div>
        </div>
      </div>

      <div className="prob-bar mb-3">
        <div
          className={cn("prob-bar-fill bg-gradient-to-r", barGradient)}
          style={{ width: `${barWidth}%`, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-text-dim">
          <span className="font-mono">{narrative.markets_count} markets</span>
          <span>·</span>
          <span className="font-mono">{(narrative.social_volume / 1000).toFixed(0)}k mentions</span>
        </div>
        <span className={cn("font-mono font-bold", up ? "text-green-400" : "text-red-400")}>
          {up ? "+" : ""}{narrative.change_7d.toFixed(1)}% 7d
        </span>
      </div>
    </div>
  );
}
