"use client"

import { useState, useEffect } from "react"
import { Trash2, Syringe, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { hormonioService } from "@/services/hormonio-service"
import type { Hormonio } from "@/types/hormonio"
import type { HormonioProtocolo } from "@/types/protocolo"
import { useToast } from "@/hooks/use-toast"

interface HormoniosTabProps {
  value: HormonioProtocolo[]
  onChange: (hormonios: HormonioProtocolo[]) => void
}

export function HormoniosTab({ value, onChange }: HormoniosTabProps) {
  const { toast } = useToast()
  const [hormonios, setHormonios] = useState<HormonioProtocolo[]>(value)
  const [hormoniosDisponiveis, setHormoniosDisponiveis] = useState<Hormonio[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Hormonio[]>([])

  useEffect(() => {
    loadHormonios()
  }, [])

  useEffect(() => {
    onChange(hormonios)
  }, [hormonios, onChange])

  const loadHormonios = async () => {
    try {
      const data = await hormonioService.getAll()
      setHormoniosDisponiveis(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os hormônios.",
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
    const results = hormoniosDisponiveis.filter((h) => h.nome.toLowerCase().includes(query.toLowerCase()))
    setSearchResults(results)
  }

  const adicionarHormonio = (hormonio: Hormonio) => {
    const novoHormonio: HormonioProtocolo = {
      hormonioId: hormonio.id,
      nome: hormonio.nome,
      dose: hormonio.dose,
      frequencia: hormonio.frequencia,
      viaAdministracao: hormonio.viaAdministracao,
      observacoes: "",
    }
    setHormonios([...hormonios, novoHormonio])
    setSearchQuery("")
    setSearchResults([])
  }

  const removerHormonio = (hormonioId: string) => {
    setHormonios(hormonios.filter((h) => h.hormonioId !== hormonioId))
  }

  const atualizarHormonio = (hormonioId: string, campo: keyof HormonioProtocolo, valor: any) => {
    setHormonios(hormonios.map((h) => (h.hormonioId === hormonioId ? { ...h, [campo]: valor } : h)))
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Esta seção é opcional e deve ser usada apenas sob supervisão médica adequada. O uso de hormônios requer
          acompanhamento profissional especializado.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Hormônio</CardTitle>
          <CardDescription>Busque e adicione hormônios ao protocolo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Label>Buscar Hormônio</Label>
            <Input
              placeholder="Digite o nome do hormônio..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                {searchResults.map((hormonio) => (
                  <button
                    key={hormonio.id}
                    className="w-full px-4 py-2 text-left hover:bg-accent flex items-center justify-between"
                    onClick={() => adicionarHormonio(hormonio)}
                  >
                    <div>
                      <div className="font-medium">{hormonio.nome}</div>
                      <div className="text-sm text-muted-foreground">{hormonio.fabricante}</div>
                    </div>
                    <Badge variant="outline">{hormonio.categoria}</Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {hormonios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Syringe className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhum hormônio adicionado ainda.
              <br />
              Esta seção é opcional.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Hormônios do Protocolo</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hormônio</TableHead>
                  <TableHead>Dose</TableHead>
                  <TableHead>Frequência</TableHead>
                  <TableHead>Via</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hormonios.map((hormonio) => (
                  <TableRow key={hormonio.hormonioId}>
                    <TableCell className="font-medium">{hormonio.nome}</TableCell>
                    <TableCell>
                      <Input
                        value={hormonio.dose}
                        onChange={(e) => atualizarHormonio(hormonio.hormonioId, "dose", e.target.value)}
                        className="w-24"
                        placeholder="250mg"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={hormonio.frequencia}
                        onChange={(e) => atualizarHormonio(hormonio.hormonioId, "frequencia", e.target.value)}
                        className="w-32"
                        placeholder="2x semana"
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{hormonio.viaAdministracao}</Badge>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={hormonio.observacoes}
                        onChange={(e) => atualizarHormonio(hormonio.hormonioId, "observacoes", e.target.value)}
                        placeholder="Observações..."
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removerHormonio(hormonio.hormonioId)}>
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
