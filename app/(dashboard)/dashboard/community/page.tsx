"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users,
  Search,
  UserPlus,
  UserMinus,
  MessageSquare,
  Film,
  Star,
  ThumbsUp,
  TrendingUp,
  Clock,
  Heart,
} from "lucide-react"

// Mock users data
const mockUsers = [
  {
    id: "u1",
    name: "Sarah Chen",
    username: "@sarahc",
    avatar: "/placeholder.svg?height=50&width=50",
    bio: "Film critic and sci-fi enthusiast. I live for complex narratives and mind-bending plots.",
    following: false,
    stats: {
      reviews: 87,
      followers: 342,
      following: 156,
    },
    commonInterests: ["Sci-Fi", "Thrillers", "Christopher Nolan"],
    recentActivity: "Reviewed Oppenheimer",
  },
  {
    id: "u2",
    name: "Michael Rodriguez",
    username: "@mrodriguez",
    avatar: "/placeholder.svg?height=50&width=50",
    bio: "Indie film lover and aspiring director. Always looking for hidden gems and underrated classics.",
    following: true,
    stats: {
      reviews: 124,
      followers: 567,
      following: 231,
    },
    commonInterests: ["Indie Films", "Drama", "A24"],
    recentActivity: "Created list: Top 10 A24 Films",
  },
  {
    id: "u3",
    name: "Emma Thompson",
    username: "@emmathompson",
    avatar: "/placeholder.svg?height=50&width=50",
    bio: "Documentary filmmaker with a passion for true stories. I believe in the power of cinema to change perspectives.",
    following: false,
    stats: {
      reviews: 56,
      followers: 289,
      following: 104,
    },
    commonInterests: ["Documentaries", "Historical Films", "Biopics"],
    recentActivity: "Commented on a forum post",
  },
  {
    id: "u4",
    name: "James Wilson",
    username: "@jwilson",
    avatar: "/placeholder.svg?height=50&width=50",
    bio: "Horror movie aficionado. I love being scared and analyzing the psychology behind fear in cinema.",
    following: true,
    stats: {
      reviews: 93,
      followers: 412,
      following: 187,
    },
    commonInterests: ["Horror", "Psychological Thrillers", "Jordan Peele"],
    recentActivity: "Added 3 movies to watchlist",
  },
]

