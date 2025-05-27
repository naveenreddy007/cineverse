"use client"

import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"

interface ToastNotificationProps {
  title: string
  description?: string
  variant?: "default" | "destructive" | "success"
  duration?: number
  trigger: boolean
  onComplete?: () => void
}

export function UIToastNotification({
  title,
  description,
  variant = "default",
  duration = 3000,
  trigger,
  onComplete,
}: ToastNotificationProps) {
  const { toast } = useToast()

  useEffect(() => {
    if (trigger) {
      toast({
        title,
        description,
        variant,
        duration,
      })

      if (onComplete) {
        onComplete()
      }
    }
  }, [trigger, title, description, variant, duration, toast, onComplete])

  return null
}
