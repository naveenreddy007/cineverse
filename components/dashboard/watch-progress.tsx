"use client"

import { Play } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Sample data
const CONTINUE_WATCHING = [
  {
    id: 1,
    title: "Oppenheimer",
    image: "/placeholder.svg?height=200&width=400",
    progress: 45,
    remainingMinutes: 98,
  },
  {
    id: 2,
    title: "Poor Things",
    image: "/placeholder.svg?height=200&width=400",
    progress: 30,
    remainingMinutes: 121,
  },
]

export default function WatchProgress() {
  const [progressValues, setProgressValues] = useState(CONTINUE_WATCHING.map((item) => item.progress))

  // Animate progress bars on component mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressValues(CONTINUE_WATCHING.map((item) => item.progress))
    }, 300)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          Continue Watching
          <Button variant="link" className="text-sm font-normal text-muted-foreground">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {CONTINUE_WATCHING.map((item, index) => (
          <div key={item.id} className="group relative overflow-hidden rounded-md">
            <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex flex-col">
              <div className="relative h-36 overflow-hidden rounded-md bg-muted">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <Button
                  size="icon"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  variant="secondary"
                >
                  <Play className="size-5 text-foreground" fill="currentColor" />
                </Button>
              </div>

              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <span className="text-xs text-muted-foreground">{item.remainingMinutes} min left</span>
                </div>
                <Progress
                  value={progressValues[index]}
                  className="mt-2 h-1.5 bg-muted"
                  indicatorClassName="bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-magenta))]"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t border-muted pt-3">
        <Button variant="ghost" className="w-full text-muted-foreground">
          Browse Recently Added
        </Button>
      </CardFooter>
    </Card>
  )
}
