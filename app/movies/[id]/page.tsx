"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { MobileLayout } from "@/components/mobile-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, Share2, Clock, Calendar, Film, ChevronDown, ChevronUp } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { MobileMovieGrid } from "@/components/mobile-movie-grid"
import { MovieReviewsMobile } from "@/components/movie-reviews-mobile"

// Sample movie data
const movieData = {
  id: "1",
  title: "Oppenheimer",
  poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
  backdrop: "https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
  year: 2023,
  rating: 4.8,
  runtime: "3h 0m",
  genres: ["Biography", "Drama", "History"],
  director: "Christopher Nolan",
  cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
  plot: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
  releaseDate: "July 21, 2023",
  criticScore: 93,
  userScore: 90,
}

// Sample similar movies
const similarMovies = [
  {
    id: "2",
    title: "Dunkirk",
    poster: "https://image.tmdb.org/t/p/w500/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg",
    year: 2017,
    rating: 4.5,
    runtime: "1h 46m",
    genres: ["War", "Action", "Drama"],
  },
  {
    id: "3",
    title: "Interstellar",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    year: 2014,
    rating: 4.7,
    runtime: "2h 49m",
    genres: ["Adventure", "Drama", "Science Fiction"],
  },
  {
    id: "4",
    title: "Inception",
    poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    year: 2010,
    rating: 4.8,
    runtime: "2h 28m",
    genres: ["Action", "Science Fiction", "Adventure"],
  },
  {
    id: "5",
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    year: 2008,
    rating: 4.9,
    runtime: "2h 32m",
    genres: ["Action", "Crime", "Drama"],
  },
]

export default function MovieDetailsPage() {
  const { id } = useParams()
  const { isMobile } = useMobile()
  const [isFavorite, setIsFavorite] = useState(false)
  const [showFullPlot, setShowFullPlot] = useState(false)
  const [activeTab, setActiveTab] = useState("about")

  // Simulate loading movie data
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [id])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movieData.title,
        text: `Check out ${movieData.title} on SidduVerse!`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="h-32 w-32 rounded-full border-4 border-t-neon-blue border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading movie details...</p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <div className="pb-16">
        {/* Backdrop and poster */}
        <div className="relative h-[30vh] sm:h-[40vh] w-full overflow-hidden">
          <Image
            src={movieData.backdrop || "/placeholder.svg"}
            alt={movieData.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end gap-4">
            <div className="relative h-24 w-16 sm:h-32 sm:w-20 rounded-md overflow-hidden shadow-lg">
              <Image src={movieData.poster || "/placeholder.svg"} alt={movieData.title} fill className="object-cover" />
            </div>

            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold">{movieData.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{movieData.year}</span>
                <span>•</span>
                <span>{movieData.runtime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-around py-4 border-b">
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1" onClick={toggleFavorite}>
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            <span className="text-xs">{isFavorite ? "Saved" : "Save"}</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
            <Star className="h-5 w-5" />
            <span className="text-xs">Rate</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
            <span className="text-xs">Share</span>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="similar">Similar</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            {/* Ratings */}
            <div className="flex justify-around p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{movieData.criticScore}%</div>
                <div className="text-xs text-muted-foreground">Critics</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold">{movieData.userScore}%</div>
                <div className="text-xs text-muted-foreground">Users</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                  {movieData.rating}
                </div>
                <div className="text-xs text-muted-foreground">SidduScore</div>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movieData.genres.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>

            {/* Plot */}
            <div>
              <h3 className="font-medium mb-2">Overview</h3>
              <p className={`text-sm text-muted-foreground ${!showFullPlot && "line-clamp-3"}`}>{movieData.plot}</p>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 mt-1 h-6 px-2"
                onClick={() => setShowFullPlot(!showFullPlot)}
              >
                <span className="text-xs">{showFullPlot ? "Show less" : "Read more"}</span>
                {showFullPlot ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Release Date</div>
                  <div className="text-sm">{movieData.releaseDate}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Film className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Director</div>
                  <div className="text-sm">{movieData.director}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Runtime</div>
                  <div className="text-sm">{movieData.runtime}</div>
                </div>
              </div>
            </div>

            {/* Cast */}
            <div>
              <h3 className="font-medium mb-2">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {movieData.cast.map((actor) => (
                  <Badge key={actor} variant="outline">
                    {actor}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <MovieReviewsMobile movieId={id as string} />
          </TabsContent>

          <TabsContent value="similar">
            <MobileMovieGrid
              title="Similar Movies"
              movies={similarMovies}
              onToggleFavorite={(id) => console.log("Toggle favorite:", id)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
