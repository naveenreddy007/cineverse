"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { PencilIcon, Trash2, Star, ThumbsUp, MessageSquare, SortAsc } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { deleteReview } from "./actions"

interface Review {
  id: string
  movieTitle: string
  moviePoster: string
  movieId: string
  rating: number
  content: string
  publishedAt: string
  likes: number
  comments: number
}

interface Draft {
  id: string
  movieTitle: string
  moviePoster: string
  movieId: string
  rating: number
  content: string
  lastEdited: string
}

interface ReviewsClientProps {
  initialReviews: Review[]
  initialDrafts: Draft[]
  error?: string
}

export function ReviewsClient({ initialReviews, initialDrafts, error }: ReviewsClientProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [reviews, setReviews] = useState(initialReviews)
  const [drafts, setDrafts] = useState(initialDrafts)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest")
  const { toast } = useToast()

  // FIXED: Initialize data only once when component mounts
  useEffect(() => {
    // Initialize data from server
    setIsLoading(false)

    if (error) {
      toast({
        title: "Error loading reviews",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast]) // Only depend on error and toast

  // FIXED: Separate effect for sorting that doesn't modify the original reviews array
  useEffect(() => {
    // No need to set state here, we can compute the sorted reviews on render
  }, [sortOrder])

  // Sort reviews based on selected order without setting state
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortOrder) {
      case "newest":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      case "oldest":
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      case "highest":
        return b.rating - a.rating
      case "lowest":
        return a.rating - b.rating
      default:
        return 0
    }
  })

  const handleDeleteReview = async (id: string) => {
    try {
      // Optimistic UI update
      const reviewToDelete = reviews.find((review) => review.id === id)
      if (!reviewToDelete) return

      setReviews(reviews.filter((review) => review.id !== id))

      // Server update
      const { error } = await deleteReview(id)

      if (error) {
        // Revert on error
        setReviews((prev) => [...prev, reviewToDelete])
        toast({
          title: "Delete failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Review Deleted",
          description: "Your review has been permanently removed.",
        })
      }
    } catch (error) {
      console.error("Error deleting review:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDraft = async (id: string) => {
    try {
      // Optimistic UI update
      const draftToDelete = drafts.find((draft) => draft.id === id)
      if (!draftToDelete) return

      setDrafts(drafts.filter((draft) => draft.id !== id))

      // Server update
      const { error } = await deleteReview(id)

      if (error) {
        // Revert on error
        setDrafts((prev) => [...prev, draftToDelete])
        toast({
          title: "Delete failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Draft Deleted",
          description: "Your draft has been permanently removed.",
        })
      }
    } catch (error) {
      console.error("Error deleting draft:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Reviews</h1>
          <p className="text-muted-foreground">Manage your movie reviews and drafts</p>
        </div>
        <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">
          <PencilIcon className="h-4 w-4 mr-2" />
          Write New Review
        </Button>
      </motion.div>

      <Tabs defaultValue="published" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="bg-black/40 backdrop-blur-sm border border-border/50">
            <TabsTrigger value="published" className="data-[state=active]:bg-neon-blue/20">
              Published
            </TabsTrigger>
            <TabsTrigger value="drafts" className="data-[state=active]:bg-neon-blue/20">
              Drafts
            </TabsTrigger>
          </TabsList>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-black/40 backdrop-blur-sm border-border/50">
                <SortAsc className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-sm border-border/50">
              <DropdownMenuItem
                className={sortOrder === "newest" ? "bg-neon-blue/20 text-neon-blue" : ""}
                onClick={() => setSortOrder("newest")}
              >
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortOrder === "oldest" ? "bg-neon-blue/20 text-neon-blue" : ""}
                onClick={() => setSortOrder("oldest")}
              >
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortOrder === "highest" ? "bg-neon-blue/20 text-neon-blue" : ""}
                onClick={() => setSortOrder("highest")}
              >
                Highest Rated
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortOrder === "lowest" ? "bg-neon-blue/20 text-neon-blue" : ""}
                onClick={() => setSortOrder("lowest")}
              >
                Lowest Rated
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TabsContent value="published" className="space-y-4">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="bg-black/40 backdrop-blur-sm border-border/50">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <Skeleton className="h-24 w-16 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/4" />
                      <div className="flex gap-1">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Skeleton key={i} className="h-4 w-4 rounded-full" />
                          ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-20 mr-2" />
                    <Skeleton className="h-9 w-20" />
                  </CardFooter>
                </Card>
              ))
          ) : sortedReviews.length > 0 ? (
            sortedReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border-border/50">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <img
                      src={review.moviePoster || "/placeholder.svg"}
                      alt={review.movieTitle}
                      className="h-24 w-16 object-cover rounded-md"
                    />
                    <div className="space-y-1 flex-1">
                      <CardTitle className="flex justify-between">
                        <span>{review.movieTitle}</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-neon-blue">
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Published on {formatDate(review.publishedAt)}</p>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(review.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : i === Math.floor(review.rating) && review.rating % 1 >= 0.5
                                  ? "text-yellow-400 fill-yellow-400/50"
                                  : "text-muted-foreground"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium">{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{review.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{review.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{review.comments}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-neon-blue border-neon-blue/50">
                      View Full Review
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <PencilIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't published any reviews yet. Start sharing your thoughts on movies!
              </p>
              <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">Write Your First Review</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {isLoading ? (
            <Card className="bg-black/40 backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Skeleton className="h-24 w-16 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-20 mr-2" />
                <Skeleton className="h-9 w-20" />
              </CardFooter>
            </Card>
          ) : drafts.length > 0 ? (
            drafts.map((draft) => (
              <motion.div
                key={draft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border-border/50">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <img
                      src={draft.moviePoster || "/placeholder.svg"}
                      alt={draft.movieTitle}
                      className="h-24 w-16 object-cover rounded-md"
                    />
                    <div className="space-y-1 flex-1">
                      <CardTitle className="flex justify-between">
                        <span>{draft.movieTitle}</span>
                        <Badge variant="outline" className="bg-secondary/20">
                          Draft
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Last edited on {formatDate(draft.lastEdited)}</p>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(draft.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : i === Math.floor(draft.rating) && draft.rating % 1 >= 0.5
                                  ? "text-yellow-400 fill-yellow-400/50"
                                  : "text-muted-foreground"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium">{draft.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{draft.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDeleteDraft(draft.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button variant="outline" size="sm" className="text-neon-blue border-neon-blue/50">
                      Continue Editing
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <PencilIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No draft reviews</h3>
              <p className="text-muted-foreground mb-6">You don't have any draft reviews. Start writing one now!</p>
              <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">Create New Draft</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

