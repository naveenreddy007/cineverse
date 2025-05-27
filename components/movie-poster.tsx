"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageOff } from "lucide-react"

interface MoviePosterProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  aspectRatio?: "portrait" | "landscape" | "square"
  fallbackClassName?: string
}

export function MoviePoster({
  src,
  alt,
  width,
  height,
  className = "",
  aspectRatio = "portrait",
  fallbackClassName = "",
}: MoviePosterProps) {
  const [error, setError] = useState(false)

  const aspectRatioClasses = {
    portrait: "aspect-[2/3]",
    landscape: "aspect-[16/9]",
    square: "aspect-square",
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-black/60 ${aspectRatioClasses[aspectRatio]} ${className} ${fallbackClassName}`}
      >
        <ImageOff className="h-8 w-8 text-muted-foreground" />
      </div>
    )
  }

  if (width && height) {
    return (
      <div className={`relative ${aspectRatioClasses[aspectRatio]} ${className}`}>
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className="object-cover"
          onError={() => setError(true)}
          unoptimized
        />
      </div>
    )
  }

  return (
    <div className={`relative ${aspectRatioClasses[aspectRatio]} ${className}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
        unoptimized
      />
    </div>
  )
}
