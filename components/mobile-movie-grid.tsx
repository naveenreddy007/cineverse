"use client"

import { useState, useCallback } from "react"
import { MovieCardMobile } from "@/components/movie-card-mobile"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useHaptic } from "@/hooks/use-haptic"

interface Movie {
  id: string
  title: string
  poster: string
  year: number
  rating: number
  runtime?: string
  genres?: string[]
}

interface MobileMovieGridProps {
  title: string
  movies: Movie[]
  favorites?: string[]
  onToggleFavorite?: (id: string) => void
  linkPrefix?: string
}

export function MobileMovieGrid({
  title,
  movies,
  favorites = [],
  onToggleFavorite,
  linkPrefix = "/movies",
}: MobileMovieGridProps) {
  const { isMobile, isTablet, deviceType } = useMobile()
  const [showFilters, setShowFilters] = useState(false)
  const { trigger, patterns } = useHaptic()

  // Number of movies to show per row based on device
  const getMoviesPerRow = useCallback(() => {
    if (deviceType === "phone") return 2
    if (deviceType === "tablet") return 3
    return 4
  }, [deviceType])

  const moviesPerRow = getMoviesPerRow()

  // Handle movie pagination for horizontal scrolling
  const [startIndex, setStartIndex] = useState(0)
  const endIndex = Math.min(startIndex + moviesPerRow * 2, movies.length)
  const currentMovies = movies.slice(startIndex, endIndex)

  const handlePrev = () => {
    trigger(patterns.light)
    setStartIndex(Math.max(0, startIndex - moviesPerRow))
  }

  const handleNext = () => {
    trigger(patterns.light)
    setStartIndex(Math.min(movies.length - 1, startIndex + moviesPerRow))
  }

  const handleFilterToggle = () => {
    trigger(patterns.medium)
    setShowFilters(!showFilters)
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{title}</h2>

        <div className="flex items-center gap-1">
          {/* Filter button for mobile */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleFilterToggle}>
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh]">
              <SheetHeader>
                <SheetTitle>Filter Movies</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                {/* Filter options would go here */}
                <p className="text-muted-foreground">Filter controls would be implemented here</p>
              </div>
            </SheetContent>
          </Sheet>

          {/* Navigation buttons */}
          <Button variant="ghost" size="icon" className="h-9 w-9" disabled={startIndex === 0} onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            disabled={endIndex >= movies.length}
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>

      {/* Touch-friendly movie grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {currentMovies.map((movie) => (
          <MovieCardMobile
            key={movie.id}
            id={movie.id}
            title={movie.title}
            poster={movie.poster}
            year={movie.year}
            rating={movie.rating}
            runtime={movie.runtime}
            genres={movie.genres}
            isFavorite={favorites.includes(movie.id)}
            onToggleFavorite={onToggleFavorite}
            linkPrefix={linkPrefix}
          />
        ))}
      </div>
    </div>
  )
}
