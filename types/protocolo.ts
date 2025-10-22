import type { Aluno } from "./aluno"
import type { Alimento } from "./alimento"
import type { Exercicio } from "./exercicio"
import type { Suplemento } from "./suplemento"
import type { Hormonio } from "./hormonio"

export type StatusProtocolo = "ativo" | "pausado" | "concluido" | "rascunho"

// Plano Alimentar
export interface RefeicaoItem {
  id: string
  alimentoId: string
  alimento?: Alimento
  quantidade: number
  unidade: "g" | "ml" | "unidade"
  substitutos?: string[] // IDs de alimentos substitutos
  observacoes?: string
}

export interface Refeicao {
  id: string
  nome: string
  horario?: string
  itens: RefeicaoItem[]
  observacoes?: string
}

export interface PlanoAlimentar {
  refeicoes: Refeicao[]
  macrosTotais: {
    calorias: number
    proteinas: number
    carboidratos: number
    gorduras: number
  }
  orientacoes?: string
}

// Treino
export interface ExercicioTreino {
  id: string
  exercicioId: string
  exercicio?: Exercicio
  series: number
  repeticoes: string // Ex: "8-12" ou "15"
  carga?: string
  descanso?: string // Ex: "60s"
  observacoes?: string
}

export interface TreinoDivisao {
  id: string
  nome: string // Ex: "Treino A", "Treino B"
  exercicios: ExercicioTreino[]
  observacoes?: string
}

export interface PlanoTreino {
  divisoes: TreinoDivisao[]
  frequenciaSemanal?: number
  orientacoes?: string
}

// Suplementação
export interface SuplementacaoItem {
  id: string
  suplementoId: string
  suplemento?: Suplemento
  dose: string
  horario?: string
  observacoes?: string
}

export interface PlanoSuplementacao {
  itens: SuplementacaoItem[]
  orientacoes?: string
}

// Manipulados (mesma estrutura de suplementação)
export interface ManipuladoItem {
  id: string
  suplementoId: string
  suplemento?: Suplemento
  dose: string
  horario?: string
  objetivo?: string
  observacoes?: string
}

export interface PlanoManipulados {
  itens: ManipuladoItem[]
  orientacoes?: string
}

// Hormônios
export interface HormonioItem {
  id: string
  hormonioId: string
  hormonio?: Hormonio
  dosagem: string
  frequencia: string
  observacoes?: string
}

export interface PlanoHormonios {
  itens: HormonioItem[]
  orientacoes?: string
}

// Protocolo completo
export interface Protocolo {
  id: string
  alunoId: string
  aluno?: Aluno
  status: StatusProtocolo
  planoAlimentar?: PlanoAlimentar
  planoTreino?: PlanoTreino
  planoSuplementacao?: PlanoSuplementacao
  planoManipulados?: PlanoManipulados
  planoHormonios?: PlanoHormonios
  observacoesFinais?: string
  createdAt: Date
  updatedAt: Date
}

export interface ProtocoloFormData {
  alunoId: string
  status: StatusProtocolo
  planoAlimentar?: PlanoAlimentar
  planoTreino?: PlanoTreino
  planoSuplementacao?: PlanoSuplementacao
  planoManipulados?: PlanoManipulados
  planoHormonios?: PlanoHormonios
  observacoesFinais?: string
}

export const STATUS_PROTOCOLO_LABELS: Record<StatusProtocolo, string> = {
  ativo: "Ativo",
  pausado: "Pausado",
  concluido: "Concluído",
  rascunho: "Rascunho",
}
