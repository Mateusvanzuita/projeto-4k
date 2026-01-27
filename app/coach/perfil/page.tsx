"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { coachMenuItems } from "@/lib/menu-items"
import { apiService } from "@/services/api-service"
import { 
  User, 
  Mail, 
  Calendar, 
  Loader2, 
  ShieldCheck,
  LogOut
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format, isValid } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"

interface CoachPerfil {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function PerfilCoachPage() {
  const { logout } = useAuth()
  const [perfil, setPerfil] = useState<CoachPerfil | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPerfil = async () => {
      try {
        const response = await apiService.get<CoachPerfil>('/api/auth/profile')
        setPerfil(response)
      } catch (error) {
        toast.error("Erro ao carregar perfil.")
      } finally {
        setLoading(false)
      }
    }
    loadPerfil()
  }, [])

  // Função de segurança para formatar a data
  const formatDataCadastro = (dateString?: string) => {
    if (!dateString) return "Não disponível"
    const date = new Date(dateString)
    return isValid(date) 
      ? format(date, "MMMM 'de' yyyy", { locale: ptBR }) 
      : "Data inválida"
  }

  if (loading) {
    return (
      <AppLayout menuItems={coachMenuItems}>
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="font-medium text-sm">Carregando perfil...</p>
        </div>
      </AppLayout>
    )
  }

  if (!perfil) return null

  return (
    <AppLayout menuItems={coachMenuItems}>
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        
        {/* Header Identêntico ao do Aluno */}
        <div className="flex flex-col items-center text-center space-y-4 py-6">
          <div className="h-24 w-24 rounded-[32px] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <User className="h-10 w-10" />
          </div>
          
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{perfil.name}</h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold uppercase text-[10px]">
                {perfil.role === "ADMIN" ? "Administrador" : "Coach Responsável"}
              </Badge>
              <div className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                ID: {perfil.id.slice(0, 8)}
              </span>
            </div>
          </div>
        </div>

        {/* Card de Informações Básicas */}
        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col divide-y divide-slate-50">
              <InfoRow 
                icon={<Mail className="h-4 w-4" />} 
                label="E-mail" 
                value={perfil.email} 
              />
              <InfoRow 
                icon={<ShieldCheck className="h-4 w-4" />} 
                label="Tipo de Conta" 
                value={perfil.role === "ADMIN" ? "Administrador do Sistema" : "Treinador / Coach"} 
              />
              <InfoRow 
                icon={<Calendar className="h-4 w-4" />} 
                label="Membro desde" 
                value={formatDataCadastro(perfil.createdAt)} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Botão de Logout */}
        <div className="px-2">
          <Button 
            variant="ghost" 
            onClick={logout}
            className="w-full rounded-3xl h-14 text-red-500 font-bold hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" /> Sair do Aplicativo
          </Button>
        </div>

      </div>
    </AppLayout>
  )
}

// Componente InfoRow seguindo o padrão visual do perfil do aluno
function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-5">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
          {icon}
        </div>
        <div>
          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none mb-1">
            {label}
          </p>
          <p className="text-sm font-bold text-slate-700">{value}</p>
        </div>
      </div>
    </div>
  )
}