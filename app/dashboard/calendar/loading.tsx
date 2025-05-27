import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CalendarLoading() {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-[160px]" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-10" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 text-center mb-2">
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-4 w-8 mx-auto" />
              ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array(35)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-3">
                  <Skeleton className="h-16 w-12" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-full max-w-[200px] mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
