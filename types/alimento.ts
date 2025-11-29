export type TipoAlimento =
  "CARBOIDRATO" |
  "PROTEINA" |
  "GORDURA" |
  "FRUTA" |
  "VEGETAL" |
  "LATICINIO" |
  "OUTRO"

export interface Alimento {
  id: string
  nome: string
  categoria: TipoAlimento
  observacoes?: string
  createdAt: Date
  updatedAt: Date
}

export interface AlimentoFormData {
  nome: string
  categoria: TipoAlimento
  observacoes?: string
}
