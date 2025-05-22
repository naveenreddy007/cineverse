"use client"
import { useMobile } from "@/hooks/use-mobile"
import { useDisableZoom } from "@/hooks/use-disable-zoom"
import { MobileLayout } from "@/components/mobile-layout"
import { MobileMovieGrid } from "@/components/mobile-movie-grid"

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
  const { isMobile } = useMobile()

  // Disable zoom for mobile
  useDisableZoom()

  // Handle toggle favorite
  const handleToggleFavorite = (id: string) => {
    console.log("Toggle favorite:", id)
    // Implement actual favorite toggling logic here
  }

  return (
    <MobileLayout>
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-6">Welcome to SidduVerse</h1>

        {/* Movie lists */}
        <MobileMovieGrid
          title="Continue Watching"
          movies={featuredMovies.slice(0, 4)}
          favorites={watchlist}
          onToggleFavorite={handleToggleFavorite}
        />

        <MobileMovieGrid
          title="Trending This Week"
          movies={featuredMovies}
          favorites={watchlist}
          onToggleFavorite={handleToggleFavorite}
        />

        <MobileMovieGrid
          title="New Releases"
          movies={featuredMovies.slice().reverse()}
          favorites={watchlist}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    </MobileLayout>
  )
}
