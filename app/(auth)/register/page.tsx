"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, X } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useHaptic } from "@/hooks/use-haptic"
import { MobileLayout } from "@/components/mobile-layout"
import { cn } from "@/lib/utils"

interface PasswordStrength {
  score: number
  feedback: string[]
  isValid: boolean
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isValid: false,
  })

  const { signUp } = useAuth()
  const { lightHaptic, notificationHaptic } = useHaptic()
  const router = useRouter()

  // Password strength checker
  const checkPasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push("At least 8 characters")
    }

    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push("One lowercase letter")
    }

    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push("One uppercase letter")
    }

    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push("One number")
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
      score += 1
    } else {
      feedback.push("One special character")
    }

    return {
      score,
      feedback,
      isValid: score >= 4,
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "password") {
      setPasswordStrength(checkPasswordStrength(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    lightHaptic()

    // Validation
    if (!passwordStrength.isValid) {
      setError("Please create a stronger password")
      setLoading(false)
      notificationHaptic("error")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      notificationHaptic("error")
      return
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions")
      setLoading(false)
      notificationHaptic("error")
      return
    }

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName)

      if (error) {
        setError(error.message)
        notificationHaptic("error")
      } else {
        notificationHaptic("success")
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      notificationHaptic("error")
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrengthColor = (score: number) => {
    if (score < 2) return "bg-red-500"
    if (score < 4) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = (score: number) => {
    if (score < 2) return "Weak"
    if (score < 4) return "Medium"
    return "Strong"
  }

  return (
    <MobileLayout hideFooterNav hideAppBar>
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">Join SidduVerse and discover amazing movies</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => {
                      setShowPassword(!showPassword)
                      lightHaptic()
                    }}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-300",
                            getPasswordStrengthColor(passwordStrength.score),
                          )}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{getPasswordStrengthText(passwordStrength.score)}</span>
                    </div>

                    {passwordStrength.feedback.length > 0 && (
                      <div className="space-y-1">
                        {passwordStrength.feedback.map((item, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <X className="h-3 w-3 text-red-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => {
                      setShowConfirmPassword(!showConfirmPassword)
                      lightHaptic()
                    }}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {formData.confirmPassword && (
                  <div className="flex items-center space-x-2 text-xs">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <Check className="h-3 w-3 text-green-500" />
                        <span className="text-green-500">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3 text-red-500" />
                        <span className="text-red-500">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => {
                    setAcceptTerms(checked as boolean)
                    lightHaptic()
                  }}
                  disabled={loading}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={
                  loading ||
                  !formData.fullName ||
                  !formData.email ||
                  !passwordStrength.isValid ||
                  formData.password !== formData.confirmPassword ||
                  !acceptTerms
                }
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MobileLayout>
  )
}
