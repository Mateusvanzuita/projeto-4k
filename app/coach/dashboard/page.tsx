// src/app/coach/dashboard/page.tsx

"use client"

import { AppLayout } from "@/components/app-layout"
import { coachMenuItems } from "@/lib/menu-items"
import { Card } from "@/components/ui/card"
import { Users, ClipboardList, Loader2, UserPlus } from "lucide-react"
import { useEffect, useState } from "react"
import { dashboardService, DashboardData } from "@/services/dashboard-service"
import { useAuth } from "@/contexts/auth-context" // ✅ Importe seu contexto de autenticação

const formatDate = (dateString: string | Date): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Data Inválida';
  return date.toLocaleDateString('pt-BR');
}

export default function CoachDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // ✅ Pega os dados do usuário logado
  const { user } = useAuth() 

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const dashboardData = await dashboardService.getCoachDashboard() 
        setData(dashboardData)
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err)
        setError("Erro ao carregar dados.")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()


const token = localStorage.getItem('token');
   
if (user && token) {
    import('@/lib/push-notification').then(mod => {
      // Pequeno delay para garantir que o SW esteja pronto no iOS
      setTimeout(() => mod.registerPushNotification(user.id), 1000);
    }).catch(err => console.error("Falha ao carregar lib de push:", err));
  }
}, [user])

  if (loading) {
    return (
      <AppLayout menuItems={coachMenuItems}>
        <div className="flex justify-center items-center h-full p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    )
  }

  const indicators = data?.indicators || { totalStudents: 0, activeProtocols: 0, newRegistrations: 0 };
  const newRegistrations = data?.newRegistrations || [];

  return (
    <AppLayout menuItems={coachMenuItems}>
      <div className="p-4 space-y-6">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">Portal do Coach</h1>
          <p className="text-white/90">Gerencie seus alunos e protocolos de forma eficiente</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{indicators.totalStudents}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Alunos Totais</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{indicators.activeProtocols}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Protocolos Ativos</p>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-tight mb-3 flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" /> Novos alunos recém cadastrados
          </h2>
          <Card className="divide-y overflow-hidden rounded-xl border-none shadow-md">
            {newRegistrations.length > 0 ? (
              newRegistrations.slice(0, 3).map((aluno) => (
                <div key={aluno.id} className="p-4 bg-white hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900">{aluno.nomeCompleto}</p>
                      <p className="text-xs text-muted-foreground">{aluno.email}</p>
                    </div>
                    <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded text-slate-500">
                      {formatDate(aluno.dataCriacao)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-8 text-center text-sm text-muted-foreground font-medium">
                Nenhum novo aluno registrado.
              </p>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}