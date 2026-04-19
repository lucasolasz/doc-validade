export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 bg-muted animate-pulse rounded" />
        <div className="space-y-2">
          <div className="h-7 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="h-96 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}
