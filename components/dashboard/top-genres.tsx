"use client"

import { BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Sample data for top genres
const TOP_GENRES = [
  {
    name: "Sci-Fi",
    count: 42,
    percentage: 85,
    color: "bg-[hsl(var(--neon-blue))]",
  },
  {
    name: "Drama",
    count: 38,
    percentage: 76,
    color: "bg-[hsl(var(--neon-magenta))]",
  },
  {
    name: "Thriller",
    count: 31,
    percentage: 62,
    color: "bg-[hsl(var(--neon-green))]",
  },
  {
    name: "Comedy",
    count: 27,
    percentage: 54,
    color: "bg-[hsl(var(--neon-yellow))]",
  },
  {
    name: "Action",
    count: 24,
    percentage: 48,
    color: "bg-[hsl(var(--neon-orange))]",
  },
]

export default function TopGenres() {
  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="size-5 text-[hsl(var(--neon-green))]" />
          Your Top Genres
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {TOP_GENRES.map((genre, index) => (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium">{genre.name}</span>
                <span className="text-xs text-muted-foreground">{genre.count} movies</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={genre.percentage} className={`h-2 ${genre.color}`} />
                <span className="text-xs font-medium">{genre.percentage}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

