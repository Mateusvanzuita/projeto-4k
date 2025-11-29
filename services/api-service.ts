import { authService } from "./auth-service"

class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api"

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

      // Handle token expiration or unauthorized
      if (response.status === 401) {
        authService.clearStorage()
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login"
        }
        throw new Error("Sessão expirada. Faça login novamente.")
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Erro na requisição" }))
        throw new Error(error.message || `Request failed with status ${response.status}`)
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return response.json()
      }

      return {} as T
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
