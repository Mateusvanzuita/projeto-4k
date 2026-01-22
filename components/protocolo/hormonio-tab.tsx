// src/components/protocolo/hormonio-tab.tsx (FINAL: BUSCA LOCAL, UX UNIFICADA E ERROS CORRIGIDOS)

"use client"

import { useState, useEffect, useCallback, useMemo } from "react" 
// 🚨 CORREÇÃO 1: Importar Search
import { Trash2, Syringe, AlertTriangle, Search } from "lucide-react" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { hormonioService } from "@/services/hormonio-service"
import type { Hormonio } from "@/types/hormonio"
import type { HormonioProtocolo, FrequenciaHormonio, ViaAdministracao } from "@/types/protocolo"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HormoniosTabProps {
  value: HormonioProtocolo[]
  onChange: (hormonios: HormonioProtocolo[]) => void
}

export function HormoniosTab({ value, onChange }: HormoniosTabProps) {
  const { toast } = useToast()
  const [hormonios, setHormonios] = useState<HormonioProtocolo[]>(value)
  
  // 🚨 NOVO ESTADO: Armazena todos os hormônios disponíveis
  const [allHormonios, setAllHormonios] = useState<Hormonio[]>([]) 
  const [loadingHormonios, setLoadingHormonios] = useState(true)

  // Estados para Combobox
  const [searchQuery, setSearchQuery] = useState("")
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)
  
  useEffect(() => {
    onChange(hormonios)
  }, [hormonios, onChange])
  
  // 🚨 CORREÇÃO 2: Carrega TODOS os hormônios no mount (usando getAll)
  useEffect(() => {
    const fetchAllHormonios = async () => {
      setLoadingHormonios(true)
      try {
        // Assume que hormonioService.getAll() é o método que retorna a lista completa
        const result = await hormonioService.getAll({ limit: 500 }) 
        
        // Tratamento robusto da resposta (para lidar com { data: [...] } ou array direto)
        const dataArray = (result && Array.isArray(result.data)) ? result.data : (Array.isArray(result) ? result : []);
        
        setAllHormonios(dataArray)
      } catch (error) {
        toast({
          title: "Erro de Carga",
          description: "Não foi possível carregar o catálogo de hormônios.",
          variant: "destructive",
        })
      } finally {
        setLoadingHormonios(false)
      }
    }
    fetchAllHormonios()
  }, [toast])


  // 🚨 CORREÇÃO 3: Lógica de Filtro Local (useMemo)
  const filteredHormonios = useMemo(() => {
    if (!searchQuery.trim()) {
        return allHormonios.slice(0, 20)
    }
    const lowerCaseQuery = searchQuery.toLowerCase()
    
    return allHormonios.filter(hormonio => {
        // 🚨 FILTRO PELO nome/tipo
        const nome = hormonio.nome || ''; 
        const tipo = hormonio.tipo || ''; 
        
        return nome.toLowerCase().includes(lowerCaseQuery) ||
               tipo.toLowerCase().includes(lowerCaseQuery)
    }).slice(0, 20)
  }, [searchQuery, allHormonios])


  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const adicionarHormonio = (hormonio: Hormonio) => {
    if (hormonios.some(h => h.hormonioId === hormonio.id)) {
        toast({ title: "Atenção", description: "Este hormônio já foi adicionado.", variant: "destructive" })
        return
    }

    const novoHormonio: HormonioProtocolo = {
      hormonioId: hormonio.id,
      hormonio: hormonio, 
      dosagem: "1ml", 
      frequencia: "SEMANAL" as FrequenciaHormonio, 
      viaAdministracao: (hormonio.viaAdministracao || "SUBCUTANEA") as ViaAdministracao, 
      observacoes: "",
    }
    setHormonios([...hormonios, novoHormonio])
    setSearchQuery("")
    setIsComboboxOpen(false) 
  }

  const removerHormonio = (hormonioId: string) => {
    setHormonios(hormonios.filter((h) => h.hormonioId !== hormonioId))
  }

  const atualizarHormonio = (hormonioId: string, campo: keyof HormonioProtocolo, valor: any) => {
    setHormonios(hormonios.map((h) => (h.hormonioId === hormonioId ? { ...h, [campo]: valor } : h)))
  }
  
  const FREQUENCIA_OPTIONS: FrequenciaHormonio[] = ["DIARIA", "SEMANAL", "MENSAL", "CONFORME_NECESSARIO"]
  const VIA_OPTIONS: ViaAdministracao[] = ["SUBCUTANEA", "INTRAMUSCULAR", "ORAL", "TOPICA"]


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
          {/* Combobox Customizado (Input + Lista Condicional) */}
          <div className="relative">
            <Label>Buscar Hormônio</Label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 mt-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder={loadingHormonios ? "Carregando hormônios..." : "Digite para buscar ou clique para ver todos..."}
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => setIsComboboxOpen(true)}
                    onBlur={() => setTimeout(() => setIsComboboxOpen(false), 200)}
                    className="pl-10 text-sm"
                    disabled={loadingHormonios}
                />
            </div>

            {/* Lista de Resultados */}
            {isComboboxOpen && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                    
                    {loadingHormonios && (
                        <div className="p-3 text-sm text-center text-primary">Carregando...</div>
                    )}

                    {!loadingHormonios && filteredHormonios.length > 0 && (
                        filteredHormonios.map((hormonio) => (
                            <button
                                key={hormonio.id}
                                className="flex items-center justify-between w-full p-2 text-sm rounded-sm text-left hover:bg-accent hover:text-accent-foreground"
                                onClick={() => adicionarHormonio(hormonio)}
                            >
                                {/* 🚨 REQUISIÇÃO DO USUÁRIO: Exibir nomeHormonio e tipo */}
                                <div className="flex-1 min-w-0 pr-2">
                                    <span className="truncate font-medium text-foreground">
                                        {hormonio.nome}
                                    </span>
                                </div>
                                <Badge variant="secondary" className="flex-shrink-0">
                                    {hormonio.tipo}
                                </Badge>
                            </button>
                        ))
                    )}

                    {!loadingHormonios && filteredHormonios.length === 0 && (
                        <div className="p-3 text-center text-muted-foreground">
                            {searchQuery.trim() ? `Nenhum hormônio encontrado para "${searchQuery}".` : "Nenhum hormônio cadastrado."}
                        </div>
                    )}
                </div>
            )}
          </div>
          {/* FIM Combobox Customizado */}
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
            <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Hormônio</TableHead>
                      <TableHead className="w-24">Dose</TableHead>
                      <TableHead className="w-32">Frequência</TableHead>
                      <TableHead className="w-24">Via</TableHead>
                      <TableHead>Observações</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hormonios.map((hormonio) => (
                      <TableRow key={hormonio.hormonioId}>
                        <TableCell className="font-medium">
                          {hormonio.hormonio?.nome || `ID: ${hormonio.hormonioId.substring(0, 8)}...`}
                          <span className="text-muted-foreground text-[10px] block">{hormonio.hormonio?.categoria}</span>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={hormonio.dosagem}
                            onChange={(e) => atualizarHormonio(hormonio.hormonioId, "dosagem", e.target.value)}
                            className="w-24"
                            placeholder="250mg"
                          />
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={hormonio.frequencia} 
                            onValueChange={(v: FrequenciaHormonio) => atualizarHormonio(hormonio.hormonioId, "frequencia", v)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Selecione a frequência" />
                            </SelectTrigger>
                            <SelectContent>
                              {FREQUENCIA_OPTIONS.map(frequencia => (
                                <SelectItem key={frequencia} value={frequencia}>
                                  {frequencia.replace('_', ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={hormonio.viaAdministracao} 
                            onValueChange={(v: ViaAdministracao) => atualizarHormonio(hormonio.hormonioId, "viaAdministracao", v)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Via" />
                            </SelectTrigger>
                            <SelectContent>
                              {VIA_OPTIONS.map(via => (
                                <SelectItem key={via} value={via}>
                                  {via.replace('_', ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}