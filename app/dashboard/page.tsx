"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MovieCard } from "@/components/movie-card"
import { TrendingUp, Film, Users, Star, Award, Calendar, Clock, Eye } from "lucide-react"
import { teluguMoviesService, type TeluguMovie } from "@/lib/telugu-movies-service"
import { useAuth } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const [latestMovies, setLatestMovies] = useState<TeluguMovie[]>([])
  const [trendingMovies, setTrendingMovies] = useState<TeluguMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true)
        const [latest, trending] = await Promise.all([
          teluguMoviesService.getLatestTeluguMovies(8),
          teluguMoviesService.getTrendingTeluguMovies(6),
        ])
        setLatestMovies(latest)
        setTrendingMovies(trending)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load movies")
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [])

  const handleToggleFavorite = async (movieId: string) => {
    if (!user) return

    const newFavorites = new Set(favorites)
    if (favorites.has(movieId)) {
      newFavorites.delete(movieId)
      try {
        await teluguMoviesService.removeFromWatchlist(movieId)
      } catch (err) {
        console.error("Failed to remove from watchlist:", err)
      }
    } else {
      newFavorites.add(movieId)
      try {
        await teluguMoviesService.addToWatchlist(movieId, "medium")
      } catch (err) {
        console.error("Failed to add to watchlist:", err)
      }
    }
    setFavorites(newFavorites)
  }

  const stats = {
    totalMovies: latestMovies.length + trendingMovies.length,
    avgSidduRating: trendingMovies.length
      ? (trendingMovies.reduce((sum, movie) => sum + (movie.siddu_rating || 0), 0) / trendingMovies.length).toFixed(1)
      : "0.0",
    avgAudienceRating: trendingMovies.length
      ? (trendingMovies.reduce((sum, movie) => sum + (movie.audience_rating || 0), 0) / trendingMovies.length).toFixed(
          1,
        )
      : "0.0",
    totalBoxOffice: latestMovies.reduce((sum, movie) => sum + (movie.box_office || 0), 0).toLocaleString("en-IN"),
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="bg-black/40 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-6 text-center">
            <Film className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-500 mb-2">Failed to Load Movies</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-purple-400 bg-clip-text text-transparent">
          Welcome to SidduVerse
        </h1>
        <p className="text-muted-foreground text-lg">Discover the latest Telugu cinema with our dual rating system</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-black/40 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-blue">{stats.totalMovies}</div>
            <p className="text-xs text-muted-foreground">Latest Telugu releases</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Siddu Rating</CardTitle>
            <Award className="h-4 w-4 text-neon-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-blue">{stats.avgSidduRating}</div>
            <p className="text-xs text-muted-foreground">Professional reviews</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Audience Rating</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.avgAudienceRating}</div>
            <p className="text-xs text-muted-foreground">User reviews</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Box Office</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">₹{stats.totalBoxOffice}</div>
            <p className="text-xs text-muted-foreground">Combined collections</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Movies Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs defaultValue="latest" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-black/40 backdrop-blur-sm border border-border/50">
              <TabsTrigger value="latest" className="data-[state=active]:bg-neon-blue/20">
                <Calendar className="h-4 w-4 mr-2" />
                Latest Releases
              </TabsTrigger>
              <TabsTrigger value="trending" className="data-[state=active]:bg-neon-blue/20">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending Now
              </TabsTrigger>
            </TabsList>

            <Link href="/discover">
              <Button variant="outline" className="bg-black/40 backdrop-blur-sm border-border/50">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </Link>
          </div>

          <TabsContent value="latest" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {latestMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MovieCard
                    movie={movie}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.has(movie.id)}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {trendingMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MovieCard
                    movie={movie}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.has(movie.id)}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-gradient-to-br from-neon-blue/20 to-purple-500/20 border-neon-blue/30">
          <CardContent className="p-6 text-center">
            <Star className="h-12 w-12 text-neon-blue mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
            <p className="text-sm text-muted-foreground mb-4">Share your thoughts on the latest Telugu movies</p>
            <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">Start Writing</Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-500/30">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Join Community</h3>
            <p className="text-sm text-muted-foreground mb-4">Connect with fellow Telugu movie enthusiasts</p>
            <Button variant="outline" className="border-green-500/50 text-green-500 bg-transparent">
              Explore Forum
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
            <p className="text-sm text-muted-foreground mb-4">Stay updated with upcoming Telugu releases</p>
            <Button variant="outline" className="border-yellow-500/50 text-yellow-500 bg-transparent">
              View Calendar
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
