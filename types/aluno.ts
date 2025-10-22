export type Sexo = "masculino" | "feminino" | "outro"

export type Plano = "mensal" | "trimestral" | "semestral" | "anual"

export type TipoPlano = "treino" | "dieta" | "full"

export type Objetivo = "perda_peso" | "hipertrofia" | "definicao" | "saude" | "performance" | "reabilitacao"

export type FrequenciaFotos = "semanal" | "quinzenal" | "mensal"

export interface Aluno {
  id: string
  nomeCompleto: string
  idade: number
  sexo: Sexo
  altura: number // em cm
  peso: number // em kg
  email: string
  contato: string
  plano: Plano
  tipoPlano: TipoPlano
  objetivo: Objetivo
  jaTreinava: boolean
  restricaoAlimentar?: string
  restricaoExercicio?: string
  historicoMedico?: string
  frequenciaFotos: FrequenciaFotos
  observacoes?: string
  ativo: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AlunoFormData {
  nomeCompleto: string
  idade: number
  sexo: Sexo
  altura: number
  peso: number
  email: string
  senha: string
  contato: string
  plano: Plano
  tipoPlano: TipoPlano
  objetivo: Objetivo
  jaTreinava: boolean
  restricaoAlimentar?: string
  restricaoExercicio?: string
  historicoMedico?: string
  frequenciaFotos: FrequenciaFotos
  observacoes?: string
}

export const SEXO_LABELS: Record<Sexo, string> = {
  masculino: "Masculino",
  feminino: "Feminino",
  outro: "Outro",
}

export const PLANO_LABELS: Record<Plano, string> = {
  mensal: "Mensal",
  trimestral: "Trimestral",
  semestral: "Semestral",
  anual: "Anual",
}

export const TIPO_PLANO_LABELS: Record<TipoPlano, string> = {
  treino: "Treino",
  dieta: "Dieta",
  full: "Full (Treino + Dieta)",
}

export const OBJETIVO_LABELS: Record<Objetivo, string> = {
  perda_peso: "Perda de Peso",
  hipertrofia: "Hipertrofia",
  definicao: "Definição",
  saude: "Saúde",
  performance: "Performance",
  reabilitacao: "Reabilitação",
}

export const FREQUENCIA_FOTOS_LABELS: Record<FrequenciaFotos, string> = {
  semanal: "Semanal",
  quinzenal: "Quinzenal",
  mensal: "Mensal",
}
