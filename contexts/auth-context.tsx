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

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getStoredUser()
        if (storedUser) {
          setUser(storedUser)
          // TODO: Validate token with backend when integrated
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // Setup token refresh interval
  useEffect(() => {
    if (user) {
      const interval = setInterval(
        async () => {
          try {
            await refreshToken()
          } catch (error) {
            console.error("Token refresh failed:", error)
            await logout()
          }
        },
        14 * 60 * 1000, // Refresh every 14 minutes (tokens usually expire in 15 min)
      )

      return () => clearInterval(interval)
    }
  }, [user])

  const login = async (email: string, password: string, rememberMe = false): Promise<User> => {
    try {
      const response = await authService.login(email, password)

      // Store tokens and user data
      authService.storeTokens(response.accessToken, response.refreshToken, rememberMe)
      authService.storeUser(response.user)

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
    try {
      const newAccessToken = await authService.refreshAccessToken()
      // Token refreshed successfully
    } catch (error) {
      throw error
    }
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
