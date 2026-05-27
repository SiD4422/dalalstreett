import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top Ticker Skeleton */}
        <Skeleton className="w-full h-8 mb-8 rounded-md" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Slider Skeleton - Fixed 420px height as requested */}
            <Skeleton className="w-full h-[420px] rounded-xl" />
            
            {/* 2x2 News Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="w-full h-[240px] rounded-xl" />
              <Skeleton className="w-full h-[240px] rounded-xl" />
              <Skeleton className="w-full h-[240px] rounded-xl" />
              <Skeleton className="w-full h-[240px] rounded-xl" />
            </div>

            {/* Latest News List Skeleton */}
            <div className="space-y-4">
              <Skeleton className="w-48 h-8 mb-4" />
              <Skeleton className="w-full h-32 rounded-xl" />
              <Skeleton className="w-full h-32 rounded-xl" />
              <Skeleton className="w-full h-32 rounded-xl" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="w-32 h-8 mb-4" />
              <Skeleton className="w-full h-24 rounded-lg" />
              <Skeleton className="w-full h-24 rounded-lg" />
              <Skeleton className="w-full h-24 rounded-lg" />
              <Skeleton className="w-full h-24 rounded-lg" />
            </div>
            
            <Skeleton className="w-full h-[600px] rounded-xl" />
          </div>

        </div>
      </div>
    </div>
  );
}
