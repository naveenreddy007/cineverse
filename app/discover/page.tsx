"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MobileLayout } from "@/components/mobile-layout"
import { MobileMovieGrid } from "@/components/mobile-movie-grid"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, Star, Calendar } from "lucide-react"
import { useHaptic } from "@/hooks/use-haptic"

// Sample movie data
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
  {
    id: "5",
    title: "Indiana Jones and the Dial of Destiny",
    poster: "https://image.tmdb.org/t/p/w500/Af4bXE63pVsb2FtbW8uYIyPBadD.jpg",
    year: 2023,
    rating: 4.0,
    runtime: "2h 34m",
    genres: ["Adventure", "Action"],
  },
  {
    id: "6",
    title: "Guardians of the Galaxy Vol. 3",
    poster: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
    year: 2023,
    rating: 4.3,
    runtime: "2h 30m",
    genres: ["Adventure", "Action", "Science Fiction"],
  },
]

const topRatedMovies = [
  {
    id: "7",
    title: "The Shawshank Redemption",
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    year: 1994,
    rating: 4.9,
    runtime: "2h 22m",
    genres: ["Drama", "Crime"],
  },
  {
    id: "8",
    title: "The Godfather",
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    year: 1972,
    rating: 4.8,
    runtime: "2h 55m",
    genres: ["Drama", "Crime"],
  },
  {
    id: "9",
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    year: 2008,
    rating: 4.9,
    runtime: "2h 32m",
    genres: ["Action", "Crime", "Drama"],
  },
  {
    id: "10",
    title: "Pulp Fiction",
    poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    year: 1994,
    rating: 4.7,
    runtime: "2h 34m",
    genres: ["Thriller", "Crime"],
  },
]

const upcomingMovies = [
  {
    id: "11",
    title: "Dune: Part Two",
    poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    year: 2024,
    rating: 0,
    runtime: "2h 45m",
    genres: ["Science Fiction", "Adventure"],
  },
  {
    id: "12",
    title: "Furiosa: A Mad Max Saga",
    poster: "https://image.tmdb.org/t/p/w500/6lKGlrQKDdQAUGsLVTvL5k3gdBQ.jpg",
    year: 2024,
    rating: 0,
    runtime: "2h 30m",
    genres: ["Action", "Adventure", "Science Fiction"],
  },
  {
    id: "13",
    title: "Gladiator II",
    poster: "https://image.tmdb.org/t/p/w500/1wZ7JsFrJIZQTCXD2eibbZXDJ8O.jpg",
    year: 2024,
    rating: 0,
    runtime: "2h 30m",
    genres: ["Action", "Drama", "History"],
  },
]

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState("trending")
  const [favorites, setFavorites] = useState<string[]>(["1", "9"])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      trigger(patterns.light)
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <MobileLayout>
      <div className="py-4 space-y-6">
        {/* Search form */}
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search movies, genres, actors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2">
                Search
              </Button>
            )}
          </div>
        </form>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="trending" onClick={() => trigger(patterns.light)} className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Trending</span>
            </TabsTrigger>
            <TabsTrigger value="top-rated" onClick={() => trigger(patterns.light)} className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              <span>Top Rated</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" onClick={() => trigger(patterns.light)} className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Upcoming</span>
            </TabsTrigger>
          </TabsList>

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
          </TabsContent>

          <TabsContent value="top-rated" className="space-y-8 mt-0">
            <MobileMovieGrid
              title="All-Time Classics"
              movies={topRatedMovies}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              isLoading={isLoading}
            />

            <MobileMovieGrid
              title="Top Rated 2023"
              movies={trendingMovies.filter((m) => m.year === 2023).sort((a, b) => b.rating - a.rating)}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-8 mt-0">
            <MobileMovieGrid
              title="Coming Soon"
              movies={upcomingMovies}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              isLoading={isLoading}
            />

            <MobileMovieGrid
              title="In Theaters Now"
              movies={trendingMovies.slice(0, 4)}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
