import type { Suplemento, SuplementoFormData } from "@/types/suplemento"

// Mock data para desenvolvimento
const mockSuplementos: Suplemento[] = [
  {
    id: "1",
    nome: "Whey Protein",
    tipo: "suplemento",
    doseRecomendada: "30g",
    marca: "Optimum Nutrition",
    observacoes: "Tomar após o treino",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    nome: "Creatina Monohidratada",
    tipo: "suplemento",
    doseRecomendada: "5g",
    marca: "Growth",
    observacoes: "Tomar diariamente",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    nome: "Complexo Vitamínico",
    tipo: "manipulado",
    doseRecomendada: "1 cápsula",
    marca: "Farmácia Manipulação ABC",
    observacoes: "Tomar pela manhã",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    nome: "BCAA",
    tipo: "suplemento",
    doseRecomendada: "5g",
    marca: "Integralmedica",
    observacoes: "Durante o treino",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    nome: "Ômega 3 Concentrado",
    tipo: "manipulado",
    doseRecomendada: "2 cápsulas",
    marca: "Farmácia Manipulação XYZ",
    observacoes: "Após as refeições",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

let suplementos = [...mockSuplementos]

export const suplementoService = {
  getAll: async (): Promise<Suplemento[]> => {
    // Simula delay de API
    await new Promise((resolve) => setTimeout(resolve, 300))
    return suplementos
  },

  getById: async (id: string): Promise<Suplemento | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return suplementos.find((s) => s.id === id) || null
  },

  create: async (data: SuplementoFormData): Promise<Suplemento> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newSuplemento: Suplemento = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    suplementos.push(newSuplemento)
    return newSuplemento
  },

  update: async (id: string, data: SuplementoFormData): Promise<Suplemento> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = suplementos.findIndex((s) => s.id === id)
    if (index === -1) throw new Error("Suplemento não encontrado")

    suplementos[index] = {
      ...suplementos[index],
      ...data,
      updatedAt: new Date(),
    }
    return suplementos[index]
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    suplementos = suplementos.filter((s) => s.id !== id)
  },
}
