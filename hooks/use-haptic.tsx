"use client"

import { useCallback } from "react"

export function useHaptic() {
  const triggerHaptic = useCallback((type: "light" | "medium" | "heavy" = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
      }
      navigator.vibrate(patterns[type])
    }
  }, [])

  return { triggerHaptic }
}

// Default export for compatibility
export default useHaptic
