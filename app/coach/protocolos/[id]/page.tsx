"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  Dumbbell, Utensils, Syringe, Pill, Calendar, 
  ArrowLeft, Edit3, Printer, Share2, Activity,
  Clock, CheckCircle2, AlertCircle, Info, Target,
  Scale, Ruler, Flame, Droplets, Zap, Repeat
} from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { coachMenuItems } from "@/lib/menu-items"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { protocoloService } from "@/services/protocolo-service"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function DetalheProtocoloPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [protocolo, setProtocolo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) loadProtocolo()
  }, [id])

  const loadProtocolo = async () => {
    try {
      const data = await protocoloService.getById(id as string)
      setProtocolo(data)
    } catch (error) {
      toast({ title: "Erro", description: "Protocolo não encontrado.", variant: "destructive" })
      router.push("/coach/protocolos")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <AppLayout menuItems={coachMenuItems}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004767]"></div>
        <p className="text-slate-400 animate-pulse font-medium uppercase text-xs tracking-widest">Carregando Planejamento...</p>
      </div>
    </AppLayout>
  )

  return (
    <AppLayout menuItems={coachMenuItems}>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700 pb-20">
        
        {/* HEADER ESTRATÉGICO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border shadow-sm">
          <div className="flex items-center gap-5">
            <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-slate-50">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Button>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{protocolo.nome}</h1>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{protocolo.status}</Badge>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Atleta: <span className="text-[#004767] font-bold">{protocolo.aluno?.nomeCompleto}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl gap-2 border-slate-200 h-11 px-5 font-bold text-slate-600">
              <Printer className="h-4 w-4" /> PDF
            </Button>
            <Button onClick={() => router.push(`/coach/protocolos/${id}/editar`)} className="bg-[#004767] hover:bg-[#00354d] rounded-xl gap-2 h-11 px-6 font-bold shadow-lg shadow-blue-900/20">
              <Edit3 className="h-4 w-4" /> Editar Plano
            </Button>
          </div>
        </div>

        {/* DASHBOARD DE BIOMETRIA E METAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm bg-blue-50/50 rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-200">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest">Objetivo</p>
                <p className="text-sm font-bold text-slate-800">{protocolo.objetivo || "Geral"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-orange-50/50 rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-200">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-orange-600/60 uppercase tracking-widest">Meta Calórica</p>
                <p className="text-sm font-bold text-slate-800">{protocolo.totalCalorico || 0} kcal</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-indigo-50/50 rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-indigo-600/60 uppercase tracking-widest">Validade</p>
                <p className="text-sm font-bold text-slate-800">
                  {protocolo.dataValidade ? format(new Date(protocolo.dataValidade), "dd/MM/yyyy") : "Indefinida"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-emerald-50/50 rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Volume Treino</p>
                <p className="text-sm font-bold text-slate-800">{protocolo.planosTreino?.length || 0} Divisões</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="nutricao" className="space-y-8">
          <TabsList className="bg-slate-100/50 border p-1.5 h-14 rounded-2xl shadow-inner w-full md:w-auto grid grid-cols-2 md:flex">
            <TabsTrigger value="nutricao" className="rounded-xl gap-2 px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Utensils className="h-4 w-4" /> Nutrição
            </TabsTrigger>
            <TabsTrigger value="treino" className="rounded-xl gap-2 px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Dumbbell className="h-4 w-4" /> Treino
            </TabsTrigger>
            <TabsTrigger value="suplementos" className="rounded-xl gap-2 px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Pill className="h-4 w-4" /> Suplementos
            </TabsTrigger>
            <TabsTrigger value="hormonios" className="rounded-xl gap-2 px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Syringe className="h-4 w-4" /> Hormônios
            </TabsTrigger>
          </TabsList>

          {/* --- ABA NUTRIÇÃO --- */}
          <TabsContent value="nutricao" className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <Clock className="h-5 w-5 text-orange-500" /> Cronograma de Refeições
                </h3>
                {protocolo.refeicoes?.map((ref: any, idx: number) => (
                  <Card key={idx} className="border-none shadow-md rounded-3xl overflow-hidden group">
                    <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-sm text-[#004767] font-black text-sm">
                          {idx + 1}
                        </div>
                        <span className="font-black text-slate-700 uppercase tracking-tight">{ref.nomeRefeicao}</span>
                      </div>
                      <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 font-bold px-3 py-1 rounded-full gap-1.5">
                        <Clock className="h-3 w-3" /> {ref.horarioPrevisto}
                      </Badge>
                    </div>
                    <CardContent className="p-6 space-y-4 bg-white">
                      <div className="grid gap-3">
                        {ref.alimentos?.map((item: any, aIdx: number) => (
                          <div key={aIdx} className="space-y-2">
                            <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/50 border border-transparent group-hover:border-slate-100 transition-all">
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-orange-400" />
                                <span className="font-bold text-slate-800">{item.alimento?.nome}</span>
                              </div>
                              <span className="bg-[#004767] text-white text-xs font-black px-3 py-1 rounded-lg">
                                {item.quantidade} {item.unidadeMedida}
                              </span>
                            </div>
                            {/* Trocas/Substituições */}
                            {item.substituicoes?.length > 0 && (
                                <div className="ml-5 p-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/20 space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                                        <Repeat className="h-3 w-3" /> Opções de Substituição
                                    </p>
                                    {item.substituicoes.map((s: any, sIdx: number) => (
                                        <div key={sIdx} className="text-xs text-slate-600 flex justify-between italic">
                                            <span>• {s.alimento}</span>
                                            <span className="font-bold">{s.quantidade}{s.unidade}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {ref.observacoes && (
                        <div className="mt-4 p-4 rounded-2xl bg-blue-50/30 border border-blue-100 flex gap-3">
                          <Info className="h-4 w-4 text-blue-500 shrink-0" />
                          <p className="text-xs text-blue-700 italic leading-relaxed">{ref.observacoes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* CARD DE MACROS LATERAL */}
              <div className="space-y-6">
                <Card className="border-none shadow-xl bg-[#004767] text-white rounded-[2rem] sticky top-8">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-black uppercase tracking-[0.2em] opacity-60">Metas Diárias</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8 p-8">
                    <div className="text-center space-y-1">
                      <p className="text-5xl font-black">{protocolo.totalCalorico}</p>
                      <p className="text-xs font-bold uppercase opacity-50 tracking-widest">Kcal Totais</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { label: "Proteínas", val: protocolo.macros?.p, color: "bg-blue-400", suffix: "g" },
                        { label: "Carboidratos", val: protocolo.macros?.c, color: "bg-orange-400", suffix: "g" },
                        { label: "Gorduras", val: protocolo.macros?.g, color: "bg-yellow-400", suffix: "g" },
                        { label: "Água", val: protocolo.consumoAgua, color: "bg-cyan-400", suffix: "" },
                      ].map((macro, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                            <span>{macro.label}</span>
                            <span>{macro.val}{macro.suffix}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full ${macro.color} rounded-full`} style={{ width: '100%' }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {protocolo.regrasGeraisNutricao && (
                      <div className="pt-6 border-t border-white/10 space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Observações Estratégicas</p>
                        <p className="text-xs leading-relaxed text-blue-100 italic">"{protocolo.regrasGeraisNutricao}"</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* --- ABA TREINO ---  */}
          <TabsContent value="treino" className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {protocolo.planosTreino?.map((treino: any, idx: number) => (
                <Card key={idx} className="border-none shadow-lg rounded-[2rem] overflow-hidden border-t-8 border-t-[#004767]">
                  <CardHeader className="bg-slate-50/50 pb-4">
                    <CardTitle className="text-center font-black text-[#004767] uppercase tracking-tighter text-xl">
                      {treino.nomeDivisao}
                    </CardTitle>
                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{treino.grupoMuscular || "Foco Semanal"}</p>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      {treino.exercicios?.map((ex: any, eIdx: number) => (
                        <div key={eIdx} className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-all shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-800 text-sm leading-tight max-w-[70%]">{ex.exercicio?.nomeExercicio || "Exercício"}</h4>
                            <Badge variant="secondary" className="font-black text-[10px] bg-slate-100">{ex.series} Séries</Badge>
                          </div>
                          <div className="flex gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-orange-400" /> {ex.repeticoes} Reps</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-blue-400" /> {ex.intervaloDescanso}</span>
                          </div>
                          {ex.observacoes && (
                             <p className="mt-3 text-[10px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border-l-2 border-slate-200">{ex.observacoes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ABAS DE SUPLEMENTOS E HORMÔNIOS (SIMPLIFICADAS PARA FOCO EM DOSAGEM) */}
          <TabsContent value="suplementos" className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="grid md:grid-cols-3 gap-6">
                {protocolo.suplementosProtocolo?.map((sup: any, i: number) => (
                    <Card key={i} className="rounded-3xl border-none shadow-md overflow-hidden">
                        <div className="h-2 bg-yellow-400" />
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-50 rounded-xl text-yellow-600"><Pill className="h-5 w-5" /></div>
                                <h4 className="font-bold text-slate-800">{sup.suplemento?.nomeSuplemento || sup.suplemento?.nomeManipulado}</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1"><p className="text-[10px] font-bold text-slate-400 uppercase">Dose</p><p className="text-sm font-black text-slate-700">{sup.quantidade}</p></div>
                                <div className="space-y-1"><p className="text-[10px] font-bold text-slate-400 uppercase">Momento</p><p className="text-sm font-black text-slate-700">{sup.formaUso}</p></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
             </div>
          </TabsContent>

        </Tabs>
      </div>
    </AppLayout>
  )
}