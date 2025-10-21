import type { LoginResponse, User } from "@/types/auth"

const STORAGE_KEYS = {
  ACCESS_TOKEN: "4k_access_token",
  REFRESH_TOKEN: "4k_refresh_token",
  USER: "4k_user",
}

class AuthService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api"

  /**
   * Login user with email and password
   * TODO: Replace mock implementation with actual API call
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // MOCK IMPLEMENTATION - Replace with actual API call
    // Example:
    // const response = await fetch(`${this.apiUrl}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // })
    // if (!response.ok) throw new Error('Login failed')
    // return response.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation
    if (email === "coach@4kteam.com" && password === "coach123") {
      return {
        accessToken: "mock_access_token_coach",
        refreshToken: "mock_refresh_token_coach",
        user: {
          id: "1",
          email: "coach@4kteam.com",
          name: "Coach Demo",
          role: "coach",
        },
      }
    } else if (email === "aluno@4kteam.com" && password === "aluno123") {
      return {
        accessToken: "mock_access_token_aluno",
        refreshToken: "mock_refresh_token_aluno",
        user: {
          id: "2",
          email: "aluno@4kteam.com",
          name: "Aluno Demo",
          role: "aluno",
        },
      }
    }

    throw new Error("E-mail ou senha inválidos")
  }

  /**
   * Logout user
   * TODO: Implement API call to invalidate tokens
   */
  async logout(): Promise<void> {
    // TODO: Call backend to invalidate tokens
    // await fetch(`${this.apiUrl}/auth/logout`, {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${this.getAccessToken()}` },
    // })
  }

  /**
   * Refresh access token using refresh token
   * TODO: Implement actual token refresh logic
   */
  async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    // TODO: Replace with actual API call
    // const response = await fetch(`${this.apiUrl}/auth/refresh`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ refreshToken }),
    // })
    // if (!response.ok) throw new Error('Token refresh failed')
    // const { accessToken } = await response.json()
    // this.storeAccessToken(accessToken)
    // return accessToken

    // Mock implementation
    return "mock_new_access_token"
  }

  /**
   * Store authentication tokens
   */
  storeTokens(accessToken: string, refreshToken: string, persistent = false): void {
    const storage = persistent ? localStorage : sessionStorage
    storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  }

  /**
   * Store user data
   */
  storeUser(user: User): void {
    const storage = this.getRefreshToken()
      ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        ? localStorage
        : sessionStorage
      : sessionStorage
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER) || sessionStorage.getItem(STORAGE_KEYS.USER)
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  /**
   * Clear all stored authentication data
   */
  clearStorage(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    })
  }

  /**
   * Get authorization header for API requests
   */
  getAuthHeader(): Record<string, string> {
    const token = this.getAccessToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
}

export const authService = new AuthService()
