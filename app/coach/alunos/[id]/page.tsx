"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, User, Calendar, Target, Activity, 
  FileText, Loader2, ChevronRight, Plus 
} from "lucide-react"
import { alunoService } from "@/services/aluno-service"
import { protocoloService } from "@/services/protocolo-service" // 
import { coachMenuItems } from "@/lib/menu-items"
import { useToast } from "@/hooks/use-toast"
import type { Aluno } from "@/types/aluno"
import type { Protocolo } from "@/types/protocolo" // 
import { RegistroEvolucao } from "@/services/foto-service"
import { 
  PLANO_LABELS, TIPO_PLANO_LABELS, OBJETIVO_LABELS 
} from "@/types/aluno"

export default function AlunoDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  const [aluno, setAluno] = useState<Aluno | null>(null)
  const [protocolos, setProtocolos] = useState<Protocolo[]>([]) // 
  const [isLoading, setIsLoading] = useState(true)
  
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoading(true)
        // Busca dados do aluno [cite: 16] e protocolos  em paralelo
        const [alunoData, protocolosData] = await Promise.all([
          alunoService.getById(params.id as string),
          protocoloService.getAll() 
        ])

        if (!alunoData) {
          toast({ title: "Aluno não encontrado", variant: "destructive" })
          router.push("/coach/alunos")
          return
        }

        setAluno(alunoData)
        
        // Filtra os protocolos pertencentes a este aluno específico 
        // O backend já retorna ordenado do mais atual para o antigo 
        const filtrados = protocolosData.filter(p => p.alunoId === params.id)
        setProtocolos(filtrados)
      } catch (error) {
        toast({ title: "Erro ao carregar dados", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }

    loadAllData()
  }, [params.id])

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

            {/* ABA PROTOCOLOS ATUALIZADA [cite: 13, 14, 17] */}
{/* ABA PROTOCOLOS - VERSÃO MINIMALISTA */}
<TabsContent value="protocolos" className="mt-4 space-y-4">
  <div className="flex justify-between items-center mb-2">
    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
      <FileText className="w-4 h-4" /> Histórico de Protocolos
    </h3>
    <Button 
      size="sm" 
      className="bg-[#003E63] hover:bg-[#002b45]" 
      onClick={() => router.push("/coach/protocolos/novo")}
    >
      <Plus className="w-4 h-4 mr-1" /> Novo Protocolo
    </Button>
  </div>

  {protocolos.length > 0 ? (
    <div className="grid gap-3">
      {protocolos.map((prot) => (
        <Card 
          key={prot.id} 
          className="group cursor-pointer border-none shadow-sm hover:shadow-md transition-all bg-white border-l-4 border-l-slate-200 hover:border-l-[#003E63]"
          onClick={() => router.push(`/coach/protocolos/${prot.id}`)}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              {/* Nome do Protocolo */}
              <p className="font-bold text-slate-900 group-hover:text-[#003E63] transition-colors">
                {prot.nome}
              </p>
              
              <div className="flex items-center gap-3">
                {/* Status */}
                <Badge 
                  className={`text-[10px] font-black border-none ${
                    prot.status === 'ATIVO' 
                      ? 'bg-green-500/10 text-green-600' 
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {prot.status}
                </Badge>

                {/* Data de Criação */}
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(prot.dataCriacao).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
            
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#003E63] transition-colors" />
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <Card className="p-12 text-center border-dashed border-2 bg-slate-50/50">
      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-500 text-sm mb-4">Nenhum protocolo vinculado ainda</p>
      <Button className="bg-[#003E63]" onClick={() => router.push("/coach/protocolos/novo")}>
        Criar Primeiro Protocolo
      </Button>
    </Card>
  )}
</TabsContent>

            <TabsContent value="fotos" className="mt-4 space-y-6">
              {aluno.registrosEvolucao && aluno.registrosEvolucao.length > 0 ? (
                aluno.registrosEvolucao.map((registro) => (
                  <Card key={registro.id} className="border-none shadow-md rounded-2xl overflow-hidden bg-white">
                    <CardContent className="p-5 space-y-4">
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

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {registro.fotos?.map((foto, fIdx) => (
                          <div key={fIdx} className="aspect-[3/4] rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                            <img 
                              src={`${API_URL}${foto.url}`} 
                              className="w-full h-full object-cover" 
                              alt="Foto de Evolução"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>

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