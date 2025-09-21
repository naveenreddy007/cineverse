"use client"

import { ArrowLeft, Search, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MobileAppBarProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
}

export function MobileAppBar({ title = "SidduVerse", showBack, onBack }: MobileAppBarProps) {
  const router = useRouter()
  const { user } = useAuth()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push("/search")}>
            <Search className="h-4 w-4" />
          </Button>

          {user ? (
            <Avatar className="h-8 w-8" onClick={() => router.push("/profile")}>
              <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{user.user_metadata?.name?.[0] || user.email?.[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
