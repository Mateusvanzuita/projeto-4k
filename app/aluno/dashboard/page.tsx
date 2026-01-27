"use client"

import { AppLayout } from "@/components/app-layout"
import { alunoMenuItems } from "@/lib/menu-items"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ClipboardList, 
  Camera, 
  MessageSquare, 
  TrendingUp, 
  Target,
  ChevronRight,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context" 
import { Badge } from "@/components/ui/badge"

export default function AlunoDashboard() {
  const router = useRouter()
  const { user } = useAuth() 

  useEffect(() => {
 
    if (user?.id) {
      import('@/lib/push-notification').then(mod => {
        mod.registerPushNotification(user.id);
      }).catch(err => console.error("Erro ao carregar serviço de notificações:", err));
    }
  }, [user]);

  return (
    <AppLayout menuItems={alunoMenuItems}>
      <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
        
        {/* Seção Meu Portal */}
        <div className="bg-[#004767] text-white rounded-[2rem] p-8 shadow-lg shadow-blue-900/20 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black tracking-tight mb-2">Meu Portal</h1>
            <p className="text-blue-100 font-medium italic opacity-90">
              Acompanhe seu progresso e evolução
            </p>
          </div>
          {/* Círculo decorativo ao fundo */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Acesso Rápido - Botões Grandes para Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="h-24 rounded-3xl border-none shadow-sm bg-white hover:bg-slate-50 flex flex-col items-center justify-center gap-2 group transition-all"
            onClick={() => router.push("/aluno/protocolo")}
          >
            <div className="p-2 bg-blue-50 text-[#004767] rounded-xl group-hover:scale-110 transition-transform">
              <ClipboardList className="h-6 w-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-600">Protocolo</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-24 rounded-3xl border-none shadow-sm bg-white hover:bg-slate-50 flex flex-col items-center justify-center gap-2 group transition-all"
            onClick={() => router.push("/aluno/fotos")}
          >
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
              <Camera className="h-6 w-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-600">Enviar Foto</span>
          </Button>

          {/* <Button 
            variant="outline" 
            className="h-24 rounded-3xl border-none shadow-sm bg-white hover:bg-slate-50 flex flex-col items-center justify-center gap-2 group transition-all"
            onClick={() => router.push("/aluno/chat")}
          >
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <MessageSquare className="h-6 w-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-600">Chat Coach</span>
          </Button> */}
        </div>

        {/* Resumo de Progresso e Notificações */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card de Foco */}
          <Card className="rounded-[2rem] border-none shadow-md overflow-hidden bg-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-800">Objetivo Atual</h3>
                </div>
                <Badge className="bg-indigo-100 text-indigo-700 border-none px-3">Hipertrofia</Badge>
              </div>
              
              <div className="pt-4 flex items-center gap-4">
                <div className="h-16 w-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin-slow flex items-center justify-center">
                   <span className="text-xs font-black text-slate-700">75%</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-600">Meta Semanal</p>
                  <p className="text-xs text-slate-400">Faltam 2 treinos para bater a meta</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Notificações */}
          <Card className="rounded-[2rem] border-none shadow-md overflow-hidden bg-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <Bell className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-800">Recentes</h3>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ver Tudo</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="h-2 w-2 rounded-full bg-red-500 shadow-sm" />
                  <p className="text-xs font-medium text-slate-600">Novo protocolo disponível</p>
                  <ChevronRight className="h-4 w-4 ml-auto text-slate-300" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors opacity-60">
                  <div className="h-2 w-2 rounded-full bg-slate-300" />
                  <p className="text-xs font-medium text-slate-600">Feedback da foto enviado</p>
                  <ChevronRight className="h-4 w-4 ml-auto text-slate-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </AppLayout>
  )
}