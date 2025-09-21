"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  TrendingUp,
  ChevronRight,
  Play,
  Award,
  Sparkles,
  Film,
  Users,
  MessageSquare,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useHaptic } from "@/hooks/use-haptic"
import { useAuth } from "@/components/auth-provider"
import { MovieCard } from "@/components/movie-card"
import { mockMovies } from "@/lib/mock-data"

// Sample featured movie
const featuredMovie = {
  id: "1",
  title: "Oppenheimer",
  backdrop: "https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
  poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
  year: 2023,
  rating: 4.8,
  runtime: "3h 0m",
  genres: ["Biography", "Drama", "History"],
  description:
    "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
}

// Sample stats
const userStats = {
  moviesWatched: 127,
  reviewsWritten: 23,
  watchlistItems: 15,
  forumPosts: 8,
}

// Sample recent activity
const recentActivity = [
  {
    id: "1",
    type: "review",
    movie: "Oppenheimer",
    action: "wrote a review",
    time: "2 hours ago",
    rating: 4.5,
  },
  {
    id: "2",
    type: "watchlist",
    movie: "Dune: Part Two",
    action: "added to watchlist",
    time: "1 day ago",
  },
  {
    id: "3",
    type: "forum",
    movie: "The Batman",
    action: "commented on discussion",
    time: "3 days ago",
  },
]

export default function DashboardPage() {
  const [favorites, setFavorites] = useState<string[]>(["1", "3"])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { lightHaptic } = useHaptic()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleToggleFavorite = (id: string) => {
    lightHaptic()
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((movieId) => movieId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  const trendingMovies = mockMovies.slice(0, 6)

  return (
    <div className="py-6 space-y-8">
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} alt={user?.email || "User"} />
            <AvatarFallback className="text-lg">{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Movie Lover"}!
            </h1>
            <p className="text-muted-foreground">Ready to discover your next favorite movie?</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <Film className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{userStats.moviesWatched}</div>
            <div className="text-xs text-muted-foreground">Movies Watched</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{userStats.reviewsWritten}</div>
            <div className="text-xs text-muted-foreground">Reviews Written</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{userStats.watchlistItems}</div>
            <div className="text-xs text-muted-foreground">In Watchlist</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{userStats.forumPosts}</div>
            <div className="text-xs text-muted-foreground">Forum Posts</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Featured Movie */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            <Image
              src={featuredMovie.backdrop || "/placeholder.svg"}
              alt={featuredMovie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />

            <div className="absolute inset-0 flex items-center">
              <div className="p-6 md:p-8 max-w-lg">
                <Badge variant="secondary" className="mb-3">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Featured Movie
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{featuredMovie.title}</h2>
                <p className="text-muted-foreground mb-4 line-clamp-2">{featuredMovie.description}</p>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{featuredMovie.rating}</span>
                  </div>
                  <span>{featuredMovie.year}</span>
                  <span>{featuredMovie.runtime}</span>
                </div>
                <div className="flex space-x-3">
                  <Button onClick={() => lightHaptic()}>
                    <Play className="h-4 w-4 mr-2" />
                    Watch Trailer
                  </Button>
                  <Button variant="outline" onClick={() => lightHaptic()}>
                    Add to Watchlist
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Link href="/dashboard/discover">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-medium">Discover</div>
              <div className="text-xs text-muted-foreground">Find new movies</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/watchlist">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-medium">Watchlist</div>
              <div className="text-xs text-muted-foreground">Movies to watch</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/reviews">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-medium">Reviews</div>
              <div className="text-xs text-muted-foreground">Write reviews</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/forum">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-medium">Community</div>
              <div className="text-xs text-muted-foreground">Join discussions</div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      {/* Trending Movies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Trending Now</h2>
          <Link
            href="/dashboard/discover"
            className="text-sm text-muted-foreground flex items-center hover:text-foreground"
          >
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favorites.includes(movie.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <div>
                    <div className="text-sm">
                      You {activity.action} <span className="font-medium">{activity.movie}</span>
                      {activity.rating && (
                        <span className="ml-2 inline-flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                          {activity.rating}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
