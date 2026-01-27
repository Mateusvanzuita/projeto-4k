// src/services/hormonio-service.ts (ATUALIZADO)

import type { Hormonio, HormonioFormData, TipoHormonio, CategoriaHormonio, ViaAdministracao } from "@/types/hormonio"
import { apiService } from "./api-service" 

interface HormonioListResponse {
  message: string
  data: Hormonio[]
}

// 📄 Função de Transformação (Backend -> Frontend)
function transformHormonioFromBackend(back: any): Hormonio {
    return {
        id: back.id,
        nome: back.nomeHormonio,
        tipo: back.tipo as TipoHormonio,
        categoria: back.categoria as CategoriaHormonio,
        viaAdministracao: back.viaAdministracao as ViaAdministracao,
        
        // Novos campos de texto longo
        observacoes: back.observacoes || undefined,
        contraindicacoes: back.contraindicacoes || undefined,
        efeitosColaterais: back.efeitosColaterais || undefined,

        // Campos removidos: dose, frequencia, tempoMeiaVida, fabricante
        
        createdAt: new Date(back.createdAt),
        updatedAt: new Date(back.updatedAt),
    }
}

// 📄 Função de Transformação (Frontend -> Backend)
function transformHormonioToBackend(front: HormonioFormData): any {
    return {
        nomeHormonio: front.nome,
        tipo: front.tipo, 
        categoria: front.categoria,
        viaAdministracao: front.viaAdministracao,
        
        // Novos campos de texto longo
        observacoes: front.observacoes || null,
        contraindicacoes: front.contraindicacoes || null,
        efeitosColaterais: front.efeitosColaterais || null,

        // Campos removidos: dosagem, frequencia, tempoMeiaVida, fabricante
    }
}

export const hormonioService = {
  // GET: Listar todos os hormônios
getAll: async (params?: { 
    page?: number; 
    limit?: number; 
    categoria?: string; 
    nome?: string 
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.categoria && params.categoria !== "todos") queryParams.append("categoria", params.categoria);
      if (params?.nome) queryParams.append("nome", params.nome); // Backend espera 'nome'

      const endpoint = `/api/hormonios${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      
      const response = await apiService.get<any>(endpoint);
      
      // O seu backend retorna os dados dentro de response.data.hormonios ou response.data.data
      const result = response.data;
      const hormoniosRaw = result.hormonios || result.data || [];
      
      return {
        data: hormoniosRaw.map(transformHormonioFromBackend),
        pagination: result.pagination
      };
    } catch (error) {
      console.error("Erro ao buscar hormônios:", error);
      throw error;
    }
  },

  // GET: Buscar por ID
  getById: async (id: string): Promise<Hormonio | null> => {
    try {
      const response = await apiService.get<{ success: boolean; data: any }>(`/api/hormonios/${id}`)
      // CORREÇÃO: Acessa diretamente response.data
      return transformHormonioFromBackend(response.data)
    } catch (error) {
      console.error("Erro ao buscar hormônio por ID:", error)
      throw error
    }
  },

  // POST: Criar novo hormônio
  create: async (data: HormonioFormData): Promise<Hormonio> => {
    try {
      const backendData = transformHormonioToBackend(data)
      const response = await apiService.post<{ success: boolean; data: any }>(`/api/hormonios`, backendData)
      // CORREÇÃO: Acessa diretamente response.data
      return transformHormonioFromBackend(response.data)
    } catch (error) {
      console.error("Erro ao criar hormônio:", error)
      throw error
    }
  },

  // PUT: Atualizar hormônio
  update: async (id: string, data: HormonioFormData): Promise<Hormonio> => {
    try {
      const backendData = transformHormonioToBackend(data)
      const response = await apiService.put<{ success: boolean; data: any }>(`/api/hormonios/${id}`, backendData)
      // CORREÇÃO: Acessa diretamente response.data
      return transformHormonioFromBackend(response.data)
    } catch (error) {
      console.error("Erro ao atualizar hormônio:", error)
      throw error
    }
  },

  // DELETE: Excluir hormônio
  delete: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`/api/hormonios/${id}`)
    } catch (error) {
      console.error("Erro ao excluir hormônio:", error)
      throw error
    }
  },
}