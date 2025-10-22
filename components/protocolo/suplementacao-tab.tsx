"use client"

import { useState, useEffect } from "react"
import { Trash2, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { suplementoService } from "@/services/suplemento-service"
import type { Suplemento } from "@/types/suplemento"
import type { SuplementoProtocolo } from "@/types/protocolo"
import { useToast } from "@/hooks/use-toast"

interface SuplementacaoTabProps {
  value: SuplementoProtocolo[]
  onChange: (suplementos: SuplementoProtocolo[]) => void
}

export function SuplementacaoTab({ value, onChange }: SuplementacaoTabProps) {
  const { toast } = useToast()
  const [suplementos, setSuplementos] = useState<SuplementoProtocolo[]>(value)
  const [suplementosDisponiveis, setSuplementosDisponiveis] = useState<Suplemento[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Suplemento[]>([])

  useEffect(() => {
    loadSuplementos()
  }, [])

  useEffect(() => {
    onChange(suplementos)
  }, [suplementos, onChange])

  const loadSuplementos = async () => {
    try {
      const data = await suplementoService.getAll()
      setSuplementosDisponiveis(data.filter((s) => s.tipo === "suplemento"))
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os suplementos.",
        variant: "destructive",
      })
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    const results = suplementosDisponiveis.filter((s) => s.nome.toLowerCase().includes(query.toLowerCase()))
    setSearchResults(results)
  }

  const adicionarSuplemento = (suplemento: Suplemento) => {
    const novoSuplemento: SuplementoProtocolo = {
      suplementoId: suplemento.id,
      nome: suplemento.nome,
      dose: suplemento.doseRecomendada,
      horario: "",
      observacoes: "",
    }
    setSuplementos([...suplementos, novoSuplemento])
    setSearchQuery("")
    setSearchResults([])
  }

  const removerSuplemento = (suplementoId: string) => {
    setSuplementos(suplementos.filter((s) => s.suplementoId !== suplementoId))
  }

  const atualizarSuplemento = (suplementoId: string, campo: keyof SuplementoProtocolo, valor: any) => {
    setSuplementos(suplementos.map((s) => (s.suplementoId === suplementoId ? { ...s, [campo]: valor } : s)))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Suplemento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Label>Buscar Suplemento</Label>
            <Input
              placeholder="Digite o nome do suplemento..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                {searchResults.map((suplemento) => (
                  <button
                    key={suplemento.id}
                    className="w-full px-4 py-2 text-left hover:bg-accent flex items-center justify-between"
                    onClick={() => adicionarSuplemento(suplemento)}
                  >
                    <div>
                      <div className="font-medium">{suplemento.nome}</div>
                      <div className="text-sm text-muted-foreground">{suplemento.marca}</div>
                    </div>
                    <Badge variant="outline">{suplemento.doseRecomendada}</Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {suplementos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Pill className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhum suplemento adicionado ainda.
              <br />
              Use a busca acima para adicionar suplementos.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Suplementos do Protocolo</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Suplemento</TableHead>
                  <TableHead>Dose</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suplementos.map((suplemento) => (
                  <TableRow key={suplemento.suplementoId}>
                    <TableCell className="font-medium">{suplemento.nome}</TableCell>
                    <TableCell>
                      <Input
                        value={suplemento.dose}
                        onChange={(e) => atualizarSuplemento(suplemento.suplementoId, "dose", e.target.value)}
                        className="w-24"
                        placeholder="30g"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={suplemento.horario}
                        onChange={(e) => atualizarSuplemento(suplemento.suplementoId, "horario", e.target.value)}
                        className="w-32"
                        placeholder="Após treino"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={suplemento.observacoes}
                        onChange={(e) => atualizarSuplemento(suplemento.suplementoId, "observacoes", e.target.value)}
                        placeholder="Observações..."
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removerSuplemento(suplemento.suplementoId)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
