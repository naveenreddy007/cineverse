"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock posts data - would come from Supabase in production
const initialPosts = [
  {
    id: "1",
    title: "Welcome to CineVerse",
    content: "Discover the ultimate movie lover's community...",
    featured: true,
    publishedAt: "2024-03-15",
  },
  {
    id: "2",
    title: "New Features Released",
    content: "Check out our latest platform updates...",
    featured: false,
    publishedAt: "2024-03-14",
  },
]

export default function AdminPosts() {
  const [posts, setPosts] = useState(initialPosts)
  const [newPost, setNewPost] = useState({ title: "", content: "", featured: false })
  const [editingPost, setEditingPost] = useState<null | (typeof initialPosts)[0]>(null)
  const { toast } = useToast()

  const handleCreatePost = () => {
    const post = {
      id: Date.now().toString(),
      ...newPost,
      publishedAt: new Date().toISOString().split("T")[0],
    }
    setPosts([post, ...posts])
    setNewPost({ title: "", content: "", featured: false })
    toast({
      title: "Post Created",
      description: "Your post has been published successfully.",
    })
  }

  const handleUpdatePost = () => {
    if (!editingPost) return
    setPosts(posts.map((post) => (post.id === editingPost.id ? editingPost : post)))
    setEditingPost(null)
    toast({
      title: "Post Updated",
      description: "Your changes have been saved.",
    })
  }

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id))
    toast({
      title: "Post Deleted",
      description: "The post has been removed.",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Posts</h1>
            <p className="text-muted-foreground mt-2">Create and manage posts that appear on the main page.</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] bg-black/90 backdrop-blur-sm border-border/50">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>Add a new post to your main page. Click save when you're done.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Enter post title"
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Write your post content..."
                    className="min-h-[150px] bg-secondary/50"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newPost.featured}
                    onChange={(e) => setNewPost({ ...newPost, featured: e.target.checked })}
                    className="rounded border-border/50"
                  />
                  <Label htmlFor="featured">Feature this post</Label>
                </div>
                <Button onClick={handleCreatePost} className="w-full bg-neon-blue text-black hover:bg-neon-blue/80">
                  Create Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="bg-black/40 backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {post.title}
                    {post.featured && (
                      <span className="bg-neon-blue/20 text-neon-blue text-xs px-2 py-1 rounded-full">Featured</span>
                    )}
                  </CardTitle>
                  <CardDescription>Published on {post.publishedAt}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px] bg-black/90 backdrop-blur-sm border-border/50">
                      <DialogHeader>
                        <DialogTitle>Edit Post</DialogTitle>
                        <DialogDescription>
                          Make changes to your post here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title">Title</Label>
                          <Input
                            id="edit-title"
                            value={editingPost?.title || post.title}
                            onChange={(e) =>
                              setEditingPost({
                                ...post,
                                title: e.target.value,
                              })
                            }
                            className="bg-secondary/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-content">Content</Label>
                          <Textarea
                            id="edit-content"
                            value={editingPost?.content || post.content}
                            onChange={(e) =>
                              setEditingPost({
                                ...post,
                                content: e.target.value,
                              })
                            }
                            className="min-h-[150px] bg-secondary/50"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="edit-featured"
                            checked={editingPost?.featured || post.featured}
                            onChange={(e) =>
                              setEditingPost({
                                ...post,
                                featured: e.target.checked,
                              })
                            }
                            className="rounded border-border/50"
                          />
                          <Label htmlFor="edit-featured">Feature this post</Label>
                        </div>
                        <Button
                          onClick={handleUpdatePost}
                          className="w-full bg-neon-blue text-black hover:bg-neon-blue/80"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
