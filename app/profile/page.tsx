"use client"

import { useState } from "react"
import Image from "next/image"
import { MobileLayout } from "@/components/mobile-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useDisableZoom } from "@/hooks/use-disable-zoom"
import { Camera, Edit, LogOut, Settings, Star, Film, Heart, Calendar } from "lucide-react"
import { MovieCardMobile } from "@/components/movie-card-mobile"

// Sample user data
const userData = {
  name: "Siddu",
  username: "sidduverse",
  bio: "Founder & Cinephile. Passionate about storytelling through cinema.",
  avatar: "/placeholder-ypk8u.png",
  stats: {
    movies: 1500,
    series: 200,
    reviews: 850,
    followers: 1240,
    following: 350,
  },
}

// Sample movies for different tabs
const favoriteMovies = [
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
]

const watchedMovies = [
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
]

const watchlistMovies = [
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
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("watched")
  useDisableZoom()

  return (
    <MobileLayout>
      {/* Profile header */}
      <div className="relative">
        {/* Cover photo */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <Button
            size="icon"
            variant="ghost"
            className="absolute bottom-2 right-2 bg-black/20 backdrop-blur-sm text-white"
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">Change cover photo</span>
          </Button>
        </div>

        {/* Avatar */}
        <div className="absolute bottom-0 left-4 transform translate-y-1/2">
          <div className="relative h-24 w-24 rounded-full border-4 border-background overflow-hidden">
            <Image src={userData.avatar || "/placeholder.svg"} alt="Profile picture" fill className="object-cover" />
            <Button size="icon" variant="ghost" className="absolute bottom-0 right-0 h-8 w-8 bg-black/60 text-white">
              <Camera className="h-4 w-4" />
              <span className="sr-only">Change profile picture</span>
            </Button>
          </div>
        </div>

        {/* Edit profile button */}
        <div className="flex justify-end p-4">
          <Button size="sm" variant="outline" className="gap-1">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile info */}
      <div className="mt-14 px-4">
        <h1 className="text-xl font-bold">{userData.name}</h1>
        <p className="text-sm text-muted-foreground">@{userData.username}</p>
        <p className="mt-2 text-sm">{userData.bio}</p>

        {/* Stats */}
        <div className="flex justify-between mt-4 text-sm">
          <div className="text-center">
            <div className="font-bold">{userData.stats.movies.toLocaleString()}+</div>
            <div className="text-xs text-muted-foreground">Movies</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{userData.stats.series.toLocaleString()}+</div>
            <div className="text-xs text-muted-foreground">Series</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{userData.stats.reviews.toLocaleString()}+</div>
            <div className="text-xs text-muted-foreground">Reviews</div>
          </div>
        </div>

        <div className="flex justify-between mt-2 text-sm">
          <div className="text-center">
            <div className="font-bold">{userData.stats.followers.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{userData.stats.following.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Following</div>
          </div>
        </div>
      </div>

      {/* Content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="watched" className="flex flex-col items-center gap-1 p-2 h-auto">
            <Film className="h-4 w-4" />
            <span className="text-xs">Watched</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex flex-col items-center gap-1 p-2 h-auto">
            <Heart className="h-4 w-4" />
            <span className="text-xs">Favorites</span>
          </TabsTrigger>
          <TabsTrigger value="watchlist" className="flex flex-col items-center gap-1 p-2 h-auto">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Watchlist</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex flex-col items-center gap-1 p-2 h-auto">
            <Star className="h-4 w-4" />
            <span className="text-xs">Reviews</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="watched">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {watchedMovies.map((movie) => (
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

        <TabsContent value="favorites">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {favoriteMovies.map((movie) => (
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

        <TabsContent value="watchlist">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {watchlistMovies.map((movie) => (
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

        <TabsContent value="reviews">
          <div className="space-y-4">
            {favoriteMovies.map((movie) => (
              <div key={movie.id} className="flex gap-3 p-3 rounded-lg bg-muted/20">
                <div className="relative h-16 w-12 rounded overflow-hidden flex-shrink-0">
                  <Image src={movie.poster || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{movie.title}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs">{movie.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                    "This is an incredible film that pushes the boundaries of cinematography. The performances are
                    outstanding and the story is captivating from start to finish."
                  </p>
                  <div className="text-xs text-muted-foreground mt-1">
                    Reviewed on {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Account actions */}
      <div className="mt-8 space-y-2 pb-20">
        <Button variant="outline" className="w-full justify-start gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-100/10"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>
    </MobileLayout>
  )
}
