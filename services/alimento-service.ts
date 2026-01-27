import { Alimento } from "@/types/alimento"
import { apiService } from "./api-service"

interface AlimentoListResponse {
  success: boolean
  data: {
    alimentos: Alimento[]
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

// 📄 Transformador (caso seu backend retorne outro formato)
function transformAlimentoFromBackend(back: any): Alimento {
  return {
    id: back.id,
    nome: back.nome,
    categoria: back.categoria,
    observacoes: back.observacoes || "",
    createdAt: new Date(back.createdAt),
    updatedAt: new Date(back.updatedAt),
  }
}

export const alimentoService = {
  // LISTAGEM (com paginação e filtros)
getAll: async (params?: { page?: number; limit?: number; tipo?: string; nome?: string }) => {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append("page", params.page.toString())
      if (params?.limit) queryParams.append("limit", params.limit.toString())
      
      // ✅ CORREÇÃO: Mudar de 'tipo' para 'categoria' para casar com o Backend
      if (params?.tipo && params.tipo !== 'todos') {
        queryParams.append("categoria", params.tipo.toUpperCase())
      }
      
      // ✅ CORREÇÃO: Mudar de 'nome' para 'nome' (verificar se o controller usa 'nome')
      if (params?.nome) queryParams.append("nome", params.nome)

      const endpoint = `/api/alimentos${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
      const response = await apiService.get<AlimentoListResponse>(endpoint)

      const rawAlimentos = response.data?.alimentos || []
      const pagination = response.data?.pagination || null

      // Mapeia os dados garantindo que o objeto Alimento tenha as propriedades corretas
      const alimentos = rawAlimentos.map(transformAlimentoFromBackend)

      return { alimentos, pagination }
    } catch (error) {
      console.error("❌ Error fetching alimentos:", error)
      throw error
    }
  },

  getById: async (id: string): Promise<Alimento | null> => {
    try {
      const response = await apiService.get<{ success: boolean; data: any }>(`/api/alimentos/${id}`)
      return response.data ? transformAlimentoFromBackend(response.data) : null
    } catch (error) {
      console.error("Error fetching alimento:", error)
      return null
    }
  },

  create: async (data: Alimento): Promise<Alimento> => {
    try {
      const response = await apiService.post<{ success: boolean; data: any }>(`/api/alimentos`, data)
      return transformAlimentoFromBackend(response.data)
    } catch (error) {
      console.error("Error creating alimento:", error)
      throw error
    }
  },

  update: async (id: string, data: Partial<Alimento>): Promise<Alimento> => {
    try {
      const response = await apiService.put<{ success: boolean; data: any }>(`/api/alimentos/${id}`, data)
      return transformAlimentoFromBackend(response.data)
    } catch (error) {
      console.error("Error updating alimento:", error)
      throw error
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`/api/alimentos/${id}`)
    } catch (error) {
      console.error("Error deleting alimento:", error)
      throw error
    }
  },

  filterByTipo: async (tipo: string): Promise<Alimento[]> => {
    try {
      const response = await apiService.get<{ success: boolean; data: any[] }>(
        `/api/alimentos/categoria/${tipo}`
      )
      return response.data.map(transformAlimentoFromBackend)
    } catch (error) {
      console.error("Error filtering alimentos:", error)
      throw error
    }
  },

  search: async (termo: string): Promise<Alimento[]> => {
    try {
      const response = await apiService.get<{ success: boolean; data: any[] }>(
        `/api/alimentos?search=${termo}`
      )
      return response.data.map(transformAlimentoFromBackend)
    } catch (error) {
      console.error("Error searching alimentos:", error)
      throw error
    }
  },
}