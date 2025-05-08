import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function TopicDetailLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full">
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Skeleton className="h-6 sm:h-8 w-32 sm:w-48" />
      </div>

      <Card className="bg-black/40 backdrop-blur-sm border-border/50">
        <CardHeader className="p-3 sm:p-6">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 sm:h-6 w-3/4" />
              <Skeleton className="h-3 sm:h-4 w-1/4" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 py-2 sm:py-4">
          <Skeleton className="h-3 sm:h-4 w-full mb-2" />
          <Skeleton className="h-3 sm:h-4 w-full mb-2" />
          <Skeleton className="h-3 sm:h-4 w-3/4" />
        </CardContent>
        <CardFooter className="px-3 sm:px-6 py-3 sm:py-4">
          <Skeleton className="h-8 sm:h-9 w-full" />
        </CardFooter>
      </Card>

      <div className="space-y-3 sm:space-y-4">
        <Skeleton className="h-6 sm:h-8 w-32 sm:w-48" />
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="bg-black/40 backdrop-blur-sm border-border/50">
              <CardHeader className="p-3 sm:p-6">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 sm:h-5 w-1/4" />
                    <Skeleton className="h-3 sm:h-4 w-1/6" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 py-2 sm:py-4">
                <Skeleton className="h-3 sm:h-4 w-full mb-2" />
                <Skeleton className="h-3 sm:h-4 w-full mb-2" />
                <Skeleton className="h-3 sm:h-4 w-1/2" />
              </CardContent>
              <CardFooter className="px-3 sm:px-6 py-3 sm:py-4">
                <Skeleton className="h-7 sm:h-8 w-20 sm:w-24" />
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  )
}

