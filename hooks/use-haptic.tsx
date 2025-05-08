"use client"

export type HapticPattern = number | number[]

export const HAPTIC_PATTERNS = {
  success: [15, 100, 30], // Strong success feedback (like, bookmark)
  light: 10, // Light feedback (button press)
  medium: 25, // Medium feedback (navigation)
  error: [10, 50, 50, 50, 10], // Error pattern
  submit: [15, 50, 100], // Form submission
  tabSwitch: 15, // Tab switching
}

export function useHaptic() {
  const trigger = (pattern: HapticPattern) => {
    // Check if the device supports vibration
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }

  return {
    trigger,
    patterns: HAPTIC_PATTERNS,
  }
}

