export type TipoSuplemento = "suplemento" | "manipulado"

export interface Suplemento {
  id: string
  nome: string
  tipo: TipoSuplemento
  doseRecomendada: string
  marca: string
  observacoes?: string
  createdAt: Date
  updatedAt: Date
}

export interface SuplementoFormData {
  nome: string
  tipo: TipoSuplemento
  doseRecomendada: string
  marca: string
  observacoes?: string
}

export const TIPOS_SUPLEMENTO: { value: TipoSuplemento; label: string }[] = [
  { value: "suplemento", label: "Suplemento" },
  { value: "manipulado", label: "Manipulado" },
]
