// src/components/protocolo/plano-alimentar-tab.tsx (Refatorado)

"use client"

import { useState, useEffect, useMemo } from "react" 
import { Plus, Trash2, Calculator, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { alimentoService } from "@/services/alimento-service"
import type { Alimento, UnidadeAlimento } from "@/types/alimento"
import type { Refeicao, AlimentoProtocoloItem } from "@/types/protocolo" 
import { useToast } from "@/hooks/use-toast"

interface PlanoAlimentarTabProps {
  value: Refeicao[]
  onChange: (refeicoes: Refeicao[]) => void
}

const TIPOS_REFEICAO = ["Café da Manhã", "Lanche da Manhã", "Almoço", "Lanche da Tarde", "Jantar", "Ceia"]
const UNIDADES_ALIMENTO: UnidadeAlimento[] = ["GRAMAS", "MILILITROS", "UNIDADE", "COLHER", "XICARA", "PORCAO"]

export function PlanoAlimentarTab({ value, onChange }: PlanoAlimentarTabProps) {
  const { toast } = useToast()
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>(value)
  const [searchQuery, setSearchQuery] = useState("")
  const [allAlimentos, setAllAlimentos] = useState<Alimento[]>([])
  const [loadingAlimentos, setLoadingAlimentos] = useState(true)
  const [orientacoes, setOrientacoes] = useState("")
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)

  useEffect(() => {
    onChange(refeicoes)
  }, [refeicoes, onChange])

  useEffect(() => {
    const loadAllAlimentos = async () => {
        setLoadingAlimentos(true)
        try {
            const response = await alimentoService.getAll() 
            const data = Array.isArray(response) ? response : response.alimentos || []
            setAllAlimentos(data)
        } catch (error) {
            toast({ title: "Erro de Carregamento", description: "Não foi possível carregar a lista de alimentos.", variant: "destructive" })
            console.error("Erro ao carregar todos os alimentos:", error)
        } finally {
            setLoadingAlimentos(false)
        }
    }
    loadAllAlimentos()
  }, [])
  
  const filteredAlimentos = useMemo(() => {
    if (!searchQuery.trim()) {
      return allAlimentos
    }
    const lowerCaseQuery = searchQuery.toLowerCase()
    
    return allAlimentos.filter(alimento => 
      alimento.nome.toLowerCase().includes(lowerCaseQuery) ||
      alimento.categoria.toLowerCase().includes(lowerCaseQuery)
    )
  }, [allAlimentos, searchQuery])

  const adicionarRefeicao = () => {
    const novaRefeicao: Refeicao = {
      id: Date.now().toString(),
      nomeRefeicao: `Refeição ${refeicoes.length + 1}`,
      horarioPrevisto: "",
      observacoes: "",
      alimentos: [],
    }
    setRefeicoes([...refeicoes, novaRefeicao])
  }

  const removerRefeicao = (id: string) => {
    setRefeicoes(refeicoes.filter((r) => r.id !== id))
  }

  const atualizarRefeicao = (id: string, campo: keyof Refeicao, valor: any) => {
    setRefeicoes(refeicoes.map((r) => (r.id === id ? { ...r, [campo]: valor } : r)))
  }

  const adicionarAlimento = (refeicaoId: string, alimento: Alimento) => {
    const unidadePadrao: UnidadeAlimento = "GRAMAS";
    
    const alimentoProtocolo: AlimentoProtocoloItem = {
      alimentoId: alimento.id,
      quantidade: 100,
      unidadeMedida: unidadePadrao, 
      alimento: alimento,
    }

    setRefeicoes(
      refeicoes.map((r) => (r.id === refeicaoId ? { ...r, alimentos: [...r.alimentos, alimentoProtocolo] } : r)),
    )
    setSearchQuery("")
    setIsComboboxOpen(false)
  }

  const removerAlimento = (refeicaoId: string, alimentoId: string) => {
    setRefeicoes(
      refeicoes.map((r) =>
        r.id === refeicaoId ? { ...r, alimentos: r.alimentos.filter((a) => a.alimentoId !== alimentoId) } : r,
      ),
    )
  }

  const atualizarQuantidade = (refeicaoId: string, alimentoId: string, quantidade: number) => {
    setRefeicoes(
      refeicoes.map((r) =>
        r.id === refeicaoId
          ? {
              ...r,
              alimentos: r.alimentos.map((a) => (a.alimentoId === alimentoId ? { ...a, quantidade } : a)),
            }
          : r,
      ),
    )
  }

  const atualizarUnidade = (refeicaoId: string, alimentoId: string, unidade: UnidadeAlimento) => {
    setRefeicoes(
      refeicoes.map((r) =>
        r.id === refeicaoId
          ? {
              ...r,
              alimentos: r.alimentos.map((a) => (a.alimentoId === alimentoId ? { ...a, unidadeMedida: unidade } : a)),
            }
          : r,
      ),
    )
  }
  
  const calcularMacros = () => {
    return { calorias: 2500 } // MOCK
  }

  const macros = calcularMacros()

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Resumo Nutricional Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Resumo Nutricional</CardTitle>
          <CardDescription className="text-xs md:text-sm">Totais diários calculados automaticamente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Calorias Totais:</span>
              <Badge variant="secondary" className="text-xs md:text-sm">
                {macros.calorias} kcal
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <h3 className="text-base md:text-lg font-semibold">Refeições</h3>

      {refeicoes.map((refeicao, index) => (
        <Card key={refeicao.id}>
          <CardHeader>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm md:text-base font-semibold">Refeição {index + 1}</h4>
                <Button variant="ghost" size="icon" onClick={() => removerRefeicao(refeicao.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label className="text-xs md:text-sm">Nome da Refeição</Label>
                  <Select 
                    value={refeicao.nomeRefeicao} 
                    onValueChange={(v) => atualizarRefeicao(refeicao.id, "nomeRefeicao", v)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_REFEICAO.map((tipo) => (
                        <SelectItem key={tipo} value={tipo} className="text-sm">
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs md:text-sm">Horário</Label>
                  <Input
                    type="time"
                    value={refeicao.horarioPrevisto}
                    onChange={(e) => atualizarRefeicao(refeicao.id, "horarioPrevisto", e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs md:text-sm">Buscar Alimento</Label>
              <div className="relative">
                <Input
                  placeholder={loadingAlimentos ? "Carregando alimentos..." : "Digite para buscar ou clique para ver todos..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsComboboxOpen(true)}
                  onBlur={() => setTimeout(() => setIsComboboxOpen(false), 200)}
                  disabled={loadingAlimentos}
                  className="text-sm"
                />
                
                {isComboboxOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                    
                    {loadingAlimentos && (
                        <div className="p-3 text-sm text-center text-primary">Carregando...</div>
                    )}

                    {!loadingAlimentos && filteredAlimentos.length > 0 && (
                        filteredAlimentos.map((alimento) => (
                        <button
                          key={alimento.id}
                          className="w-full px-3 md:px-4 py-2 text-left hover:bg-accent flex items-center justify-between text-sm"
                          onClick={() => adicionarAlimento(refeicao.id, alimento)}
                        >
                          <span>{alimento.nome}</span>
                          <Badge variant="outline" className="text-xs">
                            {alimento.categoria}
                          </Badge>
                        </button>
                      ))
                    )}
                    
                    {!loadingAlimentos && filteredAlimentos.length === 0 && (
                        <div className="p-3 text-center text-muted-foreground">
                            {searchQuery.trim() ? "Nenhum alimento encontrado com o filtro." : "Nenhum alimento cadastrado."}
                        </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {refeicao.alimentos.length > 0 && (
              <div className="overflow-x-auto -mx-3 md:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm min-w-[150px]">Alimento</TableHead>
                        <TableHead className="text-xs md:text-sm min-w-[100px]">Quantidade</TableHead>
                        <TableHead className="text-xs md:text-sm min-w-[100px]">Unidade</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {refeicao.alimentos.map((alimento) => (
                        <TableRow key={alimento.alimentoId}>
                          <TableCell className="text-xs md:text-sm font-medium">
                            {alimento.alimento?.nome || `ID: ${alimento.alimentoId.substring(0, 8)}...`}
                          </TableCell> 
                          <TableCell>
                            <Input
                              type="number"
                              value={alimento.quantidade}
                              onChange={(e) =>
                                atualizarQuantidade(refeicao.id, alimento.alimentoId, Number(e.target.value))
                              }
                              className="w-16 md:w-20 text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Select 
                                value={alimento.unidadeMedida} 
                                onValueChange={(v: UnidadeAlimento) => atualizarUnidade(refeicao.id, alimento.alimentoId, v)}
                            >
                                <SelectTrigger className="w-[100px] text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {UNIDADES_ALIMENTO.map(unidade => (
                                        <SelectItem key={unidade} value={unidade} className="text-sm">
                                            {unidade}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removerAlimento(refeicao.id, alimento.alimentoId)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            <Label className="text-xs md:text-sm">Observações da Refeição</Label>
            <Textarea
              placeholder="Ex: Beber 500ml de água antes desta refeição."
              value={refeicao.observacoes}
              onChange={(e) => atualizarRefeicao(refeicao.id, "observacoes", e.target.value)}
              rows={2}
              className="text-sm"
            />
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Orientações Gerais do Plano Alimentar</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Adicione orientações gerais sobre o plano alimentar..."
            value={orientacoes}
            onChange={(e) => setOrientacoes(e.target.value)}
            rows={4}
            className="text-sm"
          />
        </CardContent>
      </Card>
      
      {/* 🚨 NOVO BOTÃO NO FINAL */}
      <Button onClick={adicionarRefeicao} className="w-full text-sm mt-6">
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Nova Refeição
      </Button>
    </div>
  )
}