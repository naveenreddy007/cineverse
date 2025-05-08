"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Mock user type
export type User = {
  id: string
  email: string
  name: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; data: any }>
  signOut: () => void
}

// Demo user credentials
const DEMO_USER = {
  id: "demo-user-id",
  email: "demo@example.com",
  password: "password123",
  name: "Demo User",
  avatar: "https://i.pravatar.cc/150?img=7",
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("movieDashboardUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simple mock authentication
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const userData = {
        id: DEMO_USER.id,
        email: DEMO_USER.email,
        name: DEMO_USER.name,
        avatar: DEMO_USER.avatar,
      }

      setUser(userData)
      localStorage.setItem("movieDashboardUser", JSON.stringify(userData))
      return { error: null }
    }

    return { error: { message: "Invalid email or password" } }
  }

  const signUp = async (email: string, password: string, name: string) => {
    // For demo purposes, just create a new user with random ID
    const userData = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      email,
      name,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    }

    setUser(userData)
    localStorage.setItem("movieDashboardUser", JSON.stringify(userData))

    return { error: null, data: { user: userData } }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("movieDashboardUser")
    router.push("/login")
  }

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

