"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService } from "@/services/auth-service"
import type { User } from "@/types/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<User>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount and validate with backend
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getStoredUser()
        const token = authService.getToken()

        if (storedUser && token) {
          // Validate token with backend
          try {
            const profile = await authService.getProfile()
            setUser(profile)
          } catch (error) {
            console.error("Token validation failed:", error)
            authService.clearStorage()
            setUser(null)
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string, rememberMe = false): Promise<User> => {
    try {
      const response = await authService.login(email, password)

      // Store token and user data
      authService.storeToken(response.token, rememberMe)
      authService.storeUser(response.user, rememberMe)

      setUser(response.user)
      return response.user
    } catch (error) {
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      authService.clearStorage()
      setUser(null)
    }
  }

  const refreshToken = async (): Promise<void> => {
    // Backend doesn't have refresh endpoint yet
    // If needed in future, implement here
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
