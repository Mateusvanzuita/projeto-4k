// src/services/dashboard-service.ts

import { apiService } from "./api-service"
import type { ApiResponse } from "@/types/api"

// Define a estrutura de dados que o backend retorna para o dashboard
export interface DashboardData {
  indicators: {
    totalStudents: number
    activeProtocols: number
    newRegistrations: number
  }
  recentStudents: {
    id: string
    nomeCompleto: string
    email: string
    tipoPlano: string
    dataCriacao: string
  }[]
  newRegistrations: {
    id: string
    nomeCompleto: string
    email: string
    dataCriacao: string
  }[]
}

/**
 * Serviço para interagir com as rotas do Dashboard
 */
export const dashboardService = {
  /**
   * Busca os dados principais do dashboard do Coach
   * GET /api/dashboard
   */
  getCoachDashboard: async (): Promise<DashboardData> => {
    try {
      // Usamos o tipo ApiResponse<DashboardData> que você definiu no api.ts
      const response = await apiService.get<ApiResponse<DashboardData>>("/dashboard")
      
      // O backend retorna os dados dentro da chave 'data' da ApiResponse
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || "Falha ao carregar dados do dashboard.")
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      throw error
    }
  },
}