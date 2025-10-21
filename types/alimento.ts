export type TipoAlimento = "carboidrato" | "proteina" | "gordura" | "fibra" | "vegetal" | "fruta" | "outro"

export interface Alimento {
  id: string
  nome: string
  tipo: TipoAlimento
  calorias: number
  quantidadePadrao: number
  unidadeMedida: "g" | "ml"
  observacoes?: string
  createdAt: Date
  updatedAt: Date
}

export interface AlimentoFormData {
  nome: string
  tipo: TipoAlimento
  calorias: number
  quantidadePadrao: number
  unidadeMedida: "g" | "ml"
  observacoes?: string
}
