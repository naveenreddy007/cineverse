"use client"

import { useState, useEffect } from "react"
import { MobileLayout } from "@/components/mobile-layout"
import { MobileMovieGrid } from "@/components/mobile-movie-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, TrendingUp, ChevronRight, Play, Award, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useHaptic } from "@/hooks/use-haptic"

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

// Sample trending movies
const trendingMovies = [
  {
    id: "1",
    title: "Oppenheimer",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    year: 2023,
    rating: 4.8,
    runtime: "3h 0m",
    genres: ["Biography", "Drama", "History"],
  },
  {
    id: "2",
    title: "Barbie",
    poster: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi8Qzsk3Ql7wG.jpg",
    year: 2023,
    rating: 4.2,
    runtime: "1h 54m",
    genres: ["Comedy", "Adventure", "Fantasy"],
  },
  {
    id: "3",
    title: "Mission: Impossible - Dead Reckoning",
    poster: "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
    year: 2023,
    rating: 4.5,
    runtime: "2h 43m",
    genres: ["Action", "Adventure", "Thriller"],
  },
  {
    id: "4",
    title: "The Flash",
    poster: "https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg",
    year: 2023,
    rating: 3.7,
    runtime: "2h 24m",
    genres: ["Action", "Adventure", "Fantasy"],
  },
]

// Sample recent reviews
const recentReviews = [
  {
    id: "r1",
    movie: {
      id: "1",
      title: "Oppenheimer",
      poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    },
    user: {
      name: "Siddu",
      avatar: "/placeholder-ypk8u.png",
    },
    rating: 4.5,
    content:
      "A masterpiece that explores the moral complexities of scientific discovery. Nolan's direction is impeccable, and Cillian Murphy delivers a career-defining performance.",
    date: "2 days ago",
  },
  {
    id: "r2",
    movie: {
      id: "2",
      title: "Barbie",
      poster: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi8Qzsk3Ql7wG.jpg",
    },
    user: {
      name: "MovieBuff",
      avatar: "",
    },
    rating: 4.0,
    content:
      "Surprisingly thoughtful and funny. Greta Gerwig has created something special that works on multiple levels.",
    date: "1 week ago",
  },
]

// Sample featured categories
const featuredCategories = [
  {
    id: "c1",
    title: "Movie of the Week",
    icon: Sparkles,
    color: "text-yellow-400",
    movie: {
      id: "1",
      title: "Oppenheimer",
      poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    },
  },
  {
    id: "c2",
    title: "Movie of the Month",
    icon: Award,
    color: "text-blue-400",
    movie: {
      id: "3",
      title: "Mission: Impossible - Dead Reckoning",
      poster: "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
    },
  },
]

export default function HomePage() {
  const [favorites, setFavorites] = useState<string[]>(["1", "3"])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("for-you")
  const { trigger, patterns } = useHaptic()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((movieId) => movieId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  return (
    <MobileLayout>
      <div className="py-4 space-y-6">
        {/* Featured Movie */}
        <div className="relative rounded-xl overflow-hidden aspect-[16/9]">
          <Image
            src={featuredMovie.backdrop || "/placeholder.svg"}
            alt={featuredMovie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-neon-blue/20 text-white">
                Featured
              </Badge>
              <div className="flex items-center text-xs text-white/80">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                <span>{featuredMovie.rating}</span>
              </div>
            </div>

            <h1 className="text-xl font-bold text-white mb-1">{featuredMovie.title}</h1>
            <p className="text-sm text-white/80 line-clamp-2 mb-3">{featuredMovie.description}</p>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-neon-blue text-black hover:bg-neon-blue/80 active:scale-95 transition-transform"
                onClick={() => {
                  trigger(patterns.medium)
                  window.location.href = `/movies/${featuredMovie.id}`
                }}
              >
                <Play className="h-4 w-4 mr-1" />
                Watch Trailer
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="active:scale-95 transition-transform"
                onClick={() => {
                  trigger(patterns.light)
                  window.location.href = `/movies/${featuredMovie.id}`
                }}
              >
                Details
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="for-you" onClick={() => trigger(patterns.light)}>
              For You
            </TabsTrigger>
            <TabsTrigger value="trending" onClick={() => trigger(patterns.light)}>
              Trending
            </TabsTrigger>
          </TabsList>

          <TabsContent value="for-you" className="space-y-8 mt-0">
            {/* Featured Categories */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Featured</h2>
                <Link href="/featured" className="text-sm text-muted-foreground flex items-center">
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {featuredCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/featured/${category.id}`}
                    className="active:scale-95 transition-transform"
                  >
                    <Card className="overflow-hidden h-full">
                      <CardContent className="p-3 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-2">
                          <category.icon className={`h-4 w-4 ${category.color}`} />
                          <span className="text-sm font-medium">{category.title}</span>
                        </div>

                        <div className="relative aspect-[2/3] rounded-md overflow-hidden mt-auto">
                          <Image
                            src={category.movie.poster || "/placeholder.svg"}
                            alt={category.movie.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Continue Watching */}
            <MobileMovieGrid
              title="Continue Watching"
              movies={trendingMovies.slice(0, 4)}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              isLoading={isLoading}
              showFilters={false}
            />

            {/* Recent Reviews */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Recent Reviews</h2>
                <Link href="/dashboard/reviews" className="text-sm text-muted-foreground flex items-center">
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {recentReviews.map((review) => (
                  <Card key={review.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="relative h-16 w-12 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={review.movie.poster || "/placeholder.svg"}
                            alt={review.movie.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <Link href={`/movies/${review.movie.id}`} className="font-medium hover:underline truncate">
                              {review.movie.title}
                            </Link>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                              <span className="text-sm">{review.rating}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                              <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">{review.user.name}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2">{review.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-8 mt-0">
            <MobileMovieGrid
              title="Trending Now"
              movies={trendingMovies}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              isLoading={isLoading}
            />

            <MobileMovieGrid
              title="Popular This Week"
              movies={[...trendingMovies].reverse()}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              isLoading={isLoading}
            />

            <div className="flex justify-center">
              <Button
                onClick={() => {
                  trigger(patterns.light)
                  window.location.href = "/discover"
                }}
                className="active:scale-95 transition-transform"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Explore More
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
