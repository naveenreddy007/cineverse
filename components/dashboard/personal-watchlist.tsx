"use client"

import { BookmarkCheck, Clock, MoreVertical, Play } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

// Sample data for watchlist
const WATCHLIST = [
  {
    id: 1,
    title: "Succession",
    type: "TV Series",
    progress: 75,
    image: "/placeholder.svg?height=60&width=100",
    episodesWatched: 27,
    totalEpisodes: 36,
  },
  {
    id: 2,
    title: "The Lord of the Rings Trilogy",
    type: "Movie Collection",
    progress: 33,
    image: "/placeholder.svg?height=60&width=100",
    moviesWatched: 1,
    totalMovies: 3,
  },
  {
    id: 3,
    title: "Severance",
    type: "TV Series",
    progress: 50,
    image: "/placeholder.svg?height=60&width=100",
    episodesWatched: 5,
    totalEpisodes: 10,
  },
]

export default function PersonalWatchlist() {
  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="size-5 text-[hsl(var(--neon-blue))]" />
            Your Watchlist
          </div>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
            <Clock className="size-3.5" />
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {WATCHLIST.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="group relative flex gap-3 rounded-lg p-1 transition-colors hover:bg-muted/50"
            >
              <div className="relative flex-shrink-0 overflow-hidden rounded">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="h-16 w-28 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Button size="icon" variant="ghost" className="size-8 rounded-full text-white">
                    <Play className="size-4 fill-white" />
                  </Button>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="line-clamp-1 text-sm font-medium">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-7">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem>Mark as completed</DropdownMenuItem>
                      <DropdownMenuItem>Remove from list</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-2">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {item.episodesWatched
                        ? `${item.episodesWatched}/${item.totalEpisodes} episodes`
                        : `${item.moviesWatched}/${item.totalMovies} films`}
                    </span>
                    <span className="font-medium">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-1.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
