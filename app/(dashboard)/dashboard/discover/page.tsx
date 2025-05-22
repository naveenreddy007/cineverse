"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { MovieCard } from "@/components/movie-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, Film, Star, Clock, TrendingUp } from "lucide-react"
import { mockMovies } from "@/lib/mock-data"

// Mock genres for filter
const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "War",
  "Western",
]

export default function DiscoverPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filteredMovies, setFilteredMovies] = useState(mockMovies)
  const [movies, setMovies] = useState(mockMovies)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter movies based on search query and selected genres
    let results = movies

    if (searchQuery) {
      results = results.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedGenres.length > 0) {
      results = results.filter((movie) => movie.genres.some((genre) => selectedGenres.includes(genre)))
    }

    setFilteredMovies(results)
  }, [searchQuery, selectedGenres, movies])

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Discover Movies</h1>
        <p className="text-muted-foreground">Explore new films or search for your favorites</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-black/40 backdrop-blur-sm border-border/50"
          />
        </div>
        <Button
          variant="outline"
          className="flex gap-2 bg-black/40 backdrop-blur-sm border-border/50"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </motion.div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-black/40 backdrop-blur-sm border border-border/50 rounded-lg p-4"
        >
          <h3 className="font-medium mb-3">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Button
                key={genre}
                variant="outline"
                size="sm"
                className={`text-xs ${
                  selectedGenres.includes(genre) ? "bg-neon-blue/20 text-neon-blue border-neon-blue" : "bg-secondary/20"
                }`}
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-black/40 backdrop-blur-sm border border-border/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-neon-blue/20">
            <Film className="h-4 w-4 mr-2" />
            All Movies
          </TabsTrigger>
          <TabsTrigger value="top-rated" className="data-[state=active]:bg-neon-blue/20">
            <Star className="h-4 w-4 mr-2" />
            Top Rated
          </TabsTrigger>
          <TabsTrigger value="new-releases" className="data-[state=active]:bg-neon-blue/20">
            <Clock className="h-4 w-4 mr-2" />
            New Releases
          </TabsTrigger>
          <TabsTrigger value="trending" className="data-[state=active]:bg-neon-blue/20">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
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
              {filteredMovies.length === 0 ? (
                <div className="text-center py-12">
                  <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No movies found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="top-rated" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading
              ? Array(4)
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
                  ))
              : // Filter for top rated movies (rating > 4.5)
                movies
                  .filter((movie) => movie.rating > 4.5)
                  .map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </TabsContent>

        <TabsContent value="new-releases" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading
              ? Array(4)
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
                  ))
              : // Filter for new releases (year >= 2022)
                movies
                  .filter((movie) => movie.year >= 2022)
                  .map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading
              ? Array(4)
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
                  ))
              : // Shuffle movies for trending demo
                [...movies]
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 4)
                  .map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
