"use client"

import { FileDown, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type {
  Refeicao,
  TreinoDivisao,
  SuplementoProtocolo,
  ManipuladoProtocolo,
  HormonioProtocolo,
} from "@/types/protocolo"

interface ResumoTabProps {
  alunoNome: string
  refeicoes: Refeicao[]
  treinos: TreinoDivisao[]
  suplementos: SuplementoProtocolo[]
  manipulados: ManipuladoProtocolo[]
  hormonios: HormonioProtocolo[]
  onExportPDF: () => void
  onFinalizar: () => void
}

export function ResumoTab({
  alunoNome,
  refeicoes,
  treinos,
  suplementos,
  manipulados,
  hormonios,
  onExportPDF,
  onFinalizar,
}: ResumoTabProps) {
  const totalAlimentos = refeicoes.reduce((acc, r) => acc + r.alimentos.length, 0)
  const totalExercicios = treinos.reduce((acc, t) => acc + t.exercicios.length, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Protocolo</CardTitle>
          <CardDescription>Revise todas as informações antes de finalizar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Aluno</h3>
            <p className="text-lg">{alunoNome}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              Plano Alimentar
              {refeicoes.length > 0 && <Badge variant="secondary">{refeicoes.length} refeições</Badge>}
            </h3>
            {refeicoes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma refeição configurada</p>
            ) : (
              <div className="space-y-2">
                {refeicoes.map((refeicao) => (
                  <div key={refeicao.id} className="flex items-center justify-between text-sm">
                    <span>
                      {refeicao.nome} {refeicao.horario && `- ${refeicao.horario}`}
                    </span>
                    <Badge variant="outline">{refeicao.alimentos.length} alimentos</Badge>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground mt-2">Total: {totalAlimentos} alimentos configurados</p>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              Plano de Treino
              {treinos.length > 0 && <Badge variant="secondary">{treinos.length} divisões</Badge>}
            </h3>
            {treinos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum treino configurado</p>
            ) : (
              <div className="space-y-2">
                {treinos.map((treino) => (
                  <div key={treino.id} className="flex items-center justify-between text-sm">
                    <span>{treino.nome}</span>
                    <Badge variant="outline">{treino.exercicios.length} exercícios</Badge>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground mt-2">Total: {totalExercicios} exercícios configurados</p>
              </div>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Suplementos</h3>
              <p className="text-2xl font-bold">{suplementos.length}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Manipulados</h3>
              <p className="text-2xl font-bold">{manipulados.length}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Hormônios</h3>
              <p className="text-2xl font-bold">{hormonios.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onExportPDF} className="flex-1 bg-transparent">
          <FileDown className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
        <Button onClick={onFinalizar} className="flex-1">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Finalizar e Vincular ao Aluno
        </Button>
      </div>
    </div>
  )
}
