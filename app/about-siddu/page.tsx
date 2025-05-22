import { Badge } from "@/components/ui/badge"
import type { Metadata } from "next"
import { FounderProfile } from "@/components/founder-profile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Film, Star, ThumbsUp, Clock, BookOpen } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About Siddu | SidduVerse",
  description: "Learn about Siddu, the founder and curator of SidduVerse",
}

export default function AboutSidduPage() {
  // Favorite films data
  const favoriteFilms = [
    {
      title: "The Godfather",
      year: 1972,
      director: "Francis Ford Coppola",
      image: "/placeholder.svg?height=150&width=100&query=The Godfather poster",
      comment: "The perfect blend of art and entertainment. A masterclass in filmmaking.",
    },
    {
      title: "2001: A Space Odyssey",
      year: 1968,
      director: "Stanley Kubrick",
      image: "/placeholder.svg?height=150&width=100&query=2001 A Space Odyssey poster",
      comment: "Visually stunning and philosophically profound. Cinema at its most ambitious.",
    },
    {
      title: "In the Mood for Love",
      year: 2000,
      director: "Wong Kar-wai",
      image: "/placeholder.svg?height=150&width=100&query=In the Mood for Love poster",
      comment: "Achingly beautiful. The definition of cinematic poetry.",
    },
  ]

  // Career highlights
  const careerHighlights = [
    {
      year: "2008",
      title: "Film School Graduate",
      description: "Graduated with honors from the prestigious Film Institute with a focus on directing and criticism.",
    },
    {
      year: "2010-2015",
      title: "Independent Filmmaker",
      description: "Directed three short films that were featured in international film festivals.",
    },
    {
      year: "2015-2018",
      title: "Film Critic",
      description: "Contributed reviews to major publications and built a following on YouTube.",
    },
    {
      year: "2019",
      title: "Award Winner",
      description: "Received the Emerging Critic Award from the Film Critics Association.",
    },
    {
      year: "2020",
      title: "SidduVerse Launch",
      description: "Founded SidduVerse to create a community for passionate film lovers.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 gradient-text">About Siddu</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <FounderProfile />

          <Tabs defaultValue="story" className="mt-6">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="story">Story</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
            </TabsList>

            <TabsContent value="story" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>The SidduVerse Story</CardTitle>
                  <CardDescription>How a passion for cinema became a community</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Siddu's journey into the world of cinema began at the age of seven when his father took him to see a
                    classic film on the big screen. That experience ignited a lifelong passion that would eventually
                    lead to the creation of SidduVerse.
                  </p>
                  <p>
                    After studying film and working in the industry for several years, Siddu became frustrated with the
                    lack of platforms that truly celebrated cinema as an art form while remaining accessible to casual
                    viewers. He envisioned a space where film enthusiasts could discover new movies, engage in
                    meaningful discussions, and share their perspectives.
                  </p>
                  <p>
                    "I wanted to create something that bridges the gap between serious film criticism and the joy of
                    movie watching," Siddu explains. "Film is both an art form and entertainment, and I believe the best
                    conversations happen when we appreciate both aspects."
                  </p>
                  <p>
                    SidduVerse was born from this vision—a platform that combines curated recommendations, community
                    discussions, and thoughtful analysis. What started as a personal blog has evolved into a vibrant
                    community of film lovers from around the world.
                  </p>
                  <p>
                    Today, Siddu continues to be actively involved in every aspect of SidduVerse, from curating the
                    weekly featured films to participating in community discussions. His mission remains the same: to
                    share his love of cinema and create a space where every film lover feels at home.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Siddu's Favorite Films</CardTitle>
                  <CardDescription>A glimpse into the films that shaped his perspective</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {favoriteFilms.map((film, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 relative w-[100px] h-[150px] rounded-md overflow-hidden">
                          <Image
                            src={film.image || "/placeholder.svg"}
                            alt={film.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{film.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {film.year} • Directed by {film.director}
                          </p>
                          <div className="flex items-center mt-1 mb-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          </div>
                          <p className="text-sm italic">"{film.comment}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="career" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Career Highlights</CardTitle>
                  <CardDescription>Siddu's journey in film and criticism</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l border-border pl-6 space-y-6 py-2">
                    {careerHighlights.map((highlight, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-[31px] h-6 w-6 rounded-full bg-neon-blue/20 border border-neon-blue flex items-center justify-center">
                          {index === 0 ? (
                            <BookOpen className="h-3 w-3 text-neon-blue" />
                          ) : index === careerHighlights.length - 1 ? (
                            <Award className="h-3 w-3 text-neon-blue" />
                          ) : (
                            <Film className="h-3 w-3 text-neon-blue" />
                          )}
                        </div>
                        <div className="text-sm font-medium text-neon-blue mb-1">{highlight.year}</div>
                        <h3 className="font-bold">{highlight.title}</h3>
                        <p className="text-sm text-muted-foreground">{highlight.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Siddu's Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Film className="h-5 w-5 mr-2 text-neon-blue" />
                    <span>Films Watched</span>
                  </div>
                  <span className="font-bold">2,547</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-400" />
                    <span>Reviews Written</span>
                  </div>
                  <span className="font-bold">512</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ThumbsUp className="h-5 w-5 mr-2 text-green-500" />
                    <span>Recommendations</span>
                  </div>
                  <span className="font-bold">1,324</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-neon-magenta" />
                    <span>Hours of Cinema</span>
                  </div>
                  <span className="font-bold">5,280+</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Film History</span>
                    <span className="text-sm">Expert</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-neon-blue w-[95%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Film Theory</span>
                    <span className="text-sm">Advanced</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-neon-blue w-[85%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Directing</span>
                    <span className="text-sm">Intermediate</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-neon-blue w-[70%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Screenwriting</span>
                    <span className="text-sm">Advanced</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-neon-blue w-[80%]"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Favorite Genres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Drama", "Sci-Fi", "Noir", "Thriller", "World Cinema", "Documentary", "Indie"].map((genre) => (
                  <Badge key={genre} variant="secondary" className="bg-neon-blue/10">
                    {genre}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
