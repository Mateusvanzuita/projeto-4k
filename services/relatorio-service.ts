import type { DadosRelatorio, RelatorioFiltros } from "@/types/relatorio"

// Mock data para relatórios
const mockDadosRelatorio: DadosRelatorio = {
  kpis: [
    {
      label: "Total de Alunos",
      value: 48,
      change: 12,
      trend: "up",
      icon: "users",
    },
    {
      label: "Alunos Ativos",
      value: 42,
      change: 8,
      trend: "up",
      icon: "activity",
    },
    {
      label: "Protocolos Criados",
      value: 156,
      change: 23,
      trend: "up",
      icon: "file-text",
    },
    {
      label: "Taxa de Adesão",
      value: "87.5%",
      change: 5,
      trend: "up",
      icon: "trending-up",
    },
  ],
  evolucaoTemporal: [
    { data: "Jan", alunosAtivos: 30, protocolosCriados: 45, aderenciaMedia: 75 },
    { data: "Fev", alunosAtivos: 35, protocolosCriados: 52, aderenciaMedia: 78 },
    { data: "Mar", alunosAtivos: 38, protocolosCriados: 58, aderenciaMedia: 82 },
    { data: "Abr", alunosAtivos: 40, protocolosCriados: 62, aderenciaMedia: 85 },
    { data: "Mai", alunosAtivos: 42, protocolosCriados: 68, aderenciaMedia: 87 },
    { data: "Jun", alunosAtivos: 42, protocolosCriados: 72, aderenciaMedia: 88 },
  ],
  distribuicaoObjetivos: [
    { objetivo: "Hipertrofia", quantidade: 18, percentual: 37.5 },
    { objetivo: "Perda de Peso", quantidade: 15, percentual: 31.25 },
    { objetivo: "Definição", quantidade: 8, percentual: 16.67 },
    { objetivo: "Performance", quantidade: 5, percentual: 10.42 },
    { objetivo: "Saúde", quantidade: 2, percentual: 4.16 },
  ],
  distribuicaoPlanos: [
    { plano: "Full (Dieta + Treino)", quantidade: 28 },
    { plano: "Apenas Treino", quantidade: 12 },
    { plano: "Apenas Dieta", quantidade: 8 },
  ],
  progressoAlunos: [
    {
      alunoId: "1",
      alunoNome: "João Silva",
      dataInicio: "2024-01-15",
      pesoInicial: 85,
      pesoAtual: 78,
      objetivo: "Perda de Peso",
      progresso: 82,
      aderencia: 95,
    },
    {
      alunoId: "2",
      alunoNome: "Maria Santos",
      dataInicio: "2024-02-01",
      pesoInicial: 62,
      pesoAtual: 67,
      objetivo: "Hipertrofia",
      progresso: 75,
      aderencia: 88,
    },
    {
      alunoId: "3",
      alunoNome: "Pedro Costa",
      dataInicio: "2024-03-10",
      pesoInicial: 90,
      pesoAtual: 85,
      objetivo: "Definição",
      progresso: 65,
      aderencia: 92,
    },
  ],
}

export const relatorioService = {
  getDadosRelatorio: async (filtros: RelatorioFiltros): Promise<DadosRelatorio> => {
    // Simula delay de API
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Em produção, aqui faria a chamada real para a API com os filtros
    console.log("[v0] Buscando relatórios com filtros:", filtros)

    return mockDadosRelatorio
  },

  exportarPDF: async (filtros: RelatorioFiltros): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("[v0] Exportando relatório em PDF com filtros:", filtros)
    // Em produção, geraria o PDF real
    alert("Relatório PDF gerado com sucesso! (mock)")
  },

  exportarCSV: async (filtros: RelatorioFiltros): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log("[v0] Exportando relatório em CSV com filtros:", filtros)
    // Em produção, geraria o CSV real
    alert("Relatório CSV gerado com sucesso! (mock)")
  },
}
