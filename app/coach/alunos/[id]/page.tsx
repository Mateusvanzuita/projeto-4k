"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Mail, Phone, Calendar, Target, Activity, FileText, Edit } from "lucide-react"
import { alunoService } from "@/services/aluno-service"
import { coachMenuItems } from "@/lib/menu-items"
import { useToast } from "@/hooks/use-toast"
import type { Aluno } from "@/types/aluno"
import { SEXO_LABELS, PLANO_LABELS, TIPO_PLANO_LABELS, OBJETIVO_LABELS, FREQUENCIA_FOTOS_LABELS } from "@/types/aluno"

export default function AlunoDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [aluno, setAluno] = useState<Aluno | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAluno()
  }, [params.id])

  const loadAluno = async () => {
    try {
      setIsLoading(true)
      const data = await alunoService.getById(params.id as string)
      if (!data) {
        toast({
          title: "Aluno não encontrado",
          variant: "destructive",
        })
        router.push("/coach/alunos")
        return
      }
      setAluno(data)
    } catch (error) {
      toast({
        title: "Erro ao carregar aluno",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <AppLayout
        menuItems={coachMenuItems}
        onCreateProtocol={() => router.push("/coach/protocolos/novo")}
        onNavigateAlunos={() => router.push("/coach/alunos")}
        onNavigateRelatorios={() => router.push("/coach/relatorios")}
      >
        <div className="p-4">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-4" />
          <div className="h-64 bg-muted animate-pulse rounded" />
        </div>
      </AppLayout>
    )
  }

  if (!aluno) return null

  const imc = (aluno.peso / (aluno.altura / 100) ** 2).toFixed(1)

  return (
    <AppLayout
      menuItems={coachMenuItems}
      onCreateProtocol={() => router.push("/coach/protocolos/novo")}
      onNavigateAlunos={() => router.push("/coach/alunos")}
      onNavigateRelatorios={() => router.push("/coach/relatorios")}
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/coach/alunos")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={() => router.push(`/coach/alunos/${aluno.id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-[#003E63]/10 flex items-center justify-center">
              <User className="w-10 h-10 text-[#003E63]" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{aluno.nomeCompleto}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-[#003E63] text-white">{OBJETIVO_LABELS[aluno.objetivo]}</Badge>
                <Badge className="bg-[#F2B139] text-white">{TIPO_PLANO_LABELS[aluno.tipoPlano]}</Badge>
                <Badge variant="outline">{PLANO_LABELS[aluno.plano]}</Badge>
                {!aluno.ativo && <Badge variant="destructive">Inativo</Badge>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{aluno.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{aluno.contato}</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="protocolos">Protocolos</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Dados Pessoais
                  </h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Idade:</dt>
                      <dd className="font-medium">{aluno.idade} anos</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Sexo:</dt>
                      <dd className="font-medium">{SEXO_LABELS[aluno.sexo]}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Altura:</dt>
                      <dd className="font-medium">{aluno.altura} cm</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Peso:</dt>
                      <dd className="font-medium">{aluno.peso} kg</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">IMC:</dt>
                      <dd className="font-medium">{imc}</dd>
                    </div>
                  </dl>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Plano e Objetivo
                  </h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Plano:</dt>
                      <dd className="font-medium">{PLANO_LABELS[aluno.plano]}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Tipo:</dt>
                      <dd className="font-medium">{TIPO_PLANO_LABELS[aluno.tipoPlano]}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Objetivo:</dt>
                      <dd className="font-medium">{OBJETIVO_LABELS[aluno.objetivo]}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Já treinava:</dt>
                      <dd className="font-medium">{aluno.jaTreinava ? "Sim" : "Não"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Freq. Fotos:</dt>
                      <dd className="font-medium">{FREQUENCIA_FOTOS_LABELS[aluno.frequenciaFotos]}</dd>
                    </div>
                  </dl>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Restrições
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground mb-1">Alimentar:</dt>
                      <dd className="font-medium">{aluno.restricaoAlimentar || "Nenhuma"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground mb-1">Exercício:</dt>
                      <dd className="font-medium">{aluno.restricaoExercicio || "Nenhuma"}</dd>
                    </div>
                  </dl>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Histórico Médico
                  </h3>
                  <p className="text-sm">{aluno.historicoMedico || "Nenhum histórico registrado"}</p>
                </Card>
              </div>

              {aluno.observacoes && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Observações</h3>
                  <p className="text-sm text-muted-foreground">{aluno.observacoes}</p>
                </Card>
              )}

              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Datas
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Cadastrado em:</dt>
                    <dd className="font-medium">{new Date(aluno.createdAt).toLocaleDateString("pt-BR")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Última atualização:</dt>
                    <dd className="font-medium">{new Date(aluno.updatedAt).toLocaleDateString("pt-BR")}</dd>
                  </div>
                </dl>
              </Card>
            </TabsContent>

            <TabsContent value="protocolos" className="mt-4">
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">Nenhum protocolo vinculado ainda</p>
                <Button onClick={() => router.push("/coach/protocolos/novo")}>Criar Primeiro Protocolo</Button>
              </Card>
            </TabsContent>

            <TabsContent value="historico" className="mt-4">
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Histórico de evolução em desenvolvimento</p>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </AppLayout>
  )
}
