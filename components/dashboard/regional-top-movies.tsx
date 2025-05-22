"use client"

import { useState } from "react"
import { Globe, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for regional top movies
const REGIONS = ["United States", "United Kingdom", "Japan", "South Korea", "India", "France"]

const TOP_MOVIES = {
  week: [
    { id: 1, title: "Dune: Part Two", rating: 4.8, change: "up", image: "/placeholder.svg?height=60&width=45" },
    { id: 2, title: "Godzilla x Kong", rating: 4.5, change: "up", image: "/placeholder.svg?height=60&width=45" },
    { id: 3, title: "Civil War", rating: 4.3, change: "down", image: "/placeholder.svg?height=60&width=45" },
    { id: 4, title: "Challengers", rating: 4.2, change: "new", image: "/placeholder.svg?height=60&width=45" },
    { id: 5, title: "The Fall Guy", rating: 4.0, change: "up", image: "/placeholder.svg?height=60&width=45" },
  ],
  month: [
    { id: 1, title: "Dune: Part Two", rating: 4.7, change: "up", image: "/placeholder.svg?height=60&width=45" },
    { id: 2, title: "Poor Things", rating: 4.6, change: "up", image: "/placeholder.svg?height=60&width=45" },
    { id: 3, title: "Oppenheimer", rating: 4.5, change: "down", image: "/placeholder.svg?height=60&width=45" },
    { id: 4, title: "Godzilla x Kong", rating: 4.4, change: "new", image: "/placeholder.svg?height=60&width=45" },
    { id: 5, title: "The Zone of Interest", rating: 4.3, change: "up", image: "/placeholder.svg?height=60&width=45" },
  ],
}

export default function RegionalTopMovies() {
  const [region, setRegion] = useState("United States")

  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Globe className="size-5 text-[hsl(var(--neon-blue))]" />
            Regional Top Movies
          </div>
          <Select defaultValue={region} onValueChange={setRegion}>
            <SelectTrigger className="h-8 w-[180px] text-xs">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((region) => (
                <SelectItem key={region} value={region} className="text-xs">
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>

          {["week", "month"].map((period) => (
            <TabsContent key={period} value={period} className="space-y-3">
              {TOP_MOVIES[period as keyof typeof TOP_MOVIES].map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                >
                  <div className="flex size-7 items-center justify-center font-mono text-sm font-bold text-muted-foreground">
                    {index + 1}
                  </div>

                  <div className="relative overflow-hidden rounded">
                    <img
                      src={movie.image || "/placeholder.svg"}
                      alt={movie.title}
                      className="size-12 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="flex-grow">
                    <h3 className="line-clamp-1 text-sm font-medium">{movie.title}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <span className="text-xs text-yellow-400">★</span>
                        <span className="ml-1 text-xs text-muted-foreground">{movie.rating}</span>
                      </div>

                      {movie.change === "up" && (
                        <span className="flex items-center text-xs text-green-500">
                          <TrendingUp className="mr-0.5 size-3" /> Rising
                        </span>
                      )}
                      {movie.change === "down" && (
                        <span className="flex items-center text-xs text-red-500">
                          <TrendingUp className="mr-0.5 size-3 rotate-180" /> Falling
                        </span>
                      )}
                      {movie.change === "new" && (
                        <span className="rounded-full bg-blue-500/20 px-1.5 py-0.5 text-xs font-medium text-blue-500">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
