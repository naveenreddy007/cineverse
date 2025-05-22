"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data
const TOP_GENRES = [
  { name: "Sci-Fi", percentage: 30, color: "from-[hsl(var(--neon-blue))] to-blue-500" },
  { name: "Drama", percentage: 25, color: "from-[hsl(var(--neon-magenta))] to-purple-500" },
  { name: "Thriller", percentage: 20, color: "from-green-500 to-emerald-500" },
  { name: "Comedy", percentage: 15, color: "from-yellow-500 to-amber-500" },
  { name: "Action", percentage: 10, color: "from-red-500 to-orange-500" },
]

export default function TopGenres() {
  const [loadingProgress, setLoadingProgress] = useState<number[]>(TOP_GENRES.map(() => 0))

  useEffect(() => {
    // Animate bars on component mount
    const timeout = setTimeout(() => {
      setLoadingProgress(TOP_GENRES.map((genre) => genre.percentage))
    }, 300)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Your Top Genres</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {TOP_GENRES.map((genre, index) => (
          <div key={genre.name} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{genre.name}</span>
              <span className="font-mono text-xs font-medium">{genre.percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${genre.color} transition-all duration-1000 ease-out`}
                style={{ width: `${loadingProgress[index]}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
