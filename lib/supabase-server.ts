import { createServerComponentClient, createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// For server components
export function getSupabaseServer() {
  return createServerComponentClient<Database>({ cookies })
}

// For server actions
export function getSupabaseAction() {
  return createServerActionClient<Database>({ cookies })
}
