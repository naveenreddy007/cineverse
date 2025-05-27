"use client"
import { useDisableZoom } from "@/hooks/use-disable-zoom"
import { MobileMovieGrid } from "@/components/mobile-movie-grid"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Film, Calendar, Star, Heart, MessageSquare, TrendingUp } from "lucide-react"

// Sample data for testing
const featuredMovies = [
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
    title: "Dune",
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    year: 2021,
    rating: 4.6,
    runtime: "2h 35m",
    genres: ["Science Fiction", "Adventure"],
  },
  {
    id: "3",
    title: "Everything Everywhere All at Once",
    poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    year: 2022,
    rating: 4.7,
    runtime: "2h 19m",
    genres: ["Action", "Adventure", "Science Fiction"],
  },
  {
    id: "4",
    title: "The Batman",
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    year: 2022,
    rating: 4.3,
    runtime: "2h 56m",
    genres: ["Crime", "Mystery", "Thriller"],
  },
  {
    id: "5",
    title: "Top Gun: Maverick",
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    year: 2022,
    rating: 4.5,
    runtime: "2h 11m",
    genres: ["Action", "Drama"],
  },
]

const watchlist = ["1", "3"] // Sample watchlist data

export default function DashboardPage() {
  // Disable zoom for mobile
  useDisableZoom()

  // Handle toggle favorite
  const handleToggleFavorite = (id: string) => {
    console.log("Toggle favorite:", id)
    // Implement actual favorite toggling logic here
  }

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold mb-6">Welcome to SidduVerse</h1>

      {/* Movie lists */}
      <MobileMovieGrid
        title="Continue Watching"
        movies={featuredMovies.slice(0, 4)}
        favorites={watchlist}
        onToggleFavorite={handleToggleFavorite}
        linkPrefix="/movies"
      />

      <MobileMovieGrid
        title="Trending This Week"
        movies={featuredMovies}
        favorites={watchlist}
        onToggleFavorite={handleToggleFavorite}
        linkPrefix="/movies"
      />

      <MobileMovieGrid
        title="New Releases"
        movies={featuredMovies.slice().reverse()}
        favorites={watchlist}
        onToggleFavorite={handleToggleFavorite}
        linkPrefix="/movies"
      />

      <div className="mt-8 mb-16">
        <h2 className="text-xl font-bold mb-4">Features</h2>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/dashboard/movies" className="block">
            <Card>
              <CardHeader className="pb-2">
                <Film className="h-6 w-6 text-primary mb-1" />
                <CardTitle className="text-base">Movies</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <CardDescription>Browse and discover movies</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/watchlist" className="block">
            <Card>
              <CardHeader className="pb-2">
                <Heart className="h-6 w-6 text-red-500 mb-1" />
                <CardTitle className="text-base">Watchlist</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <CardDescription>Movies you want to watch</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/reviews" className="block">
            <Card>
              <CardHeader className="pb-2">
                <Star className="h-6 w-6 text-yellow-500 mb-1" />
                <CardTitle className="text-base">Reviews</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <CardDescription>Rate and review movies</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/calendar" className="block">
            <Card>
              <CardHeader className="pb-2">
                <Calendar className="h-6 w-6 text-blue-500 mb-1" />
                <CardTitle className="text-base">Calendar</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <CardDescription>Upcoming movie releases</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/forum" className="block">
            <Card>
              <CardHeader className="pb-2">
                <MessageSquare className="h-6 w-6 text-green-500 mb-1" />
                <CardTitle className="text-base">Forum</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <CardDescription>Discuss movies with others</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/quiz" className="block">
            <Card>
              <CardHeader className="pb-2">
                <TrendingUp className="h-6 w-6 text-purple-500 mb-1" />
                <CardTitle className="text-base">Movie Quiz</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <CardDescription>Test your movie knowledge</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
