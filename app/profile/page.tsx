"use client"

import { useState } from "react"
import Image from "next/image"
import { MobileLayout } from "@/components/mobile-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MovieCardMobile } from "@/components/movie-card-mobile"
import { Settings, Edit, Film, Star, Clock, Calendar, Users, ChevronRight } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

// Sample user data
const userData = {
  id: "user1",
  name: "Siddu",
  username: "@siddu",
  bio: "Founder of SidduVerse. Film enthusiast and critic. I believe cinema is the most powerful art form that can change perspectives and inspire generations.",
  avatar: "/placeholder-ypk8u.png",
  coverImage: "https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
  stats: {
    reviews: 850,
    watchlist: 320,
    following: 128,
    followers: 1024,
  },
  favoriteGenres: ["Drama", "Sci-Fi", "Thriller"],
  recentActivity: [
    { type: "review", movie: "Oppenheimer", date: "2 days ago" },
    { type: "watchlist", movie: "Barbie", date: "1 week ago" },
    { type: "rating", movie: "Mission: Impossible", rating: 4.5, date: "2 weeks ago" },
  ],
}

// Sample movies for watchlist
const watchlistMovies = [
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
    title: "Barbie",
    poster: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi8Qzsk3Ql7wG.jpg",
    year: 2023,
    rating: 4.2,
    runtime: "1h 54m",
    genres: ["Comedy", "Adventure", "Fantasy"],
  },
  {
    id: "3",
    title: "Mission: Impossible - Dead Reckoning",
    poster: "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
    year: 2023,
    rating: 4.5,
    runtime: "2h 43m",
    genres: ["Action", "Adventure", "Thriller"],
  },
]

export default function ProfilePage() {
  const { isMobile } = useMobile()
  const [activeTab, setActiveTab] = useState("activity")
  const [favorites, setFavorites] = useState<string[]>(["1"])

  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((movieId) => movieId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  return (
    <MobileLayout>
      <div className="pb-16">
        {/* Cover image and profile info */}
        <div className="relative">
          <div className="h-32 w-full overflow-hidden">
            <Image src={userData.coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
          </div>

          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="relative h-24 w-24 rounded-full border-4 border-background overflow-hidden">
              <Image src={userData.avatar || "/placeholder.svg"} alt={userData.name} fill className="object-cover" />
            </div>
            <h1 className="mt-2 text-xl font-bold">{userData.name}</h1>
            <p className="text-sm text-muted-foreground">{userData.username}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 flex justify-around py-4 border-y">
          <div className="text-center">
            <div className="text-lg font-bold">{userData.stats.reviews}</div>
            <div className="text-xs text-muted-foreground">Reviews</div>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold">{userData.stats.watchlist}</div>
            <div className="text-xs text-muted-foreground">Watchlist</div>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold">{userData.stats.following}</div>
            <div className="text-xs text-muted-foreground">Following</div>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold">{userData.stats.followers}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
        </div>

        {/* Bio */}
        <div className="px-4 py-6">
          <p className="text-sm text-center">{userData.bio}</p>

          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </Button>

            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Settings className="h-3.5 w-3.5" />
              <span>Settings</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            {/* Recent activity */}
            <div className="space-y-4">
              {userData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    {activity.type === "review" && <Star className="h-4 w-4" />}
                    {activity.type === "watchlist" && <Film className="h-4 w-4" />}
                    {activity.type === "rating" && <Star className="h-4 w-4" />}
                  </div>

                  <div className="flex-1">
                    <div className="text-sm">
                      {activity.type === "review" && (
                        <span>
                          You reviewed <strong>{activity.movie}</strong>
                        </span>
                      )}
                      {activity.type === "watchlist" && (
                        <span>
                          You added <strong>{activity.movie}</strong> to your watchlist
                        </span>
                      )}
                      {activity.type === "rating" && (
                        <span>
                          You rated <strong>{activity.movie}</strong>{" "}
                          <span className="inline-flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-0.5" />
                            {activity.rating}
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{activity.date}</div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 border rounded-lg flex flex-col items-center">
                <Clock className="h-6 w-6 text-neon-blue mb-2" />
                <div className="text-lg font-bold">1,250+</div>
                <div className="text-xs text-muted-foreground text-center">Hours of movies watched</div>
              </div>

              <div className="p-4 border rounded-lg flex flex-col items-center">
                <Calendar className="h-6 w-6 text-neon-magenta mb-2" />
                <div className="text-lg font-bold">2+ years</div>
                <div className="text-xs text-muted-foreground text-center">Member since 2021</div>
              </div>

              <div className="p-4 border rounded-lg flex flex-col items-center">
                <Film className="h-6 w-6 text-green-500 mb-2" />
                <div className="text-lg font-bold">1,500+</div>
                <div className="text-xs text-muted-foreground text-center">Movies watched</div>
              </div>

              <div className="p-4 border rounded-lg flex flex-col items-center">
                <Users className="h-6 w-6 text-orange-500 mb-2" />
                <div className="text-lg font-bold">Top 5%</div>
                <div className="text-xs text-muted-foreground text-center">Most active users</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="watchlist">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                  isFavorite={favorites.includes(movie.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Your reviews will appear here</h3>
              <p className="text-sm text-muted-foreground mt-1">Start reviewing movies to see them here</p>
              <Button className="mt-4">Write a Review</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
