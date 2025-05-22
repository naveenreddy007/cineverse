import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function MovieDetailLoading() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Skeleton className="w-full aspect-[2/3] rounded-xl" />
        </div>

        <div className="md:w-2/3 space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <div className="flex gap-2">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
          </div>
          <div className="flex gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-10 w-28" />
              ))}
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          <div className="pt-4">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex gap-2">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-full" />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
