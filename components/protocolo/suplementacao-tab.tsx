// src/components/protocolo/suplementacao-tab.tsx (FINAL: FILTRO E UX UNIFICADA)

"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
// Adicionado Search e AlertTriangle
import { Trash2, Pill, Search, AlertTriangle } from "lucide-react" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { suplementoService } from "@/services/suplemento-service"
import type { Suplemento } from "@/types/suplemento"
import type { SuplementoProtocolo, MomentoSuplemento } from "@/types/protocolo"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Opções de Uso
const MOMENTOS_USO: MomentoSuplemento[] = ["ANTES_TREINO", "DEPOIS_TREINO", "AO_ACORDAR", "ANTES_DORMIR", "COM_REFEICAO", "OUTRO"]


interface SuplementacaoTabProps { 
  value: SuplementoProtocolo[]
  onChange: (suplementos: SuplementoProtocolo[]) => void
}

export function SuplementacaoTab({ value, onChange }: SuplementacaoTabProps) { 
  const { toast } = useToast()
  const [suplementos, setSuplementos] = useState<SuplementoProtocolo[]>(value)
  const [suplementosDisponiveis, setSuplementosDisponiveis] = useState<Suplemento[]>([])
  
  // Combobox Logic
  const [searchQuery, setSearchQuery] = useState("")
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)
  const [loadingSuplementos, setLoadingSuplementos] = useState(true)

  useEffect(() => {
    // 1. Carregar TODOS os suplementos
    const fetchSuplementos = async () => {
      setLoadingSuplementos(true)
      try {
        const result = await suplementoService.getAll({ limit: 500 }) 
        
        // 🚨 CORREÇÃO ROBUSTA DE ESTRUTURA: Tenta extrair o array de forma segura.
        let suplesArray: Suplemento[] = [];
        if (Array.isArray(result)) {
            suplesArray = result;
        } else if (result && Array.isArray(result.data)) {
            suplesArray = result.data;
        } else if (result && Array.isArray(result.suplementos)) {
            suplesArray = result.suplementos;
        } 
        
        // Filtro final: tipo tem que ser 'suplemento' (case insensitive)
        const suplementoFilter = suplesArray.filter(s => 
          s.tipo && s.tipo.toLowerCase() === 'suplemento'
        )
        
        setSuplementosDisponiveis(suplementoFilter)
        
      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível carregar o catálogo de suplementos.", variant: "destructive" })
      } finally {
        setLoadingSuplementos(false)
      }
    }
    fetchSuplementos()
  }, [])
  
  useEffect(() => {
    onChange(suplementos) 
  }, [suplementos, onChange])
  
  // Filtro de Busca (useMemo)
  const filteredSuplementos = useMemo(() => {
    if (!searchQuery.trim()) {
        return suplementosDisponiveis.slice(0, 20)
    }
    const lowerCaseQuery = searchQuery.toLowerCase()
    
    return suplementosDisponiveis.filter(suplemento => {
        const nome = suplemento.nomeSuplemento || ''; 
        const categoria = suplemento.categoria || '';
        
        return nome.toLowerCase().includes(lowerCaseQuery) ||
               categoria.toLowerCase().includes(lowerCaseQuery)
    }).slice(0, 20)
  }, [searchQuery, suplementosDisponiveis])


  // --- Funções de Manipulação ---
  
  const handleSelectAndAddSuplemento = (suplemento: Suplemento) => {
    setSearchQuery('')
    setIsComboboxOpen(false)

    if (suplementos.some(s => s.suplementoId === suplemento.id)) {
        toast({ title: "Atenção", description: "Este suplemento já foi adicionado.", variant: "destructive" })
        return
    }

    const novoSuplemento: SuplementoProtocolo = {
      suplementoId: suplemento.id,
      suplemento: suplemento, 
      dose: "1 dose",
      horario: "Após treino",
      formaUso: "ANTES_TREINO",
      observacoes: "",
    }

    setSuplementos(prev => [...prev, novoSuplemento])
  }

  const removerSuplemento = (id: string) => { 
    setSuplementos(prev => prev.filter(s => s.suplementoId !== id))
  }
  
  const atualizarSuplemento = useCallback((id: string, campo: keyof SuplementoProtocolo, valor: any) => { 
    setSuplementos(prev => prev.map(s => 
      s.suplementoId === id ? { ...s, [campo]: valor } : s
    ))
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Suplementos</CardTitle>
          <CardDescription>Adicione suplementos industrializados (Whey, Creatina, etc.) ao protocolo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Combobox Customizado (Input + Lista Condicional) */}
          <div className="space-y-2 relative">
              <Label className="text-xs md:text-sm">Buscar Suplemento</Label>
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                      placeholder={loadingSuplementos ? "Carregando suplementos..." : "Digite para buscar ou clique para ver todos..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsComboboxOpen(true)}
                      onBlur={() => setTimeout(() => setIsComboboxOpen(false), 200)}
                      className="pl-10 text-sm"
                      disabled={loadingSuplementos}
                  />
              </div>

              {/* Lista de Resultados */}
              {isComboboxOpen && (
                  <div className="absolute z-20 w-full rounded-md border bg-popover p-1 shadow-lg max-h-60 overflow-y-auto">
                      
                      {loadingSuplementos && (
                          <div className="p-3 text-sm text-center text-primary">Carregando...</div>
                      )}

                      {!loadingSuplementos && filteredSuplementos.length > 0 && (
                          filteredSuplementos.map((suplemento) => (
                              <button
                                  key={suplemento.id}
                                  className="flex items-center justify-between w-full p-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                                  onClick={() => handleSelectAndAddSuplemento(suplemento)}
                              >
                                  {/* Nome Suplemento [Categoria] */}
                                  <div className="flex-1 min-w-0 pr-2">
                                      <span className="truncate text-left font-medium text-foreground">
                                          {suplemento.nomeSuplemento || "[Nome Ausente]"}
                                      </span>
                                  </div>
                                  
                                  <Badge variant="secondary" className="flex-shrink-0">
                                      {suplemento.categoria}
                                  </Badge>
                              </button>
                          ))
                      )}

                      {!loadingSuplementos && filteredSuplementos.length === 0 && (
                          <div className="p-3 text-center text-muted-foreground">
                              {searchQuery.trim() ? `Nenhum suplemento encontrado para "${searchQuery}".` : "Nenhum suplemento cadastrado."}
                          </div>
                      )}
                  </div>
              )}
          </div>
          {/* FIM Combobox Customizado */}

          {suplementos.length === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Nenhum suplemento adicionado.
              </AlertDescription>
            </Alert>
          )}
          
          {suplementos.length > 0 && ( 
            <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Suplemento</TableHead>
                      <TableHead className="w-24">Dose</TableHead>
                      <TableHead className="w-32">Horário</TableHead>
                      <TableHead className="w-32">Momento</TableHead>
                      <TableHead>Observações</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suplementos.map((suplemento) => (
                      <TableRow key={suplemento.suplementoId}>
                        <TableCell className="font-medium">
                          {suplemento.suplemento?.nomeSuplemento || "Suplemento [Nome Ausente]"}
                          <span className="text-muted-foreground text-[10px] block">{suplemento.suplemento?.categoria}</span>
                        </TableCell>
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
                          <Select
                            value={suplemento.formaUso}
                            onValueChange={(v: MomentoSuplemento) => atualizarSuplemento(suplemento.suplementoId, "formaUso", v)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Selecione o momento" />
                            </SelectTrigger>
                            <SelectContent>
                              {MOMENTOS_USO.map(momento => (
                                <SelectItem key={momento} value={momento}>
                                  {momento.replace('_', ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}