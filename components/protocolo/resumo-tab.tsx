// src/components/protocolo/resumo-tab.tsx (FINAL: DETALHADO E BOTÕES SIMPLIFICADOS)

"use client"

import { FileDown, CheckCircle2, Utensils, Dumbbell, Pill, FlaskConical, Syringe, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type {
  Refeicao,
  TreinoDivisao,
  SuplementoProtocolo,
  ManipuladoProtocolo,
  HormonioProtocolo,
  StatusProtocolo,
} from "@/types/protocolo"

interface ResumoTabProps {
  alunoNome: string
  nomeProtocolo: string 
  descricaoProtocolo: string
  dataCriacao?: Date 
  dataValidade?: Date
  
  refeicoes: Refeicao[]
  treinos: TreinoDivisao[]
  suplementos: SuplementoProtocolo[]
  manipulados: ManipuladoProtocolo[]
  hormonios: HormonioProtocolo[]

  // Ação de salvar o protocolo (como rascunho ou ativo)
  onSave: (status: StatusProtocolo) => void 
  // Ação de cancelar (voltar/fechar o fluxo)
  onCancel: () => void 
}

export function ResumoTab({
  alunoNome,
  nomeProtocolo,
  descricaoProtocolo,
  dataCriacao,
  dataValidade,
  refeicoes,
  treinos,
  suplementos,
  manipulados,
  hormonios,
  onSave,
  onCancel, // Nova propriedade
}: ResumoTabProps) {
  const totalAlimentos = refeicoes.reduce((acc, r) => acc + r.alimentos.length, 0)
  const totalExercicios = treinos.reduce((acc, t) => acc + t.exercicios.length, 0)
  
  const formatDate = (date?: Date) => date ? new Date(date).toLocaleDateString('pt-BR') : 'N/A'

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{nomeProtocolo || "Novo Protocolo"}</CardTitle>
          <CardDescription>Protocolo para: <span className="font-semibold">{alunoNome}</span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* DETALHES GERAIS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b">
            <div>
              <h3 className="font-semibold mb-1">Status</h3>
              <Badge variant="default">Em Criação</Badge>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Data Criação</h3>
              <p className="text-sm text-muted-foreground">{formatDate(dataCriacao || new Date())}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Data Validade</h3>
              <p className="text-sm text-muted-foreground">{formatDate(dataValidade)}</p>
            </div>
          </div>
          
          {descricaoProtocolo && (
             <div className="pb-4 border-b">
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-sm text-muted-foreground">{descricaoProtocolo}</p>
             </div>
          )}


          {/* 1. PLANO ALIMENTAR */}
          {refeicoes.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Utensils className="h-5 w-5 text-green-600" />
                Plano Alimentar
                <Badge variant="secondary">{refeicoes.length} Refeições</Badge>
              </h3>
              <p className="text-sm text-muted-foreground">Total: {totalAlimentos} alimentos configurados</p>
              
              <div className="space-y-6 pl-4 border-l">
                {refeicoes.map((refeicao) => (
                  <div key={refeicao.id} className="pt-2">
                    <h4 className="font-bold text-base mb-1">
                      {refeicao.nome}
                      {refeicao.horario && <span className="text-sm font-normal text-muted-foreground ml-2">({refeicao.horario})</span>}
                    </h4>
                    
                    {refeicao.observacoes && <p className="text-xs italic text-muted-foreground mb-2">Obs: {refeicao.observacoes}</p>}
                    
                    <ul className="list-disc pl-5 text-sm space-y-0.5">
                      {refeicao.alimentos.map(item => (
                        <li key={item.alimentoId}>
                          {item.alimento?.nome} ({item.quantidade} {item.unidadeMedida}) 
                          {item.observacoes && <span className="text-xs text-muted-foreground ml-1">({item.observacoes})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {refeicoes.length > 0 && <Separator />}
          

          {/* 2. PLANO DE TREINO */}
          {treinos.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-blue-600" />
                Plano de Treino
                <Badge variant="secondary">{treinos.length} Divisões</Badge>
              </h3>
              <p className="text-sm text-muted-foreground">Total: {totalExercicios} exercícios configurados</p>
              
              <div className="space-y-6 pl-4 border-l">
                {treinos.map((treino) => (
                  <div key={treino.id} className="pt-2">
                    <h4 className="font-bold text-base mb-1">{treino.nomeDivisao}</h4>
                    {treino.orientacoes && <p className="text-xs italic text-muted-foreground mb-2">Obs. Geral: {treino.orientacoes}</p>}

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Exercício</TableHead>
                                    <TableHead className="w-24">Séries</TableHead>
                                    <TableHead className="w-24">Reps/Tempo</TableHead>
                                    <TableHead className="w-24">Descanso</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {treino.exercicios.map(item => (
                                    <TableRow key={item.exercicioId}>
                                        <TableCell className="text-sm font-medium">
                                            {item.exercicio?.nomeExercicio}
                                            <span className="text-muted-foreground text-[10px] block">{item.exercicio?.grupoMuscular}</span>
                                        </TableCell>
                                        <TableCell>{item.series}</TableCell>
                                        <TableCell>{item.repeticoes}</TableCell>
                                        <TableCell>{item.intervaloDescanso}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {treinos.length > 0 && <Separator />}
          
          {/* 3. SUPLEMENTOS, MANIPULADOS E HORMÔNIOS */}
          {(suplementos.length > 0 || manipulados.length > 0 || hormonios.length > 0) && (
            <div className="space-y-6 pt-4 border-t">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Pill className="h-5 w-5 text-yellow-600" />
                Suplementação e Hormônios
              </h3>

              {/* Suplementos */}
              {suplementos.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-bold text-base flex items-center gap-2">
                        <Pill className="h-4 w-4 text-yellow-600"/> Suplementos ({suplementos.length})
                    </h4>
                    <ul className="list-disc pl-5 text-sm space-y-0.5">
                        {suplementos.map(s => (
                            <li key={s.suplementoId}>
                                {s.suplemento?.nomeSuplemento || s.suplementoId} ({s.dose}, {s.horario})
                                {s.observacoes && <span className="text-xs text-muted-foreground ml-1"> — Obs: {s.observacoes}</span>}
                            </li>
                        ))}
                    </ul>
                </div>
              )}
              
              {/* Manipulados */}
              {manipulados.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-bold text-base flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-red-600"/> Manipulados ({manipulados.length})
                    </h4>
                    <ul className="list-disc pl-5 text-sm space-y-0.5">
                        {manipulados.map(m => (
                            <li key={m.suplementoId}>
                                {m.suplemento?.nomeManipulado || m.suplemento?.nomeSuplemento} ({m.dose}, {m.horario})
                                {m.observacoes && <span className="text-xs text-muted-foreground ml-1"> — Obs: {m.observacoes}</span>}
                            </li>
                        ))}
                    </ul>
                </div>
              )}
              
              {/* Hormônios */}
              {hormonios.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-bold text-base flex items-center gap-2">
                        <Syringe className="h-4 w-4 text-purple-600"/> Hormônios ({hormonios.length})
                    </h4>
                    <ul className="list-disc pl-5 text-sm space-y-0.5">
                        {hormonios.map(h => (
                            <li key={h.hormonioId}>
                                {h.hormonio?.nome} ({h.dosagem}, {h.frequencia}, {h.viaAdministracao})
                                {h.observacoes && <span className="text-xs text-muted-foreground ml-1"> — Obs: {h.observacoes}</span>}
                            </li>
                        ))}
                    </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        {/* 🚨 REQUISIÇÃO DO USUÁRIO: Botão Cancelar */}
        <Button variant="outline" onClick={onCancel} className="flex-1">
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
        {/* 🚨 REQUISIÇÃO DO USUÁRIO: Botão Salvar (Assumindo que salva como ATIVO) */}
        <Button onClick={() => onSave('ATIVO')} className="flex-1">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </div>
    </div>
  )
}