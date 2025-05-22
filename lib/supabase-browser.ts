import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// For client-side usage
let browserClient: ReturnType<typeof createClientComponentClient<Database>> | undefined

export function getSupabaseBrowser() {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseBrowser should only be called in the browser")
  }

  if (!browserClient) {
    browserClient = createClientComponentClient<Database>()
  }

  return browserClient
}
