"use client";
import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import BattleCard, { Battle } from "@/components/battles/BattleCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { getBattles, voteBattle, createBattle } from "@/lib/api";
import { Swords, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function BattlesPage() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newQ, setNewQ] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getBattles()
      .then(r => setBattles(r.battles || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleVote = async (id: string, side: "yes" | "no") => {
    try {
      await voteBattle(id, side, "0xDemoUser");
      setBattles(prev => prev.map(b => b.id === id ? {
        ...b,
        yes_votes: side === "yes" ? b.yes_votes + 1 : b.yes_votes,
        no_votes: side === "no" ? b.no_votes + 1 : b.no_votes,
        total_participants: b.total_participants + 1,
      } : b));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async () => {
    if (!newQ.trim()) return;
    setCreating(true);
    try {
      const r = await createBattle({ question: newQ, description: newDesc, address: "0xDemoUser" });
      setBattles(prev => [r.battle, ...prev]);
      setNewQ("");
      setNewDesc("");
      setShowCreate(false);
      toast.success("Battle created! 🔥");
    } catch (e) {
      toast.error("Failed to create battle.");
    } finally {
      setCreating(false);
    }
  };

  const filtered = battles.filter(b => filter === "all" || b.status === filter);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text flex items-center gap-2">
              <Swords size={22} className="text-danger" /> Prediction Battles
            </h1>
            <p className="text-text-dim text-sm mt-1">Vote, predict, and battle to build your reputation</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
            <Plus size={14} /> Create Battle
          </button>
        </div>

        {/* Create modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-text text-lg">New Prediction Battle</h2>
                <button onClick={() => setShowCreate(false)} className="text-text-dim hover:text-text">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-text-dim uppercase tracking-wider mb-2 block">Battle Question *</label>
                  <input
                    type="text"
                    value={newQ}
                    onChange={e => setNewQ(e.target.value)}
                    placeholder="Will Bitcoin hit $200K before 2028?"
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-dim uppercase tracking-wider mb-2 block">Description (optional)</label>
                  <textarea
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Add context for your prediction..."
                    rows={3}
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowCreate(false)} className="btn-ghost flex-1 text-sm py-2.5">Cancel</button>
                  <button
                    onClick={handleCreate}
                    disabled={creating || !newQ.trim()}
                    className="btn-primary flex-1 text-sm py-2.5 disabled:opacity-50"
                  >
                    {creating ? "Creating…" : "🔥 Launch Battle"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "active", "resolved"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm border capitalize transition-all",
                filter === f ? "bg-danger/20 border-danger text-danger" : "border-border text-text-dim hover:border-danger/40"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Battles grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map(b => <BattleCard key={b.id} battle={b} onVote={handleVote} />)
          }
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-text-dim">
            <Swords size={40} className="mx-auto mb-4 opacity-30" />
            <p>No battles yet. Be the first to create one!</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
