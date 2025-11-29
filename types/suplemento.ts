export type TipoSuplemento = "SUPLEMENTO" | "MANIPULADO"
export type CategoriaSuplemento = 
  | "TERMOGENICO"
  | "PRE_TREINO"
  | "HORMONAL"
  | "ANTIOXIDANTE"
  | "DIGESTIVO"
  | "SONO"
  | "VITAMINA"
  | "MINERAL"
  | "PROTEINA"
  | "CREATINA"
  | "BCAA"
  | "OUTRO"

export interface Suplemento {
  id: string
  nomeSuplemento?: string // Novo campo
  nomeManipulado?: string // Novo campo
  tipo: TipoSuplemento
  categoria: CategoriaSuplemento // Novo campo
  observacoes?: string
  contraindicacoes?: string // Novo campo
  createdAt: Date
  updatedAt: Date
}

export interface SuplementoFormData {
  nomeSuplemento?: string
  nomeManipulado?: string
  tipo: TipoSuplemento
  categoria: CategoriaSuplemento
  observacoes?: string
  contraindicacoes?: string
}

export const TIPOS_SUPLEMENTO: { value: TipoSuplemento; label: string }[] = [
  { value: "SUPLEMENTO", label: "Suplemento" },
  { value: "MANIPULADO", label: "Manipulado" },
]

export const CATEGORIAS_SUPLEMENTO: { value: CategoriaSuplemento; label: string }[] = [
  { value: "TERMOGENICO", label: "Termogênico" },
  { value: "PRE_TREINO", label: "Pré-Treino" },
  { value: "HORMONAL", label: "Hormonal" },
  { value: "ANTIOXIDANTE", label: "Antioxidante" },
  { value: "DIGESTIVO", label: "Digestivo" },
  { value: "SONO", label: "Sono" },
  { value: "VITAMINA", label: "Vitamina" },
  { value: "MINERAL", label: "Mineral" },
  { value: "PROTEINA", label: "Proteína" },
  { value: "CREATINA", label: "Creatina" },
  { value: "BCAA", label: "BCAA" },
  { value: "OUTRO", label: "Outro" },
]