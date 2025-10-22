import type { Protocolo, ProtocoloFormData } from "@/types/protocolo"

// Mock data
let protocolos: Protocolo[] = []

export const protocoloService = {
  getAll: async (): Promise<Protocolo[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return protocolos
  },

  getById: async (id: string): Promise<Protocolo | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return protocolos.find((p) => p.id === id) || null
  },

  getByAlunoId: async (alunoId: string): Promise<Protocolo[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return protocolos.filter((p) => p.alunoId === alunoId)
  },

  create: async (data: ProtocoloFormData): Promise<Protocolo> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const newProtocolo: Protocolo = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    protocolos.push(newProtocolo)
    return newProtocolo
  },

  update: async (id: string, data: Partial<ProtocoloFormData>): Promise<Protocolo> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const index = protocolos.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Protocolo não encontrado")

    protocolos[index] = {
      ...protocolos[index],
      ...data,
      updatedAt: new Date(),
    }
    return protocolos[index]
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    protocolos = protocolos.filter((p) => p.id !== id)
  },

  clone: async (id: string): Promise<Protocolo> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const original = protocolos.find((p) => p.id === id)
    if (!original) throw new Error("Protocolo não encontrado")

    const cloned: Protocolo = {
      ...original,
      id: Math.random().toString(36).substr(2, 9),
      status: "rascunho",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    protocolos.push(cloned)
    return cloned
  },

  exportPDF: async (id: string): Promise<Blob> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Mock PDF generation
    return new Blob(["Mock PDF content"], { type: "application/pdf" })
  },
}
