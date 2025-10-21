"use client"

import { AppLayout } from "@/components/app-layout"
import { alunoMenuItems } from "@/lib/menu-items"
import { Card } from "@/components/ui/card"
import { Dumbbell, Apple, TrendingUp, Target } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AlunoDashboard() {
  const handleCreateProtocol = () => {
    console.log("[v0] Create protocol clicked (aluno view)")
    // TODO: For aluno, this might open a request form
  }

  const handleNavigateAlunos = () => {
    console.log("[v0] Navigate to alunos clicked (aluno view)")
    // TODO: For aluno, this might show their coach info
  }

  const handleNavigateRelatorios = () => {
    console.log("[v0] Navigate to relatórios clicked (aluno view)")
    // TODO: Navigate to personal reports
  }

  return (
    <AppLayout
      menuItems={alunoMenuItems}
      onCreateProtocol={handleCreateProtocol}
      onNavigateAlunos={handleNavigateAlunos}
      onNavigateRelatorios={handleNavigateRelatorios}
    >
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">Meu Portal</h1>
          <p className="text-white/90">Acompanhe seu progresso e evolução</p>
        </div>

        {/* Today's Workout */}
        <Card className="p-4 bg-secondary/10 border-secondary">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg">Treino de Hoje</h3>
              <p className="text-sm text-muted-foreground">Treino A - Peito e Tríceps</p>
            </div>
            <Dumbbell className="h-6 w-6 text-secondary" />
          </div>
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary">Iniciar Treino</Button>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Meta</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">+2kg</p>
                <p className="text-sm text-muted-foreground">Progresso</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Acesso Rápido</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 flex flex-col items-center text-center gap-2 hover:bg-accent cursor-pointer transition-colors">
              <Dumbbell className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">Meus Treinos</span>
            </Card>
            <Card className="p-4 flex flex-col items-center text-center gap-2 hover:bg-accent cursor-pointer transition-colors">
              <Apple className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">Minha Dieta</span>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Histórico Recente</h2>
          <Card className="divide-y">
            <div className="p-4">
              <p className="font-medium">Treino B completado</p>
              <p className="text-sm text-muted-foreground">Ontem às 18:30</p>
            </div>
            <div className="p-4">
              <p className="font-medium">Peso registrado: 78.5kg</p>
              <p className="text-sm text-muted-foreground">Há 2 dias</p>
            </div>
            <div className="p-4">
              <p className="font-medium">Novo protocolo recebido</p>
              <p className="text-sm text-muted-foreground">Há 3 dias</p>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
