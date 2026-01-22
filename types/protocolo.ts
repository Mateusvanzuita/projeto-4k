// src/types/protocolo.ts (AJUSTADO PARA O BACKEND)

import type { Aluno } from "./aluno"
import type { Alimento, UnidadeAlimento } from "./alimento" // Requer UnidadeAlimento
import type { Exercicio } from "./exercicio"
import type { Suplemento } from "./suplemento"
import type { Hormonio } from "./hormonio"

// Replicando ENUMs do Backend para garantir o payload correto
export type StatusProtocolo = "ATIVO" | "PAUSADO" | "CONCLUIDO" | "RASCUNHO"
export type MomentoSuplemento = "PRE_TREINO" | "POS_TREINO" | "MANHA" | "TARDE" | "NOITE" | "JEJUM" | "REFEICAO"
export type FrequenciaHormonio = "DIARIA" | "DIA_SIM_DIA_NAO" | "DUAS_VEZES_SEMANA" | "SEMANAL" | "QUINZENAL" | "MENSAL" | "CONFORME_NECESSARIO"
export type ViaAdministracao = "SUBCUTANEA" | "INTRAMUSCULAR" | "ORAL" | "TOPICA" | "NASAL" | "INTRAVENOSA"
export type DuracaoUso = "DUAS_SEMANAS" | "QUATRO_SEMANAS" | "SEIS_SEMANAS" | "OITO_SEMANAS" | "DOZE_SEMANAS" | "DEZESSEIS_SEMANAS" | "CONTINUO"


// ------------------------------------
// 1. PLANO ALIMENTAR (Refeicoes e AlimentoRefeicao)
// ------------------------------------

// Corresponde a AlimentoRefeicao no Prisma
export interface AlimentoProtocoloItem { 
  id?: string 
  alimentoId: string // ID do Alimento do Catálogo
  alimento?: Alimento // Para visualização no front
  quantidade: number
  unidadeMedida: UnidadeAlimento // Usamos o ENUM do Alimento
  observacoes?: string
}

// Corresponde a Refeicao no Prisma
export interface Refeicao {
  id?: string 
  nomeRefeicao: string // Corresponde a nome no front original
  horarioPrevisto?: string // Corresponde a horario no front original
  observacoes?: string
  alimentos: AlimentoProtocoloItem[] 
}

// ------------------------------------
// 2. PLANO TREINO (PlanoTreinoDivisao e ExercicioTreino)
// ------------------------------------

// Corresponde a ExercicioTreino no Prisma
export interface ExercicioProtocoloItem {
  id?: string 
  exercicioId: string // ID do Exercício do Catálogo
  exercicio?: Exercicio 
  series: number
  repeticoes: string 
  carga?: string
  intervaloDescanso?: string // Corresponde a descanso no front original
  observacoes?: string
  ordem?: number // Ordem de execução
}

// Corresponde a PlanoTreinoDivisao no Prisma
export interface TreinoDivisao { 
  id?: string 
  nomeDivisao: string // Corresponde a nome no front original
  grupoMuscular?: string 
  orientacoes?: string // Orientacoes gerais da divisão
  diaDaSemana?: string
  exercicios: ExercicioProtocoloItem[] 
}


// ------------------------------------
// 3. SUPLEMENTAÇÃO / MANIPULADOS (SuplementoProtocolo)
// ------------------------------------

// Corresponde a SuplementoProtocolo no Prisma
export interface SuplementoProtocolo {
  id?: string 
  suplementoId: string // ID do Suplemento/Manipulado do Catálogo
  suplemento?: Suplemento // Para visualização no front
  quantidade: string // Corresponde a dose no front original
  formaUso: MomentoSuplemento 
  observacoes?: string
}
// OBS: ManipuladoProtocolo é o mesmo tipo do SuplementoProtocolo no backend.
export type ManipuladoProtocolo = SuplementoProtocolo


// ------------------------------------
// 4. HORMÔNIOS (HormonioProtocolo)
// ------------------------------------

// Corresponde a HormonioProtocolo no Prisma
export interface HormonioProtocolo {
  id?: string 
  hormonioId: string // ID do Hormônio do Catálogo
  hormonio?: Hormonio 
  dosagem: string
  frequencia: FrequenciaHormonio
  viaAdministracao: ViaAdministracao
  duracaoUso?: DuracaoUso
  observacoes?: string
}


// ------------------------------------
// PROTOCOLO COMPLETO (FINAL PAYLOAD)
// ------------------------------------

export interface Protocolo {
  id: string
  alunoId: string
  nome?: string 
  descricao?: string 
  aluno?: Aluno
  status: StatusProtocolo
  dataCriacao: Date
  dataAtivacao?: Date
  dataValidade?: Date
  dataInicioPrevista?: Date

  // Dados Aninhados: Correspondem às relações 1:M no Protocolo
  refeicoes?: Refeicao[] 
  planosTreino?: TreinoDivisao[]
  suplementosProtocolo?: SuplementoProtocolo[]
  hormoniosProtocolo?: HormonioProtocolo[]
  
  createdAt: Date
  updatedAt: Date
}

// Payload para envio (CREATE/UPDATE)
export interface ProtocoloFormData {
  alunoId: string
  nome: string 
  descricao?: string 
  status: StatusProtocolo
  
  refeicoes?: Refeicao[] 
  planosTreino?: TreinoDivisao[] 
  suplementosProtocolo?: SuplementoProtocolo[]
  hormoniosProtocolo?: HormonioProtocolo[]
  
  dataInicioPrevista?: string
  dataValidade?: string
}


export const STATUS_PROTOCOLO_LABELS: Record<StatusProtocolo, string> = {
  ATIVO: "Ativo",
  PAUSADO: "Pausado",
  CONCLUIDO: "Concluído",
  RASCUNHO: "Rascunho",
}