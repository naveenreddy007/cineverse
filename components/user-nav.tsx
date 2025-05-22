"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BellIcon } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

export function UserNav() {
  const { user, signOut } = useAuth()

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative bg-secondary/20 border-secondary/50">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-neon-magenta" />
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-80 overflow-auto">
            <DropdownMenuItem className="cursor-pointer flex flex-col items-start p-3">
              <div className="flex w-full gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 flex-1">
                  <p className="text-sm font-medium leading-none">Sarah liked your review of "Oppenheimer"</p>
                  <p className="text-xs text-muted-foreground">2 min ago</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-neon-blue mt-1" />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex flex-col items-start p-3">
              <div className="flex w-full gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
                  <AvatarFallback>JC</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 flex-1">
                  <p className="text-sm font-medium leading-none">
                    James replied to your comment in "Best sci-fi movies of the decade?"
                  </p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex flex-col items-start p-3">
              <div className="flex w-full gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
                  <AvatarFallback>ML</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 flex-1">
                  <p className="text-sm font-medium leading-none">New movie recommendation: "The French Dispatch"</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </DropdownMenuItem>
          </div>
          <DropdownMenuSeparator />
          <div className="p-2">
            <Button variant="outline" size="sm" className="w-full">
              View all notifications
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border border-border/50">
              <AvatarImage src={user?.avatar || "/placeholder.svg?height=40&width=40"} alt="User avatar" />
              <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/dashboard/profile" className="flex w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/dashboard/settings" className="flex w-full">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/dashboard/watchlist" className="flex w-full">
                Watchlist
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={signOut}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
