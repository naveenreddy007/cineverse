"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Play, Plus, Settings, Film, Calendar, Clock, Bookmark, ImageOff } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

// Mock streaming services with real logos
const streamingServices = [
  {
    id: "netflix",
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",
    color: "#E50914",
    connected: true,
  },
  {
    id: "hbo",
    name: "HBO Max",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg",
    color: "#5822B4",
    connected: true,
  },
  {
    id: "disney",
    name: "Disney+",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
    color: "#0063E5",
    connected: false,
  },
  {
    id: "prime",
    name: "Amazon Prime",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",
    color: "#00A8E1",
    connected: true,
  },
  {
    id: "hulu",
    name: "Hulu",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg",
    color: "#1CE783",
    connected: false,
  },
  {
    id: "apple",
    name: "Apple TV+",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Apple_TV_Plus_logo.svg",
    color: "#000000",
    connected: false,
  },
]

// Mock streaming content with real posters
const mockContent = [
  {
    id: "c1",
    title: "Stranger Things",
    poster: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    type: "series",
    year: 2016,
    rating: 4.7,
    service: "netflix",
    newEpisode: true,
    continueWatching: {
      progress: 65,
      episode: "S4:E5",
      title: "The Nina Project",
    },
  },
  {
    id: "c2",
    title: "The Last of Us",
    poster: "https://image.tmdb.org/t/p/w500/uKvVjHNqB6AryqHYjk0vZl1fHE3.jpg",
    type: "series",
    year: 2023,
    rating: 4.8,
    service: "hbo",
    newEpisode: false,
    continueWatching: {
      progress: 40,
      episode: "S1:E3",
      title: "Long, Long Time",
    },
  },
  {
    id: "c3",
    title: "The Boys",
    poster: "https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg",
    type: "series",
    year: 2019,
    rating: 4.6,
    service: "prime",
    newEpisode: true,
    continueWatching: null,
  },
  {
    id: "c4",
    title: "Oppenheimer",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    type: "movie",
    year: 2023,
    rating: 4.8,
    service: "prime",
    newEpisode: false,
    continueWatching: {
      progress: 25,
      episode: null,
      title: null,
    },
  },
]

// Mock upcoming releases with real posters
const mockUpcoming = [
  {
    id: "u1",
    title: "Dune: Part Two",
    poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    type: "movie",
    releaseDate: "2024-03-01",
    service: "hbo",
  },
  {
    id: "u2",
    title: "House of the Dragon (Season 2)",
    poster: "https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg",
    type: "series",
    releaseDate: "2024-06-15",
    service: "hbo",
  },
  {
    id: "u3",
    title: "The Penguin",
    poster: "https://image.tmdb.org/t/p/w500/6OfuCcMnQdwu1mr4bmG1LswVMFR.jpg",
    type: "series",
    releaseDate: "2024-04-10",
    service: "hbo",
  },
]

