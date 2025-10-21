export type GrupoMuscular =
  | "peito"
  | "costas"
  | "ombros"
  | "biceps"
  | "triceps"
  | "pernas"
  | "gluteos"
  | "abdomen"
  | "panturrilha"
  | "antebraco"
  | "cardio"
  | "corpo-inteiro"

export type Equipamento =
  | "barra"
  | "halteres"
  | "maquina"
  | "peso-corporal"
  | "cabo"
  | "kettlebell"
  | "elastico"
  | "medicine-ball"
  | "outros"

export type Dificuldade = "leve" | "medio" | "pesado"

export interface Exercicio {
  id: string
  nome: string
  grupoMuscular: GrupoMuscular
  equipamento: Equipamento
  dificuldade: Dificuldade
  videoUrl?: string
  observacoes?: string
  createdAt: Date
  updatedAt: Date
}

export interface ExercicioFormData {
  nome: string
  grupoMuscular: GrupoMuscular
  equipamento: Equipamento
  dificuldade: Dificuldade
  videoUrl?: string
  observacoes?: string
}
