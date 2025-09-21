"use client"

import { useCallback } from "react"

export function useHaptic() {
  const hapticFeedback = useCallback((pattern: number | number[]) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }, [])

  return {
    light: () => hapticFeedback(10),
    medium: () => hapticFeedback(25),
    heavy: () => hapticFeedback(50),
    success: () => hapticFeedback([15, 100, 30]),
    error: () => hapticFeedback([10, 50, 50, 50, 10]),
    hapticFeedback,
  }
}
