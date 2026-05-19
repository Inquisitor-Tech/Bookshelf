// components/SkeletonCard.tsx
export function SkeletonCard() {
  return (
    <div className="bg-white border border-ink/10 rounded-lg overflow-hidden shadow-sm">
      <div className="aspect-[3/4] bg-ink/5 animate-pulse" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="h-4 w-20 bg-ink/10 rounded-full animate-pulse" />
          <div className="h-4 w-16 bg-ink/10 rounded animate-pulse" />
        </div>
        <div className="h-6 bg-ink/10 rounded mb-1 animate-pulse" />
        <div className="h-4 w-3/4 bg-ink/10 rounded mb-2 animate-pulse" />
        <div className="h-3 w-full bg-ink/5 rounded mb-3 animate-pulse" />
        <div className="flex gap-2 mt-3">
          <div className="h-8 flex-1 bg-ink/10 rounded animate-pulse" />
          <div className="h-8 flex-1 bg-ink/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
