import { Skeleton } from "@/components/ui/skeleton";

export default function CityLoading() {
  return (
    <div className="py-6 space-y-4">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-10 w-72" />
      <div className="flex gap-8 mt-4">
        <Skeleton className="h-16 w-40" />
        <Skeleton className="h-16 w-40" />
      </div>
      <Skeleton className="h-[90px] w-full" /> {/* Ad slot placeholder */}
      <Skeleton className="h-48 w-full" />
    </div>
  );
}