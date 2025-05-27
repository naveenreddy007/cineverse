"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Film, User, Clock, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useHaptic } from "@/hooks/use-haptic"

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { trigger, patterns } = useHaptic()

  // Recent searches (would be stored in localStorage in a real app)
  const recentSearches = ["Nolan", "Marvel", "Sci-Fi", "Oscar Winners"]

  // Trending searches
  const trendingSearches = ["Barbie", "Oppenheimer", "Mission Impossible", "Indiana Jones"]

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      trigger(patterns.medium)
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      onClose()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    trigger(patterns.light)
    setSearchQuery(suggestion)
    router.push(`/search?q=${encodeURIComponent(suggestion)}`)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col"
        >
          <div className="container max-w-2xl mx-auto pt-16 px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Search</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSearch} className="relative mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="search"
                  placeholder="Search movies, people, genres..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  className="pl-10 pr-10 h-12 bg-background/50 border-border/50 text-lg"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("")
                      if (inputRef.current) {
                        inputRef.current.focus()
                      }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                )}
              </div>
            </form>

            {showSuggestions && (
              <div className="space-y-6">
                {/* Recent searches */}
                <div>
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <h3 className="text-sm font-medium text-muted-foreground">Recent searches</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        className="bg-secondary/20 hover:bg-secondary/30 px-3 py-1.5 rounded-full text-sm transition-colors"
                        onClick={() => handleSuggestionClick(search)}
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending searches */}
                <div>
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground mr-2" />
                    <h3 className="text-sm font-medium text-muted-foreground">Trending searches</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search) => (
                      <button
                        key={search}
                        className="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue px-3 py-1.5 rounded-full text-sm transition-colors"
                        onClick={() => handleSuggestionClick(search)}
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="flex items-center gap-2 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                    onClick={() => router.push("/dashboard/discover")}
                  >
                    <Film className="h-5 w-5 text-neon-blue" />
                    <span>Browse Movies</span>
                  </button>
                  <button
                    className="flex items-center gap-2 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                    onClick={() => router.push("/dashboard/watchlist")}
                  >
                    <User className="h-5 w-5 text-neon-blue" />
                    <span>My Watchlist</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
