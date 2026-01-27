import { apiService } from "./api-service"
import type { Aluno, AlunoFormData } from "@/types/aluno"
import { RegistroEvolucao } from "./foto-service"

interface AlunoListResponse {
  success: boolean
  data: Aluno[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

function transformAlunoFromBackend(backendAluno: any): Aluno {
  return {
    id: backendAluno.id,
    nomeCompleto: backendAluno.nomeCompleto || backendAluno.nomeAluno || backendAluno.name || "",
    nomeAluno: backendAluno.nomeCompleto,
    idade: backendAluno.idade,
    dataNascimento: backendAluno.dataNascimento
      ? new Date(backendAluno.dataNascimento).toISOString().split("T")[0]
      : undefined,
    sexo: backendAluno.sexo || "MASCULINO",
    altura: backendAluno.altura || 1.7,
    peso: backendAluno.peso || 70,
    email: backendAluno.email,
    contato: backendAluno.contato || "",
    plano: backendAluno.plano || "MENSAL",
    tipoPlano: backendAluno.tipoPlano || "FULL",
    objetivo: backendAluno.objetivo || "Hipertrofia",
    jaTreinava: backendAluno.jaTreinava || false,
    restricaoAlimentar: backendAluno.restricaoAlimentar || "",
    restricaoExercicio: backendAluno.restricaoExercicio || "",
    historicoMedico: backendAluno.historicoMedico || "",
    frequenciaFotos: backendAluno.frequenciaFotos || "QUINZENAL",
    observacoes: backendAluno.observacoes || "",
    ativo: backendAluno.ativo !== false,
    coachId: backendAluno.coachId,
    registrosEvolucao: backendAluno.registrosEvolucao || [],
    createdAt: backendAluno.createdAt || new Date(),
    updatedAt: backendAluno.updatedAt || new Date(),
  }
}

export const alunoService = {
getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    tipoPlano?: string
    sexo?: string
    duracaoPlano?: string
  }): Promise<{ alunos: Aluno[]; pagination: AlunoListResponse['pagination'] | null }> => { // Retorno atualizado
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append("page", params.page.toString())
      if (params?.limit) queryParams.append("limit", params.limit.toString())
      if (params?.search) queryParams.append("search", params.search)
      if (params?.tipoPlano) queryParams.append("tipoPlano", params.tipoPlano.toUpperCase())
      
      const endpoint = `/api/students${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
      const response = await apiService.get<AlunoListResponse>(endpoint)

      const alunos = (response.data || []).map(transformAlunoFromBackend)
      const pagination = response.pagination || null // Captura a paginação

      return { alunos, pagination } // Retorna objeto composto
    } catch (error) {
      console.error("Error fetching alunos:", error)
      throw error
    }
  },

  getById: async (id: string): Promise<Aluno | null> => {
    try {
      const response = await apiService.get<{ success: boolean; data: any }>(`/api/students/${id}`)
      return response.data ? transformAlunoFromBackend(response.data) : null
    } catch (error) {
      console.error("Error fetching aluno:", error)
      return null
    }
  },

  create: async (data: AlunoFormData): Promise<Aluno> => {
    try {
      const backendData: any = {
        nomeAluno: data.nomeCompleto,
        email: data.email,
        senha: data.senha,
        dataNascimento: data.dataNascimento,
        sexo: data.sexo,
        altura: data.altura,
        peso: data.peso,
        plano: data.plano,
        tipoPlano: data.tipoPlano,
        objetivo: data.objetivo,
        jaTreinava: data.jaTreinava,
        restricaoAlimentar: data.restricaoAlimentar || null,
        restricaoExercicio: data.restricaoExercicio || null,
        historicoMedico: data.historicoMedico || null,
        frequenciaFotos: data.frequenciaFotos,
        observacoes: data.observacoes || null,
        contato: data.contato,
      }

      const response = await apiService.post<{ success: boolean; data: any }>("/api/students", backendData)
      return transformAlunoFromBackend(response.data)
    } catch (error) {
      console.error("Error creating aluno:", error)
      throw error
    }
  },

  update: async (id: string, data: Partial<AlunoFormData>): Promise<Aluno> => {
    try {
      const backendData: any = {}

      if (data.nomeCompleto) backendData.nomeCompleto = data.nomeCompleto
      if (data.email) backendData.email = data.email
      if (data.dataNascimento) backendData.dataNascimento = data.dataNascimento
      if (data.sexo) backendData.sexo = data.sexo
      if (data.altura !== undefined) backendData.altura = data.altura
      if (data.peso !== undefined) backendData.peso = data.peso
      if (data.plano) backendData.plano = data.plano
      if (data.tipoPlano) backendData.tipoPlano = data.tipoPlano
      if (data.objetivo) backendData.objetivo = data.objetivo
      if (data.jaTreinava !== undefined) backendData.jaTreinava = data.jaTreinava
      if (data.restricaoAlimentar !== undefined) backendData.restricaoAlimentar = data.restricaoAlimentar || null
      if (data.restricaoExercicio !== undefined) backendData.restricaoExercicio = data.restricaoExercicio || null
      if (data.historicoMedico !== undefined) backendData.historicoMedico = data.historicoMedico || null
      if (data.frequenciaFotos) backendData.frequenciaFotos = data.frequenciaFotos
      if (data.observacoes !== undefined) backendData.observacoes = data.observacoes || null
      if (data.senha) backendData.senha = data.senha
      if (data.contato !== undefined) backendData.contato = data.contato

      const response = await apiService.put<{ success: boolean; data: any }>(`/api/students/${id}`, backendData)

      return transformAlunoFromBackend(response.data)
    } catch (error) {
      console.error("Error updating aluno:", error)
      throw error
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`/api/students/${id}`)
    } catch (error) {
      console.error("Error deleting aluno:", error)
      throw error
    }
  },

getEvolucaoByAlunoId: async (alunoId: string): Promise<RegistroEvolucao[]> => {
    try {
      // Endpoint que o Coach usa para ver as fotos de um aluno específico
      const response = await apiService.get<{ success: boolean; data: RegistroEvolucao[] }>(`/api/evolucao/aluno/${alunoId}`)
      return response.data || []
    } catch (error) {
      console.error("Erro ao buscar evolução do aluno:", error)
      return []
    }
  },
}
