import type { Exercicio, ExercicioFormData, GrupoMuscular, Equipamento } from "@/types/exercicio"

// Mock data - será substituído pela API real
const mockExercicios: Exercicio[] = [
  {
    id: "1",
    nome: "Supino Reto",
    grupoMuscular: "peito",
    equipamento: "barra",
    dificuldade: "medio",
    videoUrl: "https://www.youtube.com/watch?v=example1",
    observacoes: "Manter os cotovelos a 45 graus",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    nome: "Agachamento Livre",
    grupoMuscular: "pernas",
    equipamento: "barra",
    dificuldade: "pesado",
    videoUrl: "https://www.youtube.com/watch?v=example2",
    observacoes: "Descer até paralelo ao chão",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    nome: "Remada Curvada",
    grupoMuscular: "costas",
    equipamento: "barra",
    dificuldade: "medio",
    videoUrl: "https://www.youtube.com/watch?v=example3",
    observacoes: "Variação: pode fazer com joelhos apoiados",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "4",
    nome: "Desenvolvimento com Halteres",
    grupoMuscular: "ombros",
    equipamento: "halteres",
    dificuldade: "medio",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "5",
    nome: "Flexão de Braço",
    grupoMuscular: "peito",
    equipamento: "peso-corporal",
    dificuldade: "leve",
    videoUrl: "https://www.youtube.com/watch?v=example5",
    observacoes: "Variação: pode fazer com joelhos apoiados",
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "6",
    nome: "Leg Press 45°",
    grupoMuscular: "pernas",
    equipamento: "maquina",
    dificuldade: "medio",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const exercicioService = {
  async getAll(): Promise<Exercicio[]> {
    await delay(300)
    return [...mockExercicios]
  },

  async getById(id: string): Promise<Exercicio | null> {
    await delay(200)
    return mockExercicios.find((ex) => ex.id === id) || null
  },

  async create(data: ExercicioFormData): Promise<Exercicio> {
    await delay(400)

    const newExercicio: Exercicio = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockExercicios.push(newExercicio)
    return newExercicio
  },

  async update(id: string, data: ExercicioFormData): Promise<Exercicio> {
    await delay(400)

    const index = mockExercicios.findIndex((ex) => ex.id === id)
    if (index === -1) {
      throw new Error("Exercício não encontrado")
    }

    const updatedExercicio: Exercicio = {
      ...mockExercicios[index],
      ...data,
      updatedAt: new Date(),
    }

    mockExercicios[index] = updatedExercicio
    return updatedExercicio
  },

  async delete(id: string): Promise<void> {
    await delay(300)

    const index = mockExercicios.findIndex((ex) => ex.id === id)
    if (index === -1) {
      throw new Error("Exercício não encontrado")
    }

    mockExercicios.splice(index, 1)
  },

  async search(query: string): Promise<Exercicio[]> {
    await delay(200)

    const lowerQuery = query.toLowerCase()
    return mockExercicios.filter((ex) => ex.nome.toLowerCase().includes(lowerQuery))
  },

  async filterByGrupoMuscular(grupo: GrupoMuscular): Promise<Exercicio[]> {
    await delay(200)
    return mockExercicios.filter((ex) => ex.grupoMuscular === grupo)
  },

  async filterByEquipamento(equipamento: Equipamento): Promise<Exercicio[]> {
    await delay(200)
    return mockExercicios.filter((ex) => ex.equipamento === equipamento)
  },
}
