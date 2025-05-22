"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, ThumbsUp, MessageSquare, Share2, Flag, Bookmark, MoreHorizontal, Send } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileAppBar } from "@/components/mobile-app-bar"

// Utility function for haptic feedback
const hapticFeedback = (pattern: number | number[]) => {
  // Check if the device supports vibration
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}

// Haptic feedback patterns
const HAPTIC_PATTERNS = {
  success: [15, 100, 30], // Strong success feedback (like, bookmark)
  light: 10, // Light feedback (button press)
  medium: 25, // Medium feedback (navigation)
  error: [10, 50, 50, 50, 10], // Error pattern
  submit: [15, 50, 100], // Form submission
}

// Mock forum topic data
const mockTopic = {
  id: "1",
  title: "Best sci-fi movies of the decade?",
  content:
    "I've been on a sci-fi binge lately and wanted to get some recommendations for the best sci-fi films of the last decade. What are your top picks and why? I've already watched Arrival, Interstellar, and Blade Runner 2049, which were all amazing. Looking for hidden gems or anything I might have missed!",
  user: {
    id: "u1",
    name: "Alex Johnson",
    username: "@alexj",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  category: "Recommendations",
  replies: 24,
  views: 156,
  likes: 42,
  isPinned: true,
  isHot: true,
  createdAt: "2023-09-15T14:30:00Z",
  lastActivity: "3 hours ago",
  lastReplyUser: {
    name: "Sarah Chen",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
}

// Mock comments data
const mockComments = [
  {
    id: "c1",
    topicId: "1",
    user: {
      id: "u2",
      name: "Sarah Chen",
      username: "@sarahc",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    content:
      "Definitely check out 'Ex Machina' if you haven't already. It's a thought-provoking film about AI with amazing performances and a haunting atmosphere. Alex Garland's direction is superb.",
    createdAt: "2023-09-15T16:45:00Z",
    likes: 18,
    isEdited: false,
  },
  {
    id: "c2",
    topicId: "1",
    user: {
      id: "u3",
      name: "Michael Rodriguez",
      username: "@mrodriguez",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    content:
      "I'd recommend 'Annihilation' (also by Alex Garland). It's visually stunning and has some of the most unsettling and beautiful sci-fi imagery I've seen.",
    createdAt: "2023-09-15T17:30:00Z",
    likes: 12,
    isEdited: true,
  },
  {
    id: "c3",
    topicId: "1",
    user: {
      id: "u4",
      name: "Emma Thompson",
      username: "@emmathompson",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    content:
      "'Arrival' is my absolute favorite sci-fi film of the decade. The way it handles language, time, and human connection is beautiful.",
    createdAt: "2023-09-15T18:15:00Z",
    likes: 24,
    isEdited: false,
  },
]

// Mock related topics
const mockRelatedTopics = [
  {
    id: "2",
    title: "Unpopular opinion: The Godfather is overrated",
    replies: 87,
    views: 421,
    lastActivity: "1 day ago",
  },
  {
    id: "3",
    title: "What's your comfort movie?",
    replies: 42,
    views: 189,
    lastActivity: "2 days ago",
  },
]

export default function TopicDetailPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.id as string
  const [topic, setTopic] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [relatedTopics, setRelatedTopics] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const isMobile = useIsMobile()

  useEffect(() => {
    // Simulate API call to fetch topic details
    const fetchTopic = async () => {
      setIsLoading(true)
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // In a real app, we would fetch from an API
        // For now, use mock data
        if (topicId === "1") {
          setTopic(mockTopic)
          setComments(mockComments)
          setRelatedTopics(mockRelatedTopics)
        } else {
          // If topic not found, we would redirect
          router.push("/dashboard/forum")
        }
      } catch (error) {
        console.error("Error fetching topic:", error)
        toast({
          title: "Error",
          description: "Failed to load topic details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopic()
  }, [topicId, router, toast])

  const handleLikeTopic = () => {
    // Strong haptic feedback when liking
    hapticFeedback(HAPTIC_PATTERNS.success)

    setIsLiked(!isLiked)
    if (isLiked) {
      setTopic({ ...topic, likes: topic.likes - 1 })
    } else {
      setTopic({ ...topic, likes: topic.likes + 1 })
    }
  }

  const handleBookmarkTopic = () => {
    // Strong haptic feedback when bookmarking
    hapticFeedback(HAPTIC_PATTERNS.success)

    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked
        ? "Topic has been removed from your bookmarks"
        : "Topic has been added to your bookmarks",
    })
  }

  const handleShareTopic = () => {
    if (!topic) return

    // Medium haptic feedback when sharing
    hapticFeedback(HAPTIC_PATTERNS.medium)

    navigator.clipboard.writeText(`Check out this discussion: ${topic.title} - CineVerse Forum`)
    toast({
      title: "Link copied to clipboard",
      description: "Share link has been copied to your clipboard.",
    })
  }

  const handleReportTopic = () => {
    // Error haptic feedback when reporting
    hapticFeedback(HAPTIC_PATTERNS.error)

    toast({
      title: "Topic reported",
      description: "Thank you for your report. Our moderators will review this topic.",
    })
  }

  const handleLikeComment = (commentId: string) => {
    // Success haptic feedback when liking a comment
    hapticFeedback(HAPTIC_PATTERNS.success)

    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          }
        }
        return comment
      }),
    )
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentText.trim()) {
      // Error haptic feedback for empty submission
      hapticFeedback(HAPTIC_PATTERNS.error)

      toast({
        title: "Comment cannot be empty",
        description: "Please enter a comment before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create new comment
      const newComment = {
        id: `c${comments.length + 1}`,
        topicId,
        user: {
          id: user?.id || "demo-user-id",
          name: user?.name || "Demo User",
          username: "@demo",
          avatar: user?.avatar || "https://i.pravatar.cc/150?img=7",
        },
        content: commentText,
        createdAt: new Date().toISOString(),
        likes: 0,
        isEdited: false,
        isLiked: false,
      }

      // Add to comments
      setComments([...comments, newComment])

      // Update topic
      setTopic({
        ...topic,
        replies: topic.replies + 1,
        lastActivity: "Just now",
        lastReplyUser: {
          name: user?.name || "Demo User",
          avatar: user?.avatar || "https://i.pravatar.cc/150?img=7",
        },
      })

      // Clear input
      setCommentText("")

      // Success haptic feedback for successful submission
      hapticFeedback(HAPTIC_PATTERNS.submit)

      toast({
        title: "Comment posted",
        description: "Your comment has been added to the discussion.",
      })
    } catch (error) {
      console.error("Error posting comment:", error)

      // Error haptic feedback
      hapticFeedback(HAPTIC_PATTERNS.error)

      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)

    // Use a more compact format for mobile
    if (isMobile) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date)
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-full px-2 py-4 md:py-8 space-y-4 md:space-y-8">
        {isMobile ? (
          <MobileAppBar showBack={true} />
        ) : (
          <div className="flex items-center gap-2 mb-2 md:mb-6">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Skeleton className="h-8 w-48" />
          </div>
        )}

        <Card className="bg-black/40 backdrop-blur-sm border-border/50">
          <CardHeader className="p-2 md:p-6">
            <div className="flex items-start gap-2 md:gap-4">
              <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
              <div className="space-y-1 md:space-y-2 flex-1">
                <Skeleton className="h-5 md:h-6 w-3/4" />
                <Skeleton className="h-3 md:h-4 w-1/4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 md:px-6 py-1 md:py-4">
            <Skeleton className="h-3 md:h-4 w-full mb-1 md:mb-2" />
            <Skeleton className="h-3 md:h-4 w-full mb-1 md:mb-2" />
            <Skeleton className="h-3 md:h-4 w-3/4" />
          </CardContent>
          <CardFooter className="p-2 md:p-6">
            <Skeleton className="h-7 md:h-9 w-full" />
          </CardFooter>
        </Card>

        <div className="space-y-2 md:space-y-4 pb-16 md:pb-0">
          <Skeleton className="h-6 md:h-8 w-32 md:w-48" />
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="bg-black/40 backdrop-blur-sm border-border/50">
                <CardHeader className="p-2 md:p-6">
                  <div className="flex items-start gap-2 md:gap-4">
                    <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
                    <div className="space-y-1 md:space-y-2 flex-1">
                      <Skeleton className="h-4 md:h-5 w-1/4" />
                      <Skeleton className="h-3 md:h-4 w-1/6" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-2 md:px-6 py-1 md:py-4">
                  <Skeleton className="h-3 md:h-4 w-full mb-1 md:mb-2" />
                  <Skeleton className="h-3 md:h-4 w-full mb-1 md:mb-2" />
                  <Skeleton className="h-3 md:h-4 w-1/2" />
                </CardContent>
                <CardFooter className="p-2 md:p-6">
                  <Skeleton className="h-6 md:h-8 w-20 md:w-24" />
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="container mx-auto py-8 md:py-16 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Topic Not Found</h1>
        <p className="text-muted-foreground mb-6 md:mb-8">
          The topic you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/dashboard/forum">
          <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">Return to Forum</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-full px-2 md:px-6 py-4 md:py-8 space-y-4 md:space-y-8">
      {/* Custom mobile app bar with back button */}
      {isMobile ? (
        <MobileAppBar title={topic.title} showBack={true} />
      ) : (
        <div className="flex items-center gap-2 mb-2 md:mb-6">
          <Link href="/dashboard/forum">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Forum Topic</h1>
        </div>
      )}

      {/* Topic Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="bg-black/40 backdrop-blur-sm border-border/50">
          <CardHeader className="space-y-2 md:space-y-4 p-2 md:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 md:gap-3">
                <Avatar className="h-7 w-7 md:h-10 md:w-10">
                  <AvatarImage src={topic.user.avatar} alt={topic.user.name} />
                  <AvatarFallback>{topic.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-xs md:text-base">{topic.user.name}</div>
                  <div className="text-xs text-muted-foreground">{topic.user.username}</div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 md:h-8 md:w-8">
                    <MoreHorizontal className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleReportTopic}>
                    <Flag className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                    Report Topic
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <h2 className="text-base md:text-2xl font-bold">{topic.title}</h2>
              <div className="flex flex-wrap gap-1 md:gap-2 mt-1 md:mt-2">
                <Badge variant="outline" className="bg-secondary/20 text-[10px] md:text-xs px-1 py-0 md:px-2 md:py-0.5">
                  {topic.category}
                </Badge>
                {topic.isPinned && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-[10px] md:text-xs px-1 py-0 md:px-2 md:py-0.5"
                  >
                    Pinned
                  </Badge>
                )}
                {topic.isHot && (
                  <Badge
                    variant="outline"
                    className="bg-red-500/20 text-red-500 border-red-500/30 text-[10px] md:text-xs px-1 py-0 md:px-2 md:py-0.5"
                  >
                    Hot
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-2 md:px-6 py-1 md:py-4">
            <p className="text-xs md:text-base text-muted-foreground whitespace-pre-line mb-2 md:mb-4">
              {topic.content}
            </p>
            <div className="text-[10px] md:text-sm text-muted-foreground">Posted on {formatDate(topic.createdAt)}</div>
          </CardContent>

          <CardFooter className="border-t border-border/30 pt-2 md:pt-4 px-2 md:px-6 flex flex-wrap gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 h-6 md:h-8 text-[10px] md:text-sm px-1 md:px-3 ${isLiked ? "text-neon-blue" : "text-muted-foreground hover:text-neon-blue"}`}
              onClick={handleLikeTopic}
              onTouchStart={() => hapticFeedback(HAPTIC_PATTERNS.light)}
            >
              <ThumbsUp className={`h-3 w-3 md:h-4 md:w-4 ${isLiked ? "fill-current" : ""}`} />
              {topic.likes + (isLiked ? 1 : 0)}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-6 md:h-8 text-[10px] md:text-sm px-1 md:px-3 text-muted-foreground"
              onTouchStart={() => hapticFeedback(HAPTIC_PATTERNS.light)}
            >
              <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
              {topic.replies}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 h-6 md:h-8 text-[10px] md:text-sm px-1 md:px-3 ${isBookmarked ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"}`}
              onClick={handleBookmarkTopic}
              onTouchStart={() => hapticFeedback(HAPTIC_PATTERNS.light)}
            >
              <Bookmark className={`h-3 w-3 md:h-4 md:w-4 ${isBookmarked ? "fill-current" : ""}`} />
              <span className="hidden md:inline">Bookmark</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-6 md:h-8 text-[10px] md:text-sm px-1 md:px-3 text-muted-foreground hover:text-green-500"
              onClick={handleShareTopic}
              onTouchStart={() => hapticFeedback(HAPTIC_PATTERNS.light)}
            >
              <Share2 className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Share</span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Comments Section */}
      <div className="space-y-2 md:space-y-4">
        <h2 className="text-base md:text-xl font-semibold">Replies ({topic.replies})</h2>

        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
          >
            <Card className="bg-black/40 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-1 md:pb-2 p-2 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2 md:gap-3">
                    <Avatar className="h-6 w-6 md:h-10 md:w-10">
                      <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                      <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-xs md:text-base">{comment.user.name}</div>
                      <div className="text-[10px] md:text-sm text-muted-foreground">{comment.user.username}</div>
                    </div>
                  </div>

                  <div className="text-[10px] md:text-sm text-muted-foreground">
                    {formatDate(comment.createdAt)}
                    {comment.isEdited && <span className="ml-1 md:ml-2">(edited)</span>}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-2 md:px-6 py-1 md:py-4">
                <p className="text-xs md:text-base text-muted-foreground whitespace-pre-line">{comment.content}</p>
              </CardContent>

              <CardFooter className="border-t border-border/30 pt-2 md:pt-4 px-2 md:px-6 flex flex-wrap justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1 h-6 md:h-8 text-[10px] md:text-sm px-1 md:px-3 ${comment.isLiked ? "text-neon-blue" : "text-muted-foreground hover:text-neon-blue"}`}
                  onClick={() => handleLikeComment(comment.id)}
                  onTouchStart={() => hapticFeedback(HAPTIC_PATTERNS.light)}
                >
                  <ThumbsUp className={`h-3 w-3 md:h-4 md:w-4 ${comment.isLiked ? "fill-current" : ""}`} />
                  {comment.likes}
                </Button>

                <div className="flex gap-1 md:gap-2">
                  {comment.user.id === (user?.id || "demo-user-id") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 md:h-8 text-[10px] md:text-sm px-1 md:px-3 text-muted-foreground hover:text-neon-blue"
                      onTouchStart={() => hapticFeedback(HAPTIC_PATTERNS.light)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 md:h-8 text-[10px] md:text-sm px-1 md:px-3 text-muted-foreground hover:text-neon-blue"
                    onTouchStart={() => hapticFeedback(HAPTIC_PATTERNS.light)}
                  >
                    Reply
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}

        {/* Comment Form */}
        <Card className="bg-black/40 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-1 md:pb-2 p-2 md:p-6">
            <h3 className="font-medium text-xs md:text-base">Add a reply</h3>
          </CardHeader>

          <CardContent className="px-2 md:px-6 py-1 md:py-4">
            <form onSubmit={handleSubmitComment}>
              <Textarea
                placeholder="Share your thoughts..."
                className="min-h-[80px] md:min-h-[120px] bg-secondary/20 border-border/50 mb-2 md:mb-4 text-xs md:text-base"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-neon-blue text-black hover:bg-neon-blue/80 text-[10px] md:text-sm h-7 md:h-10 px-2 md:px-4"
                  disabled={isSubmitting || !commentText.trim()}
                  onTouchStart={() => !isSubmitting && commentText.trim() && hapticFeedback(HAPTIC_PATTERNS.light)}
                >
                  {isSubmitting ? (
                    "Posting..."
                  ) : (
                    <>
                      <Send className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Post Reply
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Related Topics */}
      <div className="space-y-2 md:space-y-4 pb-16 md:pb-0">
        <h2 className="text-base md:text-xl font-semibold">Related Topics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          {relatedTopics.map((relatedTopic) => (
            <Link
              key={relatedTopic.id}
              href={`/dashboard/forum/topics/${relatedTopic.id}`}
              onClick={() => hapticFeedback(HAPTIC_PATTERNS.medium)}
            >
              <Card className="bg-black/40 backdrop-blur-sm border-border/50 hover:bg-black/60 transition-colors h-full">
                <CardContent className="p-2 md:p-4">
                  <h3 className="font-medium text-xs md:text-base mb-1 md:mb-2 line-clamp-2">{relatedTopic.title}</h3>
                  <div className="flex items-center gap-1 md:gap-3 text-[10px] md:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-2 w-2 md:h-3 md:w-3" />
                      <span>{relatedTopic.replies}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-2 w-2 md:h-3 md:w-3" />
                      <span>{relatedTopic.views}</span>
                    </div>
                    <span>•</span>
                    <span>{relatedTopic.lastActivity}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
