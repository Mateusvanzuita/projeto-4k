"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Mail, Phone, Calendar, Target, Activity, FileText, Edit, Loader2 } from "lucide-react"
import { alunoService } from "@/services/aluno-service"
import { coachMenuItems } from "@/lib/menu-items"
import { useToast } from "@/hooks/use-toast"
import type { Aluno } from "@/types/aluno"
import { RegistroEvolucao } from "@/services/foto-service" //
import { SEXO_LABELS, PLANO_LABELS, TIPO_PLANO_LABELS, OBJETIVO_LABELS, FREQUENCIA_FOTOS_LABELS } from "@/types/aluno"

export default function AlunoDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [aluno, setAluno] = useState<Aluno | null>(null)
  const [historico, setHistorico] = useState<RegistroEvolucao[]>([]) // Estado para as fotos
  const [isLoading, setIsLoading] = useState(true)
  
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    loadAluno()
    loadHistoricoFotos() // Carrega as fotos ao montar o componente
  }, [params.id])

  const loadAluno = async () => {
    try {
      setIsLoading(true)
      const data = await alunoService.getById(params.id as string)
      if (!data) {
        toast({ title: "Aluno não encontrado", variant: "destructive" })
        router.push("/coach/alunos")
        return
      }
      setAluno(data)
    } catch (error) {
      toast({ title: "Erro ao carregar aluno", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const loadHistoricoFotos = async () => {
    try {
      // Busca o histórico real de evolução deste aluno específico
      const data = await alunoService.getEvolucaoByAlunoId(params.id as string)
      setHistorico(data)
    } catch (error) {
      console.error("Erro ao carregar histórico de fotos:", error)
    }
  }

  if (isLoading) {
    return (
      <AppLayout menuItems={coachMenuItems}>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    )
  }

  if (!aluno) return null
  const imc = (aluno.peso / (aluno.altura / 100) ** 2).toFixed(1)

  return (
    <AppLayout menuItems={coachMenuItems}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/coach/alunos")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          {/* <Button onClick={() => router.push(`/coach/alunos/${aluno.id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" /> Editar
          </Button> */}
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
              </div>
            </div>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="protocolos">Protocolos</TabsTrigger>
              <TabsTrigger value="fotos">Fotos</TabsTrigger>
            </TabsList>

            {/* ABA INFORMAÇÕES */}
            <TabsContent value="info" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Dados Pessoais</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between"><dt>Idade:</dt><dd>{aluno.idade} anos</dd></div>
                    <div className="flex justify-between"><dt>Peso:</dt><dd>{aluno.peso} kg</dd></div>
                    <div className="flex justify-between"><dt>IMC:</dt><dd>{imc}</dd></div>
                  </dl>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><Target className="w-4 h-4" /> Objetivo</h3>
                  <p className="text-sm font-medium">{OBJETIVO_LABELS[aluno.objetivo]}</p>
                </Card>
              </div>
            </TabsContent>

            {/* ABA PROTOCOLOS */}
            <TabsContent value="protocolos" className="mt-4">
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">Nenhum protocolo vinculado ainda</p>
                <Button onClick={() => router.push("/coach/protocolos/novo")}>Criar Primeiro Protocolo</Button>
              </Card>
            </TabsContent>

      <TabsContent value="fotos" className="mt-4 space-y-6">
        {aluno.registrosEvolucao && aluno.registrosEvolucao.length > 0 ? (
          aluno.registrosEvolucao.map((registro) => (
            <Card key={registro.id} className="border-none shadow-md rounded-2xl overflow-hidden bg-white">
              <CardContent className="p-5 space-y-4">
                {/* Cabeçalho do Registro */}
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-slate-700">
                      {new Date(registro.dataCriacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-black px-3 py-1">
                    {registro.peso} KG
                  </Badge>
                </div>

                {/* Fotos do Registro */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {registro.fotos?.map((foto, fIdx) => (
                    <div key={fIdx} className="aspect-[3/4] rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${foto.url}`} 
                        className="w-full h-full object-cover" 
                        alt="Foto de Evolução"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>

                {/* Observação do Aluno */}
                {registro.observacao && (
                  <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-primary/30">
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "{registro.observacao}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="p-16 text-center border-dashed bg-slate-50/50">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-full shadow-sm">
                <Activity className="w-10 h-10 text-slate-300" />
              </div>
              <div>
                <h3 className="text-slate-900 font-bold">Sem fotos registradas</h3>
                <p className="text-slate-500 text-sm">Este aluno ainda não realizou envios de evolução física.</p>
              </div>
            </div>
          </Card>
        )}
      </TabsContent>
          </Tabs>
        </Card>
      </div>
    </AppLayout>
  )
}