"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"

// Get the current user's watchlist
export async function getWatchlist() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: { message: "Not authenticated" }, data: null }
  }

  const { data, error } = await supabase
    .from("watchlist")
    .select(`
      id,
      added_at,
      priority,
      watched,
      watched_at,
      movies (
        id,
        title,
        poster,
        year,
        rating,
        genres
      )
    `)
    .eq("user_id", session.user.id)
    .order("added_at", { ascending: false })

  return { data, error }
}

// Add a movie to watchlist
export async function addToWatchlist(movieId: string, priority: "low" | "medium" | "high" = "medium") {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: { message: "Not authenticated" }, data: null }
  }

  // Check if movie is already in watchlist
  const { data: existing } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("movie_id", movieId)
    .single()

  if (existing) {
    return { error: { message: "Movie already in watchlist" }, data: null }
  }

  const { data, error } = await supabase
    .from("watchlist")
    .insert({
      user_id: session.user.id,
      movie_id: movieId,
      priority,
      added_at: new Date().toISOString(),
      watched: false,
    })
    .select()

  revalidatePath("/dashboard/watchlist")

  return { data, error }
}

// Mark a movie as watched
export async function markAsWatched(watchlistId: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: { message: "Not authenticated" }, data: null }
  }

  const { data, error } = await supabase
    .from("watchlist")
    .update({
      watched: true,
      watched_at: new Date().toISOString(),
    })
    .eq("id", watchlistId)
    .eq("user_id", session.user.id) // Security: ensure user owns this watchlist item
    .select()

  revalidatePath("/dashboard/watchlist")

  return { data, error }
}

// Remove a movie from watchlist
export async function removeFromWatchlist(watchlistId: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: { message: "Not authenticated" }, data: null }
  }

  const { data, error } = await supabase.from("watchlist").delete().eq("id", watchlistId).eq("user_id", session.user.id) // Security: ensure user owns this watchlist item

  revalidatePath("/dashboard/watchlist")

  return { data, error }
}

// Update watchlist item priority
export async function updateWatchlistPriority(watchlistId: string, priority: "low" | "medium" | "high") {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: { message: "Not authenticated" }, data: null }
  }

  const { data, error } = await supabase
    .from("watchlist")
    .update({ priority })
    .eq("id", watchlistId)
    .eq("user_id", session.user.id) // Security: ensure user owns this watchlist item
    .select()

  revalidatePath("/dashboard/watchlist")

  return { data, error }
}
