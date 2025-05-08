"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MovieCard } from "@/components/movie-card"
import { useToast } from "@/components/ui/use-toast"
import {
  Play,
  Star,
  Clock,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  BookmarkCheck,
  Heart,
  ImageOff,
  ArrowLeft,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import Link from "next/link"

// Mock movie data
const mockMovies = [
  {
    id: "1",
    title: "Oppenheimer",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    rating: 4.8,
    year: 2023,
    genres: ["Biography", "Drama", "History"],
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    runtime: 180,
    plot: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg",
  },
  {
    id: "2",
    title: "Dune",
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    rating: 4.6,
    year: 2021,
    genres: ["Sci-Fi", "Adventure"],
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Rebecca Ferguson", "Oscar Isaac", "Zendaya"],
    runtime: 155,
    plot: "Feature adaptation of Frank Herbert's science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.",
    trailerUrl: "https://www.youtube.com/embed/8g18jFHCLXk",
  },
  {
    id: "3",
    title: "Everything Everywhere All at Once",
    poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    rating: 4.7,
    year: 2022,
    genres: ["Action", "Adventure", "Comedy"],
    director: "Daniel Kwan, Daniel Scheinert",
    cast: ["Michelle Yeoh", "Stephanie Hsu", "Ke Huy Quan", "Jamie Lee Curtis"],
    runtime: 139,
    plot: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.",
    trailerUrl: "https://www.youtube.com/embed/wxN1T1uxQ2g",
  },
  {
    id: "4",
    title: "The Batman",
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    rating: 4.3,
    year: 2022,
    genres: ["Action", "Crime", "Drama"],
    director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Jeffrey Wright", "Colin Farrell"],
    runtime: 176,
    plot: "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    trailerUrl: "https://www.youtube.com/embed/mqqft2x_Aa4",
    backdrop: "https://image.tmdb.org/t/p/original/5P8SmMzSNYikXpxil6BYzJ16611.jpg",
  },
]

// Mock similar movies
const mockSimilarMovies = [
  {
    id: "s1",
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    rating: 4.9,
    year: 2008,
    genres: ["Action", "Crime", "Drama"],
  },
  {
    id: "s2",
    title: "Joker",
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    rating: 4.4,
    year: 2019,
    genres: ["Crime", "Thriller", "Drama"],
  },
  {
    id: "s3",
    title: "Batman Begins",
    poster: "https://image.tmdb.org/t/p/w500/8RW2runSEc34IwKN2D1aPcJd2UL.jpg",
    rating: 4.5,
    year: 2005,
    genres: ["Action", "Adventure"],
  },
  {
    id: "s4",
    title: "The Dark Knight Rises",
    poster: "https://image.tmdb.org/t/p/w500/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg",
    rating: 4.4,
    year: 2012,
    genres: ["Action", "Thriller"],
  },
]

// Mock reviews
const mockReviews = [
  {
    id: "r1",
    user: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    rating: 4.5,
    content:
      "A dark and gritty take on Batman that feels fresh yet familiar. Robert Pattinson delivers a brooding performance that captures the essence of the character. The cinematography and score create a perfect atmosphere for Gotham City.",
    date: "2022-03-15",
    likes: 42,
    comments: 8,
  },
  {
    id: "r2",
    user: {
      name: "Michael Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    rating: 4.0,
    content:
      "While it's a bit too long, The Batman offers a compelling detective story with stunning visuals. The noir influence is strong, and the film benefits from focusing on Batman's intelligence rather than just his fighting skills.",
    date: "2022-03-10",
    likes: 28,
    comments: 5,
  },
  {
    id: "r3",
    user: {
      name: "Emma Thompson",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    rating: 5.0,
    content:
      "This might be my favorite Batman movie yet. It perfectly balances action, mystery, and character development. The Riddler is genuinely terrifying, and the supporting cast is excellent. Can't wait for the sequel!",
    date: "2022-03-18",
    likes: 56,
    comments: 12,
  },
]

export default function MovieDetailPage() {
  const params = useParams()
  const movieId = params.id as string
  const [movie, setMovie] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isWatched, setIsWatched] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [backdropError, setBackdropError] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call to fetch movie details
    const fetchMovie = async () => {
      setIsLoading(true)
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Find movie by ID
        const foundMovie = mockMovies.find((m) => m.id === movieId)
        if (foundMovie) {
          setMovie(foundMovie)
        }
      } catch (error) {
        console.error("Error fetching movie:", error)
        toast({
          title: "Error",
          description: "Failed to load movie details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovie()
  }, [movieId, toast])

  const handleAddToWatchlist = () => {
    setIsInWatchlist(!isInWatchlist)
    toast({
      title: isInWatchlist ? "Removed from watchlist" : "Added to watchlist",
      description: isInWatchlist
        ? "Movie has been removed from your watchlist"
        : "Movie has been added to your watchlist",
    })
  }

  const handleMarkAsWatched = () => {
    setIsWatched(!isWatched)
    toast({
      title: isWatched ? "Marked as unwatched" : "Marked as watched",
      description: isWatched ? "Movie has been marked as unwatched" : "Movie has been marked as watched",
    })
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Movie has been removed from your favorites" : "Movie has been added to your favorites",
    })
  }

  const handleShareMovie = () => {
    if (!movie) return

    navigator.clipboard.writeText(`Check out ${movie.title} (${movie.year}) - I found it on CineVerse!`)
    toast({
      title: "Link copied to clipboard",
      description: `Share link for "${movie.title}" has been copied to your clipboard.`,
    })
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Skeleton className="w-full aspect-[2/3] rounded-xl" />
          </div>

          <div className="md:w-2/3 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-2">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
            </div>
            <div className="flex gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-28" />
                ))}
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />

            <div className="pt-4">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="flex gap-2">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-10 w-10 rounded-full" />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
        <p className="text-muted-foreground mb-8">The movie you're looking for doesn't exist or has been removed.</p>
        <Link href="/dashboard">
          <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">Return to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Movie Details</h1>
      </div>

      {/* Backdrop Image */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
        {backdropError ? (
          <div className="w-full h-full bg-black/60 flex items-center justify-center">
            <ImageOff className="h-16 w-16 text-muted-foreground" />
          </div>
        ) : (
          <>
            <Image
              src={movie.backdrop || movie.poster}
              alt={movie.title}
              fill
              className="object-cover"
              onError={() => setBackdropError(true)}
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Movie Poster */}
        <div className="md:w-1/3 lg:w-1/4">
          <div className="relative rounded-xl overflow-hidden aspect-[2/3] shadow-lg movie-card-hover">
            {imageError ? (
              <div className="w-full h-full bg-black/60 flex items-center justify-center">
                <ImageOff className="h-16 w-16 text-muted-foreground" />
              </div>
            ) : (
              <Image
                src={movie.poster || "/placeholder.svg"}
                alt={movie.title}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                unoptimized
              />
            )}
          </div>
        </div>

        {/* Movie Details */}
        <div className="md:w-2/3 lg:w-3/4 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {movie.title} <span className="text-muted-foreground">({movie.year})</span>
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre: string) => (
                <Badge key={genre} variant="outline" className="bg-secondary/20">
                  {genre}
                </Badge>
              ))}
              <Badge variant="outline" className="bg-secondary/20">
                {formatRuntime(movie.runtime)}
              </Badge>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center bg-neon-blue/20 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="font-medium">{movie.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm ml-1">/5</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{movie.year}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{formatRuntime(movie.runtime)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Trailer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] bg-black/90 backdrop-blur-sm border-border/50">
                <DialogHeader>
                  <div className="flex justify-between items-center">
                    <DialogTitle>{movie.title} - Official Trailer</DialogTitle>
                    <DialogClose className="h-4 w-4" />
                  </div>
                </DialogHeader>
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src={movie.trailerUrl}
                    title={`${movie.title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-md"
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={handleAddToWatchlist} className={isInWatchlist ? "bg-secondary/20" : ""}>
              {isInWatchlist ? (
                <>
                  <BookmarkCheck className="h-4 w-4 mr-2 text-neon-blue" />
                  In Watchlist
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Add to Watchlist
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleMarkAsWatched}
              className={isWatched ? "bg-green-500/20 text-green-500" : ""}
            >
              {isWatched ? (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Watched
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Mark as Watched
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleToggleFavorite}
              className={isFavorite ? "bg-red-500/20 text-red-500" : ""}
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Favorited" : "Favorite"}
            </Button>

            <Button variant="outline" onClick={handleShareMovie}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-muted-foreground">{movie.plot}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Director</h2>
            <p>{movie.director}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Cast</h2>
            <div className="flex flex-wrap gap-4">
              {movie.cast.map((actor: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${index + 10}`} alt={actor} />
                    <AvatarFallback>
                      {actor
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{actor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Similar Movies and Reviews */}
      <Tabs defaultValue="similar" className="mt-12">
        <TabsList className="bg-black/40 backdrop-blur-sm border border-border/50">
          <TabsTrigger value="similar" className="data-[state=active]:bg-neon-blue/20">
            Similar Movies
          </TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:bg-neon-blue/20">
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="similar" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockSimilarMovies.map((similarMovie) => (
              <MovieCard key={similarMovie.id} movie={similarMovie} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">User Reviews</h2>
              <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">
                <Star className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            </div>

            <div className="space-y-4">
              {mockReviews.map((review) => (
                <Card key={review.id} className="bg-black/40 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={review.user.avatar} alt={review.user.name} />
                          <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.user.name}</div>
                          <div className="text-sm text-muted-foreground">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(review.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : i === Math.floor(review.rating) && review.rating % 1 >= 0.5
                                  ? "text-yellow-400 fill-yellow-400/50"
                                  : "text-muted-foreground"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium">{review.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">{review.content}</p>

                    <div className="flex gap-4">
                      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-neon-blue">
                        <ThumbsUp className="h-4 w-4" />
                        {review.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        {review.comments}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

