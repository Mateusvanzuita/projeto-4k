"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { alunoMenuItems } from "@/lib/menu-items"
import { protocoloService } from "@/services/protocolo-service"
import { 
  ClipboardList, 
  History, 
  Utensils, 
  Dumbbell, 
  Pill, 
  Syringe, 
  Calendar,
  ChevronRight,
  Clock,
  ArrowLeft
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function AlunoProtocoloPage() {
  const [protocolos, setProtocolos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedProtocolo, setSelectedProtocolo] = useState<any>(null)

  useEffect(() => {
    loadProtocolos()
  }, [])

  const loadProtocolos = async () => {
    try {
      setLoading(true)
      // O getAll já retorna a lista filtrada pelo backend para o usuário logado
      const data = await protocoloService.getAll()
      setProtocolos(data)
      
      // Define o protocolo ATIVO como o principal para visualização inicial
      const ativo = data.find((p: any) => p.status === "ATIVO") || data[0]
      setSelectedProtocolo(ativo)
    } catch (error) {
      console.error("Erro ao carregar protocolos", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AppLayout menuItems={alunoMenuItems}>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    )
  }

  // Visualização do Histórico
  if (showHistory) {
    return (
      <AppLayout menuItems={alunoMenuItems}>
        <div className="p-4 space-y-4 max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => setShowHistory(false)} className="gap-2 p-0 hover:bg-transparent">
            <ArrowLeft className="h-4 w-4" /> Voltar ao atual
          </Button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="h-5 w-5 text-slate-400" /> Histórico de Protocolos
          </h2>
          <div className="space-y-3">
            {protocolos.map((p) => (
              <Card 
                key={p.id} 
                className={`cursor-pointer hover:border-primary transition-colors ${selectedProtocolo?.id === p.id ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => {
                  setSelectedProtocolo(p)
                  setShowHistory(false)
                }}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-700">{p.nome}</p>
                    <p className="text-xs text-slate-500">
                      Iniciado em {format(new Date(p.dataCriacao), "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                  <Badge variant={p.status === "ATIVO" ? "default" : "secondary"}>
                    {p.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout menuItems={alunoMenuItems}>
      <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto pb-24">
        
        {/* Header do Protocolo */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Badge className="bg-emerald-500 hover:bg-emerald-600 mb-2 uppercase text-[10px] tracking-widest font-black">
              {selectedProtocolo?.status}
            </Badge>
            <h1 className="text-2xl font-black text-slate-800 leading-none">
              {selectedProtocolo?.nome}
            </h1>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> 
              Atualizado em {selectedProtocolo && format(new Date(selectedProtocolo.dataCriacao), "dd/MM/yyyy")}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowHistory(true)}
            className="rounded-full border-slate-200 text-slate-600 font-bold text-xs"
          >
            <History className="h-4 w-4 mr-2" /> Histórico
          </Button>
        </div>

        {/* Conteúdo em Abas */}
        <Tabs defaultValue="dieta" className="w-full">
          <TabsList className="grid grid-cols-4 w-full h-14 bg-slate-100/50 p-1 rounded-2xl shadow-inner">
            <TabsTrigger value="dieta" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Utensils className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Dieta</span>
            </TabsTrigger>
            <TabsTrigger value="treino" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Dumbbell className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Treino</span>
            </TabsTrigger>
            <TabsTrigger value="suplementos" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Pill className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Suplementos</span>
            </TabsTrigger>
            <TabsTrigger value="hormonios" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Syringe className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Hormônios</span>
            </TabsTrigger>
          </TabsList>

          {/* ABA DIETA */}
          <TabsContent value="dieta" className="mt-6 space-y-4">
            {selectedProtocolo?.refeicoes?.length > 0 ? (
              selectedProtocolo.refeicoes.map((ref: any, idx: number) => (
                <Card key={idx} className="border-none shadow-sm rounded-2xl overflow-hidden group border-l-4 border-l-amber-400">
                  <CardHeader className="bg-slate-50/50 py-3 px-5 flex flex-row justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm text-amber-600">
                        <Clock className="h-4 w-4" />
                      </div>
                      <span className="font-black text-slate-700 uppercase text-xs tracking-tight">
                        {ref.nomeRefeicao || `Refeição ${idx + 1}`}
                      </span>
                    </div>
                    <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 font-bold">
                      {ref.horarioPrevisto || "00:00"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-5 space-y-2">
                    {ref.alimentos?.map((alim: any, aIdx: number) => (
                      <div key={aIdx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50/30 border border-slate-100/50">
                        <span className="font-bold text-slate-700 text-sm">{alim.alimento?.nome}</span>
                        <span className="text-xs font-black bg-[#004767] text-white px-3 py-1 rounded-lg">
                          {alim.quantidade} {alim.unidadeMedida}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center py-10 text-slate-400 italic">Nenhuma refeição cadastrada neste protocolo.</p>
            )}
          </TabsContent>

          {/* ABA TREINO */}
          <TabsContent value="treino" className="mt-6 space-y-4">
             {selectedProtocolo?.planosTreino?.map((treino: any, idx: number) => (
               <Card key={idx} className="border-none shadow-sm rounded-3xl overflow-hidden border-t-4 border-t-[#004767]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[#004767] font-black uppercase tracking-tighter text-lg">
                      {treino.nomeDivisao}
                    </CardTitle>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{treino.objetivo || "Hipertrofia e Força"}</p>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    {treino.exercicios?.map((ex: any, eIdx: number) => (
                      <div key={eIdx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-800">{ex.exercicio?.nomeExercicio}</p>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                            {ex.series} Séries • {ex.repeticoes} Reps • {ex.intervaloDescanso} Descanso
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                      </div>
                    ))}
                  </CardContent>
               </Card>
             ))}
          </TabsContent>

          {/* ABA SUPLEMENTOS */}
          <TabsContent value="suplementos" className="mt-6">
            <div className="grid gap-3">
              {selectedProtocolo?.suplementosProtocolo?.map((sup: any, i: number) => (
                <Card key={i} className="border-none shadow-sm rounded-2xl p-4 flex items-center gap-4 bg-white">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Pill className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{sup.suplemento?.nomeSuplemento || "Suplemento"}</p>
                    <p className="text-xs text-slate-500 font-medium italic">{sup.quantidade} • {sup.formaUso}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ABA HORMONIOS */}
          <TabsContent value="hormonios" className="mt-6">
            <div className="grid gap-3">
              {selectedProtocolo?.hormoniosProtocolo?.map((h: any, i: number) => (
                <Card key={i} className="border-none shadow-sm rounded-2xl p-4 flex items-center gap-4 bg-white">
                  <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                    <Syringe className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{h.hormonio?.nomeHormonio || "Hormônio"}</p>
                    <p className="text-xs text-slate-500 font-medium italic">{h.dosagem} • {h.frequencia}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}