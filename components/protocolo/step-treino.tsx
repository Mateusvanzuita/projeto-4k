"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dumbbell, Plus, Trash2, Timer, Activity, 
  HeartPulse, MessageSquare, Info 
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exercicioService } from "@/services/exercicio-service"
import type { Exercicio } from "@/types/exercicio"

interface StepTreinoProps {
  data: any
  update: (data: any) => void
}

export function StepTreino({ data, update }: StepTreinoProps) {
  const [listaExercicios, setListaExercicios] = useState<Exercicio[]>([])
  const [loadingEx, setLoadingEx] = useState(false)

  // Fallback seguro para os dados iniciais
  const cardio = data?.cardio || { tipo: "", frequencia: "", tempo: "", observacoes: "" }
  const mobilidade = data?.mobilidade || { quantidade: "", tipos: "" }
  const divisoes = data?.divisoes || []

  // Carregar lista de exercícios para o Select
  useEffect(() => {
    const loadEx = async () => {
      setLoadingEx(true)
      try {
        const response = await exercicioService.getAll()
        setListaExercicios(response.exercicios || [])
      } catch (err) {
        console.error("Erro ao carregar exercícios", err)
      } finally {
        setLoadingEx(false)
      }
    }
    loadEx()
  }, [])

  const updateField = (section: string, field: string, value: any) => {
    update({ ...data, [section]: { ...data[section], [field]: value } })
  }

  const adicionarDivisao = () => {
    const letras = ["A", "B", "C", "D", "E", "F", "G"]
    const proximaLetra = letras[divisoes.length] || "X"
    const nova = { 
      id: Math.random().toString(36).substring(2, 9), 
      letra: proximaLetra, 
      exercicios: [] 
    }
    update({ ...data, divisoes: [...divisoes, nova] })
  }

  const removerDivisao = (id: string) => {
    update({ ...data, divisoes: divisoes.filter((d: any) => d.id !== id) })
  }

  const adicionarExercicio = (divId: string) => {
    const novas = divisoes.map((d: any) => {
      if (d.id === divId) {
        return {
          ...d,
          exercicios: [
            ...d.exercicios,
            { id: Date.now().toString(), exercicioId: "", series: "", reps: "", descanso: "", obs: "" }
          ]
        }
      }
      return d
    })
    update({ ...data, divisoes: novas })
  }

  const atualizarExercicio = (divId: string, exId: string, campo: string, valor: string) => {
    const novas = divisoes.map((d: any) => {
      if (d.id === divId) {
        const exs = d.exercicios.map((ex: any) => ex.id === exId ? { ...ex, [campo]: valor } : ex)
        return { ...d, exercicios: exs }
      }
      return d
    })
    update({ ...data, divisoes: novas })
  }

  return (
    <div className="space-y-8 pb-10">
      {/* 1. SEÇÃO ESTRUTURA E CARDIO */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="pb-3 px-4">
            <CardTitle className="text-xs font-bold uppercase flex items-center gap-2 text-blue-700">
              <HeartPulse className="h-4 w-4" /> Planejamento de Cardio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-bold opacity-60">Tipo (Bike, Esteira...)</Label>
                <Input value={cardio.tipo} onChange={(e) => updateField('cardio', 'tipo', e.target.value)} placeholder="Ex: Corrida" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-bold opacity-60">Frequência/Tempo</Label>
                <Input value={cardio.frequencia} onChange={(e) => updateField('cardio', 'frequencia', e.target.value)} placeholder="Ex: 4x 40min" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold opacity-60">Observações do Cardio</Label>
              <Input value={cardio.observacoes} onChange={(e) => updateField('cardio', 'observacoes', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="pb-3 px-4">
            <CardTitle className="text-xs font-bold uppercase flex items-center gap-2 text-emerald-700">
              <Activity className="h-4 w-4" /> Mobilidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 pb-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold opacity-60">Volume (Ex: 3 mobilidades)</Label>
              <Input value={mobilidade.quantidade} onChange={(e) => updateField('mobilidade', 'quantidade', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold opacity-60">Tipos / Foco</Label>
              <Input value={mobilidade.tipos} onChange={(e) => updateField('mobilidade', 'tipos', e.target.value)} placeholder="Ex: Escapular e Lombar" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. ESTRUTURA GERAL */}
      <Card className="bg-slate-50/50 border-dashed">
        <CardContent className="pt-6 space-y-3">
          <Label className="text-xs font-bold flex items-center gap-2 uppercase opacity-70">
            <Info className="h-4 w-4" /> Estrutura de Treino e Descanso
          </Label>
          <Textarea 
            placeholder="Metodologia aplicada e regras de descanso off-season..."
            value={data.estrutura}
            onChange={(e) => update({ ...data, estrutura: e.target.value })}
            className="bg-white min-h-[80px]"
          />
        </CardContent>
      </Card>

      {/* 3. DIVISÕES EM LISTA VERTICAL */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-lg text-[#004767]">Divisões de Treino</h3>
          <Button onClick={adicionarDivisao} size="sm" className="bg-[#004767]">
            <Plus className="h-4 w-4 mr-1" /> Nova Divisão
          </Button>
        </div>

        {divisoes.map((div: any) => (
          <Card key={div.id} className="border-t-4 border-t-primary shadow-md overflow-visible">
            <CardHeader className="py-3 px-4 bg-slate-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black text-primary uppercase">
                TREINO {div.letra}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => removerDivisao(div.id)} className="text-red-300 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="p-4 space-y-4 overflow-visible">
              <div className="space-y-4">
                {div.exercicios.map((ex: any) => (
                  <div key={ex.id} className="bg-white border rounded-xl p-4 shadow-sm space-y-3 relative overflow-visible border-l-4 border-l-primary">
                    <div className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-12 md:col-span-5 space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase opacity-60">Exercício</Label>
                        <Select 
                          value={ex.exercicioId} 
                          onValueChange={(val) => atualizarExercicio(div.id, ex.id, "exercicioId", val)}
                        >
                          <SelectTrigger className="h-10 text-xs">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {listaExercicios.map(item => (
                              <SelectItem key={item.id} value={item.id} className="text-xs">{item.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-3 md:col-span-2 space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase opacity-60">Séries</Label>
                        <Input className="h-10 text-center" value={ex.series} onChange={(e) => atualizarExercicio(div.id, ex.id, "series", e.target.value)} />
                      </div>

                      <div className="col-span-3 md:col-span-2 space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase opacity-60">Reps</Label>
                        <Input className="h-10 text-center" value={ex.reps} onChange={(e) => atualizarExercicio(div.id, ex.id, "reps", e.target.value)} />
                      </div>

                      <div className="col-span-4 md:col-span-2 space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase opacity-60 flex items-center gap-1">
                          <Timer className="h-3 w-3" /> Descanso
                        </Label>
                        <Input className="h-10 text-center" value={ex.descanso} onChange={(e) => atualizarExercicio(div.id, ex.id, "descanso", e.target.value)} />
                      </div>

                      <div className="col-span-2 md:col-span-1 flex justify-end">
                        <Button variant="ghost" size="icon" className="text-red-200" onClick={() => {
                          const novas = divisoes.map(d => d.id === div.id ? { ...d, exercicios: d.exercicios.filter((e: any) => e.id !== ex.id) } : d)
                          update({ ...data, divisoes: novas })
                        }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <Label className="text-[10px] font-bold uppercase opacity-60 italic flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> Observação técnica
                      </Label>
                      <Input 
                        className="h-8 text-xs bg-slate-50/50 border-none" 
                        value={ex.obs} 
                        onChange={(e) => atualizarExercicio(div.id, ex.id, "obs", e.target.value)}
                        placeholder="Ex: Focar na contração..."
                      />
                    </div>
                  </div>
                ))}

                <Button variant="outline" onClick={() => adicionarExercicio(div.id)} className="w-full border-dashed py-6 hover:bg-slate-50 border-2">
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Exercício ao Treino {div.letra}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}