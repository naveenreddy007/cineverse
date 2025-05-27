"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useHaptic } from "@/hooks/use-haptic"

interface MobileFriendlyFormProps {
  children: React.ReactNode
  onSubmit: (data: FormData) => Promise<void> | void
  submitText?: string
  className?: string
  disabled?: boolean
}

export function MobileFriendlyForm({
  children,
  onSubmit,
  submitText = "Submit",
  className,
  disabled = false,
}: MobileFriendlyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { trigger, patterns } = useHaptic()

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (disabled || isSubmitting) return

      trigger(patterns.medium)
      setIsSubmitting(true)

      try {
        const formData = new FormData(event.currentTarget)
        await onSubmit(formData)
      } catch (error) {
        console.error("Form submission error:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSubmit, disabled, isSubmitting, trigger, patterns.medium],
  )

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)} noValidate>
      {children}

      <Button type="submit" className="w-full h-12 text-base" disabled={disabled || isSubmitting}>
        {isSubmitting ? "Submitting..." : submitText}
      </Button>
    </form>
  )
}
