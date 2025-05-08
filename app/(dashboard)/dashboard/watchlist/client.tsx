"use client"

import { CardContent } from "@/components/ui/card"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { MovieCard } from "@/components/movie-card"
import { Search, Plus, ListFilter, Clock, Star } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { mockWatchlist, mockDataService } from "@/lib/mock-data"
import { useAuth } from "@/components/auth-provider"

interface Movie {
  id: string
  title: string
  poster: string
  rating?: number
  year: number
  genres: string[]
}

interface WatchlistItem {
  id: string
  movie: Movie
  addedAt: string
  priority: "low" | "medium" | "high"
  watched: boolean
  watchedAt: string | null
}

interface WatchlistClientProps {
  initialWatchlist?: WatchlistItem[]
  error?: string
}

export function WatchlistClient({ initialWatchlist = [], error }: WatchlistClientProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(initialWatchlist)
  const [sortBy, setSortBy] = useState<"recently-added" | "alphabetical" | "rating" | "year">("recently-added")
  const { toast } = useToast()
  const { user } = useAuth()

  // Load watchlist data
  useEffect(() => {
    const fetchWatchlist = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Use mock data
        setWatchlist(mockWatchlist)
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading watchlist:", err)
        toast({
          title: "Error loading watchlist",
          description: "Failed to load your watchlist. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchWatchlist()
  }, [toast])

  // FIX 2: Use useMemo for derived state
  const watched = useMemo(() => {
    return watchlist.filter((item) => item.watched)
  }, [watchlist])

  const unwatched = useMemo(() => {
    return watchlist.filter((item) => !item.watched)
  }, [watchlist])

  // FIX 3: Use useMemo for filtered watchlist
  const filteredWatchlist = useMemo(() => {
    let filtered = unwatched

    if (searchQuery) {
      filtered = filtered.filter((item) => item.movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Sort the filtered results
    switch (sortBy) {
      case "recently-added":
        return [...filtered].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      case "alphabetical":
        return [...filtered].sort((a, b) => a.movie.title.localeCompare(b.movie.title))
      case "rating":
        return [...filtered].sort((a, b) => (b.movie.rating || 0) - (a.movie.rating || 0))
      case "year":
        return [...filtered].sort((a, b) => b.movie.year - a.movie.year)
      default:
        return filtered
    }
  }, [unwatched, searchQuery, sortBy])

  const handleMarkAsWatched = async (watchlistId: string) => {
    try {
      const item = unwatched.find((item) => item.id === watchlistId)
      if (!item) return

      // FIX 4: Update state immutably
      setWatchlist((prev) =>
        prev.map((item) =>
          item.id === watchlistId ? { ...item, watched: true, watchedAt: new Date().toISOString() } : item,
        ),
      )

      // Simulate server update
      await mockDataService.markAsWatched(watchlistId)

      toast({
        title: "Marked as Watched",
        description: `${item.movie.title} has been moved to your watched list.`,
      })
    } catch (error) {
      console.error("Error marking as watched:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveFromWatchlist = async (watchlistId: string, isWatched: boolean) => {
    try {
      const item = watchlist.find((item) => item.id === watchlistId)
      if (!item) return

      // Optimistic UI update
      setWatchlist((prev) => prev.filter((item) => item.id !== watchlistId))

      // Simulate server update
      await mockDataService.removeFromWatchlist(watchlistId)

      toast({
        title: "Removed from Watchlist",
        description: `${item.movie.title} has been removed from your list.`,
      })
    } catch (error) {
      console.error("Error removing from watchlist:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePriority = async (watchlistId: string, priority: "low" | "medium" | "high") => {
    try {
      // Optimistic UI update
      setWatchlist((prev) => prev.map((item) => (item.id === watchlistId ? { ...item, priority } : item)))

      // In a real app, we would update the server here
      toast({
        title: "Priority Updated",
        description: `Priority set to ${priority}.`,
      })
    } catch (error) {
      console.error("Error updating priority:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Watchlist</h1>
          <p className="text-muted-foreground">Keep track of movies you want to watch</p>
        </div>
        <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">
          <Plus className="h-4 w-4 mr-2" />
          Add to Watchlist
        </Button>
      </motion.div>

      <Tabs defaultValue="watchlist" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="bg-black/40 backdrop-blur-sm border border-border/50">
            <TabsTrigger value="watchlist" className="data-[state=active]:bg-neon-blue/20">
              <Clock className="h-4 w-4 mr-2" />
              To Watch
            </TabsTrigger>
            <TabsTrigger value="watched" className="data-[state=active]:bg-neon-blue/20">
              <Star className="h-4 w-4 mr-2" />
              Watched
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search watchlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-black/40 backdrop-blur-sm border-border/50 min-w-[200px]"
              />
            </div>
            <Button
              variant="outline"
              className="gap-2 bg-black/40 backdrop-blur-sm border-border/50"
              onClick={() => {
                const nextSort = {
                  "recently-added": "alphabetical",
                  alphabetical: "rating",
                  rating: "year",
                  year: "recently-added",
                }[sortBy] as typeof sortBy

                setSortBy(nextSort)
              }}
            >
              <ListFilter className="h-4 w-4" />
              {sortBy === "recently-added" && "Recent"}
              {sortBy === "alphabetical" && "A-Z"}
              {sortBy === "rating" && "Rating"}
              {sortBy === "year" && "Year"}
            </Button>
          </div>
        </div>

        <TabsContent value="watchlist" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="bg-black/40 backdrop-blur-sm border-border/50">
                    <CardContent className="p-0">
                      <Skeleton className="w-full h-[300px] rounded-t-lg" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-6 w-4/5" />
                        <Skeleton className="h-4 w-3/5" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <>
              {filteredWatchlist.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Your watchlist is empty</h3>
                  <p className="text-muted-foreground mb-6">Start adding movies you want to watch in the future.</p>
                  <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">
                    <Plus className="h-4 w-4 mr-2" />
                    Browse Movies
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredWatchlist.map((item) => (
                    <MovieCard
                      key={item.id}
                      movie={item.movie}
                      actions={
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            className="w-full mt-2 bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30"
                            onClick={() => handleMarkAsWatched(item.id)}
                          >
                            Mark as Watched
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => handleRemoveFromWatchlist(item.id, false)}
                          >
                            Remove
                          </Button>
                          <div className="flex gap-2 mt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className={`flex-1 ${item.priority === "low" ? "bg-green-500/20 text-green-500" : ""}`}
                              onClick={() => handleUpdatePriority(item.id, "low")}
                            >
                              Low
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className={`flex-1 ${item.priority === "medium" ? "bg-yellow-500/20 text-yellow-500" : ""}`}
                              onClick={() => handleUpdatePriority(item.id, "medium")}
                            >
                              Med
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className={`flex-1 ${item.priority === "high" ? "bg-red-500/20 text-red-500" : ""}`}
                              onClick={() => handleUpdatePriority(item.id, "high")}
                            >
                              High
                            </Button>
                          </div>
                        </div>
                      }
                      badge={
                        <div
                          className={`
                          absolute top-2 left-2 z-10 px-2 py-1 rounded-full text-xs font-medium
                          ${
                            item.priority === "high"
                              ? "bg-red-500/80"
                              : item.priority === "medium"
                                ? "bg-yellow-500/80"
                                : "bg-green-500/80"
                          }
                        `}
                        >
                          {item.priority === "high" ? "High" : item.priority === "medium" ? "Medium" : "Low"} Priority
                        </div>
                      }
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="watched" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="bg-black/40 backdrop-blur-sm border-border/50">
                    <CardContent className="p-0">
                      <Skeleton className="w-full h-[300px] rounded-t-lg" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-6 w-4/5" />
                        <Skeleton className="h-4 w-3/5" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <>
              {watched.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No watched movies yet</h3>
                  <p className="text-muted-foreground mb-6">Movies you mark as watched will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {watched.map((item) => (
                    <MovieCard
                      key={item.id}
                      movie={item.movie}
                      actions={
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" className="w-full mt-2">
                            Write Review
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => handleRemoveFromWatchlist(item.id, true)}
                          >
                            Remove
                          </Button>
                        </div>
                      }
                      badge={
                        <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-full bg-neon-blue/80 text-xs font-medium">
                          Watched {item.watchedAt ? formatDate(item.watchedAt) : ""}
                        </div>
                      }
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

