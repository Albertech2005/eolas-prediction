import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export function formatPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

export function shortAddress(addr: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function confidenceLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "HIGH", color: "text-success" };
  if (score >= 60) return { label: "MED", color: "text-warning" };
  return { label: "LOW", color: "text-danger" };
}

export function narrativeTrend(pct: number): string {
  if (pct >= 10) return "🔥 Surging";
  if (pct >= 3) return "📈 Rising";
  if (pct <= -10) return "❄️ Cooling";
  if (pct <= -3) return "📉 Falling";
  return "➡️ Stable";
}

export function timeAgo(date: string | Date): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
