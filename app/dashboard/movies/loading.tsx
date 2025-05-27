import { Skeleton } from "@/components/ui/skeleton"
import { MobileLayout } from "@/components/mobile-layout"

export default function MoviesLoading() {
  return (
    <MobileLayout>
      <div className="py-4">
        <Skeleton className="h-8 w-48 mb-6" />

        {/* Movie grid skeletons */}
        <div className="mb-8">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
              ))}
          </div>
        </div>

        <div className="mb-8">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
              ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}
