"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { exercicioService } from "@/services/exercicio-service"
import type { Exercicio } from "@/types/exercicio"
import type { TreinoDivisao, ExercicioTreino } from "@/types/protocolo"
import { useToast } from "@/hooks/use-toast"

interface TreinoTabProps {
  value: TreinoDivisao[]
  onChange: (divisoes: TreinoDivisao[]) => void
}

const DIVISOES = ["A", "B", "C", "D", "E", "F"]

export function TreinoTab({ value, onChange }: TreinoTabProps) {
  const { toast } = useToast()
  const [divisoes, setDivisoes] = useState<TreinoDivisao[]>(value)
  const [exercicios, setExercicios] = useState<Exercicio[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Exercicio[]>([])
  const [orientacoes, setOrientacoes] = useState("")

  useEffect(() => {
    loadExercicios()
  }, [])

  useEffect(() => {
    onChange(divisoes)
  }, [divisoes, onChange])

  const loadExercicios = async () => {
    try {
      const data = await exercicioService.getAll()
      setExercicios(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os exercícios.",
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
    const results = exercicios.filter((e) => e.nome.toLowerCase().includes(query.toLowerCase()))
    setSearchResults(results)
  }

  const adicionarDivisao = () => {
    const letra = DIVISOES[divisoes.length] || `Divisão ${divisoes.length + 1}`
    const novaDivisao: TreinoDivisao = {
      id: Date.now().toString(),
      nome: `Treino ${letra}`,
      exercicios: [],
    }
    setDivisoes([...divisoes, novaDivisao])
  }

  const removerDivisao = (id: string) => {
    setDivisoes(divisoes.filter((d) => d.id !== id))
  }

  const atualizarDivisao = (id: string, campo: keyof TreinoDivisao, valor: any) => {
    setDivisoes(divisoes.map((d) => (d.id === id ? { ...d, [campo]: valor } : d)))
  }

  const adicionarExercicio = (divisaoId: string, exercicio: Exercicio) => {
    const exercicioTreino: ExercicioTreino = {
      exercicioId: exercicio.id,
      nome: exercicio.nome,
      series: 3,
      repeticoes: "10-12",
      carga: "",
      descanso: "60s",
      observacoes: "",
    }

    setDivisoes(
      divisoes.map((d) => (d.id === divisaoId ? { ...d, exercicios: [...d.exercicios, exercicioTreino] } : d)),
    )
    setSearchQuery("")
    setSearchResults([])
  }

  const removerExercicio = (divisaoId: string, exercicioId: string) => {
    setDivisoes(
      divisoes.map((d) =>
        d.id === divisaoId ? { ...d, exercicios: d.exercicios.filter((e) => e.exercicioId !== exercicioId) } : d,
      ),
    )
  }

  const atualizarExercicio = (divisaoId: string, exercicioId: string, campo: keyof ExercicioTreino, valor: any) => {
    setDivisoes(
      divisoes.map((d) =>
        d.id === divisaoId
          ? {
              ...d,
              exercicios: d.exercicios.map((e) => (e.exercicioId === exercicioId ? { ...e, [campo]: valor } : e)),
            }
          : d,
      ),
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h3 className="text-base md:text-lg font-semibold">Divisão de Treino</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Organize os exercícios por divisão (A, B, C, etc)</p>
        </div>
        <Button onClick={adicionarDivisao} disabled={divisoes.length >= 6} className="w-full sm:w-auto text-sm">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Divisão
        </Button>
      </div>

      {divisoes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center text-sm">
              Nenhuma divisão de treino criada ainda.
              <br />
              Clique em "Adicionar Divisão" para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={divisoes[0]?.id}>
          <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
            <TabsList className="inline-flex w-auto min-w-full md:w-full md:justify-start">
              {divisoes.map((divisao, index) => (
                <TabsTrigger key={divisao.id} value={divisao.id} className="text-xs md:text-sm whitespace-nowrap">
                  Treino {DIVISOES[index]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {divisoes.map((divisao, index) => (
            <TabsContent key={divisao.id} value={divisao.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1">
                      <Label className="text-xs md:text-sm">Nome da Divisão</Label>
                      <Input
                        value={divisao.nome}
                        onChange={(e) => atualizarDivisao(divisao.id, "nome", e.target.value)}
                        placeholder={`Treino ${DIVISOES[index]}`}
                        className="text-sm"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removerDivisao(divisao.id)}
                      className="self-end sm:self-start sm:mt-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs md:text-sm">Buscar Exercício</Label>
                    <div className="relative">
                      <Input
                        placeholder="Digite o nome do exercício..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="text-sm"
                      />
                      {searchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                          {searchResults.map((exercicio) => (
                            <button
                              key={exercicio.id}
                              className="w-full px-3 md:px-4 py-2 text-left hover:bg-accent flex items-center justify-between text-sm"
                              onClick={() => adicionarExercicio(divisao.id, exercicio)}
                            >
                              <span>{exercicio.nome}</span>
                              <Badge variant="outline" className="text-xs">
                                {exercicio.grupoMuscular}
                              </Badge>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {divisao.exercicios.length > 0 && (
                    <div className="overflow-x-auto -mx-3 md:mx-0">
                      <div className="inline-block min-w-full align-middle">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs md:text-sm min-w-[120px]">Exercício</TableHead>
                              <TableHead className="text-xs md:text-sm">Séries</TableHead>
                              <TableHead className="text-xs md:text-sm">Reps</TableHead>
                              <TableHead className="text-xs md:text-sm">Carga</TableHead>
                              <TableHead className="text-xs md:text-sm">Descanso</TableHead>
                              <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {divisao.exercicios.map((exercicio) => (
                              <TableRow key={exercicio.exercicioId}>
                                <TableCell className="text-xs md:text-sm font-medium">{exercicio.nome}</TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    value={exercicio.series}
                                    onChange={(e) =>
                                      atualizarExercicio(
                                        divisao.id,
                                        exercicio.exercicioId,
                                        "series",
                                        Number(e.target.value),
                                      )
                                    }
                                    className="w-14 md:w-16 text-sm"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={exercicio.repeticoes}
                                    onChange={(e) =>
                                      atualizarExercicio(
                                        divisao.id,
                                        exercicio.exercicioId,
                                        "repeticoes",
                                        e.target.value,
                                      )
                                    }
                                    className="w-16 md:w-20 text-sm"
                                    placeholder="10-12"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={exercicio.carga}
                                    onChange={(e) =>
                                      atualizarExercicio(divisao.id, exercicio.exercicioId, "carga", e.target.value)
                                    }
                                    className="w-16 md:w-20 text-sm"
                                    placeholder="20kg"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={exercicio.descanso}
                                    onChange={(e) =>
                                      atualizarExercicio(divisao.id, exercicio.exercicioId, "descanso", e.target.value)
                                    }
                                    className="w-14 md:w-20 text-sm"
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
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Orientações Gerais</CardTitle>
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
    </div>
  )
}
