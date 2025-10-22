export interface KPIData {
  label: string
  value: number | string
  change?: number // percentual de mudança
  trend?: "up" | "down" | "neutral"
  icon?: string
}

export interface AlunoProgressoData {
  alunoId: string
  alunoNome: string
  dataInicio: string
  pesoInicial: number
  pesoAtual: number
  objetivo: string
  progresso: number // percentual
  aderencia: number // percentual
}

export interface DistribuicaoObjetivo {
  objetivo: string
  quantidade: number
  percentual: number
}

export interface DistribuicaoPlano {
  plano: string
  quantidade: number
}

export interface EvolucaoTemporal {
  data: string
  alunosAtivos: number
  protocolosCriados: number
  aderenciaMedia: number
}

export interface RelatorioFiltros {
  periodo: "semana" | "mes" | "trimestre" | "ano" | "customizado"
  dataInicio?: string
  dataFim?: string
  alunoId?: string
  tipoProtocolo?: "treino" | "dieta" | "full"
}

export interface DadosRelatorio {
  kpis: KPIData[]
  evolucaoTemporal: EvolucaoTemporal[]
  distribuicaoObjetivos: DistribuicaoObjetivo[]
  distribuicaoPlanos: DistribuicaoPlano[]
  progressoAlunos: AlunoProgressoData[]
}
