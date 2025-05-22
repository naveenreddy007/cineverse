"use client"

import { Globe, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { handleImageError } from "@/utils/image-utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for regional top movies
const REGIONAL_TOP_MOVIES = [
  {
    id: 1,
    title: "Barbie",
    image: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    rank: 1,
    change: "up",
    region: "US",
  },
  {
    id: 2,
    title: "Oppenheimer",
    image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    rank: 2,
    change: "same",
    region: "US",
  },
  {
    id: 3,
    title: "The Holdovers",
    image: "https://image.tmdb.org/t/p/w500/mFp3l4lZg1NSEZdlMhcWLkwLtMc.jpg",
    rank: 3,
    change: "up",
    region: "US",
  },
  {
    id: 4,
    title: "Past Lives",
    image: "https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtgx.jpg",
    rank: 4,
    change: "down",
    region: "US",
  },
]

export default function RegionalTopMovies() {
  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-[hsl(var(--neon-magenta))]" />
            Top Movies
          </div>
          <Select defaultValue="US">
            <SelectTrigger className="h-8 w-[110px] border-none bg-muted/50 text-xs">
              <Globe className="mr-2 size-3.5" />
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
              <SelectItem value="JP">Japan</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {REGIONAL_TOP_MOVIES.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="group flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-7 items-center justify-center rounded-full bg-muted font-mono text-sm">
                {movie.rank}
              </div>

              <div className="relative flex-shrink-0">
                <img
                  src={movie.image || "/placeholder.svg"}
                  alt={movie.title}
                  className="h-12 w-12 rounded-md object-cover"
                  onError={(e) => handleImageError(e)}
                />
              </div>

              <div className="flex-1">
                <h3 className="line-clamp-1 text-sm font-medium">{movie.title}</h3>
              </div>

              <div
                className={`flex size-6 items-center justify-center rounded-full ${
                  movie.change === "up"
                    ? "bg-green-500/10 text-green-500"
                    : movie.change === "down"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {movie.change === "up" ? (
                  <TrendingUp className="size-3.5" />
                ) : movie.change === "down" ? (
                  <TrendingUp className="size-3.5 rotate-180 transform" />
                ) : (
                  <span className="h-px w-3 bg-current" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
