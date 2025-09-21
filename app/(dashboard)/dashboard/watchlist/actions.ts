"use server"

import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export interface WatchlistItem {
  id: string
  user_id: string
  movie_id: string
  added_at: string
  priority: "low" | "medium" | "high"
  watched: boolean
  watched_at: string | null
  movie: {
    id: string
    title: string
    title_telugu: string
    poster_url: string
    release_date: string
    audience_rating: number
    siddu_rating: number
    genres: string[]
    runtime: number
  }
}

export async function addToWatchlist(movieId: string, priority: "low" | "medium" | "high" = "medium") {
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
      .from("watchlist")
      .insert({
        user_id: user.id,
        movie_id: movieId,
        priority,
        watched: false,
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return { success: false, error: "Movie is already in your watchlist" }
      }
      throw error
    }

    revalidatePath("/dashboard/watchlist")
    return { success: true, data }
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    return { success: false, error: "Failed to add movie to watchlist" }
  }
}

export async function removeFromWatchlist(watchlistId: string) {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  try {
    const { error } = await supabase.from("watchlist").delete().eq("id", watchlistId).eq("user_id", user.id)

    if (error) throw error

    revalidatePath("/dashboard/watchlist")
    return { success: true }
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return { success: false, error: "Failed to remove movie from watchlist" }
  }
}

export async function markAsWatched(watchlistId: string, watched = true) {
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
      .from("watchlist")
      .update({
        watched,
        watched_at: watched ? new Date().toISOString() : null,
      })
      .eq("id", watchlistId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error

    revalidatePath("/dashboard/watchlist")
    return { success: true, data }
  } catch (error) {
    console.error("Error updating watch status:", error)
    return { success: false, error: "Failed to update watch status" }
  }
}

export async function updateWatchlistPriority(watchlistId: string, priority: "low" | "medium" | "high") {
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
      .from("watchlist")
      .update({ priority })
      .eq("id", watchlistId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error

    revalidatePath("/dashboard/watchlist")
    return { success: true, data }
  } catch (error) {
    console.error("Error updating priority:", error)
    return { success: false, error: "Failed to update priority" }
  }
}

export async function getWatchlist(): Promise<{ success: boolean; data?: WatchlistItem[]; error?: string }> {
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
      .from("watchlist")
      .select(`
        *,
        movie:movies (
          id,
          title,
          title_telugu,
          poster_url,
          release_date,
          audience_rating,
          siddu_rating,
          genres,
          runtime
        )
      `)
      .eq("user_id", user.id)
      .order("added_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data as WatchlistItem[] }
  } catch (error) {
    console.error("Error fetching watchlist:", error)
    return { success: false, error: "Failed to fetch watchlist" }
  }
}

export async function getWatchlistStats() {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  try {
    const { data, error } = await supabase.from("watchlist").select("watched, priority").eq("user_id", user.id)

    if (error) throw error

    const stats = {
      total: data.length,
      watched: data.filter((item) => item.watched).length,
      unwatched: data.filter((item) => !item.watched).length,
      high_priority: data.filter((item) => item.priority === "high" && !item.watched).length,
      medium_priority: data.filter((item) => item.priority === "medium" && !item.watched).length,
      low_priority: data.filter((item) => item.priority === "low" && !item.watched).length,
    }

    return { success: true, data: stats }
  } catch (error) {
    console.error("Error fetching watchlist stats:", error)
    return { success: false, error: "Failed to fetch watchlist statistics" }
  }
}

export async function isInWatchlist(
  movieId: string,
): Promise<{ success: boolean; inWatchlist?: boolean; watchlistId?: string; error?: string }> {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: true, inWatchlist: false }
  }

  try {
    const { data, error } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found"
      throw error
    }

    return {
      success: true,
      inWatchlist: !!data,
      watchlistId: data?.id,
    }
  } catch (error) {
    console.error("Error checking watchlist:", error)
    return { success: false, error: "Failed to check watchlist status" }
  }
}
