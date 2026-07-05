export default function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`glass-card p-5 ${className}`} style={{ animation: "none" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="shimmer h-5 w-16 rounded-full" />
        <div className="shimmer h-5 w-12 rounded-full" />
      </div>
      <div className="shimmer h-4 w-full rounded mb-2" />
      <div className="shimmer h-4 w-4/5 rounded mb-5" />
      <div className="space-y-3">
        <div className="shimmer h-2 w-full rounded-full" />
        <div className="shimmer h-2 w-full rounded-full" />
      </div>
      <div className="flex gap-3 mt-5 pt-4 border-t border-white/5">
        <div className="shimmer h-4 w-20 rounded" />
        <div className="shimmer h-4 w-16 rounded" />
      </div>
    </div>
  );
}
