import { CardSkeletonGrid } from "@/components/ui/empty-state";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <CardSkeletonGrid />
    </div>
  );
}


