"use server"

import { getSupabaseAction } from "@/lib/supabase-server"

export async function getUserProfile(userId: string) {
  const supabase = getSupabaseAction()

  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    throw new Error(`Error fetching user profile: ${error.message}`)
  }

  return data
}
