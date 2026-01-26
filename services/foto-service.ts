// src/services/foto-service.ts
import { apiService } from "./api-service"

export interface RegistroEvolucao {
  id: string
  dataCriacao: string
  peso: number
  observacao?: string
  fotos: { url: string }[]
}

export const fotoService = {
  // Busca o histórico de fotos do aluno logado
getHistorico: async (): Promise<RegistroEvolucao[]> => {
    try {
      const response = await apiService.get<{ success: boolean; data: RegistroEvolucao[] }>('/api/evolucao/fotos')
      // ✅ A resposta da sua API coloca a lista dentro de .data
      return response.data || [] 
    } catch (error) {
      console.error("Erro ao buscar histórico de fotos:", error)
      return []
    }
  },

  // Envia novas fotos e dados de peso
enviarFotos: async (formData: FormData): Promise<void> => {
    try {
      // 🚨 REMOVIDO o header manual. O api-service atualizado e o 
      // navegador cuidarão disso agora.
      await apiService.post('/api/evolucao/fotos', formData)
    } catch (error) {
      console.error("Erro ao enviar fotos:", error)
      throw error
    }
  }
}