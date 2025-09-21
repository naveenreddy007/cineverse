"use client"

import { useCallback } from "react"

type HapticIntensity = "light" | "medium" | "heavy"

export function useHaptic() {
  const triggerHaptic = useCallback((intensity: HapticIntensity = "light") => {
    // Check if the device supports haptic feedback
    if (typeof window !== "undefined" && "navigator" in window) {
      // For iOS devices with haptic feedback
      if ("vibrate" in navigator) {
        const patterns = {
          light: [10],
          medium: [20],
          heavy: [30],
        }
        navigator.vibrate(patterns[intensity])
      }

      // For devices with more advanced haptic API
      if ("hapticFeedback" in navigator) {
        try {
          // @ts-ignore - This is a newer API not in all type definitions
          navigator.hapticFeedback.impact(intensity)
        } catch (error) {
          console.log("Haptic feedback not supported")
        }
      }
    }
  }, [])

  const triggerSuccess = useCallback(() => {
    triggerHaptic("light")
  }, [triggerHaptic])

  const triggerWarning = useCallback(() => {
    triggerHaptic("medium")
  }, [triggerHaptic])

  const triggerError = useCallback(() => {
    triggerHaptic("heavy")
  }, [triggerHaptic])

  return {
    triggerHaptic,
    triggerSuccess,
    triggerWarning,
    triggerError,
  }
}
