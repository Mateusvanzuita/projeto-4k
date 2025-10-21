import type { Alimento, AlimentoFormData } from "@/types/alimento"

// Mock data for development
const mockAlimentos: Alimento[] = [
  {
    id: "1",
    nome: "Arroz Branco",
    tipo: "carboidrato",
    calorias: 130,
    quantidadePadrao: 100,
    unidadeMedida: "g",
    observacoes: "Cozido",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    nome: "Frango Grelhado",
    tipo: "proteina",
    calorias: 165,
    quantidadePadrao: 100,
    unidadeMedida: "g",
    observacoes: "Peito sem pele",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    nome: "Azeite de Oliva",
    tipo: "gordura",
    calorias: 884,
    quantidadePadrao: 100,
    unidadeMedida: "ml",
    observacoes: "Extra virgem",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    nome: "Brócolis",
    tipo: "vegetal",
    calorias: 34,
    quantidadePadrao: 100,
    unidadeMedida: "g",
    observacoes: "Cozido no vapor",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const alimentoService = {
  async getAll(): Promise<Alimento[]> {
    await delay(500)
    return [...mockAlimentos]
  },

  async getById(id: string): Promise<Alimento | null> {
    await delay(300)
    return mockAlimentos.find((a) => a.id === id) || null
  },

  async create(data: AlimentoFormData): Promise<Alimento> {
    await delay(500)
    const newAlimento: Alimento = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockAlimentos.push(newAlimento)
    return newAlimento
  },

  async update(id: string, data: AlimentoFormData): Promise<Alimento> {
    await delay(500)
    const index = mockAlimentos.findIndex((a) => a.id === id)
    if (index === -1) throw new Error("Alimento não encontrado")

    const updatedAlimento: Alimento = {
      ...mockAlimentos[index],
      ...data,
      updatedAt: new Date(),
    }
    mockAlimentos[index] = updatedAlimento
    return updatedAlimento
  },

  async delete(id: string): Promise<void> {
    await delay(500)
    const index = mockAlimentos.findIndex((a) => a.id === id)
    if (index === -1) throw new Error("Alimento não encontrado")
    mockAlimentos.splice(index, 1)
  },

  async search(query: string): Promise<Alimento[]> {
    await delay(300)
    const lowerQuery = query.toLowerCase()
    return mockAlimentos.filter(
      (a) => a.nome.toLowerCase().includes(lowerQuery) || a.tipo.toLowerCase().includes(lowerQuery),
    )
  },

  async filterByTipo(tipo: string): Promise<Alimento[]> {
    await delay(300)
    if (tipo === "todos") return [...mockAlimentos]
    return mockAlimentos.filter((a) => a.tipo === tipo)
  },
}
