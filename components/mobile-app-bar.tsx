"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowLeft, MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"

interface MobileAppBarProps {
  title?: string
  showBack?: boolean
  actions?: React.ReactNode
}

export function MobileAppBar({ title, showBack = false, actions }: MobileAppBarProps) {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          {title && <h1 className="text-lg font-semibold truncate">{title}</h1>}
        </div>
        {actions || (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
