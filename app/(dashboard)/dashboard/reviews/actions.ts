"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"

// Get user reviews
export async function getUserReviews() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: { message: "Not authenticated" }, data: null }
  }

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      content,
      created_at,
      updated_at,
      is_draft,
      movies (
        id,
        title,
        poster,
        year,
        genres
      )
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  return { data, error }
}

// Delete a review
export async function deleteReview(reviewId: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: { message: "Not authenticated" }, data: null }
  }

  const { data, error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", session.user.id) // Security: ensure user owns this review
    .select()

  revalidatePath("/dashboard/reviews")

  return { data, error }
}

// Update a review
export async function updateReview(
  reviewId: string,
  updates: { rating?: number; content?: string; is_draft?: boolean },
) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: { message: "Not authenticated" }, data: null }
  }

  const { data, error } = await supabase
    .from("reviews")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId)
    .eq("user_id", session.user.id) // Security: ensure user owns this review
    .select()

  revalidatePath("/dashboard/reviews")

  return { data, error }
}

