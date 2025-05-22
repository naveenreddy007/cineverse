export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string | null
          role: "user" | "admin" | "moderator"
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
          role?: "user" | "admin" | "moderator"
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
          role?: "user" | "admin" | "moderator"
        }
      }
      movies: {
        Row: {
          id: string
          title: string
          poster: string
          year: number
          rating: number | null
          genres: string[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          poster: string
          year: number
          rating?: number | null
          genres: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          poster?: string
          year?: number
          rating?: number | null
          genres?: string[]
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          movie_id: string
          rating: number
          content: string
          created_at: string
          updated_at: string | null
          is_draft: boolean
        }
        Insert: {
          id?: string
          user_id: string
          movie_id: string
          rating: number
          content: string
          created_at?: string
          updated_at?: string | null
          is_draft?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          movie_id?: string
          rating?: number
          content?: string
          created_at?: string
          updated_at?: string | null
          is_draft?: boolean
        }
      }
      watchlist: {
        Row: {
          id: string
          user_id: string
          movie_id: string
          added_at: string
          priority: "low" | "medium" | "high"
          watched: boolean
          watched_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          movie_id: string
          added_at?: string
          priority?: "low" | "medium" | "high"
          watched?: boolean
          watched_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          movie_id?: string
          added_at?: string
          priority?: "low" | "medium" | "high"
          watched?: boolean
          watched_at?: string | null
        }
      }
      forum_posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          category: string
          created_at: string
          updated_at: string | null
          is_pinned: boolean
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          category: string
          created_at?: string
          updated_at?: string | null
          is_pinned?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          category?: string
          created_at?: string
          updated_at?: string | null
          is_pinned?: boolean
        }
      }
      forum_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      streaming_services: {
        Row: {
          id: string
          name: string
          logo: string
          color: string
        }
        Insert: {
          id?: string
          name: string
          logo: string
          color: string
        }
        Update: {
          id?: string
          name?: string
          logo?: string
          color?: string
        }
      }
      user_streaming_services: {
        Row: {
          id: string
          user_id: string
          service_id: string
          connected_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id: string
          connected_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: string
          connected_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
