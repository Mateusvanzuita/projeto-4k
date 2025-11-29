export type Sexo = "MASCULINO" | "FEMININO"

export type Plano = "MENSAL" | "TRIMESTRAL" | "SEMESTRAL" | "ANUAL"

export type TipoPlano = "DIETA" | "TREINO" | "FULL"

export type Objetivo =
  | "PERDA_PESO"
  | "HIPERTROFIA"
  | "DEFINICAO"
  | "SAUDE"
  | "PERFORMANCE"
  | "REABILITACAO"


export type FrequenciaFotos = "SEMANAL" | "QUINZENAL" | "MENSAL"

export interface Aluno {
  id: string
  nomeCompleto: string
  nomeAluno?: string
  idade?: number
  dataNascimento?: string
  sexo: Sexo
  altura: number
  peso: number
  email: string
  contato?: string
  plano: Plano
  duracaoPlano?: Plano
  tipoPlano: TipoPlano
  objetivo: Objetivo
  jaTreinava?: boolean
  restricaoAlimentar?: string
  restricaoExercicio?: string
  historicoMedico?: string
  frequenciaFotos: FrequenciaFotos
  observacoes?: string
  ativo?: boolean
  coachId?: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface AlunoFormData {
  nomeCompleto: string
  dataNascimento: string
  sexo: Sexo
  altura: number
  peso: number
  email: string
  senha?: string
  contato?: string
  plano: Plano
  tipoPlano: TipoPlano
  objetivo: string
  jaTreinava?: boolean
  restricaoAlimentar?: string
  restricaoExercicio?: string
  historicoMedico?: string
  frequenciaFotos: FrequenciaFotos
  observacoes?: string
}

export const SEXO_LABELS: Record<Sexo, string> = {
  MASCULINO: "Masculino",
  FEMININO: "Feminino",
}

export const PLANO_LABELS: Record<Plano, string> = {
  MENSAL: "Mensal",
  TRIMESTRAL: "Trimestral",
  SEMESTRAL: "Semestral",
  ANUAL: "Anual",
}

export const TIPO_PLANO_LABELS: Record<TipoPlano, string> = {
  DIETA: "Dieta",
  TREINO: "Treino",
  FULL: "Full (Treino + Dieta)",
}

export const OBJETIVO_OPTIONS = ["Perda de Peso", "Hipertrofia", "Definição", "Saúde", "Performance", "Reabilitação"]

export const OBJETIVO_LABELS: Record<Objetivo, string> = {
  PERDA_PESO: "Perda de Peso",
  HIPERTROFIA: "Hipertrofia",
  DEFINICAO: "Definição",
  SAUDE: "Saúde",
  PERFORMANCE: "Performance",
  REABILITACAO: "Reabilitação",
}


export const OBJETIVO_VALUES: Objetivo[] = [
  "PERDA_PESO",
  "HIPERTROFIA",
  "DEFINICAO",
  "SAUDE",
  "PERFORMANCE",
  "REABILITACAO",
]


export const FREQUENCIA_FOTOS_LABELS: Record<FrequenciaFotos, string> = {
  SEMANAL: "Semanal",
  QUINZENAL: "Quinzenal",
  MENSAL: "Mensal",
}
