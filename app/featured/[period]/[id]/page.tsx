"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Star,
  Play,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  Sparkles,
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Share2,
} from "lucide-react"

// Mock data for featured movies
const featuredMovies = {
  week: {
    id: "1",
    title: "Dune: Part Two",
    poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/oUmmY7QWWn7OhKlcxKwkrHKsggF.jpg",
    rating: 4.7,
    year: 2024,
    duration: "2h 46m",
    genres: ["Sci-Fi", "Adventure", "Action"],
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
    director: "Denis Villeneuve",
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides", avatar: "https://i.pravatar.cc/150?img=11" },
      { name: "Zendaya", role: "Chani", avatar: "https://i.pravatar.cc/150?img=5" },
      { name: "Rebecca Ferguson", role: "Lady Jessica", avatar: "https://i.pravatar.cc/150?img=1" },
      { name: "Josh Brolin", role: "Gurney Halleck", avatar: "https://i.pravatar.cc/150?img=8" },
    ],
    adminRecommendation:
      "Dune: Part Two expands on the visual splendor of its predecessor while delivering a more action-packed and emotionally resonant story. Denis Villeneuve has crafted a sci-fi epic that honors Frank Herbert's vision while making it accessible to modern audiences. The performances, particularly from Timothée Chalamet and Zendaya, bring depth to characters navigating complex political and spiritual landscapes. The film's sound design and score create an immersive experience that must be seen on the biggest screen possible.",
    adminName: "Christopher Nolan",
    adminRole: "Guest Curator",
    adminAvatar: "https://i.pravatar.cc/150?img=12",
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    relatedMovies: [
      { id: "101", title: "Dune (2021)", poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg" },
      {
        id: "102",
        title: "Blade Runner 2049",
        poster: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
      },
      {
        id: "103",
        title: "Arrival",
        poster: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
      },
    ],
  },
  month: {
    id: "2",
    title: "Oppenheimer",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    rating: 4.8,
    year: 2023,
    duration: "3h 0m",
    genres: ["Drama", "History", "Thriller"],
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the moral complexities and consequences of his work.",
    director: "Christopher Nolan",
    cast: [
      { name: "Cillian Murphy", role: "J. Robert Oppenheimer", avatar: "https://i.pravatar.cc/150?img=12" },
      { name: "Emily Blunt", role: "Katherine Oppenheimer", avatar: "https://i.pravatar.cc/150?img=5" },
      { name: "Matt Damon", role: "Leslie Groves", avatar: "https://i.pravatar.cc/150?img=8" },
      { name: "Robert Downey Jr.", role: "Lewis Strauss", avatar: "https://i.pravatar.cc/150?img=11" },
    ],
    adminRecommendation:
      "Oppenheimer is Christopher Nolan's most ambitious and morally complex film to date. Through stunning IMAX cinematography and a non-linear narrative structure, Nolan crafts a haunting portrait of the man who forever changed the course of human history. Cillian Murphy delivers a career-defining performance as the troubled physicist, conveying both brilliant intellect and profound moral anguish. The film's exploration of scientific achievement, political pressure, and ethical responsibility resonates deeply in our current era of technological advancement.",
    adminName: "Denis Villeneuve",
    adminRole: "Guest Curator",
    adminAvatar: "https://i.pravatar.cc/150?img=11",
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    relatedMovies: [
      { id: "201", title: "Dunkirk", poster: "https://image.tmdb.org/t/p/w500/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg" },
      { id: "202", title: "Interstellar", poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
      {
        id: "203",
        title: "The Imitation Game",
        poster: "https://image.tmdb.org/t/p/w500/zSqJ1qFq8NXFfi7JeIYMlzyR0dx.jpg",
      },
    ],
  },
  year: {
    id: "3",
    title: "Everything Everywhere All at Once",
    poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/nCJJzPQOhGQCTGqRoLuCc66Lglf.jpg",
    rating: 4.9,
    year: 2022,
    duration: "2h 19m",
    genres: ["Action", "Adventure", "Comedy"],
    description:
      "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.",
    director: "Daniel Kwan, Daniel Scheinert",
    cast: [
      { name: "Michelle Yeoh", role: "Evelyn Wang", avatar: "https://i.pravatar.cc/150?img=5" },
      { name: "Ke Huy Quan", role: "Waymond Wang", avatar: "https://i.pravatar.cc/150?img=12" },
      { name: "Stephanie Hsu", role: "Joy Wang", avatar: "https://i.pravatar.cc/150?img=1" },
      { name: "Jamie Lee Curtis", role: "Deirdre Beaubeirdre", avatar: "https://i.pravatar.cc/150?img=3" },
    ],
    adminRecommendation:
      "Everything Everywhere All at Once is a genre-defying masterpiece that blends science fiction, martial arts, absurdist comedy, and family drama into something truly original. The Daniels have created a multiverse story that uses its high-concept premise to explore deeply human themes of family, regret, and finding meaning in a chaotic world. Michelle Yeoh delivers a tour-de-force performance, showcasing both dramatic depth and comedic timing. The film's visual creativity and emotional resonance make it not just the year's best film, but one of the most innovative movies of the decade.",
    adminName: "Bong Joon-ho",
    adminRole: "Guest Curator",
    adminAvatar: "https://i.pravatar.cc/150?img=8",
    trailerUrl: "https://www.youtube.com/watch?v=wxN1T1uxQ2g",
    relatedMovies: [
      { id: "301", title: "The Matrix", poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg" },
      { id: "302", title: "Parasite", poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg" },
      {
        id: "303",
        title: "Swiss Army Man",
        poster: "https://image.tmdb.org/t/p/w500/oqRqGMANUqcltUBNi8ZYjQTKFCn.jpg",
      },
    ],
  },
}

export default function FeaturedMovieDetails({ params }: { params: { period: string; id: string } }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const { period, id } = params

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get the movie data based on the period
  const movie = featuredMovies[period as keyof typeof featuredMovies]

  if (!movie) {
    return <div>Movie not found</div>
  }

  const badgeVariants = {
    week: "bg-neon-blue text-black border-neon-blue",
    month: "bg-neon-magenta text-white border-neon-magenta",
    year: "bg-gradient-to-r from-neon-blue to-neon-magenta text-white border-white/20",
  }

  const iconVariants = {
    week: <TrendingUp className="h-4 w-4 mr-1" />,
    month: <Calendar className="h-4 w-4 mr-1" />,
    year: <Award className="h-4 w-4 mr-1" />,
  }

  const labelVariants = {
    week: "Week",
    month: "Month",
    year: "Year",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-black">
      {/* Hero Section with Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[70vh]">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <Image
            src={movie.backdrop || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-black/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden md:block w-48 h-72 rounded-lg overflow-hidden shadow-2xl border border-white/10"
              >
                <Image
                  src={movie.poster || "/placeholder.svg"}
                  alt={movie.title}
                  width={192}
                  height={288}
                  className="object-cover"
                />
              </motion.div>

              {/* Details */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={`${badgeVariants[period as keyof typeof badgeVariants]} px-3 py-1`}>
                      {iconVariants[period as keyof typeof iconVariants]}
                      Movie of the {labelVariants[period as keyof typeof labelVariants]}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-white font-medium">{movie.rating}</span>
                    </div>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{movie.title}</h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/70 mb-4">
                    <span>{movie.year}</span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {movie.duration}
                    </span>
                    <span>Dir: {movie.director}</span>
                    <div className="flex gap-2">
                      {movie.genres.map((genre) => (
                        <Badge key={genre} variant="outline" className="bg-white/10 border-white/20">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-white/80 mb-6 max-w-3xl">{movie.description}</p>

                  <div className="flex gap-3">
                    <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Now
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      className="border-neon-magenta/50 text-neon-magenta hover:bg-neon-magenta/10"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Add to Favorites
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto bg-black/40 backdrop-blur-sm mb-8">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="recommendation"
              className="data-[state=active]:bg-neon-magenta/20 data-[state=active]:text-neon-magenta"
            >
              Why Watch
            </TabsTrigger>
            <TabsTrigger
              value="cast"
              className="data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue"
            >
              Cast & Crew
            </TabsTrigger>
            <TabsTrigger
              value="related"
              className="data-[state=active]:bg-neon-magenta/20 data-[state=active]:text-neon-magenta"
            >
              Related Films
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-2">
                <div className="glass-card rounded-xl p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-4 gradient-text">About the Film</h2>
                  <p className="text-white/80 mb-4">{movie.description}</p>
                  <p className="text-white/80">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam
                    ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget
                    aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
                  </p>
                </div>

                <div className="glass-card rounded-xl p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-4 gradient-text">Trailer</h2>
                  <div className="aspect-video rounded-lg overflow-hidden bg-black/50">
                    <div className="w-full h-full flex items-center justify-center">
                      <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">
                        <Play className="h-4 w-4 mr-2" />
                        Watch Trailer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="glass-card rounded-xl p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4">Movie Details</h2>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm text-white/50">Release Date</dt>
                      <dd className="text-white">{movie.year}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-white/50">Director</dt>
                      <dd className="text-white">{movie.director}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-white/50">Runtime</dt>
                      <dd className="text-white">{movie.duration}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-white/50">Genres</dt>
                      <dd className="flex flex-wrap gap-2 mt-1">
                        {movie.genres.map((genre) => (
                          <Badge key={genre} variant="outline" className="bg-white/10 border-white/20">
                            {genre}
                          </Badge>
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-white/50">Rating</dt>
                      <dd className="flex items-center">
                        <div className="flex mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.floor(movie.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-white">{movie.rating}/5</span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendation" className="mt-0">
            <div className="glass-card rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <Avatar className="h-12 w-12 border-2 border-neon-magenta">
                  <AvatarImage src={movie.adminAvatar || "/placeholder.svg"} alt={movie.adminName} />
                  <AvatarFallback>{movie.adminName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">{movie.adminName}</h3>
                  <p className="text-sm text-white/70">{movie.adminRole}</p>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm border border-neon-magenta/30 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-neon-magenta/20 text-neon-magenta border-neon-magenta/50 px-3 py-1">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Why You Should Watch This
                  </Badge>
                </div>
                <p className="text-white/90 italic text-lg leading-relaxed mb-4">"{movie.adminRecommendation}"</p>
              </div>

              <div className="flex gap-4 justify-end">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discuss
                </Button>
                <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Now
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cast" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {movie.cast.map((person) => (
                <div key={person.name} className="glass-card rounded-xl p-4 text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-neon-blue/50">
                    <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                    <AvatarFallback>{person.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg">{person.name}</h3>
                  <p className="text-sm text-white/70">{person.role}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="related" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {movie.relatedMovies.map((relatedMovie) => (
                <Link href={`/movies/${relatedMovie.id}`} key={relatedMovie.id}>
                  <div className="glass-card rounded-xl overflow-hidden h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                    <div className="aspect-[2/3] relative">
                      <Image
                        src={relatedMovie.poster || "/placeholder.svg"}
                        alt={relatedMovie.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg">{relatedMovie.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