export default function StreamingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [connectedServices, setConnectedServices] = useState(streamingServices.filter((service) => service.connected))
  const { toast } = useToast()
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleConnectService = (serviceId: string) => {
    // In a real app, this would open a dialog to connect the service
    toast({
      title: "Connect Service",
      description: "This would open the connection flow for the selected service.",
    })
  }

  const handleDisconnectService = (serviceId: string) => {
    setConnectedServices(connectedServices.filter((service) => service.id !== serviceId))
    toast({
      title: "Service Disconnected",
      description: "The streaming service has been disconnected from your account.",
    })
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

  const handleLogoError = (id: string) => {
    setLogoErrors((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Streaming</h1>
        <p className="text-muted-foreground">Manage your streaming services and discover what to watch next</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h2 className="text-xl font-semibold">Your Streaming Services</h2>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Manage Services
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {streamingServices.map((service) => (
          <Card
            key={service.id}
            className={`bg-black/40 backdrop-blur-sm border-border/50 ${service.connected ? "ring-1" : ""}`}
            style={{
              ringColor: service.connected ? `${service.color}40` : "transparent",
            }}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${service.color}20` }}
              >
                <div className="h-10 w-10 relative">
                  {logoErrors[service.id] ? (
                    <Avatar className="h-10 w-10">
                      <AvatarFallback style={{ backgroundColor: service.color }}>
                        {service.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Image
                      src={service.logo || "/placeholder.svg"}
                      alt={service.name}
                      fill
                      className="object-contain"
                      onError={() => handleLogoError(service.id)}
                      unoptimized
                    />
                  )}
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-medium">{service.name}</h3>
                {service.connected ? (
                  <Badge variant="outline" className="mt-1 bg-green-500/10 text-green-500 border-green-500/30">
                    Connected
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => handleConnectService(service.id)}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <Tabs defaultValue="continue" className="space-y-4">
        <TabsList className="bg-black/40 backdrop-blur-sm border border-border/50">
          <TabsTrigger value="continue" className="data-[state=active]:bg-neon-blue/20">
            <Clock className="h-4 w-4 mr-2" />
            Continue Watching
          </TabsTrigger>
          <TabsTrigger value="new" className="data-[state=active]:bg-neon-blue/20">
            <Film className="h-4 w-4 mr-2" />
            New Releases
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-neon-blue/20">
            <Calendar className="h-4 w-4 mr-2" />
            Coming Soon
          </TabsTrigger>
        </TabsList>

        <TabsContent value="continue" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(2)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="bg-black/40 backdrop-blur-sm border-border/50">
                    <CardContent className="p-0">
                      <div className="flex">
                        <Skeleton className="h-40 w-28 rounded-l-lg" />
                        <div className="p-4 flex-1 space-y-2">
                          <Skeleton className="h-6 w-4/5" />
                          <Skeleton className="h-4 w-3/5" />
                          <Skeleton className="h-4 w-full mt-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockContent
                .filter((content) => content.continueWatching)
                .map((content) => (
                  <Card key={content.id} className="bg-black/40 backdrop-blur-sm border-border/50 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative sm:w-28">
                          {imageErrors[content.id] ? (
                            <div className="h-full w-full flex items-center justify-center bg-black/60 sm:h-40">
                              <ImageOff className="h-8 w-8 text-muted-foreground" />
                            </div>
                          ) : (
                            <Image
                              src={content.poster || "/placeholder.svg"}
                              alt={content.title}
                              width={112}
                              height={160}
                              className="h-full w-full object-cover sm:h-40 sm:rounded-l-lg"
                              onError={() => handleImageError(content.id)}
                              unoptimized
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center">
                            <Button
                              size="icon"
                              className="h-10 w-10 rounded-full bg-neon-blue text-black hover:bg-neon-blue/80"
                            >
                              <Play className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{content.title}</h3>
                            <Badge
                              variant="outline"
                              className="text-xs"
                              style={{
                                backgroundColor: `${streamingServices.find((s) => s.id === content.service)?.color}20`,
                                color: streamingServices.find((s) => s.id === content.service)?.color,
                              }}
                            >
                              {streamingServices.find((s) => s.id === content.service)?.name}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-4">
                            <span>{content.type === "series" ? "Series" : "Movie"}</span>
                            <span className="mx-2">•</span>
                            <span>{content.year}</span>
                            {content.continueWatching?.episode && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{content.continueWatching.episode}</span>
                              </>
                            )}
                          </div>
                          {content.continueWatching?.title && (
                            <p className="text-sm mb-2">{content.continueWatching.title}</p>
                          )}
                          <div className="w-full bg-secondary/30 rounded-full h-1.5 mb-2">
                            <div
                              className="bg-neon-blue h-1.5 rounded-full"
                              style={{ width: `${content.continueWatching?.progress || 0}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{content.continueWatching?.progress || 0}% complete</span>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="bg-black/40 backdrop-blur-sm border-border/50">
                    <CardContent className="p-0">
                      <Skeleton className="w-full h-[200px] rounded-t-lg" />
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
              {mockContent.map((content) => (
                <Card key={content.id} className="bg-black/40 backdrop-blur-sm border-border/50 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      {imageErrors[`new-${content.id}`] ? (
                        <div className="w-full h-[200px] flex items-center justify-center bg-black/60">
                          <ImageOff className="h-12 w-12 text-muted-foreground" />
                        </div>
                      ) : (
                        <Image
                          src={content.poster || "/placeholder.svg"}
                          alt={content.title}
                          width={500}
                          height={750}
                          className="w-full h-[200px] object-cover"
                          onError={() => handleImageError(`new-${content.id}`)}
                          unoptimized
                        />
                      )}
                      {content.newEpisode && (
                        <Badge className="absolute top-2 right-2 bg-neon-magenta text-white">New</Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="absolute top-2 left-2 text-xs"
                        style={{
                          backgroundColor: `${streamingServices.find((s) => s.id === content.service)?.color}80`,
                          color: "white",
                        }}
                      >
                        {streamingServices.find((s) => s.id === content.service)?.name}
                      </Badge>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                        <div className="p-4 w-full">
                          <h3 className="font-semibold text-white mb-1">{content.title}</h3>
                          <div className="flex items-center justify-between text-sm text-white/80">
                            <div className="flex items-center gap-2">
                              <span>{content.type === "series" ? "Series" : "Movie"}</span>
                              <span>•</span>
                              <span>{content.year}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 rounded-full bg-black/50 text-white hover:text-neon-blue"
                              >
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                className="h-7 w-7 rounded-full bg-neon-blue text-black hover:bg-neon-blue/80"
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="bg-black/40 backdrop-blur-sm border-border/50">
                    <CardContent className="p-0">
                      <Skeleton className="w-full h-[200px] rounded-t-lg" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-6 w-4/5" />
                        <Skeleton className="h-4 w-3/5" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockUpcoming.map((content) => (
                <Card key={content.id} className="bg-black/40 backdrop-blur-sm border-border/50 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      {imageErrors[`upcoming-${content.id}`] ? (
                        <div className="w-full h-[200px] flex items-center justify-center bg-black/60">
                          <ImageOff className="h-12 w-12 text-muted-foreground" />
                        </div>
                      ) : (
                        <Image
                          src={content.poster || "/placeholder.svg"}
                          alt={content.title}
                          width={500}
                          height={750}
                          className="w-full h-[200px] object-cover"
                          onError={() => handleImageError(`upcoming-${content.id}`)}
                          unoptimized
                        />
                      )}
                      <Badge
                        variant="outline"
                        className="absolute top-2 left-2 text-xs"
                        style={{
                          backgroundColor: `${streamingServices.find((s) => s.id === content.service)?.color}80`,
                          color: "white",
                        }}
                      >
                        {streamingServices.find((s) => s.id === content.service)?.name}
                      </Badge>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                        <div className="p-4 w-full">
                          <h3 className="font-semibold text-white mb-1">{content.title}</h3>
                          <div className="flex items-center justify-between text-sm text-white/80">
                            <div className="flex items-center gap-2">
                              <span>{content.type === "series" ? "Series" : "Movie"}</span>
                              <span>•</span>
                              <span>Coming {formatDate(content.releaseDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <Button variant="ghost" size="sm" className="text-neon-blue">
                      <Calendar className="h-4 w-4 mr-2" />
                      Set Reminder
                    </Button>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Watchlist
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

