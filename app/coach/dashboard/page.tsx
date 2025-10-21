"use client"

import { AppLayout } from "@/components/app-layout"
import { coachMenuItems } from "@/lib/menu-items"
import { Card } from "@/components/ui/card"
import { Users, ClipboardList, TrendingUp, Calendar } from "lucide-react"

export default function CoachDashboard() {
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Alunos</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-muted-foreground">Protocolos</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-sm text-muted-foreground">Adesão</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Hoje</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Atividades Recentes</h2>
          <Card className="divide-y">
            <div className="p-4">
              <p className="font-medium">João Silva iniciou novo protocolo</p>
              <p className="text-sm text-muted-foreground">Há 2 horas</p>
            </div>
            <div className="p-4">
              <p className="font-medium">Maria Santos completou treino de pernas</p>
              <p className="text-sm text-muted-foreground">Há 4 horas</p>
            </div>
            <div className="p-4">
              <p className="font-medium">Pedro Oliveira enviou feedback</p>
              <p className="text-sm text-muted-foreground">Há 6 horas</p>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
