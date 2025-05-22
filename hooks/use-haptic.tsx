"use client"

import { useCallback } from "react"
import { useMobile } from "@/hooks/use-mobile"

// Vibration patterns
const vibrationPatterns = {
  light: [10],
  medium: [15],
  heavy: [30],
  success: [10, 30, 10],
  error: [50, 30, 50],
  warning: [30, 20, 30],
  notification: [10, 20, 10, 20, 10],
}

type VibrationPattern = keyof typeof vibrationPatterns

export function useHaptic() {
  const { isTouch } = useMobile()

  const trigger = useCallback(
    (pattern: VibrationPattern | number[]) => {
      if (!isTouch) return

      // Check if vibration API is available
      if (!window.navigator.vibrate) return

      // If pattern is a key from vibrationPatterns, use that pattern
      if (typeof pattern === "string" && pattern in vibrationPatterns) {
        window.navigator.vibrate(vibrationPatterns[pattern])
      }
      // If pattern is an array, use it directly
      else if (Array.isArray(pattern)) {
        window.navigator.vibrate(pattern)
      }
    },
    [isTouch],
  )

  return {
    trigger,
    patterns: vibrationPatterns,
    isAvailable: isTouch && !!window?.navigator?.vibrate,
  }
}
