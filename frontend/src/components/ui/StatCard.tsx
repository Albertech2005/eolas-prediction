import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  color?: string;
  gradient?: string;
}

export default function StatCard({ label, value, sub, icon: Icon, trend, color = "text-blue-400", gradient }: StatCardProps) {
  return (
    <div className="glass-card p-5 group hover:border-primary/30">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-text-dim font-medium uppercase tracking-wider mb-2">{label}</p>
          <p className={cn("text-2xl font-black font-mono", color)}>{value}</p>
          {sub && (
            <p className={cn(
              "text-xs mt-1.5 font-mono font-medium flex items-center gap-1",
              trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-text-dim"
            )}>
              {trend === "up" ? "▲" : trend === "down" ? "▼" : ""}
              {sub}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all",
            gradient || "bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20"
          )}>
            <Icon size={18} className={color} />
          </div>
        )}
      </div>
    </div>
  );
}
