import type React from "react"
import { UILoading } from "@/components/ui-loading"
import { UIErrorState } from "@/components/ui-error-state"

interface ContentLoaderProps {
  isLoading: boolean
  error?: string | null
  loadingText?: string
  children: React.ReactNode
}

export function UIContentLoader({ isLoading, error, loadingText = "Loading...", children }: ContentLoaderProps) {
  if (isLoading) {
    return <UILoading text={loadingText} />
  }

  if (error) {
    return <UIErrorState message={error} />
  }

  return <>{children}</>
}
