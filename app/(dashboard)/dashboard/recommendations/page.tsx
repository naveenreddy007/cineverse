"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { MovieCard } from "@/components/movie-card"
import { Sparkles, ThumbsUp, ThumbsDown, Film, Calendar, Zap, Play, Share2, Info, X, Filter, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock recommended movies with real poster images
const mockRecommendations = [
  {
    id: "1",
    title: "Blade Runner 2049",
    poster: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    rating: 4.7,
    year: 2017,
    genres: ["Sci-Fi", "Drama", "Mystery"],
    reason: "Based on your interest in sci-fi films",
    reasonDetails:
      "You've watched several sci-fi films with dystopian themes, including the original Blade Runner. This sequel has similar visual aesthetics and philosophical themes.",
    director: "Denis Villeneuve",
    cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas"],
    plot: "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
    trailerUrl: "https://www.youtube.com/embed/gCcx85zbxz4",
  },
  {
    id: "2",
    title: "The Grand Budapest Hotel",
    poster: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrOo.jpg",
    rating: 4.6,
    year: 2014,
    genres: ["Comedy", "Drama", "Adventure"],
    reason: "Because you enjoyed other Wes Anderson films",
    reasonDetails:
      "Your high ratings for 'Moonrise Kingdom' and 'The Royal Tenenbaums' suggest you appreciate Wes Anderson's unique visual style and quirky storytelling.",
    director: "Wes Anderson",
    cast: ["Ralph Fiennes", "F. Murray Abraham", "Mathieu Amalric"],
    plot: "The adventures of Gustave H, a legendary concierge at a famous European hotel between the wars, and Zero Moustafa, the lobby boy who becomes his most trusted friend.",
    trailerUrl: "https://www.youtube.com/embed/1Fg5iWmQjwk",
  },
  {
    id: "3",
    title: "Parasite",
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    rating: 4.8,
    year: 2019,
    genres: ["Thriller", "Drama", "Comedy"],
    reason: "Award-winning film you might have missed",
    reasonDetails:
      "Based on your interest in thought-provoking dramas with social commentary. This film won multiple Academy Awards including Best Picture and has themes of class struggle that align with other films you've enjoyed.",
    director: "Bong Joon-ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    plot: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    trailerUrl: "https://www.youtube.com/embed/5xH0HfJHsaY",
  },
  {
    id: "4",
    title: "The Lighthouse",
    poster: "https://image.tmdb.org/t/p/w500/3nk9UoepYmv1G9oP18q6JJCeYwN.jpg",
    rating: 4.4,
    year: 2019,
    genres: ["Horror", "Drama", "Fantasy"],
    reason: "Based on your interest in psychological thrillers",
    reasonDetails:
      "You've shown interest in atmospheric horror and psychological thrillers. This film's claustrophobic setting and exploration of madness aligns with your viewing patterns.",
    director: "Robert Eggers",
    cast: ["Robert Pattinson", "Willem Dafoe"],
    plot: "Two lighthouse keepers try to maintain their sanity while living on a remote and mysterious New England island in the 1890s.",
    trailerUrl: "https://www.youtube.com/embed/Hyag7lR8CPA",
  },
]

// Mock similar movies with real poster images
const mockSimilarMovies = [
  {
    id: "s1",
    title: "Arrival",
    poster: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    rating: 4.6,
    year: 2016,
    genres: ["Sci-Fi", "Drama", "Mystery"],
    similarTo: "Interstellar",
    director: "Denis Villeneuve",
    cast: ["Amy Adams", "Jeremy Renner", "Forest Whitaker"],
    plot: "A linguist is recruited by the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
    trailerUrl: "https://www.youtube.com/embed/tFMo3UJ4B4g",
  },
  {
    id: "s2",
    title: "Ex Machina",
    poster: "https://image.tmdb.org/t/p/w500/dmUbHR5BNBuKqJVxX5kBnGYt0wJ.jpg",
    rating: 4.5,
    year: 2014,
    genres: ["Sci-Fi", "Drama", "Thriller"],
    similarTo: "Blade Runner 2049",
    director: "Alex Garland",
    cast: ["Alicia Vikander", "Domhnall Gleeson", "Oscar Isaac"],
    plot: "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid A.I.",
    trailerUrl: "https://www.youtube.com/embed/bggUmgeMCdc",
  },
  {
    id: "s3",
    title: "Her",
    poster: "https://image.tmdb.org/t/p/w500/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg",
    rating: 4.4,
    year: 2013,
    genres: ["Sci-Fi", "Drama", "Romance"],
    similarTo: "Ex Machina",
    director: "Spike Jonze",
    cast: ["Joaquin Phoenix", "Scarlett Johansson", "Amy Adams"],
    plot: "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.",
    trailerUrl: "https://www.youtube.com/embed/WzV6mXIOVl4",
  },
  {
    id: "s4",
    title: "Annihilation",
    poster: "https://image.tmdb.org/t/p/w500/4YRplSk6BhH6PRuE9GUcX9xQHsI.jpg",
    rating: 4.3,
    year: 2018,
    genres: ["Sci-Fi", "Horror", "Mystery"],
    similarTo: "Arrival",
    director: "Alex Garland",
    cast: ["Natalie Portman", "Jennifer Jason Leigh", "Tessa Thompson"],
    plot: "A biologist signs up for a dangerous, secret expedition into a mysterious zone where the laws of nature don't apply.",
    trailerUrl: "https://www.youtube.com/embed/89OP78l9oF0",
  },
]

// Mock upcoming movies with real poster images
const mockUpcoming = [
  {
    id: "u1",
    title: "Dune: Part Two",
    poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    year: 2024,
    genres: ["Sci-Fi", "Adventure", "Drama"],
    releaseDate: "2024-03-01",
    anticipationScore: 98,
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
    plot: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
  },
  {
    id: "u2",
    title: "Furiosa: A Mad Max Saga",
    poster: "https://image.tmdb.org/t/p/w500/nRGrVMxrQJWAQvvAFLmy3ioVhUi.jpg",
    year: 2024,
    genres: ["Action", "Adventure", "Sci-Fi"],
    releaseDate: "2024-05-24",
    anticipationScore: 95,
    director: "George Miller",
    cast: ["Anya Taylor-Joy", "Chris Hemsworth", "Tom Burke"],
    plot: "The origin story of renegade warrior Furiosa before her encounter with Mad Max.",
    trailerUrl: "https://www.youtube.com/embed/XdvF8BQGSJg",
  },
  {
    id: "u3",
    title: "The Batman 2",
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg", // Using The Batman poster as placeholder
    year: 2025,
    genres: ["Action", "Crime", "Drama"],
    releaseDate: "2025-10-03",
    anticipationScore: 92,
    director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Jeffrey Wright"],
    plot: "The sequel to 2022's The Batman, continuing the story of Bruce Wayne's early years as the caped crusader.",
    trailerUrl: "https://www.youtube.com/embed/mqqft2x_Aa4", // Using The Batman trailer as placeholder
  },
  {
    id: "u4",
    title: "Gladiator II",
    poster: "https://image.tmdb.org/t/p/w500/nNNnOz05GP3z9yWBw1GiauXYfUB.jpg",
    year: 2024,
    genres: ["Action", "Drama", "History"],
    releaseDate: "2024-11-22",
    anticipationScore: 90,
    director: "Ridley Scott",
    cast: ["Paul Mescal", "Denzel Washington", "Pedro Pascal"],
    plot: "The sequel to the 2000 historical epic follows a new hero's journey in ancient Rome.",
    trailerUrl: "https://www.youtube.com/embed/eiSlBH_Qww0", // Teaser trailer
  },
]

// All genres for filtering
const allGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
  "History",
]

