"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { coachMenuItems } from "@/lib/menu-items"
import { RelatorioKPICard } from "@/components/relatorio-kpi-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, FileSpreadsheet, Loader2 } from "lucide-react"
import { relatorioService } from "@/services/relatorio-service"
import type { DadosRelatorio, RelatorioFiltros } from "@/types/relatorio"
import { useToast } from "@/hooks/use-toast"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const COLORS = ["#003E63", "#F2B139", "#10b981", "#8b5cf6", "#ef4444"]

export default function RelatoriosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [dados, setDados] = useState<DadosRelatorio | null>(null)
  const [filtros, setFiltros] = useState<RelatorioFiltros>({
    periodo: "mes",
  })

  useEffect(() => {
    loadDados()
  }, [filtros])

  const loadDados = async () => {
    try {
      setLoading(true)
      const data = await relatorioService.getDadosRelatorio(filtros)
      setDados(data)
    } catch (error) {
      toast({
        title: "Erro ao carregar relatórios",
        description: "Não foi possível carregar os dados dos relatórios.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      setExporting(true)
      await relatorioService.exportarPDF(filtros)
      toast({
        title: "Relatório exportado",
        description: "O relatório PDF foi gerado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível gerar o relatório PDF.",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      setExporting(true)
      await relatorioService.exportarCSV(filtros)
      toast({
        title: "Relatório exportado",
        description: "O relatório CSV foi gerado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível gerar o relatório CSV.",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <AppLayout
      menuItems={coachMenuItems}
      onCreateProtocol={() => router.push("/coach/protocolos/novo")}
      onNavigateAlunos={() => router.push("/coach/alunos")}
      onNavigateRelatorios={() => router.push("/coach/relatorios")}
    >
      <div className="space-y-6 p-4">
        {/* Header com filtros e exportação */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Relatórios</h1>
            <p className="text-sm text-muted-foreground">Acompanhe o desempenho e progresso dos seus alunos</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={filtros.periodo}
              onValueChange={(value) => setFiltros({ ...filtros, periodo: value as RelatorioFiltros["periodo"] })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana">Última Semana</SelectItem>
                <SelectItem value="mes">Último Mês</SelectItem>
                <SelectItem value="trimestre">Último Trimestre</SelectItem>
                <SelectItem value="ano">Último Ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={exporting || loading}>
              {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={exporting || loading}>
              {exporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="mr-2 h-4 w-4" />
              )}
              CSV
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : dados ? (
          <>
            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {dados.kpis.map((kpi, index) => (
                <RelatorioKPICard key={index} kpi={kpi} />
              ))}
            </div>

            {/* Gráficos principais */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Evolução Temporal */}
              <Card>
                <CardHeader>
                  <CardTitle>Evolução Temporal</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dados.evolucaoTemporal}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="data" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="alunosAtivos"
                        stroke="#003E63"
                        name="Alunos Ativos"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="protocolosCriados"
                        stroke="#F2B139"
                        name="Protocolos Criados"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distribuição por Objetivo */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Objetivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dados.distribuicaoObjetivos}
                        dataKey="quantidade"
                        nameKey="objetivo"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => `${entry.objetivo} (${entry.percentual.toFixed(1)}%)`}
                      >
                        {dados.distribuicaoObjetivos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distribuição de Planos */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Planos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dados.distribuicaoPlanos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="plano" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quantidade" fill="#003E63" name="Quantidade" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Adesão Média */}
              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Adesão Média</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dados.evolucaoTemporal}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="data" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="aderenciaMedia"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                        name="Adesão (%)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Tabela de Progresso dos Alunos */}
            <Card>
              <CardHeader>
                <CardTitle>Progresso dos Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 text-left text-sm font-medium">Aluno</th>
                        <th className="pb-3 text-left text-sm font-medium">Objetivo</th>
                        <th className="pb-3 text-left text-sm font-medium">Peso Inicial</th>
                        <th className="pb-3 text-left text-sm font-medium">Peso Atual</th>
                        <th className="pb-3 text-left text-sm font-medium">Progresso</th>
                        <th className="pb-3 text-left text-sm font-medium">Adesão</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dados.progressoAlunos.map((aluno) => (
                        <tr key={aluno.alunoId} className="border-b">
                          <td className="py-3 text-sm">{aluno.alunoNome}</td>
                          <td className="py-3 text-sm">{aluno.objetivo}</td>
                          <td className="py-3 text-sm">{aluno.pesoInicial} kg</td>
                          <td className="py-3 text-sm">{aluno.pesoAtual} kg</td>
                          <td className="py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                                <div className="h-full bg-primary" style={{ width: `${aluno.progresso}%` }} />
                              </div>
                              <span className="text-xs">{aluno.progresso}%</span>
                            </div>
                          </td>
                          <td className="py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                                <div className="h-full bg-green-600" style={{ width: `${aluno.aderencia}%` }} />
                              </div>
                              <span className="text-xs">{aluno.aderencia}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </AppLayout>
  )
}
