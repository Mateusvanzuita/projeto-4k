// Conteúdo do suplemento-service.ts atualizado

import type { Suplemento, SuplementoFormData, CategoriaSuplemento } from "@/types/suplemento"
import { apiService } from "./api-service"

// ✅ Interface que representa a RESPOSTA REAL da API
interface SuplementoListResponse {
  success: boolean
  message: string
  data: any[]  // ← O array vem direto em "data", não em "data.suplementos"
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

function transformSuplementoFromBackend(back: any): Suplemento {
  return {
    id: back.id,
    nomeSuplemento: back.nomeSuplemento,
    nomeManipulado: back.nomeManipulado,
    // Garante que SUPLEMENTO vire suplemento para as cores funcionarem
    tipo: back.tipo.toLowerCase() as Suplemento["tipo"], 
    categoria: back.categoria,
    observacoes: back.observacoes || "",
    contraindicacoes: back.contraindicacoes || "",
    createdAt: new Date(back.createdAt),
    updatedAt: new Date(back.updatedAt),
  }
}

export const suplementoService = {
  // LISTAGEM (com paginação e filtros)
  getAll: async (params?: { 
      page?: number; 
      limit?: number; 
      categoria?: string; 
      tipo?: string; // Adicionado parâmetro de tipo
      nome?: string 
    }) => {
      try {
        const queryParams = new URLSearchParams()
        if (params?.page) queryParams.append("page", params.page.toString())
        if (params?.limit) queryParams.append("limit", params.limit.toString())
        if (params?.categoria && params.categoria !== "todos") queryParams.append("categoria", params.categoria)
        if (params?.tipo && params.tipo !== "todos") queryParams.append("tipo", params.tipo.toUpperCase()) // Backend espera UPPERCASE
        if (params?.nome) queryParams.append("nome", params.nome)

        const endpoint = `/api/suplementos${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

        const response = await apiService.get<SuplementoListResponse>(endpoint)
        const transformedData = response.data.map(transformSuplementoFromBackend)

        return {
          suplementos: transformedData,
          pagination: response.pagination,
        }
      } catch (error) {
        console.error("Error fetching suplementos:", error)
        throw error
      }
    },

  // CRIAÇÃO
  create: async (data: SuplementoFormData): Promise<Suplemento> => {
    try {
      const dataToBackend = {
        ...data,
        tipo: data.tipo.toUpperCase(),
        categoria: data.categoria.toUpperCase(),
      }

      const response = await apiService.post<{ success: boolean; data: any }>(
        `/api/suplementos`,
        dataToBackend
      )
      return transformSuplementoFromBackend(response.data)
    } catch (error) {
      console.error("Error creating suplemento:", error)
      throw error
    }
  },

  // ATUALIZAÇÃO
  update: async (id: string, data: SuplementoFormData): Promise<Suplemento> => {
    try {
      const dataToBackend = {
        ...data,
        tipo: data.tipo.toUpperCase(),
        categoria: data.categoria.toUpperCase(),
      }
      const response = await apiService.put<{ success: boolean; data: any }>(
        `/api/suplementos/${id}`,
        dataToBackend
      )
      return transformSuplementoFromBackend(response.data)
    } catch (error) {
      console.error("Error updating suplemento:", error)
      throw error
    }
  },

  // DELEÇÃO
  delete: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`/api/suplementos/${id}`)
    } catch (error) {
      console.error("Error deleting suplemento:", error)
      throw error
    }
  },
}