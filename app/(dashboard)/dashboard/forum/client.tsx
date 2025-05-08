"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageSquare, Plus, Search, TrendingUp, Clock, Eye, ThumbsUp, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { mockForumPosts } from "@/lib/mock-data"
import { useToast } from "@/components/ui/use-toast"

// Forum categories
const categories = ["All", "General", "Recommendations", "Reviews", "Discussions", "News", "Lists"]

interface ForumPost {
  id: string
  title: string
  content: string
  user: {
    name: string
    username: string
    avatar: string
  }
  category: string
  replies: number
  views: number
  likes: number
  isPinned: boolean
  isHot: boolean
  lastActivity: string
  lastReplyUser: {
    name: string
    avatar: string
  }
}

interface ForumClientProps {
  initialPosts?: ForumPost[]
}

export function ForumClient({ initialPosts = [] }: ForumClientProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts.length > 0 ? initialPosts : mockForumPosts)
  const { user } = useAuth()
  const { toast } = useToast()

  // FIX 1: Use a simpler loading effect with empty dependency array
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, []) // Empty dependency array - runs once on mount

  // FIX 2: Use useMemo for derived state instead of useEffect
  const filteredPosts = useMemo(() => {
    let results = posts

    if (searchQuery) {
      results = results.filter(
        (topic) =>
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== "All") {
      results = results.filter((topic) => topic.category === selectedCategory)
    }

    return results
  }, [posts, searchQuery, selectedCategory])

  // FIX 3: Use useMemo for user posts to avoid recalculation on every render
  const yourPosts = useMemo(() => {
    if (!user) return []

    return posts.filter((post) => post.user.username === "@demo")
  }, [posts, user])

  const handleCreatePost = async (title: string, content: string, category: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a post.",
        variant: "destructive",
      })
      return
    }

    try {
      // Create a new post with mock data
      const newPost = {
        id: `${posts.length + 1}`,
        title,
        content,
        user: {
          name: user.name || "Demo User",
          username: "@demo",
          avatar: user.avatar || "/placeholder.svg?height=50&width=50",
        },
        category,
        replies: 0,
        views: 0,
        likes: 0,
        isPinned: false,
        isHot: false,
        lastActivity: "Just now",
        lastReplyUser: {
          name: user.name || "Demo User",
          avatar: user.avatar || "/placeholder.svg?height=50&width=50",
        },
      }

      // Update state
      setPosts((prevPosts) => [newPost, ...prevPosts])

      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      })
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Community Forum</h1>
          <p className="text-muted-foreground">Join discussions with fellow movie enthusiasts</p>
        </div>
        <Button
          className="bg-neon-blue text-black hover:bg-neon-blue/80"
          onClick={() => {
            // This would open a dialog to create a new post
            // For simplicity, we'll just create a mock post
            handleCreatePost(
              "My thoughts on recent movie trends",
              "I've noticed that there's been a surge in nostalgic reboots lately. What do you all think about this trend?",
              "Discussions",
            )
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Topic
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-black/40 backdrop-blur-sm border-border/50"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className={`whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-neon-blue/20 text-neon-blue border-neon-blue/50"
                  : "bg-black/40 backdrop-blur-sm border-border/50"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </motion.div>

      <Tabs defaultValue="trending" className="space-y-4">
        <TabsList className="bg-black/40 backdrop-blur-sm border border-border/50">
          <TabsTrigger value="trending" className="data-[state=active]:bg-neon-blue/20">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="recent" className="data-[state=active]:bg-neon-blue/20">
            <Clock className="h-4 w-4 mr-2" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="your-posts" className="data-[state=active]:bg-neon-blue/20">
            <MessageSquare className="h-4 w-4 mr-2" />
            Your Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-4">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="bg-black/40 backdrop-blur-sm border-border/50">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-64" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-4 w-full" />
                  </CardFooter>
                </Card>
              ))
          ) : (
            <>
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No topics found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search or category filters.</p>
                  <Button
                    className="bg-neon-blue text-black hover:bg-neon-blue/80"
                    onClick={() => {
                      handleCreatePost(
                        "My thoughts on recent movie trends",
                        "I've noticed that there's been a surge in nostalgic reboots lately. What do you all think about this trend?",
                        "Discussions",
                      )
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Topic
                  </Button>
                </div>
              ) : (
                filteredPosts
                  .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.replies - a.replies)
                  .map((topic) => (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link href={`/dashboard/forum/topics/${topic.id}`}>
                        <Card className="bg-black/40 backdrop-blur-sm border-border/50 hover:bg-black/60 transition-colors">
                          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                              <CardTitle className="flex items-center gap-2">
                                {topic.title}
                                {topic.isPinned && (
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                                  >
                                    Pinned
                                  </Badge>
                                )}
                                {topic.isHot && (
                                  <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/30">
                                    Hot
                                  </Badge>
                                )}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={topic.user.avatar} alt={topic.user.name} />
                                  <AvatarFallback>{topic.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <span>{topic.user.name}</span>
                                <span>•</span>
                                <Badge variant="outline" className="bg-secondary/20 text-xs">
                                  {topic.category}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{topic.replies}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{topic.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{topic.likes}</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2">{topic.content}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between border-t border-border/30 pt-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span>Last reply by</span>
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={topic.lastReplyUser.avatar} alt={topic.lastReplyUser.name} />
                                <AvatarFallback>{topic.lastReplyUser.name[0]}</AvatarFallback>
                              </Avatar>
                              <span>{topic.lastReplyUser.name}</span>
                            </div>
                            <span>{topic.lastActivity}</span>
                          </CardFooter>
                        </Card>
                      </Link>
                    </motion.div>
                  ))
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="bg-black/40 backdrop-blur-sm border-border/50">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-64" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-4 w-full" />
                    </CardFooter>
                  </Card>
                ))
            : // Sort by most recent activity
              [...filteredPosts]
                .sort((a, b) => {
                  // This is a simple sort based on the "X ago" strings
                  // In a real app, you'd sort by actual timestamps
                  return a.lastActivity.localeCompare(b.lastActivity)
                })
                .map((topic) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/dashboard/forum/topics/${topic.id}`}>
                      <Card className="bg-black/40 backdrop-blur-sm border-border/50 hover:bg-black/60 transition-colors">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                          <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                              {topic.title}
                              {topic.isPinned && (
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                                >
                                  Pinned
                                </Badge>
                              )}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={topic.user.avatar} alt={topic.user.name} />
                                <AvatarFallback>{topic.user.name[0]}</AvatarFallback>
                              </Avatar>
                              <span>{topic.user.name}</span>
                              <span>•</span>
                              <Badge variant="outline" className="bg-secondary/20 text-xs">
                                {topic.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{topic.replies}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{topic.views}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">{topic.content}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-border/30 pt-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span>Last reply by</span>
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={topic.lastReplyUser.avatar} alt={topic.lastReplyUser.name} />
                              <AvatarFallback>{topic.lastReplyUser.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{topic.lastReplyUser.name}</span>
                          </div>
                          <span>{topic.lastActivity}</span>
                        </CardFooter>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
        </TabsContent>

        <TabsContent value="your-posts" className="space-y-4">
          {isLoading ? (
            Array(2)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="bg-black/40 backdrop-blur-sm border-border/50">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-64" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-4 w-full" />
                  </CardFooter>
                </Card>
              ))
          ) : (
            <>
              {yourPosts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">You haven't created any topics yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start a discussion or ask a question to engage with the community.
                  </p>
                  <Button
                    className="bg-neon-blue text-black hover:bg-neon-blue/80"
                    onClick={() => {
                      handleCreatePost(
                        "My first post in the community",
                        "Hello everyone! I'm new here and excited to discuss movies with all of you.",
                        "General",
                      )
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Topic
                  </Button>
                </div>
              ) : (
                yourPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/dashboard/forum/topics/${post.id}`}>
                      <Card className="bg-black/40 backdrop-blur-sm border-border/50 hover:bg-black/60 transition-colors">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                          <div className="space-y-1">
                            <CardTitle>{post.title}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="bg-secondary/20 text-xs">
                                {post.category}
                              </Badge>
                              <span>•</span>
                              <span>Created by you</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.replies}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-border/30 pt-4 text-xs text-muted-foreground">
                          <span>Last activity: {post.lastActivity}</span>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-neon-blue">
                            Edit Topic
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  </motion.div>
                ))
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

