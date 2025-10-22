export type CategoriaHormonio = "anabolico" | "peptideo" | "tireoidiano" | "gh" | "outro"
export type ViaAdministracao = "oral" | "injetavel" | "topico" | "sublingual"

export interface Hormonio {
  id: string
  nome: string
  categoria: CategoriaHormonio
  dose: string
  frequencia: string
  viaAdministracao: ViaAdministracao
  tempoMeiaVida?: string
  fabricante?: string
  observacoes?: string
  createdAt: Date
  updatedAt: Date
}

export interface HormonioFormData {
  nome: string
  categoria: CategoriaHormonio
  dose: string
  frequencia: string
  viaAdministracao: ViaAdministracao
  tempoMeiaVida?: string
  fabricante?: string
  observacoes?: string
}

export const CATEGORIAS_HORMONIO: { value: CategoriaHormonio; label: string }[] = [
  { value: "anabolico", label: "Anabólico" },
  { value: "peptideo", label: "Peptídeo" },
  { value: "tireoidiano", label: "Hormônio Tireoidiano" },
  { value: "gh", label: "GH (Hormônio do Crescimento)" },
  { value: "outro", label: "Outro" },
]

export const VIAS_ADMINISTRACAO: { value: ViaAdministracao; label: string }[] = [
  { value: "oral", label: "Oral" },
  { value: "injetavel", label: "Injetável" },
  { value: "topico", label: "Tópico" },
  { value: "sublingual", label: "Sublingual" },
]
