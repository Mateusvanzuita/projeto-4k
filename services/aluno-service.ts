import type { Aluno, AlunoFormData } from "@/types/aluno"

// Mock data para desenvolvimento
const mockAlunos: Aluno[] = [
  {
    id: "1",
    nomeCompleto: "João Silva",
    idade: 28,
    sexo: "masculino",
    altura: 178,
    peso: 82,
    email: "joao.silva@email.com",
    contato: "(11) 98765-4321",
    plano: "trimestral",
    tipoPlano: "full",
    objetivo: "hipertrofia",
    jaTreinava: true,
    restricaoAlimentar: "Intolerância à lactose",
    restricaoExercicio: undefined,
    historicoMedico: "Nenhum problema relevante",
    frequenciaFotos: "quinzenal",
    observacoes: "Aluno dedicado e pontual",
    ativo: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    nomeCompleto: "Maria Santos",
    idade: 32,
    sexo: "feminino",
    altura: 165,
    peso: 68,
    email: "maria.santos@email.com",
    contato: "(11) 91234-5678",
    plano: "mensal",
    tipoPlano: "dieta",
    objetivo: "perda_peso",
    jaTreinava: false,
    restricaoAlimentar: "Vegetariana",
    restricaoExercicio: "Problema no joelho direito",
    historicoMedico: "Cirurgia no joelho em 2022",
    frequenciaFotos: "semanal",
    observacoes: "Iniciante, precisa de acompanhamento próximo",
    ativo: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    nomeCompleto: "Carlos Oliveira",
    idade: 45,
    sexo: "masculino",
    altura: 172,
    peso: 95,
    email: "carlos.oliveira@email.com",
    contato: "(11) 99876-5432",
    plano: "semestral",
    tipoPlano: "full",
    objetivo: "saude",
    jaTreinava: true,
    restricaoAlimentar: undefined,
    restricaoExercicio: "Hipertensão controlada",
    historicoMedico: "Hipertensão, diabetes tipo 2",
    frequenciaFotos: "mensal",
    observacoes: "Foco em saúde e qualidade de vida",
    ativo: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
]

let alunos = [...mockAlunos]

export const alunoService = {
  getAll: async (): Promise<Aluno[]> => {
    // Simula delay de API
    await new Promise((resolve) => setTimeout(resolve, 500))
    return alunos
  },

  getById: async (id: string): Promise<Aluno | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return alunos.find((a) => a.id === id) || null
  },

  create: async (data: AlunoFormData): Promise<Aluno> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newAluno: Aluno = {
      id: Date.now().toString(),
      ...data,
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    alunos.push(newAluno)
    return newAluno
  },

  update: async (id: string, data: AlunoFormData): Promise<Aluno> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = alunos.findIndex((a) => a.id === id)
    if (index === -1) {
      throw new Error("Aluno não encontrado")
    }

    const updatedAluno: Aluno = {
      ...alunos[index],
      ...data,
      updatedAt: new Date(),
    }

    alunos[index] = updatedAluno
    return updatedAluno
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    alunos = alunos.filter((a) => a.id !== id)
  },

  toggleStatus: async (id: string): Promise<Aluno> => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const index = alunos.findIndex((a) => a.id === id)
    if (index === -1) {
      throw new Error("Aluno não encontrado")
    }

    alunos[index] = {
      ...alunos[index],
      ativo: !alunos[index].ativo,
      updatedAt: new Date(),
    }

    return alunos[index]
  },
}
