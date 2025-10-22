import type { Hormonio, HormonioFormData } from "@/types/hormonio"

// Mock data para desenvolvimento
const mockHormonios: Hormonio[] = [
  {
    id: "1",
    nome: "Testosterona Cipionato",
    categoria: "anabolico",
    dose: "250mg",
    frequencia: "2x por semana",
    viaAdministracao: "injetavel",
    tempoMeiaVida: "8 dias",
    fabricante: "Landerlan",
    observacoes: "Aplicar via intramuscular profunda",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    nome: "HGH Fragment 176-191",
    categoria: "peptideo",
    dose: "250mcg",
    frequencia: "1x ao dia",
    viaAdministracao: "injetavel",
    tempoMeiaVida: "2-3 horas",
    fabricante: "Hilma Biocare",
    observacoes: "Aplicar em jejum, subcutâneo",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    nome: "T3 (Liothyronine)",
    categoria: "tireoidiano",
    dose: "25mcg",
    frequencia: "1x ao dia",
    viaAdministracao: "oral",
    tempoMeiaVida: "24 horas",
    fabricante: "Pharma Grade",
    observacoes: "Tomar pela manhã em jejum",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
]

let hormonios = [...mockHormonios]

export const hormonioService = {
  getAll: async (): Promise<Hormonio[]> => {
    // Simula delay de API
    await new Promise((resolve) => setTimeout(resolve, 300))
    return hormonios
  },

  getById: async (id: string): Promise<Hormonio | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return hormonios.find((h) => h.id === id) || null
  },

  create: async (data: HormonioFormData): Promise<Hormonio> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newHormonio: Hormonio = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    hormonios = [newHormonio, ...hormonios]
    return newHormonio
  },

  update: async (id: string, data: HormonioFormData): Promise<Hormonio> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = hormonios.findIndex((h) => h.id === id)
    if (index === -1) throw new Error("Hormônio não encontrado")

    const updatedHormonio: Hormonio = {
      ...hormonios[index],
      ...data,
      updatedAt: new Date(),
    }
    hormonios[index] = updatedHormonio
    return updatedHormonio
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    hormonios = hormonios.filter((h) => h.id !== id)
  },
}
