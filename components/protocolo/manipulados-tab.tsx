// src/components/protocolo/manipulados-tab.tsx (FINAL: TRATAMENTO DE API ROBUSTO)

"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Trash2, FlaskConical, Search, AlertTriangle } from "lucide-react" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { suplementoService } from "@/services/suplemento-service"
import type { Suplemento } from "@/types/suplemento"
import type { ManipuladoProtocolo } from "@/types/protocolo"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ManipuladosTabProps {
  value: ManipuladoProtocolo[]
  onChange: (manipulados: ManipuladoProtocolo[]) => void
}

export function ManipuladosTab({ value, onChange }: ManipuladosTabProps) {
  const { toast } = useToast()
  const [manipulados, setManipulados] = useState<ManipuladoProtocolo[]>(value)
  const [manipuladosDisponiveis, setManipuladosDisponiveis] = useState<Suplemento[]>([])
  
  // Combobox Logic
  const [searchQuery, setSearchQuery] = useState("")
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)
  const [loadingManipulados, setLoadingManipulados] = useState(true)

  useEffect(() => {
    // 1. Carregar TODOS os suplementos
    const fetchManipulados = async () => {
      setLoadingManipulados(true)
      try {
        const result = await suplementoService.getAll({ limit: 500 }) 
        
        // 🚨 CORREÇÃO DE ESTRUTURA: Lida com array direto ou objeto com array dentro
        let suplesArray: Suplemento[] = [];
        if (Array.isArray(result)) {
            suplesArray = result;
        } else if (result && Array.isArray(result.data)) {
            suplesArray = result.data;
        } else if (result && Array.isArray(result.suplementos)) {
            suplesArray = result.suplementos;
        } 
        
        // Filtro final, garantindo lower case e null check. Agora a lista deve ser populada.
        const manipuladoFilter = suplesArray.filter(s => 
          s.tipo && s.tipo.toLowerCase() === 'manipulado'
        )
        
        setManipuladosDisponiveis(manipuladoFilter)

      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível carregar o catálogo de manipulados.", variant: "destructive" })
      } finally {
        setLoadingManipulados(false)
      }
    }
    fetchManipulados()
  }, [])
  
  useEffect(() => {
    onChange(manipulados) // Notifica o componente pai sobre mudanças
  }, [manipulados, onChange])
  
  // Filtro de Busca (useMemo) - Segue o esquema dos demais: retorna os manipulados quando a busca está vazia
  const filteredManipulados = useMemo(() => {
    if (!searchQuery.trim()) {
        return manipuladosDisponiveis.slice(0, 20)
    }
    const lowerCaseQuery = searchQuery.toLowerCase()
    
    return manipuladosDisponiveis.filter(manipulado => {
        const nome = manipulado.nomeManipulado || manipulado.nomeSuplemento || ''; 
        const categoria = manipulado.categoria || '';
        
        return nome.toLowerCase().includes(lowerCaseQuery) ||
               categoria.toLowerCase().includes(lowerCaseQuery)
    }).slice(0, 20)
  }, [searchQuery, manipuladosDisponiveis])


  // --- Funções de Manipulação ---
  
  const handleSelectAndAddManipulado = (manipulado: Suplemento) => {
    setSearchQuery('')
    setIsComboboxOpen(false)

    if (manipulados.some(m => m.suplementoId === manipulado.id)) {
        toast({ title: "Atenção", description: "Este manipulado já foi adicionado.", variant: "destructive" })
        return
    }

    const novoManipulado: ManipuladoProtocolo = {
      suplementoId: manipulado.id,
      suplemento: manipulado, 
      dose: "1 cápsula",
      horario: "Pela manhã", 
      observacoes: "",
    }

    setManipulados(prev => [...prev, novoManipulado])
  }

  const removerManipulado = (id: string) => {
    setManipulados(prev => prev.filter(m => m.suplementoId !== id))
  }
  
  const atualizarManipulado = useCallback((id: string, campo: keyof ManipuladoProtocolo, valor: any) => {
    setManipulados(prev => prev.map(m => 
      m.suplementoId === id ? { ...m, [campo]: valor } : m
    ))
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Manipulados</CardTitle>
          <CardDescription>Adicione fórmulas ou manipulados personalizados ao protocolo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Combobox Customizado (Input + Lista Condicional) */}
          <div className="space-y-2 relative">
              <Label className="text-xs md:text-sm">Buscar Manipulado</Label>
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                      placeholder={loadingManipulados ? "Carregando manipulados..." : "Digite para buscar ou clique para ver todos..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsComboboxOpen(true)}
                      onBlur={() => setTimeout(() => setIsComboboxOpen(false), 200)}
                      className="pl-10 text-sm"
                      disabled={loadingManipulados}
                  />
              </div>

              {/* Lista de Resultados */}
              {isComboboxOpen && (
                  <div className="absolute z-20 w-full rounded-md border bg-popover p-1 shadow-lg max-h-60 overflow-y-auto">
                      
                      {loadingManipulados && (
                          <div className="p-3 text-sm text-center text-primary">Carregando...</div>
                      )}

                      {!loadingManipulados && filteredManipulados.length > 0 && (
                          filteredManipulados.map((manipulado) => (
                              <button
                                  key={manipulado.id}
                                  className="flex items-center justify-between w-full p-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                                  onClick={() => handleSelectAndAddManipulado(manipulado)}
                              >
                                  {/* EXIBIÇÃO: Nome do Manipulado [Tipo/Categoria] */}
                                  <div className="flex-1 min-w-0 pr-2">
                                      <span className="truncate text-left font-medium text-foreground">
                                          {manipulado.nomeManipulado || manipulado.nomeSuplemento || "[Nome Ausente]"}
                                      </span>
                                  </div>
                                  
                                  <Badge variant="secondary" className="flex-shrink-0">
                                      {manipulado.categoria}
                                  </Badge>
                              </button>
                          ))
                      )}

                      {!loadingManipulados && filteredManipulados.length === 0 && (
                          <div className="p-3 text-center text-muted-foreground">
                              {searchQuery.trim() ? `Nenhum manipulado encontrado para "${searchQuery}".` : "Nenhum manipulado cadastrado."}
                          </div>
                      )}
                  </div>
              )}
          </div>
          {/* FIM Combobox Customizado */}

          {manipulados.length === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Nenhum manipulado adicionado.
              </AlertDescription>
            </Alert>
          )}
          
          {manipulados.length > 0 && (
            <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Manipulado</TableHead>
                      <TableHead className="w-24">Dose</TableHead>
                      <TableHead className="w-32">Horário/Período</TableHead>
                      <TableHead>Observações</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {manipulados.map((manipulado) => (
                      <TableRow key={manipulado.suplementoId}>
                        <TableCell className="font-medium">
                          {manipulado.suplemento?.nomeManipulado || manipulado.suplemento?.nomeSuplemento || "Manipulado [Nome Ausente]"}
                          <span className="text-muted-foreground text-[10px] block">{manipulado.suplemento?.categoria}</span>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={manipulado.dose}
                            onChange={(e) => atualizarManipulado(manipulado.suplementoId, "dose", e.target.value)}
                            className="w-24"
                            placeholder="1 cápsula"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={manipulado.horario}
                            onChange={(e) => atualizarManipulado(manipulado.suplementoId, "horario", e.target.value)}
                            className="w-32"
                            placeholder="Pela manhã / 3x dia"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={manipulado.observacoes}
                            onChange={(e) => atualizarManipulado(manipulado.suplementoId, "observacoes", e.target.value)}
                            placeholder="Observações..."
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removerManipulado(manipulado.suplementoId)}>
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