export default function RecommendationsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [recommendations, setRecommendations] = useState(mockRecommendations)
  const [similarMovies, setSimilarMovies] = useState(mockSimilarMovies)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [watchedMovies, setWatchedMovies] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleFeedback = (movieId: string, liked: boolean) => {
    // In a real app, this would send feedback to the recommendation algorithm
    toast({
      title: liked ? "Thanks for your feedback!" : "We'll show fewer like this",
      description: liked
        ? "We'll use this to improve your recommendations."
        : "Your feedback helps us understand your preferences better.",
    })

    // Remove the movie from recommendations
    setRecommendations(recommendations.filter((movie) => movie.id !== movieId))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const filteredRecommendations = recommendations.filter(
    (movie) => selectedGenres.length === 0 || movie.genres.some((genre) => selectedGenres.includes(genre)),
  )

  const filteredSimilarMovies = similarMovies.filter(
    (movie) => selectedGenres.length === 0 || movie.genres.some((genre) => selectedGenres.includes(genre)),
  )

  const filteredUpcoming = mockUpcoming.filter(
    (movie) => selectedGenres.length === 0 || movie.genres.some((genre) => selectedGenres.includes(genre)),
  )

  const toggleWatched = (movieId: string) => {
    setWatchedMovies((prev) => (prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]))

    toast({
      title: watchedMovies.includes(movieId) ? "Removed from watched" : "Marked as watched",
      description: watchedMovies.includes(movieId)
        ? "Movie removed from your watched list"
        : "Movie added to your watched list",
    })
  }

  const shareMovie = (movie: any) => {
    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(`Check out ${movie.title} (${movie.year}) - I found it on CineVerse!`)
    toast({
      title: "Link copied to clipboard",
      description: `Share link for "${movie.title}" has been copied to your clipboard.`,
    })
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">For You</h1>
        <p className="text-muted-foreground">Personalized movie recommendations based on your taste</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        <Button
          variant="outline"
          className="gap-2 bg-black/40 backdrop-blur-sm border-border/50"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          Filter by Genre
        </Button>

        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Zap className="h-4 w-4 text-neon-blue" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh Recommendations</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Eye className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Show all movies</DropdownMenuItem>
              <DropdownMenuItem>Hide watched movies</DropdownMenuItem>
              <DropdownMenuItem>Show only unwatched</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-black/40 backdrop-blur-sm border border-border/50 rounded-lg p-4"
        >
          <h3 className="font-medium mb-3">Filter by Genre</h3>
          <div className="flex flex-wrap gap-2">
            {allGenres.map((genre) => (
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

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList className="bg-black/40 backdrop-blur-sm border border-border/50">
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-neon-blue/20">
            <Sparkles className="h-4 w-4 mr-2" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="similar" className="data-[state=active]:bg-neon-blue/20">
            <Film className="h-4 w-4 mr-2" />
            Similar Movies
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-neon-blue/20">
            <Calendar className="h-4 w-4 mr-2" />
            Anticipated Releases
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-black/40 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-neon-blue" />
                  Personalized Recommendations
                </CardTitle>
                <CardDescription>
                  Movies selected just for you based on your watching history and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array(4)
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
                    {filteredRecommendations.length === 0 ? (
                      <div className="text-center py-12">
                        <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">No matching recommendations</h3>
                        <p className="text-muted-foreground mb-6">
                          {selectedGenres.length > 0
                            ? "Try adjusting your genre filters to see more recommendations."
                            : "You've gone through all our current recommendations. Check back later for more!"}
                        </p>
                        <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">Update Preferences</Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredRecommendations.map((movie) => (
                          <div key={movie.id} className="space-y-2">
                            <MovieCard
                              movie={movie}
                              badge={
                                <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-full bg-neon-blue/80 text-xs font-medium">
                                  {movie.reason}
                                </div>
                              }
                              actions={
                                <div className="flex justify-between mt-2">
                                  <div className="flex gap-1">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() => setSelectedMovie(movie)}
                                        >
                                          <Info className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[425px] bg-black/90 backdrop-blur-sm border-border/50">
                                        <DialogHeader>
                                          <DialogTitle>
                                            {movie.title} ({movie.year})
                                          </DialogTitle>
                                          <DialogDescription>
                                            <div className="flex gap-2 mt-2 flex-wrap">
                                              {movie.genres.map((genre) => (
                                                <Badge key={genre} variant="outline" className="bg-secondary/20">
                                                  {genre}
                                                </Badge>
                                              ))}
                                            </div>
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                          <div className="space-y-2">
                                            <h4 className="font-medium text-sm">Why we recommended this:</h4>
                                            <p className="text-sm text-muted-foreground">{movie.reasonDetails}</p>
                                          </div>
                                          <div className="space-y-2">
                                            <h4 className="font-medium text-sm">Director:</h4>
                                            <p className="text-sm text-muted-foreground">{movie.director}</p>
                                          </div>
                                          <div className="space-y-2">
                                            <h4 className="font-medium text-sm">Cast:</h4>
                                            <p className="text-sm text-muted-foreground">{movie.cast.join(", ")}</p>
                                          </div>
                                          <div className="space-y-2">
                                            <h4 className="font-medium text-sm">Plot:</h4>
                                            <p className="text-sm text-muted-foreground">{movie.plot}</p>
                                          </div>
                                        </div>
                                        <div className="flex justify-between">
                                          <Button variant="outline" onClick={() => toggleWatched(movie.id)}>
                                            {watchedMovies.includes(movie.id) ? "Unmark as Watched" : "Mark as Watched"}
                                          </Button>
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
                                                  <DialogClose asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                      <X className="h-4 w-4" />
                                                    </Button>
                                                  </DialogClose>
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
                                        </div>
                                      </DialogContent>
                                    </Dialog>

                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => shareMovie(movie)}
                                    >
                                      <Share2 className="h-4 w-4" />
                                    </Button>

                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className={`h-8 w-8 ${watchedMovies.includes(movie.id) ? "bg-green-500/20 text-green-500" : ""}`}
                                      onClick={() => toggleWatched(movie.id)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 bg-neon-blue/20 text-neon-blue border-neon-blue/50"
                                      >
                                        <Play className="h-3 w-3 mr-1" />
                                        Trailer
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[800px] bg-black/90 backdrop-blur-sm border-border/50">
                                      <DialogHeader>
                                        <div className="flex justify-between items-center">
                                          <DialogTitle>{movie.title} - Official Trailer</DialogTitle>
                                          <DialogClose asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </DialogClose>
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
                                </div>
                              }
                            />
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-1 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                                onClick={() => handleFeedback(movie.id, true)}
                              >
                                <ThumbsUp className="h-4 w-4" />
                                Like
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-1 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                onClick={() => handleFeedback(movie.id, false)}
                              >
                                <ThumbsDown className="h-4 w-4" />
                                Dislike
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-center border-t border-border/30 pt-4">
                <Button variant="outline" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Refresh Recommendations
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="similar" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-black/40 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5 text-neon-blue" />
                  Similar to Movies You Love
                </CardTitle>
                <CardDescription>
                  If you enjoyed these films, you might like these similar recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array(4)
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredSimilarMovies.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        badge={
                          <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-full bg-neon-magenta/80 text-xs font-medium">
                            Similar to {movie.similarTo}
                          </div>
                        }
                        actions={
                          <div className="flex justify-between mt-2">
                            <div className="flex gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="icon" className="h-8 w-8">
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] bg-black/90 backdrop-blur-sm border-border/50">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {movie.title} ({movie.year})
                                    </DialogTitle>
                                    <DialogDescription>
                                      <div className="flex gap-2 mt-2 flex-wrap">
                                        {movie.genres.map((genre) => (
                                          <Badge key={genre} variant="outline" className="bg-secondary/20">
                                            {genre}
                                          </Badge>
                                        ))}
                                      </div>
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                      <h4 className="font-medium text-sm">Similar to:</h4>
                                      <p className="text-sm text-muted-foreground">{movie.similarTo}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <h4 className="font-medium text-sm">Director:</h4>
                                      <p className="text-sm text-muted-foreground">{movie.director}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <h4 className="font-medium text-sm">Cast:</h4>
                                      <p className="text-sm text-muted-foreground">{movie.cast.join(", ")}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <h4 className="font-medium text-sm">Plot:</h4>
                                      <p className="text-sm text-muted-foreground">{movie.plot}</p>
                                    </div>
                                  </div>
                                  <div className="flex justify-between">
                                    <Button variant="outline" onClick={() => toggleWatched(movie.id)}>
                                      {watchedMovies.includes(movie.id) ? "Unmark as Watched" : "Mark as Watched"}
                                    </Button>
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
                                            <DialogClose asChild>
                                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <X className="h-4 w-4" />
                                              </Button>
                                            </DialogClose>
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
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => shareMovie(movie)}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="outline"
                                size="icon"
                                className={`h-8 w-8 ${watchedMovies.includes(movie.id) ? "bg-green-500/20 text-green-500" : ""}`}
                                onClick={() => toggleWatched(movie.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 bg-neon-magenta/20 text-neon-magenta border-neon-magenta/50"
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Trailer
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[800px] bg-black/90 backdrop-blur-sm border-border/50">
                                <DialogHeader>
                                  <div className="flex justify-between items-center">
                                    <DialogTitle>{movie.title} - Official Trailer</DialogTitle>
                                    <DialogClose asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </DialogClose>
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
                          </div>
                        }
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-black/40 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-neon-blue" />
                  Most Anticipated Upcoming Releases
                </CardTitle>
                <CardDescription>Upcoming movies that match your taste profile</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array(4)
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredUpcoming.map((movie) => (
                      <div key={movie.id} className="space-y-2">
                        <MovieCard
                          movie={movie}
                          badge={
                            <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-full bg-yellow-500/80 text-xs font-medium">
                              {formatDate(movie.releaseDate)}
                            </div>
                          }
                          actions={
                            <div className="flex justify-between mt-2">
                              <div className="flex gap-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px] bg-black/90 backdrop-blur-sm border-border/50">
                                    <DialogHeader>
                                      <DialogTitle>
                                        {movie.title} ({movie.year})
                                      </DialogTitle>
                                      <DialogDescription>
                                        <div className="flex gap-2 mt-2 flex-wrap">
                                          {movie.genres.map((genre) => (
                                            <Badge key={genre} variant="outline" className="bg-secondary/20">
                                              {genre}
                                            </Badge>
                                          ))}
                                        </div>
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="space-y-2">
                                        <h4 className="font-medium text-sm">Release Date:</h4>
                                        <p className="text-sm text-muted-foreground">{formatDate(movie.releaseDate)}</p>
                                      </div>
                                      <div className="space-y-2">
                                        <h4 className="font-medium text-sm">Director:</h4>
                                        <p className="text-sm text-muted-foreground">{movie.director}</p>
                                      </div>
                                      <div className="space-y-2">
                                        <h4 className="font-medium text-sm">Cast:</h4>
                                        <p className="text-sm text-muted-foreground">{movie.cast.join(", ")}</p>
                                      </div>
                                      <div className="space-y-2">
                                        <h4 className="font-medium text-sm">Plot:</h4>
                                        <p className="text-sm text-muted-foreground">{movie.plot}</p>
                                      </div>
                                    </div>
                                    <div className="flex justify-between">
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          toast({
                                            title: "Reminder Set",
                                            description: `We'll remind you when ${movie.title} is released.`,
                                          })
                                        }}
                                      >
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Set Reminder
                                      </Button>
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
                                              <DialogClose asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                  <X className="h-4 w-4" />
                                                </Button>
                                              </DialogClose>
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
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => shareMovie(movie)}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    Trailer
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[800px] bg-black/90 backdrop-blur-sm border-border/50">
                                  <DialogHeader>
                                    <div className="flex justify-between items-center">
                                      <DialogTitle>{movie.title} - Official Trailer</DialogTitle>
                                      <DialogClose asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </DialogClose>
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
                            </div>
                          }
                        />
                        <div className="bg-black/40 backdrop-blur-sm border border-border/50 rounded-md p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground">Anticipation Score</span>
                            <span className="text-xs font-medium">{movie.anticipationScore}%</span>
                          </div>
                          <div className="w-full bg-secondary/30 rounded-full h-1.5">
                            <div
                              className="bg-yellow-500 h-1.5 rounded-full"
                              style={{ width: `${movie.anticipationScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center border-t border-border/30 pt-4">
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  View Full Release Calendar
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

