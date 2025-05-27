"use client"

import type React from "react"

import { forwardRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, X } from "lucide-react"

interface MobileFriendlyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  showClearButton?: boolean
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
}

export const MobileFriendlyInput = forwardRef<HTMLInputElement, MobileFriendlyInputProps>(
  (
    {
      label,
      error,
      className,
      containerClassName,
      labelClassName,
      errorClassName,
      showClearButton = false,
      type = "text",
      ...props
    },
    ref,
  ) => {
    const [inputType, setInputType] = useState(type)
    const [isFocused, setIsFocused] = useState(false)

    const isPassword = type === "password"
    const id = props.id || `input-${Math.random().toString(36).substring(2, 9)}`

    const togglePasswordVisibility = () => {
      setInputType(inputType === "password" ? "text" : "password")
    }

    const clearInput = () => {
      const input = document.getElementById(id) as HTMLInputElement
      if (input) {
        input.value = ""
        input.focus()

        // Trigger change event
        const event = new Event("input", { bubbles: true })
        input.dispatchEvent(event)
      }
    }

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label htmlFor={id} className={cn("text-base", labelClassName)}>
            {label}
          </Label>
        )}

        <div className="relative">
          <Input
            id={id}
            ref={ref}
            type={inputType}
            className={cn("h-12 text-base pr-10", error && "border-red-500 focus-visible:ring-red-500", className)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {inputType === "password" ? (
                <Eye className="h-5 w-5 text-muted-foreground" />
              ) : (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="sr-only">{inputType === "password" ? "Show password" : "Hide password"}</span>
            </button>
          )}

          {showClearButton && !isPassword && props.value && isFocused && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={clearInput}
              tabIndex={-1}
            >
              <X className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Clear input</span>
            </button>
          )}
        </div>

        {error && <p className={cn("text-sm text-red-500", errorClassName)}>{error}</p>}
      </div>
    )
  },
)

MobileFriendlyInput.displayName = "MobileFriendlyInput"
