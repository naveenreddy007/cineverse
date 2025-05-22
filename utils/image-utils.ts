import type React from "react"
/**
 * Utility functions for handling images
 */

import * as THREE from "three"

/**
 * Fallback image URL to use when an image fails to load
 */
export const DEFAULT_FALLBACK_IMAGE = "/placeholder.svg?height=200&width=200"

/**
 * Get a TMDB image URL with the specified size
 * @param path The image path from TMDB
 * @param size The size of the image (w500, original, etc.)
 * @returns The full image URL
 */
export const getTMDBImageUrl = (path: string, size = "w500"): string => {
  if (!path) return DEFAULT_FALLBACK_IMAGE
  return `https://image.tmdb.org/t/p/${size}/${path.replace(/^\//, "")}`
}

/**
 * Handle image loading errors by setting a fallback image
 * @param event The error event
 * @param fallbackSrc Optional custom fallback image source
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = DEFAULT_FALLBACK_IMAGE,
) => {
  event.currentTarget.src = fallbackSrc
}

/**
 * Create a texture loader with CORS settings
 * @returns A configured THREE.TextureLoader
 */
export const createCORSTextureLoader = () => {
  const loader = new THREE.TextureLoader()
  loader.crossOrigin = "anonymous"
  return loader
}