// Mock activity feed
const mockActivityFeed = [
  {
    id: "a1",
    type: "review",
    user: {
      name: "Michael Rodriguez",
      username: "@mrodriguez",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    content: {
      movie: "Oppenheimer",
      rating: 4.5,
      text: "A masterpiece of filmmaking. Nolan has outdone himself with this historical epic that delves deep into the moral complexities of scientific advancement.",
    },
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
  },
  {
    id: "a2",
    type: "list",
    user: {
      name: "Emma Thompson",
      username: "@emmathompson",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    content: {
      title: "Top 10 Documentaries of 2023",
      description: "My personal selection of the most impactful documentaries released this year.",
      count: 10,
    },
    timestamp: "5 hours ago",
    likes: 18,
    comments: 3,
  },
  {
    id: "a3",
    type: "forum",
    user: {
      name: "James Wilson",
      username: "@jwilson",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    content: {
      topic: "The evolution of horror in the last decade",
      text: "Horror has transformed significantly in the 2010s, moving away from jump scares toward more psychological and social commentary. What are your thoughts on this shift?",
    },
    timestamp: "1 day ago",
    likes: 42,
    comments: 15,
  },
  {
    id: "a4",
    type: "watchlist",
    user: {
      name: "Sarah Chen",
      username: "@sarahc",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    content: {
      action: "added to watchlist",
      movies: ["Dune: Part Two", "The Batman 2", "Furiosa: A Mad Max Saga"],
    },
    timestamp: "2 days ago",
    likes: 7,
    comments: 2,
  },
]

// Mock movie clubs
const mockMovieClubs = [
  {
    id: "c1",
    name: "Sci-Fi Explorers",
    description: "Discussing the best of science fiction cinema, from classics to modern masterpieces.",
    members: 342,
    avatar: "/placeholder.svg?height=80&width=80",
    currentMovie: "Blade Runner 2049",
    nextMeeting: "Tomorrow at 8:00 PM",
    joined: true,
  },
  {
    id: "c2",
    name: "Horror Hounds",
    description: "For those who love to be scared. We analyze horror films from psychological to supernatural.",
    members: 256,
    avatar: "/placeholder.svg?height=80&width=80",
    currentMovie: "Hereditary",
    nextMeeting: "Friday at 9:00 PM",
    joined: false,
  },
  {
    id: "c3",
    name: "Criterion Collection",
    description: "Appreciating cinema classics and important films throughout history.",
    members: 189,
    avatar: "/placeholder.svg?height=80&width=80",
    currentMovie: "Seven Samurai",
    nextMeeting: "Saturday at 7:00 PM",
    joined: false,
  },
]

export default function CommunityPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState(mockUsers)
  const [activityFeed, setActivityFeed] = useState(mockActivityFeed)
  const [movieClubs, setMovieClubs] = useState(mockMovieClubs)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery) {
      const filtered = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.bio.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setUsers(filtered)
    } else {
      setUsers(mockUsers)
    }
  }, [searchQuery])

  const handleFollowToggle = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, following: !user.following } : user)))
  }

  const handleJoinClub = (clubId: string) => {
    setMovieClubs(
      movieClubs.map((club) =>
        club.id === clubId
          ? { ...club, joined: !club.joined, members: club.joined ? club.members - 1 : club.members + 1 }
          : club,
      ),
    )
  }

  const handleLike = (activityId: string) => {
    setActivityFeed(
      activityFeed.map((activity) =>
        activity.id === activityId ? { ...activity, likes: activity.likes + 1 } : activity,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Community</h1>
        <p className="text-muted-foreground">Connect with fellow movie enthusiasts and join the conversation</p>
      </motion.div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList className="bg-black/40 backdrop-blur-sm border border-border/50">
          <TabsTrigger value="activity" className="data-[state=active]:bg-neon-blue/20">
            <Clock className="h-4 w-4 mr-2" />
            Activity Feed
          </TabsTrigger>
          <TabsTrigger value="people" className="data-[state=active]:bg-neon-blue/20">
            <Users className="h-4 w-4 mr-2" />
            People to Follow
          </TabsTrigger>
          <TabsTrigger value="clubs" className="data-[state=active]:bg-neon-blue/20">
            <Film className="h-4 w-4 mr-2" />
            Movie Clubs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="bg-black/40 backdrop-blur-sm border-border/50">
                    <CardHeader className="flex flex-row items-start space-y-0">
                      <div className="flex gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-8 w-full" />
                    </CardFooter>
                  </Card>
                ))
            : activityFeed.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-black/40 backdrop-blur-sm border-border/50">
                    <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                          <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{activity.user.name}</span>
                            <span className="text-sm text-muted-foreground">{activity.user.username}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {activity.type === "review" && (
                              <>
                                <Star className="h-3 w-3 text-yellow-400" />
                                <span>Reviewed a movie</span>
                              </>
                            )}
                            {activity.type === "list" && (
                              <>
                                <TrendingUp className="h-3 w-3 text-neon-blue" />
                                <span>Created a list</span>
                              </>
                            )}
                            {activity.type === "forum" && (
                              <>
                                <MessageSquare className="h-3 w-3 text-neon-magenta" />
                                <span>Posted in forum</span>
                              </>
                            )}
                            {activity.type === "watchlist" && (
                              <>
                                <Film className="h-3 w-3 text-green-500" />
                                <span>Updated watchlist</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{activity.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {activity.type === "review" && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{activity.content.movie}</span>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(activity.content.rating)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : i === Math.floor(activity.content.rating) && activity.content.rating % 1 >= 0.5
                                        ? "text-yellow-400 fill-yellow-400/50"
                                        : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium">{activity.content.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.content.text}</p>
                        </div>
                      )}
                      {activity.type === "list" && (
                        <div className="space-y-2">
                          <h3 className="font-medium">{activity.content.title}</h3>
                          <p className="text-sm text-muted-foreground">{activity.content.description}</p>
                          <Badge variant="outline" className="bg-secondary/20">
                            {activity.content.count} movies
                          </Badge>
                        </div>
                      )}
                      {activity.type === "forum" && (
                        <div className="space-y-2">
                          <h3 className="font-medium">{activity.content.topic}</h3>
                          <p className="text-sm text-muted-foreground">{activity.content.text}</p>
                        </div>
                      )}
                      {activity.type === "watchlist" && (
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">{activity.content.action}</span>:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {activity.content.movies.map((movie, index) => (
                              <Badge key={index} variant="outline" className="bg-secondary/20">
                                {movie}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-border/30 pt-4">
                      <div className="flex gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-muted-foreground hover:text-neon-blue"
                          onClick={() => handleLike(activity.id)}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          {activity.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          {activity.comments}
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-neon-blue">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
        </TabsContent>

        <TabsContent value="people" className="space-y-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-black/40 backdrop-blur-sm border-border/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="bg-black/40 backdrop-blur-sm border-border/50">
                    <CardHeader className="flex flex-row items-start space-y-0">
                      <div className="flex gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))
            ) : (
              <>
                {users.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No users found</h3>
                    <p className="text-muted-foreground mb-6">Try adjusting your search query.</p>
                  </div>
                ) : (
                  users.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-black/40 backdrop-blur-sm border-border/50 h-full">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                          <div className="flex gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-sm text-muted-foreground">{user.username}</span>
                              </div>
                              <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  <span>{user.stats.reviews} reviews</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>{user.stats.followers} followers</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant={user.following ? "default" : "outline"}
                            size="sm"
                            className={user.following ? "bg-neon-blue text-black hover:bg-neon-blue/80" : ""}
                            onClick={() => handleFollowToggle(user.id)}
                          >
                            {user.following ? (
                              <>
                                <UserMinus className="h-4 w-4 mr-2" />
                                Following
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Follow
                              </>
                            )}
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm text-muted-foreground">{user.bio}</p>
                          <div>
                            <span className="text-xs text-muted-foreground">Common interests:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {user.commonInterests.map((interest, index) => (
                                <Badge key={index} variant="outline" className="bg-secondary/20 text-xs">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t border-border/30 pt-4">
                          <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
                            <span>Recent: {user.recentActivity}</span>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-neon-blue">
                              View Profile
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))
                )}
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="clubs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="bg-black/40 backdrop-blur-sm border-border/50">
                      <CardHeader className="flex flex-row items-start space-y-0">
                        <div className="flex gap-4">
                          <Skeleton className="h-16 w-16 rounded-md" />
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))
              : movieClubs.map((club) => (
                  <motion.div
                    key={club.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-black/40 backdrop-blur-sm border-border/50 h-full">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 rounded-md">
                            <AvatarImage src={club.avatar} alt={club.name} />
                            <AvatarFallback className="rounded-md">{club.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{club.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{club.members} members</span>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{club.description}</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Film className="h-4 w-4 text-neon-blue" />
                            <span className="text-sm">
                              Currently watching: <span className="font-medium">{club.currentMovie}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-neon-magenta" />
                            <span className="text-sm">
                              Next meeting: <span className="font-medium">{club.nextMeeting}</span>
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-border/30 pt-4">
                        <Button
                          className={`w-full ${
                            club.joined
                              ? "bg-secondary/20 hover:bg-secondary/30"
                              : "bg-neon-blue text-black hover:bg-neon-blue/80"
                          }`}
                          onClick={() => handleJoinClub(club.id)}
                        >
                          {club.joined ? (
                            <>
                              <Heart className="h-4 w-4 mr-2 fill-current" />
                              Joined
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Join Club
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

