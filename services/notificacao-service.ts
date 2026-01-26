// src/services/notificacao-service.ts
import { apiService } from "./api-service"

export interface Notificacao {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
  senderId?: string | null
  sender?: any | null
}

export const notificacaoService = {
  getAll: async (): Promise<Notificacao[]> => {
    try {
      console.log("📡 [Service] Chamando GET /notifications...");
      const response = await apiService.get<any>('/api/notifications')
      
      // LOG DE DEPURAÇÃO: Verifique isso no console do navegador
      console.log("📦 [Service] Resposta bruta da API:", response);

      // Se o apiService retornar o array diretamente em .data (comum em instâncias Axios)
      if (Array.isArray(response.data)) {
        console.log("✅ [Service] Array identificado em response.data");
        return response.data;
      }
      
      // Se o dado estiver dentro de um objeto envelopado { data: [...] }
      if (response.data?.data && Array.isArray(response.data.data)) {
        console.log("✅ [Service] Array identificado em response.data.data");
        return response.data.data;
      }

      // Se a resposta em si já for o array (depende da config do seu apiService)
      if (Array.isArray(response)) {
        console.log("✅ [Service] A resposta em si é um Array");
        return response as unknown as Notificacao[];
      }

      console.warn("⚠️ [Service] Formato de resposta não reconhecido. Retornando vazio.");
      return [];
    } catch (error) {
      console.error("❌ [Service] Erro ao buscar notificações:", error)
      return []
    }
  },

  markAsRead: async (id: string): Promise<boolean> => {
    try {
      await apiService.patch(`/api/notifications/${id}/read`, {})
      return true
    } catch (error) {
      console.error("Erro ao marcar como lida:", error)
      return false
    }
  },

  markAllAsRead: async (): Promise<void> => {
    try {
      await apiService.post('/api/notifications/read-all', {})
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error)
    }
  }
}