import { authService } from "./auth-service"

class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"

  /**
   * Generic fetch wrapper with authentication
   */
  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...authService.getAuthHeader(),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Handle token expiration
      if (response.status === 401) {
        try {
          await authService.refreshAccessToken()
          // Retry request with new token
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...headers,
              ...authService.getAuthHeader(),
            },
          })
          if (!retryResponse.ok) {
            throw new Error("Request failed after token refresh")
          }
          return retryResponse.json()
        } catch {
          // Refresh failed, clear auth and redirect to login
          authService.clearStorage()
          window.location.href = "/auth/login"
          throw new Error("Session expired")
        }
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || "Request failed")
      }

      return response.json()
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: "GET" })
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: "DELETE" })
  }
}

export const apiService = new ApiService()
