"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useHaptic } from "@/hooks/use-haptic"

interface MobileBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  showHandle?: boolean
  height?: "auto" | "25" | "50" | "75" | "90"
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
  showHandle = true,
  height = "auto",
}: MobileBottomSheetProps) {
  const [isClosing, setIsClosing] = useState(false)
  const { trigger, patterns } = useHaptic()

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    trigger(patterns.medium)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300)
  }, [onClose, trigger, patterns.medium])

  const getHeightClass = () => {
    switch (height) {
      case "25":
        return "h-1/4"
      case "50":
        return "h-1/2"
      case "75":
        return "h-3/4"
      case "90":
        return "h-[90vh]"
      default:
        return "max-h-[90vh]"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 touch-manipulation"
            onClick={handleClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-xl overflow-hidden pb-safe",
              getHeightClass(),
              className,
            )}
          >
            {/* Handle */}
            {showHandle && (
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-12 h-1.5 bg-muted rounded-full" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="text-lg font-semibold">{title}</h2>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleClose}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto scrollbar-thin h-full">
              <div className="p-4">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
