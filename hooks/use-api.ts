"use client"

import { useState, useCallback } from "react"
import { apiService } from "@/services/api-service"

interface UseApiOptions {
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}

export function useApi<T>(options?: UseApiOptions) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const execute = useCallback(
    async (method: "get" | "post" | "put" | "patch" | "delete", endpoint: string, payload?: unknown) => {
      setIsLoading(true)
      setError(null)

      try {
        let result: T
        switch (method) {
          case "get":
            result = await apiService.get<T>(endpoint)
            break
          case "post":
            result = await apiService.post<T>(endpoint, payload)
            break
          case "put":
            result = await apiService.put<T>(endpoint, payload)
            break
          case "patch":
            result = await apiService.patch<T>(endpoint, payload)
            break
          case "delete":
            result = await apiService.delete<T>(endpoint)
            break
        }

        setData(result)
        options?.onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error")
        setError(error)
        options?.onError?.(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [options],
  )

  const get = useCallback((endpoint: string) => execute("get", endpoint), [execute])

  const post = useCallback((endpoint: string, payload?: unknown) => execute("post", endpoint, payload), [execute])

  const put = useCallback((endpoint: string, payload?: unknown) => execute("put", endpoint, payload), [execute])

  const patch = useCallback((endpoint: string, payload?: unknown) => execute("patch", endpoint, payload), [execute])

  const del = useCallback((endpoint: string) => execute("delete", endpoint), [execute])

  return {
    data,
    error,
    isLoading,
    get,
    post,
    put,
    patch,
    delete: del,
  }
}
