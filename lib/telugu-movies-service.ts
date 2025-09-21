import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export interface TeluguMovie {
  id: string
  title: string
  title_telugu: string
  poster_url: string
  backdrop_url?: string
  release_date: string
  audience_rating: number
  siddu_rating: number
  genres: string[]
  director: string
  cast: string[]
  plot: string
  plot_telugu: string
  runtime: number
  language: string
  box_office?: number
  created_at: string
  updated_at: string
}

export interface MovieReview {
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
    name: string
    avatar_url?: string
  }
}

class TeluguMoviesService {
  private supabase = createClientComponentClient<Database>()

  // Get latest Telugu movies
  async getLatestTeluguMovies(limit = 20) {
    const { data, error } = await this.supabase
      .from("movies")
      .select("*")
      .eq("language", "telugu")
      .order("release_date", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as TeluguMovie[]
  }

  // Get trending Telugu movies
  async getTrendingTeluguMovies(limit = 10) {
    const { data, error } = await this.supabase
      .from("movies")
      .select("*")
      .eq("language", "telugu")
      .order("siddu_rating", { ascending: false })
      .order("audience_rating", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as TeluguMovie[]
  }

  // Get movie by ID with reviews
  async getMovieById(id: string) {
    const { data: movie, error: movieError } = await this.supabase.from("movies").select("*").eq("id", id).single()

    if (movieError) throw movieError

    // Get reviews for rating calculation
    const { data: reviews, error: reviewsError } = await this.supabase
      .from("reviews")
      .select("rating")
      .eq("movie_id", id)
      .eq("is_draft", false)

    if (reviewsError) throw reviewsError

    // Calculate audience rating from reviews
    const audienceRating =
      reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

    return {
      ...movie,
      audience_rating: Math.round(audienceRating * 10) / 10,
      review_count: reviews.length,
    } as TeluguMovie & { review_count: number }
  }

  // Search Telugu movies
  async searchTeluguMovies(query: string) {
    const { data, error } = await this.supabase
      .from("movies")
      .select("*")
      .eq("language", "telugu")
      .or(`title.ilike.%${query}%,title_telugu.ilike.%${query}%,director.ilike.%${query}%`)
      .order("siddu_rating", { ascending: false })

    if (error) throw error
    return data as TeluguMovie[]
  }

  // Get movies by genre
  async getMoviesByGenre(genre: string, limit = 20) {
    const { data, error } = await this.supabase
      .from("movies")
      .select("*")
      .eq("language", "telugu")
      .contains("genres", [genre])
      .order("siddu_rating", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as TeluguMovie[]
  }

  // Get movie reviews with user info
  async getMovieReviews(movieId: string) {
    const { data, error } = await this.supabase
      .from("reviews")
      .select(`
        *,
        users (
          name,
          avatar_url
        )
      `)
      .eq("movie_id", movieId)
      .eq("is_draft", false)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as MovieReview[]
  }

  // Add movie review and update ratings
  async addReview(movieId: string, rating: number, content: string, contentTelugu?: string) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    // Insert review
    const { data: review, error: reviewError } = await this.supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        movie_id: movieId,
        rating,
        content,
        content_telugu: contentTelugu,
      })
      .select()
      .single()

    if (reviewError) throw reviewError

    // Recalculate audience rating
    await this.updateMovieRatings(movieId)

    return review
  }

  // Update movie ratings based on reviews
  private async updateMovieRatings(movieId: string) {
    const { data: reviews, error } = await this.supabase
      .from("reviews")
      .select("rating")
      .eq("movie_id", movieId)
      .eq("is_draft", false)

    if (error) throw error

    const audienceRating =
      reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

    // Update movie with new audience rating
    await this.supabase
      .from("movies")
      .update({ audience_rating: Math.round(audienceRating * 10) / 10 })
      .eq("id", movieId)
  }

  // Get user's watchlist
  async getUserWatchlist(userId: string) {
    const { data, error } = await this.supabase
      .from("watchlist")
      .select(`
        *,
        movies (*)
      `)
      .eq("user_id", userId)
      .order("added_at", { ascending: false })

    if (error) throw error
    return data
  }

  // Add to watchlist
  async addToWatchlist(movieId: string, priority: "low" | "medium" | "high" = "medium") {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const { data, error } = await this.supabase
      .from("watchlist")
      .insert({
        user_id: user.id,
        movie_id: movieId,
        priority,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Remove from watchlist
  async removeFromWatchlist(movieId: string) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await this.supabase.from("watchlist").delete().eq("user_id", user.id).eq("movie_id", movieId)

    if (error) throw error
  }
}

export const teluguMoviesService = new TeluguMoviesService()
