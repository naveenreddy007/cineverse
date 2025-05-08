"use client"

import { Bell, Film, Search, Settings, User } from "lucide-react"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Film className="size-8 text-[hsl(var(--neon-magenta))]" />
          <h1 className="text-2xl font-bold tracking-tight">CineVerse</h1>
        </div>

        <div className="ml-auto mr-4 flex flex-1 max-w-md relative">
          <div className="group relative flex w-full items-center">
            <Search className="absolute left-3 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for movies, shows, or directors..."
              className="w-full bg-background/50 pl-10 pr-4 backdrop-blur-sm transition-all focus-visible:bg-background/80 border-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[hsl(var(--neon-magenta))]"></span>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="size-5" />
          </Button>
          <Avatar className="h-9 w-9 border-2 border-primary/10">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-muted pb-2">
        <nav className="flex gap-6">
          {["Overview", "Watchlist", "Collections", "Reviews"].map((item) => (
            <Button
              key={item}
              variant="link"
              className={item === "Overview" ? "text-[hsl(var(--neon-blue))] font-medium" : "text-muted-foreground"}
            >
              {item}
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Last updated:</span>
          <span className="text-sm">Just now</span>
        </div>
      </div>
    </header>
  )
}

