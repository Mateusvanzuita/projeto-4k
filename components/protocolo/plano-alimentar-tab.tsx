"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { alimentoService } from "@/services/alimento-service"
import type { Alimento } from "@/types/alimento"
import type { Refeicao, AlimentoRefeicao } from "@/types/protocolo"
import { useToast } from "@/hooks/use-toast"

interface PlanoAlimentarTabProps {
  value: Refeicao[]
  onChange: (refeicoes: Refeicao[]) => void
}

const TIPOS_REFEICAO = ["Café da Manhã", "Lanche da Manhã", "Almoço", "Lanche da Tarde", "Jantar", "Ceia"]

export function PlanoAlimentarTab({ value, onChange }: PlanoAlimentarTabProps) {
  const { toast } = useToast()
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>(value)
  const [alimentos, setAlimentos] = useState<Alimento[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Alimento[]>([])
  const [orientacoes, setOrientacoes] = useState("")

  useEffect(() => {
    loadAlimentos()
  }, [])

  useEffect(() => {
    onChange(refeicoes)
  }, [refeicoes, onChange])

  const loadAlimentos = async () => {
    try {
      const data = await alimentoService.getAll()
      setAlimentos(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os alimentos.",
        variant: "destructive",
      })
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    const results = alimentos.filter((a) => a.nome.toLowerCase().includes(query.toLowerCase()))
    setSearchResults(results)
  }

  const adicionarRefeicao = () => {
    const novaRefeicao: Refeicao = {
      id: Date.now().toString(),
      nome: `Refeição ${refeicoes.length + 1}`,
      horario: "",
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
    const alimentoRefeicao: AlimentoRefeicao = {
      alimentoId: alimento.id,
      nome: alimento.nome,
      quantidade: alimento.quantidadePadrao,
      unidade: alimento.unidadeMedida,
      calorias: alimento.calorias,
    }

    setRefeicoes(
      refeicoes.map((r) => (r.id === refeicaoId ? { ...r, alimentos: [...r.alimentos, alimentoRefeicao] } : r)),
    )
    setSearchQuery("")
    setSearchResults([])
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

  const calcularMacros = () => {
    let totalCalorias = 0
    refeicoes.forEach((refeicao) => {
      refeicao.alimentos.forEach((alimento) => {
        const fator = alimento.quantidade / 100
        totalCalorias += alimento.calorias * fator
      })
    })
    return { calorias: Math.round(totalCalorias) }
  }

  const macros = calcularMacros()

  return (
    <div className="space-y-4 md:space-y-6">
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-base md:text-lg font-semibold">Refeições</h3>
        <Button onClick={adicionarRefeicao} className="w-full sm:w-auto text-sm">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Refeição
        </Button>
      </div>

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
                  <Select value={refeicao.nome} onValueChange={(v) => atualizarRefeicao(refeicao.id, "nome", v)}>
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
                    value={refeicao.horario}
                    onChange={(e) => atualizarRefeicao(refeicao.id, "horario", e.target.value)}
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
                  placeholder="Digite o nome do alimento..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="text-sm"
                />
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                    {searchResults.map((alimento) => (
                      <button
                        key={alimento.id}
                        className="w-full px-3 md:px-4 py-2 text-left hover:bg-accent flex items-center justify-between text-sm"
                        onClick={() => adicionarAlimento(refeicao.id, alimento)}
                      >
                        <span>{alimento.nome}</span>
                        <Badge variant="outline" className="text-xs">
                          {alimento.tipo}
                        </Badge>
                      </button>
                    ))}
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
                        <TableHead className="text-xs md:text-sm">Alimento</TableHead>
                        <TableHead className="text-xs md:text-sm">Quantidade</TableHead>
                        <TableHead className="text-xs md:text-sm">Calorias</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {refeicao.alimentos.map((alimento) => (
                        <TableRow key={alimento.alimentoId}>
                          <TableCell className="text-xs md:text-sm font-medium">{alimento.nome}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={alimento.quantidade}
                                onChange={(e) =>
                                  atualizarQuantidade(refeicao.id, alimento.alimentoId, Number(e.target.value))
                                }
                                className="w-16 md:w-20 text-sm"
                              />
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {alimento.unidade}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs md:text-sm whitespace-nowrap">
                            {Math.round((alimento.calorias * alimento.quantidade) / 100)} kcal
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
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Orientações Gerais</CardTitle>
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
    </div>
  )
}
