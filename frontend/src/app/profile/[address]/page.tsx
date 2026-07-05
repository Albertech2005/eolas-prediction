"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import { getProfile } from "@/lib/api";
import { shortAddress, cn } from "@/lib/utils";
import { User, Trophy, Target, TrendingUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { address } = useParams<{ address: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile(address)
      .then(r => setProfile(r.profile))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [address]);

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/leaderboard" className="flex items-center gap-2 text-text-dim hover:text-primary transition-colors text-sm mb-6">
          <ArrowLeft size={14} /> Back to Leaderboard
        </Link>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="shimmer h-24 rounded-2xl" />)}
          </div>
        ) : (
          <>
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <User size={28} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-text">{profile?.username || shortAddress(address)}</h1>
                  <p className="text-xs font-mono text-text-dim mt-1">{address}</p>
                  <div className="flex gap-2 mt-2">
                    {(profile?.badges || []).map((b: string) => (
                      <span key={b} className="text-lg">{b}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Accuracy", value: `${(profile?.accuracy || 0).toFixed(1)}%`, icon: Target, color: "text-success" },
                { label: "Predictions", value: profile?.total_predictions || 0, icon: TrendingUp, color: "text-primary" },
                { label: "Correct", value: profile?.correct || 0, icon: Trophy, color: "text-warning" },
                { label: "Reputation", value: profile?.reputation || 0, icon: User, color: "text-accent" },
              ].map(s => (
                <div key={s.label} className="glass-card p-4 text-center">
                  <s.icon size={18} className={cn("mx-auto mb-2", s.color)} />
                  <div className={cn("text-xl font-bold font-mono", s.color)}>{s.value}</div>
                  <div className="text-xs text-text-dim mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="glass-card p-6 text-center text-text-dim">
              <p className="text-sm">Connect your wallet to view full prediction history and track your accuracy score.</p>
              <button className="btn-primary mt-4 text-sm py-2 px-6">Connect Wallet</button>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
