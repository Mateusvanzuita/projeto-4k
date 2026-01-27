// src/services/exercicio-service.ts

import type { Exercicio, ExercicioFormData, GrupoMuscular, Equipamento, Dificuldade } from "@/types/exercicio"
import { apiService } from "./api-service"

// --- Mapeamentos ---
// Mapeia ENUMs do Frontend (exercicio.ts) para ENUMs do Backend (schema.prisma)
const grupoMuscularToBackend: Record<GrupoMuscular, string> = {
  // Ajuste conforme seus tipos de frontend
  "peito": "PEITO",
  "costas": "COSTAS",
  "ombros": "OMBROS",
  "biceps": "BICEPS", // Exemplo de mapeamento
  "triceps": "TRICEPS", // Exemplo de mapeamento
  "pernas": "PERNAS",
  "gluteos": "GLUTEOS",
  "abdomen": "ABDOMEN",
  "panturrilha": "PANTURRILHA",
  "antebraco": "ANTEBRACO",
  "cardio": "AEROBICO", // Mapeamento de grupo para tipo no backend
  "corpo-inteiro": "CORPO_INTEIRO",
}

const equipamentoToTipoExercicio: Record<Equipamento, string> = {
  "barra": "FORCA",
  "halteres": "FORCA",
  "maquina": "FORCA",
  "peso-corporal": "FUNCIONAL",
  "cabo": "FORCA",
  "kettlebell": "FORCA",
  "elastico": "MOBILIDADE",
  "medicine-ball": "FUNCIONAL",
  "outros": "FORCA",
}

const dificuldadeToCategoria: Record<Dificuldade, string> = {
  "leve": "INICIANTE",
  "medio": "INTERMEDIARIO",
  "pesado": "AVANCADO",
}
// --- Fim Mapeamentos ---

interface ExercicioListResponse {
  success: boolean
  data: {
    exercicios: any[] // Usamos any[] aqui para mapear depois
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

// 📄 Função de Transformação (Backend -> Frontend)
function transformExercicioFromBackend(back: any): Exercicio {
    // 💡 OBS: O mapeamento inverso do Backend para o Frontend é mais complexo, 
    // pois o backend usa 'tipoExercicio' e 'categoria', e o frontend usa 'equipamento' e 'dificuldade'.
    // Você precisa decidir como remapear os ENUMs do backend para os tipos do frontend.
    // Por simplicidade, vamos usar um mapeamento direto de string/fallback por agora:

    const tipoExercicioToEquipamento: Record<string, Equipamento> = {
        "FORCA": "barra",
        "AEROBICO": "peso-corporal",
        "MOBILIDADE": "elastico",
        "FLEXIBILIDADE": "peso-corporal",
        "FUNCIONAL": "peso-corporal",
        "CARDIO": "peso-corporal",
    }
    const categoriaToDificuldade: Record<string, Dificuldade> = {
        "INICIANTE": "leve",
        "INTERMEDIARIO": "medio",
        "AVANCADO": "pesado",
    }
    
    return {
        id: back.id,
        nome: back.nomeExercicio, // O backend usa nomeExercicio
        grupoMuscular: back.grupoMuscular.toLowerCase() as GrupoMuscular, // O backend usa caixa alta
        equipamento: tipoExercicioToEquipamento[back.tipoExercicio] || 'outros',
        dificuldade: categoriaToDificuldade[back.categoria] || 'leve',
        videoUrl: back.linkVideo || undefined, // O backend usa linkVideo
        observacoes: back.descricao || undefined, // O backend usa descricao
        createdAt: new Date(back.createdAt),
        updatedAt: new Date(back.updatedAt),
    }
}

// 📄 Função de Transformação (Frontend -> Backend)
function transformExercicioToBackend(front: ExercicioFormData): any {
    return {
        nomeExercicio: front.nome,
        grupoMuscular: grupoMuscularToBackend[front.grupoMuscular],
        tipoExercicio: equipamentoToTipoExercicio[front.equipamento], // Mapeia equipamento para tipoExercicio
        categoria: dificuldadeToCategoria[front.dificuldade], // Mapeia dificuldade para categoria
        linkVideo: front.videoUrl || null,
        descricao: front.observacoes || null,
    }
}

export const exercicioService = {
    // LISTAGEM (com paginação e filtros)
getAll: async (params?: { 
        page?: number; 
        limit?: number; 
        grupoMuscular?: string; 
        nomeExercicio?: string; 
    }) => {
        try {
            const queryParams = new URLSearchParams()
            if (params?.page) queryParams.append("page", params.page.toString())
            if (params?.limit) queryParams.append("limit", params.limit.toString())
            
            // ✅ CORREÇÃO: Envia o grupo muscular em Uppercase se não for 'todos'
            if (params?.grupoMuscular && params.grupoMuscular !== 'todos') {
                queryParams.append("grupoMuscular", params.grupoMuscular.toUpperCase())
            }
            
            // ✅ CORREÇÃO: Garante o nome correto do parâmetro de busca
            if (params?.nomeExercicio) {
                queryParams.append("nomeExercicio", params.nomeExercicio)
            }

            const endpoint = `/api/exercicios?${queryParams.toString()}`
            const response = await apiService.get<ExercicioListResponse>(endpoint)
            
            return {
                exercicios: response.data.exercicios.map(transformExercicioFromBackend),
                pagination: response.data.pagination,
            }
        } catch (error) {
            console.error("Error fetching exercicios:", error)
            throw error
        }
    },

    getById: async (id: string): Promise<Exercicio> => {
        try {
            const response = await apiService.get<{ success: boolean; data: any }>(`/api/exercicios/${id}`)
            return transformExercicioFromBackend(response.data)
        } catch (error) {
            console.error("Error fetching exercicio by ID:", error)
            throw error
        }
    },

    create: async (data: ExercicioFormData): Promise<Exercicio> => {
        try {
            const backendData = transformExercicioToBackend(data)
            const response = await apiService.post<{ success: boolean; data: any }>(`/api/exercicios`, backendData)
            return transformExercicioFromBackend(response.data)
        } catch (error) {
            console.error("Error creating exercicio:", error)
            throw error
        }
    },

    update: async (id: string, data: ExercicioFormData): Promise<Exercicio> => {
        try {
            const backendData = transformExercicioToBackend(data)
            const response = await apiService.put<{ success: boolean; data: any }>(`/api/exercicios/${id}`, backendData)
            return transformExercicioFromBackend(response.data)
        } catch (error) {
            console.error("Error updating exercicio:", error)
            throw error
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await apiService.delete(`/api/exercicios/${id}`)
        } catch (error) {
            console.error("Error deleting exercicio:", error)
            throw error
        }
    },
    
    // Você também pode adicionar um método 'search' para filtros mais simples se preferir.
    search: async (termo: string): Promise<Exercicio[]> => {
        try {
            const response = await apiService.get<ExercicioListResponse>(
                `/api/exercicios?nomeExercicio=${termo}`
            )
            return response.data.exercicios.map(transformExercicioFromBackend)
        } catch (error) {
            console.error("Error searching exercicios:", error)
            throw error
        }
    },
}