import { Skeleton } from "@/components/ui/skeleton";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="text-center py-14 text-muted-foreground">
      <p className="font-medium text-foreground">{title}</p>
      {description ? <p className="text-sm mt-1">{description}</p> : null}
    </div>
  );
}

export function CardSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      ))}
    </div>
  );
}


