"use client"

import { useState, useEffect, useCallback } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"
import { ImageOff } from "lucide-react"

interface OptimizedImageProps extends Omit<ImageProps, "onError" | "onLoad"> {
  fallbackClassName?: string
  showLoadingPlaceholder?: boolean
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallbackClassName,
  showLoadingPlaceholder = true,
  ...props
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(showLoadingPlaceholder)
  const [error, setError] = useState(false)

  const handleLoad = useCallback(() => {
    setLoading(false)
  }, [])

  const handleError = useCallback(() => {
    setLoading(false)
    setError(true)
  }, [])

  // Reset states if src changes
  useEffect(() => {
    setLoading(showLoadingPlaceholder)
    setError(false)
  }, [src, showLoadingPlaceholder])

  if (error) {
    return (
      <div className={cn("flex items-center justify-center bg-muted", className, fallbackClassName)}>
        <ImageOff className="h-8 w-8 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {loading && <div className="absolute inset-0 bg-muted animate-pulse" />}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        className={cn("image-fade-in", loading ? "" : "loaded")}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  )
}
