import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { getSupabaseBrowser } from "./supabase-browser"
import { createServerSupabaseClient } from "./supabase-server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase instance
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client
export { createServerSupabaseClient }

// Re-export for compatibility
export { createClient }
export { getSupabaseBrowser as createBrowserClient }

// Default export
export default supabase

// Helper for server-side operations with admin privileges
// export const createServerSupabaseClient = async () => {
//   const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
//   return createClient<Database>(supabaseUrl, supabaseServiceKey, {
//     auth: {
//       persistSession: false,
//     },
//   })
// }

// Export the main client as default
// export default supabase

// Re-export for convenience
// export { createClient }

// This is a convenience function that will automatically use the correct client
// based on whether it's being called from the client or server
// export function getSupabase() {
//   if (typeof window === "undefined") {
//     // We're on the server
//     return getSupabaseServer()
//   } else {
//     // We're on the client
//     return getSupabaseBrowser()
//   }
// }

// Export all functions for specific use cases
// export { getSupabaseBrowser, getSupabaseServer, getSupabaseAction }

// Mock implementation for Supabase client - to be replaced with actual Supabase integration

export interface SupabaseUser {
  id: string
  email: string
  name: string
  avatar_url: string | null
  created_at: string
}

export interface MovieReview {
  id: string
  user_id: string
  movie_id: string
  rating: number
  content: string
  created_at: string
  updated_at: string | null
}

export interface ForumPost {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string | null
}

export interface ForumComment {
  id: string
  user_id: string
  post_id: string
  content: string
  created_at: string
  updated_at: string | null
}

// This is a mock implementation that would be replaced with real Supabase client
class SupabaseClient {
  async signUp(email: string, password: string) {
    console.log("Signup called with", email)
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ user: { id: "new-user-id", email }, error: null })
      }, 500)
    })
  }

  async signIn(email: string, password: string) {
    console.log("SignIn called with", email)
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ user: { id: "user-id", email }, error: null })
      }, 500)
    })
  }

  async signOut() {
    console.log("SignOut called")
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ error: null })
      }, 500)
    })
  }

  // Methods for movies
  async getMovies() {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: "movie1",
              title: "Oppenheimer",
              poster: "/placeholder.svg?height=450&width=300",
              rating: 4.8,
              year: 2023,
            },
            // More movies...
          ],
          error: null,
        })
      }, 500)
    })
  }

  // Methods for user reviews
  async getUserReviews(userId: string) {
    console.log("Getting reviews for user", userId)
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: "review1",
              user_id: userId,
              movie_id: "movie1",
              rating: 4.5,
              content: "Great movie!",
              created_at: new Date().toISOString(),
            },
            // More reviews...
          ],
          error: null,
        })
      }, 500)
    })
  }

  // Methods for forum
  async getForumPosts() {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: "post1",
              user_id: "user1",
              title: "What did you think of Oppenheimer?",
              content: "I thought it was amazing...",
              created_at: new Date().toISOString(),
            },
            // More posts...
          ],
          error: null,
        })
      }, 500)
    })
  }
}

// Create a singleton instance
const supabaseClient = new SupabaseClient()

// Export the singleton instance for mock purposes
export { supabaseClient }
