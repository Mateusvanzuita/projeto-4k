// src/app/coach/dashboard/page.tsx (ATUALIZADO PARA DUAS COLUNAS)

"use client"

import { AppLayout } from "@/components/app-layout"
import { coachMenuItems } from "@/lib/menu-items"
import { Card } from "@/components/ui/card"
import { Users, ClipboardList, Loader2 } from "lucide-react" // Removido TrendingUp e Calendar
import { useEffect, useState } from "react"
import { dashboardService, DashboardData } from "@/services/dashboard-service" // Importação do service

// Função auxiliar para formatar datas (necessária para exibir datas de alunos)
const formatDate = (dateString: string | Date): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  // Garante que a data seja válida antes de formatar
  if (isNaN(date.getTime())) return 'Data Inválida';
  return date.toLocaleDateString('pt-BR');
}

export default function CoachDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Lógica para buscar os dados do dashboard ao montar o componente
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        // Chamada ao novo serviço que busca os dados da API
        const dashboardData = await dashboardService.getCoachDashboard() 
        setData(dashboardData)
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err)
        setError("Não foi possível carregar os dados do dashboard. Verifique a conexão com a API.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  // Funções de navegação (mantidas)
  const handleCreateProtocol = () => {
    console.log("[v0] Create protocol clicked")
    // TODO: Navigate to create protocol page
  }

  const handleNavigateAlunos = () => {
    console.log("[v0] Navigate to alunos clicked")
    // TODO: Navigate to alunos page
  }

  const handleNavigateRelatorios = () => {
    console.log("[v0] Navigate to relatórios clicked")
    // TODO: Navigate to relatórios page
  }

  // --- Renderização de Loading e Erro ---

  if (loading) {
    return (
      <AppLayout menuItems={coachMenuItems}>
        <div className="flex justify-center items-center h-full p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-3 text-lg text-muted-foreground">Carregando Dashboard...</p>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout menuItems={coachMenuItems}>
        <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg m-4 border border-red-300">
          <p className="font-bold text-xl">Falha na Conexão</p>
          <p>{error}</p>
        </div>
      </AppLayout>
    )
  }
  
  // Extração dos dados para facilitar o uso (com fallback para 0 ou array vazio)
  const indicators = data?.indicators || { totalStudents: 0, activeProtocols: 0, newRegistrations: 0 };
  const newRegistrations = data?.newRegistrations || [];

  return (
    <AppLayout
      menuItems={coachMenuItems}
      onCreateProtocol={handleCreateProtocol}
      onNavigateAlunos={handleNavigateAlunos}
      onNavigateRelatorios={handleNavigateRelatorios}
    >
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">Portal do Coach</h1>
          <p className="text-white/90">Gerencie seus alunos e protocolos de forma eficiente</p>
        </div>

        {/* Stats Cards (Com dados reais da API) */}
        {/* AJUSTE: O grid agora é 2 colunas para os dois cards restantes */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                {/* Dados Reais: Total de Alunos */}
                <p className="text-2xl font-bold">{indicators.totalStudents}</p>
                <p className="text-sm text-muted-foreground">Alunos Totais</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-secondary" />
              </div>
              <div>
                {/* Dados Reais: Protocolos Ativos */}
                <p className="text-2xl font-bold">{indicators.activeProtocols}</p>
                <p className="text-sm text-muted-foreground">Protocolos Ativos</p>
              </div>
            </div>
          </Card>

          {/* Os dois cards removidos: Adesão (Mock) e Novas Inscrições (30D) */}
          
        </div>

        {/* Atividades Recentes (Mantendo a lista de Novos Alunos Registrados) */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Novos Alunos Cadastrados (Últimos 30 dias)</h2>
          <Card className="divide-y">
            {newRegistrations.length > 0 ? (
              newRegistrations.slice(0, 5).map((aluno) => ( // Limita a 5 para a visualização
                <div key={aluno.id} className="p-4">
                  <p className="font-medium">{aluno.nomeCompleto}</p>
                  <p className="text-sm text-muted-foreground">E-mail: {aluno.email}</p>
                  <p className="text-xs text-gray-500">Cadastrado em: {formatDate(aluno.dataCriacao)}</p>
                </div>
              ))
            ) : (
              <p className="p-4 text-muted-foreground">Nenhum novo aluno registrado no período.</p>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}