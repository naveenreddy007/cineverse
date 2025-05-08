"use client"

import { CalendarDays } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Update the UPCOMING_RELEASES array with real movie posters
const UPCOMING_RELEASES = [
  {
    id: 1,
    title: "Furiosa: A Mad Max Saga",
    date: "May 24, 2024",
    countdown: 15,
    image: "https://image.tmdb.org/t/p/w500/6lLDUY0EgXQSUfteT7n95oBxXpj.jpg",
  },
  {
    id: 2,
    title: "Inside Out 2",
    date: "Jun 14, 2024",
    countdown: 36,
    image: "https://image.tmdb.org/t/p/w500/mRGmNnh6pBAGMTmP4EE6oyH9Iay.jpg",
  },
  {
    id: 3,
    title: "A Quiet Place: Day One",
    date: "Jun 28, 2024",
    countdown: 50,
    image: "https://image.tmdb.org/t/p/w500/qfglisVh5Nmo1nGYCoMzqyZUxQm.jpg",
  },
]

export default function UpcomingReleases() {
  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="size-5 text-[hsl(var(--neon-magenta))]" />
          Upcoming Releases
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {UPCOMING_RELEASES.map((release, index) => (
            <motion.div
              key={release.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="group flex items-center gap-4"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={release.image || "/placeholder.svg"}
                  alt={release.title}
                  className="size-14 rounded-md object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
                <div className="absolute inset-0 rounded-md border-2 border-transparent transition-all duration-300 group-hover:border-[hsl(var(--neon-blue))]" />
              </div>

              <div className="flex-grow">
                <h3 className="text-base font-medium group-hover:text-[hsl(var(--neon-blue))] transition-colors">
                  {release.title}
                </h3>
                <p className="text-sm text-muted-foreground">{release.date}</p>
              </div>

              <div className="flex h-10 min-w-14 items-center justify-center rounded-full bg-muted font-mono text-sm">
                {release.countdown}d
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

