import type { LoginResponse, User } from "@/types/auth"

const STORAGE_KEYS = {
  TOKEN: "4k_token",
  USER: "4k_user",
}

class AuthService {
  private apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api"

  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Erro ao fazer login" }))
        throw new Error(error.message || "E-mail ou senha inválidos")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await fetch(`${this.apiUrl}/api/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
      })

      if (!response.ok) {
        throw new Error("Falha ao obter perfil")
      }

      return response.json()
    } catch (error) {
      console.error("Get profile error:", error)
      throw error
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
      this.clearStorage()
      if (typeof window !== "undefined") {
        // Redirecionamento forçado para garantir limpeza de cache/estado do React
        window.location.href = "/auth/login"
      }
    }

  /**
   * Store authentication token
   */
  storeToken(token: string, persistent = false): void {
    const storage = persistent ? localStorage : sessionStorage
    storage.setItem(STORAGE_KEYS.TOKEN, token)
  }

  /**
   * Store user data
   */
  storeUser(user: User, persistent = false): void {
    const storage = persistent ? localStorage : sessionStorage
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.TOKEN)
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
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
