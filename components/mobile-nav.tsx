"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film, Menu, X, Home, Search, Star, User, Calendar, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [open, setOpen] = useState(false)
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="relative h-6 w-6">
              <div className="absolute h-full w-full rounded-full bg-primary/20 blur-sm"></div>
              <div className="absolute h-full w-full rounded-full bg-primary/40"></div>
              <Film className="absolute h-full w-full text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">SidduVerse</span>
          </Link>
          <div className="ml-auto">
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
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
        </div>

        <div className="mt-auto border-t p-4">
          <div className="grid gap-1">
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
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
      </SheetContent>
    </Sheet>
  )
}
