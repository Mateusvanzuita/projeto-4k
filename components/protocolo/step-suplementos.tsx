"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pill, FlaskConical, Plus, Trash2, Search, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { suplementoService } from "@/services/suplemento-service"
import type { Suplemento } from "@/types/suplemento"

const DIAS_SEMANA = [
  "Todos os dias",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo"
]

interface StepSuplementosProps {
  data: {
    suplementos: any[]
    manipulados: any[]
  }
  update: (data: any) => void
}

export function StepSuplementos({ data, update }: StepSuplementosProps) {
  const [activeSubTab, setActiveSubTab] = useState("suplementos")
  const [allSuplementos, setAllSuplementos] = useState<Suplemento[]>([])
  const [loading, setLoading] = useState(true)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSearch, setActiveSearch] = useState<{ id: string, tipo: "suplementos" | "manipulados" } | null>(null)

  useEffect(() => {
    const loadSuplementos = async () => {
      setLoading(true)
      try {
        const response = await suplementoService.getAll({ limit: 500 })
        setAllSuplementos(response.suplementos || [])
      } catch (error) {
        console.error("Erro ao carregar catálogo:", error)
      } finally {
        setLoading(false)
      }
    }
    loadSuplementos()
  }, [])

  const filteredOptions = useMemo(() => {
    const tipoFiltro = activeSubTab === "suplementos" ? "suplemento" : "manipulado"
    const disponiveis = allSuplementos.filter(s => s.tipo === tipoFiltro)
    
    if (!searchQuery.trim()) return disponiveis.slice(0, 20)
    const lower = searchQuery.toLowerCase()
    return disponiveis.filter(s => 
      (s.nomeSuplemento?.toLowerCase().includes(lower)) || 
      (s.nomeManipulado?.toLowerCase().includes(lower))
    ).slice(0, 20)
  }, [allSuplementos, searchQuery, activeSubTab])

  const selecionarItem = (itemCatalogo: Suplemento) => {
    if (!activeSearch) return
    const { id, tipo } = activeSearch
    const novas = data[tipo].map((item: any) => 
      item.id === id ? { 
        ...item, 
        suplementoId: itemCatalogo.id, 
        nome: itemCatalogo.nomeSuplemento || itemCatalogo.nomeManipulado 
      } : item
    )
    update({ ...data, [tipo]: novas })
    setActiveSearch(null)
    setSearchQuery("")
  }

  const adicionarItem = (tipo: "suplementos" | "manipulados") => {
    const novoItem = {
      id: Math.random().toString(36).substring(2, 9),
      suplementoId: "",
      nome: "",
      dose: "",
      horario: "",
      objetivo: "",
      diasSemana: "Todos os dias"
    }
    update({ ...data, [tipo]: [...data[tipo], novoItem] })
  }

  const removerItem = (tipo: "suplementos" | "manipulados", id: string) => {
    update({ ...data, [tipo]: data[tipo].filter((item: any) => item.id !== id) })
  }

  const atualizarCampo = (tipo: "suplementos" | "manipulados", id: string, campo: string, valor: string) => {
    const novas = data[tipo].map((item: any) => item.id === id ? { ...item, [campo]: valor } : item)
    update({ ...data, [tipo]: novas })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="text-center space-y-2 px-4">
        <h2 className="text-2xl font-bold text-[#004767]">Suplementos e Manipulados</h2>
        <p className="text-muted-foreground italic text-sm">
          Configure a frequência e o objetivo de cada item prescrito.
        </p>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <div className="px-4">
          <TabsList className="grid w-full grid-cols-2 h-10 mb-4">
            <TabsTrigger value="suplementos" className="text-xs sm:text-sm">Suplementos</TabsTrigger>
            <TabsTrigger value="manipulados" className="text-xs sm:text-sm">Manipulados</TabsTrigger>
          </TabsList>
        </div>

        {["suplementos", "manipulados"].map((tipo) => (
          <TabsContent key={tipo} value={tipo} className="space-y-4 pt-2 px-4 overflow-visible">
            {data[tipo as "suplementos" | "manipulados"].map((item: any) => (
              <Card key={item.id} className={`border-l-4 ${tipo === "suplementos" ? "border-l-yellow-500" : "border-l-purple-500"} shadow-sm overflow-visible`}>
                <CardContent className="p-4 space-y-4 relative overflow-visible">
                  {/* Linha 1: Nome */}
                  <div className="space-y-2 relative">
                    <Label className="text-[10px] font-bold uppercase">Nome do Item</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Buscar no catálogo..."
                        className="pl-9 h-10 text-sm"
                        value={activeSearch?.id === item.id ? searchQuery : item.nome}
                        onFocus={() => { setActiveSearch({ id: item.id, tipo: tipo as any }); setSearchQuery(""); }}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {activeSearch?.id === item.id && (
                        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-xl max-h-60 overflow-auto">
                          {filteredOptions.map(s => (
                            <button key={s.id} className="w-full px-4 py-3 text-left hover:bg-slate-100 text-sm border-b last:border-0" onClick={() => selecionarItem(s)}>
                              {s.nomeSuplemento || s.nomeManipulado}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Linha 2: Dose e Horário */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase">Dose</Label>
                      <Input placeholder="Ex: 30g" className="h-10 text-sm" value={item.dose} onChange={(e) => atualizarCampo(tipo as any, item.id, "dose", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase">Horário</Label>
                      <Input placeholder="Ex: Pós-treino" className="h-10 text-sm" value={item.horario} onChange={(e) => atualizarCampo(tipo as any, item.id, "horario", e.target.value)} />
                    </div>
                  </div>

                  {/* Linha 3: Dias da Semana [NOVO] */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Dias da Semana
                    </Label>
                    <Select value={item.diasSemana} onValueChange={(v) => atualizarCampo(tipo as any, item.id, "diasSemana", v)}>
                      <SelectTrigger className="h-10 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DIAS_SEMANA.map(dia => <SelectItem key={dia} value={dia}>{dia}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Linha 4: Objetivo [ADICIONADO TAMBÉM EM SUPLEMENTOS] */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground italic">Objetivo da Prescrição</Label>
                    <Input 
                      placeholder="Ex: Auxílio na recuperação muscular" 
                      className="bg-slate-50 border-none h-9 text-xs"
                      value={item.objetivo}
                      onChange={(e) => atualizarCampo(tipo as any, item.id, "objetivo", e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button variant="ghost" size="sm" onClick={() => removerItem(tipo as any, item.id)} className="text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-1" /> Remover
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={() => adicionarItem(tipo as any)} className="w-full border-dashed h-12 text-[#004767]">
              <Plus className="mr-2 h-4 w-4" /> Adicionar {tipo === "suplementos" ? "Suplemento" : "Manipulado"}
            </Button>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}