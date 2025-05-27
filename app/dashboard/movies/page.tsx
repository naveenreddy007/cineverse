"use client"

import { useState } from "react"
import { MobileLayout } from "@/components/mobile-layout"
import { MobileMovieGrid } from "@/components/mobile-movie-grid"
import { useDisableZoom } from "@/hooks/use-disable-zoom"

// Sample data
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
  {
    id: "6",
    title: "The Whale",
    poster: "https://image.tmdb.org/t/p/w500/jQ0gylJMxWSL490sy0RrPj1Lj7e.jpg",
    year: 2022,
    rating: 4.2,
    runtime: "1h 57m",
    genres: ["Drama"],
  },
  {
    id: "7",
    title: "Black Panther: Wakanda Forever",
    poster: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    year: 2022,
    rating: 4.0,
    runtime: "2h 41m",
    genres: ["Action", "Adventure", "Science Fiction"],
  },
  {
    id: "8",
    title: "The Menu",
    poster: "https://image.tmdb.org/t/p/w500/fPtUgMcLIboqlTlPrq0bQpKK8eq.jpg",
    year: 2022,
    rating: 4.1,
    runtime: "1h 47m",
    genres: ["Horror", "Thriller", "Comedy"],
  },
]

const categories = [
  { id: "action", name: "Action" },
  { id: "drama", name: "Drama" },
  { id: "scifi", name: "Sci-Fi" },
  { id: "comedy", name: "Comedy" },
  { id: "horror", name: "Horror" },
]

export default function MoviesPage() {
  const [favorites, setFavorites] = useState<string[]>(["1", "3"])
  useDisableZoom()

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <MobileLayout>
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-6">Movies</h1>

        <MobileMovieGrid
          title="Popular Movies"
          movies={featuredMovies}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        <MobileMovieGrid
          title="New Releases"
          movies={featuredMovies.slice().reverse()}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        <MobileMovieGrid
          title="Top Rated"
          movies={[...featuredMovies].sort((a, b) => b.rating - a.rating)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    </MobileLayout>
  )
}
