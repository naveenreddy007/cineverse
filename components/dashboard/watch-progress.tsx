"use client"

import { Clock, FastForward } from "lucide-react"
import { motion } from "framer-motion"
import { handleImageError } from "@/utils/image-utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Sample data for currently watching
const CURRENTLY_WATCHING = {
  title: "The Last of Us",
  episode: "Season 1, Episode 5",
  progress: 65,
  timeLeft: "32 min left",
  image: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
}

export default function WatchProgress() {
  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="size-5 text-[hsl(var(--neon-blue))]" />
          Continue Watching
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden rounded-lg">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={CURRENTLY_WATCHING.image || "/placeholder.svg"}
              alt={CURRENTLY_WATCHING.title}
              className="h-full w-full object-cover"
              onError={(e) => handleImageError(e)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{CURRENTLY_WATCHING.title}</h3>
                  <p className="text-sm text-gray-300">{CURRENTLY_WATCHING.episode}</p>
                </div>
                <span className="text-sm text-gray-300">{CURRENTLY_WATCHING.timeLeft}</span>
              </div>

              <div className="mb-3">
                <Progress value={CURRENTLY_WATCHING.progress} className="h-1.5" />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-white text-black hover:bg-white/90">Resume</Button>
                <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/20">
                  <FastForward className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100"
            whileHover={{ opacity: 1 }}
          >
            <Button size="lg" className="bg-white text-black hover:bg-white/90">
              Play Now
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}

