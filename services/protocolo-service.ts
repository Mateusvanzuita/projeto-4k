// src/services/protocolo-service.ts (API REAL)

import type { Protocolo, ProtocoloFormData, StatusProtocolo } from "@/types/protocolo"
import { apiService } from "./api-service"
import type { ApiResponse } from "@/types/api"

// --- Funções de Transformação (Backend -> Frontend) ---
function transformProtocoloFromBackend(back: any): Protocolo {
    return {
        id: back.id,
        alunoId: back.alunoId,
        nome: back.nome,
        descricao: back.descricao,
        status: back.status as StatusProtocolo,
        dataCriacao: new Date(back.dataCriacao),
        dataAtivacao: back.dataAtivacao ? new Date(back.dataAtivacao) : undefined,
        dataValidade: back.dataValidade ? new Date(back.dataValidade) : undefined,
        
        // 🚨 CORREÇÃO: Adicionado check '|| []' para evitar erro de .map() em undefined
        refeicoes: (back.refeicoes || []).map((r: any) => ({
            ...r,
            alimentos: (r.alimentos || []).map((a: any) => ({
                ...a,
                quantidade: parseFloat(a.quantidade) || 0,
                alimento: a.alimento,
            }))
        })),
        
        planosTreino: (back.planosTreino || []).map((p: any) => ({
            ...p,
            exercicios: (p.exercicios || []).map((e: any) => ({
                ...e,
                exercicio: e.exercicio
            }))
        })),

        suplementosProtocolo: back.suplementosProtocolo || [],
        hormoniosProtocolo: back.hormoniosProtocolo || [],
        aluno: back.aluno
    }
}


export const protocoloService = {
  // GET /api/protocolos
getAll: async (params?: { search?: string, status?: StatusProtocolo }): Promise<Protocolo[]> => {
    try {
      const response = await apiService.get<ApiResponse<any>>(`/api/protocolos`)
      
      // ✅ Captura o array de dentro de response.data ou assume vazio
      const rawData = response.data || []
      
      // Se vier dentro de uma propriedade 'protocolos' (dependendo do seu backend)
      const dataArray = Array.isArray(rawData) ? rawData : (rawData.protocolos || [])
      
      return dataArray.map(transformProtocoloFromBackend)
    } catch (error) {
      console.error("❌ Erro no getAll Protocolos:", error)
      return []
    }
  },

  // GET /api/protocolos/:id
  getById: async (id: string): Promise<Protocolo | null> => {
    try {
      const response = await apiService.get<ApiResponse<any>>(`/api/protocolos/${id}`)
      return response.data ? transformProtocoloFromBackend(response.data) : null
    } catch (error) {
      console.error("Error fetching protocolo by ID:", error)
      return null
    }
  },

  // POST /api/protocolos
  create: async (data: ProtocoloFormData): Promise<Protocolo> => {
    try {
      const response = await apiService.post<ApiResponse<any>>(`/api/protocolos`, data)
      return transformProtocoloFromBackend(response.data)
    } catch (error) {
      console.error("Error creating protocolo:", error)
      throw error
    }
  },

  // PUT /api/protocolos/:id
  update: async (id: string, data: Partial<ProtocoloFormData>): Promise<Protocolo> => {
    try {
      const response = await apiService.put<ApiResponse<any>>(`/api/protocolos/${id}`, data)
      return transformProtocoloFromBackend(response.data)
    } catch (error) {
      console.error("Error updating protocolo:", error)
      throw error
    }
  },

  // DELETE /api/protocolos/:id
  delete: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`/api/protocolos/${id}`)
    } catch (error) {
      console.error("Error deleting protocolo:", error)
      throw error
    }
  },

  // POST /api/protocolos/:id/clone
  clone: async (id: string): Promise<Protocolo> => {
    try {
      const response = await apiService.post<ApiResponse<any>>(`/api/protocolos/${id}/clone`)
      return transformProtocoloFromBackend(response.data)
    } catch (error) {
      console.error("Error cloning protocolo:", error)
      throw error
    }
  },

  exportPDF: async (id: string): Promise<Blob> => {
    // Implementação de mock ou chamada real para PDF
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return new Blob(["Mock PDF content"], { type: "application/pdf" })
  },
}