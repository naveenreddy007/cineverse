"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film, Home, Search, Star, User, Calendar, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardNav({ className, ...props }: DashboardNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Discover",
      href: "/dashboard/discover",
      icon: Search,
    },
    {
      name: "Movies",
      href: "/dashboard/movies",
      icon: Film,
    },
    {
      name: "Reviews",
      href: "/dashboard/reviews",
      icon: Star,
    },
    {
      name: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
  ]

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="relative h-6 w-6">
          <div className="absolute h-full w-full rounded-full bg-primary/20 blur-sm"></div>
          <div className="absolute h-full w-full rounded-full bg-primary/40"></div>
          <Film className="absolute h-full w-full text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight">CineVerse</span>
      </Link>

      <nav className="grid gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t pt-4">
        <div className="grid gap-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
