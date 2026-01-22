"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Syringe, Plus, Trash2, Info, Calculator } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { hormonioService } from "@/services/hormonio-service"
import type { Hormonio } from "@/types/hormonio"

interface StepHormoniosProps {
  data: any[]
  update: (data: any[]) => void
}

export function StepHormonios({ data, update }: StepHormoniosProps) {
  const [hormoniosDisponiveis, sethormoniosDisponiveis] = useState<Hormonio[]>([])

  // Carregar hormônios da API para o Select
  useEffect(() => {
    const carregarHormonios = async () => {
      try {
        const lista = await hormonioService.getAll()
        sethormoniosDisponiveis(lista)
      } catch (error) {
        console.error("Erro ao carregar hormônios:", error)
      }
    }
    carregarHormonios()
  }, [])

  // Cálculo do total de mg na semana
  const totalMgSemana = useMemo(() => {
    return data.reduce((acc, item) => {
      const dose = parseFloat(item.doseSemanal) || 0
      return acc + dose
    }, 0)
  }, [data])

  const adicionarHormonio = () => {
    const nova = {
      id: Math.random().toString(36).substring(2, 9),
      hormonioId: "",
      doseSemanal: "",
      frequencia: "",
      duracao: "",
      obsAplicacao: ""
    }
    update([...data, nova])
  }

  const removerHormonio = (id: string) => {
    update(data.filter(item => item.id !== id))
  }

  const atualizarHormonio = (id: string, campo: string, valor: string) => {
    update(data.map(item => item.id === id ? { ...item, [campo]: valor } : item))
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-purple-700">
          <Syringe className="h-6 w-6" /> Ciclo de Hormônios
        </h2>
        <p className="text-muted-foreground">Configure as substâncias, dosagens e períodos do protocolo.</p>
      </div>

      {/* Card de Resumo de Carga Total */}
      {data.length > 0 && (
        <Card className="bg-purple-50 border-purple-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg text-white">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">Total Acumulado na Semana</p>
                <p className="text-xs text-purple-700">Soma de todas as substâncias</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-purple-700">{totalMgSemana}</span>
              <span className="ml-1 text-sm font-bold text-purple-700">mg</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {data.map((item) => (
          <Card key={item.id} className="border-purple-100 overflow-hidden group">
            <CardContent className="p-5 space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-xs font-bold uppercase text-purple-700">Substância / Éster</Label>
                  <Select 
                    value={item.hormonioId} 
                    onValueChange={(v) => atualizarHormonio(item.id, "hormonioId", v)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione o hormônio..." />
                    </SelectTrigger>
                    <SelectContent>
                      {hormoniosDisponiveis.map((h) => (
                        <SelectItem key={h.id} value={h.id}>
                          {h.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-purple-700">Dose Semanal (mg)</Label>
                  <Input 
                    type="number"
                    placeholder="Ex: 250" 
                    value={item.doseSemanal}
                    onChange={(e) => atualizarHormonio(item.id, "doseSemanal", e.target.value)}
                    className="bg-white"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs font-bold uppercase text-purple-700">Duração (Semanas)</Label>
                    <Input 
                      placeholder="Ex: 1-12" 
                      value={item.duracao}
                      onChange={(e) => atualizarHormonio(item.id, "duracao", e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removerHormonio(item.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-purple-100">
                <Label className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 text-purple-600/70">
                  <Info className="h-3 w-3" /> Observações de Aplicação
                </Label>
                <Input 
                  placeholder="Ex: Aplicação profunda no glúteo; alternar locais..." 
                  value={item.obsAplicacao}
                  onChange={(e) => atualizarHormonio(item.id, "obsAplicacao", e.target.value)}
                  className="bg-white border-dashed text-xs italic"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button 
          onClick={adicionarHormonio} 
          variant="outline" 
          className="w-full h-16 border-dashed border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar Substância ao Ciclo
        </Button>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-slate-50/50">
          <p className="text-sm text-muted-foreground">Nenhuma substância adicionada ao protocolo.</p>
        </div>
      )}
    </div>
  )
}