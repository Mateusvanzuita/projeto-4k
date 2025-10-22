"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { coachMenuItems } from "@/lib/menu-items"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlunoSelector } from "@/components/aluno-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlanoAlimentarTab } from "@/components/protocolo/plano-alimentar-tab"
import { TreinoTab } from "@/components/protocolo/treino-tab"
import { SuplementacaoTab } from "@/components/protocolo/suplementacao-tab"
import { ManipuladosTab } from "@/components/protocolo/manipulados-tab"
import { HormoniosTab } from "@/components/protocolo/hormonio-tab"
import { ResumoTab } from "@/components/protocolo/resumo-tab"
import { protocoloService } from "@/services/protocolo-service"
import { alunoService } from "@/services/aluno-service"
import type {
  ProtocoloFormData,
  Refeicao,
  TreinoDivisao,
  SuplementoProtocolo,
  ManipuladoProtocolo,
  HormonioProtocolo,
} from "@/types/protocolo"
import { useToast } from "@/hooks/use-toast"

export default function NovoProtocoloPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [alunoId, setAlunoId] = useState<string>("")
  const [alunoNome, setAlunoNome] = useState<string>("")
  const [activeTab, setActiveTab] = useState("aluno")
  const [saving, setSaving] = useState(false)

  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([])
  const [treinos, setTreinos] = useState<TreinoDivisao[]>([])
  const [suplementos, setSuplementos] = useState<SuplementoProtocolo[]>([])
  const [manipulados, setManipulados] = useState<ManipuladoProtocolo[]>([])
  const [hormonios, setHormonios] = useState<HormonioProtocolo[]>([])

  useEffect(() => {
    if (alunoId) {
      loadAlunoNome()
    }
  }, [alunoId])

  const loadAlunoNome = async () => {
    try {
      const aluno = await alunoService.getById(alunoId)
      if (aluno) {
        setAlunoNome(aluno.nomeCompleto)
      }
    } catch (error) {
      console.error("Erro ao carregar aluno:", error)
    }
  }

  const handleSave = async (status: "rascunho" | "ativo") => {
    if (!alunoId) {
      toast({
        title: "Atenção",
        description: "Selecione um aluno antes de salvar.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const data: ProtocoloFormData = {
        alunoId,
        status,
        planoAlimentar: {
          refeicoes,
          orientacoes: "",
        },
        planoTreino: {
          divisoes: treinos,
          orientacoes: "",
        },
        suplementacao: suplementos,
        manipulados: manipulados,
        hormonios: hormonios,
      }

      const protocolo = await protocoloService.create(data)
      toast({
        title: "Sucesso",
        description: `Protocolo ${status === "rascunho" ? "salvo como rascunho" : "criado e vinculado ao aluno"} com sucesso.`,
      })
      router.push(`/coach/protocolos/${protocolo.id}`)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o protocolo.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleExportPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "Funcionalidade em desenvolvimento...",
    })
  }

  return (
    <AppLayout
      menuItems={coachMenuItems}
      onCreateProtocol={() => router.push("/coach/protocolos/novo")}
      onNavigateAlunos={() => router.push("/coach/alunos")}
      onNavigateRelatorios={() => router.push("/coach/relatorios")}
    >
      <div className="p-3 md:p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Novo Protocolo</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Crie um protocolo personalizado</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => handleSave("rascunho")}
              disabled={saving}
              className="flex-1 md:flex-none text-sm"
            >
              <span className="hidden sm:inline">Salvar </span>Rascunho
            </Button>
            <Button onClick={() => handleSave("ativo")} disabled={saving} className="flex-1 md:flex-none text-sm">
              <span className="hidden sm:inline">Salvar e </span>Ativar
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
            <TabsList className="inline-flex w-auto min-w-full md:grid md:w-full md:grid-cols-7">
              <TabsTrigger value="aluno" className="text-xs md:text-sm whitespace-nowrap">
                Aluno
              </TabsTrigger>
              <TabsTrigger value="dieta" disabled={!alunoId} className="text-xs md:text-sm whitespace-nowrap">
                Dieta
              </TabsTrigger>
              <TabsTrigger value="treino" disabled={!alunoId} className="text-xs md:text-sm whitespace-nowrap">
                Treino
              </TabsTrigger>
              <TabsTrigger value="suplementos" disabled={!alunoId} className="text-xs md:text-sm whitespace-nowrap">
                Suplementos
              </TabsTrigger>
              <TabsTrigger value="manipulados" disabled={!alunoId} className="text-xs md:text-sm whitespace-nowrap">
                Manipulados
              </TabsTrigger>
              <TabsTrigger value="hormonios" disabled={!alunoId} className="text-xs md:text-sm whitespace-nowrap">
                Hormônios
              </TabsTrigger>
              <TabsTrigger value="resumo" disabled={!alunoId} className="text-xs md:text-sm whitespace-nowrap">
                Resumo
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="aluno" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Selecione o Aluno</CardTitle>
                <CardDescription>Escolha o aluno para quem você está criando este protocolo</CardDescription>
              </CardHeader>
              <CardContent>
                <AlunoSelector
                  value={alunoId}
                  onValueChange={setAlunoId}
                  onNovoAluno={() => router.push("/coach/alunos?novo=true")}
                />
                {alunoId && (
                  <div className="mt-4">
                    <Button onClick={() => setActiveTab("dieta")} className="w-full">
                      Continuar para Plano Alimentar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dieta">
            <PlanoAlimentarTab value={refeicoes} onChange={setRefeicoes} />
          </TabsContent>

          <TabsContent value="treino">
            <TreinoTab value={treinos} onChange={setTreinos} />
          </TabsContent>

          <TabsContent value="suplementos">
            <SuplementacaoTab value={suplementos} onChange={setSuplementos} />
          </TabsContent>

          <TabsContent value="manipulados">
            <ManipuladosTab value={manipulados} onChange={setManipulados} />
          </TabsContent>

          <TabsContent value="hormonios">
            <HormoniosTab value={hormonios} onChange={setHormonios} />
          </TabsContent>

          <TabsContent value="resumo">
            <ResumoTab
              alunoNome={alunoNome}
              refeicoes={refeicoes}
              treinos={treinos}
              suplementos={suplementos}
              manipulados={manipulados}
              hormonios={hormonios}
              onExportPDF={handleExportPDF}
              onFinalizar={() => handleSave("ativo")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
