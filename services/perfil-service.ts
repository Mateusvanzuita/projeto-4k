// src/services/perfil-service.ts
import { apiService } from "./api-service"

export interface AlunoPerfil {
  nomeCompleto: string
  email: string
  idade?: number
  plano: "MENSAL" | "TRIMESTRAL" | "SEMESTRAL" | "ANUAL"
  tipoPlano: "TREINO" | "DIETA" | "FULL" // 💡 Adicionado campo faltante
  objetivo?: string
  dataInicio: string
  avatar?: string
}

export const perfilService = {
  getPerfil: async (): Promise<AlunoPerfil | null> => {
    try {
      const response = await apiService.get<{ success: boolean; data: AlunoPerfil }>('/api/students/profile/me')
      return response.data; // Retorna o objeto direto que contém tipoPlano
    } catch (error) {
      console.error("Erro ao buscar perfil:", error)
      return null
    }
  }
}