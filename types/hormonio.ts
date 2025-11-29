// src/types/hormonio.ts (ATUALIZADO)

// --- Tipos ENUM do Backend (Caixa Alta) ---
export type TipoHormonio = "PEPTIDEO" | "ESTEROIDE" | "TIREOIDE" | "CRESCIMENTO" | "INSULINA" | "CORTISOL" | "TESTOSTERONA" | "OUTRO"
export type CategoriaHormonio = 
  "GH_RELEASING" | "INSULINA_LIKE" | "PEPTIDEO_TERAPEUTICO" |
  "ANABOLICO" | "ANDROGENICO" | "CORTICOSTEROIDE" |
  "T3" | "T4" | "TSH" |
  "SOMATOTROPINA" | "IGF" |
  "RAPIDA" | "LENTA" | "INTERMEDIARIA" |
  "MODULADOR_HORMONAL" | "OUTRO"
export type ViaAdministracao = "SUBCUTANEA" | "INTRAMUSCULAR" | "ORAL" | "TOPICA" | "NASAL" | "INTRAVENOSA"

// --- Interfaces (Campos removidos: dose, frequencia, tempoMeiaVida, fabricante) ---
export interface Hormonio {
  id: string
  nome: string
  tipo: TipoHormonio // NOVO
  categoria: CategoriaHormonio
  viaAdministracao: ViaAdministracao
  observacoes?: string
  contraindicacoes?: string // NOVO
  efeitosColaterais?: string // NOVO
  createdAt: Date
  updatedAt: Date
}

export interface HormonioFormData {
  nome: string // Mapeado para nomeHormonio no Service
  tipo: TipoHormonio
  categoria: CategoriaHormonio
  viaAdministracao: ViaAdministracao
  observacoes?: string
  contraindicacoes?: string
  efeitosColaterais?: string
}

// --- Constantes para o Formulário (Labels amigáveis) ---

export const TIPOS_HORMONIO: { value: TipoHormonio; label: string }[] = [
  { value: "ESTEROIDE", label: "Esteróide" },
  { value: "PEPTIDEO", label: "Peptídeo" },
  { value: "TIREOIDE", label: "Tireoide" },
  { value: "CRESCIMENTO", label: "Crescimento (GH/IGF)" },
  { value: "INSULINA", label: "Insulina" },
  { value: "TESTOSTERONA", label: "Testosterona" },
  { value: "CORTISOL", label: "Cortisol" },
  { value: "OUTRO", label: "Outro" },
]

export const CATEGORIAS_HORMONIO: { value: CategoriaHormonio; label: string }[] = [
  // Peptídeos
  { value: "GH_RELEASING", label: "GH Releasing" },
  { value: "INSULINA_LIKE", label: "Insulina-Like" },
  { value: "PEPTIDEO_TERAPEUTICO", label: "Peptídeo Terapêutico" },
  // Esteroides
  { value: "ANABOLICO", label: "Anabólico" },
  { value: "ANDROGENICO", label: "Androgênico" },
  { value: "CORTICOSTEROIDE", label: "Corticosteroide" },
  // Tireoide
  { value: "T3", label: "T3" },
  { value: "T4", label: "T4" },
  { value: "TSH", label: "TSH" },
  // Crescimento
  { value: "SOMATOTROPINA", label: "Somatotropina" },
  { value: "IGF", label: "IGF" },
  // Insulina
  { value: "RAPIDA", label: "Rápida" },
  { value: "LENTA", label: "Lenta" },
  { value: "INTERMEDIARIA", label: "Intermediária" },
  // Outros
  { value: "MODULADOR_HORMONAL", label: "Modulador Hormonal" },
  { value: "OUTRO", label: "Outro" },
]

export const VIAS_ADMINISTRACAO: { value: ViaAdministracao; label: string }[] = [
  { value: "SUBCUTANEA", label: "Subcutânea" },
  { value: "INTRAMUSCULAR", label: "Intramuscular" },
  { value: "ORAL", label: "Oral" },
  { value: "TOPICA", label: "Tópica" },
  { value: "NASAL", label: "Nasal" },
  { value: "INTRAVENOSA", label: "Intravenosa" },
]