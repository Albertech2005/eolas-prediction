"use client";
import { cn, formatVolume, timeAgo } from "@/lib/utils";
import { Users, Clock, Share2, Flame } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export interface Battle {
  id: string;
  question: string;
  yes_votes: number;
  no_votes: number;
  yes_amount: number;
  no_amount: number;
  total_participants: number;
  created_at: string;
  ends_at: string;
  creator: string;
  status: "active" | "resolved" | "pending";
  result?: "yes" | "no";
  category: string;
}

export default function BattleCard({ battle, onVote }: { battle: Battle; onVote?: (id: string, side: "yes" | "no") => void }) {
  const [voted, setVoted] = useState<"yes" | "no" | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const total = battle.yes_votes + battle.no_votes;
  const yesPct = total > 0 ? (battle.yes_votes / total) * 100 : 50;
  const noPct = 100 - yesPct;
  const isActive = battle.status === "active";

  const handleVote = (side: "yes" | "no") => {
    if (!isActive || voted) return;
    setVoted(side);
    onVote?.(battle.id, side);
    toast.success(`🎯 Voted ${side.toUpperCase()}! Prediction recorded.`, {
      icon: side === "yes" ? "✅" : "❌",
    });
  };

  const handleShare = async () => {
    setIsSharing(true);
    const text = `🔥 EOLAS Prediction Battle\n\n"${battle.question}"\n\n✅ YES: ${yesPct.toFixed(0)}% (${battle.yes_votes} votes)\n❌ NO: ${noPct.toFixed(0)}% (${battle.no_votes} votes)\n\n👉 Join the battle: eolas.fun/battles`;
    await navigator.clipboard?.writeText(text);
    toast.success("Copied! Share on X 🐦");
    setTimeout(() => setIsSharing(false), 1500);
  };

  return (
    <div className={cn(
      "glass-card p-5 flex flex-col",
      isActive && "border-red-500/15"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "badge",
              isActive ? "badge-red" : battle.status === "resolved" ? "badge-blue" : "badge-yellow"
            )}>
              {isActive ? <><Flame size={10} className="inline" /> LIVE</> : battle.status === "resolved" ? "✅ Resolved" : "⏳ Pending"}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white leading-snug">{battle.question}</h3>
        </div>
        <button
          onClick={handleShare}
          className={cn(
            "p-2 rounded-xl border transition-all flex-shrink-0",
            isSharing
              ? "border-green-500/40 bg-green-500/10 text-green-400"
              : "border-white/10 text-text-dim hover:border-primary/40 hover:text-primary bg-white/3"
          )}
        >
          <Share2 size={14} />
        </button>
      </div>

      {/* Battle bar */}
      <div className="mb-4">
        <div className="h-8 rounded-2xl overflow-hidden flex relative">
          <div
            className="bg-gradient-to-r from-green-600 to-emerald-400 flex items-center justify-center text-xs font-bold text-white transition-all duration-700"
            style={{ width: `${yesPct}%` }}
          >
            {yesPct > 20 && `${yesPct.toFixed(0)}%`}
          </div>
          <div
            className="bg-gradient-to-l from-red-600 to-rose-400 flex-1 flex items-center justify-center text-xs font-bold text-white transition-all duration-700"
          >
            {noPct > 20 && `${noPct.toFixed(0)}%`}
          </div>
        </div>
        <div className="flex justify-between text-xs text-text-dim mt-2 font-mono">
          <span className="text-green-400">✅ YES · {formatVolume(battle.yes_amount)}</span>
          <span className="text-red-400">❌ NO · {formatVolume(battle.no_amount)}</span>
        </div>
      </div>

      {/* Vote buttons */}
      {isActive && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => handleVote("yes")}
            disabled={!!voted}
            className={cn(
              "py-3 rounded-xl text-sm font-bold border transition-all duration-200 relative overflow-hidden",
              voted === "yes"
                ? "bg-green-500 border-green-400 text-white shadow-glow-green"
                : voted
                ? "opacity-40 cursor-not-allowed bg-green-500/5 border-green-500/20 text-green-400"
                : "bg-green-500/10 border-green-500/25 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 hover:shadow-glow-green active:scale-95"
            )}
          >
            {voted === "yes" ? "✅ Voted YES!" : "Vote YES"}
          </button>
          <button
            onClick={() => handleVote("no")}
            disabled={!!voted}
            className={cn(
              "py-3 rounded-xl text-sm font-bold border transition-all duration-200",
              voted === "no"
                ? "bg-red-500 border-red-400 text-white shadow-glow-red"
                : voted
                ? "opacity-40 cursor-not-allowed bg-red-500/5 border-red-500/20 text-red-400"
                : "bg-red-500/10 border-red-500/25 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-glow-red active:scale-95"
            )}
          >
            {voted === "no" ? "❌ Voted NO!" : "Vote NO"}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-text-dim mt-auto">
        <div className="flex items-center gap-1.5">
          <Users size={11} />
          <span>{battle.total_participants.toLocaleString()} participants</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={11} />
          <span>{isActive ? `Ends ${timeAgo(battle.ends_at)}` : timeAgo(battle.created_at)}</span>
        </div>
      </div>
    </div>
  );
}
