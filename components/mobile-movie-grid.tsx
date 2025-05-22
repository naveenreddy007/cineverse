"use client"

import { useState, useRef, useEffect } from "react"
import { MovieCardMobile } from "@/components/movie-card-mobile"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
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
  showFilters?: boolean
  isLoading?: boolean
}

export function MobileMovieGrid({
  title,
  movies,
  favorites = [],
  onToggleFavorite,
  showFilters = true,
  isLoading = false,
}: MobileMovieGridProps) {
  const { isMobile, isTablet, deviceType } = useMobile()
  const [showFiltersSheet, setShowFiltersSheet] = useState(false)
  const { trigger, patterns } = useHaptic()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Check scroll possibilities
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return

      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5) // 5px buffer
    }

    const container = scrollContainerRef.current
    if (container) {
      checkScroll()
      container.addEventListener("scroll", checkScroll)
      return () => container.removeEventListener("scroll", checkScroll)
    }
  }, [movies])

  // Number of movies to show per row based on device
  const getMoviesPerRow = () => {
    if (deviceType === "phone") return 2
    if (deviceType === "tablet") return 3
    return 4
  }

  const moviesPerRow = getMoviesPerRow()

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollAmount = container.clientWidth * 0.8

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })

    trigger(patterns.light)
  }

  // Placeholder for loading state
  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {Array(moviesPerRow)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden aspect-[2/3] bg-muted animate-pulse" />
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{title}</h2>

        <div className="flex items-center gap-1">
          {/* Filter button for mobile */}
          {showFilters && (
            <Sheet open={showFiltersSheet} onOpenChange={setShowFiltersSheet}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 active:scale-95 transition-transform"
                  onClick={() => trigger(patterns.light)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] sm:h-[60vh]">
                <SheetHeader>
                  <SheetTitle>Filter Movies</SheetTitle>
                </SheetHeader>

                <div className="py-4 space-y-6 overflow-y-auto max-h-[calc(80vh-10rem)]">
                  {/* Sort options */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Sort By</h3>
                    <Select defaultValue="popularity">
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popularity">Popularity</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="release">Release Date</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year range */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Year Range</h3>
                    <div className="px-2">
                      <Slider defaultValue={[1990, 2023]} min={1900} max={2023} step={1} className="my-6" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1990</span>
                        <span>2023</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating range */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Minimum Rating</h3>
                    <div className="px-2">
                      <Slider defaultValue={[3.5]} min={0} max={5} step={0.5} className="my-6" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span>5</span>
                      </div>
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Genres</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller"].map((genre) => (
                        <div key={genre} className="flex items-center space-x-2">
                          <Checkbox id={`genre-${genre}`} />
                          <Label htmlFor={`genre-${genre}`} className="text-sm">
                            {genre}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <SheetFooter className="flex-row justify-between sm:justify-between gap-2">
                  <SheetClose asChild>
                    <Button variant="outline" className="flex-1">
                      Reset
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button className="flex-1">Apply Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          )}

          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 active:scale-95 transition-transform"
            disabled={!canScrollLeft}
            onClick={() => handleScroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 active:scale-95 transition-transform"
            disabled={!canScrollRight}
            onClick={() => handleScroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>

      {/* Touch-friendly movie grid with horizontal scrolling */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-4 gap-3 sm:gap-4 scrollbar-thin scrollbar-thumb-neon-blue/50 scrollbar-track-black/20 -mx-4 px-4"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-[160px] sm:w-[180px]">
            <MovieCardMobile
              id={movie.id}
              title={movie.title}
              poster={movie.poster}
              year={movie.year}
              rating={movie.rating}
              runtime={movie.runtime}
              genres={movie.genres}
              isFavorite={favorites.includes(movie.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
