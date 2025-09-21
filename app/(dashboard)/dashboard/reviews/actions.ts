"use server"

import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export interface Review {
  id: string
  user_id: string
  movie_id: string
  rating: number
  content: string
  content_telugu?: string
  created_at: string
  updated_at: string
  is_draft: boolean
  user: {
    id: string
    name: string
    avatar_url?: string
  }
  movie: {
    id: string
    title: string
    title_telugu: string
    poster_url: string
    release_date: string
    audience_rating: number
    siddu_rating: number
  }
}

export async function createReview(
  movieId: string,
  rating: number,
  content: string,
  contentTelugu?: string,
  isDraft = false,
) {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  // Validate rating
  if (rating < 0 || rating > 5) {
    return { success: false, error: "Rating must be between 0 and 5" }
  }

  // Validate content
  if (!isDraft && content.trim().length < 10) {
    return { success: false, error: "Review content must be at least 10 characters long" }
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        movie_id: movieId,
        rating,
        content: content.trim(),
        content_telugu: contentTelugu?.trim() || null,
        is_draft: isDraft,
      })
      .select(`
        *,
        user:users (id, name, avatar_url),
        movie:movies (id, title, title_telugu, poster_url, release_date, audience_rating, siddu_rating)
      `)
      .single()

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return { success: false, error: "You have already reviewed this movie" }
      }
      throw error
    }

    revalidatePath("/dashboard/reviews")
    revalidatePath(`/movies/${movieId}`)
    return { success: true, data }
  } catch (error) {
    console.error("Error creating review:", error)
    return { success: false, error: "Failed to create review" }
  }
}

export async function updateReview(
  reviewId: string,
  rating: number,
  content: string,
  contentTelugu?: string,
  isDraft = false,
) {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  // Validate rating
  if (rating < 0 || rating > 5) {
    return { success: false, error: "Rating must be between 0 and 5" }
  }

  // Validate content
  if (!isDraft && content.trim().length < 10) {
    return { success: false, error: "Review content must be at least 10 characters long" }
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .update({
        rating,
        content: content.trim(),
        content_telugu: contentTelugu?.trim() || null,
        is_draft: isDraft,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .eq("user_id", user.id)
      .select(`
        *,
        user:users (id, name, avatar_url),
        movie:movies (id, title, title_telugu, poster_url, release_date, audience_rating, siddu_rating)
      `)
      .single()

    if (error) throw error

    revalidatePath("/dashboard/reviews")
    revalidatePath(`/movies/${data.movie_id}`)
    return { success: true, data }
  } catch (error) {
    console.error("Error updating review:", error)
    return { success: false, error: "Failed to update review" }
  }
}

export async function deleteReview(reviewId: string) {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  try {
    // Get the movie_id before deleting for revalidation
    const { data: reviewData, error: fetchError } = await supabase
      .from("reviews")
      .select("movie_id")
      .eq("id", reviewId)
      .eq("user_id", user.id)
      .single()

    if (fetchError) throw fetchError

    const { error } = await supabase.from("reviews").delete().eq("id", reviewId).eq("user_id", user.id)

    if (error) throw error

    revalidatePath("/dashboard/reviews")
    revalidatePath(`/movies/${reviewData.movie_id}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting review:", error)
    return { success: false, error: "Failed to delete review" }
  }
}

export async function getUserReviews(): Promise<{ success: boolean; data?: Review[]; error?: string }> {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        user:users (id, name, avatar_url),
        movie:movies (id, title, title_telugu, poster_url, release_date, audience_rating, siddu_rating)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data as Review[] }
  } catch (error) {
    console.error("Error fetching user reviews:", error)
    return { success: false, error: "Failed to fetch reviews" }
  }
}

export async function getMovieReviews(movieId: string): Promise<{ success: boolean; data?: Review[]; error?: string }> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        user:users (id, name, avatar_url),
        movie:movies (id, title, title_telugu, poster_url, release_date, audience_rating, siddu_rating)
      `)
      .eq("movie_id", movieId)
      .eq("is_draft", false)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data as Review[] }
  } catch (error) {
    console.error("Error fetching movie reviews:", error)
    return { success: false, error: "Failed to fetch movie reviews" }
  }
}

export async function getUserReview(movieId: string): Promise<{ success: boolean; data?: Review; error?: string }> {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: true, data: undefined }
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        user:users (id, name, avatar_url),
        movie:movies (id, title, title_telugu, poster_url, release_date, audience_rating, siddu_rating)
      `)
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found"
      throw error
    }

    return { success: true, data: (data as Review) || undefined }
  } catch (error) {
    console.error("Error fetching user review:", error)
    return { success: false, error: "Failed to fetch user review" }
  }
}

export async function getReviewStats() {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  try {
    const { data, error } = await supabase.from("reviews").select("rating, is_draft, created_at").eq("user_id", user.id)

    if (error) throw error

    const publishedReviews = data.filter((review) => !review.is_draft)
    const draftReviews = data.filter((review) => review.is_draft)

    const averageRating =
      publishedReviews.length > 0
        ? publishedReviews.reduce((sum, review) => sum + review.rating, 0) / publishedReviews.length
        : 0

    const stats = {
      total_reviews: data.length,
      published_reviews: publishedReviews.length,
      draft_reviews: draftReviews.length,
      average_rating: Math.round(averageRating * 10) / 10,
      reviews_this_month: data.filter((review) => {
        const reviewDate = new Date(review.created_at)
        const now = new Date()
        return reviewDate.getMonth() === now.getMonth() && reviewDate.getFullYear() === now.getFullYear()
      }).length,
    }

    return { success: true, data: stats }
  } catch (error) {
    console.error("Error fetching review stats:", error)
    return { success: false, error: "Failed to fetch review statistics" }
  }
}

export async function publishDraft(reviewId: string) {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .update({
        is_draft: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .eq("user_id", user.id)
      .select(`
        *,
        user:users (id, name, avatar_url),
        movie:movies (id, title, title_telugu, poster_url, release_date, audience_rating, siddu_rating)
      `)
      .single()

    if (error) throw error

    revalidatePath("/dashboard/reviews")
    revalidatePath(`/movies/${data.movie_id}`)
    return { success: true, data }
  } catch (error) {
    console.error("Error publishing draft:", error)
    return { success: false, error: "Failed to publish review" }
  }
}
