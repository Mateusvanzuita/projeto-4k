// src/components/protocolo/treino-tab.tsx (CORREÇÃO FINAL DO DISPLAY DO SELECT)

"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, Trash2, Dumbbell, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exercicioService } from "@/services/exercicio-service"
import type { Exercicio, GrupoMuscular } from "@/types/exercicio"
import type { TreinoDivisao, ExercicioProtocoloItem } from "@/types/protocolo"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TreinoTabProps {
  value: TreinoDivisao[]
  onChange: (divisoes: TreinoDivisao[]) => void
}

export function TreinoTab({ value, onChange }: TreinoTabProps) {
  const { toast } = useToast()
  const [divisoes, setDivisoes] = useState<TreinoDivisao[]>(value)
  const [activeDivisaoId, setActiveDivisaoId] = useState(value.length > 0 ? value[0].id : '0')
  const [allExercicios, setAllExercicios] = useState<Exercicio[]>([]) 
  const [loadingExercicios, setLoadingExercicios] = useState(true)
  const [selectedExercicioId, setSelectedExercicioId] = useState<string | null>(null)
  const [orientacoes, setOrientacoes] = useState("")

  useEffect(() => {
    onChange(divisoes)
  }, [divisoes, onChange])
  
  // Garante que a aba ativa é válida
  useEffect(() => {
      if (divisoes.length === 0) {
          setActiveDivisaoId('0')
      } else if (!divisoes.find(d => d.id === activeDivisaoId)) {
          setActiveDivisaoId(divisoes.length > 0 ? divisoes[0].id : '0')
      }
  }, [divisoes])


  // 1. Carregar TODOS os exercícios
  useEffect(() => {
    const fetchExercicios = async () => {
        setLoadingExercicios(true)
        try {
            const result = await exercicioService.getAll({ limit: 500 }) 
            setAllExercicios(result.exercicios)
        } catch (error) {
            toast({ title: "Erro", description: "Não foi possível carregar o catálogo de exercícios.", variant: "destructive" })
        } finally {
            setLoadingExercicios(false)
        }
    }
    fetchExercicios()
  }, [])
  
  // --- Funções de Manipulação da Estrutura ---

  const adicionarDivisao = () => {
    const newCount = divisoes.length + 1
    const novaDivisao: TreinoDivisao = {
      id: Date.now().toString(),
      nomeDivisao: `Treino ${newCount}`, 
      grupoMuscular: "CORPO_INTEIRO" as GrupoMuscular, 
      orientacoes: "",
      exercicios: [],
    }
    setDivisoes([...divisoes, novaDivisao])
    setActiveDivisaoId(novaDivisao.id) 
  }

  const removerDivisao = (id: string) => {
    const updatedDivisoes = divisoes.filter((d) => d.id !== id)
    setDivisoes(updatedDivisoes)
    if (updatedDivisoes.length > 0) {
        setActiveDivisaoId(updatedDivisoes[0].id) 
    } else {
        setActiveDivisaoId('0')
    }
  }
  
  const atualizarDivisao = (id: string, campo: keyof TreinoDivisao, valor: any) => {
    setDivisoes(divisoes.map((d) => (d.id === id ? { ...d, [campo]: valor } : d)))
  }

  // Função que lida com a seleção e adição imediata (substituindo o botão +)
  const handleSelectExercicio = (divisaoId: string, exercicioId: string) => {
    // 1. Limpa o estado da seleção para resetar o componente Select
    setSelectedExercicioId(null) 

    const exercicio = allExercicios.find(e => e.id === exercicioId)
    if (!exercicio) return

    const currentDivisao = divisoes.find(d => d.id === divisaoId)
    if (!currentDivisao) return

    if (currentDivisao.exercicios.some(e => e.exercicioId === exercicio.id)) {
        toast({ title: "Atenção", description: "Este exercício já foi adicionado a esta divisão.", variant: "destructive" })
        return
    }

    const exercicioProtocolo: ExercicioProtocoloItem = {
      exercicioId: exercicio.id,
      exercicio: exercicio, 
      series: 3,
      repeticoes: "12", 
      carga: "", 
      intervaloDescanso: "60s", 
      observacoes: "",
      ordem: currentDivisao.exercicios.length + 1,
    }

    setDivisoes(
      divisoes.map((d) =>
        d.id === divisaoId ? { ...d, exercicios: [...d.exercicios, exercicioProtocolo] } : d,
      ),
    )
  }

  const removerExercicio = (divisaoId: string, exercicioId: string) => {
    setDivisoes(
      divisoes.map((d) =>
        d.id === divisaoId ? { ...d, exercicios: d.exercicios.filter((e) => e.exercicioId !== exercicioId) } : d,
      ),
    )
  }

  const atualizarExercicio = (divisaoId: string, exercicioId: string, campo: keyof ExercicioProtocoloItem, valor: any) => {
    setDivisoes(
      divisoes.map((d) =>
        d.id === divisaoId
          ? {
              ...d,
              exercicios: d.exercicios.map((e) =>
                e.exercicioId === exercicioId ? { ...e, [campo]: valor } : e,
              ),
            }
          : d,
      ),
    )
  }
  
  if (divisoes.length === 0) {
    return (
      <div className="space-y-4">
        <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
                Nenhum treino criado. Clique no botão abaixo para adicionar a primeira divisão.
            </AlertDescription>
        </Alert>
        <Button onClick={adicionarDivisao} className="w-full text-sm mt-6">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Nova Divisão de Treino
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      
      <Tabs value={activeDivisaoId} onValueChange={setActiveDivisaoId}>
        <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
          <TabsList className="inline-flex w-auto min-w-full">
            {divisoes.map((divisao) => (
              <TabsTrigger key={divisao.id} value={divisao.id} className="text-sm whitespace-nowrap">
                {divisao.nomeDivisao}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Mapeamento do conteúdo de cada divisão */}
        {divisoes.map((divisao) => (
          <TabsContent key={divisao.id} value={divisao.id}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 pr-4">
                            {/* Permite renomear a divisão */}
                            <Label className="text-xs md:text-sm block">Nome da Divisão</Label>
                            <Input
                                value={divisao.nomeDivisao}
                                onChange={(e) => atualizarDivisao(divisao.id, "nomeDivisao", e.target.value)}
                                placeholder="Ex: Treino de Peito e Tríceps"
                                className="text-base font-semibold"
                            />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removerDivisao(divisao.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Área de Seleção e Adição de Exercício (Combobox Local) */}
                <div className="space-y-2 pt-2 border-t pt-4">
                    <Label className="text-xs md:text-sm">Buscar Exercício</Label>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Select
                                value={selectedExercicioId || ""}
                                onValueChange={(exercicioId) => handleSelectExercicio(divisao.id, exercicioId)}
                                disabled={loadingExercicios}
                            >
                                <SelectTrigger className="text-sm">
                                    <SelectValue placeholder={loadingExercicios ? "Carregando Exercícios..." : "Selecione o exercício"} />
                                </SelectTrigger>
                                <SelectContent className="max-h-72">
                                    {allExercicios.map((exercicio) => (
                                        // 🚨 CORREÇÃO FINAL E ROBUSTA PARA O DISPLAY DO ITEM
                                        <SelectItem 
                                            key={exercicio.id} 
                                            value={exercicio.id} 
                                            className="text-sm flex items-center justify-between"
                                        >
                                            {/* Nome do exercício - Texto primário */}
                                            <span className="truncate pr-2">{exercicio.nome}</span> 
                                            
                                            {/* Tag do grupo muscular - Alinhado à direita */}
                                            <Badge variant="secondary" className="flex-shrink-0">{exercicio.grupoMuscular}</Badge>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                
                {/* Tabela de Exercícios Adicionados */}
                {divisao.exercicios.length === 0 && (
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                            Nenhum exercício adicionado a esta divisão.
                        </AlertDescription>
                    </Alert>
                )}

                {divisao.exercicios.length > 0 && (
                  <div className="overflow-x-auto -mx-3 md:mx-0">
                    <div className="inline-block min-w-full align-middle">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs md:text-sm min-w-[150px]">Exercício</TableHead>
                            <TableHead className="text-xs md:text-sm min-w-[70px]">Séries</TableHead>
                            <TableHead className="text-xs md:text-sm min-w-[70px]">Reps</TableHead>
                            <TableHead className="text-xs md:text-sm min-w-[70px]">Descanso</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {divisao.exercicios.map((exercicio) => (
                            <TableRow key={exercicio.exercicioId}>
                              <TableCell className="text-xs md:text-sm font-medium">
                                {exercicio.exercicio?.nome}
                                <span className="text-muted-foreground text-[10px] block">{exercicio.exercicio?.grupoMuscular}</span>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={exercicio.series}
                                  onChange={(e) =>
                                    atualizarExercicio(divisao.id, exercicio.exercicioId, "series", Number(e.target.value))
                                  }
                                  className="w-16 text-sm"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={exercicio.repeticoes}
                                  onChange={(e) =>
                                    atualizarExercicio(divisao.id, exercicio.exercicioId, "repeticoes", e.target.value)
                                  }
                                  className="w-16 text-sm"
                                  placeholder="12"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={exercicio.intervaloDescanso} 
                                  onChange={(e) =>
                                    atualizarExercicio(divisao.id, exercicio.exercicioId, "intervaloDescanso", e.target.value)
                                  }
                                  className="w-16 text-sm"
                                  placeholder="60s"
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removerExercicio(divisao.id, exercicio.exercicioId)}
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
                
                {/* Observações Específicas da Divisão */}
                <Label className="text-xs md:text-sm">Orientações Específicas da Divisão</Label>
                <Textarea
                  placeholder="Ex: Focar na contração excêntrica. Realizar em formato de bi-set com..."
                  value={divisao.orientacoes}
                  onChange={(e) => atualizarDivisao(divisao.id, "orientacoes", e.target.value)}
                  rows={2}
                  className="text-sm"
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Orientações Gerais (fora das abas) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Orientações Gerais do Plano de Treino</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Adicione orientações gerais sobre o treino..."
            value={orientacoes}
            onChange={(e) => setOrientacoes(e.target.value)}
            rows={4}
            className="text-sm"
          />
        </CardContent>
      </Card>
      
      {/* Botão Adicionar Divisão (no final) */}
      <Button onClick={adicionarDivisao} className="w-full text-sm mt-6">
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Nova Divisão de Treino
      </Button>
    </div>
  )
}