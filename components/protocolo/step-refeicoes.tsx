"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Utensils, Trash2, Plus, Clock, Scale, Repeat, Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { alimentoService } from "@/services/alimento-service"
import type { Alimento } from "@/types/alimento"

// Alinhado com as unidades do seu banco de dados
const UNIDADES = ["GRAMAS", "MILILITROS", "UNIDADE", "COLHER", "XICARA", "PORCAO"]

export function StepRefeicoes({ data, update }: { data: any, update: (d: any) => void }) {
  const [refeicoes, setRefeicoes] = useState(data.refeicoes || [])
  const [allAlimentos, setAllAlimentos] = useState<Alimento[]>([])
  const [loadingAlimentos, setLoadingAlimentos] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  // Controle de busca e estado do seletor aberto
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSearch, setActiveSearch] = useState<{ refIdx: number, itemIdx: number, isTroca: boolean, trocaIdx?: number } | null>(null)

  useEffect(() => {
    setMounted(true)
    const loadAlimentos = async () => {
      setLoadingAlimentos(true)
      try {
        const response = await alimentoService.getAll()
        const lista = Array.isArray(response) ? response : response.alimentos || []
        setAllAlimentos(lista)
      } catch (error) {
        console.error("Erro ao carregar alimentos:", error)
      } finally {
        setLoadingAlimentos(false)
      }
    }
    loadAlimentos()
  }, [])

  const filteredAlimentos = useMemo(() => {
    if (!searchQuery.trim()) return allAlimentos.slice(0, 20)
    const lower = searchQuery.toLowerCase()
    return allAlimentos.filter(a => 
      a.nome.toLowerCase().includes(lower) || a.categoria.toLowerCase().includes(lower)
    ).slice(0, 20)
  }, [allAlimentos, searchQuery])

  const salvar = (novas: any[]) => {
    setRefeicoes(novas)
    update({ ...data, refeicoes: novas })
  }

  const selecionarAlimento = (alimento: Alimento) => {
    if (!activeSearch) return
    const { refIdx, itemIdx, isTroca, trocaIdx } = activeSearch
    const novas = [...refeicoes]

    if (isTroca && trocaIdx !== undefined) {
      novas[refIdx].itens[itemIdx].substituicoes[trocaIdx].alimentoId = alimento.id
      novas[refIdx].itens[itemIdx].substituicoes[trocaIdx].alimento = alimento.nome
    } else {
      novas[refIdx].itens[itemIdx].alimentoId = alimento.id
      novas[refIdx].itens[itemIdx].alimento = alimento.nome
    }

    salvar(novas)
    setActiveSearch(null)
    setSearchQuery("")
  }

  const adicionarRefeicao = () => {
    const nova = { 
      id: Math.random().toString(36).substring(2, 9), 
      nome: `Refeição ${refeicoes.length + 1}`, 
      horario: "", 
      itens: [] 
    }
    salvar([...refeicoes, nova])
  }

  const adicionarAlimento = (refIdx: number) => {
    const novas = [...refeicoes]
    novas[refIdx].itens.push({
      id: Math.random().toString(36).substring(2, 9),
      alimentoId: "",
      alimento: "",
      quantidade: "",
      unidade: "GRAMAS",
      substituicoes: []
    })
    salvar(novas)
  }

  const adicionarTroca = (refIdx: number, itemIdx: number) => {
    const novas = [...refeicoes]
    novas[refIdx].itens[itemIdx].substituicoes.push({
      id: Math.random().toString(36).substring(2, 9),
      alimentoId: "",
      alimento: "",
      quantidade: "",
      unidade: "GRAMAS"
    })
    salvar(novas)
  }

  if (!mounted) return null

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[#004767]">Estrutura das Refeições</h2>
        <p className="text-muted-foreground text-sm">Monte o cardápio detalhado com alimentos e trocas equivalentes.</p>
      </div>

      <div className="space-y-6">
        {refeicoes.map((ref, refIdx) => (
          <Card key={ref.id} className="relative overflow-visible border-t-4 border-t-[#004767] shadow-md">
            <CardHeader className="pb-4 bg-slate-50/50">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <Utensils className="h-3 w-3" /> Identificação
                  </Label>
                  <Input 
                    value={ref.nome} 
                    onChange={(e) => { const n = [...refeicoes]; n[refIdx].nome = e.target.value; salvar(n); }}
                    placeholder="Ex: Almoço"
                    className="bg-white"
                  />
                </div>
                <div className="w-full md:w-32 space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Horário
                  </Label>
                  <Input type="time" value={ref.horario} onChange={(e) => { const n = [...refeicoes]; n[refIdx].horario = e.target.value; salvar(n); }} className="bg-white" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => salvar(refeicoes.filter(r => r.id !== ref.id))} className="text-red-400">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 md:p-6 space-y-4 overflow-visible">
              {ref.itens.map((item, itemIdx) => (
                <div key={item.id} className="space-y-3 p-4 border rounded-xl bg-white shadow-sm border-slate-100 relative overflow-visible">
                  {/* Alimento Principal */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-5 space-y-1.5 relative">
                      <Label className="text-[10px] font-bold text-primary flex items-center gap-1">ALIMENTO PRINCIPAL</Label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          className="pl-9 h-10" 
                          placeholder={loadingAlimentos ? "Carregando..." : "Buscar no catálogo..."}
                          value={activeSearch?.itemIdx === itemIdx && activeSearch?.refIdx === refIdx && !activeSearch.isTroca ? searchQuery : item.alimento}
                          onFocus={() => { setActiveSearch({ refIdx, itemIdx, isTroca: false }); setSearchQuery(""); }}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {activeSearch?.itemIdx === itemIdx && activeSearch?.refIdx === refIdx && !activeSearch.isTroca && (
                          <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-xl max-h-60 overflow-auto">
                            {filteredAlimentos.map(a => (
                              <button key={a.id} className="w-full px-4 py-2 text-left hover:bg-slate-100 flex justify-between text-sm border-b last:border-0" onClick={() => selecionarAlimento(a)}>
                                <span>{a.nome}</span> <Badge variant="outline" className="text-[10px]">{a.categoria}</Badge>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Campos de Quantidade e Unidade */}
                    <div className="md:col-span-2 space-y-1.5">
                      <Label className="text-[10px] font-bold flex items-center gap-1"><Scale className="h-3 w-3" /> QUANT.</Label>
                      <Input type="number" className="h-10" value={item.quantidade} onChange={(e) => { const n = [...refeicoes]; n[refIdx].itens[itemIdx].quantidade = e.target.value; salvar(n); }} />
                    </div>
                    <div className="md:col-span-3 space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase">Unidade</Label>
                      <Select value={item.unidade} onValueChange={(v) => { const n = [...refeicoes]; n[refIdx].itens[itemIdx].unidade = v; salvar(n); }}>
                        <SelectTrigger className="h-10 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{UNIDADES.map(u => <SelectItem key={u} value={u} className="text-xs">{u}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2 flex gap-1 justify-end">
                      <Button variant="outline" size="icon" onClick={() => adicionarTroca(refIdx, itemIdx)} className="h-10 w-10 text-blue-600 bg-blue-50/30">
                        <Repeat className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { const n = [...refeicoes]; n[refIdx].itens.splice(itemIdx, 1); salvar(n); }} className="h-10 w-10 text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Lista de Trocas com Seletor */}
                  {item.substituicoes.length > 0 && (
                    <div className="ml-6 space-y-2 border-l-2 border-dashed border-blue-100 pl-4 py-2">
                      {item.substituicoes.map((troca, tIdx) => (
                        <div key={troca.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center relative overflow-visible">
                          <div className="md:col-span-6 relative">
                            <Input 
                              className="h-8 text-xs bg-slate-50/50" 
                              placeholder="Buscar troca..." 
                              value={activeSearch?.trocaIdx === tIdx && activeSearch?.itemIdx === itemIdx && activeSearch?.isTroca ? searchQuery : troca.alimento}
                              onFocus={() => { setActiveSearch({ refIdx, itemIdx, isTroca: true, trocaIdx: tIdx }); setSearchQuery(""); }}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {activeSearch?.trocaIdx === tIdx && activeSearch?.itemIdx === itemIdx && activeSearch?.isTroca && (
                              <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-xl max-h-48 overflow-auto">
                                {filteredAlimentos.map(a => (
                                  <button key={a.id} className="w-full px-3 py-1.5 text-left hover:bg-slate-100 flex justify-between text-xs border-b last:border-0" onClick={() => selecionarAlimento(a)}>
                                    <span>{a.nome}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="md:col-span-2">
                            <Input type="number" className="h-8 text-xs" value={troca.quantidade} onChange={(e) => { const n = [...refeicoes]; n[refIdx].itens[itemIdx].substituicoes[tIdx].quantidade = e.target.value; salvar(n); }} />
                          </div>
                          <div className="md:col-span-3">
                            <Select value={troca.unidade} onValueChange={(v) => { const n = [...refeicoes]; n[refIdx].itens[itemIdx].substituicoes[tIdx].unidade = v; salvar(n); }}>
                              <SelectTrigger className="h-8 text-[10px]"><SelectValue /></SelectTrigger>
                              <SelectContent>{UNIDADES.map(u => <SelectItem key={u} value={u} className="text-xs">{u}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-200" onClick={() => { const n = [...refeicoes]; n[refIdx].itens[itemIdx].substituicoes.splice(tIdx, 1); salvar(n); }}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Button onClick={() => adicionarAlimento(refIdx)} variant="outline" className="w-full border-dashed py-6 hover:bg-slate-50 text-[#004767]"><Plus className="mr-2 h-4 w-4" /> Adicionar Alimento</Button>
            </CardContent>
          </Card>
        ))}
        <Button onClick={adicionarRefeicao} className="w-full h-14 border-dashed border-2 bg-transparent text-[#004767] border-[#004767]/30 hover:bg-[#004767]/5"><Plus className="h-5 w-5 mr-2" /> Nova Refeição ao Plano</Button>
      </div>
    </div>
  )
}