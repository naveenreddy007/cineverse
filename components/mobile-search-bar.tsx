"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useHaptic } from "@/hooks/use-haptic"

interface MobileSearchBarProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
  initialQuery?: string
  autoFocus?: boolean
}

export function MobileSearchBar({
  placeholder = "Search movies...",
  className,
  onSearch,
  initialQuery = "",
  autoFocus = false,
}: MobileSearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [isExpanded, setIsExpanded] = useState(!!initialQuery || autoFocus)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { trigger, patterns } = useHaptic()

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  const handleExpand = useCallback(() => {
    setIsExpanded(true)
    trigger(patterns.light)
  }, [trigger, patterns.light])

  const handleCollapse = useCallback(() => {
    setIsExpanded(false)
    setQuery("")
    trigger(patterns.light)
  }, [trigger, patterns.light])

  const handleClear = useCallback(() => {
    setQuery("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
    trigger(patterns.light)
  }, [trigger, patterns.light])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (query.trim()) {
        if (onSearch) {
          onSearch(query.trim())
        } else {
          router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        }
        trigger(patterns.medium)
      }
    },
    [query, onSearch, router, trigger, patterns.medium],
  )

  return (
    <div className={cn("relative h-12", className)}>
      {isExpanded ? (
        <form onSubmit={handleSubmit} className="flex items-center w-full h-full">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 flex-shrink-0"
            onClick={handleCollapse}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>

          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="search"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 pl-3 pr-10 w-full"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />

            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>

          <Button type="submit" variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      ) : (
        <Button variant="ghost" size="icon" className="h-10 w-10 absolute right-0" onClick={handleExpand}>
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      )}
    </div>
  )
}
