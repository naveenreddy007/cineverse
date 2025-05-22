"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { ForumClient } from "./client"

interface ForumPost {
  id: string
  title: string
  content: string
  user: {
    name: string
    username: string
    avatar: string
  }
  category: string
  replies: number
  views: number
  likes: number
  isPinned: boolean
  isHot: boolean
  lastActivity: string
  lastReplyUser: {
    name: string
    avatar: string
  }
}

interface RealtimeForumClientProps {
  initialPosts: ForumPost[]
}

export function RealtimeForumClient({ initialPosts }: RealtimeForumClientProps) {
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts)

  useEffect(() => {
    // Set up realtime subscription for forum posts
    const channel = supabase
      .channel("forum-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "forum_posts",
        },
        async (payload) => {
          // When a post is created, updated, or deleted, fetch the latest posts
          const { data: updatedPosts, error } = await supabase
            .from("forum_posts")
            .select(`
              id,
              title,
              content,
              category,
              created_at,
              updated_at,
              is_pinned,
              users (
                name,
                avatar_url
              ),
              forum_comments (
                id,
                user_id,
                users (
                  name,
                  avatar_url
                )
              )
            `)
            .order("created_at", { ascending: false })

          if (!error && updatedPosts) {
            // Transform the data to match the expected format
            const transformedPosts = updatedPosts.map((post) => ({
              id: post.id,
              title: post.title,
              content: post.content,
              user: {
                name: post.users.name || "Anonymous",
                username: `@${post.users.name?.toLowerCase().replace(/\s+/g, "") || "anonymous"}`,
                avatar: post.users.avatar_url || "/placeholder.svg?height=50&width=50",
              },
              category: post.category,
              replies: post.forum_comments.length,
              views: Math.floor(Math.random() * 500), // Mock data
              likes: Math.floor(Math.random() * 100), // Mock data
              isPinned: post.is_pinned,
              isHot: post.forum_comments.length > 10, // Consider "hot" if > 10 comments
              lastActivity: new Date(post.updated_at || post.created_at).toLocaleDateString(),
              lastReplyUser:
                post.forum_comments.length > 0
                  ? {
                      name: post.forum_comments[post.forum_comments.length - 1].users.name || "Anonymous",
                      avatar:
                        post.forum_comments[post.forum_comments.length - 1].users.avatar_url ||
                        "/placeholder.svg?height=50&width=50",
                    }
                  : {
                      name: post.users.name || "Anonymous",
                      avatar: post.users.avatar_url || "/placeholder.svg?height=50&width=50",
                    },
            }))

            setPosts(transformedPosts)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return <ForumClient initialPosts={posts} />
}
