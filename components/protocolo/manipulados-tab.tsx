"use client"

import { useState, useEffect } from "react"
import { Trash2, FlaskConical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { suplementoService } from "@/services/suplemento-service"
import type { Suplemento } from "@/types/suplemento"
import type { ManipuladoProtocolo } from "@/types/protocolo"
import { useToast } from "@/hooks/use-toast"

interface ManipuladosTabProps {
  value: ManipuladoProtocolo[]
  onChange: (manipulados: ManipuladoProtocolo[]) => void
}

export function ManipuladosTab({ value, onChange }: ManipuladosTabProps) {
  const { toast } = useToast()
  const [manipulados, setManipulados] = useState<ManipuladoProtocolo[]>(value)
  const [manipuladosDisponiveis, setManipuladosDisponiveis] = useState<Suplemento[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Suplemento[]>([])

  useEffect(() => {
    loadManipulados()
  }, [])

  useEffect(() => {
    onChange(manipulados)
  }, [manipulados, onChange])

  const loadManipulados = async () => {
    try {
      const data = await suplementoService.getAll()
      setManipuladosDisponiveis(data.filter((s) => s.tipo === "manipulado"))
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os manipulados.",
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
    const results = manipuladosDisponiveis.filter((m) => m.nome.toLowerCase().includes(query.toLowerCase()))
    setSearchResults(results)
  }

  const adicionarManipulado = (manipulado: Suplemento) => {
    const novoManipulado: ManipuladoProtocolo = {
      manipuladoId: manipulado.id,
      nome: manipulado.nome,
      dose: manipulado.doseRecomendada,
      horario: "",
      observacoes: "",
    }
    setManipulados([...manipulados, novoManipulado])
    setSearchQuery("")
    setSearchResults([])
  }

  const removerManipulado = (manipuladoId: string) => {
    setManipulados(manipulados.filter((m) => m.manipuladoId !== manipuladoId))
  }

  const atualizarManipulado = (manipuladoId: string, campo: keyof ManipuladoProtocolo, valor: any) => {
    setManipulados(manipulados.map((m) => (m.manipuladoId === manipuladoId ? { ...m, [campo]: valor } : m)))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Manipulado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Label>Buscar Manipulado</Label>
            <Input
              placeholder="Digite o nome do manipulado..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                {searchResults.map((manipulado) => (
                  <button
                    key={manipulado.id}
                    className="w-full px-4 py-2 text-left hover:bg-accent flex items-center justify-between"
                    onClick={() => adicionarManipulado(manipulado)}
                  >
                    <div>
                      <div className="font-medium">{manipulado.nome}</div>
                      <div className="text-sm text-muted-foreground">{manipulado.marca}</div>
                    </div>
                    <Badge variant="outline">{manipulado.doseRecomendada}</Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {manipulados.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FlaskConical className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhum manipulado adicionado ainda.
              <br />
              Use a busca acima para adicionar manipulados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Manipulados do Protocolo</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Manipulado</TableHead>
                  <TableHead>Dose</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manipulados.map((manipulado) => (
                  <TableRow key={manipulado.manipuladoId}>
                    <TableCell className="font-medium">{manipulado.nome}</TableCell>
                    <TableCell>
                      <Input
                        value={manipulado.dose}
                        onChange={(e) => atualizarManipulado(manipulado.manipuladoId, "dose", e.target.value)}
                        className="w-24"
                        placeholder="1 cápsula"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={manipulado.horario}
                        onChange={(e) => atualizarManipulado(manipulado.manipuladoId, "horario", e.target.value)}
                        className="w-32"
                        placeholder="Pela manhã"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={manipulado.observacoes}
                        onChange={(e) => atualizarManipulado(manipulado.manipuladoId, "observacoes", e.target.value)}
                        placeholder="Observações..."
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removerManipulado(manipulado.manipuladoId)}>
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
