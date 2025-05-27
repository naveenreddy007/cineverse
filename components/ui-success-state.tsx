"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuccessStateProps {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function UISuccessState({ title, message, actionLabel, onAction }: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-green-500/20 p-3 mb-4">
        <CheckCircle className="h-8 w-8 text-green-500" />
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">{message}</p>
      {actionLabel && onAction && (
        <Button className="bg-neon-blue text-black hover:bg-neon-blue/80" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
