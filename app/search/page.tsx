"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MovieCardMobile } from "@/components/movie-card-mobile"
import { Search, X, Film, User, Bookmark, TrendingUp, Clock } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

// Sample search results
const sampleMovies = [
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
    title: "Interstellar",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    year: 2014,
    rating: 4.7,
    runtime: "2h 49m",
    genres: ["Adventure", "Drama", "Science Fiction"],
  },
  {
    id: "3",
    title: "Inception",
    poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    year: 2010,
    rating: 4.8,
    runtime: "2h 28m",
    genres: ["Action", "Science Fiction", "Adventure"],
  },
]

const sampleUsers = [
  { id: "1", name: "Siddu", avatar: "/placeholder-ypk8u.png", reviews: 850 },
  { id: "2", name: "MovieBuff", avatar: "", reviews: 342 },
  { id: "3", name: "FilmFanatic", avatar: "", reviews: 127 },
]

// Recent searches (would be stored in localStorage in a real app)
const recentSearches = ["Nolan", "Marvel", "Sci-Fi", "Oscar Winners"]

// Trending searches
const trendingSearches = ["Barbie", "Oppenheimer", "Mission Impossible", "Indiana Jones"]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isMobile } = useMobile()
  const initialQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState("movies")
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Update URL when search query changes
  useEffect(() => {
    if (searchQuery) {
      const params = new URLSearchParams(searchParams)
      params.set("q", searchQuery)
      router.push(`/search?${params.toString()}`)
      setIsSearching(true)

      // Simulate search delay
      const timer = setTimeout(() => {
        setIsSearching(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [searchQuery, router, searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    // Trigger search
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setShowSuggestions(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
  }

  return (
    <MobileLayout>
      <div className="py-4">
        {/* Search form */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search movies, people, genres..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSuggestions(true)
              }}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <button type="button" onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </div>

          {/* Search suggestions */}
          {showSuggestions && !isSearching && (
            <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg">
              {searchQuery ? (
                <div className="p-2">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-xs text-muted-foreground">Search for "{searchQuery}"</span>
                    <Search className="h-3 w-3 text-muted-foreground" />
                  </div>

                  {/* Matching suggestions would go here */}
                  <button
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-muted rounded"
                    onClick={() => handleSuggestionClick(`${searchQuery} movies`)}
                  >
                    <Film className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{searchQuery} movies</span>
                  </button>

                  <button
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-muted rounded"
                    onClick={() => handleSuggestionClick(`${searchQuery} actors`)}
                  >
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{searchQuery} actors</span>
                  </button>
                </div>
              ) : (
                <div className="p-2 space-y-3">
                  {/* Recent searches */}
                  <div>
                    <div className="flex items-center px-2 py-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                      <span className="text-xs text-muted-foreground">Recent searches</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1 px-2">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          className="text-xs bg-muted px-2 py-1 rounded-full hover:bg-muted/80"
                          onClick={() => handleSuggestionClick(search)}
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trending searches */}
                  <div>
                    <div className="flex items-center px-2 py-1">
                      <TrendingUp className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                      <span className="text-xs text-muted-foreground">Trending searches</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1 px-2">
                      {trendingSearches.map((search) => (
                        <button
                          key={search}
                          className="text-xs bg-muted px-2 py-1 rounded-full hover:bg-muted/80"
                          onClick={() => handleSuggestionClick(search)}
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>

        {searchQuery ? (
          isSearching ? (
            // Loading state
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-10 w-10 rounded-full border-2 border-t-neon-blue border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <p className="mt-4 text-sm text-muted-foreground">Searching for "{searchQuery}"...</p>
            </div>
          ) : (
            // Search results
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="movies">Movies</TabsTrigger>
                  <TabsTrigger value="people">People</TabsTrigger>
                  <TabsTrigger value="lists">Lists</TabsTrigger>
                </TabsList>

                <TabsContent value="movies" className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {sampleMovies.map((movie) => (
                      <MovieCardMobile
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        poster={movie.poster}
                        year={movie.year}
                        rating={movie.rating}
                        runtime={movie.runtime}
                        genres={movie.genres}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="people">
                  <div className="space-y-4">
                    {sampleUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          {user.avatar ? (
                            <img
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-medium">{user.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.reviews} reviews</div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          Follow
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="lists">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No lists found</h3>
                    <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Search for movies, people, and more</h3>
            <p className="text-sm text-muted-foreground mt-1">Try searching for a movie title, actor, or genre</p>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
