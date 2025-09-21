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
import { Users, Search, UserPlus, UserMinus, MessageSquare, Film, Star, ThumbsUp, Clock, Heart } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  username: string
  avatar: string
  bio: string
  following: boolean
  stats: {
    reviews: number
    followers: number
    following: number
  }
  commonInterests: string[]
  recentActivity: string
}

interface ActivityFeed {
  id: string
  type: "review" | "list" | "forum" | "watchlist"
  user: {
    name: string
    username: string
    avatar: string
  }
  content: any
  timestamp: string
  likes: number
  comments: number
}

interface MovieClub {
  id: string
  name: string
  description: string
  members: number
  avatar: string
  currentMovie: string
  nextMeeting: string
  joined: boolean
}

export default function CommunityPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [activityFeed, setActivityFeed] = useState<ActivityFeed[]>([])
  const [movieClubs, setMovieClubs] = useState<MovieClub[]>([])
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCommunityData()
  }, [])

  const fetchCommunityData = async () => {
    setIsLoading(true)
    try {
      // Fetch users with their stats
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select(`
          id,
          name,
          username,
          avatar_url,
          bio,
          created_at
        `)
        .limit(20)

      if (usersError) throw usersError

      // Fetch activity feed from reviews and forum posts
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          content,
          created_at,
          profiles!inner(name, username, avatar_url),
          movies!inner(title, poster_url)
        `)
        .order("created_at", { ascending: false })
        .limit(10)

      const { data: forumData } = await supabase
        .from("forum_posts")
        .select(`
          id,
          title,
          content,
          created_at,
          profiles!inner(name, username, avatar_url)
        `)
        .order("created_at", { ascending: false })
        .limit(10)

      // Fetch movie clubs
      const { data: clubsData } = await supabase
        .from("movie_clubs")
        .select(`
          id,
          name,
          description,
          avatar_url,
          current_movie,
          next_meeting,
          created_at
        `)
        .limit(10)

      // Transform data
      const transformedUsers =
        usersData?.map((user) => ({
          id: user.id,
          name: user.name || "Anonymous",
          username: user.username || `@user${user.id.slice(0, 8)}`,
          avatar: user.avatar_url || "/placeholder.svg?height=50&width=50",
          bio: user.bio || "Movie enthusiast",
          following: false, // Will be determined by checking user_followers table
          stats: {
            reviews: 0, // Will be calculated
            followers: 0, // Will be calculated
            following: 0, // Will be calculated
          },
          commonInterests: ["Movies", "Telugu Cinema"],
          recentActivity: "Recently joined",
        })) || []

      // Transform activity feed
      const transformedActivity: ActivityFeed[] = []

      reviewsData?.forEach((review) => {
        transformedActivity.push({
          id: review.id,
          type: "review",
          user: {
            name: review.profiles.name || "Anonymous",
            username: review.profiles.username || "@user",
            avatar: review.profiles.avatar_url || "/placeholder.svg?height=50&width=50",
          },
          content: {
            movie: review.movies.title,
            rating: review.rating,
            text: review.content,
          },
          timestamp: new Date(review.created_at).toLocaleDateString(),
          likes: 0,
          comments: 0,
        })
      })

      forumData?.forEach((post) => {
        transformedActivity.push({
          id: post.id,
          type: "forum",
          user: {
            name: post.profiles.name || "Anonymous",
            username: post.profiles.username || "@user",
            avatar: post.profiles.avatar_url || "/placeholder.svg?height=50&width=50",
          },
          content: {
            topic: post.title,
            text: post.content,
          },
          timestamp: new Date(post.created_at).toLocaleDateString(),
          likes: 0,
          comments: 0,
        })
      })

      // Transform movie clubs
      const transformedClubs =
        clubsData?.map((club) => ({
          id: club.id,
          name: club.name,
          description: club.description,
          members: 0, // Will be calculated from club_members
          avatar: club.avatar_url || "/placeholder.svg?height=80&width=80",
          currentMovie: club.current_movie || "No current movie",
          nextMeeting: club.next_meeting || "TBD",
          joined: false, // Will be determined by checking club_members table
        })) || []

      setUsers(transformedUsers)
      setActivityFeed(
        transformedActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      )
      setMovieClubs(transformedClubs)
    } catch (error) {
      console.error("Error fetching community data:", error)
      toast({
        title: "Error",
        description: "Failed to load community data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollowToggle = async (userId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to follow users.",
        variant: "destructive",
      })
      return
    }

    try {
      const userToFollow = users.find((u) => u.id === userId)
      if (!userToFollow) return

      if (userToFollow.following) {
        // Unfollow
        const { error } = await supabase
          .from("user_followers")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", userId)

        if (error) throw error

        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, following: false, stats: { ...u.stats, followers: u.stats.followers - 1 } } : u,
          ),
        )

        toast({
          title: "Unfollowed",
          description: `You are no longer following ${userToFollow.name}`,
        })
      } else {
        // Follow
        const { error } = await supabase.from("user_followers").insert({
          follower_id: user.id,
          following_id: userId,
          created_at: new Date().toISOString(),
        })

        if (error) throw error

        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, following: true, stats: { ...u.stats, followers: u.stats.followers + 1 } } : u,
          ),
        )

        toast({
          title: "Following",
          description: `You are now following ${userToFollow.name}`,
        })
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleJoinClub = async (clubId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join clubs.",
        variant: "destructive",
      })
      return
    }

    try {
      const club = movieClubs.find((c) => c.id === clubId)
      if (!club) return

      if (club.joined) {
        // Leave club
        const { error } = await supabase.from("club_members").delete().eq("user_id", user.id).eq("club_id", clubId)

        if (error) throw error

        setMovieClubs(movieClubs.map((c) => (c.id === clubId ? { ...c, joined: false, members: c.members - 1 } : c)))

        toast({
          title: "Left club",
          description: `You have left ${club.name}`,
        })
      } else {
        // Join club
        const { error } = await supabase.from("club_members").insert({
          user_id: user.id,
          club_id: clubId,
          joined_at: new Date().toISOString(),
        })

        if (error) throw error

        setMovieClubs(movieClubs.map((c) => (c.id === clubId ? { ...c, joined: true, members: c.members + 1 } : c)))

        toast({
          title: "Joined club",
          description: `Welcome to ${club.name}!`,
        })
      }
    } catch (error) {
      console.error("Error toggling club membership:", error)
      toast({
        title: "Error",
        description: "Failed to update club membership. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLike = async (activityId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts.",
        variant: "destructive",
      })
      return
    }

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from("activity_likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("activity_id", activityId)
        .single()

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from("activity_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("activity_id", activityId)

        if (error) throw error

        setActivityFeed(
          activityFeed.map((activity) =>
            activity.id === activityId ? { ...activity, likes: activity.likes - 1 } : activity,
          ),
        )
      } else {
        // Like
        const { error } = await supabase.from("activity_likes").insert({
          user_id: user.id,
          activity_id: activityId,
          created_at: new Date().toISOString(),
        })

        if (error) throw error

        setActivityFeed(
          activityFeed.map((activity) =>
            activity.id === activityId ? { ...activity, likes: activity.likes + 1 } : activity,
          ),
        )
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          {isLoading ? (
            Array(3)
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
          ) : activityFeed.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No activity yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to create some activity in the community!</p>
            </div>
          ) : (
            activityFeed.map((activity) => (
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
                        <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
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
                          {activity.type === "forum" && (
                            <>
                              <MessageSquare className="h-3 w-3 text-neon-magenta" />
                              <span>Posted in forum</span>
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
                    {activity.type === "forum" && (
                      <div className="space-y-2">
                        <h3 className="font-medium">{activity.content.topic}</h3>
                        <p className="text-sm text-muted-foreground">{activity.content.text}</p>
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
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
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
            ) : filteredUsers.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No users found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search query.</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
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
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
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
          </div>
        </TabsContent>

        <TabsContent value="clubs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading ? (
              Array(3)
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
            ) : movieClubs.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No movie clubs yet</h3>
                <p className="text-muted-foreground mb-6">Be the first to create a movie club!</p>
              </div>
            ) : (
              movieClubs.map((club) => (
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
                          <AvatarImage src={club.avatar || "/placeholder.svg"} alt={club.name} />
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
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
