// src/services/api-service.ts
import { authService } from "./auth-service"

class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"

  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    // 💡 LOG DE DEBUG: Verifica o tipo do corpo antes de processar
    console.log(`🌐 [API Request] ${options.method || 'GET'} ${endpoint}`);
    
    const isFormData = options.body instanceof FormData
    console.log("📦 Is FormData?", isFormData);

    const headers: Record<string, string> = {
      ...authService.getAuthHeader(),
      ...(options.headers as Record<string, string>),
    }

    // 🚨 REGRA DE OURO: Se for FormData, NÃO defina Content-Type. 
    // O navegador precisa gerar o 'boundary' sozinho.
    if (!isFormData) {
      headers["Content-Type"] = "application/json"
    } else {
      console.log("📎 Enviando arquivos binários, removendo Content-Type manual...");
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      console.log(`📥 [API Response] Status: ${response.status}`);

      if (response.status === 401) {
        authService.clearStorage()
        if (typeof window !== "undefined") window.location.href = "/auth/login"
        throw new Error("Sessão expirada.")
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Erro na requisição" }))
        console.error("❌ Erro detalhado da API:", error);
        throw new Error(error.message || "Erro desconhecido")
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return response.json()
      }

      return {} as T
    } catch (error) {
      console.error("🚨 Falha na comunicação com a API:", error)
      throw error
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    // 💡 LOG DE DEBUG: Verifica o conteúdo do dado antes de enviar
    if (data instanceof FormData) {
      console.log("📝 Campos no FormData:");
      data.forEach((value, key) => console.log(`   - ${key}:`, value instanceof File ? `File (${value.name})` : value));
    }

    return this.fetch<T>(endpoint, {
      method: "POST",
      // 💡 Se for FormData, envia o objeto. Se não, transforma em string JSON.
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
      return this.fetch<T>(endpoint, {
        method: "PUT",
        body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
      })
    }

  async get<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: "GET" })
  }

// ✅ ADICIONADO: Método PATCH para corrigir o erro do console
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: "PATCH",
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
    })
  }

  // ✅ ADICIONADO: Método DELETE para completude do serviço
  async delete<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: "DELETE" })
  }
}

export const apiService = new ApiService()