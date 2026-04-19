export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <div className="h-9 w-32 bg-muted animate-pulse rounded" />
      </div>
      <div className="h-10 w-72 bg-muted animate-pulse rounded" />
      <div className="h-96 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}
