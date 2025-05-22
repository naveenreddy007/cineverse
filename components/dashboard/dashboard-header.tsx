"use client"

import Link from "next/link"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Welcome to SidduVerse</h1>
        <p className="text-muted-foreground">Your personal movie dashboard</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search movies..."
            className="pl-8 bg-background/60 border-border/50 w-[200px] lg:w-[300px]"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-neon-blue text-black">
            3
          </Badge>
        </Button>

        <Link href="/dashboard/profile">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/150?img=7" alt="User" />
            <AvatarFallback>SD</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  )
}
