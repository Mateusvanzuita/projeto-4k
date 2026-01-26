"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { alunoMenuItems } from "@/lib/menu-items"
import { perfilService, AlunoPerfil } from "@/services/perfil-service"
import { User, Mail, Calendar, Target, Award, Clock, Settings, Loader2, Zap, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format, isValid } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<AlunoPerfil | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPerfil = async () => {
      try {
        const data = await perfilService.getPerfil()
        console.log("👤 Dados do perfil no Frontend:", data);
        setPerfil(data)
      } finally {
        setLoading(false)
      }
    }
    loadPerfil()
  }, [])

  if (loading) {
    return (
      <AppLayout menuItems={alunoMenuItems}>
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="font-bold">Carregando seu perfil...</p>
        </div>
      </AppLayout>
    )
  }

  if (!perfil) {
    return (
      <AppLayout menuItems={alunoMenuItems}>
        <div className="p-8 text-center space-y-4">
          <p className="text-red-500 font-bold">Não foi possível carregar os dados do perfil.</p>
          <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
        </div>
      </AppLayout>
    )
  }

  const formatDataInicio = (dateStr: string) => {
    const date = new Date(dateStr)
    return isValid(date) 
      ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
      : "Data não disponível"
  }

  return (
    <AppLayout menuItems={alunoMenuItems}>
      <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6 pb-24 animate-in fade-in duration-500">
        
        {/* Header do Perfil - Ajustado: Sem Foto e Texto "Aluno Ativo" */}
        <div className="flex flex-col items-center space-y-2 pt-4 pb-4">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{perfil.nomeCompleto}</h1>
          <Badge className="font-black bg-emerald-500/10 text-emerald-600 border-none uppercase tracking-widest px-4 py-1">
            Aluno Ativo
          </Badge>
        </div>

        {/* Informações Principais */}
        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100/50">
            <CardTitle className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 flex items-center gap-2">
              <User className="h-3 w-3" /> Dados do Aluno
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              <InfoRow icon={<Mail className="h-4 w-4" />} label="E-mail" value={perfil.email} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="Idade" value={perfil.idade ? `${perfil.idade} anos` : "Pendente"} />
              <InfoRow icon={<Target className="h-4 w-4" />} label="Objetivo" value={perfil.objetivo || "Não definido"} />
            </div>
          </CardContent>
        </Card>

        {/* Plano e Contrato - Ajustado: Com Tipo de Plano e Nome do Coach */}
        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100/50">
            <CardTitle className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 flex items-center gap-2">
              <Award className="h-3 w-3" /> Plano Contratado
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              <InfoRow icon={<Award className="h-4 w-4" />} label="Duração" value={perfil.plano} isBadge />
              <InfoRow icon={<Zap className="h-4 w-4" />} label="Tipo de Plano" value={perfil.tipoPlano || "---"} />
              <InfoRow icon={<ShieldCheck className="h-4 w-4" />} label="Coach Responsável" value={`@${perfil.coachNome || 'Coach'}`} />
              <InfoRow 
                icon={<Clock className="h-4 w-4" />} 
                label="Início do Protocolo" 
                value={formatDataInicio(perfil.dataInicio)} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Placeholder para futuras configurações */}
        <div className="pt-4 px-2">
          <button className="w-full rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold py-4 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors text-sm">
            <Settings className="h-4 w-4" /> Configurações de Conta (Em breve)
          </button>
        </div>
      </div>
    </AppLayout>
  )
}

function InfoRow({ icon, label, value, isBadge = false }: { icon: React.ReactNode, label: string, value: string, isBadge?: boolean }) {
  return (
    <div className="flex items-center justify-between p-5">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
          {icon}
        </div>
        <div>
          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none mb-1">{label}</p>
          <p className="text-sm font-bold text-slate-700">{isBadge ? "" : value}</p>
        </div>
      </div>
      {isBadge && (
        <Badge className="font-black bg-primary text-white border-none rounded-lg px-3">{value}</Badge>
      )}
    </div>
  )
}