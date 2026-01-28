"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { protocoloService } from "@/services/protocolo-service"
import { ProtocoloFormWizard } from "@/components/protocolo/protocolo-form-wizard"
import { useToast } from "@/hooks/use-toast"
import { AppLayout } from "@/components/app-layout"
import { coachMenuItems } from "@/lib/menu-items"
import { Loader2 } from "lucide-react"

export default function EditarProtocoloPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [protocoloFormatado, setProtocoloFormatado] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarProtocolo() {
      try {
        const data = await protocoloService.getById(id as string)
        
        if (!data) {
          toast({ title: "Erro", description: "Protocolo não encontrado.", variant: "destructive" })
          router.push("/coach/protocolos")
          return
        }

        // Mapeamento do Objeto do Backend para o FormState do Wizard
        const formatadoParaOForm = {
          id: data.id,
          identidade: {
            nome: data.nome,
            objetivo: data.objetivo || "Cutting",
            validade: data.dataValidade ? new Date(data.dataValidade).toISOString().split('T')[0] : "",
            descricao: data.descricao || ""
          },
          aluno: {
            id: data.alunoId,
            nome: data.aluno?.nomeCompleto || "",
            // Adicione outros campos de aluno se o backend retornar
          },
          nutricao: {
            estrategia: "Estruturada",
            macros: { p: data.proteinaPercentual || 0, c: data.carboidratoPercentual || 0, g: data.gorduraPercentual || 0 },
            totalCalorico: data.totalCalorico || 0,
            consumoAgua: data.consumoAgua || "",
            regrasGerais: data.regrasGeraisNutricao || "",
            refeicoes: (data.refeicoes || []).map((ref: any) => ({
              nome: ref.nomeRefeicao,
              horario: ref.horarioPrevisto,
              itens: (ref.alimentos || []).map((it: any) => ({
                alimentoId: it.alimento?.id,
                quantidade: it.quantidade,
                unidade: it.unidadeMedida
              }))
            }))
          },
          suplementos: (data.suplementosProtocolo || []).map((s: any) => ({
             suplementoId: s.suplemento?.id,
             dose: s.quantidade,
             horario: s.formaUso,
             objetivo: s.observacoes
          })),
          hormonios: (data.hormoniosProtocolo || []).map((h: any) => ({
             hormonioId: h.hormonio?.id,
             doseSemanal: h.dosagem,
             frequencia: h.frequencia,
             obsAplicacao: h.observacoes
          })),
          treino: {
            estrutura: data.planosTreino?.[0]?.orientacoes || "",
            divisoes: (data.planosTreino || []).map((plano: any) => ({
              letra: plano.nomeDivisao.replace("Treino ", ""),
              exercicios: (plano.exercicios || []).map((ex: any) => ({
                exercicioId: ex.exercicio?.id,
                series: ex.series,
                reps: ex.repeticoes,
                descanso: ex.intervaloDescanso,
                obs: ex.observacoes
              }))
            }))
          }
        }

        setProtocoloFormatado(formatadoParaOForm)
      } catch (error) {
        toast({ title: "Erro", description: "Erro ao carregar dados.", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    carregarProtocolo()
  }, [id, router, toast])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Sincronizando dados...</span>
      </div>
    )
  }

  return (
    <AppLayout menuItems={coachMenuItems}>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Editar Protocolo</h1>
          <p className="text-muted-foreground text-sm">Atualize as informações do planejamento abaixo.</p>
        </header>
        
        <ProtocoloFormWizard 
          isEditing={true} 
          initialData={protocoloFormatado} 
        />
      </div>
    </AppLayout>
  )
}